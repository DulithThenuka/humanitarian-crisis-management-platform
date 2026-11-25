using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Xunit;
using HumanitarianCrisisPlatform.API.Controllers;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Volunteers;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Enums;
using HumanitarianCrisisPlatform.Infrastructure.Security;
using HumanitarianCrisisPlatform.Tests.IntegrationTests.Infrastructure;

namespace HumanitarianCrisisPlatform.Tests.IntegrationTests.Controllers;

public class VolunteerControllerIntegrationTests : IClassFixture<DatabaseFixture>
{
    private readonly DatabaseFixture _fixture;

    public VolunteerControllerIntegrationTests(DatabaseFixture fixture)
    {
        _fixture = fixture;
    }

    private (VolunteersController controller, HumanitarianCrisisPlatform.Infrastructure.Data.Context.ApplicationDbContext context, Guid userId, Guid volunteerId) CreateController(bool asVolunteer = true)
    {
        var context = _fixture.CreateContext();
        var services = new ServiceCollection();
        services.AddLogging();
        HumanitarianCrisisPlatform.API.Extensions.ServiceCollectionExtensions.AddApplicationServices(services, _fixture.Configuration);
        services.AddScoped(_ => context);

        var provider = services.BuildServiceProvider();
        var volunteerService = provider.GetRequiredService<IVolunteerService>();
        var controller = new VolunteersController(context, volunteerService);

        var userId = Guid.NewGuid();
        var volunteerId = Guid.NewGuid();

        // Seed user and volunteer
        var user = new User
        {
            Id = userId,
            FullName = "Bob Volunteer",
            Email = "bob.volunteer@crisisplatform.org",
            PhoneNumber = "+94 77 123 4567",
            PasswordHash = PasswordHasher.HashPassword("Volunteer@123"),
            Role = UserRole.Volunteer,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var volunteer = new Volunteer
        {
            Id = volunteerId,
            UserId = userId,
            User = user,
            Skills = "First Aid, Logistics",
            Availability = "Available",
            IsAvailable = true,
            Latitude = 6.9540m,
            Longitude = 79.9190m,
            MaxTravelDistance = 25.0m,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "Area: Kelani East | Verif: Verified"
        };

        context.Users.Add(user);
        context.Volunteers.Add(volunteer);
        context.SaveChanges();

        var roleName = asVolunteer ? "Volunteer" : "Coordinator";
        var claimsPrincipal = new System.Security.Claims.ClaimsPrincipal(new System.Security.Claims.ClaimsIdentity(new[]
        {
            new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.NameIdentifier, userId.ToString()),
            new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Name, "Bob Volunteer"),
            new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, roleName)
        }, "TestAuth"));

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext { User = claimsPrincipal }
        };

        return (controller, context, userId, volunteerId);
    }

    [Fact]
    public async Task GetCurrentVolunteer_MeEndpoint_ShouldFindVolunteerByUserId()
    {
        var (controller, _, userId, volunteerId) = CreateController(asVolunteer: true);

        var result = await controller.GetMyProfile(CancellationToken.None);
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var resVal = Assert.IsType<Result<VolunteerCoordinatorDto>>(okResult.Value);

        Assert.True(resVal.Succeeded);
        Assert.Equal(volunteerId, resVal.Data!.Id);
        Assert.Equal(userId, resVal.Data.UserId);
        Assert.Equal("Bob Volunteer", resVal.Data.FullName);
    }

    [Fact]
    public async Task UpdateVolunteer_ShouldPersistChangesToDatabase_AndSurviveRefresh()
    {
        var (controller, context, userId, volunteerId) = CreateController(asVolunteer: true);

        // Update duty status to unavailable (duty switch toggle)
        var updateDto = new UpdateVolunteerRequestDto
        {
            IsAvailable = false,
            ServiceArea = "Niyagama North",
            Skills = "Search and Rescue, Advanced First Aid",
            Availability = "Weekends Only"
        };

        var updateResult = await controller.Update(volunteerId, updateDto, CancellationToken.None);
        var okResult = Assert.IsType<OkObjectResult>(updateResult.Result);
        var resVal = Assert.IsType<Result<VolunteerCoordinatorDto>>(okResult.Value);

        Assert.True(resVal.Succeeded);
        Assert.False(resVal.Data!.IsAvailable);
        Assert.Equal("Niyagama North", resVal.Data.ServiceArea);

        // Simulate page refresh: reload directly from DbContext
        var refreshedVolunteer = await context.Volunteers.FindAsync(volunteerId);
        Assert.NotNull(refreshedVolunteer);
        Assert.False(refreshedVolunteer.IsAvailable);
        Assert.Contains("Niyagama North", refreshedVolunteer.CreatedBy);
        Assert.Equal("Search and Rescue, Advanced First Aid", refreshedVolunteer.Skills);
    }

    [Fact]
    public async Task UpdateVolunteer_UsingUserId_ShouldSuccessfullyUpdateAndPersist()
    {
        var (controller, context, userId, volunteerId) = CreateController(asVolunteer: true);

        // When frontend passes userId (from auth session) instead of volunteer record ID
        var updateDto = new UpdateVolunteerRequestDto
        {
            FullName = "Bob V. Updated",
            PhoneNumber = "+94 77 999 8888",
            IsAvailable = true
        };

        var updateResult = await controller.Update(userId, updateDto, CancellationToken.None);
        var okResult = Assert.IsType<OkObjectResult>(updateResult.Result);
        var resVal = Assert.IsType<Result<VolunteerCoordinatorDto>>(okResult.Value);

        Assert.True(resVal.Succeeded);
        Assert.Equal("Bob V. Updated", resVal.Data!.FullName);

        // Simulate refresh: reload from DB
        var userInDb = await context.Users.FindAsync(userId);
        Assert.NotNull(userInDb);
        Assert.Equal("Bob V. Updated", userInDb.FullName);
        Assert.Equal("+94 77 999 8888", userInDb.PhoneNumber);
    }

    [Fact]
    public async Task CoordinatorActions_Verify_Clarify_Escalate_ShouldPersistAuditTrail()
    {
        var (controller, context, _, volunteerId) = CreateController(asVolunteer: false);

        // 1. Clarification request
        var clarifyDto = new VolunteerActionRequestDto { Note = "Need proof of driver license" };
        var clarifyRes = await controller.RequestClarification(volunteerId, clarifyDto, CancellationToken.None);
        Assert.True(Assert.IsType<Result<bool>>(Assert.IsType<OkObjectResult>(clarifyRes.Result).Value).Succeeded);

        var volAfterClarify = await context.Volunteers.FindAsync(volunteerId);
        Assert.Contains("Pending", volAfterClarify!.CreatedBy);
        Assert.Contains("Need proof of driver license", volAfterClarify.LastModifiedBy);

        // 2. Verification
        var verifyDto = new VolunteerActionRequestDto { Note = "Driver license reviewed and approved" };
        var verifyRes = await controller.Verify(volunteerId, verifyDto, CancellationToken.None);
        Assert.True(Assert.IsType<Result<bool>>(Assert.IsType<OkObjectResult>(verifyRes.Result).Value).Succeeded);

        var volAfterVerify = await context.Volunteers.FindAsync(volunteerId);
        Assert.Contains("Verified", volAfterVerify!.CreatedBy);
        Assert.True(volAfterVerify.IsAvailable);
    }

    [Fact]
    public async Task AssignmentLifecycle_Assign_Accept_Complete_ShouldPersistAllStates()
    {
        var (controller, context, userId, volunteerId) = CreateController(asVolunteer: true);

        // 1. Assign shift
        var assignDto = new AssignShiftRequestDto
        {
            VolunteerId = volunteerId,
            ShiftTime = "08:00-14:00",
            ShiftTask = "Emergency Food Distribution",
            Note = "Kelani East Relief Centre"
        };

        var assignRes = await controller.AssignShift(assignDto, CancellationToken.None);
        var assignedData = Assert.IsType<Result<VolunteerAssignmentDetailDto>>(Assert.IsType<OkObjectResult>(assignRes.Result).Value).Data!;
        var assignmentId = assignedData.Id;

        // Verify volunteer is now unavailable due to active assignment
        var volAfterAssign = await context.Volunteers.FindAsync(volunteerId);
        Assert.False(volAfterAssign!.IsAvailable);

        // 2. Fetch assignments using UserId (frontend pattern)
        var fetchByUserId = await controller.GetAssignments(null, null, userId, CancellationToken.None);
        var userAssignments = Assert.IsType<Result<IReadOnlyList<VolunteerAssignmentDetailDto>>>(Assert.IsType<OkObjectResult>(fetchByUserId.Result).Value).Data!;
        Assert.Single(userAssignments);
        Assert.Equal("Emergency Food Distribution", userAssignments[0].TaskDescription);

        // 3. Accept assignment
        var acceptRes = await controller.AcceptAssignment(assignmentId, CancellationToken.None);
        Assert.True(Assert.IsType<Result<bool>>(Assert.IsType<OkObjectResult>(acceptRes.Result).Value).Succeeded);

        var dbAssignment = await context.VolunteerAssignments.FindAsync(assignmentId);
        Assert.Equal(1, dbAssignment!.AssignmentStatus); // InProgress

        // 4. Complete assignment
        var completeRes = await controller.CompleteAssignment(assignmentId, new AssignmentActionRequestDto { Reason = "Successfully handed out 200 kits" }, CancellationToken.None);
        Assert.True(Assert.IsType<Result<bool>>(Assert.IsType<OkObjectResult>(completeRes.Result).Value).Succeeded);

        // Simulate refresh: re-query DB directly
        var completedDbAssignment = await context.VolunteerAssignments.FindAsync(assignmentId);
        Assert.Equal(2, completedDbAssignment!.AssignmentStatus); // Completed
        Assert.NotNull(completedDbAssignment.EndTime);

        // Volunteer availability restored
        var volAfterComplete = await context.Volunteers.FindAsync(volunteerId);
        Assert.True(volAfterComplete!.IsAvailable);
    }
}
