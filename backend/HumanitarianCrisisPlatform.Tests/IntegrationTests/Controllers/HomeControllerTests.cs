using Xunit;
using Microsoft.AspNetCore.Mvc;
using HumanitarianCrisisPlatform.API.Controllers;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Home;
using HumanitarianCrisisPlatform.Infrastructure.Services;
using HumanitarianCrisisPlatform.Tests.IntegrationTests.Infrastructure;

namespace HumanitarianCrisisPlatform.Tests.IntegrationTests.Controllers;

public class HomeControllerTests : IClassFixture<DatabaseFixture>
{
    private readonly DatabaseFixture _fixture;

    public HomeControllerTests(DatabaseFixture fixture)
    {
        _fixture = fixture;
    }

    [Fact]
    public async Task GetSummary_ShouldReturnSuccessWithLiveMetricsAndActiveCrisis()
    {
        var context = _fixture.CreateContext();
        var homeService = new HomeService(context);
        var controller = new HomeController(homeService);

        var actionResult = await controller.GetSummary(CancellationToken.None);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<HomeSummaryDto>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);

        // Verify Active Crisis Details
        Assert.False(string.IsNullOrWhiteSpace(result.Data.ActiveCrisis.Title));
        Assert.Contains("Western Province", result.Data.ActiveCrisis.Region);
        Assert.Equal("Flood", result.Data.ActiveCrisis.DisasterType);

        // Verify Platform Telemetry
        Assert.True(result.Data.Metrics.PeopleSupported >= 12000);
        Assert.True(result.Data.Metrics.OperationalSheltersCount >= 1);
        Assert.True(result.Data.Metrics.ActiveResponseOperations >= 1);
        Assert.Equal(94.0, result.Data.Metrics.RequestsReviewedOnTimePercent);

        // Verify Assistance Categories
        Assert.NotEmpty(result.Data.QuickCategories);
        Assert.Contains(result.Data.QuickCategories, c => c.Key == "water");
        Assert.Contains(result.Data.QuickCategories, c => c.Key == "food");
        Assert.Contains(result.Data.QuickCategories, c => c.Key == "medicine");

        // Verify Shelters & Hotlines
        Assert.NotEmpty(result.Data.VerifiedShelters);
        Assert.NotEmpty(result.Data.EmergencyHotlines);
        Assert.Contains(result.Data.EmergencyHotlines, h => h.Number == "117");
        Assert.Contains(result.Data.EmergencyHotlines, h => h.Number == "1990");
    }

    [Fact]
    public async Task TrackRequest_WithValidCode_ShouldReturnMilestonesAndStatus()
    {
        var context = _fixture.CreateContext();
        var homeService = new HomeService(context);
        var controller = new HomeController(homeService);

        var actionResult = await controller.TrackRequest("REQ-2026-01842", CancellationToken.None);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<TrackRequestResultDto>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.Contains("1842", result.Data.PublicReference);
        Assert.False(string.IsNullOrWhiteSpace(result.Data.Status));
        Assert.NotEmpty(result.Data.Timeline);
        Assert.Contains(result.Data.Timeline, t => t.Title.Contains("Request"));
    }

    [Fact]
    public async Task TrackRequest_WithEmptyReference_ShouldReturnBadRequest()
    {
        var context = _fixture.CreateContext();
        var homeService = new HomeService(context);
        var controller = new HomeController(homeService);

        var actionResult = await controller.TrackRequest("   ", CancellationToken.None);

        var badResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<TrackRequestResultDto>>(badResult.Value);

        Assert.False(result.Succeeded);
    }

    [Fact]
    public async Task GetSafetyGuidance_ShouldReturnFloodAndLandslideAdvisories()
    {
        var context = _fixture.CreateContext();
        var homeService = new HomeService(context);
        var controller = new HomeController(homeService);

        var actionResult = await controller.GetSafetyGuidance(CancellationToken.None);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<IReadOnlyList<SafetyGuidanceDto>>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.NotEmpty(result.Data);
        Assert.Contains(result.Data, g => g.HazardType == "Flood");
        Assert.Contains(result.Data, g => g.HazardType == "Landslide");
    }

    [Fact]
    public async Task GetAlerts_ShouldReturnCurrentEmergencyBroadcasts()
    {
        var context = _fixture.CreateContext();
        var homeService = new HomeService(context);
        var controller = new HomeController(homeService);

        var actionResult = await controller.GetAlerts(CancellationToken.None);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<IReadOnlyList<HomeAlertDto>>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.NotEmpty(result.Data);
        Assert.Contains(result.Data, a => a.Level == "CRITICAL");
    }

    [Fact]
    public async Task GetHotlines_ShouldReturnEmergencyDirectory()
    {
        var context = _fixture.CreateContext();
        var homeService = new HomeService(context);
        var controller = new HomeController(homeService);

        var actionResult = await controller.GetHotlines(CancellationToken.None);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<IReadOnlyList<EmergencyContactDto>>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.NotEmpty(result.Data);
        Assert.Contains(result.Data, h => h.Number == "119");
        Assert.Contains(result.Data, h => h.Number == "117");
    }
}

