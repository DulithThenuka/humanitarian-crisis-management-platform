using HumanitarianCrisisPlatform.Application.DTOs.AI;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Infrastructure;

public interface IAIServiceClient
{
    Task<AIProviderStatusDto> GetProviderStatusAsync(CancellationToken cancellationToken = default);
    Task<AIPriorityEvaluationDto> ClassifyUrgencyAsync(string text, string category, CancellationToken cancellationToken = default);
    Task<DuplicateDetectionResultDto> DetectDuplicateAsync(string text, IEnumerable<string> existingCases, CancellationToken cancellationToken = default);
    Task<WorkspaceServiceResultDto> ExecuteServiceAsync(string serviceId, ExecuteWorkspaceServiceDto input, object? databaseContext = null, CancellationToken cancellationToken = default);
}
