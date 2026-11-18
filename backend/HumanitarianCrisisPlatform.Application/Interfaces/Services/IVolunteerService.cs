using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Volunteers;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Services;

public interface IVolunteerService
{
    // Volunteer Portal (Field Volunteers)
    Task<Result<VolunteerDashboardDto>> GetVolunteerDashboardAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<Result<VolunteerProfileDto>> GetVolunteerProfileAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<Result<VolunteerProfileDto>> UpdateVolunteerProfileAsync(Guid userId, UpdateVolunteerProfileDto dto, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<VolunteerAssignmentItemDto>>> GetMyAssignmentsAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<Result<VolunteerAssignmentItemDto>> UpdateAssignmentStatusAsync(Guid userId, string assignmentId, UpdateAssignmentStatusDto dto, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<VolunteerOpportunityDto>>> GetOpportunitiesAsync(CancellationToken cancellationToken = default);
    Task<Result<VolunteerAssignmentItemDto>> AcceptOpportunityAsync(Guid userId, string opportunityId, CancellationToken cancellationToken = default);

    // Volunteer Coordinator Portal
    Task<Result<VolunteerCoordinatorDashboardDto>> GetCoordinatorDashboardAsync(CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<VolunteerRosterItemDto>>> GetVolunteerDirectoryAsync(string? search = null, string? status = null, string? serviceArea = null, CancellationToken cancellationToken = default);
    Task<Result<VolunteerRosterItemDto>> CreateVolunteerRecordAsync(CreateVolunteerRecordDto dto, CancellationToken cancellationToken = default);
    Task<Result<bool>> AssignShiftAsync(AssignVolunteerShiftDto dto, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<VolunteerMatchingRecommendationDto>>> GetAIMatchingRecommendationsAsync(CancellationToken cancellationToken = default);

    // Legacy Support
    Task<Result<bool>> AssignTaskAsync(AssignTaskDto dto, CancellationToken cancellationToken = default);
}
