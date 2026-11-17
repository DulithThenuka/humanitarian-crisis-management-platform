using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Admin;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Services;

public interface IAdminService
{
    // 1. Dashboard & Core Telemetry
    Task<Result<AdminDashboardStatsDto>> GetDashboardStatsAsync(CancellationToken cancellationToken = default);

    // 2. User & RBAC Management
    Task<Result<IReadOnlyList<AdminUserDto>>> GetUsersAsync(string? role, bool? isActive, string? search, CancellationToken cancellationToken = default);
    Task<Result<AdminUserDto>> GetUserByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<AdminUserDto>> CreateUserAsync(CreateAdminUserDto dto, CancellationToken cancellationToken = default);
    Task<Result<AdminUserDto>> UpdateUserAsync(Guid id, UpdateAdminUserDto dto, CancellationToken cancellationToken = default);
    Task<Result<bool>> UpdateUserStatusAsync(Guid id, bool isActive, Guid currentUserId, CancellationToken cancellationToken = default);
    Task<Result<bool>> UpdateUserRoleAsync(Guid id, UserRole role, Guid currentUserId, CancellationToken cancellationToken = default);
    Task<Result<bool>> ResetPasswordAsync(Guid id, string newPassword, CancellationToken cancellationToken = default);
    Task<Result<bool>> DeleteUserAsync(Guid id, Guid currentUserId, CancellationToken cancellationToken = default);

    // 3. Security & Immutable Audit Logs
    Task<Result<IReadOnlyList<AdminAuditLogDto>>> GetAuditLogsAsync(int take = 50, CancellationToken cancellationToken = default);

    // 4. Platform Settings
    Task<Result<PlatformSettingsDto>> GetPlatformSettingsAsync(CancellationToken cancellationToken = default);
    Task<Result<PlatformSettingsDto>> UpdatePlatformSettingsAsync(PlatformSettingsDto dto, CancellationToken cancellationToken = default);

    // 5. System Health & Team
    Task<Result<SystemHealthDetailsDto>> GetSystemHealthAsync(CancellationToken cancellationToken = default);
    Task<Result<ProjectTeamDto>> GetProjectTeamAsync(CancellationToken cancellationToken = default);

    // 6. Grants & Donations Management
    Task<Result<IReadOnlyList<AdminDonationDto>>> GetDonationsAsync(string? type, string? status, string? search, CancellationToken cancellationToken = default);
    Task<Result<AdminDonationsSummaryDto>> GetDonationsSummaryAsync(CancellationToken cancellationToken = default);
    Task<Result<AdminDonationDto>> CreateDonationAsync(CreateAdminDonationDto dto, CancellationToken cancellationToken = default);
    Task<Result<bool>> VerifyDonationAsync(Guid id, string verifiedBy, CancellationToken cancellationToken = default);
    Task<Result<bool>> DeleteDonationAsync(Guid id, CancellationToken cancellationToken = default);

    // 7. Emergency Broadcasts & Alert Warnings
    Task<Result<IReadOnlyList<AdminBroadcastDto>>> GetBroadcastsAsync(bool? activeOnly, string? severity, CancellationToken cancellationToken = default);
    Task<Result<AdminBroadcastDto>> CreateBroadcastAsync(CreateAdminBroadcastDto dto, string sentByName, CancellationToken cancellationToken = default);
    Task<Result<bool>> ArchiveBroadcastAsync(Guid id, CancellationToken cancellationToken = default);

    // 8. Situation Reports (SITREP)
    Task<Result<IReadOnlyList<AdminSitrepDto>>> GetSituationReportsAsync(string? district, CancellationToken cancellationToken = default);
    Task<Result<AdminSitrepDto>> GenerateSituationReportAsync(GenerateSitrepRequestDto dto, string generatedByName, CancellationToken cancellationToken = default);

    // 9. AI Governance & Calibration
    Task<Result<AdminAiGovernanceStatsDto>> GetAiGovernanceStatsAsync(CancellationToken cancellationToken = default);
    Task<Result<bool>> CalibrateAiModelAsync(CalibrateAiModelDto dto, CancellationToken cancellationToken = default);

    // 10. System Maintenance & Integrity Diagnostics
    Task<Result<SystemDiagnosticsResultDto>> RunSystemDiagnosticsAsync(CancellationToken cancellationToken = default);
    Task<Result<bool>> ReseedDemoDataAsync(CancellationToken cancellationToken = default);
}
