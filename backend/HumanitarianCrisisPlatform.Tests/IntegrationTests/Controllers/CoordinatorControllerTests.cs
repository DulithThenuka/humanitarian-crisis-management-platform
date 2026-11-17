using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Xunit;
using HumanitarianCrisisPlatform.API.Controllers;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Coordinator;
using HumanitarianCrisisPlatform.Application.DTOs.Requests;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Enums;
using HumanitarianCrisisPlatform.Tests.IntegrationTests.Infrastructure;

namespace HumanitarianCrisisPlatform.Tests.IntegrationTests.Controllers;

public class CoordinatorControllerTests : IClassFixture<DatabaseFixture>
{
    private readonly DatabaseFixture _fixture;

    public CoordinatorControllerTests(DatabaseFixture fixture)
    {
        _fixture = fixture;
    }

    private (CoordinatorController controller, CrisisEventsController crisisController, AlertsController alertsController, HumanitarianCrisisPlatform.Infrastructure.Data.Context.ApplicationDbContext context) CreateControllers()
    {
        var context = _fixture.CreateContext();
        var services = new ServiceCollection();
        services.AddLogging();
        HumanitarianCrisisPlatform.API.Extensions.ServiceCollectionExtensions.AddApplicationServices(services, _fixture.Configuration);
        services.AddScoped(_ => context);

        var provider = services.BuildServiceProvider();
        var coordinatorService = provider.GetRequiredService<ICoordinatorService>();

        var coordinatorController = new CoordinatorController(coordinatorService);
        var crisisController = new CrisisEventsController(coordinatorService);
        var alertsController = new AlertsController(coordinatorService);

        var user = new System.Security.Claims.ClaimsPrincipal(new System.Security.Claims.ClaimsIdentity(new[]
        {
            new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.NameIdentifier, Guid.NewGuid().ToString()),
            new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Name, "Sarah Johnson"),
            new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, "Coordinator")
        }, "TestAuth"));

        var httpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext { User = user };
        coordinatorController.ControllerContext = new ControllerContext { HttpContext = httpContext };
        crisisController.ControllerContext = new ControllerContext { HttpContext = httpContext };
        alertsController.ControllerContext = new ControllerContext { HttpContext = httpContext };

        return (coordinatorController, crisisController, alertsController, context);
    }

    [Fact]
    public async Task GetOverview_ShouldReturnRealMetricsAndPriorities()
    {
        var (controller, _, _, context) = CreateControllers();

        // Seed a sample assistance request
        var req = new AssistanceRequest
        {
            Id = Guid.NewGuid(),
            Category = "Rescue",
            Description = "Flooded house with trapped residents",
            Urgency = PriorityLevel.Critical,
            Status = RequestStatus.Submitted,
            Address = "Kelani East Zone 03",
            NumberOfPeople = 4
        };
        await context.AssistanceRequests.AddAsync(req);
        await context.SaveChangesAsync();

        var result = await controller.GetOverview(default);
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var res = Assert.IsAssignableFrom<Result<CoordinatorOverviewDto>>(okResult.Value);

        Assert.True(res.Succeeded);
        Assert.NotNull(res.Data);
        Assert.True(res.Data.Metrics.TotalIncomingRequests >= 1);
        Assert.True(res.Data.Metrics.PendingReviews >= 1);
        Assert.True(res.Data.Metrics.CriticalRequests >= 1);
        Assert.NotEmpty(res.Data.PriorityCases);
    }

    [Fact]
    public async Task VerifyRequest_WithValidReason_ShouldSetStatusToVerified()
    {
        var (controller, _, _, context) = CreateControllers();

        var req = new AssistanceRequest
        {
            Id = Guid.NewGuid(),
            Category = "Medical",
            Description = "Needs insulin injection",
            Urgency = PriorityLevel.High,
            Status = RequestStatus.Submitted
        };
        await context.AssistanceRequests.AddAsync(req);
        await context.SaveChangesAsync();

        var dto = new VerifyAssistanceRequestDto
        {
            Reason = "Verified by coordinator via Grama Niladhari check",
            ChecklistConfirmed = true
        };

        var result = await controller.VerifyRequest(req.Id, dto, default);
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var res = Assert.IsAssignableFrom<Result<AssistanceRequestResponseDto>>(okResult.Value);

        Assert.True(res.Succeeded);
        Assert.Equal(RequestStatus.Verified, res.Data?.Status);

        // Verify database persistence
        var updatedReq = await context.AssistanceRequests.FindAsync(req.Id);
        Assert.NotNull(updatedReq);
        Assert.Equal(RequestStatus.Verified, updatedReq.Status);
    }

    [Fact]
    public async Task VerifyRequest_WithEmptyReason_ShouldReturnBadRequest()
    {
        var (controller, _, _, context) = CreateControllers();

        var req = new AssistanceRequest
        {
            Id = Guid.NewGuid(),
            Category = "Food",
            Description = "Supplies needed",
            Status = RequestStatus.Submitted
        };
        await context.AssistanceRequests.AddAsync(req);
        await context.SaveChangesAsync();

        var dto = new VerifyAssistanceRequestDto
        {
            Reason = "   " // Empty
        };

        var result = await controller.VerifyRequest(req.Id, dto, default);
        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task EscalateRequest_ShouldUpdateUrgencyToCritical()
    {
        var (controller, _, _, context) = CreateControllers();

        var req = new AssistanceRequest
        {
            Id = Guid.NewGuid(),
            Category = "Rescue",
            Description = "Water level rising",
            Urgency = PriorityLevel.Medium,
            Status = RequestStatus.Submitted
        };
        await context.AssistanceRequests.AddAsync(req);
        await context.SaveChangesAsync();

        var dto = new EscalateAssistanceRequestDto
        {
            Reason = "Flash flood surge reported upstream",
            Urgency = PriorityLevel.Critical
        };

        var result = await controller.EscalateRequest(req.Id, dto, default);
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var res = Assert.IsAssignableFrom<Result<AssistanceRequestResponseDto>>(okResult.Value);

        Assert.True(res.Succeeded);
        Assert.Equal(PriorityLevel.Critical, res.Data?.Urgency);
    }

    [Fact]
    public async Task CrisisEvents_CreateAndGetAll_ShouldPersistAndRetrieve()
    {
        var (_, crisisController, _, context) = CreateControllers();

        var newCrisis = new CreateCrisisEventDto
        {
            Title = "2026 Western Province Flood Wave",
            Description = "Heavy monsoon rains in Kelani catchment area",
            DisasterType = DisasterType.Flood,
            Severity = 4,
            Latitude = 6.95m,
            Longitude = 79.92m,
            AffectedAreaRadius = 15m
        };

        var createResult = await crisisController.Create(newCrisis, default);
        var createdResult = Assert.IsType<CreatedAtActionResult>(createResult.Result);
        var res = Assert.IsAssignableFrom<Result<CrisisEventResponseDto>>(createdResult.Value);

        Assert.True(res.Succeeded);
        Assert.NotNull(res.Data);
        Assert.Equal("2026 Western Province Flood Wave", res.Data.Title);

        var listResult = await crisisController.GetAll(activeOnly: true, default);
        var listOk = Assert.IsType<OkObjectResult>(listResult.Result);
        var listRes = Assert.IsAssignableFrom<Result<IReadOnlyList<CrisisEventResponseDto>>>(listOk.Value);

        Assert.True(listRes.Succeeded);
        Assert.Contains(listRes.Data!, c => c.Title == "2026 Western Province Flood Wave");
    }

    [Fact]
    public async Task Alerts_CreateAndGetAll_ShouldPersistAndReturnBroadcastAlerts()
    {
        var (_, _, alertsController, context) = CreateControllers();

        var alertDto = new CreateAlertDto
        {
            Title = "Flood Warning - Wellampitiya Lowland Sector",
            Category = "Flood warning",
            Severity = "Critical",
            Message = "Water levels rising above danger threshold. Evacuate immediately.",
            Area = "Wellampitiya - Zone 02",
            SafetyInstructions = "Move to designated high school shelter.\nDo not drive through flood waters."
        };

        var createResult = await alertsController.Create(alertDto, default);
        var okResult = Assert.IsType<OkObjectResult>(createResult.Result);
        var res = Assert.IsAssignableFrom<Result<EmergencyAlertDto>>(okResult.Value);

        Assert.True(res.Succeeded);
        Assert.NotNull(res.Data);
        Assert.Equal("Flood Warning - Wellampitiya Lowland Sector", res.Data.Title);
        Assert.Equal("Critical", res.Data.Severity);

        var getResult = await alertsController.GetAll(tab: "active", default);
        var getOk = Assert.IsType<OkObjectResult>(getResult.Result);
        var getRes = Assert.IsAssignableFrom<Result<IReadOnlyList<EmergencyAlertDto>>>(getOk.Value);

        Assert.True(getRes.Succeeded);
        Assert.Contains(getRes.Data!, a => a.Title == "Flood Warning - Wellampitiya Lowland Sector");
    }

    [Fact]
    public async Task Alerts_StatusManagement_AllFourTabsAndTransitions()
    {
        var (_, _, alertsController, context) = CreateControllers();

        // 1. Create Draft alert
        var draftDto = new CreateAlertDto
        {
            Title = "Upcoming Heavy Rainfall Advisory",
            Category = "Storm warning",
            Severity = "Moderate",
            Message = "Monsoon depression expected to bring heavy rain in 48 hours.",
            Area = "Galle District",
            IsDraft = true,
            PublicationStatus = "Draft"
        };
        var createDraft = await alertsController.Create(draftDto, default);
        var draftRes = Assert.IsAssignableFrom<Result<EmergencyAlertDto>>(Assert.IsType<OkObjectResult>(createDraft.Result).Value);
        Assert.True(draftRes.Succeeded);
        Assert.Equal("drafts", draftRes.Data!.Tab);
        Assert.Equal("Draft", draftRes.Data.Publication);

        // 2. Create Scheduled alert
        var schedDto = new CreateAlertDto
        {
            Title = "Scheduled Reservoir Water Release Notice",
            Category = "Flood warning",
            Severity = "High",
            Message = "Reservoir spill gates will open at midnight tonight.",
            Area = "Kelani Basin",
            ScheduledDate = DateTime.UtcNow.AddHours(6).ToString("o"),
            PublicationStatus = "Scheduled"
        };
        var createSched = await alertsController.Create(schedDto, default);
        var schedRes = Assert.IsAssignableFrom<Result<EmergencyAlertDto>>(Assert.IsType<OkObjectResult>(createSched.Result).Value);
        Assert.True(schedRes.Succeeded);
        Assert.Equal("scheduled", schedRes.Data!.Tab);
        Assert.Equal("Scheduled", schedRes.Data.Publication);

        // 3. Verify tabs filter correctly
        var draftsTab = await alertsController.GetAll(tab: "drafts", default);
        var draftsData = Assert.IsAssignableFrom<Result<IReadOnlyList<EmergencyAlertDto>>>(Assert.IsType<OkObjectResult>(draftsTab.Result).Value).Data!;
        Assert.Contains(draftsData, a => a.Id == draftRes.Data.Id);

        var schedTab = await alertsController.GetAll(tab: "scheduled", default);
        var schedData = Assert.IsAssignableFrom<Result<IReadOnlyList<EmergencyAlertDto>>>(Assert.IsType<OkObjectResult>(schedTab.Result).Value).Data!;
        Assert.Contains(schedData, a => a.Id == schedRes.Data.Id);

        // 4. Update Alert
        var updateDto = new UpdateAlertDto
        {
            Title = "Updated Reservoir Water Release Notice (URGENT)",
            Category = "Flood warning",
            Severity = "Critical",
            Message = "Spill gates opening sooner than anticipated due to heavy catchment inflow.",
            Area = "Kelani Basin & Lowlands",
            ScheduledDate = schedRes.Data.ScheduledDate,
            PublicationStatus = "Scheduled"
        };
        var updateRes = await alertsController.Update(schedRes.Data.Id, updateDto, default);
        var updatedData = Assert.IsAssignableFrom<Result<EmergencyAlertDto>>(Assert.IsType<OkObjectResult>(updateRes.Result).Value).Data!;
        Assert.Equal("Updated Reservoir Water Release Notice (URGENT)", updatedData.Title);
        Assert.Equal("Critical", updatedData.Severity);

        // 5. Publish the draft alert
        var publishRes = await alertsController.Publish(draftRes.Data.Id, default);
        var publishedData = Assert.IsAssignableFrom<Result<EmergencyAlertDto>>(Assert.IsType<OkObjectResult>(publishRes.Result).Value).Data!;
        Assert.Equal("active", publishedData.Tab);
        Assert.Equal("Published", publishedData.Publication);

        // 6. Resolve the published alert
        var resolveDto = new ResolveAlertDto
        {
            ResolutionNotes = "Monsoon depression has dissipated without localized flooding."
        };
        var resolveRes = await alertsController.Resolve(draftRes.Data.Id, resolveDto, default);
        var resolvedData = Assert.IsAssignableFrom<Result<EmergencyAlertDto>>(Assert.IsType<OkObjectResult>(resolveRes.Result).Value).Data!;
        Assert.Equal("resolved", resolvedData.Tab);
        Assert.Equal("Resolved", resolvedData.Publication);
        Assert.Contains("dissipated", resolvedData.ResolutionNotes);
    }

    [Fact]
    public async Task VerifyRequest_WithIncidentCaseNumber_ShouldVerifyAndPersistInDb()
    {
        var (controller, _, _, context) = CreateControllers();

        var incident = new Incident
        {
            Id = Guid.NewGuid(),
            CaseNumber = "HMR-TEST-VERIFY",
            Title = "Emergency Shelter Test Case",
            Priority = PriorityLevel.Critical,
            Status = IncidentStatus.Open,
            VerificationStatus = "Awaiting review",
            OperationalArea = "Kelani East - Zone 03",
            Description = "Test case for coordinator verification"
        };
        await context.Incidents.AddAsync(incident);
        await context.SaveChangesAsync();

        var dto = new VerifyAssistanceRequestDto
        {
            Reason = "Confirmed with regional GN officer",
            ChecklistConfirmed = true
        };

        var result = await controller.VerifyRequest("HMR-TEST-VERIFY", dto, default);
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var res = Assert.IsAssignableFrom<Result<AssistanceRequestResponseDto>>(okResult.Value);

        Assert.True(res.Succeeded);
        Assert.Equal(RequestStatus.Verified, res.Data?.Status);

        // Verify database persistence
        var updatedIncident = await context.Incidents.FindAsync(incident.Id);
        Assert.NotNull(updatedIncident);
        Assert.Equal("Verified", updatedIncident.VerificationStatus);
        Assert.Equal(IncidentStatus.Verified, updatedIncident.Status);
    }

    [Fact]
    public async Task EscalateAndAddNote_WithIncidentCaseNumber_ShouldPersistInDb()
    {
        var (controller, _, _, context) = CreateControllers();

        var incident = new Incident
        {
            Id = Guid.NewGuid(),
            CaseNumber = "HMR-TEST-ESC",
            Title = "Escalation Test Case",
            Priority = PriorityLevel.Medium,
            Status = IncidentStatus.Open,
            VerificationStatus = "Awaiting review",
            Description = "Test case for coordinator escalation and note"
        };
        await context.Incidents.AddAsync(incident);
        await context.SaveChangesAsync();

        // 1. Escalate
        var escDto = new EscalateAssistanceRequestDto
        {
            Urgency = PriorityLevel.Critical,
            Reason = "Severe flooding reached 1.5m"
        };
        var escResult = await controller.EscalateRequest("HMR-TEST-ESC", escDto, default);
        var escOk = Assert.IsType<OkObjectResult>(escResult.Result);
        var escRes = Assert.IsAssignableFrom<Result<AssistanceRequestResponseDto>>(escOk.Value);
        Assert.True(escRes.Succeeded);

        // 2. Add Note
        var noteDto = new AddRequestNoteDto
        {
            Text = "Contacted rescue boat team #4"
        };
        var noteResult = await controller.AddRequestNote("HMR-TEST-ESC", noteDto, default);
        var noteOk = Assert.IsType<OkObjectResult>(noteResult.Result);
        var noteRes = Assert.IsAssignableFrom<Result<bool>>(noteOk.Value);
        Assert.True(noteRes.Succeeded);

        // 3. Verify persistence
        var updated = await context.Incidents.FindAsync(incident.Id);
        Assert.NotNull(updated);
        Assert.Equal(PriorityLevel.Critical, updated.Priority);
        Assert.Contains("Contacted rescue boat team #4", updated.InternalNotes);
    }

    [Fact]
    public async Task GetResourceCoordination_ShouldReturnRealRequirementsShortagesAndAllocations()
    {
        var (controller, _, _, context) = CreateControllers();

        // Seed a resource
        var resource = new Resource
        {
            Id = Guid.NewGuid(),
            Name = "Clean Water Tanker (5000L)",
            Category = "Water",
            TotalQuantity = 100,
            AllocatedQuantity = 20,
            Unit = "Liters",
            MinimumThreshold = 10,
            WarehouseLocation = "Central Depot Colombo"
        };
        await context.Resources.AddAsync(resource);

        // Seed an active incident needing water
        var incident = new Incident
        {
            Id = Guid.NewGuid(),
            CaseNumber = "HMR-RES-01",
            Title = "Flood displacement in Kelani",
            Description = "Clean water urgently required",
            Category = IncidentCategory.WaterAndSanitation,
            Priority = PriorityLevel.Critical,
            Status = IncidentStatus.Open,
            OperationalArea = "Kelani East",
            AffectedPeople = 10
        };
        await context.Incidents.AddAsync(incident);
        await context.SaveChangesAsync();

        var result = await controller.GetResourceCoordination(default);
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var res = Assert.IsAssignableFrom<Result<ResourceCoordinationDashboardDto>>(okResult.Value);

        Assert.True(res.Succeeded);
        Assert.NotNull(res.Data);
        Assert.NotNull(res.Data.Metrics);
        Assert.NotEmpty(res.Data.Requirements);
        Assert.NotNull(res.Data.Recommendations);
    }

    [Fact]
    public async Task SubmitAllocationRequest_ValidDto_ShouldPersistAllocationRequest()
    {
        var (controller, _, _, context) = CreateControllers();

        var resItem = new Resource
        {
            Id = Guid.NewGuid(),
            Name = "Clean Water Tanker (5000L)",
            Category = "Water",
            TotalQuantity = 100,
            AllocatedQuantity = 0,
            Unit = "Liters",
            MinimumThreshold = 10,
            WarehouseLocation = "Central Depot Colombo"
        };
        await context.Resources.AddAsync(resItem);
        await context.SaveChangesAsync();

        var dto = new SubmitResourceAllocationRequestDto
        {
            Category = "Water",
            ResourceName = "Clean Water Tanker (5000L)",
            RequestedQuantity = 50,
            Destination = "Kelani East Zone 03",
            Urgency = "Critical",
            RelatedRecord = "HMR-RES-01",
            Justification = "Immediate need for 10 displaced families at evacuation site"
        };

        var result = await controller.SubmitAllocationRequest(dto, default);
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var res = Assert.IsAssignableFrom<Result<CoordinatorAllocationRequestDto>>(okResult.Value);

        Assert.True(res.Succeeded);
        Assert.NotNull(res.Data);
        Assert.Equal("Submitted", res.Data.Status);
        Assert.Equal(50, res.Data.RequestedQuantity);

        // Verify persistence in ResourceAllocations
        var savedAlloc = await context.ResourceAllocations.FindAsync(res.Data.Id);
        Assert.NotNull(savedAlloc);
        Assert.Equal(50, savedAlloc.Quantity);
        Assert.Equal(0, savedAlloc.DispatchStatus); // Submitted
        Assert.Contains("Kelani East Zone 03", savedAlloc.Notes);
    }

    [Fact]
    public async Task GetShelterVolunteerCoordination_ShouldReturnRealSheltersVolunteersAndMetrics()
    {
        var (controller, _, _, context) = CreateControllers();

        // Seed a Shelter
        var shelter = new Shelter
        {
            Id = Guid.NewGuid(),
            Name = "Kelani Central Community Hall",
            Address = "Kelani East Road, Zone 03",
            Latitude = 6.9532m,
            Longitude = 79.9124m,
            TotalCapacity = 150,
            CurrentOccupancy = 40,
            Facilities = "[\"Water Supply\",\"First Aid\",\"Electricity\"]",
            IsActive = true
        };
        await context.Shelters.AddAsync(shelter);

        // Seed an active Incident
        var incident = new Incident
        {
            Id = Guid.NewGuid(),
            CaseNumber = "HMR-SH-01",
            Title = "Evacuation required for flood victims",
            Description = "Families displaced by river overflow",
            Category = IncidentCategory.EmergencyShelter,
            Priority = PriorityLevel.Critical,
            Status = IncidentStatus.Open,
            OperationalArea = "Kelani East",
            AffectedPeople = 6
        };
        await context.Incidents.AddAsync(incident);
        await context.SaveChangesAsync();

        var result = await controller.GetShelterVolunteerCoordination(default);
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var res = Assert.IsAssignableFrom<Result<ShelterVolunteerDashboardDto>>(okResult.Value);

        Assert.True(res.Succeeded);
        Assert.NotNull(res.Data);
        Assert.NotNull(res.Data.Metrics);
        Assert.True(res.Data.Metrics.AvailableShelterCapacity >= 110);
        Assert.NotEmpty(res.Data.Shelters);
        Assert.NotEmpty(res.Data.ShelterRecommendations);
    }

    [Fact]
    public async Task SubmitShelterPlacementRequest_ValidDto_ShouldPersistPlacementRequest()
    {
        var (controller, _, _, context) = CreateControllers();

        var shelter = new Shelter
        {
            Id = Guid.NewGuid(),
            Name = "Wattala Relief Center",
            Address = "Wattala South Road",
            Latitude = 6.9800m,
            Longitude = 79.8900m,
            TotalCapacity = 100,
            CurrentOccupancy = 20,
            IsActive = true
        };
        await context.Shelters.AddAsync(shelter);
        await context.SaveChangesAsync();

        var dto = new SubmitShelterPlacementRequestDto
        {
            ShelterId = shelter.Id,
            RelatedIncident = "HMR-1042",
            NumberOfPersons = 6,
            SpecialRequirements = "Wheelchair accessible ground floor required",
            AccessibilityNeeds = "Older adult with limited mobility",
            Priority = "Critical",
            CoordinatorNotes = "Family evacuated from inundated home"
        };

        var result = await controller.SubmitShelterPlacementRequest(dto, default);
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var res = Assert.IsAssignableFrom<Result<CoordinatorShelterPlacementRequestDto>>(okResult.Value);

        Assert.True(res.Succeeded);
        Assert.NotNull(res.Data);
        Assert.Equal("Submitted", res.Data.Status);
        Assert.Equal(6, res.Data.NumberOfPersons);

        // Verify persistence in ShelterAllocations
        var savedAlloc = await context.ShelterAllocations.FindAsync(res.Data.Id);
        Assert.NotNull(savedAlloc);
        Assert.Equal(6, savedAlloc.NumberOfPersons);
        Assert.Contains("Status: Submitted", savedAlloc.Notes);
        Assert.Contains("HMR-1042", savedAlloc.Notes);
        // Verify shelter occupancy was NOT directly updated by coordinator
        var refreshedShelter = await context.Shelters.FindAsync(shelter.Id);
        Assert.NotNull(refreshedShelter);
        Assert.Equal(20, refreshedShelter.CurrentOccupancy);
    }

    [Fact]
    public async Task SubmitVolunteerAssignmentRequest_ValidDto_ShouldPersistAssignmentRequest()
    {
        var (controller, _, _, context) = CreateControllers();

        var dto = new SubmitVolunteerAssignmentRequestDto
        {
            RelatedIncident = "HMR-1042",
            RequiredVolunteerCount = 4,
            RequiredSkills = "First Aid, Water Rescue",
            Location = "Kelani East Zone 03",
            Priority = "Critical",
            TaskDescription = "Assist boat evacuation and primary trauma triage",
            AdditionalInstructions = "Wear standard high-visibility life jackets and boots"
        };

        var result = await controller.SubmitVolunteerAssignmentRequest(dto, default);
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var res = Assert.IsAssignableFrom<Result<CoordinatorVolunteerAssignmentRequestDto>>(okResult.Value);

        Assert.True(res.Succeeded);
        Assert.NotNull(res.Data);
        Assert.Equal("Submitted", res.Data.Status);
        Assert.Equal(4, res.Data.RequiredVolunteerCount);

        // Verify persistence in VolunteerAssignments
        var savedAssignment = await context.VolunteerAssignments.FindAsync(res.Data.Id);
        Assert.NotNull(savedAssignment);
        Assert.Equal(0, savedAssignment.AssignmentStatus); // Submitted
        Assert.Contains("Needed: 4", savedAssignment.Notes);
        Assert.Contains("HMR-1042", savedAssignment.Notes);
    }

    [Fact]
    public async Task GetAnalytics_ShouldReturnRealCalculatedMetrics()
    {
        var (controller, _, _, context) = CreateControllers();

        var req = new AssistanceRequest
        {
            Id = Guid.NewGuid(),
            Category = "Rescue",
            Description = "Trapped residents needing boat rescue",
            Urgency = PriorityLevel.Critical,
            Status = RequestStatus.Verified,
            CreatedAt = DateTime.UtcNow.AddDays(-2),
            ResolvedAt = null,
            Address = "Test River Road 10",
            NumberOfPeople = 12
        };
        await context.AssistanceRequests.AddAsync(req);

        var resObj = new Resource
        {
            Id = Guid.NewGuid(),
            Name = "Clean Water Tanker",
            Category = "Water",
            Unit = "Liters",
            TotalQuantity = 500
        };
        await context.Resources.AddAsync(resObj);

        var resourceAlloc = new ResourceAllocation
        {
            Id = Guid.NewGuid(),
            ResourceId = resObj.Id,
            AssistanceRequestId = req.Id,
            Quantity = 100,
            DispatchStatus = 2, // Delivered
            DeliveredAt = DateTime.UtcNow.AddDays(-1)
        };
        await context.ResourceAllocations.AddAsync(resourceAlloc);
        await context.SaveChangesAsync();

        var result = await controller.GetAnalytics("30d", null, null, default);
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var res = Assert.IsAssignableFrom<Result<CoordinatorAnalyticsDto>>(okResult.Value);

        Assert.True(res.Succeeded);
        Assert.NotNull(res.Data);
        Assert.NotNull(res.Data.Metrics);
        Assert.True(res.Data.Metrics.IncomingRequestsCount >= 1);
        Assert.NotNull(res.Data.Metrics.AvgInitialReviewTime);
        Assert.NotNull(res.Data.Metrics.OpenVsResolvedRatio);
        Assert.NotNull(res.Data.Metrics.ResourceFulfillmentRatio);
        Assert.NotNull(res.Data.PriorityDistribution);
        Assert.NotEmpty(res.Data.PriorityDistribution.Slices);
        Assert.NotEmpty(res.Data.RequestsOverTime);
        Assert.NotNull(res.Data.ResourceCoordination);
        Assert.True(res.Data.ResourceCoordination.DeliveredQuantity >= 100);
    }
}
