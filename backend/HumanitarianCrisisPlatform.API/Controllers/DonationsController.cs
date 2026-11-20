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

    // =========================================================================
    // Donor & Funding Officer Portal Endpoints
    // =========================================================================

    /// <summary>
    /// Gets the comprehensive Funding Officer dashboard metrics, attention list, and activity feed.
    /// </summary>
    [HttpGet("dashboard")]
    public async Task<ActionResult<Result<FundingOfficerDashboardDto>>> GetDashboard(CancellationToken cancellationToken)
    {
        var result = await _donationService.GetFundingOfficerDashboardAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves aggregated donor profiles with verification status and contribution history.
    /// </summary>
    [HttpGet("donors")]
    public async Task<ActionResult<Result<IReadOnlyList<DonorProfileDto>>>> GetDonorProfiles(
        [FromQuery] string? type,
        [FromQuery] string? status,
        [FromQuery] string? search,
        CancellationToken cancellationToken)
    {
        var result = await _donationService.GetDonorProfilesAsync(type, status, search, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Updates a donor profile's verification status with a mandatory audit note.
    /// </summary>
    [HttpPost("donors/{donorId}/verify")]
    [Authorize(Roles = "Admin,Coordinator,LogisticsManager")]
    public async Task<ActionResult<Result<DonorProfileDto>>> UpdateDonorVerification(
        string donorId,
        [FromBody] UpdateDonorVerificationDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(Result<DonorProfileDto>.Failure("Invalid donor verification payload."));
        }

        var result = await _donationService.UpdateDonorVerificationAsync(donorId, dto, CurrentUserName, cancellationToken);
        if (!result.Succeeded)
        {
            return NotFound(result);
        }
        return Ok(result);
    }

    /// <summary>
    /// Retrieves donor directory records with filtering.
    /// </summary>
    [HttpGet("records")]
    public async Task<ActionResult<Result<IReadOnlyList<DonorRecordDto>>>> GetDonorRecords(
        [FromQuery] string? type,
        [FromQuery] string? status,
        [FromQuery] string? search,
        CancellationToken cancellationToken)
    {
        var result = await _donationService.GetDonorRecordsAsync(type, status, search, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves a specific donor record by code.
    /// </summary>
    [HttpGet("records/{id}")]
    public async Task<ActionResult<Result<DonorRecordDto>>> GetDonorRecordById(string id, CancellationToken cancellationToken)
    {
        var result = await _donationService.GetDonorRecordByIdAsync(id, cancellationToken);
        if (!result.Succeeded)
        {
            return NotFound(result);
        }
        return Ok(result);
    }

    /// <summary>
    /// Creates a new donor contribution record.
    /// </summary>
    [HttpPost("records")]
    [Authorize(Roles = "Admin,Coordinator,LogisticsManager")]
    public async Task<ActionResult<Result<DonorRecordDto>>> CreateDonorRecord(
        [FromBody] CreateDonorRecordDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(Result<DonorRecordDto>.Failure("Invalid donor record payload."));
        }

        var result = await _donationService.CreateDonorRecordAsync(dto, CurrentUserName, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    /// <summary>
    /// Submits a review decision (verify, allocate, dispatch, request-clarification, escalate, or reject) on a donation record.
    /// </summary>
    [HttpPost("records/{id}/decision")]
    [Authorize(Roles = "Admin,Coordinator,LogisticsManager")]
    public async Task<ActionResult<Result<DonorRecordDto>>> ProcessDonorDecision(
        string id,
        [FromBody] DonorDecisionDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(Result<DonorRecordDto>.Failure("Invalid decision payload."));
        }

        var result = await _donationService.ProcessDonorDecisionAsync(id, dto, CurrentUserName, cancellationToken);
        if (!result.Succeeded)
        {
            return result.Errors.Any(e => e.Contains("not found", StringComparison.OrdinalIgnoreCase))
                ? NotFound(result)
                : BadRequest(result);
        }
        return Ok(result);
    }

    /// <summary>
    /// Retrieves the list of active and historic emergency funding campaigns.
    /// </summary>
    [HttpGet("campaigns")]
    public async Task<ActionResult<Result<IReadOnlyList<FundingCampaignDto>>>> GetCampaigns(CancellationToken cancellationToken)
    {
        var result = await _donationService.GetCampaignsAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Creates a new emergency funding campaign.
    /// </summary>
    [HttpPost("campaigns")]
    [Authorize(Roles = "Admin,Coordinator,LogisticsManager")]
    public async Task<ActionResult<Result<FundingCampaignDto>>> CreateCampaign(
        [FromBody] CreateFundingCampaignDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(Result<FundingCampaignDto>.Failure("Invalid campaign payload."));
        }

        var result = await _donationService.CreateCampaignAsync(dto, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Updates the status of an emergency funding campaign (Active, Paused, Completed, Closed).
    /// </summary>
    [HttpPatch("campaigns/{id}/status")]
    [Authorize(Roles = "Admin,Coordinator,LogisticsManager")]
    public async Task<ActionResult<Result<FundingCampaignDto>>> UpdateCampaignStatus(
        string id,
        [FromBody] UpdateCampaignStatusDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(Result<FundingCampaignDto>.Failure("Invalid campaign status payload."));
        }

        var result = await _donationService.UpdateCampaignStatusAsync(id, dto, cancellationToken);
        if (!result.Succeeded) return NotFound(result);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves allocation balances (verified, allocated, unallocated) and allocation records.
    /// </summary>
    [HttpGet("allocations/overview")]
    public async Task<ActionResult<Result<AllocationOverviewDto>>> GetAllocationOverview(CancellationToken cancellationToken)
    {
        var result = await _donationService.GetAllocationOverviewAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves emergency resource / financial allocations requiring dual approval.
    /// </summary>
    [HttpGet("allocations")]
    public async Task<ActionResult<Result<IReadOnlyList<FundingAllocationDto>>>> GetAllocations(CancellationToken cancellationToken)
    {
        var result = await _donationService.GetAllocationsAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Creates a new allocation from a verified donation while guarding against over-allocation.
    /// </summary>
    [HttpPost("allocations")]
    [Authorize(Roles = "Admin,Coordinator,LogisticsManager")]
    public async Task<ActionResult<Result<FundingAllocationDto>>> CreateAllocation(
        [FromBody] CreateFundingAllocationDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(Result<FundingAllocationDto>.Failure("Invalid allocation payload."));
        }

        var result = await _donationService.CreateAllocationAsync(dto, CurrentUserName, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    /// <summary>
    /// Approves and co-signs an emergency funding allocation.
    /// </summary>
    [HttpPost("allocations/{id}/approve")]
    [Authorize(Roles = "Admin,Coordinator,LogisticsManager")]
    public async Task<ActionResult<Result<FundingAllocationDto>>> ApproveAllocation(
        string id,
        [FromBody] ApproveFundingAllocationDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(Result<FundingAllocationDto>.Failure("Invalid approval payload."));
        }

        var result = await _donationService.ApproveAllocationAsync(id, dto, CurrentUserName, cancellationToken);
        if (!result.Succeeded)
        {
            return result.Errors.Any(e => e.Contains("not found", StringComparison.OrdinalIgnoreCase))
                ? NotFound(result)
                : BadRequest(result);
        }
        return Ok(result);
    }

    /// <summary>
    /// Retrieves rule-based anomaly flags on donation records for human officer review.
    /// </summary>
    [HttpGet("suspicious-flags")]
    public async Task<ActionResult<Result<IReadOnlyList<SuspiciousFlagDto>>>> GetSuspiciousFlags(CancellationToken cancellationToken)
    {
        var result = await _donationService.GetSuspiciousFlagsAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Records a human officer decision on a flagged donation record (clear, investigate, escalate, reject).
    /// </summary>
    [HttpPost("suspicious-flags/{id}/resolve")]
    [Authorize(Roles = "Admin,Coordinator,LogisticsManager")]
    public async Task<ActionResult<Result<SuspiciousFlagDto>>> ResolveSuspiciousFlag(
        string id,
        [FromBody] ResolveSuspiciousFlagDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(Result<SuspiciousFlagDto>.Failure("Invalid resolution payload."));
        }

        var result = await _donationService.ResolveSuspiciousFlagAsync(id, dto, CurrentUserName, cancellationToken);
        if (!result.Succeeded)
        {
            return result.Errors.Any(e => e.Contains("not found", StringComparison.OrdinalIgnoreCase))
                ? NotFound(result)
                : BadRequest(result);
        }
        return Ok(result);
    }

    /// <summary>
    /// Generates real-time auditable transparency report metrics and filtered records.
    /// </summary>
    [HttpGet("reports")]
    public async Task<ActionResult<Result<TransparencyReportDto>>> GetTransparencyReport(
        [FromQuery] string? search,
        [FromQuery] string? crisisId,
        [FromQuery] string? status,
        [FromQuery] DateTime? fromDate,
        [FromQuery] DateTime? toDate,
        CancellationToken cancellationToken)
    {
        var result = await _donationService.GetTransparencyReportAsync(search, crisisId, status, fromDate, toDate, cancellationToken);
        return Ok(result);
    }
}

