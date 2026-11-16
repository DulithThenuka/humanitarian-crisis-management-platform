using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Coordinator;
using HumanitarianCrisisPlatform.Application.DTOs.Requests;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;

namespace HumanitarianCrisisPlatform.API.Controllers;

[Authorize(Roles = "Coordinator,Admin")]
public class CoordinatorController : BaseApiController
{
    private readonly ICoordinatorService _coordinatorService;

    public CoordinatorController(ICoordinatorService coordinatorService)
    {
        _coordinatorService = coordinatorService;
    }

    [HttpGet("overview")]
    public async Task<ActionResult<Result<CoordinatorOverviewDto>>> GetOverview(CancellationToken cancellationToken)
    {
        var result = await _coordinatorService.GetOverviewAsync(cancellationToken);
        return Ok(result);
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<Result<CoordinatorOverviewDto>>> GetDashboard(CancellationToken cancellationToken)
    {
        var result = await _coordinatorService.GetOverviewAsync(cancellationToken);
        return Ok(result);
    }

    [HttpGet("history")]
    public async Task<ActionResult<Result<CoordinatorDecisionHistoryDto>>> GetDecisionHistory(CancellationToken cancellationToken)
    {
        var result = await _coordinatorService.GetDecisionHistoryAsync(cancellationToken);
        return Ok(result);
    }

    [HttpPost("requests/{id}/verify")]
    public async Task<ActionResult<Result<AssistanceRequestResponseDto>>> VerifyRequest(
        string id,
        [FromBody] VerifyAssistanceRequestDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _coordinatorService.VerifyRequestAsync(id, dto, CurrentUserId, CurrentUserName, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [NonAction]
    public Task<ActionResult<Result<AssistanceRequestResponseDto>>> VerifyRequest(
        Guid id,
        VerifyAssistanceRequestDto dto,
        CancellationToken cancellationToken)
    {
        return VerifyRequest(id.ToString(), dto, cancellationToken);
    }

    [HttpPost("requests/{id}/escalate")]
    public async Task<ActionResult<Result<AssistanceRequestResponseDto>>> EscalateRequest(
        string id,
        [FromBody] EscalateAssistanceRequestDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _coordinatorService.EscalateRequestAsync(id, dto, CurrentUserId, CurrentUserName, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [NonAction]
    public Task<ActionResult<Result<AssistanceRequestResponseDto>>> EscalateRequest(
        Guid id,
        EscalateAssistanceRequestDto dto,
        CancellationToken cancellationToken)
    {
        return EscalateRequest(id.ToString(), dto, cancellationToken);
    }

    [HttpPost("requests/{id}/notes")]
    public async Task<ActionResult<Result<bool>>> AddRequestNote(
        string id,
        [FromBody] AddRequestNoteDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _coordinatorService.AddRequestNoteAsync(id, dto, CurrentUserId, CurrentUserName, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [NonAction]
    public Task<ActionResult<Result<bool>>> AddRequestNote(
        Guid id,
        AddRequestNoteDto dto,
        CancellationToken cancellationToken)
    {
        return AddRequestNote(id.ToString(), dto, cancellationToken);
    }

    [HttpPost("requests/{id}/request-info")]
    public async Task<ActionResult<Result<PriorityRequestSummaryDto>>> RequestAdditionalInformation(
        string id,
        [FromBody] RequestAdditionalInfoDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _coordinatorService.RequestAdditionalInfoAsync(id, dto, CurrentUserId, CurrentUserName, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [NonAction]
    public Task<ActionResult<Result<PriorityRequestSummaryDto>>> RequestAdditionalInformation(
        Guid id,
        RequestAdditionalInfoDto dto,
        CancellationToken cancellationToken)
    {
        return RequestAdditionalInformation(id.ToString(), dto, cancellationToken);
    }

    [HttpGet("resources")]
    public async Task<ActionResult<Result<ResourceCoordinationDashboardDto>>> GetResourceCoordination(CancellationToken cancellationToken)
    {
        var result = await _coordinatorService.GetResourceCoordinationAsync(cancellationToken);
        return Ok(result);
    }

    [HttpPost("resources/allocation-requests")]
    public async Task<ActionResult<Result<CoordinatorAllocationRequestDto>>> SubmitAllocationRequest(
        [FromBody] SubmitResourceAllocationRequestDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _coordinatorService.SubmitAllocationRequestAsync(dto, CurrentUserId, CurrentUserName, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }
}
