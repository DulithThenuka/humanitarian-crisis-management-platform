using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.AI;
using HumanitarianCrisisPlatform.Application.DTOs.Coordinator;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;

namespace HumanitarianCrisisPlatform.API.Controllers;

[Authorize(Roles = "Coordinator,Admin")]
[Route("api/[controller]")]
public class CoordinatorController : BaseApiController
{
    private readonly ICoordinatorService _coordinatorService;

    public CoordinatorController(ICoordinatorService coordinatorService)
    {
        _coordinatorService = coordinatorService;
    }

    private string CurrentUserName =>
        User.FindFirst(ClaimTypes.Name)?.Value
        ?? User.FindFirst("name")?.Value
        ?? User.FindFirst(ClaimTypes.Email)?.Value
        ?? "Emergency Coordinator";

    /// <summary>
    /// Gets aggregated dashboard metrics, operational summaries, priority breakdown, and recent items for the Coordinator Portal.
    /// </summary>
    [HttpGet("overview")]
    public async Task<ActionResult<Result<CoordinatorOverviewDto>>> GetOverview(CancellationToken cancellationToken)
    {
        var result = await _coordinatorService.GetOverviewAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Searches and filters assistance request cases for coordination review.
    /// </summary>
    [HttpGet("cases")]
    public async Task<ActionResult<Result<IReadOnlyList<CoordinatorCaseDto>>>> GetCases(
        [FromQuery] string? status,
        [FromQuery] string? category,
        [FromQuery] string? priority,
        [FromQuery] string? search,
        CancellationToken cancellationToken)
    {
        var result = await _coordinatorService.GetCasesAsync(status, category, priority, search, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Gets a single assistance request case by its Guid or Reference Code.
    /// </summary>
    [HttpGet("cases/{idOrReference}")]
    public async Task<ActionResult<Result<CoordinatorCaseDto>>> GetCaseById(
        string idOrReference,
        CancellationToken cancellationToken)
    {
        var result = await _coordinatorService.GetCaseByIdAsync(idOrReference, cancellationToken);
        if (!result.Succeeded)
        {
            return NotFound(result);
        }
        return Ok(result);
    }

    /// <summary>
    /// Updates verification status (Verified / Rejected / UnderReview) and sets urgency level.
    /// </summary>
    [HttpPost("cases/{idOrReference}/verify")]
    public async Task<ActionResult<Result<CoordinatorCaseDto>>> VerifyCase(
        string idOrReference,
        [FromBody] VerifyCaseDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _coordinatorService.VerifyCaseAsync(idOrReference, dto, CurrentUserId, CurrentUserName, cancellationToken);
        if (!result.Succeeded)
        {
            return BadRequest(result);
        }
        return Ok(result);
    }

    /// <summary>
    /// Adds an internal operational note to a case log.
    /// </summary>
    [HttpPost("cases/{idOrReference}/notes")]
    public async Task<ActionResult<Result<CoordinatorCaseDto>>> AddCaseNote(
        string idOrReference,
        [FromBody] AddCaseNoteDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _coordinatorService.AddCaseNoteAsync(idOrReference, dto, CurrentUserId, CurrentUserName, cancellationToken);
        if (!result.Succeeded)
        {
            return BadRequest(result);
        }
        return Ok(result);
    }

    /// <summary>
    /// Accepts or overrides an AI-generated triage/urgency decision with human audit trail logging.
    /// </summary>
    [HttpPost("cases/{idOrReference}/ai-review")]
    public async Task<ActionResult<Result<CoordinatorCaseDto>>> ReviewAIDecision(
        string idOrReference,
        [FromBody] HumanOverrideDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _coordinatorService.ReviewAIDecisionAsync(idOrReference, dto, CurrentUserId, CurrentUserName, cancellationToken);
        if (!result.Succeeded)
        {
            return BadRequest(result);
        }
        return Ok(result);
    }

    /// <summary>
    /// Lists high-priority operational broadcast alerts.
    /// </summary>
    [HttpGet("alerts")]
    public async Task<ActionResult<Result<IReadOnlyList<CoordinatorAlertDto>>>> GetAlerts(CancellationToken cancellationToken)
    {
        var result = await _coordinatorService.GetAlertsAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Creates and broadcasts an emergency alert to responders.
    /// </summary>
    [HttpPost("alerts")]
    public async Task<ActionResult<Result<CoordinatorAlertDto>>> CreateAlert(
        [FromBody] CreateCoordinatorAlertDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _coordinatorService.CreateAlertAsync(dto, CurrentUserId, cancellationToken);
        if (!result.Succeeded)
        {
            return BadRequest(result);
        }
        return Ok(result);
    }

    /// <summary>
    /// Lists active crisis incidents tracked across the humanitarian zone.
    /// </summary>
    [HttpGet("incidents")]
    public async Task<ActionResult<Result<IReadOnlyList<CoordinatorIncidentDto>>>> GetIncidents(CancellationToken cancellationToken)
    {
        var result = await _coordinatorService.GetIncidentsAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Registers a newly declared crisis event / incident.
    /// </summary>
    [HttpPost("incidents")]
    public async Task<ActionResult<Result<CoordinatorIncidentDto>>> CreateIncident(
        [FromBody] CreateCoordinatorIncidentDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _coordinatorService.CreateIncidentAsync(dto, CurrentUserId, cancellationToken);
        if (!result.Succeeded)
        {
            return BadRequest(result);
        }
        return Ok(result);
    }

    /// <summary>
    /// Retrieves recent human and AI coordinator decisions audit history.
    /// </summary>
    [HttpGet("history")]
    public async Task<ActionResult<Result<IReadOnlyList<CoordinatorDecisionHistoryDto>>>> GetDecisionHistory(
        [FromQuery] int take = 20,
        CancellationToken cancellationToken = default)
    {
        var result = await _coordinatorService.GetDecisionHistoryAsync(take, cancellationToken);
        return Ok(result);
    }
}
