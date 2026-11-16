using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Coordinator;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;

namespace HumanitarianCrisisPlatform.API.Controllers;

[Authorize]
public class AlertsController : BaseApiController
{
    private readonly ICoordinatorService _coordinatorService;

    public AlertsController(ICoordinatorService coordinatorService)
    {
        _coordinatorService = coordinatorService;
    }

    [HttpGet]
    public async Task<ActionResult<Result<IReadOnlyList<EmergencyAlertDto>>>> GetAll(
        [FromQuery] string? tab = null,
        CancellationToken cancellationToken = default)
    {
        var result = await _coordinatorService.GetEmergencyAlertsAsync(tab, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Result<EmergencyAlertDto>>> GetById(
        string id,
        CancellationToken cancellationToken = default)
    {
        var result = await _coordinatorService.GetEmergencyAlertByIdAsync(id, cancellationToken);
        if (!result.Succeeded) return NotFound(result);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Coordinator,Admin")]
    public async Task<ActionResult<Result<EmergencyAlertDto>>> Create(
        [FromBody] CreateAlertDto dto,
        CancellationToken cancellationToken = default)
    {
        var result = await _coordinatorService.CreateEmergencyAlertAsync(dto, CurrentUserId, CurrentUserName, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Coordinator,Admin")]
    public async Task<ActionResult<Result<EmergencyAlertDto>>> Update(
        string id,
        [FromBody] UpdateAlertDto dto,
        CancellationToken cancellationToken = default)
    {
        var result = await _coordinatorService.UpdateEmergencyAlertAsync(id, dto, CurrentUserId, CurrentUserName, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{id}/resolve")]
    [Authorize(Roles = "Coordinator,Admin")]
    public async Task<ActionResult<Result<EmergencyAlertDto>>> Resolve(
        string id,
        [FromBody] ResolveAlertDto? dto = null,
        CancellationToken cancellationToken = default)
    {
        var result = await _coordinatorService.ResolveEmergencyAlertAsync(id, dto, CurrentUserId, CurrentUserName, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{id}/publish")]
    [Authorize(Roles = "Coordinator,Admin")]
    public async Task<ActionResult<Result<EmergencyAlertDto>>> Publish(
        string id,
        CancellationToken cancellationToken = default)
    {
        var result = await _coordinatorService.PublishEmergencyAlertAsync(id, CurrentUserId, CurrentUserName, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }
}
