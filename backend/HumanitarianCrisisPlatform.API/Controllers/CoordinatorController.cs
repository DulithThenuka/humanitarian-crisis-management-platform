using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Coordinator;
using HumanitarianCrisisPlatform.Application.DTOs.Volunteers;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;
using HumanitarianCrisisPlatform.Domain.Enums;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;

namespace HumanitarianCrisisPlatform.API.Controllers;

/// <summary>
/// Coordinator-specific portal endpoints: dashboard, volunteer coordination,
/// request triage, emergency alerts and profile management.
/// Route: /api/coordinator
/// </summary>
[Route("api/coordinator")]
[ApiController]
[Authorize(Roles = "Coordinator,Admin")]
public class CoordinatorController : BaseApiController
{
    private readonly ApplicationDbContext _context;
    private readonly IVolunteerService _volunteerService;

    public CoordinatorController(
        ApplicationDbContext context,
        IVolunteerService volunteerService)
    {
        _context = context;
        _volunteerService = volunteerService;
    }

    // =========================================================================
    // DASHBOARD
    // =========================================================================

    /// <summary>GET /api/coordinator/dashboard — Full dashboard data snapshot</summary>
    [HttpGet("dashboard")]
    public async Task<ActionResult<Result<CoordinatorDashboardDto>>> GetDashboard()
    {
        var user = await _context.Users.FindAsync(CurrentUserId);
        if (user is null)
            return NotFound(Result<CoordinatorDashboardDto>.Failure("Coordinator account not found."));

        var totalRequests = await _context.AssistanceRequests.CountAsync();
        var pendingRequests = await _context.AssistanceRequests
            .CountAsync(r => r.Status == RequestStatus.Submitted);
        var criticalRequests = await _context.AssistanceRequests
            .CountAsync(r => r.Urgency == PriorityLevel.Critical);
        var activeCrises = await _context.CrisisEvents.CountAsync(c => c.IsActive);
        var totalVolunteers = await _context.Volunteers.CountAsync();
        var availableVols = await _context.Volunteers.CountAsync(v => v.IsAvailable);
        var activeAssignments = await _context.VolunteerAssignments
            .CountAsync(a => a.AssignmentStatus == 1 || a.AssignmentStatus == 2);

        // Priority cases — top 10 high-urgency submitted requests
        var priorityCases = await _context.AssistanceRequests
            .OrderByDescending(r => r.Urgency)
            .ThenByDescending(r => r.CreatedAt)
            .Take(10)
            .Select(r => new PriorityCaseDto
            {
                Id = r.Id,
                CaseId = $"HMR-{r.Id.ToString().Substring(0, 4).ToUpper()}",
                Category = r.Category,
                Location = r.Address ?? "Unknown",
                Priority = r.Urgency.ToString(),
                Status = r.Status.ToString(),
                AIPriority = r.Urgency == PriorityLevel.Critical ? "Critical" :
                             r.Urgency == PriorityLevel.High ? "High" : "Normal",
                Verification = r.Status == RequestStatus.Verified ? "Verified" : "Pending",
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();

        // Recent activity from latest requests
        var recentActivity = await _context.AssistanceRequests
            .OrderByDescending(r => r.UpdatedAt ?? r.CreatedAt)
            .Take(5)
            .Select(r => new RecentActivityDto
            {
                Id = r.Id,
                Title = $"{r.Status} — {r.Category}",
                Detail = $"{r.Address ?? "Unknown"} · {r.Urgency} priority",
                Type = r.Status == RequestStatus.Resolved ? "approved" :
                       r.Status == RequestStatus.Submitted ? "pending" : "incident",
                Timestamp = r.UpdatedAt ?? r.CreatedAt
            })
            .ToListAsync();

        var dashboard = new CoordinatorDashboardDto
        {
            User = new CoordinatorUserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role.ToString()
            },
            Metrics = new CoordinatorMetricsDto
            {
                IncomingRequests = totalRequests,
                PendingReviews = pendingRequests,
                CriticalPriority = criticalRequests,
                MoreInfoRequired = 0,
                ActiveEmergencies = activeCrises,
                TotalVolunteers = totalVolunteers,
                AvailableVolunteers = availableVols,
                VolunteersAssigned = activeAssignments,
                ActiveCrises = activeCrises,
                ResolvedToday = 0
            },
            PriorityCases = priorityCases,
            RecentActivity = recentActivity
        };

        return Ok(Result<CoordinatorDashboardDto>.Success(dashboard));
    }

    /// <summary>GET /api/coordinator/metrics — Summary metrics only</summary>
    [HttpGet("metrics")]
    public async Task<ActionResult<Result<CoordinatorMetricsDto>>> GetMetrics()
    {
        var totalRequests = await _context.AssistanceRequests.CountAsync();
        var pendingRequests = await _context.AssistanceRequests
            .CountAsync(r => r.Status == RequestStatus.Submitted);
        var criticalRequests = await _context.AssistanceRequests
            .CountAsync(r => r.Urgency == PriorityLevel.Critical);
        var activeCrises = await _context.CrisisEvents.CountAsync(c => c.IsActive);
        var totalVolunteers = await _context.Volunteers.CountAsync();
        var availableVols = await _context.Volunteers.CountAsync(v => v.IsAvailable);
        var activeAssignments = await _context.VolunteerAssignments
            .CountAsync(a => a.AssignmentStatus == 1 || a.AssignmentStatus == 2);

        return Ok(Result<CoordinatorMetricsDto>.Success(new CoordinatorMetricsDto
        {
            IncomingRequests = totalRequests,
            PendingReviews = pendingRequests,
            CriticalPriority = criticalRequests,
            ActiveEmergencies = activeCrises,
            TotalVolunteers = totalVolunteers,
            AvailableVolunteers = availableVols,
            VolunteersAssigned = activeAssignments,
            ActiveCrises = activeCrises
        }));
    }

    // =========================================================================
    // VOLUNTEER COORDINATION
    // =========================================================================

    /// <summary>GET /api/coordinator/volunteers — Volunteer coordination summary</summary>
    [HttpGet("volunteers")]
    public async Task<ActionResult<Result<VolunteerCoordinationSummaryDto>>> GetVolunteerSummary()
    {
        var volunteers = await _context.Volunteers
            .Include(v => v.User)
            .Include(v => v.Assignments)
            .OrderBy(v => v.User!.FullName)
            .ToListAsync();

        var totalActive = volunteers.Sum(v => v.Assignments.Count(a => a.AssignmentStatus == 2));
        var today = DateTime.UtcNow.Date;
        var completedToday = volunteers.Sum(v =>
            v.Assignments.Count(a => a.AssignmentStatus == 3 &&
                (a.UpdatedAt ?? a.EndTime ?? DateTime.MinValue).Date == today));

        var items = volunteers.Select(v => new VolunteerSummaryItem
        {
            Id = v.Id,
            VolunteerCode = v.VolunteerCode ?? $"VOL-{v.Id.ToString().Substring(0, 4).ToUpper()}",
            FullName = v.User?.FullName ?? "Unknown",
            DutyStatus = v.DutyStatus ?? (v.IsAvailable ? "Available" : "Off Duty"),
            IsAvailable = v.IsAvailable,
            Skills = v.Skills,
            ServiceArea = v.ServiceArea,
            ActiveAssignments = v.Assignments.Count(a => a.AssignmentStatus == 2),
            TotalHoursServed = v.TotalHoursServed
        }).ToList();

        return Ok(Result<VolunteerCoordinationSummaryDto>.Success(new VolunteerCoordinationSummaryDto
        {
            TotalVolunteers = volunteers.Count,
            AvailableVolunteers = volunteers.Count(v => v.IsAvailable),
            ActiveAssignments = totalActive,
            CompletedToday = completedToday,
            Volunteers = items
        }));
    }

    /// <summary>GET /api/coordinator/volunteers/{volunteerId}/assignments</summary>
    [HttpGet("volunteers/{volunteerId:guid}/assignments")]
    public async Task<ActionResult<Result<IReadOnlyList<VolunteerAssignmentDto>>>> GetVolunteerAssignments(Guid volunteerId)
    {
        var result = await _volunteerService.GetAssignmentsAsync(volunteerId);
        return Ok(result);
    }

    /// <summary>POST /api/coordinator/volunteers/assign</summary>
    [HttpPost("volunteers/assign")]
    public async Task<ActionResult<Result<bool>>> AssignTask([FromBody] AssignTaskDto dto)
    {
        var result = await _volunteerService.AssignTaskAsync(dto);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    /// <summary>POST /api/coordinator/volunteers/assign/bulk</summary>
    [HttpPost("volunteers/assign/bulk")]
    public async Task<ActionResult<Result<bool>>> BulkAssign([FromBody] BulkAssignDto dto)
    {
        var result = await _volunteerService.BulkAssignAsync(dto);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    /// <summary>POST /api/coordinator/volunteers/approve-hours</summary>
    [HttpPost("volunteers/approve-hours")]
    public async Task<ActionResult<Result<bool>>> ApproveHours([FromBody] ApproveHoursDto dto)
    {
        var result = await _volunteerService.ApproveHoursAsync(CurrentUserId, dto);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    /// <summary>GET /api/coordinator/volunteers/assignments — All assignments</summary>
    [HttpGet("volunteers/assignments")]
    public async Task<ActionResult<Result<IReadOnlyList<VolunteerAssignmentDto>>>> GetAllAssignments()
    {
        var result = await _volunteerService.GetAllAssignmentsAsync();
        return Ok(result);
    }

    // =========================================================================
    // OPPORTUNITY MANAGEMENT
    // =========================================================================

    /// <summary>POST /api/coordinator/opportunities — Create volunteer opportunity</summary>
    [HttpPost("opportunities")]
    public async Task<ActionResult<Result<VolunteerOpportunityDto>>> CreateOpportunity(
        [FromBody] CreateOpportunityDto dto)
    {
        var result = await _volunteerService.CreateOpportunityAsync(CurrentUserId, dto);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    /// <summary>GET /api/coordinator/opportunities</summary>
    [HttpGet("opportunities")]
    public async Task<ActionResult<Result<IReadOnlyList<VolunteerOpportunityDto>>>> GetOpportunities(
        [FromQuery] bool activeOnly = false)
    {
        var result = await _volunteerService.GetOpportunitiesAsync(activeOnly);
        return Ok(result);
    }

    // =========================================================================
    // REQUEST TRIAGE
    // =========================================================================

    /// <summary>POST /api/coordinator/requests/triage — Triage an assistance request</summary>
    [HttpPost("requests/triage")]
    public async Task<ActionResult<Result<bool>>> TriageRequest([FromBody] TriageRequestDto dto)
    {
        var request = await _context.AssistanceRequests.FindAsync(dto.RequestId);
        if (request is null)
            return NotFound(Result<bool>.Failure("Assistance request not found."));

        request.Status = dto.Action.ToLowerInvariant() switch
        {
            "verify"     or "approve"  => RequestStatus.Verified,
            "inprogress" or "escalate" => RequestStatus.InProgress,
            "resolve"                   => RequestStatus.Resolved,
            "close"                     => RequestStatus.Closed,
            _                          => RequestStatus.Submitted
        };

        if (dto.Priority is not null &&
            Enum.TryParse<PriorityLevel>(dto.Priority, true, out var priority))
        {
            request.Urgency = priority;
        }

        request.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(Result<bool>.Success(true, $"Request status updated to {request.Status}."));
    }

    // =========================================================================
    // EMERGENCY ALERTS (derived from CrisisEvents)
    // =========================================================================

    /// <summary>GET /api/coordinator/alerts — Get emergency alerts from active crises</summary>
    [HttpGet("alerts")]
    public async Task<ActionResult<Result<IReadOnlyList<EmergencyAlertDto>>>> GetAlerts()
    {
        var crises = await _context.CrisisEvents
            .Where(c => c.IsActive)
            .OrderByDescending(c => c.Severity)
            .Take(10)
            .ToListAsync();

        var alerts = crises.Select(c => new EmergencyAlertDto
        {
            Id = c.Id,
            Title = c.Title,
            Severity = c.Severity >= 4 ? "Critical" : c.Severity >= 3 ? "High" : "Medium",
            Type = c.DisasterType.ToString().ToLowerInvariant(),
            Status = c.IsActive ? "Active" : "Resolved",
            AffectedArea = c.Latitude.HasValue ? $"Lat: {c.Latitude}, Lng: {c.Longitude}" : null,
            CreatedAt = c.CreatedAt,
            IsPublished = c.IsActive
        }).ToList<EmergencyAlertDto>();

        return Ok(Result<IReadOnlyList<EmergencyAlertDto>>.Success(alerts));
    }

    /// <summary>POST /api/coordinator/alerts — Create emergency alert (creates a CrisisEvent)</summary>
    [HttpPost("alerts")]
    public async Task<ActionResult<Result<EmergencyAlertDto>>> CreateAlert(
        [FromBody] CreateEmergencyAlertDto dto)
    {
        var disasterType = Enum.TryParse<DisasterType>(dto.Type, true, out var dt)
            ? dt : DisasterType.Storm;

        var crisisEvent = new Domain.Entities.CrisisEvent
        {
            Title = dto.Title,
            Description = dto.Message ?? dto.Title,
            DisasterType = disasterType,
            Severity = dto.Severity switch
            {
                "Critical" => 4,
                "High"     => 3,
                "Medium"   => 2,
                _          => 1
            },
            IsActive = true,
            StartDate = DateTime.UtcNow
        };

        _context.CrisisEvents.Add(crisisEvent);
        await _context.SaveChangesAsync();

        return Ok(Result<EmergencyAlertDto>.Success(new EmergencyAlertDto
        {
            Id = crisisEvent.Id,
            Title = crisisEvent.Title,
            Severity = dto.Severity,
            Type = dto.Type,
            Status = "Active",
            AffectedArea = dto.AffectedArea,
            CreatedAt = crisisEvent.CreatedAt,
            IsPublished = true
        }, "Alert published successfully."));
    }

    // =========================================================================
    // NOTIFICATIONS
    // =========================================================================

    /// <summary>GET /api/coordinator/notifications</summary>
    [HttpGet("notifications")]
    public async Task<ActionResult<Result<IReadOnlyList<CoordinatorNotificationDto>>>> GetNotifications()
    {
        var pendingRequests = await _context.AssistanceRequests
            .Where(r => r.Status == RequestStatus.Submitted)
            .OrderByDescending(r => r.CreatedAt)
            .Take(10)
            .ToListAsync();

        var pendingHours = await _context.VolunteerAssignments
            .Where(a => a.LoggedHours > 0 && !a.HoursApproved)
            .Take(5)
            .ToListAsync();

        var notifications = new List<CoordinatorNotificationDto>();

        foreach (var req in pendingRequests)
        {
            notifications.Add(new CoordinatorNotificationDto
            {
                Id = req.Id,
                Title = "New Assistance Request",
                Message = $"{req.Category} from {req.Address ?? "Unknown"} — {req.Urgency} priority",
                Type = req.Urgency == PriorityLevel.Critical ? "urgent" : "info",
                IsRead = false,
                CreatedAt = req.CreatedAt
            });
        }

        foreach (var asgn in pendingHours)
        {
            notifications.Add(new CoordinatorNotificationDto
            {
                Id = asgn.Id,
                Title = "Hours Pending Approval",
                Message = $"{asgn.LoggedHours}h logged for \"{asgn.Title ?? asgn.TaskDescription}\"",
                Type = "info",
                IsRead = false,
                CreatedAt = asgn.UpdatedAt ?? asgn.CreatedAt
            });
        }

        var sorted = notifications.OrderByDescending(n => n.CreatedAt).ToList();

        return Ok(Result<IReadOnlyList<CoordinatorNotificationDto>>.Success(sorted));
    }

    // =========================================================================
    // PROFILE
    // =========================================================================

    /// <summary>GET /api/coordinator/profile</summary>
    [HttpGet("profile")]
    public async Task<ActionResult<Result<CoordinatorUserDto>>> GetProfile()
    {
        var user = await _context.Users.FindAsync(CurrentUserId);
        if (user is null)
            return NotFound(Result<CoordinatorUserDto>.Failure("User not found."));

        return Ok(Result<CoordinatorUserDto>.Success(new CoordinatorUserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Role = user.Role.ToString()
        }));
    }

    /// <summary>PUT /api/coordinator/profile</summary>
    [HttpPut("profile")]
    public async Task<ActionResult<Result<CoordinatorUserDto>>> UpdateProfile(
        [FromBody] UpdateCoordinatorProfileDto dto)
    {
        var user = await _context.Users.FindAsync(CurrentUserId);
        if (user is null)
            return NotFound(Result<CoordinatorUserDto>.Failure("User not found."));

        if (dto.FullName is not null) user.FullName = dto.FullName;
        if (dto.PhoneNumber is not null) user.PhoneNumber = dto.PhoneNumber;
        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(Result<CoordinatorUserDto>.Success(new CoordinatorUserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Role = user.Role.ToString()
        }, "Profile updated."));
    }
}
