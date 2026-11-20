using System.Reflection;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Xunit;
using HumanitarianCrisisPlatform.API.Controllers;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Resources;
using HumanitarianCrisisPlatform.Application.Services;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;
using HumanitarianCrisisPlatform.Infrastructure.Repositories;
using HumanitarianCrisisPlatform.Tests.IntegrationTests.Infrastructure;

namespace HumanitarianCrisisPlatform.Tests.IntegrationTests.Controllers;

public class ResourcesControllerTests : IClassFixture<DatabaseFixture>
{
    private readonly DatabaseFixture _fixture;

    public ResourcesControllerTests(DatabaseFixture fixture)
    {
        _fixture = fixture;
    }

    private ResourcesController CreateController(ApplicationDbContext? context = null, string role = "LogisticsManager", string userName = "Dilan Perera")
    {
        var db = context ?? _fixture.CreateContext();
        var repo = new ResourceRepository(db);
        var uow = new UnitOfWork(db);
        var service = new ResourceAllocationService(repo, uow);
        var controller = new ResourcesController(service);

        var userId = Guid.NewGuid();
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId.ToString()),
            new(ClaimTypes.Name, userName),
            new(ClaimTypes.Role, role)
        };

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity(claims, "TestAuth"))
            }
        };

        return controller;
    }

    [Fact]
    public void Endpoints_HaveExpectedRoleAuthorizationAttributes()
    {
        var createMethod = typeof(ResourcesController).GetMethod(nameof(ResourcesController.CreateResource));
        Assert.NotNull(createMethod);
        var createAuth = createMethod!.GetCustomAttribute<AuthorizeAttribute>();
        Assert.NotNull(createAuth);
        Assert.Contains("LogisticsManager", createAuth!.Roles!);

        var approveMethod = typeof(ResourcesController).GetMethod(nameof(ResourcesController.ApproveAllocation));
        Assert.NotNull(approveMethod);
        var approveAuth = approveMethod!.GetCustomAttribute<AuthorizeAttribute>();
        Assert.NotNull(approveAuth);
        Assert.Contains("LogisticsManager", approveAuth!.Roles!);

        var deleteMethod = typeof(ResourcesController).GetMethod(nameof(ResourcesController.DeleteResource));
        Assert.NotNull(deleteMethod);
        var deleteAuth = deleteMethod!.GetCustomAttribute<AuthorizeAttribute>();
        Assert.NotNull(deleteAuth);
        Assert.Contains("LogisticsManager", deleteAuth!.Roles!);
    }

    [Fact]
    public async Task GetInventory_ShouldReturnOkWithItems()
    {
        var controller = CreateController();
        var response = await controller.GetInventory(null, null, null, null, default);

        var okResult = Assert.IsType<OkObjectResult>(response.Result);
        var result = Assert.IsType<Result<IReadOnlyList<ResourceDto>>>(okResult.Value);
        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
    }

    [Fact]
    public async Task GetOverview_ShouldReturnOkWithSummary()
    {
        var controller = CreateController();
        var response = await controller.GetOverview(default);

        var okResult = Assert.IsType<OkObjectResult>(response.Result);
        var result = Assert.IsType<Result<ResourceOverviewDto>>(okResult.Value);
        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.NotNull(result.Data.AvailablePercentage);
    }

    [Fact]
    public async Task CreateResource_WhenValid_ShouldReturnCreated()
    {
        using var db = _fixture.CreateContext();
        var controller = CreateController(db);

        var dto = new CreateResourceDto
        {
            Name = "Emergency Family Tents (4P)",
            Category = "Shelter Materials",
            Quantity = 120,
            Unit = "Tents",
            StorageLocation = "Central Depot",
            MinimumThreshold = 25
        };

        var response = await controller.CreateResource(dto, default);

        var createdResult = Assert.IsType<CreatedAtActionResult>(response.Result);
        var result = Assert.IsType<Result<ResourceDto>>(createdResult.Value);
        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.Equal("Emergency Family Tents (4P)", result.Data.Name);
    }

    [Fact]
    public async Task CreateResource_WhenInvalidName_ShouldReturnBadRequest()
    {
        var controller = CreateController();

        var dto = new CreateResourceDto
        {
            Name = "", // Invalid
            Quantity = 50
        };

        var response = await controller.CreateResource(dto, default);

        var badRequest = Assert.IsType<BadRequestObjectResult>(response.Result);
        var result = Assert.IsType<Result<ResourceDto>>(badRequest.Value);
        Assert.False(result.Succeeded);
        Assert.Contains("Item name is required", string.Join(" ", result.Errors));
    }

    [Fact]
    public async Task GetStockAlerts_ShouldReturnOk()
    {
        var controller = CreateController();
        var response = await controller.GetAlerts(default);

        var okResult = Assert.IsType<OkObjectResult>(response.Result);
        var result = Assert.IsType<Result<IReadOnlyList<StockAlertDto>>>(okResult.Value);
        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
    }

    [Fact]
    public async Task Export_ShouldReturnCsvFileResult()
    {
        var controller = CreateController();
        var response = await controller.Export("inventory", default);

        var fileResult = Assert.IsType<FileContentResult>(response);
        Assert.Equal("text/csv", fileResult.ContentType);
        Assert.NotEmpty(fileResult.FileContents);
    }

    [Fact]
    public async Task UpdateStockQuantity_WhenValid_ShouldReturnOkWithUpdatedStock()
    {
        using var db = _fixture.CreateContext();
        var controller = CreateController(db);

        // First create an item
        var createResponse = await controller.CreateResource(new CreateResourceDto
        {
            Name = "Clean Drinking Water Cans",
            Category = "Water",
            Quantity = 100,
            MinimumThreshold = 50
        }, default);

        var created = Assert.IsType<CreatedAtActionResult>(createResponse.Result);
        var createdResource = Assert.IsType<Result<ResourceDto>>(created.Value).Data!;

        // Update stock quantity to 25 (Available: 25 <= 50 => "Low stock")
        var updateResponse = await controller.UpdateStockQuantity(createdResource.Id, new UpdateStockQuantityDto
        {
            Quantity = 25,
            Reason = "Crisis staging deduction"
        }, default);

        var okResult = Assert.IsType<OkObjectResult>(updateResponse.Result);
        var result = Assert.IsType<Result<ResourceDto>>(okResult.Value);
        Assert.True(result.Succeeded);
        Assert.Equal(25, result.Data!.TotalQuantity);
        Assert.Equal("Low stock", result.Data.StockStatus);
    }

    [Fact]
    public async Task UpdateStockQuantity_WhenNegative_ShouldReturnBadRequest()
    {
        var controller = CreateController();
        var response = await controller.UpdateStockQuantity(Guid.NewGuid(), new UpdateStockQuantityDto
        {
            Quantity = -20
        }, default);

        var badRequest = Assert.IsType<BadRequestObjectResult>(response.Result);
        var result = Assert.IsType<Result<ResourceDto>>(badRequest.Value);
        Assert.False(result.Succeeded);
        Assert.Contains("Stock quantity cannot be negative", string.Join(" ", result.Errors));
    }

    [Fact]
    public async Task UpdateStockQuantity_WhenNotFound_ShouldReturnNotFound()
    {
        using var db = _fixture.CreateContext();
        var controller = CreateController(db);

        var response = await controller.UpdateStockQuantity(Guid.NewGuid(), new UpdateStockQuantityDto
        {
            Quantity = 100
        }, default);

        var notFound = Assert.IsType<NotFoundObjectResult>(response.Result);
        var result = Assert.IsType<Result<ResourceDto>>(notFound.Value);
        Assert.False(result.Succeeded);
    }

    [Fact]
    public async Task AdjustStock_WhenNotFound_ShouldReturnNotFound()
    {
        using var db = _fixture.CreateContext();
        var controller = CreateController(db);

        var response = await controller.AdjustStock(Guid.NewGuid(), new StockAdjustmentDto
        {
            QuantityDelta = 50
        }, default);

        var notFound = Assert.IsType<NotFoundObjectResult>(response.Result);
        var result = Assert.IsType<Result<ResourceDto>>(notFound.Value);
        Assert.False(result.Succeeded);
    }
}
