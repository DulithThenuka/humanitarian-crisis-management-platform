using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Admin;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Services;

public interface IAdminService
{
    Task<Result<AdminDashboardStatsDto>> GetDashboardStatsAsync(CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<AdminUserDto>>> GetUsersAsync(string? role, bool? isActive, string? search, CancellationToken cancellationToken = default);
    Task<Result<AdminUserDto>> GetUserByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<AdminUserDto>> CreateUserAsync(CreateAdminUserDto dto, CancellationToken cancellationToken = default);
    Task<Result<AdminUserDto>> UpdateUserAsync(Guid id, UpdateAdminUserDto dto, CancellationToken cancellationToken = default);
    Task<Result<bool>> UpdateUserStatusAsync(Guid id, bool isActive, Guid currentUserId, CancellationToken cancellationToken = default);
    Task<Result<bool>> UpdateUserRoleAsync(Guid id, UserRole role, Guid currentUserId, CancellationToken cancellationToken = default);
    Task<Result<bool>> ResetPasswordAsync(Guid id, string newPassword, CancellationToken cancellationToken = default);
    Task<Result<bool>> DeleteUserAsync(Guid id, Guid currentUserId, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<AdminAuditLogDto>>> GetAuditLogsAsync(int take = 50, CancellationToken cancellationToken = default);
    Task<Result<PlatformSettingsDto>> GetPlatformSettingsAsync(CancellationToken cancellationToken = default);
    Task<Result<PlatformSettingsDto>> UpdatePlatformSettingsAsync(PlatformSettingsDto dto, CancellationToken cancellationToken = default);
    Task<Result<SystemHealthDetailsDto>> GetSystemHealthAsync(CancellationToken cancellationToken = default);
    Task<Result<ProjectTeamDto>> GetProjectTeamAsync(CancellationToken cancellationToken = default);
}
