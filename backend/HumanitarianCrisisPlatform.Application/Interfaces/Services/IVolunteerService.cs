using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Volunteers;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Services;

public interface IVolunteerService
{
    // Dashboard
    Task<Result<VolunteerDashboardDto>> GetDashboardOverviewAsync(CancellationToken cancellationToken = default);

    // Volunteer Directory
    Task<Result<IReadOnlyList<VolunteerCoordinatorDto>>> GetAllVolunteersAsync(string? search = null, string? status = null, string? serviceArea = null, CancellationToken cancellationToken = default);
    Task<Result<VolunteerCoordinatorDto>> GetVolunteerByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<VolunteerCoordinatorDto>> CreateVolunteerAsync(CreateVolunteerRequestDto dto, string createdBy, CancellationToken cancellationToken = default);
    Task<Result<VolunteerCoordinatorDto>> UpdateVolunteerAsync(Guid id, UpdateVolunteerRequestDto dto, string modifiedBy, CancellationToken cancellationToken = default);
    Task<Result<bool>> DeleteVolunteerAsync(Guid id, string deletedBy, CancellationToken cancellationToken = default);
    Task<Result<bool>> VerifyVolunteerAsync(Guid id, VolunteerActionRequestDto dto, string verifiedBy, CancellationToken cancellationToken = default);
    Task<Result<bool>> RequestClarificationAsync(Guid id, VolunteerActionRequestDto dto, string requestedBy, CancellationToken cancellationToken = default);
    Task<Result<bool>> EscalateVolunteerAsync(Guid id, VolunteerActionRequestDto dto, string escalatedBy, CancellationToken cancellationToken = default);

    // Scheduling & Assignment
    Task<Result<IReadOnlyList<VolunteerAssignmentDetailDto>>> GetAssignmentsAsync(string? status = null, string? area = null, Guid? volunteerId = null, CancellationToken cancellationToken = default);
    Task<Result<VolunteerAssignmentDetailDto>> AssignShiftAsync(AssignShiftRequestDto dto, string assignedBy, CancellationToken cancellationToken = default);
    Task<Result<bool>> AcceptAssignmentAsync(Guid assignmentId, string acceptedBy, CancellationToken cancellationToken = default);
    Task<Result<bool>> CompleteAssignmentAsync(Guid assignmentId, AssignmentActionRequestDto dto, string completedBy, CancellationToken cancellationToken = default);
    Task<Result<bool>> ReleaseAssignmentAsync(Guid assignmentId, AssignmentActionRequestDto dto, string releasedBy, CancellationToken cancellationToken = default);

    // AI / Rule-Based Matching
    Task<Result<MatchingRecommendationDto>> GetMatchingRecommendationAsync(CancellationToken cancellationToken = default);
    Task<Result<MatchingDecisionHistoryDto>> RecordMatchingDecisionAsync(MatchingDecisionRequestDto dto, string reviewerName, Guid reviewerId, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<MatchingDecisionHistoryDto>>> GetDecisionHistoryAsync(CancellationToken cancellationToken = default);

    // Activity & Safety
    Task<Result<IReadOnlyList<CoordinationTimelineItemDto>>> GetCoordinationTimelineAsync(CancellationToken cancellationToken = default);
    Task<Result<CoordinationTimelineItemDto>> RecordScopedUpdateAsync(RecordScopedUpdateRequestDto dto, string senderName, Guid senderId, CancellationToken cancellationToken = default);

    // Reports & Analytics
    Task<Result<VolunteerReportsAnalyticsDto>> GetReportsAnalyticsAsync(string? period = null, string? operationalArea = null, CancellationToken cancellationToken = default);
    Task<Result<ExportReportResultDto>> ExportReportAsync(ExportReportRequestDto dto, CancellationToken cancellationToken = default);
}
