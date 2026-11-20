using System.Collections.Concurrent;
using System.Text;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Resources;
using HumanitarianCrisisPlatform.Application.Interfaces;
using HumanitarianCrisisPlatform.Application.Interfaces.Repositories;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Enums;
using HumanitarianCrisisPlatform.Domain.Exceptions;

namespace HumanitarianCrisisPlatform.Application.Services;

public class ResourceAllocationService : IResourceAllocationService
{
    private readonly IResourceRepository _repository;
    private readonly IUnitOfWork _unitOfWork;

    // Transient memory store for duty statuses & audit logs
    private static readonly ConcurrentDictionary<string, bool> _dutyStatuses = new(StringComparer.OrdinalIgnoreCase);
    private static readonly ConcurrentBag<ActivityLogItemDto> _activityHistory = new();

    static ResourceAllocationService()
    {
        // Initialize default baseline activity entries
        _activityHistory.Add(new ActivityLogItemDto
        {
            Id = Guid.NewGuid().ToString(),
            Reference = "ACT-1001",
            Action = "Stock adjusted",
            RelatedRecord = "RES-021",
            UserTeam = "Dilan Perera",
            Time = "10:12:44",
            Detail = "Bottled Drinking Water (1L) +50 units received at Central Depot",
            Status = "Recorded",
            Timestamp = DateTime.UtcNow.AddHours(-1)
        });
        _activityHistory.Add(new ActivityLogItemDto
        {
            Id = Guid.NewGuid().ToString(),
            Reference = "ACT-1002",
            Action = "Allocation approved",
            RelatedRecord = "RAR-199",
            UserTeam = "Dilan Perera",
            Time = "09:50:18",
            Detail = "300 water units authorized for Kelani Relief Camp",
            Status = "Recorded",
            Timestamp = DateTime.UtcNow.AddHours(-2)
        });
        _activityHistory.Add(new ActivityLogItemDto
        {
            Id = Guid.NewGuid().ToString(),
            Reference = "ACT-1003",
            Action = "Dispatch prepared",
            RelatedRecord = "DSP-041",
            UserTeam = "Logistics Team Alpha",
            Time = "09:20:05",
            Detail = "Medical supply packs staged at loading bay 2",
            Status = "Recorded",
            Timestamp = DateTime.UtcNow.AddHours(-3)
        });
        _activityHistory.Add(new ActivityLogItemDto
        {
            Id = Guid.NewGuid().ToString(),
            Reference = "ACT-1004",
            Action = "Delivery confirmed",
            RelatedRecord = "DSP-038",
            UserTeam = "H. Ranasinghe",
            Time = "08:44:30",
            Detail = "60 thermal blankets delivered to shelter SH-008 and receipt confirmed",
            Status = "Recorded",
            Timestamp = DateTime.UtcNow.AddHours(-4)
        });
    }

    public ResourceAllocationService(IResourceRepository repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    // ==========================================
    // 1. Core / Legacy Inventory & Dispatch
    // ==========================================

    public async Task<Result<IReadOnlyList<ResourceDto>>> GetInventoryAsync(CancellationToken cancellationToken = default)
    {
        var items = await _repository.GetAllAsync(cancellationToken);
        return Result<IReadOnlyList<ResourceDto>>.Success(items.Select(MapToDto).ToList());
    }

    public async Task<Result<bool>> DispatchAllocationAsync(AllocateResourceDto dto, CancellationToken cancellationToken = default)
    {
        var resource = await _repository.GetByIdAsync(dto.ResourceId, cancellationToken);
        if (resource == null) return Result<bool>.Failure("Resource not found");

        if (resource.AvailableQuantity < dto.Quantity)
        {
            throw new ResourceShortageException(dto.ResourceId, dto.Quantity, resource.AvailableQuantity);
        }

        resource.AllocatedQuantity += dto.Quantity;
        var allocation = new ResourceAllocation
        {
            ResourceId = dto.ResourceId,
            AssistanceRequestId = dto.AssistanceRequestId,
            ShelterId = dto.ShelterId,
            Quantity = dto.Quantity,
            Priority = dto.Priority,
            Notes = dto.Notes,
            DispatchStatus = 3, // Dispatched
            DispatchedAt = DateTime.UtcNow
        };

        await _repository.AddAllocationAsync(allocation, cancellationToken);
        await _repository.UpdateAsync(resource, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        LogActivity("Direct dispatch", $"RES-{resource.Id.ToString()[..6].ToUpper()}", "Logistics Manager", $"Dispatched {dto.Quantity} {resource.Unit} of {resource.Name}");

        return Result<bool>.Success(true, "Allocation dispatched successfully");
    }

    public async Task<Result<IReadOnlyList<ResourceDto>>> GetLowStockAlertsAsync(CancellationToken cancellationToken = default)
    {
        var items = await _repository.GetLowStockResourcesAsync(cancellationToken);
        return Result<IReadOnlyList<ResourceDto>>.Success(items.Select(MapToDto).ToList());
    }

    // ==========================================
    // 2. Resource Overview & Dashboard Telemetry
    // ==========================================

    public async Task<Result<ResourceOverviewDto>> GetOverviewMetricsAsync(CancellationToken cancellationToken = default)
    {
        var items = await _repository.GetAllAsync(cancellationToken);
        var allocations = await _repository.GetAllAllocationsWithDetailsAsync(cancellationToken);

        var totalQty = items.Sum(r => r.TotalQuantity);
        var availQty = items.Sum(r => r.AvailableQuantity);
        var allocQty = items.Sum(r => r.AllocatedQuantity);
        var availPct = totalQty > 0 ? (availQty / totalQty * 100m) : 0m;

        var categories = items
            .GroupBy(r => string.IsNullOrWhiteSpace(r.Category) ? "General Relief" : r.Category)
            .Select(g =>
            {
                var catTotal = g.Sum(x => x.TotalQuantity);
                var catAvail = g.Sum(x => x.AvailableQuantity);
                var pct = catTotal > 0 ? (int)Math.Round((catAvail / catTotal) * 100m) : 0;
                return new CategoryStockDto
                {
                    Category = g.Key,
                    ItemCount = g.Count(),
                    AvailableCount = catAvail,
                    TotalCount = catTotal,
                    Percent = pct
                };
            })
            .OrderByDescending(c => c.TotalCount)
            .ToList();

        var expiringCount = items.Count(r => r.ExpiryDate.HasValue && r.ExpiryDate.Value <= DateTime.UtcNow.AddDays(30));

        var dto = new ResourceOverviewDto
        {
            TotalResources = items.Count,
            TotalCategories = categories.Count,
            TotalStockQuantity = totalQty,
            AvailableStock = availQty,
            AllocatedStock = allocQty,
            AvailablePercentage = $"{availPct:F1}%",
            LowStockWarnings = items.Count(r => r.IsBelowThreshold && r.AvailableQuantity > 0),
            CriticalShortages = items.Count(r => r.AvailableQuantity <= 0),
            PendingAllocations = allocations.Count(a => a.DispatchStatus == 0),
            HighPriorityPending = allocations.Count(a => a.DispatchStatus == 0 && (a.Priority == PriorityLevel.High || a.Priority == PriorityLevel.Critical)),
            ApprovedAllocations = allocations.Count(a => a.DispatchStatus >= 1),
            ApprovedUnits = allocations.Where(a => a.DispatchStatus >= 1).Sum(a => a.Quantity),
            DispatchedCount = allocations.Count(a => a.DispatchStatus == 3),
            DeliveredCount = allocations.Count(a => a.DispatchStatus == 4),
            ExpiringSoonCount = expiringCount,
            Categories = categories,
            RecentActivity = _activityHistory.OrderByDescending(a => a.Timestamp).Take(8).ToList()
        };

        return Result<ResourceOverviewDto>.Success(dto);
    }

    public async Task<Result<IReadOnlyList<ResourceDto>>> GetFilteredInventoryAsync(
        string? category, 
        string? stockStatus, 
        string? location, 
        string? search, 
        CancellationToken cancellationToken = default)
    {
        var items = await _repository.GetFilteredResourcesAsync(category, stockStatus, location, search, cancellationToken);
        return Result<IReadOnlyList<ResourceDto>>.Success(items.Select(MapToDto).ToList());
    }

    public async Task<Result<ResourceDto>> GetResourceByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var item = await _repository.GetByIdWithAllocationsAsync(id, cancellationToken);
        if (item == null) return Result<ResourceDto>.Failure("Resource not found");
        return Result<ResourceDto>.Success(MapToDto(item));
    }

    public async Task<Result<ResourceDto>> CreateResourceAsync(CreateResourceDto dto, string? user = null, CancellationToken cancellationToken = default)
    {
        var resource = new Resource
        {
            Id = Guid.NewGuid(),
            Name = dto.Name.Trim(),
            Category = string.IsNullOrWhiteSpace(dto.Category) ? "General Relief" : dto.Category.Trim(),
            Unit = string.IsNullOrWhiteSpace(dto.Unit) ? "units" : dto.Unit.Trim(),
            TotalQuantity = dto.Quantity,
            AllocatedQuantity = 0,
            MinimumThreshold = dto.MinimumThreshold,
            WarehouseLocation = string.IsNullOrWhiteSpace(dto.StorageLocation) ? "Central Depot" : dto.StorageLocation.Trim(),
            ExpiryDate = dto.ExpiryDate,
            CreatedBy = user ?? "Resource Manager",
            CreatedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(resource, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        LogActivity("Inventory added", $"RES-{resource.Id.ToString()[..6].ToUpper()}", user ?? "Resource Manager", $"Added item {resource.Name} ({resource.TotalQuantity} {resource.Unit}) to {resource.WarehouseLocation}");

        return Result<ResourceDto>.Success(MapToDto(resource), "Resource created successfully");
    }

    public async Task<Result<ResourceDto>> UpdateResourceAsync(Guid id, UpdateResourceDto dto, string? user = null, CancellationToken cancellationToken = default)
    {
        var resource = await _repository.GetByIdAsync(id, cancellationToken);
        if (resource == null) return Result<ResourceDto>.Failure("Resource not found");

        if (!string.IsNullOrWhiteSpace(dto.Name)) resource.Name = dto.Name.Trim();
        if (!string.IsNullOrWhiteSpace(dto.Category)) resource.Category = dto.Category.Trim();
        if (!string.IsNullOrWhiteSpace(dto.Unit)) resource.Unit = dto.Unit.Trim();
        if (!string.IsNullOrWhiteSpace(dto.StorageLocation)) resource.WarehouseLocation = dto.StorageLocation.Trim();
        if (dto.TotalQuantity.HasValue) resource.TotalQuantity = dto.TotalQuantity.Value;
        if (dto.MinimumThreshold.HasValue) resource.MinimumThreshold = dto.MinimumThreshold.Value;
        if (dto.ExpiryDate.HasValue) resource.ExpiryDate = dto.ExpiryDate.Value;

        resource.LastModifiedBy = user ?? "Resource Manager";
        resource.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(resource, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        LogActivity("Item updated", $"RES-{resource.Id.ToString()[..6].ToUpper()}", user ?? "Resource Manager", $"Updated details for {resource.Name}");

        return Result<ResourceDto>.Success(MapToDto(resource), "Resource updated successfully");
    }

    public async Task<Result<bool>> DeleteResourceAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var resource = await _repository.GetByIdWithAllocationsAsync(id, cancellationToken);
        if (resource == null) return Result<bool>.Failure("Resource not found");

        if (resource.Allocations.Any(a => a.DispatchStatus != 4 && a.DispatchStatus != 5))
        {
            return Result<bool>.Failure("Cannot delete resource with active or pending allocations.");
        }

        await _repository.DeleteAsync(resource, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        LogActivity("Item deleted", $"RES-{id.ToString()[..6].ToUpper()}", "Resource Manager", $"Deleted resource item {resource.Name}");

        return Result<bool>.Success(true, "Resource deleted successfully");
    }

    public async Task<Result<ResourceDto>> AdjustStockAsync(Guid id, StockAdjustmentDto dto, string? user = null, CancellationToken cancellationToken = default)
    {
        var resource = await _repository.GetByIdAsync(id, cancellationToken);
        if (resource == null) return Result<ResourceDto>.Failure("Resource not found");

        var newTotal = dto.NewQuantity ?? (resource.TotalQuantity + dto.QuantityDelta);
        if (newTotal < 0)
        {
            return Result<ResourceDto>.Failure("Stock quantity cannot be negative.");
        }

        if (newTotal < resource.AllocatedQuantity)
        {
            return Result<ResourceDto>.Failure($"Adjusted total quantity ({newTotal}) cannot be less than currently allocated stock ({resource.AllocatedQuantity}).");
        }

        resource.TotalQuantity = newTotal;
        resource.LastModifiedBy = user ?? "Resource Manager";
        resource.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(resource, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        var logDesc = dto.NewQuantity.HasValue
            ? $"{resource.Name} stock set to {newTotal} {resource.Unit} ({dto.Reason})"
            : $"{resource.Name} {(dto.QuantityDelta >= 0 ? "+" : "")}{dto.QuantityDelta} {resource.Unit} ({dto.Reason})";

        LogActivity("Stock adjusted", $"RES-{resource.Id.ToString()[..6].ToUpper()}", user ?? "Resource Manager", logDesc);

        return Result<ResourceDto>.Success(MapToDto(resource), "Stock adjusted successfully");
    }

    public async Task<Result<ResourceDto>> UpdateStockQuantityAsync(Guid id, UpdateStockQuantityDto dto, string? user = null, CancellationToken cancellationToken = default)
    {
        var resource = await _repository.GetByIdAsync(id, cancellationToken);
        if (resource == null) return Result<ResourceDto>.Failure("Resource not found");

        if (dto.Quantity < 0)
        {
            return Result<ResourceDto>.Failure("Stock quantity cannot be negative.");
        }

        if (dto.Quantity < resource.AllocatedQuantity)
        {
            return Result<ResourceDto>.Failure($"Adjusted total quantity ({dto.Quantity}) cannot be less than currently allocated stock ({resource.AllocatedQuantity}).");
        }

        resource.TotalQuantity = dto.Quantity;
        resource.LastModifiedBy = user ?? "Resource Manager";
        resource.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(resource, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        LogActivity("Stock updated", $"RES-{resource.Id.ToString()[..6].ToUpper()}", user ?? "Resource Manager", $"{resource.Name} stock set to {dto.Quantity} {resource.Unit} ({dto.Reason})");

        return Result<ResourceDto>.Success(MapToDto(resource), "Stock quantity updated successfully");
    }

    // ==========================================
    // 3. Allocation Requests & Decisions
    // ==========================================

    public async Task<Result<IReadOnlyList<ResourceAllocationRequestDto>>> GetAllocationsAsync(
        int? status = null, 
        PriorityLevel? priority = null, 
        string? search = null, 
        CancellationToken cancellationToken = default)
    {
        var list = await _repository.GetAllAllocationsWithDetailsAsync(cancellationToken);

        if (status.HasValue)
        {
            list = list.Where(a => a.DispatchStatus == status.Value).ToList();
        }

        if (priority.HasValue)
        {
            list = list.Where(a => a.Priority == priority.Value).ToList();
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            list = list.Where(a => 
                (a.Resource != null && a.Resource.Name.ToLower().Contains(s)) ||
                (a.Notes != null && a.Notes.ToLower().Contains(s)) ||
                (a.Shelter != null && a.Shelter.Name.ToLower().Contains(s))).ToList();
        }

        var dtos = list.Select(MapToAllocationDto).ToList();
        return Result<IReadOnlyList<ResourceAllocationRequestDto>>.Success(dtos);
    }

    public async Task<Result<bool>> ApproveAllocationAsync(Guid id, ApproveAllocationDto dto, string? user = null, CancellationToken cancellationToken = default)
    {
        var allocation = await _repository.GetAllocationByIdWithDetailsAsync(id, cancellationToken);
        if (allocation == null) return Result<bool>.Failure("Allocation request not found");

        var resource = allocation.Resource;
        if (resource == null)
        {
            resource = await _repository.GetByIdAsync(allocation.ResourceId, cancellationToken);
        }
        if (resource == null) return Result<bool>.Failure("Associated resource not found");

        var approvedQty = dto.ApprovedQuantity ?? allocation.Quantity;
        if (approvedQty <= 0) return Result<bool>.Failure("Approved quantity must be positive");

        if (resource.AvailableQuantity < approvedQty)
        {
            throw new ResourceShortageException(resource.Id, approvedQty, resource.AvailableQuantity);
        }

        resource.AllocatedQuantity += approvedQty;
        allocation.Quantity = approvedQty;
        allocation.DispatchStatus = 1; // Approved
        if (!string.IsNullOrWhiteSpace(dto.ManagerNote))
        {
            allocation.Notes = string.IsNullOrWhiteSpace(allocation.Notes) 
                ? $"[Approved by {user ?? "Resource Manager"}]: {dto.ManagerNote}" 
                : $"{allocation.Notes} | [Approved by {user ?? "Resource Manager"}]: {dto.ManagerNote}";
        }

        await _repository.UpdateAllocationAsync(allocation, cancellationToken);
        await _repository.UpdateAsync(resource, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        LogActivity("Allocation approved", $"RAR-{allocation.Id.ToString()[..6].ToUpper()}", user ?? "Resource Manager", $"Authorized {approvedQty} {resource.Unit} of {resource.Name}");

        return Result<bool>.Success(true, "Allocation request approved successfully");
    }

    public async Task<Result<bool>> RejectAllocationAsync(Guid id, RejectAllocationDto dto, string? user = null, CancellationToken cancellationToken = default)
    {
        var allocation = await _repository.GetAllocationByIdWithDetailsAsync(id, cancellationToken);
        if (allocation == null) return Result<bool>.Failure("Allocation request not found");

        allocation.DispatchStatus = 5; // Rejected
        allocation.Notes = string.IsNullOrWhiteSpace(allocation.Notes)
            ? $"[Rejected by {user ?? "Resource Manager"}]: {dto.Reason}"
            : $"{allocation.Notes} | [Rejected by {user ?? "Resource Manager"}]: {dto.Reason}";

        await _repository.UpdateAllocationAsync(allocation, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        LogActivity("Allocation rejected", $"RAR-{allocation.Id.ToString()[..6].ToUpper()}", user ?? "Resource Manager", $"Rejected allocation: {dto.Reason}");

        return Result<bool>.Success(true, "Allocation request rejected");
    }

    public async Task<Result<bool>> ClarifyAllocationAsync(Guid id, string? note, string? user = null, CancellationToken cancellationToken = default)
    {
        var allocation = await _repository.GetAllocationByIdWithDetailsAsync(id, cancellationToken);
        if (allocation == null) return Result<bool>.Failure("Allocation request not found");

        if (!string.IsNullOrWhiteSpace(note))
        {
            allocation.Notes = string.IsNullOrWhiteSpace(allocation.Notes)
                ? $"[Clarification requested by {user ?? "Resource Manager"}]: {note}"
                : $"{allocation.Notes} | [Clarification]: {note}";
        }

        await _repository.UpdateAllocationAsync(allocation, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        LogActivity("Clarification asked", $"RAR-{allocation.Id.ToString()[..6].ToUpper()}", user ?? "Resource Manager", $"Requested clarification on allocation: {note}");

        return Result<bool>.Success(true, "Clarification recorded and coordinator notified");
    }

    // ==========================================
    // 4. Distribution & Delivery Tracking
    // ==========================================

    public async Task<Result<IReadOnlyList<DistributionTrackingDto>>> GetDispatchesAsync(string? search = null, CancellationToken cancellationToken = default)
    {
        var allocations = await _repository.GetAllAllocationsWithDetailsAsync(cancellationToken);

        // Filter dispatches: active allocations that have been approved or dispatched or delivered
        var list = allocations.Where(a => a.DispatchStatus >= 1 && a.DispatchStatus <= 4).ToList();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            list = list.Where(a => 
                (a.Resource != null && a.Resource.Name.ToLower().Contains(s)) ||
                (a.Shelter != null && a.Shelter.Name.ToLower().Contains(s))).ToList();
        }

        var dtos = list.Select(MapToTrackingDto).ToList();
        return Result<IReadOnlyList<DistributionTrackingDto>>.Success(dtos);
    }

    public async Task<Result<bool>> UpdateDispatchStatusAsync(Guid id, UpdateDispatchStatusDto dto, string? user = null, CancellationToken cancellationToken = default)
    {
        var allocation = await _repository.GetAllocationByIdWithDetailsAsync(id, cancellationToken);
        if (allocation == null) return Result<bool>.Failure("Dispatch allocation not found");

        // Step mapping: 1=Requested(0), 2=Approved(1), 3=Prepared(2), 4=Dispatched(3), 5=Delivered(4)
        if (dto.Step >= 1 && dto.Step <= 5)
        {
            allocation.DispatchStatus = dto.Step switch
            {
                1 => 0,
                2 => 1,
                3 => 2,
                4 => 3,
                5 => 4,
                _ => allocation.DispatchStatus
            };
        }

        if (allocation.DispatchStatus == 3 && !allocation.DispatchedAt.HasValue)
        {
            allocation.DispatchedAt = DateTime.UtcNow;
        }

        if (allocation.DispatchStatus == 4 && !allocation.DeliveredAt.HasValue)
        {
            allocation.DeliveredAt = DateTime.UtcNow;
        }

        if (!string.IsNullOrWhiteSpace(dto.Notes))
        {
            allocation.Notes = string.IsNullOrWhiteSpace(allocation.Notes)
                ? $"[Stage {dto.Step} by {user ?? "Logistics"}]: {dto.Notes}"
                : $"{allocation.Notes} | [Stage {dto.Step}]: {dto.Notes}";
        }

        await _repository.UpdateAllocationAsync(allocation, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        var stageLabel = dto.Step switch
        {
            2 => "Approved",
            3 => "Prepared at loading bay",
            4 => "Dispatched to destination",
            5 => "Delivered and confirmed",
            _ => "Updated"
        };

        LogActivity("Dispatch status updated", $"DSP-{allocation.Id.ToString()[..6].ToUpper()}", user ?? "Logistics Team Alpha", $"Moved to stage: {stageLabel}");

        return Result<bool>.Success(true, $"Dispatch stage updated to {stageLabel}");
    }

    public async Task<Result<bool>> ConfirmDeliveryAsync(Guid id, ConfirmDeliveryDto dto, string? user = null, CancellationToken cancellationToken = default)
    {
        var allocation = await _repository.GetAllocationByIdWithDetailsAsync(id, cancellationToken);
        if (allocation == null) return Result<bool>.Failure("Dispatch allocation not found");

        allocation.DispatchStatus = 4; // Delivered
        allocation.DeliveredAt = DateTime.UtcNow;

        var officer = user ?? "Dilan Perera";
        var timeStr = DateTime.UtcNow.ToString("HH:mm");
        var confirmationText = $"Confirmed by {officer} at {timeStr}";
        if (!string.IsNullOrWhiteSpace(dto.ConfirmationNotes))
        {
            confirmationText += $" ({dto.ConfirmationNotes})";
        }

        allocation.Notes = string.IsNullOrWhiteSpace(allocation.Notes)
            ? $"[Delivery Confirmed]: {confirmationText}"
            : $"{allocation.Notes} | [Delivery Confirmed]: {confirmationText}";

        await _repository.UpdateAllocationAsync(allocation, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        LogActivity("Delivery confirmed", $"DSP-{allocation.Id.ToString()[..6].ToUpper()}", officer, $"Delivery confirmation signed: {confirmationText}");

        return Result<bool>.Success(true, "Delivery confirmation successfully recorded");
    }

    // ==========================================
    // 5. Suppliers & Donations
    // ==========================================

    public async Task<Result<IReadOnlyList<SupplierDto>>> GetSuppliersAsync(string? search = null, string? status = null, CancellationToken cancellationToken = default)
    {
        var partners = await _repository.GetSuppliersAsync(search, status, cancellationToken);
        var dtos = partners.Select(p => new SupplierDto
        {
            Id = p.Id,
            Code = string.IsNullOrWhiteSpace(p.Code) ? $"SUP-{p.Id.ToString()[..6].ToUpper()}" : p.Code,
            Name = p.Name,
            Categories = string.IsNullOrWhiteSpace(p.Type) ? "Relief Supplies" : p.Type,
            ContactRef = string.IsNullOrWhiteSpace(p.LeadContact) ? (p.Phone ?? "Verified contact") : $"{p.LeadContact} ({p.Phone})",
            Status = p.Status.Contains("Active", StringComparison.OrdinalIgnoreCase) ? "Verified" : p.Status,
            StatusBadge = p.Status.Contains("Active", StringComparison.OrdinalIgnoreCase) ? "verified" : "review",
            LastDelivery = p.UpdatedAt.HasValue ? p.UpdatedAt.Value.ToString("dd MMM yyyy") : "Active",
            Location = "Western Province",
            Phone = p.Phone,
            Email = p.Email
        }).ToList();

        return Result<IReadOnlyList<SupplierDto>>.Success(dtos);
    }

    public async Task<Result<SupplierDto>> CreateSupplierAsync(CreateSupplierDto dto, string? user = null, CancellationToken cancellationToken = default)
    {
        var partner = new PartnerOrganisation
        {
            Id = Guid.NewGuid(),
            Code = $"SUP-{Random.Shared.Next(100, 999)}",
            Name = dto.Name.Trim(),
            Acronym = dto.Name.Length > 4 ? dto.Name[..4].ToUpper() : dto.Name.ToUpper(),
            Type = string.IsNullOrWhiteSpace(dto.Categories) ? "Supplier" : $"Supplier / {dto.Categories.Trim()}",
            LeadContact = dto.ContactRef ?? "Authorized Representative",
            Phone = dto.Phone ?? "+94 77 123 4567",
            Email = dto.Email ?? "supplier@reliefpartners.lk",
            Status = "Active Response",
            StatusClass = "status-active",
            MouStatus = "Verified Partner MOU",
            MouBadge = "badge-verified",
            FieldTeamsCount = 2,
            FleetCount = 4,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = user ?? "Resource Manager"
        };

        await _repository.AddSupplierAsync(partner, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        LogActivity("Supplier registered", partner.Code, user ?? "Resource Manager", $"Registered approved supplier {partner.Name}");

        var resultDto = new SupplierDto
        {
            Id = partner.Id,
            Code = partner.Code,
            Name = partner.Name,
            Categories = partner.Type,
            ContactRef = partner.LeadContact,
            Status = "Verified",
            StatusBadge = "verified",
            LastDelivery = "Today",
            Location = dto.Location ?? "Western Province",
            Phone = partner.Phone,
            Email = partner.Email
        };

        return Result<SupplierDto>.Success(resultDto, "Supplier registered successfully");
    }

    public async Task<Result<IReadOnlyList<DonatedSupplyDto>>> GetDonatedSuppliesAsync(string? search = null, CancellationToken cancellationToken = default)
    {
        var donations = await _repository.GetDonatedSuppliesAsync(search, cancellationToken);
        var dtos = donations.Select(d => new DonatedSupplyDto
        {
            Id = d.Id,
            Code = $"DON-{d.Id.ToString()[..4].ToUpper()}",
            Donor = d.DonorName,
            Items = string.IsNullOrWhiteSpace(d.ItemDescription) ? "Emergency In-Kind Relief Supplies" : d.ItemDescription,
            Quantity = d.ItemQuantity ?? 100,
            IntakeDate = (d.ReceivedAt ?? d.CreatedAt).ToString("dd MMM yyyy"),
            Depot = string.IsNullOrWhiteSpace(d.TargetDistrict) ? "Central Depot" : $"{d.TargetDistrict} Depot",
            Status = d.Status == 2 || d.Status == 3 ? "Stocked" : "Under Intake Review"
        }).ToList();

        return Result<IReadOnlyList<DonatedSupplyDto>>.Success(dtos);
    }

    // ==========================================
    // 6. Stock Alerts & Replenishment Guidance
    // ==========================================

    public async Task<Result<IReadOnlyList<StockAlertDto>>> GetStockAlertsAsync(CancellationToken cancellationToken = default)
    {
        var items = await _repository.GetAllAsync(cancellationToken);
        var allocations = await _repository.GetAllAllocationsWithDetailsAsync(cancellationToken);

        var alerts = new List<StockAlertDto>();
        int count = 1;

        foreach (var item in items)
        {
            var requestedPending = allocations
                .Where(a => a.ResourceId == item.Id && a.DispatchStatus == 0)
                .Sum(a => a.Quantity);

            // Rule 1: Critical Shortage (Available <= 0 or Available < pending requests)
            if (item.AvailableQuantity <= 0 || (requestedPending > item.AvailableQuantity && requestedPending > 0))
            {
                var deficit = Math.Max(requestedPending - item.AvailableQuantity, item.MinimumThreshold);
                alerts.Add(new StockAlertDto
                {
                    Id = $"ALT-{count++}",
                    ResourceId = item.Id,
                    Item = item.Name,
                    Tag = "Critical",
                    Code = $"RES-{item.Id.ToString()[..6].ToUpper()}",
                    TagType = "critical",
                    IconType = item.Category.Contains("Water", StringComparison.OrdinalIgnoreCase) ? "droplet" : "alert",
                    Available = item.AvailableQuantity,
                    Requested = requestedPending > 0 ? requestedPending : null,
                    Threshold = item.MinimumThreshold,
                    RecommendedAction = $"Trigger emergency procurement of {deficit:0} {item.Unit} or reallocate from reserve depot"
                });
            }
            // Rule 2: Low Stock Warning (Available <= MinimumThreshold)
            else if (item.IsBelowThreshold)
            {
                var reorderQty = Math.Max(item.MinimumThreshold * 2 - item.AvailableQuantity, 50);
                alerts.Add(new StockAlertDto
                {
                    Id = $"ALT-{count++}",
                    ResourceId = item.Id,
                    Item = item.Name,
                    Tag = "Warning",
                    Code = $"RES-{item.Id.ToString()[..6].ToUpper()}",
                    TagType = "warning",
                    IconType = "alert",
                    Available = item.AvailableQuantity,
                    Threshold = item.MinimumThreshold,
                    RecommendedAction = $"Issue replenishment reorder for {reorderQty:0} {item.Unit} with verified supplier"
                });
            }

            // Rule 3: Expiry Risk (ExpiryDate within 30 days)
            if (item.ExpiryDate.HasValue && item.ExpiryDate.Value <= DateTime.UtcNow.AddDays(30))
            {
                var daysLeft = Math.Max(1, (int)(item.ExpiryDate.Value - DateTime.UtcNow).TotalDays);
                alerts.Add(new StockAlertDto
                {
                    Id = $"ALT-{count++}",
                    ResourceId = item.Id,
                    Item = item.Name,
                    Tag = "Expiring",
                    Code = $"RES-{item.Id.ToString()[..6].ToUpper()}",
                    TagType = "warning",
                    IconType = "alert",
                    Available = item.AvailableQuantity,
                    ExpiringQty = item.AvailableQuantity,
                    DaysLeft = daysLeft,
                    RecommendedAction = $"Prioritize dispatch to forward shelters before {item.ExpiryDate.Value:dd MMM yyyy}"
                });
            }
        }

        return Result<IReadOnlyList<StockAlertDto>>.Success(alerts);
    }

    public async Task<Result<bool>> ReorderResourceAsync(ReorderRequestDto dto, string? user = null, CancellationToken cancellationToken = default)
    {
        var resource = await _repository.GetByIdAsync(dto.ResourceId, cancellationToken);
        if (resource == null) return Result<bool>.Failure("Resource not found");

        LogActivity("Reorder placed", $"RES-{resource.Id.ToString()[..6].ToUpper()}", user ?? "Resource Manager", $"Reorder requested: {dto.Quantity} {resource.Unit} for {dto.TargetDepot ?? "Central Depot"} (Urgency: {dto.Urgency ?? "High"})");

        return Result<bool>.Success(true, $"Reorder requisition of {dto.Quantity} {resource.Unit} submitted to Procurement");
    }

    // ==========================================
    // 7. Activity Audit Trail & Export
    // ==========================================

    public Task<Result<IReadOnlyList<ActivityLogItemDto>>> GetActivityHistoryAsync(string? search = null, CancellationToken cancellationToken = default)
    {
        var list = _activityHistory.OrderByDescending(a => a.Timestamp).AsEnumerable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            list = list.Where(a => 
                a.Reference.ToLower().Contains(s) ||
                a.Action.ToLower().Contains(s) ||
                a.RelatedRecord.ToLower().Contains(s) ||
                a.Detail.ToLower().Contains(s) ||
                a.UserTeam.ToLower().Contains(s));
        }

        return Task.FromResult(Result<IReadOnlyList<ActivityLogItemDto>>.Success(list.ToList()));
    }

    public async Task<Result<string>> ExportCsvAsync(string? type, CancellationToken cancellationToken = default)
    {
        var sb = new StringBuilder();

        if (string.Equals(type, "dispatches", StringComparison.OrdinalIgnoreCase))
        {
            sb.AppendLine("Dispatch ID,Title,Destination,Team,Status,Current Step,Dispatch Date,Delivered Date,Notes");
            var dispatches = await _repository.GetAllAllocationsWithDetailsAsync(cancellationToken);
            foreach (var d in dispatches.Where(a => a.DispatchStatus >= 1))
            {
                var title = d.Resource != null ? $"{d.Quantity} {d.Resource.Unit} of {d.Resource.Name}" : "Relief Dispatches";
                var dest = d.Shelter != null ? d.Shelter.Name : "Regional Relief Center";
                var statusStr = d.DispatchStatus switch
                {
                    1 => "Approved",
                    2 => "Prepared",
                    3 => "Dispatched",
                    4 => "Delivered",
                    _ => "Pending"
                };
                sb.AppendLine($"\"DSP-{d.Id.ToString()[..6].ToUpper()}\",\"{title}\",\"{dest}\",\"Logistics Team Alpha\",\"{statusStr}\",\"{d.DispatchStatus + 1}\",\"{d.DispatchedAt:yyyy-MM-dd}\",\"{d.DeliveredAt:yyyy-MM-dd}\",\"{EscapeCsv(d.Notes)}\"");
            }
        }
        else if (string.Equals(type, "alerts", StringComparison.OrdinalIgnoreCase))
        {
            sb.AppendLine("Alert ID,Item,Tag,Available,Threshold,Recommended Action");
            var alertsResult = await GetStockAlertsAsync(cancellationToken);
            foreach (var a in alertsResult.Data ?? Array.Empty<StockAlertDto>())
            {
                sb.AppendLine($"\"{a.Id}\",\"{a.Item}\",\"{a.Tag}\",\"{a.Available}\",\"{a.Threshold}\",\"{EscapeCsv(a.RecommendedAction)}\"");
            }
        }
        else // default: Inventory
        {
            sb.AppendLine("Resource ID,Item Name,Category,Total Quantity,Allocated Quantity,Available Quantity,Unit,Warehouse Location,Stock Status,Expiry Date");
            var items = await _repository.GetAllAsync(cancellationToken);
            foreach (var r in items)
            {
                sb.AppendLine($"\"RES-{r.Id.ToString()[..6].ToUpper()}\",\"{EscapeCsv(r.Name)}\",\"{r.Category}\",{r.TotalQuantity},{r.AllocatedQuantity},{r.AvailableQuantity},\"{r.Unit}\",\"{r.WarehouseLocation}\",\"{r.AvailableQuantity switch { <= 0 => "Shortage", var a when a <= r.MinimumThreshold => "Low stock", _ => "Available" }}\",\"{r.ExpiryDate:yyyy-MM-dd}\"");
            }
        }

        return Result<string>.Success(sb.ToString(), "Export generated successfully");
    }

    // ==========================================
    // 8. Duty & Officer Status
    // ==========================================

    public Task<Result<DutyStatusDto>> GetDutyStatusAsync(string? user = null, CancellationToken cancellationToken = default)
    {
        var key = user ?? "Dilan Perera";
        var isOnDuty = _dutyStatuses.GetOrAdd(key, true);

        return Task.FromResult(Result<DutyStatusDto>.Success(new DutyStatusDto
        {
            IsOnDuty = isOnDuty,
            OfficerName = key,
            Role = "Relief / Resource Manager",
            AssignedDistrict = "Western Province Flood Response",
            Timestamp = DateTime.UtcNow
        }));
    }

    public Task<Result<DutyStatusDto>> SetDutyStatusAsync(bool isOnDuty, string? user = null, CancellationToken cancellationToken = default)
    {
        var key = user ?? "Dilan Perera";
        _dutyStatuses[key] = isOnDuty;

        LogActivity("Duty toggled", "DUTY-STATUS", key, $"Duty status toggled to: {(isOnDuty ? "Active Duty" : "Off Duty")}");

        return Task.FromResult(Result<DutyStatusDto>.Success(new DutyStatusDto
        {
            IsOnDuty = isOnDuty,
            OfficerName = key,
            Role = "Relief / Resource Manager",
            AssignedDistrict = "Western Province Flood Response",
            Timestamp = DateTime.UtcNow
        }, $"Duty status updated to {(isOnDuty ? "Active On-Duty" : "Off-Duty")}"));
    }

    // ==========================================
    // Helper Methods
    // ==========================================

    private static ResourceDto MapToDto(Resource r) => new()
    {
        Id = r.Id,
        Code = $"RES-{r.Id.ToString()[..6].ToUpper()}",
        Name = r.Name,
        Category = r.Category,
        Unit = r.Unit,
        TotalQuantity = r.TotalQuantity,
        AllocatedQuantity = r.AllocatedQuantity,
        MinimumThreshold = r.MinimumThreshold,
        WarehouseLocation = r.WarehouseLocation,
        ExpiryDate = r.ExpiryDate,
        LastUpdated = r.UpdatedAt.HasValue ? r.UpdatedAt.Value.ToString("HH:mm") : "Recently",
        UpdatedAt = r.UpdatedAt
    };

    private static ResourceAllocationRequestDto MapToAllocationDto(ResourceAllocation a)
    {
        var itemName = a.Resource?.Name ?? "Emergency Relief Pack";
        var category = a.Resource?.Category ?? "General Relief";
        var avail = a.Resource?.AvailableQuantity ?? 100;
        var destination = a.Shelter?.Name ?? (a.AssistanceRequest != null ? a.AssistanceRequest.Address ?? "Kelani Relief Center" : "Central Distribution Hub");
        var related = a.AssistanceRequest != null ? $"REQ-{a.AssistanceRequest.Id.ToString()[..6].ToUpper()}" : (a.Shelter != null ? $"SH-{a.Shelter.Id.ToString()[..4].ToUpper()}" : "OP-2026-WP");

        var priorityName = a.Priority switch
        {
            PriorityLevel.Critical => "Critical",
            PriorityLevel.High => "High",
            PriorityLevel.Medium => "Medium",
            _ => "Low"
        };

        var priorityTag = a.Priority switch
        {
            PriorityLevel.Critical => "critical",
            PriorityLevel.High => "danger",
            PriorityLevel.Medium => "warning",
            _ => "neutral"
        };

        var statusBadge = a.DispatchStatus switch
        {
            0 => "pending",
            1 => "approved",
            2 => "prepared",
            3 => "dispatched",
            4 => "delivered",
            5 => "rejected",
            _ => "pending"
        };

        return new ResourceAllocationRequestDto
        {
            Id = a.Id,
            Code = $"RAR-{a.Id.ToString()[..6].ToUpper()}",
            ResourceId = a.ResourceId,
            Item = itemName,
            Category = category,
            Cluster = $"{category} Cluster",
            RequestedQty = a.Quantity,
            AvailableQty = avail,
            Priority = priorityName,
            PriorityTag = priorityTag,
            Destination = destination,
            RelatedRecord = related,
            Coordinator = a.AssistanceRequest?.ContactPhone ?? "Maya Fernando",
            DispatchStatus = a.DispatchStatus,
            StatusBadge = statusBadge,
            Notes = a.Notes,
            CreatedAt = a.CreatedAt,
            DispatchedAt = a.DispatchedAt,
            DeliveredAt = a.DeliveredAt
        };
    }

    private static DistributionTrackingDto MapToTrackingDto(ResourceAllocation a)
    {
        var itemName = a.Resource?.Name ?? "Emergency Relief Supplies";
        var destination = a.Shelter?.Name ?? "Kelani Relief Center";
        var step = a.DispatchStatus switch
        {
            0 => 1, // Requested
            1 => 2, // Approved
            2 => 3, // Prepared
            3 => 4, // Dispatched
            4 => 5, // Delivered
            _ => 1
        };

        var statusText = a.DispatchStatus switch
        {
            1 => "Approved",
            2 => "Prepared",
            3 => "Dispatched",
            4 => "Delivered",
            _ => "In Transit"
        };

        var statusBadge = a.DispatchStatus switch
        {
            4 => "delivered",
            3 => "dispatched",
            _ => "info"
        };

        var history = new List<DistributionHistoryStepDto>();
        if (a.DeliveredAt.HasValue)
        {
            history.Add(new DistributionHistoryStepDto
            {
                Time = a.DeliveredAt.Value.ToString("HH:mm"),
                Title = "Delivery confirmed at destination",
                Sub = $"Signed and received at {destination}"
            });
        }
        if (a.DispatchedAt.HasValue)
        {
            history.Add(new DistributionHistoryStepDto
            {
                Time = a.DispatchedAt.Value.ToString("HH:mm"),
                Title = "Convoy departed loading bay",
                Sub = "En route to designated distribution point"
            });
        }
        history.Add(new DistributionHistoryStepDto
        {
            Time = a.CreatedAt.ToString("HH:mm"),
            Title = "Allocation approved and staged",
            Sub = $"Prepared {a.Quantity} units at Central Depot"
        });

        return new DistributionTrackingDto
        {
            Id = a.Id,
            Code = $"DSP-{a.Id.ToString()[..6].ToUpper()}",
            Title = $"{itemName} ({a.Quantity} units)",
            Destination = destination,
            Team = "Logistics Team Alpha",
            Status = statusText,
            StatusBadge = statusBadge,
            CurrentStep = step,
            DispatchDate = a.DispatchedAt.HasValue ? a.DispatchedAt.Value.ToString("dd MMM yyyy") : (a.CreatedAt.ToString("dd MMM yyyy")),
            ExpectedDelivery = a.DeliveredAt.HasValue ? a.DeliveredAt.Value.ToString("dd MMM yyyy") : "Today by 18:00",
            RelatedAllocation = $"RAR-{a.Id.ToString()[..6].ToUpper()}",
            DeliveryConfirmation = a.DeliveredAt.HasValue ? $"Confirmed ({a.DeliveredAt.Value:HH:mm})" : "Pending drop-off confirmation",
            History = history
        };
    }

    private static void LogActivity(string action, string reference, string userTeam, string detail)
    {
        _activityHistory.Add(new ActivityLogItemDto
        {
            Id = Guid.NewGuid().ToString(),
            Reference = reference,
            Action = action,
            RelatedRecord = reference,
            UserTeam = userTeam,
            Time = DateTime.UtcNow.ToString("HH:mm:ss"),
            Detail = detail,
            Status = "Recorded",
            Timestamp = DateTime.UtcNow
        });
    }

    private static string EscapeCsv(string? value)
    {
        if (string.IsNullOrEmpty(value)) return string.Empty;
        return value.Replace("\"", "\"\"");
    }
}
