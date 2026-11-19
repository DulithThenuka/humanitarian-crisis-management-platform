using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Coordinator;
using HumanitarianCrisisPlatform.Application.DTOs.Requests;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.API.Controllers;

public class AssistanceRequestsController : BaseApiController
{
    private readonly IAssistanceRequestService _service;
    private readonly ICoordinatorService? _coordinatorService;

    public AssistanceRequestsController(
        IAssistanceRequestService service,
        ICoordinatorService coordinatorService)
    {
        _service = service;
        _coordinatorService = coordinatorService;
    }

    [HttpGet]
    public async Task<ActionResult<Result<IReadOnlyList<AssistanceRequestResponseDto>>>> GetAll(
        [FromQuery] RequestStatus? status,
        [FromQuery] PriorityLevel? urgency)
    {
        var result = await _service.GetAllAsync(status, urgency);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Result<AssistanceRequestResponseDto>>> GetById(Guid id)
    {
        var result = await _service.GetByIdAsync(id);
        if (!result.Succeeded) return NotFound(result);
        return Ok(result);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Result<AssistanceRequestResponseDto>>> Create([FromBody] CreateAssistanceRequestDto dto)
    {
        var result = await _service.CreateRequestAsync(dto, CurrentUserId);
        return CreatedAtAction(nameof(GetById), new { id = result.Data?.Id }, result);
    }

    [HttpPut("{id:guid}/status")]
    [Authorize(Roles = "Coordinator,Admin")]
    public async Task<ActionResult<Result<AssistanceRequestResponseDto>>> UpdateStatus(Guid id, [FromBody] UpdateRequestStatusDto dto)
    {
        var result = await _service.UpdateStatusAsync(id, dto);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{id}/verify")]
    [Authorize(Roles = "Coordinator,Admin")]
    public async Task<ActionResult<Result<AssistanceRequestResponseDto>>> Verify(
        string id,
        [FromBody] VerifyAssistanceRequestDto dto,
        CancellationToken cancellationToken)
    {
        if (_coordinatorService == null) return StatusCode(500, Result<AssistanceRequestResponseDto>.Failure("Coordinator service unavailable"));
        var result = await _coordinatorService.VerifyRequestAsync(id, dto, CurrentUserId, CurrentUserName, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{id}/escalate")]
    [Authorize(Roles = "Coordinator,Admin")]
    public async Task<ActionResult<Result<AssistanceRequestResponseDto>>> Escalate(
        string id,
        [FromBody] EscalateAssistanceRequestDto dto,
        CancellationToken cancellationToken)
    {
        if (_coordinatorService == null) return StatusCode(500, Result<AssistanceRequestResponseDto>.Failure("Coordinator service unavailable"));
        var result = await _coordinatorService.EscalateRequestAsync(id, dto, CurrentUserId, CurrentUserName, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{id}/notes")]
    [Authorize(Roles = "Coordinator,Admin")]
    public async Task<ActionResult<Result<bool>>> AddNote(
        string id,
        [FromBody] AddRequestNoteDto dto,
        CancellationToken cancellationToken)
    {
        if (_coordinatorService == null) return StatusCode(500, Result<bool>.Failure("Coordinator service unavailable"));
        var result = await _coordinatorService.AddRequestNoteAsync(id, dto, CurrentUserId, CurrentUserName, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }
}
