using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Shelters;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;

namespace HumanitarianCrisisPlatform.API.Controllers;

[AllowAnonymous]
[Route("api/[controller]")]
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
        [FromQuery] double radius = 25,
        CancellationToken cancellationToken = default)
    {
        var result = await _shelterService.FindNearestSheltersAsync(lat, lon, radius, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Allocates disaster evacuees into shelter facilities (authorized responders only).
    /// </summary>
    [HttpPost("allocate")]
    [Authorize(Roles = "Coordinator,LogisticsManager,Admin")]
    public async Task<ActionResult<Result<bool>>> Allocate([FromBody] AllocateShelterDto dto, CancellationToken cancellationToken = default)
    {
        var result = await _shelterService.AllocateShelterAsync(dto, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }
}
