using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Shelters;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;

namespace HumanitarianCrisisPlatform.API.Controllers;

public class SheltersController : BaseApiController
{
    private readonly IShelterService _shelterService;

    public SheltersController(IShelterService shelterService)
    {
        _shelterService = shelterService;
    }

    /// <summary>
    /// Gets verified emergency shelters with optional text search, district filter, and capacity status filter.
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<Result<IReadOnlyList<ShelterDto>>>> GetAll(
        [FromQuery] string? query = null,
        [FromQuery] string? district = null,
        [FromQuery] string? status = null,
        CancellationToken cancellationToken = default)
    {
        var result = await _shelterService.GetAllSheltersAsync(query, district, status, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Gets public shelter telemetry summary (total verified shelters, open/available beds, occupancy rate, district breakdown).
    /// </summary>
    [HttpGet("summary")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<ShelterSummaryDto>>> GetSummary(CancellationToken cancellationToken = default)
    {
        var result = await _shelterService.GetShelterSummaryAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Gets details for a specific shelter by ID.
    /// </summary>
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<ShelterDto>>> GetById(Guid id, CancellationToken cancellationToken = default)
    {
        var result = await _shelterService.GetByIdAsync(id, cancellationToken);
        if (!result.Succeeded) return NotFound(result);
        return Ok(result);
    }

    /// <summary>
    /// Finds nearest active high-ground shelters within a specified kilometer radius.
    /// </summary>
    [HttpGet("nearby")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<IReadOnlyList<ShelterDto>>>> GetNearby(
        [FromQuery] decimal lat,
        [FromQuery] decimal lon,
        [FromQuery] double radiusKm = 25,
        CancellationToken cancellationToken = default)
    {
        var result = await _shelterService.FindNearestSheltersAsync(lat, lon, radiusKm, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Gets the comprehensive operational dashboard telemetry for Shelter Managers.
    /// </summary>
    [HttpGet("dashboard")]
    public async Task<ActionResult<Result<ShelterDashboardDto>>> GetDashboard(CancellationToken cancellationToken = default)
    {
        var result = await _shelterService.GetShelterDashboardAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Creates a new operational shelter record.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Result<ShelterDto>>> CreateShelter(
        [FromBody] CreateShelterDto dto,
        CancellationToken cancellationToken = default)
    {
        var userId = CurrentUserId != Guid.Empty ? CurrentUserId : Guid.Parse("77777777-7777-7777-7777-777777777777");
        var result = await _shelterService.CreateShelterAsync(dto, userId, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result);
    }

    /// <summary>
    /// Updates capacity, facilities or operational details for an existing shelter.
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<Result<ShelterDto>>> UpdateShelter(
        Guid id,
        [FromBody] UpdateShelterDto dto,
        CancellationToken cancellationToken = default)
    {
        var userId = CurrentUserId != Guid.Empty ? CurrentUserId : Guid.Parse("77777777-7777-7777-7777-777777777777");
        var result = await _shelterService.UpdateShelterAsync(id, dto, userId, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    /// <summary>
    /// Executes a reviewed operational action (allocation, clarification, escalation) on a shelter.
    /// </summary>
    [HttpPost("{id:guid}/action")]
    public async Task<ActionResult<Result<ShelterActionResultDto>>> ExecuteAction(
        Guid id,
        [FromBody] ShelterActionRequestDto dto,
        CancellationToken cancellationToken = default)
    {
        var userId = CurrentUserId != Guid.Empty ? CurrentUserId : Guid.Parse("77777777-7777-7777-7777-777777777777");
        var userName = User.FindFirst(ClaimTypes.Name)?.Value ?? "Shelter Manager";
        var result = await _shelterService.ExecuteShelterActionAsync(id, dto, userId, userName, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    /// <summary>
    /// Allocates disaster evacuees into shelter facilities (authorized responders only).
    /// </summary>
    [HttpPost("allocate")]
    [Authorize(Roles = "Coordinator,LogisticsManager,Admin,ShelterManager")]
    public async Task<ActionResult<Result<bool>>> Allocate([FromBody] AllocateShelterDto dto, CancellationToken cancellationToken = default)
    {
        var result = await _shelterService.AllocateShelterAsync(dto, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    /// <summary>
    /// Gets evacuee placement allocations with filters.
    /// </summary>
    [HttpGet("placements")]
    public async Task<ActionResult<Result<IReadOnlyList<PlacementAllocationDto>>>> GetPlacements(
        [FromQuery] Guid? shelterId = null,
        [FromQuery] string? status = null,
        [FromQuery] string? search = null,
        CancellationToken cancellationToken = default)
    {
        var result = await _shelterService.GetPlacementsAsync(shelterId, status, search, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Creates an evacuee placement allocation record.
    /// </summary>
    [HttpPost("placements")]
    public async Task<ActionResult<Result<PlacementAllocationDto>>> CreatePlacement(
        [FromBody] CreatePlacementDto dto,
        CancellationToken cancellationToken = default)
    {
        var userId = CurrentUserId != Guid.Empty ? CurrentUserId : Guid.Parse("77777777-7777-7777-7777-777777777777");
        var result = await _shelterService.CreatePlacementAsync(dto, userId, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    /// <summary>
    /// Updates status for an evacuee placement allocation.
    /// </summary>
    [HttpPut("placements/{id:guid}/status")]
    public async Task<ActionResult<Result<PlacementAllocationDto>>> UpdatePlacementStatus(
        Guid id,
        [FromBody] UpdatePlacementStatusDto dto,
        CancellationToken cancellationToken = default)
    {
        var userId = CurrentUserId != Guid.Empty ? CurrentUserId : Guid.Parse("77777777-7777-7777-7777-777777777777");
        var result = await _shelterService.UpdatePlacementStatusAsync(id, dto, userId, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    /// <summary>
    /// Gets urgent resource and supply requests filed by shelter managers.
    /// </summary>
    [HttpGet("resource-requests")]
    public async Task<ActionResult<Result<IReadOnlyList<ShelterResourceRequestDto>>>> GetResourceRequests(
        [FromQuery] Guid? shelterId = null,
        [FromQuery] string? status = null,
        [FromQuery] string? urgency = null,
        CancellationToken cancellationToken = default)
    {
        var result = await _shelterService.GetResourceRequestsAsync(shelterId, status, urgency, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Creates a new urgent resource replenishment request for a shelter.
    /// </summary>
    [HttpPost("resource-requests")]
    public async Task<ActionResult<Result<ShelterResourceRequestDto>>> CreateResourceRequest(
        [FromBody] CreateShelterResourceRequestDto dto,
        CancellationToken cancellationToken = default)
    {
        var userId = CurrentUserId != Guid.Empty ? CurrentUserId : Guid.Parse("77777777-7777-7777-7777-777777777777");
        var userName = User.FindFirst(ClaimTypes.Name)?.Value ?? "Shelter Lead";
        var result = await _shelterService.CreateResourceRequestAsync(dto, userId, userName, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    /// <summary>
    /// Updates dispatch or fulfillment status for a shelter resource request.
    /// </summary>
    [HttpPut("resource-requests/{id:guid}/status")]
    public async Task<ActionResult<Result<ShelterResourceRequestDto>>> UpdateResourceRequestStatus(
        Guid id,
        [FromBody] UpdateShelterResourceStatusDto dto,
        CancellationToken cancellationToken = default)
    {
        var userId = CurrentUserId != Guid.Empty ? CurrentUserId : Guid.Parse("77777777-7777-7777-7777-777777777777");
        var result = await _shelterService.UpdateResourceRequestStatusAsync(id, dto, userId, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    /// <summary>
    /// Gets aggregated shelter reports and daily summary analytics.
    /// </summary>
    [HttpGet("reports")]
    public async Task<ActionResult<Result<ShelterReportsDto>>> GetReports(CancellationToken cancellationToken = default)
    {
        var result = await _shelterService.GetReportsAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Exports shelter operational report documents in requested format.
    /// </summary>
    [HttpGet("reports/export")]
    public async Task<ActionResult<Result<ExportReportResponseDto>>> ExportReport(
        [FromQuery] string reportType = "full-occupancy",
        [FromQuery] string format = "csv",
        CancellationToken cancellationToken = default)
    {
        var result = await _shelterService.ExportReportAsync(reportType, format, cancellationToken);
        return Ok(result);
    }
}
