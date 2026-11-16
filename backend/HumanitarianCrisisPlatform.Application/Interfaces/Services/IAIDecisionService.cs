using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.AI;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Services;

public interface IAIDecisionService
{
    Task<Result<AIPriorityEvaluationDto>> EvaluatePriorityAsync(string description, string category, CancellationToken cancellationToken = default);
    Task<Result<DuplicateDetectionResultDto>> CheckDuplicateAsync(string description, decimal? lat, decimal? lon, CancellationToken cancellationToken = default);
    Task<Result<bool>> ProcessHumanOverrideAsync(HumanOverrideDto dto, Guid reviewerId, CancellationToken cancellationToken = default);

    // AI Operations Suite Methods
    Task<AIProviderStatusDto> GetProviderStatusAsync(CancellationToken cancellationToken = default);
    Task<AIOperationsOverviewDto> GetOperationsOverviewAsync(CancellationToken cancellationToken = default);
    Task<List<AIDecisionQueueItemDto>> GetDecisionQueueAsync(string? tab, string? priority, string? search, CancellationToken cancellationToken = default);
    Task<AIDecisionCaseDetailDto?> GetCaseDetailAsync(string caseId, CancellationToken cancellationToken = default);
    Task<Result<AIDecisionCaseDetailDto>> RecordHumanDecisionAsync(RecordAIDecisionInputDto dto, Guid reviewerId, string reviewerName, string reviewerRole, CancellationToken cancellationToken = default);
    Task<Result<WorkspaceServiceResultDto>> ExecuteWorkspaceServiceAsync(string serviceId, ExecuteWorkspaceServiceDto input, CancellationToken cancellationToken = default);
    Task<DecisionTraceDetailDto?> GetDecisionTraceAsync(string caseId, CancellationToken cancellationToken = default);
    Task<Result<SupervisorNoteDto>> AddSupervisorNoteAsync(string caseId, AddSupervisorNoteDto dto, Guid authorId, string authorName, string authorRole, CancellationToken cancellationToken = default);
}
