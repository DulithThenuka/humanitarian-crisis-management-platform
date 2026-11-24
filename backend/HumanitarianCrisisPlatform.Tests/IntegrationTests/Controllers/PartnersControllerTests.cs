using System.Reflection;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Xunit;
using HumanitarianCrisisPlatform.API.Controllers;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Partners;
using HumanitarianCrisisPlatform.Application.Services;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;
using HumanitarianCrisisPlatform.Infrastructure.Data.Seed;
using HumanitarianCrisisPlatform.Infrastructure.Repositories;
using HumanitarianCrisisPlatform.Tests.IntegrationTests.Infrastructure;

namespace HumanitarianCrisisPlatform.Tests.IntegrationTests.Controllers;

public class PartnersControllerTests : IClassFixture<DatabaseFixture>
{
    private readonly DatabaseFixture _fixture;

    public PartnersControllerTests(DatabaseFixture fixture)
    {
        _fixture = fixture;
    }

    private PartnersController CreateController(ApplicationDbContext? context = null, string role = "Coordinator")
    {
        var db = context ?? _fixture.CreateContext();
        var repo = new PartnerRepository(db);
        var uow = new UnitOfWork(db);
        var service = new PartnerService(repo, uow);
        var controller = new PartnersController(service);

        var userId = Guid.NewGuid();
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId.ToString()),
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
    public void Controller_HasExpectedRoleAuthorizationAttributes()
    {
        var classAuth = typeof(PartnersController).GetCustomAttribute<AuthorizeAttribute>();
        Assert.NotNull(classAuth);
        Assert.Equal("Coordinator,Admin,LogisticsManager,PartnerOfficer,PartnerOrganisationOfficer,Partner", classAuth!.Roles);

        var createMethod = typeof(PartnersController).GetMethod(nameof(PartnersController.CreatePartner));
        var createAuth = createMethod?.GetCustomAttribute<AuthorizeAttribute>();
        Assert.NotNull(createAuth);
        Assert.Equal("Coordinator,Admin", createAuth!.Roles);
    }

    [Fact]
    public async Task GetPartnersAndSummary_ReturnsSeededPartners()
    {
        var db = _fixture.CreateContext();
        await PartnerSeeder.SeedAsync(db);
        var controller = CreateController(db);

        var partnersAction = await controller.GetPartners(cancellationToken: CancellationToken.None);
        var partnersOk = Assert.IsType<OkObjectResult>(partnersAction.Result);
        var partnersResult = Assert.IsAssignableFrom<Result<IReadOnlyList<PartnerOrganisationDto>>>(partnersOk.Value);
        Assert.True(partnersResult.Succeeded);
        Assert.True(partnersResult.Data!.Count >= 5);

        var summaryAction = await controller.GetSummary(CancellationToken.None);
        var summaryOk = Assert.IsType<OkObjectResult>(summaryAction.Result);
        var summaryResult = Assert.IsAssignableFrom<Result<PartnerPortalSummaryDto>>(summaryOk.Value);
        Assert.True(summaryResult.Succeeded);
        Assert.True(summaryResult.Data!.AccreditedPartnersCount >= 5);
    }

    [Fact]
    public async Task LogAndUpdateCommitment_PersistsInDatabase()
    {
        var db = _fixture.CreateContext();
        await PartnerSeeder.SeedAsync(db);
        var controller = CreateController(db);

        var partnersAction = await controller.GetPartners(cancellationToken: CancellationToken.None);
        var partnersOk = Assert.IsType<OkObjectResult>(partnersAction.Result);
        var partners = ((Result<IReadOnlyList<PartnerOrganisationDto>>)partnersOk.Value!).Data!;
        var targetPartner = partners[0];

        var logAction = await controller.LogCommitment(new CreatePartnerCommitmentDto
        {
            PartnerOrganisationId = targetPartner.Id,
            Item = "Portable Water Filtration Units",
            Qty = 15,
            DestinationZone = "Kelani East - Sector 03",
            Status = "Pledged",
            EstimatedValueLkr = 3_500_000m
        }, CancellationToken.None);

        var logOk = Assert.IsType<OkObjectResult>(logAction.Result);
        var logResult = Assert.IsAssignableFrom<Result<PartnerCommitmentDto>>(logOk.Value);
        Assert.True(logResult.Succeeded);

        var updateAction = await controller.UpdateCommitmentStatus(
            logResult.Data!.Id,
            new UpdateCommitmentStatusDto { Status = "Deployed" },
            CancellationToken.None);

        var updateOk = Assert.IsType<OkObjectResult>(updateAction.Result);
        var updateResult = Assert.IsAssignableFrom<Result<PartnerCommitmentDto>>(updateOk.Value);
        Assert.True(updateResult.Succeeded);
        Assert.Equal("Deployed", updateResult.Data!.Status);
    }

    [Fact]
    public async Task GetPartnerById_ReturnsNotFoundForUnknownId()
    {
        var controller = CreateController();
        var action = await controller.GetPartnerById(Guid.NewGuid(), CancellationToken.None);
        Assert.IsType<NotFoundObjectResult>(action.Result);
    }
}

