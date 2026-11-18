using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Volunteers;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;

namespace HumanitarianCrisisPlatform.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VolunteersController : BaseApiController
{
    private readonly IVolunteerService _volunteerService;

    public VolunteersController(IVolunteerService volunteerService)
    {
        _volunteerService = volunteerService;
    }

    private Guid ResolveUserId()
    {
        var claimValue = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub") ?? User.FindFirstValue("uid");
        if (Guid.TryParse(claimValue, out var guid))
        {
            return guid;
        }
        return CurrentUserId;
    }

    /// <summary>
    /// Gets volunteer directory / roster with optional search, status and service area filters.
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<Result<IReadOnlyList<VolunteerRosterItemDto>>>> GetAll(
        [FromQuery] string? search,
        [FromQuery] string? status,
        [FromQuery] string? serviceArea,
        CancellationToken cancellationToken)
    {
        var result = await _volunteerService.GetVolunteerDirectoryAsync(search, status, serviceArea, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Gets the profile of the current authenticated volunteer.
    /// </summary>
    [HttpGet("profile")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<VolunteerProfileDto>>> GetProfile(CancellationToken cancellationToken)
    {
        var userId = ResolveUserId();
        var result = await _volunteerService.GetVolunteerProfileAsync(userId, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Updates the volunteer's profile and availability preferences.
    /// </summary>
    [HttpPut("profile")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<VolunteerProfileDto>>> UpdateProfile(
        [FromBody] UpdateVolunteerProfileDto dto,
        CancellationToken cancellationToken)
    {
        var userId = ResolveUserId();
        var result = await _volunteerService.UpdateVolunteerProfileAsync(userId, dto, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Gets full Volunteer Portal dashboard overview.
    /// </summary>
    [HttpGet("dashboard")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<VolunteerDashboardDto>>> GetVolunteerDashboard(CancellationToken cancellationToken)
    {
        var userId = ResolveUserId();
        var result = await _volunteerService.GetVolunteerDashboardAsync(userId, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Gets assignments for the current volunteer.
    /// </summary>
    [HttpGet("assignments")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<IReadOnlyList<VolunteerAssignmentItemDto>>>> GetMyAssignments(CancellationToken cancellationToken)
    {
        var userId = ResolveUserId();
        var result = await _volunteerService.GetMyAssignmentsAsync(userId, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Updates status of an assignment (Accept, Decline, Start, Complete).
    /// </summary>
    [HttpPost("assignments/{id}/status")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<VolunteerAssignmentItemDto>>> UpdateAssignmentStatus(
        string id,
        [FromBody] UpdateAssignmentStatusDto dto,
        CancellationToken cancellationToken)
    {
        var userId = ResolveUserId();
        var result = await _volunteerService.UpdateAssignmentStatusAsync(userId, id, dto, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Gets open volunteer opportunities and emergency shifts.
    /// </summary>
    [HttpGet("opportunities")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<IReadOnlyList<VolunteerOpportunityDto>>>> GetOpportunities(CancellationToken cancellationToken)
    {
        var result = await _volunteerService.GetOpportunitiesAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Volunteer accepts an available opportunity.
    /// </summary>
    [HttpPost("opportunities/{id}/accept")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<VolunteerAssignmentItemDto>>> AcceptOpportunity(
        string id,
        CancellationToken cancellationToken)
    {
        var userId = ResolveUserId();
        var result = await _volunteerService.AcceptOpportunityAsync(userId, id, cancellationToken);
        return Ok(result);
    }

    // -------------------------------------------------------------------------
    // Volunteer Coordinator Endpoints
    // -------------------------------------------------------------------------

    /// <summary>
    /// Gets Volunteer Coordinator Portal dashboard overview, metrics and workflows.
    /// </summary>
    [HttpGet("coordinator/dashboard")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<VolunteerCoordinatorDashboardDto>>> GetCoordinatorDashboard(CancellationToken cancellationToken)
    {
        var result = await _volunteerService.GetCoordinatorDashboardAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Creates / registers a new volunteer record in the directory.
    /// </summary>
    [HttpPost("records")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<VolunteerRosterItemDto>>> CreateVolunteerRecord(
        [FromBody] CreateVolunteerRecordDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _volunteerService.CreateVolunteerRecordAsync(dto, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Assigns a shift to a volunteer.
    /// </summary>
    [HttpPost("shifts/assign")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<bool>>> AssignShift(
        [FromBody] AssignVolunteerShiftDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _volunteerService.AssignShiftAsync(dto, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Gets AI matching recommendations between open tasks and volunteers.
    /// </summary>
    [HttpGet("matching")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<IReadOnlyList<VolunteerMatchingRecommendationDto>>>> GetAIMatching(CancellationToken cancellationToken)
    {
        var result = await _volunteerService.GetAIMatchingRecommendationsAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Legacy assign task endpoint.
    /// </summary>
    [HttpPost("assign")]
    [Authorize(Roles = "Coordinator,Admin,VolunteerCoordinator")]
    public async Task<ActionResult<Result<bool>>> AssignTask([FromBody] AssignTaskDto dto, CancellationToken cancellationToken)
    {
        var result = await _volunteerService.AssignTaskAsync(dto, cancellationToken);
        return Ok(result);
    }
}
