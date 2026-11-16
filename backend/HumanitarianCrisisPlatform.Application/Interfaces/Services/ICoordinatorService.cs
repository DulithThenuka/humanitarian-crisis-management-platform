using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Coordinator;
using HumanitarianCrisisPlatform.Application.DTOs.Requests;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Services;

public interface ICoordinatorService
{
    Task<Result<CoordinatorOverviewDto>> GetOverviewAsync(CancellationToken cancellationToken = default);
    Task<Result<CoordinatorDecisionHistoryDto>> GetDecisionHistoryAsync(CancellationToken cancellationToken = default);
    Task<Result<AssistanceRequestResponseDto>> VerifyRequestAsync(Guid id, VerifyAssistanceRequestDto dto, Guid coordinatorId, string coordinatorName, CancellationToken cancellationToken = default);
    Task<Result<AssistanceRequestResponseDto>> VerifyRequestAsync(string id, VerifyAssistanceRequestDto dto, Guid coordinatorId, string coordinatorName, CancellationToken cancellationToken = default);
    Task<Result<AssistanceRequestResponseDto>> EscalateRequestAsync(Guid id, EscalateAssistanceRequestDto dto, Guid coordinatorId, string coordinatorName, CancellationToken cancellationToken = default);
    Task<Result<AssistanceRequestResponseDto>> EscalateRequestAsync(string id, EscalateAssistanceRequestDto dto, Guid coordinatorId, string coordinatorName, CancellationToken cancellationToken = default);
    Task<Result<bool>> AddRequestNoteAsync(Guid id, AddRequestNoteDto dto, Guid coordinatorId, string coordinatorName, CancellationToken cancellationToken = default);
    Task<Result<bool>> AddRequestNoteAsync(string id, AddRequestNoteDto dto, Guid coordinatorId, string coordinatorName, CancellationToken cancellationToken = default);
    Task<Result<PriorityRequestSummaryDto>> RequestAdditionalInfoAsync(Guid id, RequestAdditionalInfoDto dto, Guid coordinatorId, string coordinatorName, CancellationToken cancellationToken = default);
    Task<Result<PriorityRequestSummaryDto>> RequestAdditionalInfoAsync(string id, RequestAdditionalInfoDto dto, Guid coordinatorId, string coordinatorName, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<CrisisEventResponseDto>>> GetCrisisEventsAsync(bool? activeOnly = null, CancellationToken cancellationToken = default);
    Task<Result<CrisisEventResponseDto>> GetCrisisEventByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<CrisisEventResponseDto>> CreateCrisisEventAsync(CreateCrisisEventDto dto, Guid coordinatorId, string coordinatorName, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<EmergencyAlertDto>>> GetEmergencyAlertsAsync(string? tab = null, CancellationToken cancellationToken = default);
    Task<Result<EmergencyAlertDto>> CreateEmergencyAlertAsync(CreateAlertDto dto, Guid coordinatorId, string coordinatorName, CancellationToken cancellationToken = default);
    Task<Result<ResourceCoordinationDashboardDto>> GetResourceCoordinationAsync(CancellationToken cancellationToken = default);
    Task<Result<CoordinatorAllocationRequestDto>> SubmitAllocationRequestAsync(SubmitResourceAllocationRequestDto dto, Guid coordinatorId, string coordinatorName, CancellationToken cancellationToken = default);
}
