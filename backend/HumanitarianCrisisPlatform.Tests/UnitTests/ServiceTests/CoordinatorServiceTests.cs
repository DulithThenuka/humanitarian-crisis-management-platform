using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using HumanitarianCrisisPlatform.Application.DTOs.AI;
using HumanitarianCrisisPlatform.Application.DTOs.Coordinator;
using HumanitarianCrisisPlatform.Application.Interfaces.Infrastructure;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Enums;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;
using HumanitarianCrisisPlatform.Infrastructure.Services;

namespace HumanitarianCrisisPlatform.Tests.UnitTests.ServiceTests;

public class CoordinatorServiceTests
{
    private static readonly Guid TestUserId = Guid.NewGuid();

    private ApplicationDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        var db = new ApplicationDbContext(options);
        db.Users.Add(new User
        {
            Id = TestUserId,
            Email = "citizen@relief.org",
            FullName = "Displaced Citizen",
            Role = UserRole.Citizen,
            PasswordHash = "hashed_pass"
        });
        db.SaveChanges();
        return db;
    }

    private CoordinatorService CreateService(ApplicationDbContext db)
    {
        var aiMock = new Mock<IAIServiceClient>();
        var loggerMock = new Mock<ILogger<CoordinatorService>>();
        return new CoordinatorService(db, aiMock.Object, loggerMock.Object);
    }

    [Fact]
    public async Task GetOverviewAsync_ReturnsAggregatedMetricsAndCases()
    {
        // Arrange
        using var db = CreateInMemoryDbContext();
        var requestId = Guid.NewGuid();
        db.AssistanceRequests.Add(new AssistanceRequest
        {
            Id = requestId,
            RequestorId = TestUserId,
            Category = "Medical Supplies",
            Description = "Emergency dialysis kit needed",
            Urgency = PriorityLevel.Critical,
            Status = RequestStatus.Submitted,
            Address = "Colombo Central Hospital",
            CreatedAt = DateTime.UtcNow
        });

        db.Shelters.Add(new Shelter
        {
            Id = Guid.NewGuid(),
            Name = "Colombo Relief Shelter 1",
            Address = "Colombo 03",
            TotalCapacity = 200,
            CurrentOccupancy = 120,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        });

        await db.SaveChangesAsync();

        var service = CreateService(db);

        // Act
        var result = await service.GetOverviewAsync();

        // Assert
        Assert.True(result.Succeeded, string.Join(", ", result.Errors));
        Assert.NotNull(result.Data);
        Assert.True(result.Data.Metrics.IncomingRequests >= 1);
        Assert.NotEmpty(result.Data.PriorityCases);
    }

    [Fact]
    public async Task VerifyCaseAsync_UpdatesRequestStatusAndUrgency()
    {
        // Arrange
        using var db = CreateInMemoryDbContext();
        var requestId = Guid.NewGuid();
        db.AssistanceRequests.Add(new AssistanceRequest
        {
            Id = requestId,
            RequestorId = TestUserId,
            Category = "Food Supply",
            Description = "Ration packs for displaced families",
            Urgency = PriorityLevel.Medium,
            Status = RequestStatus.Submitted,
            CreatedAt = DateTime.UtcNow
        });
        await db.SaveChangesAsync();

        var service = CreateService(db);
        var coordinatorId = Guid.NewGuid();

        // Act
        var result = await service.VerifyCaseAsync(
            requestId.ToString(),
            new VerifyCaseDto
            {
                Reason = "On-site volunteer team confirmed family count of 45 people.",
                ConfirmedCheck = true,
                Notes = "Verified on site."
            },
            coordinatorId,
            "Officer Jane Doe");

        // Assert
        Assert.True(result.Succeeded, string.Join(", ", result.Errors));
        Assert.Equal("Verified", result.Data!.Status);

        var updated = await db.AssistanceRequests.FindAsync(requestId);
        Assert.NotNull(updated);
        Assert.Equal(RequestStatus.Verified, updated!.Status);
        Assert.Contains(result.Data.Notes, n => n.Author.Contains("Officer Jane Doe"));
    }

    [Fact]
    public async Task AddCaseNoteAsync_AppendsCoordinatorNoteToRequest()
    {
        // Arrange
        using var db = CreateInMemoryDbContext();
        var req = new AssistanceRequest
        {
            Id = Guid.NewGuid(),
            RequestorId = TestUserId,
            Category = "Clean Water",
            Description = "Purification tablets needed",
            Urgency = PriorityLevel.High,
            Status = RequestStatus.InProgress
        };
        db.AssistanceRequests.Add(req);
        await db.SaveChangesAsync();

        var service = CreateService(db);
        var coordinatorId = Guid.NewGuid();

        // Act
        var result = await service.AddCaseNoteAsync(
            req.Id.ToString(),
            new AddCaseNoteDto
            {
                Text = "Dispatched 500 water purification tablets via Navy boat."
            },
            coordinatorId,
            "Chief Coordinator");

        // Assert
        Assert.True(result.Succeeded, string.Join(", ", result.Errors));
        Assert.Contains(result.Data!.Notes, n => n.Text.Contains("Dispatched 500 water purification tablets"));
        Assert.Contains(result.Data.Notes, n => n.Author.Contains("Chief Coordinator"));
    }

    [Fact]
    public async Task ReviewAIDecisionAsync_WithOverride_UpdatesPriorityAndLogsAudit()
    {
        // Arrange
        using var db = CreateInMemoryDbContext();
        var req = new AssistanceRequest
        {
            Id = Guid.NewGuid(),
            RequestorId = TestUserId,
            Category = "Shelter",
            Description = "Temporary roofing sheets",
            Urgency = PriorityLevel.Low,
            Status = RequestStatus.Submitted
        };
        db.AssistanceRequests.Add(req);
        await db.SaveChangesAsync();

        var service = CreateService(db);
        var coordinatorId = Guid.NewGuid();

        // Act - override AI low priority to High
        var result = await service.ReviewAIDecisionAsync(
            req.Id.ToString(),
            new HumanOverrideDto
            {
                Action = "Override",
                OverriddenPriority = PriorityLevel.High,
                Reason = "Heavy rain forecast; roofless shelter poses immediate hypothermia risk."
            },
            coordinatorId,
            "Officer Silva");

        // Assert
        Assert.True(result.Succeeded, string.Join(", ", result.Errors));
        Assert.Equal("High", result.Data!.Severity);

        var updatedReq = await db.AssistanceRequests.FindAsync(req.Id);
        Assert.Equal(PriorityLevel.High, updatedReq!.Urgency);

        var audits = await db.AIDecisionAudits.Where(a => a.AssistanceRequestId == req.Id).ToListAsync();
        Assert.NotEmpty(audits);
        Assert.True(audits[0].WasOverridden);
        Assert.Equal("Heavy rain forecast; roofless shelter poses immediate hypothermia risk.", audits[0].OverrideReason);
    }

    [Fact]
    public async Task CreateAlertAsync_BroadcastsNewAlert()
    {
        // Arrange
        using var db = CreateInMemoryDbContext();
        var service = CreateService(db);
        var coordinatorId = Guid.NewGuid();

        var alertDto = new CreateCoordinatorAlertDto
        {
            Title = "Flash Flood Warning - Kelani River",
            Severity = "Critical",
            Area = "Colombo Zone 03",
            Instructions = "Evacuate low lying areas immediately."
        };

        // Act
        var result = await service.CreateAlertAsync(alertDto, coordinatorId);

        // Assert
        Assert.True(result.Succeeded, string.Join(", ", result.Errors));
        Assert.NotNull(result.Data);
        Assert.Equal("Flash Flood Warning - Kelani River", result.Data.Title);
        Assert.Equal("Critical", result.Data.Severity);

        var allAlerts = await service.GetAlertsAsync();
        Assert.True(allAlerts.Succeeded);
        Assert.Contains(allAlerts.Data!, a => a.Title == "Flash Flood Warning - Kelani River");
    }

    [Fact]
    public async Task CreateIncidentAsync_CreatesCrisisEventAndReturnsIncidentDto()
    {
        // Arrange
        using var db = CreateInMemoryDbContext();
        var service = CreateService(db);
        var coordinatorId = Guid.NewGuid();

        var incidentDto = new CreateCoordinatorIncidentDto
        {
            Title = "Monsoon Inundation Zone B",
            Severity = "Critical",
            Area = "Gampaha, Ja-Ela basin",
            LeadTeam = "National Relief Unit"
        };

        // Act
        var result = await service.CreateIncidentAsync(incidentDto, coordinatorId);

        // Assert
        Assert.True(result.Succeeded, string.Join(", ", result.Errors));
        Assert.NotNull(result.Data);
        Assert.Equal("Monsoon Inundation Zone B", result.Data.Title);

        var crisisInDb = await db.CrisisEvents.FirstOrDefaultAsync(c => c.Title == "Monsoon Inundation Zone B");
        Assert.NotNull(crisisInDb);
        Assert.True(crisisInDb!.IsActive);
    }
}
