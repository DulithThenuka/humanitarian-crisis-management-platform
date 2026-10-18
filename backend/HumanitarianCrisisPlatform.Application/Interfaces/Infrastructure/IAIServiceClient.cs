using HumanitarianCrisisPlatform.Application.DTOs.AI;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Infrastructure;

public interface IAIServiceClient
{
    Task<AIPriorityEvaluationDto> ClassifyUrgencyAsync(string text, string category, CancellationToken cancellationToken = default);
    Task<DuplicateDetectionResultDto> DetectDuplicateAsync(string text, IEnumerable<string> existingCases, CancellationToken cancellationToken = default);
}
