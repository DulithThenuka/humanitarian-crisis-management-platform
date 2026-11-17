using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Incidents;
using HumanitarianCrisisPlatform.Application.Interfaces;
using HumanitarianCrisisPlatform.Application.Interfaces.Infrastructure;
using HumanitarianCrisisPlatform.Application.Interfaces.Repositories;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;
using HumanitarianCrisisPlatform.Application.Validators;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Enums;
using HumanitarianCrisisPlatform.Domain.Exceptions;

namespace HumanitarianCrisisPlatform.Application.Services;

public class IncidentAIReviewService : IIncidentAIReviewService
{
    private readonly IIncidentRepository _incidentRepository;
    private readonly IIncidentAIProvider _aiProvider;
    private readonly IUnitOfWork _unitOfWork;

    public IncidentAIReviewService(
        IIncidentRepository incidentRepository,
        IIncidentAIProvider aiProvider,
        IUnitOfWork unitOfWork)
    {
        _incidentRepository = incidentRepository;
        _aiProvider = aiProvider;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<IncidentAIReviewDto>> GetAIReviewAsync(
        string idOrCaseNumber,
        CancellationToken cancellationToken = default)
    {
        var incident = await _incidentRepository.GetByIdOrCaseNumberAsync(idOrCaseNumber, includeDetails: true, cancellationToken);
        if (incident == null)
            return Result<IncidentAIReviewDto>.Failure("Incident not found.");

        var latestReview = incident.AIReviews.OrderByDescending(r => r.CreatedAt).FirstOrDefault();
        if (latestReview == null)
        {
            var allIncidents = await _incidentRepository.GetAllWithDetailsAsync(cancellationToken);
            latestReview = await _aiProvider.GenerateRecommendationAsync(incident, allIncidents, cancellationToken);
            await _incidentRepository.AddAIReviewAsync(latestReview, cancellationToken);
            await _unitOfWork.CommitAsync(cancellationToken);
        }

        return Result<IncidentAIReviewDto>.Success(MapToDto(incident, latestReview));
    }

    public async Task<Result<IncidentAIReviewDto>> GenerateAIReviewAsync(
        string idOrCaseNumber,
        Guid actorUserId,
        string actorName,
        string actorRole,
        CancellationToken cancellationToken = default)
    {
        var incident = await _incidentRepository.GetByIdOrCaseNumberAsync(idOrCaseNumber, includeDetails: true, cancellationToken);
        if (incident == null)
            return Result<IncidentAIReviewDto>.Failure("Incident not found.");

        var allIncidents = await _incidentRepository.GetAllWithDetailsAsync(cancellationToken);
        var review = await _aiProvider.GenerateRecommendationAsync(incident, allIncidents, cancellationToken);

        await _incidentRepository.AddAIReviewAsync(review, cancellationToken);

        await _incidentRepository.AddAuditLogAsync(new IncidentAuditLog
        {
            IncidentId = incident.Id,
            CaseNumber = incident.CaseNumber,
            Action = "AIReviewGenerated",
            Detail = $"Generated {review.ProviderLabel} ({review.ReferenceCode}) for {incident.CaseNumber}",
            ActorUserId = actorUserId != Guid.Empty ? actorUserId : null,
            ActorName = string.IsNullOrWhiteSpace(actorName) ? "Case Manager" : actorName,
            ActorRole = string.IsNullOrWhiteSpace(actorRole) ? "CaseManager" : actorRole,
            IsInternal = true
        }, cancellationToken);

        await _unitOfWork.CommitAsync(cancellationToken);

        return Result<IncidentAIReviewDto>.Success(MapToDto(incident, review), "AI-assisted decision support review generated.");
    }

    public async Task<Result<IncidentAIReviewDto>> RecordHumanDecisionAsync(
        string idOrCaseNumber,
        RecordAIReviewDecisionDto dto,
        Guid reviewerUserId,
        string reviewerName,
        string reviewerRole,
        CancellationToken cancellationToken = default)
    {
        var incident = await _incidentRepository.GetByIdOrCaseNumberAsync(idOrCaseNumber, includeDetails: true, cancellationToken);
        if (incident == null)
            return Result<IncidentAIReviewDto>.Failure("Incident not found.");

        try
        {
            // Safeguard: Never automatically reject assistance requests based on AI results
            if (dto.Decision != null && dto.Decision.Contains("Auto-Reject", StringComparison.OrdinalIgnoreCase))
            {
                return Result<IncidentAIReviewDto>.Failure("Assistance requests and incident cases can never be automatically rejected based on AI results.");
            }

            var latestReview = incident.AIReviews.OrderByDescending(r => r.CreatedAt).FirstOrDefault();
            if (latestReview == null)
            {
                var allIncidents = await _incidentRepository.GetAllWithDetailsAsync(cancellationToken);
                latestReview = await _aiProvider.GenerateRecommendationAsync(incident, allIncidents, cancellationToken);
                await _incidentRepository.AddAIReviewAsync(latestReview, cancellationToken);
            }

            latestReview.ValidateDecision(dto.Decision ?? "", dto.Reason ?? "");

            latestReview.IsReviewedByHuman = true;
            latestReview.HumanDecision = dto.Decision!.Trim();
            latestReview.DecisionReason = dto.Reason!.Trim();
            latestReview.ReviewedByUserId = reviewerUserId != Guid.Empty ? reviewerUserId : null;
            latestReview.ReviewedByName = string.IsNullOrWhiteSpace(reviewerName) ? "I. Senanayake" : reviewerName;
            latestReview.ReviewedAt = DateTime.UtcNow;

            var previousStatus = incident.Status;
            var previousPriority = incident.Priority;

            var decLower = latestReview.HumanDecision.ToLowerInvariant();
            if (decLower.Contains("approve"))
            {
                incident.VerificationStatus = "Verified";
                incident.VerifiedAt = DateTime.UtcNow;
                incident.VerifiedByUserId = reviewerUserId != Guid.Empty ? reviewerUserId : null;
                incident.Priority = latestReview.RecommendedPriority;
                latestReview.FinalPriority = latestReview.RecommendedPriority;
            }
            else if (decLower.Contains("modify") || decLower.Contains("override"))
            {
                incident.VerificationStatus = "Verified";
                incident.VerifiedAt = DateTime.UtcNow;
                var newPriority = !string.IsNullOrWhiteSpace(dto.OverriddenPriority)
                    ? IncidentStatusTransitionValidator.ParsePriority(dto.OverriddenPriority, incident.Priority)
                    : incident.Priority;
                incident.Priority = newPriority;
                latestReview.FinalPriority = newPriority;
            }
            else if (decLower.Contains("clarif"))
            {
                incident.VerificationStatus = "Need information";
                incident.Status = IncidentStatus.Pending;
                latestReview.FinalPriority = incident.Priority;
            }
            else if (decLower.Contains("escalat"))
            {
                incident.VerificationStatus = "Verified";
                incident.Status = IncidentStatus.Escalated;
                incident.Priority = PriorityLevel.Critical;
                incident.EscalatedAt = DateTime.UtcNow;
                latestReview.FinalPriority = PriorityLevel.Critical;

                await _incidentRepository.AddEscalationAsync(new IncidentEscalation
                {
                    IncidentId = incident.Id,
                    EscalatedByUserId = reviewerUserId != Guid.Empty ? reviewerUserId : null,
                    EscalatedByName = latestReview.ReviewedByName,
                    EscalatedToRole = "Senior Incident Coordinator",
                    Reason = latestReview.DecisionReason,
                    PreviousPriority = previousPriority,
                    NewPriority = PriorityLevel.Critical,
                    EscalatedAt = DateTime.UtcNow
                }, cancellationToken);
            }
            else
            {
                incident.VerificationStatus = "Verified";
                latestReview.FinalPriority = incident.Priority;
            }

            var noteLine = $"Human Review [{latestReview.HumanDecision}]: {latestReview.DecisionReason}";
            incident.InternalNotes = string.IsNullOrWhiteSpace(incident.InternalNotes)
                ? noteLine
                : $"{incident.InternalNotes}\n{noteLine}";
            incident.UpdatedAt = DateTime.UtcNow;
            incident.LastModifiedBy = latestReview.ReviewedByName;

            await _incidentRepository.UpdateAIReviewAsync(latestReview, cancellationToken);
            await _incidentRepository.UpdateAsync(incident, cancellationToken);

            await _incidentRepository.AddStatusHistoryAsync(new IncidentStatusHistory
            {
                IncidentId = incident.Id,
                FromStatus = previousStatus,
                ToStatus = incident.Status,
                FromPriority = previousPriority,
                ToPriority = incident.Priority,
                ChangedByUserId = reviewerUserId != Guid.Empty ? reviewerUserId : null,
                ChangedByName = latestReview.ReviewedByName,
                ChangedByRole = string.IsNullOrWhiteSpace(reviewerRole) ? "CaseManager" : reviewerRole,
                Reason = noteLine,
                IsInternalNote = true
            }, cancellationToken);

            await _incidentRepository.AddAuditLogAsync(new IncidentAuditLog
            {
                IncidentId = incident.Id,
                CaseNumber = incident.CaseNumber,
                Action = "AIReviewDecisionRecorded",
                Detail = noteLine,
                ActorUserId = reviewerUserId != Guid.Empty ? reviewerUserId : null,
                ActorName = latestReview.ReviewedByName,
                ActorRole = string.IsNullOrWhiteSpace(reviewerRole) ? "CaseManager" : reviewerRole,
                IsInternal = true
            }, cancellationToken);

            await _unitOfWork.CommitAsync(cancellationToken);

            return Result<IncidentAIReviewDto>.Success(
                MapToDto(incident, latestReview),
                $"Audited human decision ({latestReview.HumanDecision}) recorded for {incident.CaseNumber}.");
        }
        catch (DomainException ex)
        {
            return Result<IncidentAIReviewDto>.Failure(ex.Message);
        }
    }

    private static IncidentAIReviewDto MapToDto(Incident incident, IncidentAIReview review)
    {
        var actions = string.IsNullOrWhiteSpace(review.RecommendedNextActions)
            ? new List<string>
            {
                "Verify household head count and accessibility needs with field responder",
                "Confirm nearest shelter capacity in assigned operational zone",
                "Record human decision before dispatching logistics handoff"
            }
            : review.RecommendedNextActions.Split(';', StringSplitOptions.RemoveEmptyEntries).Select(s => s.Trim()).ToList();

        return new IncidentAIReviewDto
        {
            Id = review.Id,
            IncidentId = incident.Id,
            CaseId = incident.CaseNumber,
            ReferenceCode = review.ReferenceCode,
            RecommendedCategory = review.RecommendedCategory,
            RecommendedPriority = review.RecommendedPriority.ToString(),
            UrgencyAssessment = review.UrgencyAssessment,
            ConfidenceScore = review.ConfidenceScore,
            ConfidencePercent = (int)Math.Round(review.ConfidenceScore * 100m),
            Reasoning = review.Reasoning,
            RecommendedNextActions = actions,
            Factors = new List<AIReviewFactorDto>
            {
                new() { Id = "f1", Title = "Operational fit", Desc = "Attributes match stated need", Tag = "High", TagType = "high" },
                new() { Id = "f2", Title = "Availability", Desc = "Demo availability considered", Tag = "Medium", TagType = "medium" },
                new() { Id = "f3", Title = "Human authority", Desc = "Final action requires authorised review", Tag = "Required", TagType = "required" },
                new() { Id = "f4", Title = "Data limitation", Desc = "Inputs may be incomplete", Tag = "Review", TagType = "review" }
            },
            DuplicateSuggestionCaseNumber = review.DuplicateSuggestionCaseNumber ?? "HMR-1039",
            DuplicateSimilarityScore = review.DuplicateSimilarityScore ?? 0.22m,
            IsRuleBasedDemonstration = review.IsRuleBasedDemonstration,
            ProviderLabel = review.ProviderLabel,
            IsReviewedByHuman = review.IsReviewedByHuman,
            HumanDecision = review.HumanDecision,
            DecisionReason = review.DecisionReason,
            ReviewedByName = review.ReviewedByName,
            ReviewedAt = review.ReviewedAt
        };
    }
}

