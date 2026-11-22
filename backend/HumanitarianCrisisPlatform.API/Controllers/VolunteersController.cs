using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Volunteers;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;

namespace HumanitarianCrisisPlatform.API.Controllers;

[Authorize(Roles = "Coordinator,Admin,Volunteer,CaseManager")]
public class VolunteersController : BaseApiController
{
    private readonly ApplicationDbContext _context;
    private readonly IVolunteerService _volunteerService;

    public VolunteersController(ApplicationDbContext context, IVolunteerService volunteerService)
    {
        _context = context;
        _volunteerService = volunteerService;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // 1. Dashboard Endpoint
    // ─────────────────────────────────────────────────────────────────────────────
    [HttpGet("dashboard")]
    public async Task<ActionResult<Result<VolunteerDashboardDto>>> GetDashboard(CancellationToken cancellationToken)
    {
        var result = await _volunteerService.GetDashboardOverviewAsync(cancellationToken);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // 2. Volunteer Directory Endpoints
    // ─────────────────────────────────────────────────────────────────────────────
    [HttpGet]
    [Authorize(Roles = "Coordinator,Admin,Volunteer,CaseManager")]
    public async Task<ActionResult<Result<IReadOnlyList<VolunteerCoordinatorDto>>>> GetAll(
        [FromQuery] string? search,
        [FromQuery] string? status,
        [FromQuery] string? serviceArea,
        CancellationToken cancellationToken)
    {
        var result = await _volunteerService.GetAllVolunteersAsync(search, status, serviceArea, cancellationToken);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    [HttpGet("me")]
    public async Task<ActionResult<Result<VolunteerCoordinatorDto>>> GetCurrentVolunteer(CancellationToken cancellationToken)
    {
        var result = await _volunteerService.GetVolunteerByIdAsync(CurrentUserId, cancellationToken);
        return result.Succeeded ? Ok(result) : NotFound(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Result<VolunteerCoordinatorDto>>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _volunteerService.GetVolunteerByIdAsync(id, cancellationToken);
        return result.Succeeded ? Ok(result) : NotFound(result);
    }

    [HttpPost]
    public async Task<ActionResult<Result<VolunteerCoordinatorDto>>> Create(
        [FromBody] CreateVolunteerRequestDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _volunteerService.CreateVolunteerAsync(dto, CurrentUserName, cancellationToken);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<Result<VolunteerCoordinatorDto>>> Update(
        Guid id,
        [FromBody] UpdateVolunteerRequestDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _volunteerService.UpdateVolunteerAsync(id, dto, CurrentUserName, cancellationToken);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    [HttpPost("{id:guid}/verify")]
    public async Task<ActionResult<Result<bool>>> Verify(
        Guid id,
        [FromBody] VolunteerActionRequestDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _volunteerService.VerifyVolunteerAsync(id, dto, CurrentUserName, cancellationToken);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    [HttpPost("{id:guid}/clarify")]
    public async Task<ActionResult<Result<bool>>> RequestClarification(
        Guid id,
        [FromBody] VolunteerActionRequestDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _volunteerService.RequestClarificationAsync(id, dto, CurrentUserName, cancellationToken);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    [HttpPost("{id:guid}/escalate")]
    public async Task<ActionResult<Result<bool>>> Escalate(
        Guid id,
        [FromBody] VolunteerActionRequestDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _volunteerService.EscalateVolunteerAsync(id, dto, CurrentUserName, cancellationToken);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // 3. Scheduling & Assignment Endpoints
    // ─────────────────────────────────────────────────────────────────────────────
    [HttpGet("assignments")]
    public async Task<ActionResult<Result<IReadOnlyList<VolunteerAssignmentDetailDto>>>> GetAssignments(
        [FromQuery] string? status,
        [FromQuery] string? area,
        [FromQuery] Guid? volunteerId,
        CancellationToken cancellationToken)
    {
        var result = await _volunteerService.GetAssignmentsAsync(status, area, volunteerId, cancellationToken);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    [HttpPost("assignments")]
    public async Task<ActionResult<Result<VolunteerAssignmentDetailDto>>> AssignShift(
        [FromBody] AssignShiftRequestDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _volunteerService.AssignShiftAsync(dto, CurrentUserName, cancellationToken);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    [HttpPost("assign")]
    [Authorize(Roles = "Coordinator,Admin")]
    public async Task<ActionResult<Result<bool>>> AssignTask(
        [FromBody] AssignTaskDto dto,
        CancellationToken cancellationToken = default)
    {
        var assignShiftDto = new AssignShiftRequestDto
        {
            VolunteerId = dto.VolunteerId,
            AssistanceRequestId = dto.AssistanceRequestId,
            ShiftTask = dto.TaskDescription,
            ShiftTime = "08:00-14:00",
            Note = dto.Notes
        };

        var result = await _volunteerService.AssignShiftAsync(assignShiftDto, CurrentUserName, cancellationToken);
        return result.Succeeded 
            ? Ok(Result<bool>.Success(true, result.Message)) 
            : BadRequest(Result<bool>.Failure(result.Message ?? "Assignment failed."));
    }

    [HttpPost("assignments/{id:guid}/accept")]
    public async Task<ActionResult<Result<bool>>> AcceptAssignment(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _volunteerService.AcceptAssignmentAsync(id, CurrentUserName, cancellationToken);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    [HttpPost("assignments/{id:guid}/complete")]
    public async Task<ActionResult<Result<bool>>> CompleteAssignment(
        Guid id,
        [FromBody] AssignmentActionRequestDto? dto,
        CancellationToken cancellationToken)
    {
        var result = await _volunteerService.CompleteAssignmentAsync(id, dto ?? new AssignmentActionRequestDto(), CurrentUserName, cancellationToken);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    [HttpPost("assignments/{id:guid}/release")]
    public async Task<ActionResult<Result<bool>>> ReleaseAssignment(
        Guid id,
        [FromBody] AssignmentActionRequestDto? dto,
        CancellationToken cancellationToken)
    {
        var result = await _volunteerService.ReleaseAssignmentAsync(id, dto ?? new AssignmentActionRequestDto(), CurrentUserName, cancellationToken);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // 4. AI & Rule-Based Matching Endpoints
    // ─────────────────────────────────────────────────────────────────────────────
    [HttpGet("matching")]
    public async Task<ActionResult<Result<MatchingRecommendationDto>>> GetMatchingRecommendation(CancellationToken cancellationToken)
    {
        var result = await _volunteerService.GetMatchingRecommendationAsync(cancellationToken);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    [HttpPost("matching/decide")]
    public async Task<ActionResult<Result<MatchingDecisionHistoryDto>>> RecordDecision(
        [FromBody] MatchingDecisionRequestDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _volunteerService.RecordMatchingDecisionAsync(dto, CurrentUserName, CurrentUserId, cancellationToken);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    [HttpGet("matching/history")]
    public async Task<ActionResult<Result<IReadOnlyList<MatchingDecisionHistoryDto>>>> GetDecisionHistory(CancellationToken cancellationToken)
    {
        var result = await _volunteerService.GetDecisionHistoryAsync(cancellationToken);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // 5. Activity & Safety Scoped Coordination Endpoints
    // ─────────────────────────────────────────────────────────────────────────────
    [HttpGet("activity")]
    public async Task<ActionResult<Result<IReadOnlyList<CoordinationTimelineItemDto>>>> GetActivityTimeline(CancellationToken cancellationToken)
    {
        var result = await _volunteerService.GetCoordinationTimelineAsync(cancellationToken);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    [HttpPost("activity")]
    public async Task<ActionResult<Result<CoordinationTimelineItemDto>>> RecordScopedUpdate(
        [FromBody] RecordScopedUpdateRequestDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _volunteerService.RecordScopedUpdateAsync(dto, CurrentUserName, CurrentUserId, cancellationToken);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // 6. Reports & Analytics Endpoints
    // ─────────────────────────────────────────────────────────────────────────────
    [HttpGet("reports")]
    public async Task<ActionResult<Result<VolunteerReportsAnalyticsDto>>> GetReports(
        [FromQuery] string? period,
        [FromQuery] string? operationalArea,
        CancellationToken cancellationToken)
    {
        var result = await _volunteerService.GetReportsAnalyticsAsync(period, operationalArea, cancellationToken);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    [HttpPost("reports/export")]
    public async Task<ActionResult<Result<ExportReportResultDto>>> ExportReport(
        [FromBody] ExportReportRequestDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _volunteerService.ExportReportAsync(dto, cancellationToken);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }
}
