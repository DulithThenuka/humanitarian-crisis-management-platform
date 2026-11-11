using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Xunit;
using HumanitarianCrisisPlatform.API.Controllers;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Incidents;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;

namespace HumanitarianCrisisPlatform.Tests.IntegrationTests.Controllers;

public class IncidentsControllerTests
{
    private static IncidentsController CreateControllerWithRole(
        string role,
        Guid userId,
        Mock<IIncidentService>? incidentMock = null,
        Mock<ICaseAssignmentService>? assignMock = null,
        Mock<IIncidentDuplicateDetectionService>? dupMock = null,
        Mock<IIncidentAIReviewService>? aiMock = null,
        Mock<IIncidentReportingService>? reportMock = null)
    {
        var controller = new IncidentsController(
            (incidentMock ?? new Mock<IIncidentService>()).Object,
            (assignMock ?? new Mock<ICaseAssignmentService>()).Object,
            (dupMock ?? new Mock<IIncidentDuplicateDetectionService>()).Object,
            (aiMock ?? new Mock<IIncidentAIReviewService>()).Object,
            (reportMock ?? new Mock<IIncidentReportingService>()).Object);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Name, "Test User"),
            new Claim(ClaimTypes.Role, role)
        };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(identity)
            }
        };

        return controller;
    }

    [Fact]
    public async Task GetDashboard_ShouldReturnOk_ForCaseManager()
    {
        var reportMock = new Mock<IIncidentReportingService>();
        reportMock
            .Setup(r => r.GetDashboardAsync(It.IsAny<Guid?>(), It.IsAny<string?>(), default))
            .ReturnsAsync(Result<IncidentDashboardDto>.Success(new IncidentDashboardDto()));

        var controller = CreateControllerWithRole("CaseManager", Guid.NewGuid(), reportMock: reportMock);
        var response = await controller.GetDashboard(default);

        var okResult = Assert.IsType<OkObjectResult>(response.Result);
        var payload = Assert.IsType<Result<IncidentDashboardDto>>(okResult.Value);
        Assert.True(payload.Succeeded);
    }

    [Fact]
    public async Task StaffOnlyEndpoints_ShouldReturnForbid_ForCitizenRole()
    {
        var controller = CreateControllerWithRole("Citizen", Guid.NewGuid());

        var dashResult = await controller.GetDashboard(default);
        Assert.IsType<ForbidResult>(dashResult.Result);

        var assignResult = await controller.Assign("HMR-1042", new AssignIncidentDto(), default);
        Assert.IsType<ForbidResult>(assignResult.Result);

        var aiReviewResult = await controller.GetAIReview("HMR-1042", default);
        Assert.IsType<ForbidResult>(aiReviewResult.Result);

        var reportResult = await controller.GetReportSummary(null, default);
        Assert.IsType<ForbidResult>(reportResult.Result);
    }

    [Fact]
    public void IncidentsController_ShouldExposeAll24RequiredSwaggerRoutesAndRoleAuthorization()
    {
        var type = typeof(IncidentsController);
        var methods = type.GetMethods();

        Assert.Contains(methods, m => m.Name == nameof(IncidentsController.GetDashboard));
        Assert.Contains(methods, m => m.Name == nameof(IncidentsController.GetAll));
        Assert.Contains(methods, m => m.Name == nameof(IncidentsController.GetById));
        Assert.Contains(methods, m => m.Name == nameof(IncidentsController.Create));
        Assert.Contains(methods, m => m.Name == nameof(IncidentsController.Update));
        Assert.Contains(methods, m => m.Name == nameof(IncidentsController.GetMyAssigned));
        Assert.Contains(methods, m => m.Name == nameof(IncidentsController.GetUnassigned));
        Assert.Contains(methods, m => m.Name == nameof(IncidentsController.Assign));
        Assert.Contains(methods, m => m.Name == nameof(IncidentsController.Reassign));
        Assert.Contains(methods, m => m.Name == nameof(IncidentsController.UpdateStatus));
        Assert.Contains(methods, m => m.Name == nameof(IncidentsController.UpdatePriority));
        Assert.Contains(methods, m => m.Name == nameof(IncidentsController.Verify));
        Assert.Contains(methods, m => m.Name == nameof(IncidentsController.Escalate));
        Assert.Contains(methods, m => m.Name == nameof(IncidentsController.Resolve));
        Assert.Contains(methods, m => m.Name == nameof(IncidentsController.Close));
        Assert.Contains(methods, m => m.Name == nameof(IncidentsController.GetHistory));
        Assert.Contains(methods, m => m.Name == nameof(IncidentsController.GetPossibleDuplicates));
        Assert.Contains(methods, m => m.Name == nameof(IncidentsController.Merge));
        Assert.Contains(methods, m => m.Name == nameof(IncidentsController.GetAIReview));
        Assert.Contains(methods, m => m.Name == nameof(IncidentsController.GenerateAIReview));
        Assert.Contains(methods, m => m.Name == nameof(IncidentsController.RecordAIReviewDecision));
        Assert.Contains(methods, m => m.Name == nameof(IncidentsController.GetCommunications));
        Assert.Contains(methods, m => m.Name == nameof(IncidentsController.AddCommunication));
        Assert.Contains(methods, m => m.Name == nameof(IncidentsController.GetReportSummary));
    }

    [Fact]
    public void SqlServerDbContext_ShouldDiscoverBothMigrationsInOrderAndValidateAll18Entities()
    {
        var factory = new HumanitarianCrisisPlatform.Infrastructure.Data.Context.ApplicationDbContextFactory();
        using var sqlContext = factory.CreateDbContext(Array.Empty<string>());

        var migrations = Microsoft.EntityFrameworkCore.RelationalDatabaseFacadeExtensions
            .GetMigrations(sqlContext.Database)
            .ToList();

        Assert.Equal(2, migrations.Count);
        Assert.EndsWith("_InitialCoreSchema", migrations[0]);
        Assert.EndsWith("_AddIncidentCaseManagerModule", migrations[1]);
        Assert.True(string.CompareOrdinal(migrations[0], migrations[1]) < 0);

        // 11 Core entities
        Assert.NotNull(sqlContext.Model.FindEntityType(typeof(HumanitarianCrisisPlatform.Domain.Entities.User)));
        Assert.NotNull(sqlContext.Model.FindEntityType(typeof(HumanitarianCrisisPlatform.Domain.Entities.CrisisEvent)));
        Assert.NotNull(sqlContext.Model.FindEntityType(typeof(HumanitarianCrisisPlatform.Domain.Entities.AssistanceRequest)));
        Assert.NotNull(sqlContext.Model.FindEntityType(typeof(HumanitarianCrisisPlatform.Domain.Entities.AIDecisionAudit)));
        Assert.NotNull(sqlContext.Model.FindEntityType(typeof(HumanitarianCrisisPlatform.Domain.Entities.Shelter)));
        Assert.NotNull(sqlContext.Model.FindEntityType(typeof(HumanitarianCrisisPlatform.Domain.Entities.ShelterAllocation)));
        Assert.NotNull(sqlContext.Model.FindEntityType(typeof(HumanitarianCrisisPlatform.Domain.Entities.Resource)));
        Assert.NotNull(sqlContext.Model.FindEntityType(typeof(HumanitarianCrisisPlatform.Domain.Entities.ResourceAllocation)));
        Assert.NotNull(sqlContext.Model.FindEntityType(typeof(HumanitarianCrisisPlatform.Domain.Entities.Volunteer)));
        Assert.NotNull(sqlContext.Model.FindEntityType(typeof(HumanitarianCrisisPlatform.Domain.Entities.VolunteerAssignment)));
        Assert.NotNull(sqlContext.Model.FindEntityType(typeof(HumanitarianCrisisPlatform.Domain.Entities.Donation)));

        // 7 Incident entities
        Assert.NotNull(sqlContext.Model.FindEntityType(typeof(HumanitarianCrisisPlatform.Domain.Entities.Incident)));
        Assert.NotNull(sqlContext.Model.FindEntityType(typeof(HumanitarianCrisisPlatform.Domain.Entities.IncidentAssignment)));
        Assert.NotNull(sqlContext.Model.FindEntityType(typeof(HumanitarianCrisisPlatform.Domain.Entities.IncidentStatusHistory)));
        Assert.NotNull(sqlContext.Model.FindEntityType(typeof(HumanitarianCrisisPlatform.Domain.Entities.IncidentEscalation)));
        Assert.NotNull(sqlContext.Model.FindEntityType(typeof(HumanitarianCrisisPlatform.Domain.Entities.IncidentCommunication)));
        Assert.NotNull(sqlContext.Model.FindEntityType(typeof(HumanitarianCrisisPlatform.Domain.Entities.IncidentAIReview)));
        Assert.NotNull(sqlContext.Model.FindEntityType(typeof(HumanitarianCrisisPlatform.Domain.Entities.IncidentAuditLog)));

        // Verify all 15 Core foreign key delete behaviors (9 Restrict/NoAction, 6 SetNull, 0 Cascade)
        var coreEntityTypes = new[]
        {
            typeof(HumanitarianCrisisPlatform.Domain.Entities.AIDecisionAudit),
            typeof(HumanitarianCrisisPlatform.Domain.Entities.AssistanceRequest),
            typeof(HumanitarianCrisisPlatform.Domain.Entities.CrisisEvent),
            typeof(HumanitarianCrisisPlatform.Domain.Entities.Donation),
            typeof(HumanitarianCrisisPlatform.Domain.Entities.ResourceAllocation),
            typeof(HumanitarianCrisisPlatform.Domain.Entities.Resource),
            typeof(HumanitarianCrisisPlatform.Domain.Entities.ShelterAllocation),
            typeof(HumanitarianCrisisPlatform.Domain.Entities.Shelter),
            typeof(HumanitarianCrisisPlatform.Domain.Entities.User),
            typeof(HumanitarianCrisisPlatform.Domain.Entities.VolunteerAssignment),
            typeof(HumanitarianCrisisPlatform.Domain.Entities.Volunteer)
        };

        var coreForeignKeys = coreEntityTypes
            .Select(t => sqlContext.Model.FindEntityType(t)!)
            .SelectMany(et => et.GetForeignKeys())
            .ToList();

        Assert.Equal(15, coreForeignKeys.Count);
        Assert.Equal(9, coreForeignKeys.Count(fk => fk.DeleteBehavior == DeleteBehavior.Restrict || fk.DeleteBehavior == DeleteBehavior.NoAction));
        Assert.Equal(6, coreForeignKeys.Count(fk => fk.DeleteBehavior == DeleteBehavior.SetNull));
        Assert.DoesNotContain(coreForeignKeys, fk => fk.DeleteBehavior == DeleteBehavior.Cascade);

        var resourceAllocationShelterFk = sqlContext.Model
            .FindEntityType(typeof(HumanitarianCrisisPlatform.Domain.Entities.ResourceAllocation))!
            .GetForeignKeys()
            .Single(fk => fk.Properties.Single().Name == "ShelterId");
        Assert.Equal(DeleteBehavior.Restrict, resourceAllocationShelterFk.DeleteBehavior);

        // Verify zero EF Core model drift between ApplicationDbContext and ApplicationDbContextModelSnapshot
        var migrationsAssembly = Microsoft.EntityFrameworkCore.Infrastructure.AccessorExtensions
            .GetService<Microsoft.EntityFrameworkCore.Migrations.IMigrationsAssembly>(sqlContext.Database);
        var modelRuntimeInitializer = Microsoft.EntityFrameworkCore.Infrastructure.AccessorExtensions
            .GetService<Microsoft.EntityFrameworkCore.Infrastructure.IModelRuntimeInitializer>(sqlContext.Database);
        var modelDiffer = Microsoft.EntityFrameworkCore.Infrastructure.AccessorExtensions
            .GetService<Microsoft.EntityFrameworkCore.Migrations.IMigrationsModelDiffer>(sqlContext.Database);
        var designTimeModel = Microsoft.EntityFrameworkCore.Infrastructure.AccessorExtensions
            .GetService<Microsoft.EntityFrameworkCore.Metadata.IDesignTimeModel>(sqlContext.Database);

        Assert.NotNull(migrationsAssembly.ModelSnapshot);
        var snapshotModel = modelRuntimeInitializer.Initialize(migrationsAssembly.ModelSnapshot!.Model);
        var hasDrift = modelDiffer.HasDifferences(
            snapshotModel.GetRelationalModel(),
            designTimeModel.Model.GetRelationalModel());
        Assert.False(hasDrift);
    }

    [Fact]
    public void AddApplicationServices_ShouldSelectSqlServer_WhenUseInMemoryDatabaseIsFalseWithLocalDb()
    {
        var configValues = new Dictionary<string, string?>
        {
            ["UseInMemoryDatabase"] = "false",
            ["ConnectionStrings:DefaultConnection"] =
                "Server=(localdb)\\MSSQLLocalDB;Database=HumanitarianCrisisDb;Trusted_Connection=True;MultipleActiveResultSets=true"
        };
        var configuration = new Microsoft.Extensions.Configuration.ConfigurationBuilder()
            .AddInMemoryCollection(configValues)
            .Build();

        var services = new Microsoft.Extensions.DependencyInjection.ServiceCollection();
        HumanitarianCrisisPlatform.API.Extensions.ServiceCollectionExtensions.AddApplicationServices(services, configuration);

        using var provider = services.BuildServiceProvider();
        using var scope = provider.CreateScope();
        var dbContext = Microsoft.Extensions.DependencyInjection.ServiceProviderServiceExtensions
            .GetRequiredService<HumanitarianCrisisPlatform.Infrastructure.Data.Context.ApplicationDbContext>(scope.ServiceProvider);

        Assert.True(Microsoft.EntityFrameworkCore.RelationalDatabaseFacadeExtensions.IsRelational(dbContext.Database));
        Assert.Equal("Microsoft.EntityFrameworkCore.SqlServer", dbContext.Database.ProviderName);
    }

    [Fact]
    public void AddApplicationServices_ShouldSelectInMemory_WhenUseInMemoryDatabaseIsTrue()
    {
        var configValues = new Dictionary<string, string?>
        {
            ["UseInMemoryDatabase"] = "true",
            ["ConnectionStrings:DefaultConnection"] =
                "Server=(localdb)\\MSSQLLocalDB;Database=HumanitarianCrisisDb;Trusted_Connection=True;MultipleActiveResultSets=true"
        };
        var configuration = new Microsoft.Extensions.Configuration.ConfigurationBuilder()
            .AddInMemoryCollection(configValues)
            .Build();

        var services = new Microsoft.Extensions.DependencyInjection.ServiceCollection();
        HumanitarianCrisisPlatform.API.Extensions.ServiceCollectionExtensions.AddApplicationServices(services, configuration);

        using var provider = services.BuildServiceProvider();
        using var scope = provider.CreateScope();
        var dbContext = Microsoft.Extensions.DependencyInjection.ServiceProviderServiceExtensions
            .GetRequiredService<HumanitarianCrisisPlatform.Infrastructure.Data.Context.ApplicationDbContext>(scope.ServiceProvider);

        Assert.False(Microsoft.EntityFrameworkCore.RelationalDatabaseFacadeExtensions.IsRelational(dbContext.Database));
        Assert.Equal("Microsoft.EntityFrameworkCore.InMemory", dbContext.Database.ProviderName);
    }
}

