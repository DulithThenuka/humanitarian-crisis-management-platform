using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Xunit;
using HumanitarianCrisisPlatform.API.Controllers;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Admin;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Enums;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;
using HumanitarianCrisisPlatform.Infrastructure.Data.Seed;
using HumanitarianCrisisPlatform.Infrastructure.Security;
using HumanitarianCrisisPlatform.Infrastructure.Services;
using HumanitarianCrisisPlatform.Tests.IntegrationTests.Infrastructure;

namespace HumanitarianCrisisPlatform.Tests.IntegrationTests.Controllers;

public class AdminControllerTests : IClassFixture<DatabaseFixture>
{
    private readonly DatabaseFixture _fixture;

    public AdminControllerTests(DatabaseFixture fixture)
    {
        _fixture = fixture;
    }

    private AdminController CreateController(ApplicationDbContext? context = null, Guid? currentUserId = null, string role = "Admin")
    {
        var db = context ?? _fixture.CreateContext();
        var adminService = new AdminService(db);
        var controller = new AdminController(adminService);

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
    public async Task GetDashboardStats_ShouldReturnAggregatedMetrics()
    {
        var controller = CreateController();

        var actionResult = await controller.GetDashboardStats(CancellationToken.None);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<AdminDashboardStatsDto>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);

        // Verify User stats
        Assert.True(result.Data.UserStats.TotalUsers >= 1);
        Assert.NotEmpty(result.Data.UserStats.UsersByRole);

        // Verify Crisis stats
        Assert.True(result.Data.CrisisStats.TotalCrises >= 1);

        // Verify Shelter stats
        Assert.True(result.Data.ShelterStats.TotalShelters >= 1);
        Assert.True(result.Data.ShelterStats.TotalCapacity >= 1);

        // Verify Request stats
        Assert.True(result.Data.RequestStats.TotalRequests >= 1);

        // Verify Security & Health
        Assert.Contains("SHA-256", result.Data.SecurityStats.CryptographicLedgerStatus);
        Assert.Equal("Healthy", result.Data.SystemHealth.Status);
    }

    [Fact]
    public async Task GetUsers_ShouldReturnUserList()
    {
        var controller = CreateController();

        var actionResult = await controller.GetUsers(null, null, null, CancellationToken.None);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<IReadOnlyList<AdminUserDto>>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.NotEmpty(result.Data);
        Assert.Contains(result.Data, u => u.Email.Contains("@"));
    }

    [Fact]
    public async Task GetUsers_FilteredByRole_ShouldReturnMatchingUsers()
    {
        var controller = CreateController();

        var actionResult = await controller.GetUsers("Coordinator", true, null, CancellationToken.None);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<IReadOnlyList<AdminUserDto>>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.All(result.Data, u => Assert.Equal(UserRole.Coordinator, u.Role));
    }

    [Fact]
    public async Task GetUserById_WithExistingUser_ShouldReturnUser()
    {
        var context = _fixture.CreateContext();
        await DatabaseSeeder.SeedAsync(context);
        var user = context.Users.First();
        var controller = CreateController(context);

        var actionResult = await controller.GetUserById(user.Id, CancellationToken.None);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<AdminUserDto>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.Equal(user.Id, result.Data.Id);
        Assert.Equal(user.Email, result.Data.Email);
    }

    [Fact]
    public async Task GetUserById_WithNonExistentUser_ShouldReturnNotFound()
    {
        var controller = CreateController();
        var nonExistentId = Guid.NewGuid();

        var actionResult = await controller.GetUserById(nonExistentId, CancellationToken.None);

        var notFoundResult = Assert.IsType<NotFoundObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<AdminUserDto>>(notFoundResult.Value);

        Assert.False(result.Succeeded);
    }

    [Fact]
    public async Task CreateUser_WithValidPayload_ShouldCreateUser()
    {
        var controller = CreateController();
        var uniqueEmail = $"admin.test.{Guid.NewGuid():N}@crisisplatform.org";

        var dto = new CreateAdminUserDto
        {
            FullName = "Unit Test Admin",
            Email = uniqueEmail,
            Password = "SecurePassword123!",
            PhoneNumber = "+94770001122",
            Role = UserRole.Volunteer
        };

        var actionResult = await controller.CreateUser(dto, CancellationToken.None);

        var createdResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<AdminUserDto>>(createdResult.Value);

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.Equal(uniqueEmail, result.Data.Email);
        Assert.Equal("Unit Test Admin", result.Data.FullName);
        Assert.Equal(UserRole.Volunteer, result.Data.Role);
        Assert.True(result.Data.IsActive);
    }

    [Fact]
    public async Task CreateUser_WithDuplicateEmail_ShouldFail()
    {
        var context = _fixture.CreateContext();
        await DatabaseSeeder.SeedAsync(context);
        var controller = CreateController(context);

        var dto = new CreateAdminUserDto
        {
            FullName = "Duplicate User",
            Email = "sarah.johnson@reliefcore.org",
            Password = "SecurePassword123!",
            Role = UserRole.Citizen
        };

        var actionResult = await controller.CreateUser(dto, CancellationToken.None);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<AdminUserDto>>(badRequestResult.Value);

        Assert.False(result.Succeeded);
        Assert.Contains(result.Errors, e => e.Contains("already exists") || e.Contains("already in use"));
    }

    [Fact]
    public async Task UpdateUser_WithValidPayload_ShouldUpdateDetails()
    {
        var context = _fixture.CreateContext();
        var uniqueEmail = $"edit.{Guid.NewGuid():N}@crisisplatform.org";
        var user = new User
        {
            Id = Guid.NewGuid(),
            FullName = "Before Edit",
            Email = uniqueEmail,
            PasswordHash = PasswordHasher.HashPassword("Password123!"),
            Role = UserRole.Citizen,
            IsActive = true
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var controller = CreateController(context);
        var updateDto = new UpdateAdminUserDto
        {
            FullName = "After Edit Name",
            Email = uniqueEmail,
            PhoneNumber = "+94771234567",
            Role = UserRole.LogisticsManager,
            IsActive = true
        };

        var actionResult = await controller.UpdateUser(user.Id, updateDto, CancellationToken.None);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<AdminUserDto>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.Equal("After Edit Name", result.Data?.FullName);
        Assert.Equal(UserRole.LogisticsManager, result.Data?.Role);
    }

    [Fact]
    public async Task UpdateUserStatus_ShouldToggleActivation()
    {
        var context = _fixture.CreateContext();
        var uniqueEmail = $"status.{Guid.NewGuid():N}@crisisplatform.org";
        var user = new User
        {
            Id = Guid.NewGuid(),
            FullName = "Status Toggle User",
            Email = uniqueEmail,
            PasswordHash = PasswordHasher.HashPassword("Password123!"),
            Role = UserRole.Citizen,
            IsActive = true
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var adminId = Guid.NewGuid();
        var controller = CreateController(context, adminId);

        var actionResult = await controller.UpdateUserStatus(user.Id, new UpdateUserStatusDto { IsActive = false }, CancellationToken.None);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<bool>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.True(result.Data);

        var updated = await context.Users.FindAsync(user.Id);
        Assert.NotNull(updated);
        Assert.False(updated.IsActive);
    }

    [Fact]
    public async Task UpdateUserStatus_SelfDeactivation_ShouldReturnBadRequest()
    {
        var selfId = Guid.NewGuid();
        var controller = CreateController(currentUserId: selfId);

        var actionResult = await controller.UpdateUserStatus(selfId, new UpdateUserStatusDto { IsActive = false }, CancellationToken.None);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<bool>>(badRequestResult.Value);

        Assert.False(result.Succeeded);
        Assert.Contains(result.Errors, e => e.Contains("You cannot deactivate your own administrative account"));
    }

    [Fact]
    public async Task UpdateUserRole_SelfDemotion_ShouldReturnBadRequest()
    {
        var selfId = Guid.NewGuid();
        var controller = CreateController(currentUserId: selfId);

        var actionResult = await controller.UpdateUserRole(selfId, new UpdateUserRoleDto { Role = UserRole.Citizen }, CancellationToken.None);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<bool>>(badRequestResult.Value);

        Assert.False(result.Succeeded);
        Assert.Contains(result.Errors, e => e.Contains("You cannot change your own administrator role"));
    }

    [Fact]
    public async Task ResetPassword_WithValidPassword_ShouldUpdatePasswordHash()
    {
        var context = _fixture.CreateContext();
        var uniqueEmail = $"pw.{Guid.NewGuid():N}@crisisplatform.org";
        var user = new User
        {
            Id = Guid.NewGuid(),
            FullName = "Password Reset User",
            Email = uniqueEmail,
            PasswordHash = PasswordHasher.HashPassword("OldPassword123!"),
            Role = UserRole.Citizen,
            IsActive = true
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var controller = CreateController(context);
        var actionResult = await controller.ResetPassword(user.Id, new ResetUserPasswordDto { NewPassword = "NewSecretPassword2026!" }, CancellationToken.None);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<bool>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.True(result.Data);

        var updated = await context.Users.FindAsync(user.Id);
        Assert.NotNull(updated);
        Assert.True(PasswordHasher.VerifyPassword("NewSecretPassword2026!", updated.PasswordHash));
    }

    [Fact]
    public async Task DeleteUser_WithValidId_ShouldRemoveUser()
    {
        var context = _fixture.CreateContext();
        var uniqueEmail = $"delete.{Guid.NewGuid():N}@crisisplatform.org";
        var user = new User
        {
            Id = Guid.NewGuid(),
            FullName = "To Be Deleted",
            Email = uniqueEmail,
            PasswordHash = PasswordHasher.HashPassword("Password123!"),
            Role = UserRole.Citizen,
            IsActive = true
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var adminId = Guid.NewGuid();
        var controller = CreateController(context, adminId);

        var actionResult = await controller.DeleteUser(user.Id, CancellationToken.None);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<bool>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.True(result.Data);

        var deleted = await context.Users.FindAsync(user.Id);
        Assert.Null(deleted);
    }

    [Fact]
    public async Task DeleteUser_SelfDeletion_ShouldReturnBadRequest()
    {
        var selfId = Guid.NewGuid();
        var controller = CreateController(currentUserId: selfId);

        var actionResult = await controller.DeleteUser(selfId, CancellationToken.None);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<bool>>(badRequestResult.Value);

        Assert.False(result.Succeeded);
        Assert.Contains(result.Errors, e => e.Contains("You cannot delete your own administrative account"));
    }

    [Fact]
    public async Task GetAuditLogs_ShouldReturnLogs()
    {
        var controller = CreateController();

        var actionResult = await controller.GetAuditLogs(10, CancellationToken.None);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<IReadOnlyList<AdminAuditLogDto>>>(okResult.Value);

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
    }
}
