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

public class IncidentService : IIncidentService
{
    private readonly IIncidentRepository _incidentRepository;
    private readonly IIncidentAIProvider _aiProvider;
    private readonly IUnitOfWork _unitOfWork;

    public IncidentService(
        IIncidentRepository incidentRepository,
        IIncidentAIProvider aiProvider,
        IUnitOfWork unitOfWork)
    {
        _incidentRepository = incidentRepository;
        _aiProvider = aiProvider;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<IReadOnlyList<IncidentResponseDto>>> GetAllAsync(
        string? status = null,
        string? operationalArea = null,
        string? priority = null,
        string? search = null,
        Guid? currentUserId = null,
        string? currentUserRole = null,
        CancellationToken cancellationToken = default)
    {
        var isCitizen = IncidentMapper.IsCitizenRole(currentUserRole);
        IReadOnlyList<Incident> incidents;

        if (isCitizen)
        {
            if (!currentUserId.HasValue || currentUserId == Guid.Empty)
                return Result<IReadOnlyList<IncidentResponseDto>>.Failure("Authenticated citizen identity is required.");

            incidents = await _incidentRepository.GetByCitizenIdAsync(currentUserId.Value, cancellationToken);
        }
        else
        {
            incidents = await _incidentRepository.GetAllWithDetailsAsync(cancellationToken);
        }

        var query = incidents.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(status) && !status.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            var parsedStatus = IncidentStatusTransitionValidator.ParseStatus(status);
            query = query.Where(i => i.Status == parsedStatus ||
                                     IncidentMapper.FormatStatusDisplay(i.Status).Equals(status, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(operationalArea) && !operationalArea.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(i => i.OperationalArea.Equals(operationalArea, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(priority) && !priority.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            var parsedPriority = IncidentStatusTransitionValidator.ParsePriority(priority);
            query = query.Where(i => i.Priority == parsedPriority);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var q = search.Trim().ToLowerInvariant();
            query = query.Where(i =>
                i.CaseNumber.ToLowerInvariant().Contains(q) ||
                i.CategoryDisplay.ToLowerInvariant().Contains(q) ||
                i.OperationalArea.ToLowerInvariant().Contains(q) ||
                (i.AssignedStaffName != null && i.AssignedStaffName.ToLowerInvariant().Contains(q)) ||
                i.Description.ToLowerInvariant().Contains(q));
        }

        var dtos = query
            .Select(i => IncidentMapper.ToDto(i, redactForCitizen: isCitizen))
            .ToList();

        return Result<IReadOnlyList<IncidentResponseDto>>.Success(dtos);
    }

    public async Task<Result<IncidentResponseDto>> GetByIdAsync(
        string idOrCaseNumber,
        Guid? currentUserId = null,
        string? currentUserRole = null,
        CancellationToken cancellationToken = default)
    {
        var incident = await _incidentRepository.GetByIdOrCaseNumberAsync(idOrCaseNumber, includeDetails: true, cancellationToken);
        if (incident == null)
            return Result<IncidentResponseDto>.Failure("Incident not found.");

        var isCitizen = IncidentMapper.IsCitizenRole(currentUserRole);
        if (isCitizen && incident.CitizenId != currentUserId)
            return Result<IncidentResponseDto>.Failure("FORBIDDEN: Citizens may only access their own incident requests.");

        return Result<IncidentResponseDto>.Success(IncidentMapper.ToDto(incident, redactForCitizen: isCitizen));
    }

    public async Task<Result<IncidentResponseDto>> CreateAsync(
        CreateIncidentDto dto,
        Guid actorUserId,
        string actorName,
        string actorRole,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var caseNumber = !string.IsNullOrWhiteSpace(dto.CaseNumber)
                ? dto.CaseNumber.Trim()
                : await _incidentRepository.GenerateNextCaseNumberAsync(cancellationToken);

            var categoryEnum = Incident.ParseCategory(dto.Category);
            var categoryDisplay = Incident.FormatCategoryDisplay(categoryEnum, dto.Category);
            var priority = IncidentStatusTransitionValidator.ParsePriority(dto.Priority, PriorityLevel.Medium);
            var description = !string.IsNullOrWhiteSpace(dto.CitizenQuote)
                ? dto.CitizenQuote.Trim()
                : (!string.IsNullOrWhiteSpace(dto.Description)
                    ? dto.Description.Trim()
                    : "New prototype record submitted via Case Manager workspace.");

            var isCitizen = IncidentMapper.IsCitizenRole(actorRole);
            var citizenId = dto.CitizenId ?? (isCitizen && actorUserId != Guid.Empty ? actorUserId : null);

            var incident = new Incident
            {
                Id = Guid.NewGuid(),
                CaseNumber = caseNumber,
                Title = !string.IsNullOrWhiteSpace(dto.Title) ? dto.Title.Trim() : $"{categoryDisplay} Request",
                Category = categoryEnum,
                CategoryDisplay = categoryDisplay,
                OperationalArea = string.IsNullOrWhiteSpace(dto.OperationalArea) ? "Kelani East - Zone 03" : dto.OperationalArea.Trim(),
                Priority = priority,
                Status = !string.IsNullOrWhiteSpace(dto.AssignedStaff) || dto.AssignedToUserId.HasValue
                    ? IncidentStatus.Open
                    : IncidentStatus.Open,
                VerificationStatus = "Awaiting review",
                Description = description,
                AffectedPeople = dto.AffectedPeople > 0 ? dto.AffectedPeople : 4,
                CurrentSafety = string.IsNullOrWhiteSpace(dto.CurrentSafety) ? "Reported safe location" : dto.CurrentSafety.Trim(),
                AccessibilityNeeds = string.IsNullOrWhiteSpace(dto.Accessibility) ? "None specified" : dto.Accessibility.Trim(),
                Address = dto.Address,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                ContactPhone = dto.ContactPhone,
                CitizenId = citizenId,
                AssistanceRequestId = dto.AssistanceRequestId,
                CrisisEventId = dto.CrisisEventId,
                AssignedToUserId = dto.AssignedToUserId,
                AssignedStaffName = string.IsNullOrWhiteSpace(dto.AssignedStaff) ? "I. Senanayake" : dto.AssignedStaff.Trim(),
                CreatedBy = string.IsNullOrWhiteSpace(actorName) ? "System" : actorName
            };

            incident.Validate();

            await _incidentRepository.AddAsync(incident, cancellationToken);

            if (!string.IsNullOrWhiteSpace(incident.AssignedStaffName) || incident.AssignedToUserId.HasValue)
            {
                await _incidentRepository.AddAssignmentAsync(new IncidentAssignment
                {
                    IncidentId = incident.Id,
                    AssigneeUserId = incident.AssignedToUserId,
                    AssigneeName = incident.AssignedStaffName ?? "Assigned Staff",
                    AssignedByUserId = actorUserId != Guid.Empty ? actorUserId : null,
                    AssignedByName = string.IsNullOrWhiteSpace(actorName) ? "System" : actorName,
                    OperationalArea = incident.OperationalArea,
                    Reason = "Initial assignment on incident creation",
                    IsActive = true
                }, cancellationToken);
            }

            await _incidentRepository.AddStatusHistoryAsync(new IncidentStatusHistory
            {
                IncidentId = incident.Id,
                FromStatus = IncidentStatus.Open,
                ToStatus = incident.Status,
                FromPriority = null,
                ToPriority = incident.Priority,
                ChangedByUserId = actorUserId != Guid.Empty ? actorUserId : null,
                ChangedByName = string.IsNullOrWhiteSpace(actorName) ? "System" : actorName,
                ChangedByRole = string.IsNullOrWhiteSpace(actorRole) ? "CaseManager" : actorRole,
                Reason = "Incident case created and queued for operational review."
            }, cancellationToken);

            await _incidentRepository.AddAuditLogAsync(new IncidentAuditLog
            {
                IncidentId = incident.Id,
                CaseNumber = incident.CaseNumber,
                Action = "IncidentCreated",
                Detail = $"Incident {incident.CaseNumber} ({incident.CategoryDisplay}) created in {incident.OperationalArea}",
                ActorUserId = actorUserId != Guid.Empty ? actorUserId : null,
                ActorName = string.IsNullOrWhiteSpace(actorName) ? "System" : actorName,
                ActorRole = string.IsNullOrWhiteSpace(actorRole) ? "CaseManager" : actorRole,
                IsInternal = true
            }, cancellationToken);

            // Generate initial rule-based AI decision support recommendation (never auto-rejects)
            var existing = await _incidentRepository.GetAllWithDetailsAsync(cancellationToken);
            var aiReview = await _aiProvider.GenerateRecommendationAsync(incident, existing, cancellationToken);
            await _incidentRepository.AddAIReviewAsync(aiReview, cancellationToken);

            await _unitOfWork.CommitAsync(cancellationToken);

            return Result<IncidentResponseDto>.Success(
                IncidentMapper.ToDto(incident, redactForCitizen: isCitizen),
                $"Incident {incident.CaseNumber} created successfully.");
        }
        catch (DomainException ex)
        {
            return Result<IncidentResponseDto>.Failure(ex.Message);
        }
    }

    public async Task<Result<IncidentResponseDto>> UpdateAsync(
        string idOrCaseNumber,
        UpdateIncidentDto dto,
        Guid actorUserId,
        string actorName,
        string actorRole,
        CancellationToken cancellationToken = default)
    {
        var incident = await _incidentRepository.GetByIdOrCaseNumberAsync(idOrCaseNumber, includeDetails: true, cancellationToken);
        if (incident == null)
            return Result<IncidentResponseDto>.Failure("Incident not found.");

        var previousStatus = incident.Status;
        var previousPriority = incident.Priority;

        if (!string.IsNullOrWhiteSpace(dto.Title)) incident.Title = dto.Title.Trim();
        if (!string.IsNullOrWhiteSpace(dto.Category))
        {
            incident.Category = Incident.ParseCategory(dto.Category);
            incident.CategoryDisplay = Incident.FormatCategoryDisplay(incident.Category, dto.Category);
        }
        if (!string.IsNullOrWhiteSpace(dto.OperationalArea)) incident.OperationalArea = dto.OperationalArea.Trim();
        if (!string.IsNullOrWhiteSpace(dto.Priority))
            incident.Priority = IncidentStatusTransitionValidator.ParsePriority(dto.Priority, incident.Priority);
        if (!string.IsNullOrWhiteSpace(dto.Status))
            incident.Status = IncidentStatusTransitionValidator.ParseStatus(dto.Status, incident.Status);
        if (!string.IsNullOrWhiteSpace(dto.Verification))
            incident.VerificationStatus = dto.Verification.Trim();
        if (!string.IsNullOrWhiteSpace(dto.CitizenQuote))
            incident.Description = dto.CitizenQuote.Trim();
        else if (!string.IsNullOrWhiteSpace(dto.Description))
            incident.Description = dto.Description.Trim();
        if (!string.IsNullOrWhiteSpace(dto.AssignedStaff))
            incident.AssignedStaffName = dto.AssignedStaff.Trim();
        if (dto.AssignedToUserId.HasValue)
            incident.AssignedToUserId = dto.AssignedToUserId;
        if (dto.AffectedPeople.HasValue && dto.AffectedPeople.Value > 0)
            incident.AffectedPeople = dto.AffectedPeople.Value;
        if (!string.IsNullOrWhiteSpace(dto.CurrentSafety))
            incident.CurrentSafety = dto.CurrentSafety.Trim();
        if (!string.IsNullOrWhiteSpace(dto.Accessibility))
            incident.AccessibilityNeeds = dto.Accessibility.Trim();
        if (dto.Address != null) incident.Address = dto.Address;
        if (dto.Latitude.HasValue) incident.Latitude = dto.Latitude;
        if (dto.Longitude.HasValue) incident.Longitude = dto.Longitude;
        if (dto.ContactPhone != null) incident.ContactPhone = dto.ContactPhone;

        if (!string.IsNullOrWhiteSpace(dto.Note))
        {
            incident.InternalNotes = string.IsNullOrWhiteSpace(incident.InternalNotes)
                ? dto.Note.Trim()
                : $"{incident.InternalNotes}\n{dto.Note.Trim()}";
        }

        incident.UpdatedAt = DateTime.UtcNow;
        incident.LastModifiedBy = actorName;

        try
        {
            incident.Validate();
        }
        catch (DomainException ex)
        {
            return Result<IncidentResponseDto>.Failure(ex.Message);
        }

        await _incidentRepository.UpdateAsync(incident, cancellationToken);

        var reason = !string.IsNullOrWhiteSpace(dto.Note)
            ? dto.Note.Trim()
            : "Incident details updated by authorised staff.";

        if (previousStatus != incident.Status || previousPriority != incident.Priority || !string.IsNullOrWhiteSpace(dto.Note))
        {
            await _incidentRepository.AddStatusHistoryAsync(new IncidentStatusHistory
            {
                IncidentId = incident.Id,
                FromStatus = previousStatus,
                ToStatus = incident.Status,
                FromPriority = previousPriority,
                ToPriority = incident.Priority,
                ChangedByUserId = actorUserId != Guid.Empty ? actorUserId : null,
                ChangedByName = string.IsNullOrWhiteSpace(actorName) ? "Case Manager" : actorName,
                ChangedByRole = string.IsNullOrWhiteSpace(actorRole) ? "CaseManager" : actorRole,
                Reason = reason,
                IsInternalNote = true
            }, cancellationToken);
        }

        await _incidentRepository.AddAuditLogAsync(new IncidentAuditLog
        {
            IncidentId = incident.Id,
            CaseNumber = incident.CaseNumber,
            Action = "IncidentUpdated",
            Detail = reason,
            ActorUserId = actorUserId != Guid.Empty ? actorUserId : null,
            ActorName = string.IsNullOrWhiteSpace(actorName) ? "Case Manager" : actorName,
            ActorRole = string.IsNullOrWhiteSpace(actorRole) ? "CaseManager" : actorRole,
            IsInternal = true
        }, cancellationToken);

        await _unitOfWork.CommitAsync(cancellationToken);
        return Result<IncidentResponseDto>.Success(IncidentMapper.ToDto(incident), "Incident updated successfully.");
    }

    public async Task<Result<IncidentResponseDto>> UpdateStatusAsync(
        string idOrCaseNumber,
        UpdateIncidentStatusDto dto,
        Guid actorUserId,
        string actorName,
        string actorRole,
        CancellationToken cancellationToken = default)
    {
        var incident = await _incidentRepository.GetByIdOrCaseNumberAsync(idOrCaseNumber, includeDetails: true, cancellationToken);
        if (incident == null)
            return Result<IncidentResponseDto>.Failure("Incident not found.");

        var targetStatus = IncidentStatusTransitionValidator.ParseStatus(dto.Status, incident.Status);
        var validation = IncidentStatusTransitionValidator.ValidateTransition(incident.Status, targetStatus, dto.Reason);
        if (!validation.Succeeded)
            return Result<IncidentResponseDto>.Failure(validation.Errors);

        var previousStatus = incident.Status;
        incident.Status = targetStatus;
        if (!string.IsNullOrWhiteSpace(dto.Verification))
            incident.VerificationStatus = dto.Verification.Trim();

        if (targetStatus == IncidentStatus.Resolved) incident.ResolvedAt = DateTime.UtcNow;
        if (targetStatus == IncidentStatus.Closed) incident.ClosedAt = DateTime.UtcNow;
        if (targetStatus == IncidentStatus.Escalated) incident.EscalatedAt = DateTime.UtcNow;
        incident.UpdatedAt = DateTime.UtcNow;
        incident.LastModifiedBy = actorName;

        await _incidentRepository.UpdateAsync(incident, cancellationToken);

        await _incidentRepository.AddStatusHistoryAsync(new IncidentStatusHistory
        {
            IncidentId = incident.Id,
            FromStatus = previousStatus,
            ToStatus = targetStatus,
            FromPriority = incident.Priority,
            ToPriority = incident.Priority,
            ChangedByUserId = actorUserId != Guid.Empty ? actorUserId : null,
            ChangedByName = string.IsNullOrWhiteSpace(actorName) ? "Case Manager" : actorName,
            ChangedByRole = string.IsNullOrWhiteSpace(actorRole) ? "CaseManager" : actorRole,
            Reason = dto.Reason.Trim()
        }, cancellationToken);

        await _incidentRepository.AddAuditLogAsync(new IncidentAuditLog
        {
            IncidentId = incident.Id,
            CaseNumber = incident.CaseNumber,
            Action = "StatusUpdated",
            Detail = $"Status updated from {previousStatus} to {targetStatus}: {dto.Reason.Trim()}",
            ActorUserId = actorUserId != Guid.Empty ? actorUserId : null,
            ActorName = string.IsNullOrWhiteSpace(actorName) ? "Case Manager" : actorName,
            ActorRole = string.IsNullOrWhiteSpace(actorRole) ? "CaseManager" : actorRole,
            IsInternal = true
        }, cancellationToken);

        await _unitOfWork.CommitAsync(cancellationToken);
        return Result<IncidentResponseDto>.Success(IncidentMapper.ToDto(incident), $"Status updated to {targetStatus}.");
    }

    public async Task<Result<IncidentResponseDto>> UpdatePriorityAsync(
        string idOrCaseNumber,
        UpdateIncidentPriorityDto dto,
        Guid actorUserId,
        string actorName,
        string actorRole,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.Reason))
            return Result<IncidentResponseDto>.Failure("A reason is required to change incident priority.");

        var incident = await _incidentRepository.GetByIdOrCaseNumberAsync(idOrCaseNumber, includeDetails: true, cancellationToken);
        if (incident == null)
            return Result<IncidentResponseDto>.Failure("Incident not found.");

        var previousPriority = incident.Priority;
        var newPriority = IncidentStatusTransitionValidator.ParsePriority(dto.Priority, incident.Priority);
        incident.Priority = newPriority;
        incident.UpdatedAt = DateTime.UtcNow;
        incident.LastModifiedBy = actorName;

        await _incidentRepository.UpdateAsync(incident, cancellationToken);

        await _incidentRepository.AddStatusHistoryAsync(new IncidentStatusHistory
        {
            IncidentId = incident.Id,
            FromStatus = incident.Status,
            ToStatus = incident.Status,
            FromPriority = previousPriority,
            ToPriority = newPriority,
            ChangedByUserId = actorUserId != Guid.Empty ? actorUserId : null,
            ChangedByName = string.IsNullOrWhiteSpace(actorName) ? "Case Manager" : actorName,
            ChangedByRole = string.IsNullOrWhiteSpace(actorRole) ? "CaseManager" : actorRole,
            Reason = dto.Reason.Trim()
        }, cancellationToken);

        await _incidentRepository.AddAuditLogAsync(new IncidentAuditLog
        {
            IncidentId = incident.Id,
            CaseNumber = incident.CaseNumber,
            Action = "PriorityUpdated",
            Detail = $"Priority updated from {previousPriority} to {newPriority}: {dto.Reason.Trim()}",
            ActorUserId = actorUserId != Guid.Empty ? actorUserId : null,
            ActorName = string.IsNullOrWhiteSpace(actorName) ? "Case Manager" : actorName,
            ActorRole = string.IsNullOrWhiteSpace(actorRole) ? "CaseManager" : actorRole,
            IsInternal = true
        }, cancellationToken);

        await _unitOfWork.CommitAsync(cancellationToken);
        return Result<IncidentResponseDto>.Success(IncidentMapper.ToDto(incident), $"Priority updated to {newPriority}.");
    }

    public async Task<Result<IncidentResponseDto>> VerifyAsync(
        string idOrCaseNumber,
        VerifyIncidentDto dto,
        Guid actorUserId,
        string actorName,
        string actorRole,
        CancellationToken cancellationToken = default)
    {
        var incident = await _incidentRepository.GetByIdOrCaseNumberAsync(idOrCaseNumber, includeDetails: true, cancellationToken);
        if (incident == null)
            return Result<IncidentResponseDto>.Failure("Incident not found.");

        var previousStatus = incident.Status;
        var verStatus = string.IsNullOrWhiteSpace(dto.VerificationStatus) ? "Verified" : dto.VerificationStatus.Trim();
        incident.VerificationStatus = verStatus;

        if (verStatus.Contains("Need", StringComparison.OrdinalIgnoreCase) ||
            verStatus.Contains("Clarif", StringComparison.OrdinalIgnoreCase))
        {
            incident.Status = IncidentStatus.Pending;
        }
        else
        {
            incident.VerifiedAt = DateTime.UtcNow;
            incident.VerifiedByUserId = actorUserId != Guid.Empty ? actorUserId : null;
            if (incident.Status == IncidentStatus.Open || incident.Status == IncidentStatus.Pending)
            {
                incident.Status = IncidentStatus.Assigned;
            }
        }

        incident.UpdatedAt = DateTime.UtcNow;
        incident.LastModifiedBy = actorName;

        var reason = string.IsNullOrWhiteSpace(dto.Reason)
            ? $"Verification set to '{verStatus}'."
            : dto.Reason.Trim();

        await _incidentRepository.UpdateAsync(incident, cancellationToken);

        await _incidentRepository.AddStatusHistoryAsync(new IncidentStatusHistory
        {
            IncidentId = incident.Id,
            FromStatus = previousStatus,
            ToStatus = incident.Status,
            FromPriority = incident.Priority,
            ToPriority = incident.Priority,
            ChangedByUserId = actorUserId != Guid.Empty ? actorUserId : null,
            ChangedByName = string.IsNullOrWhiteSpace(actorName) ? "Case Manager" : actorName,
            ChangedByRole = string.IsNullOrWhiteSpace(actorRole) ? "CaseManager" : actorRole,
            Reason = reason
        }, cancellationToken);

        await _incidentRepository.AddAuditLogAsync(new IncidentAuditLog
        {
            IncidentId = incident.Id,
            CaseNumber = incident.CaseNumber,
            Action = "IncidentVerified",
            Detail = $"{verStatus}: {reason}",
            ActorUserId = actorUserId != Guid.Empty ? actorUserId : null,
            ActorName = string.IsNullOrWhiteSpace(actorName) ? "Case Manager" : actorName,
            ActorRole = string.IsNullOrWhiteSpace(actorRole) ? "CaseManager" : actorRole,
            IsInternal = true
        }, cancellationToken);

        await _unitOfWork.CommitAsync(cancellationToken);
        return Result<IncidentResponseDto>.Success(IncidentMapper.ToDto(incident), $"Incident verification updated to '{verStatus}'.");
    }

    public async Task<Result<IncidentResponseDto>> EscalateAsync(
        string idOrCaseNumber,
        EscalateIncidentDto dto,
        Guid actorUserId,
        string actorName,
        string actorRole,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.Reason))
            return Result<IncidentResponseDto>.Failure("An escalation reason is required.");

        var incident = await _incidentRepository.GetByIdOrCaseNumberAsync(idOrCaseNumber, includeDetails: true, cancellationToken);
        if (incident == null)
            return Result<IncidentResponseDto>.Failure("Incident not found.");

        var previousStatus = incident.Status;
        var previousPriority = incident.Priority;
        var newPriority = IncidentStatusTransitionValidator.ParsePriority(dto.TargetPriority, PriorityLevel.Critical);

        incident.Status = IncidentStatus.Escalated;
        incident.Priority = newPriority;
        incident.EscalatedAt = DateTime.UtcNow;
        incident.UpdatedAt = DateTime.UtcNow;
        incident.LastModifiedBy = actorName;

        var escalation = new IncidentEscalation
        {
            IncidentId = incident.Id,
            EscalatedByUserId = actorUserId != Guid.Empty ? actorUserId : null,
            EscalatedByName = string.IsNullOrWhiteSpace(actorName) ? "Case Manager" : actorName,
            EscalatedToRole = string.IsNullOrWhiteSpace(dto.EscalatedToRole) ? "Emergency Coordinator" : dto.EscalatedToRole.Trim(),
            EscalatedToUserId = dto.EscalatedToUserId,
            Reason = dto.Reason.Trim(),
            PreviousPriority = previousPriority,
            NewPriority = newPriority,
            EscalatedAt = DateTime.UtcNow
        };
        escalation.Validate();

        await _incidentRepository.UpdateAsync(incident, cancellationToken);
        await _incidentRepository.AddEscalationAsync(escalation, cancellationToken);

        await _incidentRepository.AddStatusHistoryAsync(new IncidentStatusHistory
        {
            IncidentId = incident.Id,
            FromStatus = previousStatus,
            ToStatus = IncidentStatus.Escalated,
            FromPriority = previousPriority,
            ToPriority = newPriority,
            ChangedByUserId = actorUserId != Guid.Empty ? actorUserId : null,
            ChangedByName = string.IsNullOrWhiteSpace(actorName) ? "Case Manager" : actorName,
            ChangedByRole = string.IsNullOrWhiteSpace(actorRole) ? "CaseManager" : actorRole,
            Reason = dto.Reason.Trim()
        }, cancellationToken);

        await _incidentRepository.AddAuditLogAsync(new IncidentAuditLog
        {
            IncidentId = incident.Id,
            CaseNumber = incident.CaseNumber,
            Action = "IncidentEscalated",
            Detail = $"Escalated to {escalation.EscalatedToRole}: {dto.Reason.Trim()}",
            ActorUserId = actorUserId != Guid.Empty ? actorUserId : null,
            ActorName = string.IsNullOrWhiteSpace(actorName) ? "Case Manager" : actorName,
            ActorRole = string.IsNullOrWhiteSpace(actorRole) ? "CaseManager" : actorRole,
            IsInternal = true
        }, cancellationToken);

        await _unitOfWork.CommitAsync(cancellationToken);
        return Result<IncidentResponseDto>.Success(IncidentMapper.ToDto(incident), $"Incident {incident.CaseNumber} escalated.");
    }

    public async Task<Result<IncidentResponseDto>> ResolveAsync(
        string idOrCaseNumber,
        ResolveIncidentDto dto,
        Guid actorUserId,
        string actorName,
        string actorRole,
        CancellationToken cancellationToken = default)
    {
        var incident = await _incidentRepository.GetByIdOrCaseNumberAsync(idOrCaseNumber, includeDetails: true, cancellationToken);
        if (incident == null)
            return Result<IncidentResponseDto>.Failure("Incident not found.");

        var reason = !string.IsNullOrWhiteSpace(dto.Reason) ? dto.Reason.Trim() : dto.ResolutionNotes.Trim();
        var validation = IncidentStatusTransitionValidator.ValidateTransition(incident.Status, IncidentStatus.Resolved, reason);
        if (!validation.Succeeded)
            return Result<IncidentResponseDto>.Failure(validation.Errors);

        var previousStatus = incident.Status;
        incident.Status = IncidentStatus.Resolved;
        incident.ResolvedAt = DateTime.UtcNow;
        incident.ResolutionNotes = dto.ResolutionNotes;
        incident.UpdatedAt = DateTime.UtcNow;
        incident.LastModifiedBy = actorName;

        await _incidentRepository.UpdateAsync(incident, cancellationToken);

        await _incidentRepository.AddStatusHistoryAsync(new IncidentStatusHistory
        {
            IncidentId = incident.Id,
            FromStatus = previousStatus,
            ToStatus = IncidentStatus.Resolved,
            FromPriority = incident.Priority,
            ToPriority = incident.Priority,
            ChangedByUserId = actorUserId != Guid.Empty ? actorUserId : null,
            ChangedByName = string.IsNullOrWhiteSpace(actorName) ? "Case Manager" : actorName,
            ChangedByRole = string.IsNullOrWhiteSpace(actorRole) ? "CaseManager" : actorRole,
            Reason = reason
        }, cancellationToken);

        await _incidentRepository.AddAuditLogAsync(new IncidentAuditLog
        {
            IncidentId = incident.Id,
            CaseNumber = incident.CaseNumber,
            Action = "IncidentResolved",
            Detail = $"Resolved: {reason}",
            ActorUserId = actorUserId != Guid.Empty ? actorUserId : null,
            ActorName = string.IsNullOrWhiteSpace(actorName) ? "Case Manager" : actorName,
            ActorRole = string.IsNullOrWhiteSpace(actorRole) ? "CaseManager" : actorRole,
            IsInternal = true
        }, cancellationToken);

        await _unitOfWork.CommitAsync(cancellationToken);
        return Result<IncidentResponseDto>.Success(IncidentMapper.ToDto(incident), $"Incident {incident.CaseNumber} resolved.");
    }

    public async Task<Result<IncidentResponseDto>> CloseAsync(
        string idOrCaseNumber,
        CloseIncidentDto dto,
        Guid actorUserId,
        string actorName,
        string actorRole,
        CancellationToken cancellationToken = default)
    {
        var incident = await _incidentRepository.GetByIdOrCaseNumberAsync(idOrCaseNumber, includeDetails: true, cancellationToken);
        if (incident == null)
            return Result<IncidentResponseDto>.Failure("Incident not found.");

        if (incident.Status != IncidentStatus.Resolved && incident.Status != IncidentStatus.Escalated && incident.Status != IncidentStatus.Closed)
        {
            // Allow closing if resolved or escalated, or transition through validation
            incident.ResolvedAt ??= DateTime.UtcNow;
        }

        var previousStatus = incident.Status;
        incident.Status = IncidentStatus.Closed;
        incident.ClosedAt = DateTime.UtcNow;
        incident.UpdatedAt = DateTime.UtcNow;
        incident.LastModifiedBy = actorName;

        var reason = string.IsNullOrWhiteSpace(dto.Reason) ? "Case closed after verification." : dto.Reason.Trim();

        await _incidentRepository.UpdateAsync(incident, cancellationToken);

        await _incidentRepository.AddStatusHistoryAsync(new IncidentStatusHistory
        {
            IncidentId = incident.Id,
            FromStatus = previousStatus,
            ToStatus = IncidentStatus.Closed,
            FromPriority = incident.Priority,
            ToPriority = incident.Priority,
            ChangedByUserId = actorUserId != Guid.Empty ? actorUserId : null,
            ChangedByName = string.IsNullOrWhiteSpace(actorName) ? "Case Manager" : actorName,
            ChangedByRole = string.IsNullOrWhiteSpace(actorRole) ? "CaseManager" : actorRole,
            Reason = reason
        }, cancellationToken);

        await _incidentRepository.AddAuditLogAsync(new IncidentAuditLog
        {
            IncidentId = incident.Id,
            CaseNumber = incident.CaseNumber,
            Action = "IncidentClosed",
            Detail = $"Closed: {reason}",
            ActorUserId = actorUserId != Guid.Empty ? actorUserId : null,
            ActorName = string.IsNullOrWhiteSpace(actorName) ? "Case Manager" : actorName,
            ActorRole = string.IsNullOrWhiteSpace(actorRole) ? "CaseManager" : actorRole,
            IsInternal = true
        }, cancellationToken);

        await _unitOfWork.CommitAsync(cancellationToken);
        return Result<IncidentResponseDto>.Success(IncidentMapper.ToDto(incident), $"Incident {incident.CaseNumber} closed.");
    }

    public async Task<Result<IncidentHistoryDto>> GetHistoryAsync(
        string idOrCaseNumber,
        Guid? currentUserId = null,
        string? currentUserRole = null,
        CancellationToken cancellationToken = default)
    {
        var incident = await _incidentRepository.GetByIdOrCaseNumberAsync(idOrCaseNumber, includeDetails: true, cancellationToken);
        if (incident == null)
            return Result<IncidentHistoryDto>.Failure("Incident not found.");

        var isCitizen = IncidentMapper.IsCitizenRole(currentUserRole);
        if (isCitizen && incident.CitizenId != currentUserId)
            return Result<IncidentHistoryDto>.Failure("FORBIDDEN: Citizens may only access history of their own incident requests.");

        var historyDto = new IncidentHistoryDto
        {
            IncidentId = incident.Id,
            CaseNumber = incident.CaseNumber,
            StatusHistory = incident.StatusHistories
                .Where(h => !isCitizen || !h.IsInternalNote)
                .OrderByDescending(h => h.ChangedAt)
                .Select(h => new IncidentStatusHistoryItemDto
                {
                    Id = h.Id,
                    FromStatus = h.FromStatus.ToString(),
                    ToStatus = h.ToStatus.ToString(),
                    FromPriority = h.FromPriority?.ToString(),
                    ToPriority = h.ToPriority?.ToString(),
                    ChangedByName = isCitizen ? "Operations Staff" : h.ChangedByName,
                    ChangedByRole = h.ChangedByRole,
                    Reason = isCitizen ? "Status updated" : h.Reason,
                    ChangedAt = h.ChangedAt
                })
                .ToList(),
            // Internal assignments, escalations, and audit logs are hidden from citizens
            Assignments = isCitizen
                ? new List<IncidentAssignmentItemDto>()
                : incident.Assignments
                    .OrderByDescending(a => a.AssignedAt)
                    .Select(a => new IncidentAssignmentItemDto
                    {
                        Id = a.Id,
                        AssigneeName = a.AssigneeName,
                        AssignedByName = a.AssignedByName,
                        OperationalArea = a.OperationalArea,
                        Reason = a.Reason,
                        AssignedAt = a.AssignedAt,
                        IsActive = a.IsActive
                    })
                    .ToList(),
            Escalations = isCitizen
                ? new List<IncidentEscalationItemDto>()
                : incident.Escalations
                    .OrderByDescending(e => e.EscalatedAt)
                    .Select(e => new IncidentEscalationItemDto
                    {
                        Id = e.Id,
                        EscalatedByName = e.EscalatedByName,
                        EscalatedToRole = e.EscalatedToRole,
                        Reason = e.Reason,
                        PreviousPriority = e.PreviousPriority.ToString(),
                        NewPriority = e.NewPriority.ToString(),
                        EscalatedAt = e.EscalatedAt,
                        IsResolved = e.IsResolved
                    })
                    .ToList(),
            AuditLogs = isCitizen
                ? new List<IncidentAuditLogItemDto>()
                : incident.AuditLogs
                    .OrderByDescending(a => a.Timestamp)
                    .Select(a => new IncidentAuditLogItemDto
                    {
                        Id = a.Id,
                        CaseNumber = a.CaseNumber,
                        Action = a.Action,
                        Detail = a.Detail,
                        ActorName = a.ActorName,
                        ActorRole = a.ActorRole,
                        Timestamp = a.Timestamp
                    })
                    .ToList()
        };

        return Result<IncidentHistoryDto>.Success(historyDto);
    }

    public async Task<Result<IncidentResponseDto>> MergeAsync(
        string idOrCaseNumber,
        MergeIncidentDto dto,
        Guid actorUserId,
        string actorName,
        string actorRole,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.TargetIncidentIdOrCaseNumber))
            return Result<IncidentResponseDto>.Failure("Target incident ID or case number is required for merging.");

        var sourceIncident = await _incidentRepository.GetByIdOrCaseNumberAsync(idOrCaseNumber, includeDetails: true, cancellationToken);
        if (sourceIncident == null)
            return Result<IncidentResponseDto>.Failure("Source incident not found.");

        var targetIncident = await _incidentRepository.GetByIdOrCaseNumberAsync(dto.TargetIncidentIdOrCaseNumber, includeDetails: true, cancellationToken);
        if (targetIncident == null)
            return Result<IncidentResponseDto>.Failure("Target incident not found.");

        if (sourceIncident.Id == targetIncident.Id)
            return Result<IncidentResponseDto>.Failure("An incident cannot be merged into itself.");

        var previousStatus = sourceIncident.Status;
        sourceIncident.IsDuplicate = true;
        sourceIncident.MergedIntoIncidentId = targetIncident.Id;
        sourceIncident.Status = IncidentStatus.Merged;
        sourceIncident.UpdatedAt = DateTime.UtcNow;
        sourceIncident.LastModifiedBy = actorName;

        var reason = string.IsNullOrWhiteSpace(dto.Reason)
            ? $"Merged into primary case {targetIncident.CaseNumber}."
            : dto.Reason.Trim();

        await _incidentRepository.UpdateAsync(sourceIncident, cancellationToken);

        await _incidentRepository.AddStatusHistoryAsync(new IncidentStatusHistory
        {
            IncidentId = sourceIncident.Id,
            FromStatus = previousStatus,
            ToStatus = IncidentStatus.Merged,
            FromPriority = sourceIncident.Priority,
            ToPriority = sourceIncident.Priority,
            ChangedByUserId = actorUserId != Guid.Empty ? actorUserId : null,
            ChangedByName = string.IsNullOrWhiteSpace(actorName) ? "Case Manager" : actorName,
            ChangedByRole = string.IsNullOrWhiteSpace(actorRole) ? "CaseManager" : actorRole,
            Reason = reason,
            IsInternalNote = true
        }, cancellationToken);

        await _incidentRepository.AddAuditLogAsync(new IncidentAuditLog
        {
            IncidentId = sourceIncident.Id,
            CaseNumber = sourceIncident.CaseNumber,
            Action = "IncidentMerged",
            Detail = $"Merged duplicate {sourceIncident.CaseNumber} into {targetIncident.CaseNumber}: {reason}",
            ActorUserId = actorUserId != Guid.Empty ? actorUserId : null,
            ActorName = string.IsNullOrWhiteSpace(actorName) ? "Case Manager" : actorName,
            ActorRole = string.IsNullOrWhiteSpace(actorRole) ? "CaseManager" : actorRole,
            IsInternal = true
        }, cancellationToken);

        await _unitOfWork.CommitAsync(cancellationToken);
        return Result<IncidentResponseDto>.Success(IncidentMapper.ToDto(sourceIncident), $"Incident {sourceIncident.CaseNumber} merged into {targetIncident.CaseNumber}.");
    }

    public async Task<Result<IReadOnlyList<IncidentCommunicationDto>>> GetCommunicationsAsync(
        string idOrCaseNumber,
        Guid? currentUserId = null,
        string? currentUserRole = null,
        CancellationToken cancellationToken = default)
    {
        var incident = await _incidentRepository.GetByIdOrCaseNumberAsync(idOrCaseNumber, includeDetails: true, cancellationToken);
        if (incident == null)
            return Result<IReadOnlyList<IncidentCommunicationDto>>.Failure("Incident not found.");

        var isCitizen = IncidentMapper.IsCitizenRole(currentUserRole);
        if (isCitizen && incident.CitizenId != currentUserId)
            return Result<IReadOnlyList<IncidentCommunicationDto>>.Failure("FORBIDDEN: Citizens may only access communications for their own incident requests.");

        var comms = incident.Communications.AsEnumerable();
        if (isCitizen)
        {
            // Citizens must only access permitted communications (never internal notes)
            comms = comms.Where(c => !c.IsInternal && c.IsVisibleToCitizen);
        }

        var list = comms
            .OrderByDescending(c => c.SentAt)
            .Select(c => new IncidentCommunicationDto
            {
                Id = c.Id,
                IncidentId = c.IncidentId,
                CaseId = incident.CaseNumber,
                Time = c.SentAt.ToString("HH:mm"),
                Title = c.Title,
                Message = c.Message,
                Recipient = c.RecipientWorkflow,
                SenderName = c.SenderName,
                SenderRole = c.SenderRole,
                CaseTag = c.CaseTag,
                IsInternal = c.IsInternal,
                IsVisibleToCitizen = c.IsVisibleToCitizen,
                SentAt = c.SentAt
            })
            .ToList();

        return Result<IReadOnlyList<IncidentCommunicationDto>>.Success(list);
    }

    public async Task<Result<IncidentCommunicationDto>> AddCommunicationAsync(
        string idOrCaseNumber,
        CreateIncidentCommunicationDto dto,
        Guid actorUserId,
        string actorName,
        string actorRole,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.Message))
            return Result<IncidentCommunicationDto>.Failure("Communication message is required.");

        var incident = await _incidentRepository.GetByIdOrCaseNumberAsync(idOrCaseNumber, includeDetails: true, cancellationToken);
        if (incident == null)
            return Result<IncidentCommunicationDto>.Failure("Incident not found.");

        var isCitizen = IncidentMapper.IsCitizenRole(actorRole);
        if (isCitizen && incident.CitizenId != actorUserId)
            return Result<IncidentCommunicationDto>.Failure("FORBIDDEN: Citizens may only post communications to their own incident requests.");

        var recipient = string.IsNullOrWhiteSpace(dto.Recipient) ? "Resource & Logistics Manager" : dto.Recipient.Trim();
        var isVisibleToCitizen = isCitizen || dto.IsVisibleToCitizen ||
                                 recipient.Contains("Citizen", StringComparison.OrdinalIgnoreCase);
        var isInternal = isCitizen ? false : (dto.IsInternal && !recipient.Contains("Citizen", StringComparison.OrdinalIgnoreCase));

        var title = !string.IsNullOrWhiteSpace(dto.Title)
            ? dto.Title.Trim()
            : (isCitizen
                ? "Citizen response submitted"
                : $"Handoff update dispatched to {recipient}");

        var comm = new IncidentCommunication
        {
            IncidentId = incident.Id,
            SenderUserId = actorUserId != Guid.Empty ? actorUserId : null,
            SenderName = string.IsNullOrWhiteSpace(actorName) ? (isCitizen ? "Citizen" : "Case Manager") : actorName,
            SenderRole = string.IsNullOrWhiteSpace(actorRole) ? "CaseManager" : actorRole,
            RecipientWorkflow = recipient,
            Title = title,
            Message = dto.Message.Trim(),
            CaseTag = isInternal
                ? $"{incident.CaseNumber} - authorised participants only"
                : $"{incident.CaseNumber} - citizen & case manager channel",
            IsInternal = isInternal,
            IsVisibleToCitizen = isVisibleToCitizen,
            SentAt = DateTime.UtcNow
        };
        comm.Validate();

        await _incidentRepository.AddCommunicationAsync(comm, cancellationToken);

        await _incidentRepository.AddAuditLogAsync(new IncidentAuditLog
        {
            IncidentId = incident.Id,
            CaseNumber = incident.CaseNumber,
            Action = "CommunicationLogged",
            Detail = title,
            ActorUserId = actorUserId != Guid.Empty ? actorUserId : null,
            ActorName = comm.SenderName,
            ActorRole = comm.SenderRole,
            IsInternal = true
        }, cancellationToken);

        await _unitOfWork.CommitAsync(cancellationToken);

        return Result<IncidentCommunicationDto>.Success(new IncidentCommunicationDto
        {
            Id = comm.Id,
            IncidentId = comm.IncidentId,
            CaseId = incident.CaseNumber,
            Time = comm.SentAt.ToString("HH:mm"),
            Title = comm.Title,
            Message = comm.Message,
            Recipient = comm.RecipientWorkflow,
            SenderName = comm.SenderName,
            SenderRole = comm.SenderRole,
            CaseTag = comm.CaseTag,
            IsInternal = comm.IsInternal,
            IsVisibleToCitizen = comm.IsVisibleToCitizen,
            SentAt = comm.SentAt
        }, "Scoped coordination update recorded.");
    }
}

