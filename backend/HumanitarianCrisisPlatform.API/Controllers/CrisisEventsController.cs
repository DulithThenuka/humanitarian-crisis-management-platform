using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Coordinator;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;

namespace HumanitarianCrisisPlatform.API.Controllers;

[Authorize(Roles = "Coordinator,Admin,LogisticsManager,CaseManager")]
public class CrisisEventsController : BaseApiController
{
    private readonly ICoordinatorService _coordinatorService;

    public CrisisEventsController(ICoordinatorService coordinatorService)
    {
        _coordinatorService = coordinatorService;
    }

    [HttpGet]
    public async Task<ActionResult<Result<IReadOnlyList<CrisisEventResponseDto>>>> GetAll(
        [FromQuery] bool? activeOnly = null,
        CancellationToken cancellationToken = default)
    {
        var result = await _coordinatorService.GetCrisisEventsAsync(activeOnly, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Result<CrisisEventResponseDto>>> GetById(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var result = await _coordinatorService.GetCrisisEventByIdAsync(id, cancellationToken);
        if (!result.Succeeded) return NotFound(result);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Coordinator,Admin")]
    public async Task<ActionResult<Result<CrisisEventResponseDto>>> Create(
        [FromBody] CreateCrisisEventDto dto,
        CancellationToken cancellationToken = default)
    {
        var result = await _coordinatorService.CreateCrisisEventAsync(dto, CurrentUserId, CurrentUserName, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return CreatedAtAction(nameof(GetById), new { id = result.Data?.Id }, result);
    }
}
