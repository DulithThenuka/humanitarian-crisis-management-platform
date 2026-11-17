using Moq;
using Xunit;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Shelters;
using HumanitarianCrisisPlatform.Application.Interfaces;
using HumanitarianCrisisPlatform.Application.Interfaces.Infrastructure;
using HumanitarianCrisisPlatform.Application.Interfaces.Repositories;
using HumanitarianCrisisPlatform.Application.Services;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Enums;
using HumanitarianCrisisPlatform.Domain.Exceptions;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;
using HumanitarianCrisisPlatform.Infrastructure.Repositories;
using HumanitarianCrisisPlatform.Tests.IntegrationTests.Infrastructure;

namespace HumanitarianCrisisPlatform.Tests.UnitTests.ServiceTests;

public class ShelterServiceTests : IClassFixture<DatabaseFixture>
{
    private readonly DatabaseFixture _fixture;

    public ShelterServiceTests(DatabaseFixture fixture)
    {
        _fixture = fixture;
    }

    private (ShelterService service, ApplicationDbContext context, Shelter testShelter) CreateService()
    {
        var context = _fixture.CreateContext();
        var shelterRepo = new ShelterRepository(context);
        var resourceRepo = new ResourceRepository(context);
        var unitOfWork = new UnitOfWork(context);

        var mockMapping = new Mock<IMappingService>();
        mockMapping.Setup(m => m.CalculateDistanceKm(It.IsAny<decimal>(), It.IsAny<decimal>(), It.IsAny<decimal>(), It.IsAny<decimal>()))
            .Returns(5.0);

        var shelter = new Shelter
        {
            Id = Guid.NewGuid(),
            Name = "SH-008 - Kelani Community Centre",
            Address = "Kelani East, Western Province",
            TotalCapacity = 200,
            CurrentOccupancy = 164,
            Facilities = "Step-free access, Medical triage",
            ContactPhone = "+94 77 123 4567",
            Latitude = 6.9544m,
            Longitude = 79.9192m,
            IsActive = true
        };
        context.Shelters.Add(shelter);

        var resource = new Resource
        {
            Id = Guid.NewGuid(),
            Name = "Bedding & Linens",
            Category = "Bedding",
            Unit = "Units",
            TotalQuantity = 500,
            AllocatedQuantity = 100,
            MinimumThreshold = 50
        };
        context.Resources.Add(resource);

        var allocation = new ShelterAllocation
        {
            Id = Guid.NewGuid(),
            ShelterId = shelter.Id,
            PersonName = "Perera Family (4 members)",
            NumberOfPersons = 4,
            CheckInDate = DateTime.UtcNow,
            Notes = "Step-free access required"
        };
        context.ShelterAllocations.Add(allocation);

        var resourceAllocation = new ResourceAllocation
        {
            Id = Guid.NewGuid(),
            ShelterId = shelter.Id,
            ResourceId = resource.Id,
            Quantity = 60,
            Priority = PriorityLevel.High,
            DispatchStatus = 0,
            Notes = "Urgent blankets request"
        };
        context.ResourceAllocations.Add(resourceAllocation);

        context.SaveChanges();

        var service = new ShelterService(shelterRepo, resourceRepo, mockMapping.Object, unitOfWork);
        return (service, context, shelter);
    }

    [Fact]
    public async Task GetAllShelters_ShouldReturnSheltersWithMappedProperties()
    {
        var (service, _, testShelter) = CreateService();

        var result = await service.GetAllSheltersAsync();

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.Contains(result.Data, s => s.Id == testShelter.Id);

        var first = result.Data.First(s => s.Id == testShelter.Id);
        Assert.Equal("Kelani Community Centre", first.FacilityName);
        Assert.Equal("Kelani East", first.Area);
        Assert.Equal(36, first.AvailableCapacity);
        Assert.Equal("Operational", first.Status);
    }

    [Fact]
    public async Task GetAllShelters_FilterByQuery_ShouldReturnMatchingShelter()
    {
        var (service, _, _) = CreateService();

        var result = await service.GetAllSheltersAsync(query: "Kelani");

        Assert.True(result.Succeeded);
        Assert.NotEmpty(result.Data!);
        Assert.All(result.Data!, s => Assert.Contains("Kelani", s.Name, StringComparison.OrdinalIgnoreCase));
    }

    [Fact]
    public async Task GetShelterDashboard_ShouldReturnMetricsAndPriorityItems()
    {
        var (service, _, _) = CreateService();

        var result = await service.GetShelterDashboardAsync();

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.True(result.Data.Metrics.RegisteredShelters >= 1);
        Assert.True(result.Data.Metrics.CurrentOccupancy >= 164);
        Assert.True(result.Data.Metrics.RemainingCapacity >= 36);
        Assert.NotEmpty(result.Data.WorkflowSteps);
    }

    [Fact]
    public async Task CreateShelter_ValidData_ShouldPersistSuccessfully()
    {
        var (service, context, _) = CreateService();
        var dto = new CreateShelterDto
        {
            FacilityName = "Wattala Civic Centre",
            Area = "Wattala South",
            TotalCapacity = 190,
            CurrentOccupancy = 0,
            Facilities = "Family areas, Medical support",
            ContactPhone = "+94 76 345 6789",
            Notes = "Dedicated nursery partitions"
        };

        var result = await service.CreateShelterAsync(dto, Guid.NewGuid());

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.Equal(190, result.Data.TotalCapacity);
        Assert.Equal("Wattala South", result.Data.Area);

        var inDb = await context.Shelters.FindAsync(result.Data.Id);
        Assert.NotNull(inDb);
        Assert.Contains("Wattala Civic Centre", inDb.Name);
    }

    [Fact]
    public async Task CreateShelter_InvalidCapacity_ShouldReturnFailure()
    {
        var (service, _, _) = CreateService();
        var dto = new CreateShelterDto
        {
            FacilityName = "Invalid Shelter",
            TotalCapacity = 0
        };

        var result = await service.CreateShelterAsync(dto, Guid.NewGuid());

        Assert.False(result.Succeeded);
        Assert.Contains("capacity", result.Errors[0], StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task ExecuteShelterAction_Allocation_ShouldIncrementOccupancyAndLogAudit()
    {
        var (service, context, testShelter) = CreateService();
        var initialOccupancy = testShelter.CurrentOccupancy;

        var dto = new ShelterActionRequestDto
        {
            ActionType = "allocation",
            Reason = "Emergency family placement verified",
            AdditionalOccupants = 2
        };

        var result = await service.ExecuteShelterActionAsync(testShelter.Id, dto, Guid.NewGuid(), "Admin Tester");

        Assert.True(result.Succeeded);
        Assert.Equal(initialOccupancy + 2, result.Data!.UpdatedOccupancy);

        var refreshed = await context.Shelters.FindAsync(testShelter.Id);
        Assert.Equal(initialOccupancy + 2, refreshed!.CurrentOccupancy);
    }

    [Fact]
    public async Task ExecuteShelterAction_AllocationWhenFull_ShouldFailGracefully()
    {
        var (service, context, testShelter) = CreateService();
        testShelter.CurrentOccupancy = testShelter.TotalCapacity;
        context.SaveChanges();

        var dto = new ShelterActionRequestDto
        {
            ActionType = "allocation",
            Reason = "Overfill test",
            AdditionalOccupants = 1
        };

        var result = await service.ExecuteShelterActionAsync(testShelter.Id, dto, Guid.NewGuid(), "Admin Tester");

        Assert.False(result.Succeeded);
        Assert.Contains("spaces remaining", result.Errors[0], StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task CreatePlacement_ExceedingCapacity_ShouldThrowCapacityExceededException()
    {
        var (service, _, testShelter) = CreateService();
        var dto = new CreatePlacementDto
        {
            ShelterId = testShelter.Id,
            PersonName = "Massive Household",
            NumberOfPersons = 500 // Only 36 available
        };

        await Assert.ThrowsAsync<CapacityExceededException>(() =>
            service.CreatePlacementAsync(dto, Guid.NewGuid()));
    }

    [Fact]
    public async Task CreatePlacement_WithinCapacity_ShouldCreateAllocationSuccessfully()
    {
        var (service, context, testShelter) = CreateService();
        var initialOcc = testShelter.CurrentOccupancy;
        var dto = new CreatePlacementDto
        {
            ShelterId = testShelter.Id,
            PersonName = "Silva Family (3 members)",
            NumberOfPersons = 3,
            AccessibilityNeeded = "Step-free access",
            SpecialNotes = "Diabetic medication refrigeration"
        };

        var result = await service.CreatePlacementAsync(dto, Guid.NewGuid());

        Assert.True(result.Succeeded);
        Assert.Equal("Silva Family (3 members)", result.Data!.EvacueeName);
        Assert.Equal(3, result.Data.PartySize);

        var refreshed = await context.Shelters.FindAsync(testShelter.Id);
        Assert.Equal(initialOcc + 3, refreshed!.CurrentOccupancy);
    }

    [Fact]
    public async Task UpdatePlacementStatus_Discharge_ShouldDecrementOccupancy()
    {
        var (service, context, testShelter) = CreateService();
        var initialOcc = testShelter.CurrentOccupancy;

        var existingAllocation = context.ShelterAllocations.First(a => a.ShelterId == testShelter.Id);

        var updateDto = new UpdatePlacementStatusDto
        {
            Status = "Discharged",
            Notes = "Evacuee safely returned home"
        };

        var result = await service.UpdatePlacementStatusAsync(existingAllocation.Id, updateDto, Guid.NewGuid());

        Assert.True(result.Succeeded);
        Assert.Equal("Discharged", result.Data!.Status);

        var refreshed = await context.Shelters.FindAsync(testShelter.Id);
        Assert.Equal(initialOcc - existingAllocation.NumberOfPersons, refreshed!.CurrentOccupancy);
    }

    [Fact]
    public async Task CreateResourceRequest_ShouldPersistShelterResourceAllocation()
    {
        var (service, context, testShelter) = CreateService();
        var dto = new CreateShelterResourceRequestDto
        {
            ShelterId = testShelter.Id,
            ItemCategory = "Sanitation Kits",
            Quantity = 80,
            Unit = "Packs",
            Priority = PriorityLevel.Critical,
            Notes = "Urgent hygiene resupply"
        };

        var result = await service.CreateResourceRequestAsync(dto, Guid.NewGuid(), "Shelter Admin");

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.Equal("Critical", result.Data.Urgency);

        var inDb = await context.ResourceAllocations.FindAsync(result.Data.Id);
        Assert.NotNull(inDb);
        Assert.Equal(testShelter.Id, inDb.ShelterId);
        Assert.Equal(80, inDb.Quantity);
    }

    [Fact]
    public async Task GetReports_ShouldCalculateSummaryAndAreaOccupancies()
    {
        var (service, _, _) = CreateService();

        var result = await service.GetReportsAsync();

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.NotNull(result.Data.DailySummary);
        Assert.NotEmpty(result.Data.AreaOccupancies);
    }

    [Fact]
    public async Task ExportReport_Csv_ShouldReturnBase64CsvPayload()
    {
        var (service, _, _) = CreateService();

        var result = await service.ExportReportAsync("full-occupancy", "csv");

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.Equal("text/csv", result.Data.ContentType);
        Assert.False(string.IsNullOrEmpty(result.Data.FileBase64));
    }
}
