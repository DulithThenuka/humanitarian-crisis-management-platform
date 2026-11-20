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
    Task<Result<EmergencyAlertDto>> GetEmergencyAlertByIdAsync(string id, CancellationToken cancellationToken = default);
    Task<Result<EmergencyAlertDto>> CreateEmergencyAlertAsync(CreateAlertDto dto, Guid coordinatorId, string coordinatorName, CancellationToken cancellationToken = default);
    Task<Result<EmergencyAlertDto>> UpdateEmergencyAlertAsync(string id, UpdateAlertDto dto, Guid coordinatorId, string coordinatorName, CancellationToken cancellationToken = default);
    Task<Result<EmergencyAlertDto>> ResolveEmergencyAlertAsync(string id, ResolveAlertDto? dto, Guid coordinatorId, string coordinatorName, CancellationToken cancellationToken = default);
    Task<Result<EmergencyAlertDto>> PublishEmergencyAlertAsync(string id, Guid coordinatorId, string coordinatorName, CancellationToken cancellationToken = default);
    Task<Result<ResourceCoordinationDashboardDto>> GetResourceCoordinationAsync(CancellationToken cancellationToken = default);
    Task<Result<CoordinatorAllocationRequestDto>> SubmitAllocationRequestAsync(SubmitResourceAllocationRequestDto dto, Guid coordinatorId, string coordinatorName, CancellationToken cancellationToken = default);
    Task<Result<ShelterVolunteerDashboardDto>> GetShelterVolunteerCoordinationAsync(CancellationToken cancellationToken = default);
    Task<Result<CoordinatorShelterPlacementRequestDto>> SubmitShelterPlacementRequestAsync(SubmitShelterPlacementRequestDto dto, Guid coordinatorId, string coordinatorName, CancellationToken cancellationToken = default);
    Task<Result<CoordinatorVolunteerAssignmentRequestDto>> SubmitVolunteerAssignmentRequestAsync(SubmitVolunteerAssignmentRequestDto dto, Guid coordinatorId, string coordinatorName, CancellationToken cancellationToken = default);
    Task<Result<CoordinatorAnalyticsDto>> GetAnalyticsAsync(string? period = null, DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default);
}
