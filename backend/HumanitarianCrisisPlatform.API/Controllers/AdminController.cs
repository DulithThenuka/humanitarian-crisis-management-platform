using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Admin;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.API.Controllers;

[Route("api/[controller]")]
public class AdminController : BaseApiController
{
    private readonly IAdminService _adminService;
    private readonly IAdminNotificationService _notificationService;

    public AdminController(IAdminService adminService, IAdminNotificationService notificationService)
    {
        _adminService = adminService;
        _notificationService = notificationService;
    }

    private string CurrentUserName =>
        User.FindFirst(ClaimTypes.Name)?.Value
        ?? User.FindFirst("name")?.Value
        ?? User.FindFirst(ClaimTypes.Email)?.Value
        ?? "Operations Administrator";

    // =========================================================================
    // 1. Dashboard & Core Telemetry Aggregator
    // =========================================================================
    /// <summary>
    /// Gets system-wide operational metrics, user demographics, crisis totals, and server health telemetry.
    /// </summary>
    [HttpGet("dashboard-stats")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<AdminDashboardStatsDto>>> GetDashboardStats(CancellationToken cancellationToken)
    {
        var result = await _adminService.GetDashboardStatsAsync(cancellationToken);
        return Ok(result);
    }

    // =========================================================================
    // 2. User & RBAC Management
    // =========================================================================
    /// <summary>
    /// Searches and filters system users by role, active status, and query term.
    /// </summary>
    [HttpGet("users")]
    [AllowAnonymous]
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
    [AllowAnonymous]
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
    [Authorize(Roles = "Admin,Coordinator")]
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
    [Authorize(Roles = "Admin,Coordinator")]
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
    [Authorize(Roles = "Admin,Coordinator")]
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

    // =========================================================================
    // 3. Security & Immutable Audit Logs
    // =========================================================================
    /// <summary>
    /// Retrieves cryptographically verifiable AI decision logs and human oversight audit entries.
    /// </summary>
    [HttpGet("audit-logs")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<IReadOnlyList<AdminAuditLogDto>>>> GetAuditLogs(
        [FromQuery] int take = 50,
        CancellationToken cancellationToken = default)
    {
        var result = await _adminService.GetAuditLogsAsync(take, cancellationToken);
        return Ok(result);
    }

    // =========================================================================
    // 4. Platform Settings
    // =========================================================================
    /// <summary>
    /// Gets platform configuration and operational parameters.
    /// </summary>
    [HttpGet("settings")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<PlatformSettingsDto>>> GetSettings(CancellationToken cancellationToken)
    {
        var result = await _adminService.GetPlatformSettingsAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Updates platform configuration and operational thresholds.
    /// </summary>
    [HttpPut("settings")]
    [Authorize(Roles = "Admin,Coordinator")]
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

    // =========================================================================
    // 5. System Health & Team
    // =========================================================================
    /// <summary>
    /// Gets detailed live system health metrics and server diagnostic telemetry.
    /// </summary>
    [HttpGet("system-health")]
    [AllowAnonymous]
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

    // =========================================================================
    // 6. Financial Grants & Donations Management
    // =========================================================================
    /// <summary>
    /// Lists corporate, UN, and international relief grants and in-kind donation records.
    /// </summary>
    [HttpGet("donations")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<IReadOnlyList<AdminDonationDto>>>> GetDonations(
        [FromQuery] string? type,
        [FromQuery] string? status,
        [FromQuery] string? search,
        CancellationToken cancellationToken)
    {
        var result = await _adminService.GetDonationsAsync(type, status, search, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Gets aggregated financial statistics and relief supplies breakdown.
    /// </summary>
    [HttpGet("donations/summary")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<AdminDonationsSummaryDto>>> GetDonationsSummary(CancellationToken cancellationToken)
    {
        var result = await _adminService.GetDonationsSummaryAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Registers a new relief grant or shipment into the Treasury Ledger.
    /// </summary>
    [HttpPost("donations")]
    [Authorize(Roles = "Admin,Coordinator")]
    public async Task<ActionResult<Result<AdminDonationDto>>> CreateDonation(
        [FromBody] CreateAdminDonationDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(Result<AdminDonationDto>.Failure("Invalid donation payload."));
        }

        var result = await _adminService.CreateDonationAsync(dto, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Cryptographically clears and verifies a donation record.
    /// </summary>
    [HttpPut("donations/{id:guid}/verify")]
    [Authorize(Roles = "Admin,Coordinator")]
    public async Task<ActionResult<Result<bool>>> VerifyDonation(
        Guid id,
        [FromBody] VerifyDonationDto? dto,
        CancellationToken cancellationToken)
    {
        var verifier = !string.IsNullOrWhiteSpace(dto?.VerifiedBy) ? dto.VerifiedBy : CurrentUserName;
        var result = await _adminService.VerifyDonationAsync(id, verifier, cancellationToken);
        if (!result.Succeeded)
        {
            return BadRequest(result);
        }
        return Ok(result);
    }

    /// <summary>
    /// Removes a donation record from the ledger.
    /// </summary>
    [HttpDelete("donations/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Result<bool>>> DeleteDonation(Guid id, CancellationToken cancellationToken)
    {
        var result = await _adminService.DeleteDonationAsync(id, cancellationToken);
        if (!result.Succeeded)
        {
            return BadRequest(result);
        }
        return Ok(result);
    }

    // =========================================================================
    // 7. Emergency Broadcasts & Alert Warnings
    // =========================================================================
    /// <summary>
    /// Lists all emergency broadcasts and multi-channel disaster alerts.
    /// </summary>
    [HttpGet("broadcasts")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<IReadOnlyList<AdminBroadcastDto>>>> GetBroadcasts(
        [FromQuery] bool? activeOnly,
        [FromQuery] string? severity,
        CancellationToken cancellationToken)
    {
        var result = await _adminService.GetBroadcastsAsync(activeOnly, severity, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Gets active emergency alerts currently streaming to citizens.
    /// </summary>
    [HttpGet("broadcasts/active")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<IReadOnlyList<AdminBroadcastDto>>>> GetActiveBroadcasts(CancellationToken cancellationToken)
    {
        var result = await _adminService.GetBroadcastsAsync(true, null, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Dispatches a high-priority national emergency broadcast across cellular and push gateways.
    /// </summary>
    [HttpPost("broadcasts")]
    [Authorize(Roles = "Admin,Coordinator")]
    public async Task<ActionResult<Result<AdminBroadcastDto>>> CreateBroadcast(
        [FromBody] CreateAdminBroadcastDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(Result<AdminBroadcastDto>.Failure("Invalid broadcast payload."));
        }

        var result = await _adminService.CreateBroadcastAsync(dto, CurrentUserName, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Retracts or archives an emergency broadcast.
    /// </summary>
    [HttpPut("broadcasts/{id:guid}/archive")]
    [Authorize(Roles = "Admin,Coordinator")]
    public async Task<ActionResult<Result<bool>>> ArchiveBroadcast(Guid id, CancellationToken cancellationToken)
    {
        var result = await _adminService.ArchiveBroadcastAsync(id, cancellationToken);
        if (!result.Succeeded)
        {
            return BadRequest(result);
        }
        return Ok(result);
    }

    // =========================================================================
    // 8. Situation Reports (SITREP)
    // =========================================================================
    /// <summary>
    /// Lists official Situation Reports (SITREPs) compiled for disaster management authorities.
    /// </summary>
    [HttpGet("reports")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<IReadOnlyList<AdminSitrepDto>>>> GetSituationReports(
        [FromQuery] string? district,
        CancellationToken cancellationToken)
    {
        var result = await _adminService.GetSituationReportsAsync(district, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Compiles and signs a new official Situation Report from live operational telemetry.
    /// </summary>
    [HttpPost("reports/generate")]
    [Authorize(Roles = "Admin,Coordinator")]
    public async Task<ActionResult<Result<AdminSitrepDto>>> GenerateSituationReport(
        [FromBody] GenerateSitrepRequestDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(Result<AdminSitrepDto>.Failure("Invalid SITREP payload."));
        }

        var result = await _adminService.GenerateSituationReportAsync(dto, CurrentUserName, cancellationToken);
        return Ok(result);
    }

    // =========================================================================
    // 9. AI Governance & Calibration
    // =========================================================================
    /// <summary>
    /// Retrieves AI automated triage accuracy metrics, human override rates, and keyword distribution.
    /// </summary>
    [HttpGet("ai-governance")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<AdminAiGovernanceStatsDto>>> GetAiGovernanceStats(CancellationToken cancellationToken)
    {
        var result = await _adminService.GetAiGovernanceStatsAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Calibrates the AI model confidence threshold and human-in-the-loop policies.
    /// </summary>
    [HttpPost("ai-governance/calibrate")]
    [Authorize(Roles = "Admin,Coordinator")]
    public async Task<ActionResult<Result<bool>>> CalibrateAiModel(
        [FromBody] CalibrateAiModelDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(Result<bool>.Failure("Invalid calibration payload."));
        }

        var result = await _adminService.CalibrateAiModelAsync(dto, cancellationToken);
        return Ok(result);
    }

    // =========================================================================
    // 10. System Maintenance & Integrity Diagnostics
    // =========================================================================
    /// <summary>
    /// Executes cryptographic ledger integrity verification and database consistency checks.
    /// </summary>
    [HttpGet("maintenance/diagnostics")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<SystemDiagnosticsResultDto>>> RunSystemDiagnostics(CancellationToken cancellationToken)
    {
        var result = await _adminService.RunSystemDiagnosticsAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Re-synchronizes standard evaluation demonstration data across all modules.
    /// </summary>
    [HttpPost("maintenance/reseed")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<bool>>> ReseedDemoData(CancellationToken cancellationToken)
    {
        var result = await _adminService.ReseedDemoDataAsync(cancellationToken);
        return Ok(result);
    }

    // =========================================================================
    // 11. Persistent Admin Registration Notifications
    // =========================================================================
    /// <summary>
    /// Retrieves persistent system notifications including new Citizen and Volunteer registrations.
    /// Restricted to Admin and Coordinator roles.
    /// </summary>
    [HttpGet("notifications")]
    [Authorize(Roles = "Admin,Coordinator")]
    public async Task<ActionResult<Result<IReadOnlyList<AdminNotificationDto>>>> GetNotifications(CancellationToken cancellationToken)
    {
        var notifications = await _notificationService.GetNotificationsAsync(cancellationToken);
        return Ok(Result<IReadOnlyList<AdminNotificationDto>>.Success(notifications));
    }

    /// <summary>
    /// Gets the count of unread administrative notifications.
    /// </summary>
    [HttpGet("notifications/unread-count")]
    [Authorize(Roles = "Admin,Coordinator")]
    public async Task<ActionResult<Result<int>>> GetUnreadCount(CancellationToken cancellationToken)
    {
        var count = await _notificationService.GetUnreadCountAsync(cancellationToken);
        return Ok(Result<int>.Success(count));
    }

    /// <summary>
    /// Marks an individual notification as read.
    /// </summary>
    [HttpPost("notifications/{id:guid}/mark-read")]
    [Authorize(Roles = "Admin,Coordinator")]
    public async Task<ActionResult<Result<bool>>> MarkNotificationRead(Guid id, CancellationToken cancellationToken)
    {
        var success = await _notificationService.MarkAsReadAsync(id, cancellationToken);
        return Ok(Result<bool>.Success(success, success ? "Notification marked as read" : "Notification not found"));
    }

    /// <summary>
    /// Marks all administrative notifications as read.
    /// </summary>
    [HttpPost("notifications/mark-all-read")]
    [Authorize(Roles = "Admin,Coordinator")]
    public async Task<ActionResult<Result<bool>>> MarkAllNotificationsRead(CancellationToken cancellationToken)
    {
        var success = await _notificationService.MarkAllAsReadAsync(cancellationToken);
        return Ok(Result<bool>.Success(success, "All notifications marked as read"));
    }

    /// <summary>
    /// Retrieves verified registration details for a citizen or volunteer from the database.
    /// </summary>
    [HttpGet("registration-details/{userId:guid}")]
    [Authorize(Roles = "Admin,Coordinator")]
    public async Task<ActionResult<Result<AdminRegistrationDetailsDto>>> GetRegistrationDetails(Guid userId, CancellationToken cancellationToken)
    {
        var details = await _notificationService.GetRegistrationDetailsAsync(userId, cancellationToken);
        if (details == null)
        {
            return NotFound(Result<AdminRegistrationDetailsDto>.Failure("User registration details could not be found."));
        }
        return Ok(Result<AdminRegistrationDetailsDto>.Success(details));
    }

    /// <summary>
    /// Verifies and activates a registered field volunteer.
    /// </summary>
    [HttpPost("volunteers/{userId:guid}/verify")]
    [Authorize(Roles = "Admin,Coordinator")]
    public async Task<ActionResult<Result<bool>>> VerifyVolunteerRegistration(
        Guid userId,
        [FromBody] VerifyVolunteerRequestDto? dto,
        CancellationToken cancellationToken)
    {
        var success = await _notificationService.VerifyVolunteerAsync(userId, CurrentUserName, dto?.Notes, cancellationToken);
        if (!success)
        {
            return BadRequest(Result<bool>.Failure("Failed to verify volunteer or volunteer profile not found."));
        }
        return Ok(Result<bool>.Success(true, "Field volunteer verified and credentials activated."));
    }
}
