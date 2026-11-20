using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Crisis;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Route("api/crisis-events")]
public class CrisesController : BaseApiController
{
    private readonly ICrisisService _crisisService;

    public CrisesController(ICrisisService crisisService)
    {
        _crisisService = crisisService;
    }

    /// <summary>
    /// Gets aggregated summary metrics for the crisis management dashboard.
    /// </summary>
    [HttpGet("summary")]
    public async Task<ActionResult<Result<CrisisSummaryStatsDto>>> GetSummaryStats(CancellationToken cancellationToken)
    {
        var result = await _crisisService.GetCrisisSummaryStatsAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves a list of crisis events with optional filtering by active status, disaster type, severity, and search keywords.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<Result<IReadOnlyList<CrisisEventDto>>>> GetCrises(
        [FromQuery] bool? isActive,
        [FromQuery] DisasterType? disasterType,
        [FromQuery] int? minSeverity,
        [FromQuery] string? search,
        CancellationToken cancellationToken)
    {
        var result = await _crisisService.GetCrisesAsync(isActive, disasterType, minSeverity, search, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves detailed operational dossier for a specific crisis, including linked shelters, requests, and deployed units.
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Result<CrisisDetailDto>>> GetCrisisById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _crisisService.GetCrisisByIdAsync(id, cancellationToken);
        if (!result.Succeeded)
        {
            return NotFound(result);
        }
        return Ok(result);
    }

    /// <summary>
    /// Declares and launches a new crisis event and sets up its operational zone.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin,Coordinator")]
    public async Task<ActionResult<Result<CrisisEventDto>>> CreateCrisis(
        [FromBody] CreateCrisisEventDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(Result<CrisisEventDto>.Failure("Invalid model payload."));
        }

        var result = await _crisisService.CreateCrisisAsync(dto, CurrentUserId, cancellationToken);
        if (!result.Succeeded)
        {
            return BadRequest(result);
        }

        return CreatedAtAction(nameof(GetCrisisById), new { id = result.Data?.Id }, result);
    }

    /// <summary>
    /// Updates operational parameters, severity, and area boundaries for an existing crisis.
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,Coordinator")]
    public async Task<ActionResult<Result<CrisisEventDto>>> UpdateCrisis(
        Guid id,
        [FromBody] UpdateCrisisEventDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(Result<CrisisEventDto>.Failure("Invalid model payload."));
        }

        var result = await _crisisService.UpdateCrisisAsync(id, dto, CurrentUserId, cancellationToken);
        if (!result.Succeeded)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Closes an active crisis event, marking operations as resolved with an optional post-incident summary.
    /// </summary>
    [HttpPut("{id:guid}/close")]
    [Authorize(Roles = "Admin,Coordinator")]
    public async Task<ActionResult<Result<bool>>> CloseCrisis(
        Guid id,
        [FromBody] CloseCrisisDto? dto,
        CancellationToken cancellationToken)
    {
        var result = await _crisisService.CloseCrisisAsync(id, dto, CurrentUserId, cancellationToken);
        if (!result.Succeeded)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Dispatches and assigns a dedicated emergency response unit / rescue team to a crisis zone.
    /// </summary>
    [HttpPost("{id:guid}/assign-team")]
    [Authorize(Roles = "Admin,Coordinator")]
    public async Task<ActionResult<Result<bool>>> AssignResponseTeam(
        Guid id,
        [FromBody] AssignCrisisTeamDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(Result<bool>.Failure("Invalid model payload."));
        }

        var result = await _crisisService.AssignResponseTeamAsync(id, dto, CurrentUserId, cancellationToken);
        if (!result.Succeeded)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Retrieves hazard polygon layers and geographic exclusion zones for crisis mapping.
    /// </summary>
    [HttpGet("hazard-zones")]
    public async Task<ActionResult<Result<IReadOnlyList<CrisisHazardZoneDto>>>> GetAllHazardZones(CancellationToken cancellationToken)
    {
        var result = await _crisisService.GetHazardZonesAsync(null, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves hazard polygon zones for a specific crisis event.
    /// </summary>
    [HttpGet("{id:guid}/hazard-zones")]
    public async Task<ActionResult<Result<IReadOnlyList<CrisisHazardZoneDto>>>> GetCrisisHazardZones(Guid id, CancellationToken cancellationToken)
    {
        var result = await _crisisService.GetHazardZonesAsync(id, cancellationToken);
        return Ok(result);
    }
}

