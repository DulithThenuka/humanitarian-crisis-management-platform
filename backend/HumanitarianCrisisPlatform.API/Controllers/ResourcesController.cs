using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Resources;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;

namespace HumanitarianCrisisPlatform.API.Controllers;

public class ResourcesController : BaseApiController
{
    private readonly IResourceAllocationService _resourceService;

    public ResourcesController(IResourceAllocationService resourceService)
    {
        _resourceService = resourceService;
    }

    [HttpGet]
    public async Task<ActionResult<Result<IReadOnlyList<ResourceDto>>>> GetInventory()
    {
        var result = await _resourceService.GetInventoryAsync();
        return Ok(result);
    }

    [HttpGet("low-stock")]
    [Authorize(Roles = "Coordinator,LogisticsManager,Admin")]
    public async Task<ActionResult<Result<IReadOnlyList<ResourceDto>>>> GetLowStock()
    {
        var result = await _resourceService.GetLowStockAlertsAsync();
        return Ok(result);
    }

    [HttpPost("dispatch")]
    [Authorize(Roles = "LogisticsManager,Coordinator,Admin")]
    public async Task<ActionResult<Result<bool>>> Dispatch([FromBody] AllocateResourceDto dto)
    {
        var result = await _resourceService.DispatchAllocationAsync(dto);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }
}
