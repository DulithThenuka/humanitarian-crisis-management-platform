using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Admin;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.API.Controllers;

[Authorize(Roles = "Admin,Coordinator")]
[Route("api/[controller]")]
public class AdminController : BaseApiController
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    /// <summary>
    /// Gets system-wide operational metrics, user demographics, crisis totals, and server health telemetry.
    /// </summary>
    [HttpGet("dashboard-stats")]
    public async Task<ActionResult<Result<AdminDashboardStatsDto>>> GetDashboardStats(CancellationToken cancellationToken)
    {
        var result = await _adminService.GetDashboardStatsAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Searches and filters system users by role, active status, and query term.
    /// </summary>
    [HttpGet("users")]
    public async Task<ActionResult<Result<IReadOnlyList<AdminUserDto>>>> GetUsers(
        [FromQuery] string? role,
        [FromQuery] bool? isActive,
        [FromQuery] string? search,
        CancellationToken cancellationToken)
    {
        var result = await _adminService.GetUsersAsync(role, isActive, search, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Gets a user by unique identifier.
    /// </summary>
    [HttpGet("users/{id:guid}")]
    public async Task<ActionResult<Result<AdminUserDto>>> GetUserById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _adminService.GetUserByIdAsync(id, cancellationToken);
        if (!result.Succeeded)
        {
            return NotFound(result);
        }
        return Ok(result);
    }

    /// <summary>
    /// Creates a new user with administrative authority and credentials.
    /// </summary>
    [HttpPost("users")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Result<AdminUserDto>>> CreateUser(
        [FromBody] CreateAdminUserDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(Result<AdminUserDto>.Failure("Invalid model payload."));
        }

        var result = await _adminService.CreateUserAsync(dto, cancellationToken);
        if (!result.Succeeded)
        {
            return BadRequest(result);
        }

        return CreatedAtAction(nameof(GetUserById), new { id = result.Data?.Id }, result);
    }

    /// <summary>
    /// Updates an existing user's profile details.
    /// </summary>
    [HttpPut("users/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Result<AdminUserDto>>> UpdateUser(
        Guid id,
        [FromBody] UpdateAdminUserDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(Result<AdminUserDto>.Failure("Invalid model payload."));
        }

        var result = await _adminService.UpdateUserAsync(id, dto, cancellationToken);
        if (!result.Succeeded)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Toggles a user's account activation status (lock / unlock).
    /// </summary>
    [HttpPut("users/{id:guid}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Result<bool>>> UpdateUserStatus(
        Guid id,
        [FromBody] UpdateUserStatusDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _adminService.UpdateUserStatusAsync(id, dto.IsActive, CurrentUserId, cancellationToken);
        if (!result.Succeeded)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Updates a user's platform security role.
    /// </summary>
    [HttpPut("users/{id:guid}/role")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Result<bool>>> UpdateUserRole(
        Guid id,
        [FromBody] UpdateUserRoleDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _adminService.UpdateUserRoleAsync(id, dto.Role, CurrentUserId, cancellationToken);
        if (!result.Succeeded)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Resets a user's password with a secure new hash.
    /// </summary>
    [HttpPost("users/{id:guid}/reset-password")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Result<bool>>> ResetPassword(
        Guid id,
        [FromBody] ResetUserPasswordDto dto,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(dto.NewPassword) || dto.NewPassword.Length < 6)
        {
            return BadRequest(Result<bool>.Failure("Password must be at least 6 characters."));
        }

        var result = await _adminService.ResetPasswordAsync(id, dto.NewPassword, cancellationToken);
        if (!result.Succeeded)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Deletes a user account from the system.
    /// </summary>
    [HttpDelete("users/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Result<bool>>> DeleteUser(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _adminService.DeleteUserAsync(id, CurrentUserId, cancellationToken);
        if (!result.Succeeded)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Retrieves cryptographically verifiable AI decision logs and human oversight audit entries.
    /// </summary>
    [HttpGet("audit-logs")]
    [Authorize(Roles = "Admin,Coordinator")]
    public async Task<ActionResult<Result<IReadOnlyList<AdminAuditLogDto>>>> GetAuditLogs(
        [FromQuery] int take = 50,
        CancellationToken cancellationToken = default)
    {
        var result = await _adminService.GetAuditLogsAsync(take, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Gets platform configuration and operational parameters.
    /// </summary>
    [HttpGet("settings")]
    public async Task<ActionResult<Result<PlatformSettingsDto>>> GetSettings(CancellationToken cancellationToken)
    {
        var result = await _adminService.GetPlatformSettingsAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Updates platform configuration and operational thresholds.
    /// </summary>
    [HttpPut("settings")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Result<PlatformSettingsDto>>> UpdateSettings(
        [FromBody] PlatformSettingsDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(Result<PlatformSettingsDto>.Failure("Invalid settings payload."));
        }

        var result = await _adminService.UpdatePlatformSettingsAsync(dto, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Gets detailed live system health metrics and server diagnostic telemetry.
    /// </summary>
    [HttpGet("system-health")]
    public async Task<ActionResult<Result<SystemHealthDetailsDto>>> GetSystemHealth(CancellationToken cancellationToken)
    {
        var result = await _adminService.GetSystemHealthAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Gets NSBM Green University project engineering team roster and credits.
    /// </summary>
    [HttpGet("team")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<ProjectTeamDto>>> GetProjectTeam(CancellationToken cancellationToken)
    {
        var result = await _adminService.GetProjectTeamAsync(cancellationToken);
        return Ok(result);
    }
}

