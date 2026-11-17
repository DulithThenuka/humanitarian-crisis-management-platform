using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Volunteers;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Services;

/// <summary>
/// Service contract for all Volunteer portal operations.
/// </summary>
public interface IVolunteerService
{
    // ── Volunteer Profile ────────────────────────────────────────────────────
    Task<Result<VolunteerDto>> GetProfileAsync(Guid volunteerId);
    Task<Result<VolunteerDto>> UpdateProfileAsync(Guid volunteerId, UpdateVolunteerProfileDto dto);
    Task<Result<VolunteerMetricsDto>> GetMetricsAsync(Guid volunteerId);
    Task<Result<bool>> UpdateDutyStatusAsync(Guid volunteerId, UpdateDutyStatusDto dto);
    Task<Result<bool>> UpdateAvailabilityAsync(Guid volunteerId, UpdateAvailabilityDto dto);

    // ── Opportunities ────────────────────────────────────────────────────────
    Task<Result<IReadOnlyList<VolunteerOpportunityDto>>> GetOpportunitiesAsync(bool activeOnly = true);
    Task<Result<VolunteerOpportunityDto>> GetOpportunityByIdAsync(Guid id);
    Task<Result<VolunteerOpportunityDto>> CreateOpportunityAsync(Guid coordinatorUserId, CreateOpportunityDto dto);
    Task<Result<bool>> AcceptOpportunityAsync(Guid volunteerId, AcceptOpportunityDto dto);

    // ── Assignments ───────────────────────────────────────────────────────────
    Task<Result<IReadOnlyList<VolunteerAssignmentDto>>> GetAssignmentsAsync(Guid volunteerId);
    Task<Result<bool>> RespondToAssignmentAsync(Guid volunteerId, RespondToAssignmentDto dto);
    Task<Result<bool>> LogShiftHoursAsync(Guid volunteerId, LogShiftHoursDto dto);

    // ── Notifications ─────────────────────────────────────────────────────────
    Task<Result<IReadOnlyList<VolunteerNotificationDto>>> GetNotificationsAsync(Guid volunteerId);
    Task<Result<bool>> MarkNotificationsReadAsync(Guid volunteerId, List<Guid>? ids = null);

    // ── Coordinator Actions ───────────────────────────────────────────────────
    Task<Result<IReadOnlyList<VolunteerDto>>> GetAllVolunteersAsync();
    Task<Result<bool>> AssignTaskAsync(AssignTaskDto dto);
    Task<Result<bool>> BulkAssignAsync(BulkAssignDto dto);
    Task<Result<bool>> ApproveHoursAsync(Guid coordinatorUserId, ApproveHoursDto dto);
    Task<Result<IReadOnlyList<VolunteerAssignmentDto>>> GetAllAssignmentsAsync();
}
