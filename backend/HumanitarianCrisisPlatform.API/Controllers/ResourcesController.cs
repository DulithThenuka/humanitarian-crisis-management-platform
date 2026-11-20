using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Resources;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;
using HumanitarianCrisisPlatform.Application.Validators;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Route("api/resources")]
public class ResourcesController : BaseApiController
{
    private readonly IResourceAllocationService _resourceService;

    public ResourcesController(IResourceAllocationService resourceService)
    {
        _resourceService = resourceService;
    }

    // ==========================================
    // 1. Inventory Management
    // ==========================================

    /// <summary>
    /// Gets inventory items with optional filtering by category, status, storage location, and search.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<Result<IReadOnlyList<ResourceDto>>>> GetInventory(
        [FromQuery] string? category,
        [FromQuery] string? stockStatus,
        [FromQuery] string? location,
        [FromQuery] string? search,
        CancellationToken cancellationToken)
    {
        var result = await _resourceService.GetFilteredInventoryAsync(category, stockStatus, location, search, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Gets low stock items (threshold alert).
    /// </summary>
    [HttpGet("low-stock")]
    [Authorize(Roles = "Coordinator,LogisticsManager,Admin")]
    public async Task<ActionResult<Result<IReadOnlyList<ResourceDto>>>> GetLowStock(CancellationToken cancellationToken)
    {
        var result = await _resourceService.GetLowStockAlertsAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Gets a single inventory item by ID.
    /// </summary>
    [HttpGet("{id:guid}")]
    [Authorize(Roles = "LogisticsManager,Coordinator,Admin")]
    public async Task<ActionResult<Result<ResourceDto>>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _resourceService.GetResourceByIdAsync(id, cancellationToken);
        if (!result.Succeeded) return NotFound(result);
        return Ok(result);
    }

    /// <summary>
    /// Registers a new inventory item in the catalog.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "LogisticsManager,ResourceManager,Resource Manager,Coordinator,Admin")]
    public async Task<ActionResult<Result<ResourceDto>>> CreateResource([FromBody] CreateResourceDto dto, CancellationToken cancellationToken)
    {
        var validator = new CreateResourceValidator();
        var errors = validator.Validate(dto);
        if (errors.Count > 0)
        {
            return BadRequest(Result<ResourceDto>.Failure(string.Join("; ", errors)));
        }

        var result = await _resourceService.CreateResourceAsync(dto, CurrentUserName, cancellationToken);
        if (!result.Succeeded)
        {
            return BadRequest(result);
        }
        return CreatedAtAction(nameof(GetById), new { id = result.Data?.Id }, result);
    }

    /// <summary>
    /// Updates an existing inventory item.
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "LogisticsManager,ResourceManager,Resource Manager,Coordinator,Admin")]
    public async Task<ActionResult<Result<ResourceDto>>> UpdateResource(Guid id, [FromBody] UpdateResourceDto dto, CancellationToken cancellationToken)
    {
        var validator = new UpdateResourceValidator();
        var errors = validator.Validate(dto);
        if (errors.Count > 0)
        {
            return BadRequest(Result<ResourceDto>.Failure(string.Join("; ", errors)));
        }

        var result = await _resourceService.UpdateResourceAsync(id, dto, CurrentUserName, cancellationToken);
        if (!result.Succeeded)
        {
            if (result.Errors.Any(e => e.Contains("not found", StringComparison.OrdinalIgnoreCase)))
                return NotFound(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    /// <summary>
    /// Updates an existing inventory item's stock quantity directly with non-negative validation and status calculation.
    /// </summary>
    [HttpPut("{id:guid}/stock")]
    [Authorize(Roles = "LogisticsManager,ResourceManager,Resource Manager,Coordinator,Admin")]
    public async Task<ActionResult<Result<ResourceDto>>> UpdateStockQuantity(Guid id, [FromBody] UpdateStockQuantityDto dto, CancellationToken cancellationToken)
    {
        var validator = new UpdateStockQuantityValidator();
        var errors = validator.Validate(dto);
        if (errors.Count > 0)
        {
            return BadRequest(Result<ResourceDto>.Failure(string.Join("; ", errors)));
        }

        var result = await _resourceService.UpdateStockQuantityAsync(id, dto, CurrentUserName, cancellationToken);
        if (!result.Succeeded)
        {
            if (result.Errors.Any(e => e.Contains("not found", StringComparison.OrdinalIgnoreCase)))
                return NotFound(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    /// <summary>
    /// Deletes an inventory item if no active allocations exist.
    /// </summary>
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "LogisticsManager,ResourceManager,Resource Manager,Admin")]
    public async Task<ActionResult<Result<bool>>> DeleteResource(Guid id, CancellationToken cancellationToken)
    {
        var result = await _resourceService.DeleteResourceAsync(id, cancellationToken);
        if (!result.Succeeded)
        {
            if (result.Errors.Any(e => e.Contains("not found", StringComparison.OrdinalIgnoreCase)))
                return NotFound(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    /// <summary>
    /// Adjusts stock total quantity (+/- or absolute) with operational reason and automatic status recalculation.
    /// </summary>
    [HttpPost("{id:guid}/adjust-stock")]
    [Authorize(Roles = "LogisticsManager,ResourceManager,Resource Manager,Coordinator,Admin")]
    public async Task<ActionResult<Result<ResourceDto>>> AdjustStock(Guid id, [FromBody] StockAdjustmentDto dto, CancellationToken cancellationToken)
    {
        var validator = new StockAdjustmentValidator();
        var errors = validator.Validate(dto);
        if (errors.Count > 0)
        {
            return BadRequest(Result<ResourceDto>.Failure(string.Join("; ", errors)));
        }

        var result = await _resourceService.AdjustStockAsync(id, dto, CurrentUserName, cancellationToken);
        if (!result.Succeeded)
        {
            if (result.Errors.Any(e => e.Contains("not found", StringComparison.OrdinalIgnoreCase)))
                return NotFound(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ==========================================
    // 2. Resource Manager Overview & Dashboard
    // ==========================================

    /// <summary>
    /// Gets aggregated telemetry for the Resource Manager Overview dashboard.
    /// </summary>
    [HttpGet("overview")]
    [HttpGet("dashboard")]
    public async Task<ActionResult<Result<ResourceOverviewDto>>> GetOverview(CancellationToken cancellationToken)
    {
        var result = await _resourceService.GetOverviewMetricsAsync(cancellationToken);
        return Ok(result);
    }

    // ==========================================
    // 3. Allocation Requests & Decisions
    // ==========================================

    /// <summary>
    /// Dispatches allocation directly (existing endpoint).
    /// </summary>
    [HttpPost("dispatch")]
    [Authorize(Roles = "LogisticsManager,Coordinator,Admin")]
    public async Task<ActionResult<Result<bool>>> Dispatch([FromBody] AllocateResourceDto dto, CancellationToken cancellationToken)
    {
        var validator = new AllocateResourceValidator();
        var errors = validator.Validate(dto);
        if (errors.Count > 0)
        {
            return BadRequest(Result<bool>.Failure(string.Join("; ", errors)));
        }

        var result = await _resourceService.DispatchAllocationAsync(dto, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves resource allocation requests for review.
    /// </summary>
    [HttpGet("allocations")]
    [Authorize(Roles = "LogisticsManager,Coordinator,Admin")]
    public async Task<ActionResult<Result<IReadOnlyList<ResourceAllocationRequestDto>>>> GetAllocations(
        [FromQuery] int? status,
        [FromQuery] PriorityLevel? priority,
        [FromQuery] string? search,
        CancellationToken cancellationToken)
    {
        var result = await _resourceService.GetAllocationsAsync(status, priority, search, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Approves an allocation request.
    /// </summary>
    [HttpPost("allocations/{id:guid}/approve")]
    [Authorize(Roles = "LogisticsManager,Coordinator,Admin")]
    public async Task<ActionResult<Result<bool>>> ApproveAllocation(Guid id, [FromBody] ApproveAllocationDto dto, CancellationToken cancellationToken)
    {
        var result = await _resourceService.ApproveAllocationAsync(id, dto, CurrentUserName, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    /// <summary>
    /// Rejects an allocation request with reason.
    /// </summary>
    [HttpPost("allocations/{id:guid}/reject")]
    [Authorize(Roles = "LogisticsManager,Coordinator,Admin")]
    public async Task<ActionResult<Result<bool>>> RejectAllocation(Guid id, [FromBody] RejectAllocationDto dto, CancellationToken cancellationToken)
    {
        var result = await _resourceService.RejectAllocationAsync(id, dto, CurrentUserName, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    /// <summary>
    /// Requests clarification on an allocation request.
    /// </summary>
    [HttpPost("allocations/{id:guid}/clarify")]
    [Authorize(Roles = "LogisticsManager,Coordinator,Admin")]
    public async Task<ActionResult<Result<bool>>> ClarifyAllocation(Guid id, [FromBody] string note, CancellationToken cancellationToken)
    {
        var result = await _resourceService.ClarifyAllocationAsync(id, note, CurrentUserName, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    // ==========================================
    // 4. Distribution & Delivery Tracking
    // ==========================================

    /// <summary>
    /// Retrieves dispatches and distribution tracking records.
    /// </summary>
    [HttpGet("dispatches")]
    [Authorize(Roles = "LogisticsManager,Coordinator,Admin")]
    public async Task<ActionResult<Result<IReadOnlyList<DistributionTrackingDto>>>> GetDispatches(
        [FromQuery] string? search,
        CancellationToken cancellationToken)
    {
        var result = await _resourceService.GetDispatchesAsync(search, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Updates dispatch operational step / status.
    /// </summary>
    [HttpPost("dispatches/{id:guid}/status")]
    [Authorize(Roles = "LogisticsManager,Coordinator,Admin")]
    public async Task<ActionResult<Result<bool>>> UpdateDispatchStatus(Guid id, [FromBody] UpdateDispatchStatusDto dto, CancellationToken cancellationToken)
    {
        var result = await _resourceService.UpdateDispatchStatusAsync(id, dto, CurrentUserName, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    /// <summary>
    /// Confirms delivery signed at destination.
    /// </summary>
    [HttpPost("dispatches/{id:guid}/confirm-delivery")]
    [Authorize(Roles = "LogisticsManager,Coordinator,Admin")]
    public async Task<ActionResult<Result<bool>>> ConfirmDelivery(Guid id, [FromBody] ConfirmDeliveryDto dto, CancellationToken cancellationToken)
    {
        var result = await _resourceService.ConfirmDeliveryAsync(id, dto, CurrentUserName, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    // ==========================================
    // 5. Suppliers & Donations
    // ==========================================

    /// <summary>
    /// Lists approved suppliers and contributing vendors.
    /// </summary>
    [HttpGet("suppliers")]
    [Authorize(Roles = "LogisticsManager,Coordinator,Admin")]
    public async Task<ActionResult<Result<IReadOnlyList<SupplierDto>>>> GetSuppliers(
        [FromQuery] string? search,
        [FromQuery] string? status,
        CancellationToken cancellationToken)
    {
        var result = await _resourceService.GetSuppliersAsync(search, status, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Registers a new verified supplier or donor organisation.
    /// </summary>
    [HttpPost("suppliers")]
    [Authorize(Roles = "LogisticsManager,Coordinator,Admin")]
    public async Task<ActionResult<Result<SupplierDto>>> CreateSupplier([FromBody] CreateSupplierDto dto, CancellationToken cancellationToken)
    {
        var validator = new CreateSupplierValidator();
        var errors = validator.Validate(dto);
        if (errors.Count > 0)
        {
            return BadRequest(Result<SupplierDto>.Failure(string.Join("; ", errors)));
        }

        var result = await _resourceService.CreateSupplierAsync(dto, CurrentUserName, cancellationToken);
        return CreatedAtAction(nameof(GetSuppliers), result);
    }

    /// <summary>
    /// Lists received in-kind and supply donations.
    /// </summary>
    [HttpGet("donations")]
    [Authorize(Roles = "LogisticsManager,Coordinator,Admin")]
    public async Task<ActionResult<Result<IReadOnlyList<DonatedSupplyDto>>>> GetDonations(
        [FromQuery] string? search,
        CancellationToken cancellationToken)
    {
        var result = await _resourceService.GetDonatedSuppliesAsync(search, cancellationToken);
        return Ok(result);
    }

    // ==========================================
    // 6. Stock Alerts & Replenishment Guidance
    // ==========================================

    /// <summary>
    /// Gets rule-based stock health alerts and replenishment guidance.
    /// </summary>
    [HttpGet("alerts")]
    [Authorize(Roles = "LogisticsManager,Coordinator,Admin")]
    public async Task<ActionResult<Result<IReadOnlyList<StockAlertDto>>>> GetAlerts(CancellationToken cancellationToken)
    {
        var result = await _resourceService.GetStockAlertsAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Triggers replenishment reorder for low/critical stock.
    /// </summary>
    [HttpPost("reorder")]
    [Authorize(Roles = "LogisticsManager,Coordinator,Admin")]
    public async Task<ActionResult<Result<bool>>> ReorderResource([FromBody] ReorderRequestDto dto, CancellationToken cancellationToken)
    {
        var result = await _resourceService.ReorderResourceAsync(dto, CurrentUserName, cancellationToken);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    // ==========================================
    // 7. Activity History & Export
    // ==========================================

    /// <summary>
    /// Retrieves traceable operational activity audit logs.
    /// </summary>
    [HttpGet("activity")]
    [Authorize(Roles = "LogisticsManager,Coordinator,Admin")]
    public async Task<ActionResult<Result<IReadOnlyList<ActivityLogItemDto>>>> GetActivity(
        [FromQuery] string? search,
        CancellationToken cancellationToken)
    {
        var result = await _resourceService.GetActivityHistoryAsync(search, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Exports inventory, dispatches, or alerts data as CSV.
    /// </summary>
    [HttpGet("export")]
    [Authorize(Roles = "LogisticsManager,Coordinator,Admin")]
    public async Task<IActionResult> Export([FromQuery] string? type, CancellationToken cancellationToken)
    {
        var result = await _resourceService.ExportCsvAsync(type, cancellationToken);
        var filename = $"{type ?? "inventory"}-export-{DateTime.UtcNow:yyyyMMddHHmm}.csv";
        return File(System.Text.Encoding.UTF8.GetBytes(result.Data ?? ""), "text/csv", filename);
    }

    // ==========================================
    // 8. Duty Status
    // ==========================================

    /// <summary>
    /// Gets current officer duty status.
    /// </summary>
    [HttpGet("duty-status")]
    public async Task<ActionResult<Result<DutyStatusDto>>> GetDutyStatus(CancellationToken cancellationToken)
    {
        var result = await _resourceService.GetDutyStatusAsync(CurrentUserName, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Toggles officer duty status.
    /// </summary>
    [HttpPost("duty-status")]
    [Authorize(Roles = "LogisticsManager,Coordinator,Admin")]
    public async Task<ActionResult<Result<DutyStatusDto>>> SetDutyStatus([FromBody] DutyStatusDto dto, CancellationToken cancellationToken)
    {
        var result = await _resourceService.SetDutyStatusAsync(dto.IsOnDuty, CurrentUserName, cancellationToken);
        return Ok(result);
    }
}
