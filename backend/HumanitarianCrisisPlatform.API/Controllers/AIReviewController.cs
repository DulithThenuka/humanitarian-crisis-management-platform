using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.AI;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;

namespace HumanitarianCrisisPlatform.API.Controllers;

[Authorize(Roles = "Coordinator,Emergency Coordinator,EmergencyCoordinator,CaseManager,Incident / Case Manager,IncidentManager,Admin,Administrator,System Administrator,SystemAdministrator,LogisticsManager,ShelterManager")]
[Route("api/aireview")]
[Route("api/ai-review")]
public class AIReviewController : BaseApiController
{
    private readonly IAIDecisionService _aiService;

    public AIReviewController(IAIDecisionService aiService)
    {
        _aiService = aiService;
    }

    [HttpGet("status")]
    public async Task<ActionResult<Result<AIProviderStatusDto>>> GetStatus(CancellationToken cancellationToken)
    {
        var status = await _aiService.GetProviderStatusAsync(cancellationToken);
        return Ok(Result<AIProviderStatusDto>.Success(status));
    }

    [HttpGet("diagnostic")]
    [HttpPost("diagnostic")]
    public async Task<ActionResult<Result<AIDiagnosticResultDto>>> RunDiagnostic(CancellationToken cancellationToken)
    {
        var result = await _aiService.RunDiagnosticAsync(cancellationToken);
        return Ok(result);
    }

    [HttpGet("telemetry")]
    public async Task<ActionResult<Result<AITelemetryDto>>> GetTelemetry(CancellationToken cancellationToken)
    {
        var result = await _aiService.GetTelemetryMetricsAsync(cancellationToken);
        return Ok(result);
    }

    [HttpGet("overview")]
    public async Task<ActionResult<Result<AIOperationsOverviewDto>>> GetOverview(CancellationToken cancellationToken)
    {
        var overview = await _aiService.GetOperationsOverviewAsync(cancellationToken);
        return Ok(Result<AIOperationsOverviewDto>.Success(overview));
    }

    [HttpGet("queue")]
    public async Task<ActionResult<Result<List<AIDecisionQueueItemDto>>>> GetQueue(
        [FromQuery] string? tab = null,
        [FromQuery] string? priority = null,
        [FromQuery] string? search = null,
        CancellationToken cancellationToken = default)
    {
        var queue = await _aiService.GetDecisionQueueAsync(tab, priority, search, cancellationToken);
        return Ok(Result<List<AIDecisionQueueItemDto>>.Success(queue));
    }

    [HttpGet("case/{caseId}")]
    public async Task<ActionResult<Result<AIDecisionCaseDetailDto>>> GetCaseDetail(
        string caseId,
        CancellationToken cancellationToken)
    {
        var detail = await _aiService.GetCaseDetailAsync(caseId, cancellationToken);
        if (detail == null)
            return NotFound(Result<AIDecisionCaseDetailDto>.Failure($"Case '{caseId}' not found."));

        return Ok(Result<AIDecisionCaseDetailDto>.Success(detail));
    }

    [HttpPost("decision")]
    public async Task<ActionResult<Result<AIDecisionCaseDetailDto>>> RecordDecision(
        [FromBody] RecordAIDecisionInputDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _aiService.RecordHumanDecisionAsync(
            dto,
            CurrentUserId,
            CurrentUserName,
            CurrentUserRole,
            cancellationToken);

        if (!result.Succeeded)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpPost("services/{serviceId}/execute")]
    public async Task<ActionResult<Result<WorkspaceServiceResultDto>>> ExecuteWorkspaceService(
        string serviceId,
        [FromBody] ExecuteWorkspaceServiceDto input,
        CancellationToken cancellationToken)
    {
        var result = await _aiService.ExecuteWorkspaceServiceAsync(serviceId, input, cancellationToken);
        return Ok(result);
    }

    [HttpGet("trace/{caseId}")]
    public async Task<ActionResult<Result<DecisionTraceDetailDto>>> GetDecisionTrace(
        string caseId,
        CancellationToken cancellationToken)
    {
        var trace = await _aiService.GetDecisionTraceAsync(caseId, cancellationToken);
        if (trace == null)
            return NotFound(Result<DecisionTraceDetailDto>.Failure($"Case '{caseId}' not found."));

        return Ok(Result<DecisionTraceDetailDto>.Success(trace));
    }

    [HttpPost("trace/{caseId}/notes")]
    public async Task<ActionResult<Result<SupervisorNoteDto>>> AddSupervisorNote(
        string caseId,
        [FromBody] AddSupervisorNoteDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _aiService.AddSupervisorNoteAsync(
            caseId,
            dto,
            CurrentUserId,
            CurrentUserName,
            CurrentUserRole,
            cancellationToken);

        if (!result.Succeeded)
            return BadRequest(result);

        return Ok(result);
    }

    // Existing endpoints for backward compatibility
    [HttpPost("override")]
    public async Task<ActionResult<Result<bool>>> OverrideDecision([FromBody] HumanOverrideDto dto)
    {
        dto.Action = "Override";
        var result = await _aiService.ProcessHumanOverrideAsync(dto, CurrentUserId);
        return Ok(result);
    }

    [HttpPost("approve")]
    public async Task<ActionResult<Result<bool>>> ApproveDecision([FromBody] HumanOverrideDto dto)
    {
        dto.Action = "Approve";
        var result = await _aiService.ProcessHumanOverrideAsync(dto, CurrentUserId);
        return Ok(result);
    }
}
