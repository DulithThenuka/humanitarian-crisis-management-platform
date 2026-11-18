using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Partners;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;

namespace HumanitarianCrisisPlatform.API.Controllers;

[Authorize(Roles = "Coordinator,Admin,LogisticsManager,PartnerOfficer,PartnerOrganisationOfficer,Partner")]
[Route("api/[controller]")]
[Route("api/partner")]
[Route("api/partner-officer")]
public class PartnersController : BaseApiController
{
    private readonly IPartnerService _partnerService;

    public PartnersController(IPartnerService partnerService)
    {
        _partnerService = partnerService;
    }

    /// <summary>
    /// Gets aggregated metrics for the Inter-Agency Partner Coordination Portal.
    /// </summary>
    [HttpGet("summary")]
    public async Task<ActionResult<Result<PartnerPortalSummaryDto>>> GetSummary(CancellationToken cancellationToken)
    {
        var result = await _partnerService.GetDashboardSummaryAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Lists accredited partner organisations with their zones and commitments.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<Result<IReadOnlyList<PartnerOrganisationDto>>>> GetPartners(
        [FromQuery] string? search = null,
        [FromQuery] string? status = null,
        CancellationToken cancellationToken = default)
    {
        var result = await _partnerService.GetPartnersAsync(search, status, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Gets a single partner organisation dossier by ID.
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Result<PartnerOrganisationDto>>> GetPartnerById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _partnerService.GetPartnerByIdAsync(id, cancellationToken);
        if (!result.Succeeded)
            return NotFound(result);

        return Ok(result);
    }

    /// <summary>
    /// Registers a new partner organisation.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Coordinator,Admin")]
    public async Task<ActionResult<Result<PartnerOrganisationDto>>> CreatePartner(
        [FromBody] CreatePartnerOrganisationDto dto,
        CancellationToken cancellationToken)
    {
        var userId = CurrentUserId == Guid.Empty ? null : CurrentUserId.ToString();
        var result = await _partnerService.CreatePartnerAsync(dto, userId, cancellationToken);
        if (!result.Succeeded)
            return BadRequest(result);

        return CreatedAtAction(nameof(GetPartnerById), new { id = result.Data!.Id }, result);
    }

    /// <summary>
    /// Updates a partner organisation's operational status and MoU status.
    /// </summary>
    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = "Coordinator,Admin")]
    public async Task<ActionResult<Result<PartnerOrganisationDto>>> UpdatePartnerStatus(
        Guid id,
        [FromBody] UpdatePartnerStatusDto dto,
        CancellationToken cancellationToken)
    {
        var userId = CurrentUserId == Guid.Empty ? null : CurrentUserId.ToString();
        var result = await _partnerService.UpdatePartnerStatusAsync(id, dto, userId, cancellationToken);
        if (!result.Succeeded)
            return NotFound(result);

        return Ok(result);
    }

    /// <summary>
    /// Lists all material commitments across partner organisations (optionally filtered by partnerId).
    /// </summary>
    [HttpGet("commitments")]
    public async Task<ActionResult<Result<IReadOnlyList<PartnerCommitmentDto>>>> GetCommitments(
        [FromQuery] Guid? partnerId = null,
        CancellationToken cancellationToken = default)
    {
        var result = await _partnerService.GetCommitmentsAsync(partnerId, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Logs a new resource commitment / inter-agency pledge for a partner organisation.
    /// </summary>
    [HttpPost("commitments")]
    public async Task<ActionResult<Result<PartnerCommitmentDto>>> LogCommitment(
        [FromBody] CreatePartnerCommitmentDto dto,
        CancellationToken cancellationToken)
    {
        var userId = CurrentUserId == Guid.Empty ? (Guid?)null : CurrentUserId;
        var result = await _partnerService.LogCommitmentAsync(dto, userId, cancellationToken);
        if (!result.Succeeded)
            return BadRequest(result);

        return Ok(result);
    }

    /// <summary>
    /// Updates the deployment status of a partner resource commitment.
    /// </summary>
    [HttpPatch("commitments/{commitmentId:guid}/status")]
    public async Task<ActionResult<Result<PartnerCommitmentDto>>> UpdateCommitmentStatus(
        Guid commitmentId,
        [FromBody] UpdateCommitmentStatusDto dto,
        CancellationToken cancellationToken)
    {
        var userId = CurrentUserId == Guid.Empty ? null : CurrentUserId.ToString();
        var result = await _partnerService.UpdateCommitmentStatusAsync(commitmentId, dto, userId, cancellationToken);
        if (!result.Succeeded)
            return NotFound(result);

        return Ok(result);
    }

    /// <summary>
    /// Lists all sector coordination zones and their assigned partner organisations.
    /// </summary>
    [HttpGet("zones")]
    public async Task<ActionResult<Result<IReadOnlyList<SectorZoneDto>>>> GetSectorZones(CancellationToken cancellationToken)
    {
        var result = await _partnerService.GetSectorZonesAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Assigns a partner organisation to a sector coordination zone.
    /// </summary>
    [HttpPost("zones/assign")]
    [Authorize(Roles = "Coordinator,Admin")]
    public async Task<ActionResult<Result<SectorZoneDto>>> AssignPartnerToZone(
        [FromBody] AssignPartnerZoneDto dto,
        CancellationToken cancellationToken)
    {
        var userId = CurrentUserId == Guid.Empty ? null : CurrentUserId.ToString();
        var result = await _partnerService.AssignPartnerToZoneAsync(dto, userId, cancellationToken);
        if (!result.Succeeded)
            return BadRequest(result);

        return Ok(result);
    }

    // =========================================================================
    // Partner Organisation Officer Endpoints
    // =========================================================================

    /// <summary>
    /// Gets the comprehensive dashboard metrics and telemetry for the Partner Organisation Officer.
    /// </summary>
    [HttpGet("officer/dashboard")]
    public async Task<ActionResult<Result<PartnerOfficerDashboardDto>>> GetOfficerDashboard(
        [FromQuery] string? organisation,
        CancellationToken cancellationToken)
    {
        var result = await _partnerService.GetOfficerDashboardAsync(organisation, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves commitments and assistance records scoped for the partner organisation officer.
    /// </summary>
    [HttpGet("officer/records")]
    public async Task<ActionResult<Result<IReadOnlyList<PartnerRecordDto>>>> GetOfficerRecords(
        [FromQuery] string? status,
        [FromQuery] string? search,
        [FromQuery] string? operationalArea,
        CancellationToken cancellationToken)
    {
        var result = await _partnerService.GetOfficerRecordsAsync(status, search, operationalArea, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves a single partner record by code (e.g. COM-118).
    /// </summary>
    [HttpGet("officer/records/{id}")]
    public async Task<ActionResult<Result<PartnerRecordDto>>> GetOfficerRecordById(string id, CancellationToken cancellationToken)
    {
        var result = await _partnerService.GetOfficerRecordByIdAsync(id, cancellationToken);
        if (!result.Succeeded)
            return NotFound(result);

        return Ok(result);
    }

    /// <summary>
    /// Registers a new partner commitment / assistance prototype record.
    /// </summary>
    [HttpPost("officer/records")]
    public async Task<ActionResult<Result<PartnerRecordDto>>> CreateOfficerRecord(
        [FromBody] CreatePartnerRecordDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
            return BadRequest(Result<PartnerRecordDto>.Failure("Invalid record payload."));

        var result = await _partnerService.CreateOfficerRecordAsync(dto, CurrentUserName, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Processes an authorised partner action (confirm, clarify, escalate) on a record.
    /// </summary>
    [HttpPost("officer/records/{id}/action")]
    public async Task<ActionResult<Result<PartnerRecordDto>>> ProcessRecordAction(
        string id,
        [FromBody] ProcessPartnerRecordActionDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
            return BadRequest(Result<PartnerRecordDto>.Failure("Invalid action payload."));

        var result = await _partnerService.ProcessRecordActionAsync(id, dto, CurrentUserName, cancellationToken);
        if (!result.Succeeded)
            return NotFound(result);

        return Ok(result);
    }

    /// <summary>
    /// Retrieves inter-agency coordination timeline entries for the partner workspace.
    /// </summary>
    [HttpGet("officer/timeline")]
    public async Task<ActionResult<Result<IReadOnlyList<PartnerTimelineEntryDto>>>> GetTimeline(CancellationToken cancellationToken)
    {
        var result = await _partnerService.GetTimelineAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Posts a new operational coordination entry to the partner workspace.
    /// </summary>
    [HttpPost("officer/timeline")]
    public async Task<ActionResult<Result<PartnerTimelineEntryDto>>> AddTimelineEntry(
        [FromBody] CreatePartnerTimelineEntryDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
            return BadRequest(Result<PartnerTimelineEntryDto>.Failure("Invalid timeline entry payload."));

        var result = await _partnerService.AddTimelineEntryAsync(dto, CurrentUserName, cancellationToken);
        return Ok(result);
    }
}

