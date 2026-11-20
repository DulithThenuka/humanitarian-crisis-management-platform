using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Home;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;

namespace HumanitarianCrisisPlatform.API.Controllers;

[AllowAnonymous]
[Route("api/[controller]")]
public class HomeController : BaseApiController
{
    private readonly IHomeService _homeService;

    public HomeController(IHomeService homeService)
    {
        _homeService = homeService;
    }

    /// <summary>
    /// Gets real-time public summary data, active crisis status, shelter occupancy, and key operational metrics for the home landing page.
    /// </summary>
    [HttpGet("summary")]
    public async Task<ActionResult<Result<HomeSummaryDto>>> GetSummary(CancellationToken cancellationToken)
    {
        var result = await _homeService.GetHomeSummaryAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Public endpoint for citizens to track an emergency request by ticket reference code, GUID, or contact phone.
    /// </summary>
    [HttpGet("track-request/{reference}")]
    public async Task<ActionResult<Result<TrackRequestResultDto>>> TrackRequest(string reference, CancellationToken cancellationToken)
    {
        var result = await _homeService.TrackRequestAsync(reference, cancellationToken);
        if (!result.Succeeded)
        {
            return BadRequest(result);
        }
        return Ok(result);
    }

    /// <summary>
    /// Gets public safety guides, evacuation checklists, and emergency pack items by disaster hazard.
    /// </summary>
    [HttpGet("safety-guidance")]
    public async Task<ActionResult<Result<IReadOnlyList<SafetyGuidanceDto>>>> GetSafetyGuidance(CancellationToken cancellationToken)
    {
        var result = await _homeService.GetSafetyGuidanceAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Gets current high-priority emergency alerts and hazard zone advisories.
    /// </summary>
    [HttpGet("alerts")]
    public async Task<ActionResult<Result<IReadOnlyList<HomeAlertDto>>>> GetAlerts(CancellationToken cancellationToken)
    {
        var result = await _homeService.GetActiveAlertsAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Gets official emergency hotline directory for direct citizen assistance.
    /// </summary>
    [HttpGet("hotlines")]
    public async Task<ActionResult<Result<IReadOnlyList<EmergencyContactDto>>>> GetHotlines(CancellationToken cancellationToken)
    {
        var result = await _homeService.GetEmergencyHotlinesAsync(cancellationToken);
        return Ok(result);
    }
}

