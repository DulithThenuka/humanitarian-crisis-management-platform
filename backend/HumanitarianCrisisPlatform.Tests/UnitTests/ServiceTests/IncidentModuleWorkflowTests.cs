using Microsoft.EntityFrameworkCore;
using Xunit;
using HumanitarianCrisisPlatform.Application.DTOs.Incidents;
using HumanitarianCrisisPlatform.Application.Services;
using HumanitarianCrisisPlatform.Domain.Enums;
using HumanitarianCrisisPlatform.Infrastructure.AI;
using HumanitarianCrisisPlatform.Infrastructure.Data.Seed;
using HumanitarianCrisisPlatform.Infrastructure.Repositories;
using HumanitarianCrisisPlatform.Tests.IntegrationTests.Infrastructure;

namespace HumanitarianCrisisPlatform.Tests.UnitTests.ServiceTests;

public class IncidentModuleWorkflowTests
{
    private readonly DatabaseFixture _fixture = new();

    [Fact]
    public async Task FullIncidentLifecycle_CreateAssignStatusVerifyEscalateResolveClose_ShouldSucceedAndAudit()
    {
        using var context = _fixture.CreateContext();
        await DatabaseSeeder.SeedAsync(context);

        var repo = new IncidentRepository(context);
        var uow = new UnitOfWork(context);
        var aiProvider = new RuleBasedIncidentAIProvider();
        var incidentService = new IncidentService(repo, aiProvider, uow);
        var assignmentService = new CaseAssignmentService(repo, uow);
        var aiReviewService = new IncidentAIReviewService(repo, aiProvider, uow);
        var duplicateService = new RuleBasedIncidentDuplicateDetectionService(repo);
        var reportingService = new IncidentReportingService(repo);

        var caseManagerId = Guid.Parse("77777777-7777-7777-7777-777777777777");

        // 1. Create Incident
        var createRes = await incidentService.CreateAsync(new CreateIncidentDto
        {
            Category = "Emergency Shelter",
            OperationalArea = "Kelani East - Zone 03",
            Priority = "Critical",
            CitizenQuote = "Flood water entered our home overnight with two children and an elderly parent.",
            AffectedPeople = 5
        }, caseManagerId, "Ishara Senanayake", "CaseManager");

        Assert.True(createRes.Succeeded);
        var caseNum = createRes.Data!.CaseNumber;
        Assert.StartsWith("HMR-", caseNum);

        // 2. Assign & Reassign
        var assignRes = await assignmentService.AssignAsync(caseNum, new AssignIncidentDto
        {
            AssigneeUserId = caseManagerId,
            AssigneeName = "I. Senanayake",
            Reason = "Assigned to Kelani sector lead"
        }, caseManagerId, "Ishara Senanayake", "CaseManager");
        Assert.True(assignRes.Succeeded);
        Assert.Equal("Assigned", assignRes.Data!.Status);

        var reassignRes = await assignmentService.ReassignAsync(caseNum, new ReassignIncidentDto
        {
            NewAssigneeName = "R. Perera",
            Reason = "Shift handoff"
        }, caseManagerId, "Ishara Senanayake", "CaseManager");
        Assert.True(reassignRes.Succeeded);
        Assert.Equal("R. Perera", reassignRes.Data!.AssignedStaff);

        // 3. Verify & Escalate
        var verifyRes = await incidentService.VerifyAsync(caseNum, new VerifyIncidentDto
        {
            VerificationStatus = "Verified",
            Reason = "Field team confirmed household count"
        }, caseManagerId, "Ishara Senanayake", "CaseManager");
        Assert.True(verifyRes.Succeeded);
        Assert.Equal("Verified", verifyRes.Data!.Verification);

        var escalateRes = await incidentService.EscalateAsync(caseNum, new EscalateIncidentDto
        {
            EscalatedToRole = "Emergency Coordinator",
            TargetPriority = "Critical",
            Reason = "Immediate boat evacuation required"
        }, caseManagerId, "Ishara Senanayake", "CaseManager");
        Assert.True(escalateRes.Succeeded);
        Assert.Equal("Escalated", escalateRes.Data!.Status);

        // 4. AI Review & Human Decision
        var aiRes = await aiReviewService.GetAIReviewAsync(caseNum);
        Assert.True(aiRes.Succeeded);
        Assert.True(aiRes.Data!.IsRuleBasedDemonstration);

        // Safeguard: AI review must reject auto-rejection attempts
        var autoRejectAttempt = await aiReviewService.RecordHumanDecisionAsync(caseNum, new RecordAIReviewDecisionDto
        {
            Decision = "Auto-Reject",
            Reason = "Automated rejection test"
        }, caseManagerId, "Ishara Senanayake", "CaseManager");
        Assert.False(autoRejectAttempt.Succeeded);

        var humanDecRes = await aiReviewService.RecordHumanDecisionAsync(caseNum, new RecordAIReviewDecisionDto
        {
            Decision = "Approve recommendation",
            Reason = "Confirmed critical shelter need after human review"
        }, caseManagerId, "Ishara Senanayake", "CaseManager");
        Assert.True(humanDecRes.Succeeded);
        Assert.True(humanDecRes.Data!.IsReviewedByHuman);

        // 5. Communications
        var commRes = await incidentService.AddCommunicationAsync(caseNum, new CreateIncidentCommunicationDto
        {
            Recipient = "Resource & Logistics Manager",
            Message = "Dispatching emergency shelter kit for 5 people.",
            IsInternal = true,
            IsVisibleToCitizen = false
        }, caseManagerId, "Ishara Senanayake", "CaseManager");
        Assert.True(commRes.Succeeded);

        // 6. Duplicate detection
        var dupRes = await duplicateService.FindPossibleDuplicatesAsync(caseNum);
        Assert.True(dupRes.Succeeded);
        Assert.NotEmpty(dupRes.Data!);

        // 7. Resolve & Close
        var resolveRes = await incidentService.ResolveAsync(caseNum, new ResolveIncidentDto
        {
            ResolutionNotes = "Household safely relocated to Kelani sector shelter.",
            Reason = "Relocation completed"
        }, caseManagerId, "Ishara Senanayake", "CaseManager");
        Assert.True(resolveRes.Succeeded);
        Assert.Equal("Resolved", resolveRes.Data!.Status);

        var closeRes = await incidentService.CloseAsync(caseNum, new CloseIncidentDto
        {
            Reason = "Final verification complete"
        }, caseManagerId, "Ishara Senanayake", "CaseManager");
        Assert.True(closeRes.Succeeded);
        Assert.Equal("Closed", closeRes.Data!.Status);

        // 8. History & Dashboard & Reports
        var historyRes = await incidentService.GetHistoryAsync(caseNum, caseManagerId, "CaseManager");
        Assert.True(historyRes.Succeeded);
        Assert.NotEmpty(historyRes.Data!.StatusHistory);
        Assert.NotEmpty(historyRes.Data.AuditLogs);

        var dashRes = await reportingService.GetDashboardAsync(caseManagerId, "Ishara Senanayake");
        Assert.True(dashRes.Succeeded);

        var reportRes = await reportingService.GetReportSummaryAsync();
        Assert.True(reportRes.Succeeded);
        Assert.True(reportRes.Data!.TotalIncidents >= 5);
    }

    [Fact]
    public async Task CitizenPrivacyBoundary_ShouldRestrictAccessToOwnIncidentsAndRedactInternalNotesAndAuditLogs()
    {
        using var context = _fixture.CreateContext();
        await DatabaseSeeder.SeedAsync(context);

        var repo = new IncidentRepository(context);
        var uow = new UnitOfWork(context);
        var aiProvider = new RuleBasedIncidentAIProvider();
        var incidentService = new IncidentService(repo, aiProvider, uow);

        var citizen1Id = Guid.Parse("66666666-6666-6666-6666-666666666666");
        var otherCitizenId = Guid.NewGuid();

        // HMR-1042 belongs to citizen1Id; otherCitizenId must be forbidden
        var forbiddenGet = await incidentService.GetByIdAsync("HMR-1042", otherCitizenId, "Citizen");
        Assert.False(forbiddenGet.Succeeded);
        Assert.Contains(forbiddenGet.Errors, e => e.StartsWith("FORBIDDEN"));

        // Citizen1 accessing their own HMR-1042 should succeed, with internal notes redacted
        var ownGet = await incidentService.GetByIdAsync("HMR-1042", citizen1Id, "Citizen");
        Assert.True(ownGet.Succeeded);
        Assert.Null(ownGet.Data!.InternalNotes);
        Assert.Empty(ownGet.Data.Notes);

        // Citizen1 accessing communications on HMR-1042 must only see non-internal citizen-visible items
        var comms = await incidentService.GetCommunicationsAsync("HMR-1042", citizen1Id, "Citizen");
        Assert.True(comms.Succeeded);
        Assert.All(comms.Data!, c =>
        {
            Assert.False(c.IsInternal);
            Assert.True(c.IsVisibleToCitizen);
        });

        // Citizen1 accessing history on HMR-1042 must not see internal AuditLogs or Assignments
        var history = await incidentService.GetHistoryAsync("HMR-1042", citizen1Id, "Citizen");
        Assert.True(history.Succeeded);
        Assert.Empty(history.Data!.AuditLogs);
        Assert.Empty(history.Data.Assignments);
    }

    [Fact]
    public async Task DatabaseSeeder_ShouldBeIdempotent_AndNeverOverwriteExistingRecords()
    {
        using var context = _fixture.CreateContext();
        await DatabaseSeeder.SeedAsync(context);

        var initialUserCount = await context.Users.CountAsync();
        var initialCrisisCount = await context.CrisisEvents.CountAsync();
        var initialShelterCount = await context.Shelters.CountAsync();
        var initialResourceCount = await context.Resources.CountAsync();
        var initialVolunteerCount = await context.Volunteers.CountAsync();
        var initialIncidentCount = await context.Incidents.CountAsync();

        // Modify an existing record to verify SeedAsync never overwrites it
        var hmr1042 = await context.Incidents.FirstAsync(i => i.CaseNumber == "HMR-1042");
        hmr1042.VerificationStatus = "Verified by Field Team";
        await context.SaveChangesAsync();

        // Run SeedAsync a second time
        await DatabaseSeeder.SeedAsync(context);

        Assert.Equal(initialUserCount, await context.Users.CountAsync());
        Assert.Equal(initialCrisisCount, await context.CrisisEvents.CountAsync());
        Assert.Equal(initialShelterCount, await context.Shelters.CountAsync());
        Assert.Equal(initialResourceCount, await context.Resources.CountAsync());
        Assert.Equal(initialVolunteerCount, await context.Volunteers.CountAsync());
        Assert.Equal(initialIncidentCount, await context.Incidents.CountAsync());

        var hmr1042After = await context.Incidents.FirstAsync(i => i.CaseNumber == "HMR-1042");
        Assert.Equal("Verified by Field Team", hmr1042After.VerificationStatus);
    }

    [Fact]
    public async Task DatabaseSeeder_WhenExistingSqlSeedUsersPresent_ShouldLinkIncidentsToExistingCitizenAndPreserveUsers()
    {
        using var context = _fixture.CreateContext();
        await context.Database.EnsureCreatedAsync();

        // Simulate the 5 existing users from Database/SeedData.sql in HumanitarianCrisisDb
        var existingAdminId = Guid.Parse("A1B2C3D4-E5F6-7890-ABCD-EF1234567890");
        var existingCoordId = Guid.Parse("B2C3D4E5-F6A7-8901-BCDE-F12345678901");
        var existingLogisticsId = Guid.Parse("C3D4E5F6-A7B8-9012-CDEF-123456789012");
        var existingCitizenId = Guid.Parse("D4E5F6A7-B8C9-0123-DEFA-234567890123");
        var existingVolunteerUserId = Guid.Parse("E5F6A7B8-C9D0-1234-EFAB-345678901234");

        context.Users.AddRange(
            new HumanitarianCrisisPlatform.Domain.Entities.User
            {
                Id = existingAdminId,
                FullName = "System Administrator",
                Email = "admin@crisisplatform.org",
                PasswordHash = "6G94qKPK8LYNjnTllCqm2G3BUM08AzOK7yW30tfjrMc=",
                Role = UserRole.Admin,
                IsActive = true
            },
            new HumanitarianCrisisPlatform.Domain.Entities.User
            {
                Id = existingCoordId,
                FullName = "Jane Coordinator",
                Email = "coordinator@crisisplatform.org",
                PasswordHash = "J5tRu+5hvK6G94qKPK8LYNjnTllCqm2G3BUM08AzOK7=",
                Role = UserRole.Coordinator,
                IsActive = true
            },
            new HumanitarianCrisisPlatform.Domain.Entities.User
            {
                Id = existingLogisticsId,
                FullName = "Mark Logistics",
                Email = "logistics@crisisplatform.org",
                PasswordHash = "oJLzU5WO/c6G94qKPK8LYNjnTllCqm2G3BUM08AzOK7=",
                Role = UserRole.LogisticsManager,
                IsActive = true
            },
            new HumanitarianCrisisPlatform.Domain.Entities.User
            {
                Id = existingCitizenId,
                FullName = "Alice Citizen",
                Email = "citizen@crisisplatform.org",
                PasswordHash = "LeflKnogle6G94qKPK8LYNjnTllCqm2G3BUM08AzOK7=",
                Role = UserRole.Citizen,
                IsActive = true
            },
            new HumanitarianCrisisPlatform.Domain.Entities.User
            {
                Id = existingVolunteerUserId,
                FullName = "Bob Volunteer",
                Email = "volunteer@crisisplatform.org",
                PasswordHash = "PnidLzmLUO6G94qKPK8LYNjnTllCqm2G3BUM08AzOK7=",
                Role = UserRole.Volunteer,
                IsActive = true
            });
        await context.SaveChangesAsync();

        // Run DatabaseSeeder on top of the pre-existing 5 users
        await DatabaseSeeder.SeedAsync(context);

        // 5 original users preserved + 1 CaseManager added = 6 users
        Assert.Equal(6, await context.Users.CountAsync());
        var citizenAfter = await context.Users.SingleAsync(u => u.Id == existingCitizenId);
        Assert.Equal("citizen@crisisplatform.org", citizenAfter.Email);
        Assert.Equal("LeflKnogle6G94qKPK8LYNjnTllCqm2G3BUM08AzOK7=", citizenAfter.PasswordHash);

        var caseManager = await context.Users.SingleAsync(u => u.Role == UserRole.CaseManager);

        // HMR-1042 and HMR-1035 must reference existingCitizenId (D4E5F6A7-...) and caseManager.Id
        var hmr1042 = await context.Incidents.SingleAsync(i => i.CaseNumber == "HMR-1042");
        var hmr1035 = await context.Incidents.SingleAsync(i => i.CaseNumber == "HMR-1035");
        Assert.Equal(existingCitizenId, hmr1042.CitizenId);
        Assert.Equal(existingCitizenId, hmr1035.CitizenId);
        Assert.Equal(caseManager.Id, hmr1042.AssignedToUserId);
        Assert.Equal(caseManager.Id, hmr1035.AssignedToUserId);

        // Volunteer must reference existingVolunteerUserId (E5F6A7B8-...)
        var volunteer = await context.Volunteers.SingleAsync();
        Assert.Equal(existingVolunteerUserId, volunteer.UserId);
    }
}

