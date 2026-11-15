using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Partners;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;

namespace HumanitarianCrisisPlatform.API.Controllers;

[Authorize(Roles = "Coordinator,Admin,LogisticsManager")]
[Route("api/[controller]")]
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
}

