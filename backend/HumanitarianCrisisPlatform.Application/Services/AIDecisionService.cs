using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.AI;
using HumanitarianCrisisPlatform.Application.Interfaces;
using HumanitarianCrisisPlatform.Application.Interfaces.Infrastructure;
using HumanitarianCrisisPlatform.Application.Interfaces.Repositories;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;
using HumanitarianCrisisPlatform.Domain.Entities;

namespace HumanitarianCrisisPlatform.Application.Services;

public class AIDecisionService : IAIDecisionService
{
    private readonly IAIServiceClient _aiClient;
    private readonly IAIDecisionAuditRepository _auditRepository;
    private readonly IAssistanceRequestRepository _requestRepository;
    private readonly IUnitOfWork _unitOfWork;

    public AIDecisionService(
        IAIServiceClient aiClient,
        IAIDecisionAuditRepository auditRepository,
        IAssistanceRequestRepository requestRepository,
        IUnitOfWork unitOfWork)
    {
        _aiClient = aiClient;
        _auditRepository = auditRepository;
        _requestRepository = requestRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<AIPriorityEvaluationDto>> EvaluatePriorityAsync(
        string description,
        string category,
        CancellationToken cancellationToken = default)
    {
        var result = await _aiClient.ClassifyUrgencyAsync(description, category, cancellationToken);
        return Result<AIPriorityEvaluationDto>.Success(result);
    }

    public async Task<Result<DuplicateDetectionResultDto>> CheckDuplicateAsync(
        string description,
        decimal? lat,
        decimal? lon,
        CancellationToken cancellationToken = default)
    {
        var candidates = lat.HasValue && lon.HasValue
            ? await _requestRepository.GetPotentialDuplicatesAsync(lat.Value, lon.Value, "", cancellationToken)
            : await _requestRepository.GetAllAsync(cancellationToken);

        var existingDescriptions = candidates.Select(c => c.Description).ToList();
        var result = await _aiClient.DetectDuplicateAsync(description, existingDescriptions, cancellationToken);
        return Result<DuplicateDetectionResultDto>.Success(result);
    }

    public async Task<Result<bool>> ProcessHumanOverrideAsync(
        HumanOverrideDto dto,
        Guid reviewerId,
        CancellationToken cancellationToken = default)
    {
        var audit = await _auditRepository.GetByIdAsync(dto.DecisionAuditId, cancellationToken);
        if (audit == null) return Result<bool>.Failure("Audit log not found");

        audit.WasOverridden = dto.Action.Equals("Override", StringComparison.OrdinalIgnoreCase);
        audit.HumanDecision = dto.Action;
        audit.OverriddenBy = reviewerId;
        audit.OverrideReason = dto.Reason;
        audit.ReviewedAt = DateTime.UtcNow;

        if (audit.WasOverridden && audit.AssistanceRequestId != Guid.Empty)
        {
            var req = await _requestRepository.GetByIdAsync(audit.AssistanceRequestId, cancellationToken);
            if (req != null)
            {
                req.Urgency = dto.OverriddenPriority;
                await _requestRepository.UpdateAsync(req, cancellationToken);
            }
        }

        await _auditRepository.UpdateAsync(audit, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        return Result<bool>.Success(true, "AI decision reviewed and logged");
    }
}
