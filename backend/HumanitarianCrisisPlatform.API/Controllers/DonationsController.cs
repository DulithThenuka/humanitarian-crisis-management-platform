using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Donations;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;

namespace HumanitarianCrisisPlatform.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Route("api/donor")]
public class DonationsController : BaseApiController
{
    private readonly IDonationService _donationService;

    public DonationsController(IDonationService donationService)
    {
        _donationService = donationService;
    }

    /// <summary>
    /// Gets live financial and material telemetry for the Donor & Funding Management portal.
    /// </summary>
    [HttpGet("summary")]
    public async Task<ActionResult<Result<DonationSummaryDto>>> GetSummary(CancellationToken cancellationToken)
    {
        var result = await _donationService.GetSummaryAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Lists emergency relief packages with live funded counts.
    /// </summary>
    [HttpGet("packages")]
    public async Task<ActionResult<Result<IReadOnlyList<ReliefPackageDto>>>> GetReliefPackages(CancellationToken cancellationToken)
    {
        var result = await _donationService.GetReliefPackagesAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves donations and distribution ledger entries with optional filtering.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<Result<IReadOnlyList<DonationDto>>>> GetDonations(
        [FromQuery] int? status,
        [FromQuery] int? donationType,
        [FromQuery] Guid? crisisEventId,
        [FromQuery] string? search,
        CancellationToken cancellationToken)
    {
        var result = await _donationService.GetDonationsAsync(status, donationType, crisisEventId, search, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves a specific donation record by ID.
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Result<DonationDto>>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _donationService.GetDonationByIdAsync(id, cancellationToken);
        if (!result.Succeeded)
        {
            return NotFound(result);
        }
        return Ok(result);
    }

    /// <summary>
    /// Generates an official tax/aid receipt payload for a donation.
    /// </summary>
    [HttpGet("{id:guid}/receipt")]
    public async Task<ActionResult<Result<DonationReceiptDto>>> GetReceipt(Guid id, CancellationToken cancellationToken)
    {
        var result = await _donationService.GetReceiptAsync(id, cancellationToken);
        if (!result.Succeeded)
        {
            return NotFound(result);
        }
        return Ok(result);
    }

    /// <summary>
    /// Submits a new monetary or material donation pledge.
    /// </summary>
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Result<DonationDto>>> Create(
        [FromBody] CreateDonationDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(Result<DonationDto>.Failure("Invalid donation payload."));
        }

        var result = await _donationService.CreateDonationAsync(dto, CurrentUserId, cancellationToken);
        if (!result.Succeeded)
        {
            return BadRequest(result);
        }

        return CreatedAtAction(nameof(GetById), new { id = result.Data?.Id }, result);
    }

    /// <summary>
    /// Updates the supply-chain status of a donation (0=Pledged, 1=Received, 2=Distributed).
    /// </summary>
    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = "Admin,Coordinator,LogisticsManager")]
    public async Task<ActionResult<Result<DonationDto>>> UpdateStatus(
        Guid id,
        [FromBody] UpdateDonationStatusDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(Result<DonationDto>.Failure("Invalid status payload."));
        }

        var result = await _donationService.UpdateDonationStatusAsync(id, dto, CurrentUserId, cancellationToken);
        if (!result.Succeeded)
        {
            if (result.Errors.Any(e => e.Contains("not found", StringComparison.OrdinalIgnoreCase)))
            {
                return NotFound(result);
            }
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Deletes an erroneous or cancelled donation record.
    /// </summary>
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin,Coordinator")]
    public async Task<ActionResult<Result>> Delete(Guid id, CancellationToken cancellationToken)
    {
        var result = await _donationService.DeleteDonationAsync(id, cancellationToken);
        if (!result.Succeeded)
        {
            return NotFound(result);
        }
        return Ok(result);
    }
}

