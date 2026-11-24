using Moq;
using Xunit;
using HumanitarianCrisisPlatform.Application.DTOs.Resources;
using HumanitarianCrisisPlatform.Application.Interfaces;
using HumanitarianCrisisPlatform.Application.Interfaces.Repositories;
using HumanitarianCrisisPlatform.Application.Services;
using HumanitarianCrisisPlatform.Application.Validators;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Enums;
using HumanitarianCrisisPlatform.Domain.Exceptions;

namespace HumanitarianCrisisPlatform.Tests.UnitTests.ServiceTests;

public class ResourceManagerWorkflowTests
{
    private readonly Mock<IResourceRepository> _repoMock;
    private readonly Mock<IUnitOfWork> _uowMock;
    private readonly ResourceAllocationService _service;

    public ResourceManagerWorkflowTests()
    {
        _repoMock = new Mock<IResourceRepository>();
        _uowMock = new Mock<IUnitOfWork>();
        _service = new ResourceAllocationService(_repoMock.Object, _uowMock.Object);
    }

    [Fact]
    public async Task CreateResource_ValidItem_ShouldAddAndReturnDto()
    {
        var dto = new CreateResourceDto
        {
            Name = "Water Purification Tablets",
            Category = "Water",
            Quantity = 5000,
            Unit = "packs",
            StorageLocation = "Central Depot",
            MinimumThreshold = 500
        };

        _repoMock.Setup(r => r.AddAsync(It.IsAny<Resource>(), default))
            .ReturnsAsync((Resource r, CancellationToken _) => r);
        _uowMock.Setup(u => u.CommitAsync(default)).ReturnsAsync(1);

        var result = await _service.CreateResourceAsync(dto, "Dilan Perera");

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.Equal("Water Purification Tablets", result.Data.Name);
        Assert.Equal(5000, result.Data.TotalQuantity);
        Assert.Equal(5000, result.Data.AvailableQuantity);
        Assert.Equal("Central Depot", result.Data.StorageLocation);
        _repoMock.Verify(r => r.AddAsync(It.IsAny<Resource>(), default), Times.Once);
        _uowMock.Verify(u => u.CommitAsync(default), Times.Once);
    }

    [Fact]
    public void CreateResource_Validation_ShouldEnforceRequiredFieldsAndNonNegative()
    {
        var validator = new CreateResourceValidator();

        var invalidDto = new CreateResourceDto
        {
            Name = "",
            Quantity = -10,
            MinimumThreshold = -5
        };

        var errors = validator.Validate(invalidDto);

        Assert.Contains(errors, e => e.Contains("Item name is required"));
        Assert.Contains(errors, e => e.Contains("Quantity cannot be negative"));
        Assert.Contains(errors, e => e.Contains("Minimum threshold cannot be negative"));
    }

    [Fact]
    public async Task UpdateResource_ExistingItem_ShouldUpdateFieldsAndLastModified()
    {
        var resourceId = Guid.NewGuid();
        var existing = new Resource
        {
            Id = resourceId,
            Name = "Old Water",
            Category = "Water",
            TotalQuantity = 1000,
            AllocatedQuantity = 200,
            MinimumThreshold = 100,
            WarehouseLocation = "Old Depot"
        };

        _repoMock.Setup(r => r.GetByIdAsync(resourceId, default)).ReturnsAsync(existing);
        _uowMock.Setup(u => u.CommitAsync(default)).ReturnsAsync(1);

        var updateDto = new UpdateResourceDto
        {
            Name = "Emergency Clean Drinking Water (5L)",
            StorageLocation = "Biyagama Depot",
            MinimumThreshold = 300
        };

        var result = await _service.UpdateResourceAsync(resourceId, updateDto, "Dilan Perera");

        Assert.True(result.Succeeded);
        Assert.Equal("Emergency Clean Drinking Water (5L)", existing.Name);
        Assert.Equal("Biyagama Depot", existing.WarehouseLocation);
        Assert.Equal(300, existing.MinimumThreshold);
        Assert.Equal("Dilan Perera", existing.LastModifiedBy);
        Assert.NotNull(existing.UpdatedAt);
    }

    [Fact]
    public async Task AdjustStock_PositiveAdjustment_ShouldIncreaseTotalQuantity()
    {
        var resourceId = Guid.NewGuid();
        var resource = new Resource
        {
            Id = resourceId,
            Name = "High-Energy Biscuits",
            TotalQuantity = 500,
            AllocatedQuantity = 100
        };

        _repoMock.Setup(r => r.GetByIdAsync(resourceId, default)).ReturnsAsync(resource);
        _uowMock.Setup(u => u.CommitAsync(default)).ReturnsAsync(1);

        var result = await _service.AdjustStockAsync(resourceId, new StockAdjustmentDto
        {
            QuantityDelta = 250,
            Reason = "Supplier delivery intake"
        }, "Dilan Perera");

        Assert.True(result.Succeeded);
        Assert.Equal(750, resource.TotalQuantity);
        Assert.Equal(650, resource.AvailableQuantity);
    }

    [Fact]
    public async Task AdjustStock_NegativeAdjustmentBelowAllocated_ShouldFail()
    {
        var resourceId = Guid.NewGuid();
        var resource = new Resource
        {
            Id = resourceId,
            Name = "High-Energy Biscuits",
            TotalQuantity = 500,
            AllocatedQuantity = 400
        };

        _repoMock.Setup(r => r.GetByIdAsync(resourceId, default)).ReturnsAsync(resource);

        var result = await _service.AdjustStockAsync(resourceId, new StockAdjustmentDto
        {
            QuantityDelta = -200, // Total would become 300, less than 400 allocated
            Reason = "Damaged stock disposal"
        }, "Dilan Perera");

        Assert.False(result.Succeeded);
        Assert.Contains(result.Errors, e => e.Contains("cannot be less than currently allocated"));
    }

    [Fact]
    public async Task UpdateStockQuantity_ValidQuantity_ShouldSetTotalAndRecalculateStatus()
    {
        var resourceId = Guid.NewGuid();
        var resource = new Resource
        {
            Id = resourceId,
            Name = "Emergency Family Blankets",
            TotalQuantity = 100,
            AllocatedQuantity = 20,
            MinimumThreshold = 50
        };

        _repoMock.Setup(r => r.GetByIdAsync(resourceId, default)).ReturnsAsync(resource);
        _uowMock.Setup(u => u.CommitAsync(default)).ReturnsAsync(1);

        // 1. Update to 200 (Available: 180 > 50 => "Available")
        var result1 = await _service.UpdateStockQuantityAsync(resourceId, new UpdateStockQuantityDto
        {
            Quantity = 200,
            Reason = "Depot delivery intake"
        }, "Dilan Perera");

        Assert.True(result1.Succeeded);
        Assert.Equal(200, result1.Data!.TotalQuantity);
        Assert.Equal(180, result1.Data.AvailableQuantity);
        Assert.Equal("Available", result1.Data.StockStatus);
        Assert.Equal("available", result1.Data.StatusBadge);

        // 2. Update to 60 (Available: 40 <= 50 => "Low stock")
        var result2 = await _service.UpdateStockQuantityAsync(resourceId, new UpdateStockQuantityDto
        {
            Quantity = 60,
            Reason = "Crisis dispatch"
        }, "Dilan Perera");

        Assert.True(result2.Succeeded);
        Assert.Equal(60, result2.Data!.TotalQuantity);
        Assert.Equal(40, result2.Data.AvailableQuantity);
        Assert.Equal("Low stock", result2.Data.StockStatus);
        Assert.Equal("warning", result2.Data.StatusBadge);

        // 3. Update to 20 (Available: 0 <= 0 => "Shortage")
        var result3 = await _service.UpdateStockQuantityAsync(resourceId, new UpdateStockQuantityDto
        {
            Quantity = 20,
            Reason = "Final reservation"
        }, "Dilan Perera");

        Assert.True(result3.Succeeded);
        Assert.Equal(20, result3.Data!.TotalQuantity);
        Assert.Equal(0, result3.Data.AvailableQuantity);
        Assert.Equal("Shortage", result3.Data.StockStatus);
        Assert.Equal("shortage", result3.Data.StatusBadge);
    }

    [Fact]
    public async Task UpdateStockQuantity_NegativeQuantity_ShouldFail()
    {
        var resourceId = Guid.NewGuid();
        var resource = new Resource
        {
            Id = resourceId,
            Name = "Baby Food Kits",
            TotalQuantity = 50,
            AllocatedQuantity = 10
        };

        _repoMock.Setup(r => r.GetByIdAsync(resourceId, default)).ReturnsAsync(resource);

        var result = await _service.UpdateStockQuantityAsync(resourceId, new UpdateStockQuantityDto
        {
            Quantity = -5,
            Reason = "Discrepancy"
        }, "Dilan Perera");

        Assert.False(result.Succeeded);
        Assert.Contains(result.Errors, e => e.Contains("cannot be negative"));
    }

    [Fact]
    public async Task UpdateStockQuantity_BelowAllocated_ShouldFail()
    {
        var resourceId = Guid.NewGuid();
        var resource = new Resource
        {
            Id = resourceId,
            Name = "Baby Food Kits",
            TotalQuantity = 50,
            AllocatedQuantity = 30
        };

        _repoMock.Setup(r => r.GetByIdAsync(resourceId, default)).ReturnsAsync(resource);

        var result = await _service.UpdateStockQuantityAsync(resourceId, new UpdateStockQuantityDto
        {
            Quantity = 25, // Less than 30 allocated
            Reason = "Adjustment"
        }, "Dilan Perera");

        Assert.False(result.Succeeded);
        Assert.Contains(result.Errors, e => e.Contains("cannot be less than currently allocated"));
    }

    [Fact]
    public void UpdateStockQuantityValidator_ShouldEnforceNonNegative()
    {
        var validator = new UpdateStockQuantityValidator();

        var errors = validator.Validate(new UpdateStockQuantityDto { Quantity = -1 });
        Assert.NotEmpty(errors);
        Assert.Contains(errors, e => e.Contains("cannot be negative"));

        var validErrors = validator.Validate(new UpdateStockQuantityDto { Quantity = 0 });
        Assert.Empty(validErrors);
    }

    [Fact]
    public async Task GetOverviewMetrics_ShouldComputeAccurateAggregations()
    {
        var resources = new List<Resource>
        {
            new() { Id = Guid.NewGuid(), Name = "Bottled Water", Category = "Water", TotalQuantity = 1000, AllocatedQuantity = 600, MinimumThreshold = 500 }, // Available: 400 (<= threshold: low stock)
            new() { Id = Guid.NewGuid(), Name = "Rice Packs", Category = "Food", TotalQuantity = 500, AllocatedQuantity = 500, MinimumThreshold = 100 }, // Available: 0 (critical shortage)
            new() { Id = Guid.NewGuid(), Name = "First Aid Kits", Category = "Medicine", TotalQuantity = 200, AllocatedQuantity = 50, MinimumThreshold = 50 } // Available: 150 (available)
        };

        var allocations = new List<ResourceAllocation>
        {
            new() { Id = Guid.NewGuid(), ResourceId = resources[0].Id, Quantity = 100, DispatchStatus = 0, Priority = PriorityLevel.Critical }, // Pending critical
            new() { Id = Guid.NewGuid(), ResourceId = resources[1].Id, Quantity = 200, DispatchStatus = 1 }, // Approved
            new() { Id = Guid.NewGuid(), ResourceId = resources[2].Id, Quantity = 50, DispatchStatus = 3 }, // Dispatched
            new() { Id = Guid.NewGuid(), ResourceId = resources[0].Id, Quantity = 300, DispatchStatus = 4 } // Delivered
        };

        _repoMock.Setup(r => r.GetAllAsync(default)).ReturnsAsync(resources);
        _repoMock.Setup(r => r.GetAllAllocationsWithDetailsAsync(default)).ReturnsAsync(allocations);

        var result = await _service.GetOverviewMetricsAsync();

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.Equal(3, result.Data.TotalResources);
        Assert.Equal(3, result.Data.TotalCategories);
        Assert.Equal(1700, result.Data.TotalStockQuantity);
        Assert.Equal(550, result.Data.AvailableStock);
        Assert.Equal(1150, result.Data.AllocatedStock);
        Assert.Equal(1, result.Data.LowStockWarnings);
        Assert.Equal(1, result.Data.CriticalShortages);
        Assert.Equal(1, result.Data.PendingAllocations);
        Assert.Equal(1, result.Data.HighPriorityPending);
        Assert.Equal(3, result.Data.ApprovedAllocations);
        Assert.Equal(1, result.Data.DispatchedCount);
        Assert.Equal(1, result.Data.DeliveredCount);
    }

    [Fact]
    public async Task ApproveAllocation_SufficientStock_ShouldDeductStockAndSetApprovedStatus()
    {
        var resourceId = Guid.NewGuid();
        var allocId = Guid.NewGuid();

        var resource = new Resource
        {
            Id = resourceId,
            Name = "Water Bottles",
            TotalQuantity = 1000,
            AllocatedQuantity = 200 // Available: 800
        };

        var allocation = new ResourceAllocation
        {
            Id = allocId,
            ResourceId = resourceId,
            Resource = resource,
            Quantity = 150,
            DispatchStatus = 0
        };

        _repoMock.Setup(r => r.GetAllocationByIdWithDetailsAsync(allocId, default)).ReturnsAsync(allocation);
        _uowMock.Setup(u => u.CommitAsync(default)).ReturnsAsync(1);

        var result = await _service.ApproveAllocationAsync(allocId, new ApproveAllocationDto
        {
            ApprovedQuantity = 150,
            ManagerNote = "Approved for emergency distribution"
        }, "Dilan Perera");

        Assert.True(result.Succeeded);
        Assert.Equal(1, allocation.DispatchStatus); // Approved
        Assert.Equal(350, resource.AllocatedQuantity);
        Assert.Equal(650, resource.AvailableQuantity);
        Assert.Contains("Approved for emergency distribution", allocation.Notes);
    }

    [Fact]
    public async Task ApproveAllocation_InsufficientStock_ShouldThrowResourceShortageException()
    {
        var resourceId = Guid.NewGuid();
        var allocId = Guid.NewGuid();

        var resource = new Resource
        {
            Id = resourceId,
            Name = "Tarpaulins",
            TotalQuantity = 100,
            AllocatedQuantity = 90 // Available: 10
        };

        var allocation = new ResourceAllocation
        {
            Id = allocId,
            ResourceId = resourceId,
            Resource = resource,
            Quantity = 50,
            DispatchStatus = 0
        };

        _repoMock.Setup(r => r.GetAllocationByIdWithDetailsAsync(allocId, default)).ReturnsAsync(allocation);

        await Assert.ThrowsAsync<ResourceShortageException>(() =>
            _service.ApproveAllocationAsync(allocId, new ApproveAllocationDto
            {
                ApprovedQuantity = 50
            }, "Dilan Perera"));
    }

    [Fact]
    public async Task RejectAllocation_ShouldSetRejectedStatusAndRecordReason()
    {
        var allocId = Guid.NewGuid();
        var allocation = new ResourceAllocation
        {
            Id = allocId,
            Quantity = 100,
            DispatchStatus = 0
        };

        _repoMock.Setup(r => r.GetAllocationByIdWithDetailsAsync(allocId, default)).ReturnsAsync(allocation);
        _uowMock.Setup(u => u.CommitAsync(default)).ReturnsAsync(1);

        var result = await _service.RejectAllocationAsync(allocId, new RejectAllocationDto
        {
            Reason = "Duplicated request with REQ-1042"
        }, "Dilan Perera");

        Assert.True(result.Succeeded);
        Assert.Equal(5, allocation.DispatchStatus); // Rejected
        Assert.Contains("Duplicated request with REQ-1042", allocation.Notes);
    }

    [Fact]
    public async Task UpdateDispatchStatus_ShouldAdvanceStepAndRecordTimestamps()
    {
        var allocId = Guid.NewGuid();
        var allocation = new ResourceAllocation
        {
            Id = allocId,
            Quantity = 100,
            DispatchStatus = 1 // Approved
        };

        _repoMock.Setup(r => r.GetAllocationByIdWithDetailsAsync(allocId, default)).ReturnsAsync(allocation);
        _uowMock.Setup(u => u.CommitAsync(default)).ReturnsAsync(1);

        // Advance to step 4 (Dispatched)
        var result = await _service.UpdateDispatchStatusAsync(allocId, new UpdateDispatchStatusDto
        {
            Step = 4,
            Notes = "Truck 04 departed Central Depot"
        }, "Logistics Alpha");

        Assert.True(result.Succeeded);
        Assert.Equal(3, allocation.DispatchStatus); // Dispatched
        Assert.NotNull(allocation.DispatchedAt);
    }

    [Fact]
    public async Task ConfirmDelivery_ShouldSetDeliveredStatusAndRecordConfirmation()
    {
        var allocId = Guid.NewGuid();
        var allocation = new ResourceAllocation
        {
            Id = allocId,
            Quantity = 100,
            DispatchStatus = 3 // Dispatched
        };

        _repoMock.Setup(r => r.GetAllocationByIdWithDetailsAsync(allocId, default)).ReturnsAsync(allocation);
        _uowMock.Setup(u => u.CommitAsync(default)).ReturnsAsync(1);

        var result = await _service.ConfirmDeliveryAsync(allocId, new ConfirmDeliveryDto
        {
            DeliveredTo = "Kelani Camp Shelter Coordinator",
            ConfirmationNotes = "All 100 kits checked and accepted"
        }, "Dilan Perera");

        Assert.True(result.Succeeded);
        Assert.Equal(4, allocation.DispatchStatus); // Delivered
        Assert.NotNull(allocation.DeliveredAt);
        Assert.Contains("Delivery Confirmed", allocation.Notes);
    }

    [Fact]
    public async Task CreateSupplier_ValidData_ShouldCreatePartnerOrganisation()
    {
        var dto = new CreateSupplierDto
        {
            Name = "Ceylon Logistics & Cold Chain",
            Categories = "Cold Storage / Refrigerated Transport",
            ContactRef = "Sunil Weerasinghe",
            Phone = "+94 77 987 6543",
            Email = "sunil@ceylonlogistics.lk"
        };

        _repoMock.Setup(r => r.AddSupplierAsync(It.IsAny<PartnerOrganisation>(), default))
            .ReturnsAsync((PartnerOrganisation p, CancellationToken _) => p);
        _uowMock.Setup(u => u.CommitAsync(default)).ReturnsAsync(1);

        var result = await _service.CreateSupplierAsync(dto, "Dilan Perera");

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.Equal("Ceylon Logistics & Cold Chain", result.Data.Name);
        Assert.Equal("Verified", result.Data.Status);
        _repoMock.Verify(r => r.AddSupplierAsync(It.IsAny<PartnerOrganisation>(), default), Times.Once);
    }

    [Fact]
    public async Task GetStockAlerts_WhenAvailableBelowThreshold_ShouldReturnRuleBasedReplenishmentGuidance()
    {
        var resourceId = Guid.NewGuid();
        var item = new Resource
        {
            Id = resourceId,
            Name = "Drinking Water Bottles",
            Category = "Water",
            TotalQuantity = 1000,
            AllocatedQuantity = 800, // Available: 200
            MinimumThreshold = 500
        };

        var pendingAllocation = new ResourceAllocation
        {
            ResourceId = resourceId,
            Quantity = 300, // 300 requested > 200 available -> Critical deficit
            DispatchStatus = 0
        };

        _repoMock.Setup(r => r.GetAllAsync(default)).ReturnsAsync(new List<Resource> { item });
        _repoMock.Setup(r => r.GetAllAllocationsWithDetailsAsync(default)).ReturnsAsync(new List<ResourceAllocation> { pendingAllocation });

        var result = await _service.GetStockAlertsAsync();

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.NotEmpty(result.Data);

        var alert = result.Data.First();
        Assert.Equal("Critical", alert.Tag);
        Assert.Equal(200, alert.Available);
        Assert.Equal(300, alert.Requested);
        Assert.Contains("procurement", alert.RecommendedAction.ToLower());
    }

    [Fact]
    public async Task DutyStatus_Toggle_ShouldUpdateAndReturnNewState()
    {
        var initial = await _service.GetDutyStatusAsync("Dilan Perera");
        Assert.True(initial.Succeeded);

        var toggled = await _service.SetDutyStatusAsync(!initial.Data!.IsOnDuty, "Dilan Perera");
        Assert.True(toggled.Succeeded);
        Assert.NotEqual(initial.Data.IsOnDuty, toggled.Data!.IsOnDuty);
    }

    [Fact]
    public async Task ExportCsv_ShouldGenerateValidHeadersAndRows()
    {
        var items = new List<Resource>
        {
            new() { Id = Guid.NewGuid(), Name = "Drinking Water", Category = "Water", TotalQuantity = 1000, AllocatedQuantity = 200, Unit = "Bottles", WarehouseLocation = "Central Depot", MinimumThreshold = 100 }
        };

        _repoMock.Setup(r => r.GetAllAsync(default)).ReturnsAsync(items);

        var result = await _service.ExportCsvAsync("inventory");

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.Contains("Resource ID,Item Name,Category,Total Quantity", result.Data);
        Assert.Contains("Drinking Water", result.Data);
        Assert.Contains("Central Depot", result.Data);
    }
}
