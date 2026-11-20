using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Resources;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Services;

public interface IResourceAllocationService
{
    // Existing methods (100% backwards compatible)
    Task<Result<IReadOnlyList<ResourceDto>>> GetInventoryAsync(CancellationToken cancellationToken = default);
    Task<Result<bool>> DispatchAllocationAsync(AllocateResourceDto dto, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<ResourceDto>>> GetLowStockAlertsAsync(CancellationToken cancellationToken = default);

    // Enhanced Resource & Logistics Manager methods
    Task<Result<ResourceOverviewDto>> GetOverviewMetricsAsync(CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<ResourceDto>>> GetFilteredInventoryAsync(string? category, string? stockStatus, string? location, string? search, CancellationToken cancellationToken = default);
    Task<Result<ResourceDto>> GetResourceByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<ResourceDto>> CreateResourceAsync(CreateResourceDto dto, string? user = null, CancellationToken cancellationToken = default);
    Task<Result<ResourceDto>> UpdateResourceAsync(Guid id, UpdateResourceDto dto, string? user = null, CancellationToken cancellationToken = default);
    Task<Result<ResourceDto>> UpdateStockQuantityAsync(Guid id, UpdateStockQuantityDto dto, string? user = null, CancellationToken cancellationToken = default);
    Task<Result<bool>> DeleteResourceAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<ResourceDto>> AdjustStockAsync(Guid id, StockAdjustmentDto dto, string? user = null, CancellationToken cancellationToken = default);

    // Allocation decisions
    Task<Result<IReadOnlyList<ResourceAllocationRequestDto>>> GetAllocationsAsync(int? status = null, PriorityLevel? priority = null, string? search = null, CancellationToken cancellationToken = default);
    Task<Result<bool>> ApproveAllocationAsync(Guid id, ApproveAllocationDto dto, string? user = null, CancellationToken cancellationToken = default);
    Task<Result<bool>> RejectAllocationAsync(Guid id, RejectAllocationDto dto, string? user = null, CancellationToken cancellationToken = default);
    Task<Result<bool>> ClarifyAllocationAsync(Guid id, string? note, string? user = null, CancellationToken cancellationToken = default);

    // Distribution & delivery tracking
    Task<Result<IReadOnlyList<DistributionTrackingDto>>> GetDispatchesAsync(string? search = null, CancellationToken cancellationToken = default);
    Task<Result<bool>> UpdateDispatchStatusAsync(Guid id, UpdateDispatchStatusDto dto, string? user = null, CancellationToken cancellationToken = default);
    Task<Result<bool>> ConfirmDeliveryAsync(Guid id, ConfirmDeliveryDto dto, string? user = null, CancellationToken cancellationToken = default);

    // Suppliers & donations
    Task<Result<IReadOnlyList<SupplierDto>>> GetSuppliersAsync(string? search = null, string? status = null, CancellationToken cancellationToken = default);
    Task<Result<SupplierDto>> CreateSupplierAsync(CreateSupplierDto dto, string? user = null, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<DonatedSupplyDto>>> GetDonatedSuppliesAsync(string? search = null, CancellationToken cancellationToken = default);

    // Stock alerts & rule-based replenishment recommendations
    Task<Result<IReadOnlyList<StockAlertDto>>> GetStockAlertsAsync(CancellationToken cancellationToken = default);
    Task<Result<bool>> ReorderResourceAsync(ReorderRequestDto dto, string? user = null, CancellationToken cancellationToken = default);

    // Activity audit trail & export
    Task<Result<IReadOnlyList<ActivityLogItemDto>>> GetActivityHistoryAsync(string? search = null, CancellationToken cancellationToken = default);
    Task<Result<string>> ExportCsvAsync(string? type, CancellationToken cancellationToken = default);

    // Duty status
    Task<Result<DutyStatusDto>> GetDutyStatusAsync(string? user = null, CancellationToken cancellationToken = default);
    Task<Result<DutyStatusDto>> SetDutyStatusAsync(bool isOnDuty, string? user = null, CancellationToken cancellationToken = default);
}
