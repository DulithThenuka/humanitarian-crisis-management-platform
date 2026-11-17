using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using HumanitarianCrisisPlatform.API.Controllers;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Shelters;
using HumanitarianCrisisPlatform.Application.Interfaces.Infrastructure;
using HumanitarianCrisisPlatform.Application.Services;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Enums;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;
using HumanitarianCrisisPlatform.Infrastructure.Repositories;
using HumanitarianCrisisPlatform.Tests.IntegrationTests.Infrastructure;

namespace HumanitarianCrisisPlatform.Tests.IntegrationTests.Controllers;

public class SheltersControllerTests : IClassFixture<DatabaseFixture>
{
    private readonly DatabaseFixture _fixture;

    public SheltersControllerTests(DatabaseFixture fixture)
    {
        _fixture = fixture;
    }

    private (SheltersController controller, ApplicationDbContext context, Shelter testShelter) CreateController(
        string role = "ShelterManager",
        Guid? userId = null)
    {
        var context = _fixture.CreateContext();
        var shelterRepo = new ShelterRepository(context);
        var resourceRepo = new ResourceRepository(context);
        var unitOfWork = new UnitOfWork(context);

        var mockMapping = new Mock<IMappingService>();
        mockMapping.Setup(m => m.CalculateDistanceKm(It.IsAny<decimal>(), It.IsAny<decimal>(), It.IsAny<decimal>(), It.IsAny<decimal>()))
            .Returns(3.2);

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

        var allocation = new ShelterAllocation
        {
            Id = Guid.NewGuid(),
            ShelterId = shelter.Id,
            PersonName = "Perera Family (4 members)",
            NumberOfPersons = 4,
            CheckInDate = DateTime.UtcNow,
            Notes = "Step-free access"
        };
        context.ShelterAllocations.Add(allocation);

        context.SaveChanges();

        var service = new ShelterService(shelterRepo, resourceRepo, mockMapping.Object, unitOfWork);
        var controller = new SheltersController(service);

        var currentUserId = userId ?? Guid.NewGuid();
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, currentUserId.ToString()),
            new("sub", currentUserId.ToString()),
            new(ClaimTypes.Name, "Tharushi De Alwis"),
            new(ClaimTypes.Role, role)
        };

        var user = new ClaimsPrincipal(new ClaimsIdentity(claims, "TestAuth"));
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = user }
        };

        return (controller, context, shelter);
    }

    [Fact]
    public async Task GetAll_ShouldReturn200WithShelterList()
    {
        var (controller, _, testShelter) = CreateController();

        var actionResult = await controller.GetAll();

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<IReadOnlyList<ShelterDto>>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.Contains(result.Data, s => s.Id == testShelter.Id);
    }

    [Fact]
    public async Task GetSummary_ShouldReturn200WithOccupancyBreakdown()
    {
        var (controller, _, _) = CreateController();

        var actionResult = await controller.GetSummary();

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<ShelterSummaryDto>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.True(result.Data.TotalShelters >= 1);
        Assert.True(result.Data.TotalCapacity >= 200);
    }

    [Fact]
    public async Task GetDashboard_AsShelterManager_ShouldReturn200WithDashboardTelemetry()
    {
        var (controller, _, _) = CreateController(role: "ShelterManager");

        var actionResult = await controller.GetDashboard();

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<ShelterDashboardDto>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.True(result.Data.Metrics.RegisteredShelters >= 1);
        Assert.NotEmpty(result.Data.PriorityItems);
        Assert.NotEmpty(result.Data.WorkflowSteps);
    }

    [Fact]
    public async Task GetById_ExistingId_ShouldReturn200()
    {
        var (controller, _, testShelter) = CreateController();

        var actionResult = await controller.GetById(testShelter.Id);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<ShelterDto>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.Equal(testShelter.Id, result.Data!.Id);
    }

    [Fact]
    public async Task GetById_NonExistingId_ShouldReturn404()
    {
        var (controller, _, _) = CreateController();

        var actionResult = await controller.GetById(Guid.NewGuid());

        var notFound = Assert.IsType<NotFoundObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<ShelterDto>>(notFound.Value);
        Assert.False(result.Succeeded);
    }

    [Fact]
    public async Task CreateShelter_ValidData_ShouldReturn201Created()
    {
        var (controller, _, _) = CreateController(role: "ShelterManager");
        var dto = new CreateShelterDto
        {
            FacilityName = "Biyagama School Hall",
            Area = "Biyagama North",
            TotalCapacity = 220,
            CurrentOccupancy = 0,
            Facilities = "Accessible toilets",
            ContactPhone = "+94 71 890 1234"
        };

        var actionResult = await controller.CreateShelter(dto);

        var createdResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<ShelterDto>>(createdResult.Value);

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.Equal(220, result.Data.TotalCapacity);
    }

    [Fact]
    public async Task ExecuteAction_Allocation_ShouldReturn200WithUpdatedOccupancy()
    {
        var (controller, _, testShelter) = CreateController(role: "ShelterManager");
        var dto = new ShelterActionRequestDto
        {
            ActionType = "allocation",
            Reason = "Triage handoff confirmed",
            AdditionalOccupants = 1
        };

        var actionResult = await controller.ExecuteAction(testShelter.Id, dto);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<ShelterActionResultDto>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.True(result.Data!.Success);
        Assert.Equal(165, result.Data.UpdatedOccupancy);
    }

    [Fact]
    public async Task GetPlacements_ShouldReturn200WithPlacementList()
    {
        var (controller, _, _) = CreateController(role: "ShelterManager");

        var actionResult = await controller.GetPlacements();

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<IReadOnlyList<PlacementAllocationDto>>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.NotEmpty(result.Data!);
    }

    [Fact]
    public async Task CreatePlacement_Valid_ShouldReturn200()
    {
        var (controller, _, testShelter) = CreateController(role: "ShelterManager");
        var dto = new CreatePlacementDto
        {
            ShelterId = testShelter.Id,
            PersonName = "Gunasekara Family (5 members)",
            NumberOfPersons = 5,
            AccessibilityNeeded = "Medical support"
        };

        var actionResult = await controller.CreatePlacement(dto);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<PlacementAllocationDto>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.Equal(5, result.Data!.PartySize);
    }

    [Fact]
    public async Task CreateResourceRequest_Valid_ShouldReturn200()
    {
        var (controller, _, testShelter) = CreateController(role: "ShelterManager");
        var dto = new CreateShelterResourceRequestDto
        {
            ShelterId = testShelter.Id,
            ItemCategory = "Sanitation Kits",
            Quantity = 100,
            Unit = "Kits",
            Priority = PriorityLevel.High,
            Notes = "Requested for community hall"
        };

        var actionResult = await controller.CreateResourceRequest(dto);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<ShelterResourceRequestDto>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.Equal("Sanitation Kits", result.Data!.ItemCategory);
    }

    [Fact]
    public async Task GetReports_ShouldReturn200WithAnalytics()
    {
        var (controller, _, _) = CreateController(role: "ShelterManager");

        var actionResult = await controller.GetReports();

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<ShelterReportsDto>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data!.DailySummary);
    }

    [Fact]
    public async Task ExportReport_ShouldReturn200WithDownloadablePayload()
    {
        var (controller, _, _) = CreateController(role: "ShelterManager");

        var actionResult = await controller.ExportReport("full-occupancy", "csv");

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<ExportReportResponseDto>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.Equal("text/csv", result.Data!.ContentType);
        Assert.False(string.IsNullOrEmpty(result.Data.FileBase64));
    }
}

