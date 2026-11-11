using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Incidents;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;

namespace HumanitarianCrisisPlatform.API.Controllers;

[Authorize(Roles = AllSupportedRoles)]
public class IncidentsController : BaseApiController
{
    public const string StaffRoles =
        "CaseManager,Incident / Case Manager,IncidentManager,Coordinator,Emergency Coordinator,EmergencyCoordinator,Admin,System Administrator,SystemAdministrator";

    public const string AllSupportedRoles = StaffRoles + ",Citizen";

    private readonly IIncidentService _incidentService;
    private readonly ICaseAssignmentService _assignmentService;
    private readonly IIncidentDuplicateDetectionService _duplicateService;
    private readonly IIncidentAIReviewService _aiReviewService;
    private readonly IIncidentReportingService _reportingService;

    public IncidentsController(
        IIncidentService incidentService,
        ICaseAssignmentService assignmentService,
        IIncidentDuplicateDetectionService duplicateService,
        IIncidentAIReviewService aiReviewService,
        IIncidentReportingService reportingService)
    {
        _incidentService = incidentService;
        _assignmentService = assignmentService;
        _duplicateService = duplicateService;
        _aiReviewService = aiReviewService;
        _reportingService = reportingService;
    }

    [HttpGet("dashboard")]
    [Authorize(Roles = StaffRoles)]
    public async Task<ActionResult<Result<IncidentDashboardDto>>> GetDashboard(CancellationToken cancellationToken)
    {
        if (IsCitizenCaller()) return Forbid();
        var result = await _reportingService.GetDashboardAsync(CurrentUserId, CurrentUserName, cancellationToken);
        return Ok(result);
    }

    [HttpGet]
    [Authorize(Roles = AllSupportedRoles)]
    public async Task<ActionResult<Result<IReadOnlyList<IncidentResponseDto>>>> GetAll(
        [FromQuery] string? status = null,
        [FromQuery] string? operationalArea = null,
        [FromQuery] string? priority = null,
        [FromQuery] string? search = null,
        CancellationToken cancellationToken = default)
    {
        var result = await _incidentService.GetAllAsync(
            status,
            operationalArea,
            priority,
            search,
            CurrentUserId,
            CurrentUserRole,
            cancellationToken);

        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = AllSupportedRoles)]
    public async Task<ActionResult<Result<IncidentResponseDto>>> GetById(
        string id,
        CancellationToken cancellationToken)
    {
        var result = await _incidentService.GetByIdAsync(id, CurrentUserId, CurrentUserRole, cancellationToken);
        if (!result.Succeeded)
        {
            if (result.Errors.Any(e => e.StartsWith("FORBIDDEN", StringComparison.OrdinalIgnoreCase)))
                return Forbid();
            return NotFound(result);
        }
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = AllSupportedRoles)]
    public async Task<ActionResult<Result<IncidentResponseDto>>> Create(
        [FromBody] CreateIncidentDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _incidentService.CreateAsync(
            dto,
            CurrentUserId,
            CurrentUserName,
            string.IsNullOrWhiteSpace(CurrentUserRole) ? "CaseManager" : CurrentUserRole,
            cancellationToken);

        if (!result.Succeeded) return BadRequest(result);
        return CreatedAtAction(nameof(GetById), new { id = result.Data?.Id }, result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = StaffRoles)]
    public async Task<ActionResult<Result<IncidentResponseDto>>> Update(
        string id,
        [FromBody] UpdateIncidentDto dto,
        CancellationToken cancellationToken)
    {
        if (IsCitizenCaller()) return Forbid();
        var result = await _incidentService.UpdateAsync(
            id,
            dto,
            CurrentUserId,
            CurrentUserName,
            CurrentUserRole,
            cancellationToken);

        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpGet("my-assigned")]
    [Authorize(Roles = StaffRoles)]
    public async Task<ActionResult<Result<IReadOnlyList<IncidentResponseDto>>>> GetMyAssigned(
        CancellationToken cancellationToken)
    {
        if (IsCitizenCaller()) return Forbid();
        var result = await _assignmentService.GetMyAssignedAsync(CurrentUserId, CurrentUserName, cancellationToken);
        return Ok(result);
    }

    [HttpGet("unassigned")]
    [Authorize(Roles = StaffRoles)]
    public async Task<ActionResult<Result<IReadOnlyList<IncidentResponseDto>>>> GetUnassigned(
        CancellationToken cancellationToken)
    {
        if (IsCitizenCaller()) return Forbid();
        var result = await _assignmentService.GetUnassignedAsync(cancellationToken);
        return Ok(result);
    }

    [HttpPost("{id}/assign")]
    [Authorize(Roles = StaffRoles)]
    public async Task<ActionResult<Result<IncidentResponseDto>>> Assign(
        string id,
        [FromBody] AssignIncidentDto dto,
        CancellationToken cancellationToken)
    {
        if (IsCitizenCaller()) return Forbid();
        var result = await _assignmentService.AssignAsync(
            id,
            dto,
            CurrentUserId,
            CurrentUserName,
            CurrentUserRole,
            cancellationToken);

        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{id}/reassign")]
    [Authorize(Roles = StaffRoles)]
    public async Task<ActionResult<Result<IncidentResponseDto>>> Reassign(
        string id,
        [FromBody] ReassignIncidentDto dto,
        CancellationToken cancellationToken)
    {
        if (IsCitizenCaller()) return Forbid();
        var result = await _assignmentService.ReassignAsync(
            id,
            dto,
            CurrentUserId,
            CurrentUserName,
            CurrentUserRole,
            cancellationToken);

        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = StaffRoles)]
    public async Task<ActionResult<Result<IncidentResponseDto>>> UpdateStatus(
        string id,
        [FromBody] UpdateIncidentStatusDto dto,
        CancellationToken cancellationToken)
    {
        if (IsCitizenCaller()) return Forbid();
        var result = await _incidentService.UpdateStatusAsync(
            id,
            dto,
            CurrentUserId,
            CurrentUserName,
            CurrentUserRole,
            cancellationToken);

        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPatch("{id}/priority")]
    [Authorize(Roles = StaffRoles)]
    public async Task<ActionResult<Result<IncidentResponseDto>>> UpdatePriority(
        string id,
        [FromBody] UpdateIncidentPriorityDto dto,
        CancellationToken cancellationToken)
    {
        if (IsCitizenCaller()) return Forbid();
        var result = await _incidentService.UpdatePriorityAsync(
            id,
            dto,
            CurrentUserId,
            CurrentUserName,
            CurrentUserRole,
            cancellationToken);

        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{id}/verify")]
    [Authorize(Roles = StaffRoles)]
    public async Task<ActionResult<Result<IncidentResponseDto>>> Verify(
        string id,
        [FromBody] VerifyIncidentDto dto,
        CancellationToken cancellationToken)
    {
        if (IsCitizenCaller()) return Forbid();
        var result = await _incidentService.VerifyAsync(
            id,
            dto,
            CurrentUserId,
            CurrentUserName,
            CurrentUserRole,
            cancellationToken);

        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{id}/escalate")]
    [Authorize(Roles = StaffRoles)]
    public async Task<ActionResult<Result<IncidentResponseDto>>> Escalate(
        string id,
        [FromBody] EscalateIncidentDto dto,
        CancellationToken cancellationToken)
    {
        if (IsCitizenCaller()) return Forbid();
        var result = await _incidentService.EscalateAsync(
            id,
            dto,
            CurrentUserId,
            CurrentUserName,
            CurrentUserRole,
            cancellationToken);

        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{id}/resolve")]
    [Authorize(Roles = StaffRoles)]
    public async Task<ActionResult<Result<IncidentResponseDto>>> Resolve(
        string id,
        [FromBody] ResolveIncidentDto dto,
        CancellationToken cancellationToken)
    {
        if (IsCitizenCaller()) return Forbid();
        var result = await _incidentService.ResolveAsync(
            id,
            dto,
            CurrentUserId,
            CurrentUserName,
            CurrentUserRole,
            cancellationToken);

        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{id}/close")]
    [Authorize(Roles = StaffRoles)]
    public async Task<ActionResult<Result<IncidentResponseDto>>> Close(
        string id,
        [FromBody] CloseIncidentDto dto,
        CancellationToken cancellationToken)
    {
        if (IsCitizenCaller()) return Forbid();
        var result = await _incidentService.CloseAsync(
            id,
            dto,
            CurrentUserId,
            CurrentUserName,
            CurrentUserRole,
            cancellationToken);

        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpGet("{id}/history")]
    [Authorize(Roles = AllSupportedRoles)]
    public async Task<ActionResult<Result<IncidentHistoryDto>>> GetHistory(
        string id,
        CancellationToken cancellationToken)
    {
        var result = await _incidentService.GetHistoryAsync(id, CurrentUserId, CurrentUserRole, cancellationToken);
        if (!result.Succeeded)
        {
            if (result.Errors.Any(e => e.StartsWith("FORBIDDEN", StringComparison.OrdinalIgnoreCase)))
                return Forbid();
            return NotFound(result);
        }
        return Ok(result);
    }

    [HttpGet("{id}/possible-duplicates")]
    [Authorize(Roles = StaffRoles)]
    public async Task<ActionResult<Result<IReadOnlyList<IncidentDuplicateCandidateDto>>>> GetPossibleDuplicates(
        string id,
        CancellationToken cancellationToken)
    {
        if (IsCitizenCaller()) return Forbid();
        var result = await _duplicateService.FindPossibleDuplicatesAsync(id, cancellationToken);
        if (!result.Succeeded) return NotFound(result);
        return Ok(result);
    }

    [HttpPost("{id}/merge")]
    [Authorize(Roles = StaffRoles)]
    public async Task<ActionResult<Result<IncidentResponseDto>>> Merge(
        string id,
        [FromBody] MergeIncidentDto dto,
        CancellationToken cancellationToken)
    {
        if (IsCitizenCaller()) return Forbid();
        var result = await _incidentService.MergeAsync(
            id,
            dto,
            CurrentUserId,
            CurrentUserName,
            CurrentUserRole,
            cancellationToken);

        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpGet("{id}/ai-review")]
    [Authorize(Roles = StaffRoles)]
    public async Task<ActionResult<Result<IncidentAIReviewDto>>> GetAIReview(
        string id,
        CancellationToken cancellationToken)
    {
        if (IsCitizenCaller()) return Forbid();
        var result = await _aiReviewService.GetAIReviewAsync(id, cancellationToken);
        if (!result.Succeeded) return NotFound(result);
        return Ok(result);
    }

    [HttpPost("{id}/ai-review/generate")]
    [Authorize(Roles = StaffRoles)]
    public async Task<ActionResult<Result<IncidentAIReviewDto>>> GenerateAIReview(
        string id,
        CancellationToken cancellationToken)
    {
        if (IsCitizenCaller()) return Forbid();
        var result = await _aiReviewService.GenerateAIReviewAsync(
            id,
            CurrentUserId,
            CurrentUserName,
            CurrentUserRole,
            cancellationToken);

        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{id}/ai-review/decision")]
    [Authorize(Roles = StaffRoles)]
    public async Task<ActionResult<Result<IncidentAIReviewDto>>> RecordAIReviewDecision(
        string id,
        [FromBody] RecordAIReviewDecisionDto dto,
        CancellationToken cancellationToken)
    {
        if (IsCitizenCaller()) return Forbid();
        var result = await _aiReviewService.RecordHumanDecisionAsync(
            id,
            dto,
            CurrentUserId,
            CurrentUserName,
            CurrentUserRole,
            cancellationToken);

        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpGet("{id}/communications")]
    [Authorize(Roles = AllSupportedRoles)]
    public async Task<ActionResult<Result<IReadOnlyList<IncidentCommunicationDto>>>> GetCommunications(
        string id,
        CancellationToken cancellationToken)
    {
        var result = await _incidentService.GetCommunicationsAsync(id, CurrentUserId, CurrentUserRole, cancellationToken);
        if (!result.Succeeded)
        {
            if (result.Errors.Any(e => e.StartsWith("FORBIDDEN", StringComparison.OrdinalIgnoreCase)))
                return Forbid();
            return NotFound(result);
        }
        return Ok(result);
    }

    [HttpPost("{id}/communications")]
    [Authorize(Roles = AllSupportedRoles)]
    public async Task<ActionResult<Result<IncidentCommunicationDto>>> AddCommunication(
        string id,
        [FromBody] CreateIncidentCommunicationDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _incidentService.AddCommunicationAsync(
            id,
            dto,
            CurrentUserId,
            CurrentUserName,
            CurrentUserRole,
            cancellationToken);

        if (!result.Succeeded)
        {
            if (result.Errors.Any(e => e.StartsWith("FORBIDDEN", StringComparison.OrdinalIgnoreCase)))
                return Forbid();
            return BadRequest(result);
        }
        return Ok(result);
    }

    [HttpGet("reports/summary")]
    [Authorize(Roles = StaffRoles)]
    public async Task<ActionResult<Result<IncidentReportSummaryDto>>> GetReportSummary(
        [FromQuery] string? operation = null,
        CancellationToken cancellationToken = default)
    {
        if (IsCitizenCaller()) return Forbid();
        var result = await _reportingService.GetReportSummaryAsync(operation, cancellationToken);
        return Ok(result);
    }

    private bool IsCitizenCaller()
        => string.Equals(CurrentUserRole, "Citizen", StringComparison.OrdinalIgnoreCase);
}

