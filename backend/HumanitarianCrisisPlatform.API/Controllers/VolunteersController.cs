using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Volunteers;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;
using HumanitarianCrisisPlatform.Domain.Enums;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;

namespace HumanitarianCrisisPlatform.API.Controllers;

[Authorize]
public class VolunteersController : BaseApiController
{
    private readonly IVolunteerService _volunteerService;
    private readonly ApplicationDbContext _context;

    public VolunteersController(IVolunteerService volunteerService, ApplicationDbContext context)
    {
        _volunteerService = volunteerService;
        _context = context;
    }

    // ─── Helper: resolve volunteer ID from current JWT user ──────────────────
    private async Task<Guid?> GetVolunteerIdAsync()
    {
        var vol = await _context.Volunteers
            .FirstOrDefaultAsync(v => v.UserId == CurrentUserId);
        return vol?.Id;
    }

    // =========================================================================
    // VOLUNTEER PROFILE ENDPOINTS
    // =========================================================================

    /// <summary>GET /api/volunteers/me — Get authenticated volunteer's profile</summary>
    [HttpGet("me")]
    [Authorize(Roles = "Volunteer,Coordinator,Admin")]
    public async Task<ActionResult<Result<VolunteerDto>>> GetMyProfile()
    {
        var volunteerId = await GetVolunteerIdAsync();
        if (volunteerId is null)
            return NotFound(Result<VolunteerDto>.Failure("No volunteer profile linked to this account."));

        var result = await _volunteerService.GetProfileAsync(volunteerId.Value);
        return result.Succeeded ? Ok(result) : NotFound(result);
    }

    /// <summary>PUT /api/volunteers/me — Update authenticated volunteer's profile</summary>
    [HttpPut("me")]
    [Authorize(Roles = "Volunteer")]
    public async Task<ActionResult<Result<VolunteerDto>>> UpdateMyProfile([FromBody] UpdateVolunteerProfileDto dto)
    {
        var volunteerId = await GetVolunteerIdAsync();
        if (volunteerId is null)
            return NotFound(Result<VolunteerDto>.Failure("No volunteer profile linked to this account."));

        var result = await _volunteerService.UpdateProfileAsync(volunteerId.Value, dto);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    /// <summary>GET /api/volunteers/metrics — Get volunteer dashboard metrics</summary>
    [HttpGet("metrics")]
    [Authorize(Roles = "Volunteer,Coordinator,Admin")]
    public async Task<ActionResult<Result<VolunteerMetricsDto>>> GetMetrics()
    {
        var volunteerId = await GetVolunteerIdAsync();
        if (volunteerId is null)
            return NotFound(Result<VolunteerMetricsDto>.Failure("No volunteer profile linked to this account."));

        var result = await _volunteerService.GetMetricsAsync(volunteerId.Value);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    /// <summary>PUT /api/volunteers/duty — Update duty status (Available / On Duty / Off Duty)</summary>
    [HttpPut("duty")]
    [Authorize(Roles = "Volunteer")]
    public async Task<ActionResult<Result<bool>>> UpdateDutyStatus([FromBody] UpdateDutyStatusDto dto)
    {
        var volunteerId = await GetVolunteerIdAsync();
        if (volunteerId is null)
            return NotFound(Result<bool>.Failure("No volunteer profile linked to this account."));

        var result = await _volunteerService.UpdateDutyStatusAsync(volunteerId.Value, dto);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    /// <summary>PUT /api/volunteers/availability — Update availability settings</summary>
    [HttpPut("availability")]
    [Authorize(Roles = "Volunteer")]
    public async Task<ActionResult<Result<bool>>> UpdateAvailability([FromBody] UpdateAvailabilityDto dto)
    {
        var volunteerId = await GetVolunteerIdAsync();
        if (volunteerId is null)
            return NotFound(Result<bool>.Failure("No volunteer profile linked to this account."));

        var result = await _volunteerService.UpdateAvailabilityAsync(volunteerId.Value, dto);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    // =========================================================================
    // OPPORTUNITY ENDPOINTS
    // =========================================================================

    /// <summary>GET /api/volunteers/opportunities — List active opportunities</summary>
    [HttpGet("opportunities")]
    [Authorize(Roles = "Volunteer,Coordinator,Admin")]
    public async Task<ActionResult<Result<IReadOnlyList<VolunteerOpportunityDto>>>> GetOpportunities(
        [FromQuery] bool activeOnly = true)
    {
        var result = await _volunteerService.GetOpportunitiesAsync(activeOnly);
        return Ok(result);
    }

    /// <summary>GET /api/volunteers/opportunities/{id} — Get single opportunity</summary>
    [HttpGet("opportunities/{id:guid}")]
    [Authorize(Roles = "Volunteer,Coordinator,Admin")]
    public async Task<ActionResult<Result<VolunteerOpportunityDto>>> GetOpportunity(Guid id)
    {
        var result = await _volunteerService.GetOpportunityByIdAsync(id);
        return result.Succeeded ? Ok(result) : NotFound(result);
    }

    /// <summary>POST /api/volunteers/opportunities — Create a new opportunity (Coordinator/Admin)</summary>
    [HttpPost("opportunities")]
    [Authorize(Roles = "Coordinator,Admin")]
    public async Task<ActionResult<Result<VolunteerOpportunityDto>>> CreateOpportunity(
        [FromBody] CreateOpportunityDto dto)
    {
        var result = await _volunteerService.CreateOpportunityAsync(CurrentUserId, dto);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    /// <summary>POST /api/volunteers/opportunities/accept — Volunteer accepts an opportunity</summary>
    [HttpPost("opportunities/accept")]
    [Authorize(Roles = "Volunteer")]
    public async Task<ActionResult<Result<bool>>> AcceptOpportunity([FromBody] AcceptOpportunityDto dto)
    {
        var volunteerId = await GetVolunteerIdAsync();
        if (volunteerId is null)
            return NotFound(Result<bool>.Failure("No volunteer profile linked to this account."));

        var result = await _volunteerService.AcceptOpportunityAsync(volunteerId.Value, dto);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    // =========================================================================
    // ASSIGNMENT ENDPOINTS
    // =========================================================================

    /// <summary>GET /api/volunteers/assignments — Get my assignments</summary>
    [HttpGet("assignments")]
    [Authorize(Roles = "Volunteer")]
    public async Task<ActionResult<Result<IReadOnlyList<VolunteerAssignmentDto>>>> GetMyAssignments()
    {
        var volunteerId = await GetVolunteerIdAsync();
        if (volunteerId is null)
            return NotFound(Result<IReadOnlyList<VolunteerAssignmentDto>>.Failure("No volunteer profile linked to this account."));

        var result = await _volunteerService.GetAssignmentsAsync(volunteerId.Value);
        return Ok(result);
    }

    /// <summary>POST /api/volunteers/assignments/respond — Accept / decline / complete assignment</summary>
    [HttpPost("assignments/respond")]
    [Authorize(Roles = "Volunteer")]
    public async Task<ActionResult<Result<bool>>> RespondToAssignment([FromBody] RespondToAssignmentDto dto)
    {
        var volunteerId = await GetVolunteerIdAsync();
        if (volunteerId is null)
            return NotFound(Result<bool>.Failure("No volunteer profile linked to this account."));

        var result = await _volunteerService.RespondToAssignmentAsync(volunteerId.Value, dto);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    /// <summary>POST /api/volunteers/assignments/log-hours — Log shift hours</summary>
    [HttpPost("assignments/log-hours")]
    [Authorize(Roles = "Volunteer")]
    public async Task<ActionResult<Result<bool>>> LogShiftHours([FromBody] LogShiftHoursDto dto)
    {
        var volunteerId = await GetVolunteerIdAsync();
        if (volunteerId is null)
            return NotFound(Result<bool>.Failure("No volunteer profile linked to this account."));

        var result = await _volunteerService.LogShiftHoursAsync(volunteerId.Value, dto);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    // =========================================================================
    // NOTIFICATION ENDPOINTS
    // =========================================================================

    /// <summary>GET /api/volunteers/notifications — Get volunteer notifications</summary>
    [HttpGet("notifications")]
    [Authorize(Roles = "Volunteer")]
    public async Task<ActionResult<Result<IReadOnlyList<VolunteerNotificationDto>>>> GetNotifications()
    {
        var volunteerId = await GetVolunteerIdAsync();
        if (volunteerId is null)
            return NotFound(Result<IReadOnlyList<VolunteerNotificationDto>>.Failure("No volunteer profile linked to this account."));

        var result = await _volunteerService.GetNotificationsAsync(volunteerId.Value);
        return Ok(result);
    }

    /// <summary>POST /api/volunteers/notifications/mark-read — Mark notifications as read</summary>
    [HttpPost("notifications/mark-read")]
    [Authorize(Roles = "Volunteer")]
    public async Task<ActionResult<Result<bool>>> MarkNotificationsRead([FromBody] List<Guid>? ids = null)
    {
        var volunteerId = await GetVolunteerIdAsync();
        if (volunteerId is null)
            return NotFound(Result<bool>.Failure("No volunteer profile linked to this account."));

        var result = await _volunteerService.MarkNotificationsReadAsync(volunteerId.Value, ids);
        return Ok(result);
    }

    // =========================================================================
    // COORDINATOR / ADMIN ENDPOINTS
    // =========================================================================

    /// <summary>GET /api/volunteers — Get all volunteers (Coordinator/Admin)</summary>
    [HttpGet]
    [Authorize(Roles = "Coordinator,Admin")]
    public async Task<ActionResult<Result<IReadOnlyList<VolunteerDto>>>> GetAll()
    {
        var result = await _volunteerService.GetAllVolunteersAsync();
        return Ok(result);
    }

    /// <summary>GET /api/volunteers/assignments/all — Get all assignments (Coordinator/Admin)</summary>
    [HttpGet("assignments/all")]
    [Authorize(Roles = "Coordinator,Admin")]
    public async Task<ActionResult<Result<IReadOnlyList<VolunteerAssignmentDto>>>> GetAllAssignments()
    {
        var result = await _volunteerService.GetAllAssignmentsAsync();
        return Ok(result);
    }

    /// <summary>POST /api/volunteers/assign — Assign a task to a volunteer (Coordinator/Admin)</summary>
    [HttpPost("assign")]
    [Authorize(Roles = "Coordinator,Admin")]
    public async Task<ActionResult<Result<bool>>> AssignTask([FromBody] AssignTaskDto dto)
    {
        var result = await _volunteerService.AssignTaskAsync(dto);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    /// <summary>POST /api/volunteers/assign/bulk — Bulk assign task to multiple volunteers</summary>
    [HttpPost("assign/bulk")]
    [Authorize(Roles = "Coordinator,Admin")]
    public async Task<ActionResult<Result<bool>>> BulkAssign([FromBody] BulkAssignDto dto)
    {
        var result = await _volunteerService.BulkAssignAsync(dto);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    /// <summary>POST /api/volunteers/approve-hours — Approve logged volunteer hours (Coordinator/Admin)</summary>
    [HttpPost("approve-hours")]
    [Authorize(Roles = "Coordinator,Admin")]
    public async Task<ActionResult<Result<bool>>> ApproveHours([FromBody] ApproveHoursDto dto)
    {
        var result = await _volunteerService.ApproveHoursAsync(CurrentUserId, dto);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }
}
