using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Xunit;
using HumanitarianCrisisPlatform.API.Controllers;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Crisis;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Enums;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;
using HumanitarianCrisisPlatform.Infrastructure.Data.Seed;
using HumanitarianCrisisPlatform.Infrastructure.Services;
using HumanitarianCrisisPlatform.Tests.IntegrationTests.Infrastructure;

namespace HumanitarianCrisisPlatform.Tests.IntegrationTests.Controllers;

public class CrisesControllerTests : IClassFixture<DatabaseFixture>
{
    private readonly DatabaseFixture _fixture;

    public CrisesControllerTests(DatabaseFixture fixture)
    {
        _fixture = fixture;
    }

    private CrisesController CreateController(ApplicationDbContext? context = null, Guid? currentUserId = null, string role = "Coordinator")
    {
        var db = context ?? _fixture.CreateContext();
        var crisisService = new CrisisService(db);
        var controller = new CrisesController(crisisService);

        var claims = new List<Claim>();
        if (currentUserId.HasValue)
        {
            claims.Add(new Claim(ClaimTypes.NameIdentifier, currentUserId.Value.ToString()));
            claims.Add(new Claim("sub", currentUserId.Value.ToString()));
        }
        claims.Add(new Claim(ClaimTypes.Role, role));

        var user = new ClaimsPrincipal(new ClaimsIdentity(claims, "TestAuth"));
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = user }
        };

        return controller;
    }

    [Fact]
    public async Task GetSummaryStats_ShouldReturnAggregatedCrisisMetrics()
    {
        var controller = CreateController();

        var actionResult = await controller.GetSummaryStats(CancellationToken.None);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<CrisisSummaryStatsDto>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.True(result.Data.TotalCrises >= 1);
        Assert.True(result.Data.ActiveCrises >= 1);
        Assert.True(result.Data.HighSeverityCrises >= 1);
        Assert.True(result.Data.TotalEstimatedAffected >= 1000);
        Assert.True(result.Data.ActiveSheltersCount >= 1);
    }

    [Fact]
    public async Task GetCrises_ShouldReturnListOfCrises()
    {
        var controller = CreateController();

        var actionResult = await controller.GetCrises(null, null, null, null, CancellationToken.None);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<IReadOnlyList<CrisisEventDto>>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.NotEmpty(result.Data);
        Assert.Contains(result.Data, c => c.DisasterType == DisasterType.Flood);
    }

    [Fact]
    public async Task GetCrises_FilteredByDisasterType_ShouldReturnMatchingCrises()
    {
        var controller = CreateController();

        var actionResult = await controller.GetCrises(null, DisasterType.Flood, null, null, CancellationToken.None);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<IReadOnlyList<CrisisEventDto>>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.All(result.Data, c => Assert.Equal(DisasterType.Flood, c.DisasterType));
    }

    [Fact]
    public async Task GetCrises_FilteredBySeverity_ShouldReturnCrisesAtOrAboveSeverity()
    {
        var controller = CreateController();

        var actionResult = await controller.GetCrises(null, null, 4, null, CancellationToken.None);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<IReadOnlyList<CrisisEventDto>>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.All(result.Data, c => Assert.True(c.Severity >= 4));
    }

    [Fact]
    public async Task GetCrisisById_WithExistingId_ShouldReturnDetailedDossier()
    {
        var context = _fixture.CreateContext();
        await DatabaseSeeder.SeedAsync(context);
        var crisis = context.CrisisEvents.First();
        var controller = CreateController(context);

        var actionResult = await controller.GetCrisisById(crisis.Id, CancellationToken.None);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<CrisisDetailDto>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.Equal(crisis.Id, result.Data.Id);
        Assert.Equal(crisis.Title, result.Data.Title);
        Assert.NotEmpty(result.Data.DeployedUnits);
        Assert.NotEmpty(result.Data.HazardZones);
        Assert.NotEmpty(result.Data.UnresolvedIssues);
    }

    [Fact]
    public async Task GetCrisisById_WithNonExistentId_ShouldReturnNotFound()
    {
        var controller = CreateController();
        var nonExistentId = Guid.NewGuid();

        var actionResult = await controller.GetCrisisById(nonExistentId, CancellationToken.None);

        var notFoundResult = Assert.IsType<NotFoundObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<CrisisDetailDto>>(notFoundResult.Value);

        Assert.False(result.Succeeded);
    }

    [Fact]
    public async Task CreateCrisis_WithValidPayload_ShouldDeclareAndLaunchCrisis()
    {
        var coordinatorId = Guid.NewGuid();
        var controller = CreateController(currentUserId: coordinatorId);

        var dto = new CreateCrisisEventDto
        {
            Title = "Cyclone Roanu Response - Southern Coast",
            Description = "Tropical cyclone storm surge breaching coastal levees in Galle and Matara.",
            DisasterType = DisasterType.Storm,
            Severity = 4,
            Region = "Southern Province",
            Latitude = 6.0535m,
            Longitude = 80.2210m,
            AffectedAreaRadius = 25.0m,
            EstimatedAffectedCount = 4500,
            LeadTeam = "Southern Naval Disaster Task Force"
        };

        var actionResult = await controller.CreateCrisis(dto, CancellationToken.None);

        var createdResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<CrisisEventDto>>(createdResult.Value);

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.Equal("Cyclone Roanu Response - Southern Coast", result.Data.Title);
        Assert.Equal(DisasterType.Storm, result.Data.DisasterType);
        Assert.Equal(4, result.Data.Severity);
        Assert.True(result.Data.IsActive);
    }

    [Fact]
    public async Task UpdateCrisis_WithValidPayload_ShouldUpdateDetails()
    {
        var context = _fixture.CreateContext();
        var crisis = new CrisisEvent
        {
            Id = Guid.NewGuid(),
            Title = "Initial Fire Outbreak",
            Description = "Dry forest brush fire",
            DisasterType = DisasterType.Storm,
            Severity = 2,
            IsActive = true
        };
        context.CrisisEvents.Add(crisis);
        await context.SaveChangesAsync();

        var coordinatorId = Guid.NewGuid();
        var controller = CreateController(context, coordinatorId);

        var updateDto = new UpdateCrisisEventDto
        {
            Title = "Escalated Wildfire Threat",
            Description = "High winds spreading fire towards village borders",
            DisasterType = DisasterType.Storm,
            Severity = 4,
            Region = "Central Province",
            Latitude = 7.2906m,
            Longitude = 80.6337m,
            AffectedAreaRadius = 18.0m,
            EstimatedAffectedCount = 1200,
            IsActive = true,
            LeadTeam = "Air Force Helitack Unit"
        };

        var actionResult = await controller.UpdateCrisis(crisis.Id, updateDto, CancellationToken.None);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<CrisisEventDto>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.Equal("Escalated Wildfire Threat", result.Data?.Title);
        Assert.Equal(4, result.Data?.Severity);
    }

    [Fact]
    public async Task CloseCrisis_ShouldMarkAsResolved()
    {
        var context = _fixture.CreateContext();
        var crisis = new CrisisEvent
        {
            Id = Guid.NewGuid(),
            Title = "Controlled River Inundation",
            Description = "Monsoon swell",
            DisasterType = DisasterType.Flood,
            Severity = 2,
            IsActive = true
        };
        context.CrisisEvents.Add(crisis);
        await context.SaveChangesAsync();

        var controller = CreateController(context);
        var closeDto = new CloseCrisisDto
        {
            ResolutionSummary = "Floodwaters completely receded. All displaced persons safely returned home."
        };

        var actionResult = await controller.CloseCrisis(crisis.Id, closeDto, CancellationToken.None);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<bool>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.True(result.Data);

        var updated = await context.CrisisEvents.FindAsync(crisis.Id);
        Assert.NotNull(updated);
        Assert.False(updated.IsActive);
        Assert.NotNull(updated.EndDate);
        Assert.Contains("safely returned home", updated.Description);
    }

    [Fact]
    public async Task AssignResponseTeam_ShouldDispatchUnit()
    {
        var context = _fixture.CreateContext();
        var crisis = new CrisisEvent
        {
            Id = Guid.NewGuid(),
            Title = "Target Operations Sector",
            DisasterType = DisasterType.Flood,
            Severity = 3,
            IsActive = true
        };
        context.CrisisEvents.Add(crisis);
        await context.SaveChangesAsync();

        var controller = CreateController(context);
        var teamDto = new AssignCrisisTeamDto
        {
            TeamName = "Special Boat Squadron Unit 7",
            OperationalDirectives = "Conduct immediate high-ground evacuation."
        };

        var actionResult = await controller.AssignResponseTeam(crisis.Id, teamDto, CancellationToken.None);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<bool>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.True(result.Data);

        var updated = await context.CrisisEvents.FindAsync(crisis.Id);
        Assert.NotNull(updated);
        Assert.Contains("Special Boat Squadron Unit 7", updated.Description);
    }

    [Fact]
    public async Task GetHazardZones_ShouldReturnPolygonBoundaries()
    {
        var controller = CreateController();

        var actionResult = await controller.GetAllHazardZones(CancellationToken.None);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<IReadOnlyList<CrisisHazardZoneDto>>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.NotEmpty(result.Data);
        Assert.Contains(result.Data, z => z.Coordinates.Count >= 3);
    }
}

