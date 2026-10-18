using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Shelters;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;

namespace HumanitarianCrisisPlatform.API.Controllers;

public class SheltersController : BaseApiController
{
    private readonly IShelterService _shelterService;

    public SheltersController(IShelterService shelterService)
    {
        _shelterService = shelterService;
    }

    [HttpGet]
    public async Task<ActionResult<Result<IReadOnlyList<ShelterDto>>>> GetAll()
    {
        var result = await _shelterService.GetAllSheltersAsync();
        return Ok(result);
    }

    [HttpGet("nearby")]
    public async Task<ActionResult<Result<IReadOnlyList<ShelterDto>>>> GetNearby(
        [FromQuery] decimal lat,
        [FromQuery] decimal lon,
        [FromQuery] double radius = 25)
    {
        var result = await _shelterService.FindNearestSheltersAsync(lat, lon, radius);
        return Ok(result);
    }

    [HttpPost("allocate")]
    [Authorize(Roles = "Coordinator,LogisticsManager,Admin")]
    public async Task<ActionResult<Result<bool>>> Allocate([FromBody] AllocateShelterDto dto)
    {
        var result = await _shelterService.AllocateShelterAsync(dto);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }
}
