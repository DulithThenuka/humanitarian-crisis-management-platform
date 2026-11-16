using System.Reflection;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Xunit;
using HumanitarianCrisisPlatform.API.Controllers;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Donations;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;
using HumanitarianCrisisPlatform.Infrastructure.Services;
using HumanitarianCrisisPlatform.Tests.IntegrationTests.Infrastructure;

namespace HumanitarianCrisisPlatform.Tests.IntegrationTests.Controllers;

public class DonationsControllerTests : IClassFixture<DatabaseFixture>
{
    private readonly DatabaseFixture _fixture;

    public DonationsControllerTests(DatabaseFixture fixture)
    {
        _fixture = fixture;
    }

    private DonationsController CreateController(
        ApplicationDbContext? context = null,
        Guid? currentUserId = null,
        string role = "Coordinator")
    {
        var db = context ?? _fixture.CreateContext();
        var service = new DonationService(db);
        var controller = new DonationsController(service);

        var userId = currentUserId ?? Guid.Parse("11111111-1111-1111-1111-111111111111");
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId.ToString()),
            new("sub", userId.ToString()),
            new(ClaimTypes.Role, role)
        };

        var user = new ClaimsPrincipal(new ClaimsIdentity(claims, "TestAuth"));
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = user }
        };

        return controller;
    }

    [Fact]
    public async Task CreateDonation_MonetaryWithPackage_ShouldPersistAndReturnCreated()
    {
        using var db = _fixture.CreateContext();
        var controller = CreateController(db, role: "Citizen");

        var dto = new CreateDonationDto
        {
            DonorName = "Help Sri Lanka Foundation",
            DonorEmail = "grants@helpsrilanka.org",
            DonationType = 0,
            PackageId = "PKG-01",
            ItemQuantity = 2,
            Currency = "LKR"
        };

        var actionResult = await controller.Create(dto, CancellationToken.None);

        var created = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<DonationDto>>(created.Value);

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.Equal("Help Sri Lanka Foundation", result.Data.DonorName);
        Assert.Equal(15000m, result.Data.Amount);
        Assert.Equal("LKR", result.Data.Currency);
        Assert.Equal(0, result.Data.Status);
        Assert.Equal("Pledged", result.Data.StatusName);
        Assert.StartsWith("TXN-", result.Data.TransactionCode);
        Assert.Contains("PKG-01", result.Data.ItemDescription);

        // Verify persisted in DbContext
        var getResult = await controller.GetById(result.Data.Id, CancellationToken.None);
        var okResult = Assert.IsType<OkObjectResult>(getResult.Result);
        var fetched = Assert.IsAssignableFrom<Result<DonationDto>>(okResult.Value);
        Assert.Equal(result.Data.Id, fetched.Data!.Id);
    }

    [Fact]
    public async Task CreateDonation_Material_ShouldPersistAndFilterByType()
    {
        using var db = _fixture.CreateContext();
        var controller = CreateController(db, role: "Citizen");

        var dto = new CreateDonationDto
        {
            DonorName = "Colombo Medical Guild",
            DonorEmail = "supply@cmg.lk",
            DonationType = 1,
            ItemDescription = "Emergency Medical Kits",
            ItemQuantity = 50
        };

        var createAction = await controller.Create(dto, CancellationToken.None);
        Assert.IsType<CreatedAtActionResult>(createAction.Result);

        var listAction = await controller.GetDonations(null, 1, null, "Medical", CancellationToken.None);
        var okResult = Assert.IsType<OkObjectResult>(listAction.Result);
        var result = Assert.IsAssignableFrom<Result<IReadOnlyList<DonationDto>>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.Contains(result.Data, d => d.DonorName == "Colombo Medical Guild" && d.DonationType == 1);
    }

    [Fact]
    public async Task CreateDonation_InvalidMonetaryWithoutAmount_ShouldReturnBadRequest()
    {
        using var db = _fixture.CreateContext();
        var controller = CreateController(db);

        var dto = new CreateDonationDto
        {
            DonorName = "Test Donor",
            DonationType = 0,
            Amount = null
        };

        var actionResult = await controller.Create(dto, CancellationToken.None);

        var badRequest = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<DonationDto>>(badRequest.Value);
        Assert.False(result.Succeeded);
    }

    [Fact]
    public async Task CreateDonation_NonExistentPackage_ShouldReturnBadRequest()
    {
        using var db = _fixture.CreateContext();
        var controller = CreateController(db);

        var dto = new CreateDonationDto
        {
            DonorName = "Test Donor",
            DonationType = 0,
            PackageId = "PKG-999"
        };

        var actionResult = await controller.Create(dto, CancellationToken.None);

        var badRequest = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<DonationDto>>(badRequest.Value);
        Assert.False(result.Succeeded);
    }

    [Fact]
    public async Task UpdateStatus_ValidTransition_ShouldSetReceivedAtAndDistributed()
    {
        using var db = _fixture.CreateContext();
        var controller = CreateController(db, role: "Coordinator");

        var createAction = await controller.Create(new CreateDonationDto
        {
            DonorName = "Rotary Club Colombo",
            DonationType = 0,
            Amount = 750000m,
            Currency = "LKR"
        }, CancellationToken.None);

        var created = Assert.IsType<CreatedAtActionResult>(createAction.Result);
        var createdId = ((Result<DonationDto>)created.Value!).Data!.Id;

        var receivedAction = await controller.UpdateStatus(createdId, new UpdateDonationStatusDto { Status = 1 }, CancellationToken.None);
        var receivedOk = Assert.IsType<OkObjectResult>(receivedAction.Result);
        var receivedResult = Assert.IsAssignableFrom<Result<DonationDto>>(receivedOk.Value);
        Assert.Equal(1, receivedResult.Data!.Status);
        Assert.Equal("Received", receivedResult.Data.StatusName);
        Assert.NotNull(receivedResult.Data.ReceivedAt);

        var distributedAction = await controller.UpdateStatus(createdId, new UpdateDonationStatusDto { Status = 2 }, CancellationToken.None);
        var distributedOk = Assert.IsType<OkObjectResult>(distributedAction.Result);
        var distributedResult = Assert.IsAssignableFrom<Result<DonationDto>>(distributedOk.Value);
        Assert.Equal(2, distributedResult.Data!.Status);
        Assert.Equal("Distributed", distributedResult.Data.StatusName);
    }

    [Fact]
    public async Task UpdateStatus_NonExistentId_ShouldReturnNotFound()
    {
        using var db = _fixture.CreateContext();
        var controller = CreateController(db);

        var actionResult = await controller.UpdateStatus(Guid.NewGuid(), new UpdateDonationStatusDto { Status = 1 }, CancellationToken.None);
        Assert.IsType<NotFoundObjectResult>(actionResult.Result);
    }

    [Fact]
    public async Task GetSummaryAndPackages_ShouldReflectPersistedDonations()
    {
        using var db = _fixture.CreateContext();
        var controller = CreateController(db);

        await controller.Create(new CreateDonationDto
        {
            DonorName = "Ceylon Tea Exporters",
            DonationType = 0,
            PackageId = "PKG-02",
            ItemQuantity = 3
        }, CancellationToken.None);

        var summaryAction = await controller.GetSummary(CancellationToken.None);
        var summaryOk = Assert.IsType<OkObjectResult>(summaryAction.Result);
        var summary = Assert.IsAssignableFrom<Result<DonationSummaryDto>>(summaryOk.Value);
        Assert.True(summary.Succeeded);
        Assert.True(summary.Data!.TotalFundsRaised >= 75000m);
        Assert.True(summary.Data.TotalDonationsCount >= 1);

        var packagesAction = await controller.GetReliefPackages(CancellationToken.None);
        var packagesOk = Assert.IsType<OkObjectResult>(packagesAction.Result);
        var packages = Assert.IsAssignableFrom<Result<IReadOnlyList<ReliefPackageDto>>>(packagesOk.Value);
        Assert.True(packages.Succeeded);
        Assert.Equal(4, packages.Data!.Count);
        Assert.True(packages.Data.First(p => p.Id == "PKG-02").Funded >= 3);
    }

    [Fact]
    public async Task GetReceipt_ShouldReturnFormattedReceipt()
    {
        using var db = _fixture.CreateContext();
        var controller = CreateController(db);

        var createAction = await controller.Create(new CreateDonationDto
        {
            DonorName = "Priyantha Silva",
            DonorEmail = "priyantha@example.com",
            DonationType = 0,
            Amount = 50000m
        }, CancellationToken.None);
        var createdId = ((Result<DonationDto>)((CreatedAtActionResult)createAction.Result!).Value!).Data!.Id;

        var receiptAction = await controller.GetReceipt(createdId, CancellationToken.None);
        var okResult = Assert.IsType<OkObjectResult>(receiptAction.Result);
        var receipt = Assert.IsAssignableFrom<Result<DonationReceiptDto>>(okResult.Value);

        Assert.True(receipt.Succeeded);
        Assert.StartsWith("RCT-", receipt.Data!.ReceiptNumber);
        Assert.StartsWith("VER-", receipt.Data.VerificationCode);
        Assert.Equal("Priyantha Silva", receipt.Data.DonorName);
    }

    [Fact]
    public async Task DeleteDonation_ShouldRemoveRecord()
    {
        using var db = _fixture.CreateContext();
        var controller = CreateController(db, role: "Admin");

        var createAction = await controller.Create(new CreateDonationDto
        {
            DonorName = "Duplicate Test",
            DonationType = 0,
            Amount = 1000m
        }, CancellationToken.None);
        var createdId = ((Result<DonationDto>)((CreatedAtActionResult)createAction.Result!).Value!).Data!.Id;

        var deleteAction = await controller.Delete(createdId, CancellationToken.None);
        Assert.IsType<OkObjectResult>(deleteAction.Result);

        var getAction = await controller.GetById(createdId, CancellationToken.None);
        Assert.IsType<NotFoundObjectResult>(getAction.Result);
    }

    [Fact]
    public void DonationsController_ShouldEnforceExpectedAuthorizationAttributes()
    {
        var type = typeof(DonationsController);

        var createMethod = type.GetMethod(nameof(DonationsController.Create));
        Assert.NotNull(createMethod?.GetCustomAttribute<AuthorizeAttribute>());

        var updateStatusAuth = type.GetMethod(nameof(DonationsController.UpdateStatus))
            ?.GetCustomAttribute<AuthorizeAttribute>();
        Assert.NotNull(updateStatusAuth);
        Assert.Contains("Admin", updateStatusAuth!.Roles);
        Assert.Contains("Coordinator", updateStatusAuth.Roles);
        Assert.Contains("LogisticsManager", updateStatusAuth.Roles);

        var deleteAuth = type.GetMethod(nameof(DonationsController.Delete))
            ?.GetCustomAttribute<AuthorizeAttribute>();
        Assert.NotNull(deleteAuth);
        Assert.Contains("Admin", deleteAuth!.Roles);
        Assert.Contains("Coordinator", deleteAuth.Roles);
    }
}

