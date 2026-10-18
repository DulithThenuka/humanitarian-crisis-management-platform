using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.AI;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Services;

public interface IAIDecisionService
{
    Task<Result<AIPriorityEvaluationDto>> EvaluatePriorityAsync(string description, string category, CancellationToken cancellationToken = default);
    Task<Result<DuplicateDetectionResultDto>> CheckDuplicateAsync(string description, decimal? lat, decimal? lon, CancellationToken cancellationToken = default);
    Task<Result<bool>> ProcessHumanOverrideAsync(HumanOverrideDto dto, Guid reviewerId, CancellationToken cancellationToken = default);
}
