using System.ComponentModel.DataAnnotations;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Application.DTOs.Admin;

public class AdminDashboardStatsDto
{
    // Direct flattened properties for UI convenience
    public int TotalUsers => UserStats?.TotalUsers ?? 0;
    public int ActiveSessions => UserStats?.ActiveUsers ?? 0;
    public int SecurityAlerts => SecurityStats?.ActiveSecurityAlerts ?? 0;
    public int TotalCrises => CrisisStats?.TotalCrises ?? 0;
    public int ActiveCrises => CrisisStats?.ActiveCrises ?? 0;
    public int CriticalSeverityCrises => CrisisStats?.HighSeverityCrises ?? 0;
    public int ResolvedCrises => RequestStats?.ResolvedCount ?? 0;
    public double SystemUptimePercentage { get; set; } = 99.98;
    public double DatabaseLatencyMs { get; set; } = 14.2;
    public int ActiveLogisticsTeams => ResourceStats?.TotalAllocations ?? 0;
    public double AiModelConfidenceAverage => 94.6;
    public Dictionary<string, int> RoleDistribution => UserStats?.UsersByRole ?? new();

    // Nested detailed domain summaries
    public AdminUserSummaryDto UserStats { get; set; } = new();
    public AdminCrisisSummaryDto CrisisStats { get; set; } = new();
    public AdminShelterSummaryDto ShelterStats { get; set; } = new();
    public AdminRequestSummaryDto RequestStats { get; set; } = new();
    public AdminResourceSummaryDto ResourceStats { get; set; } = new();
    public AdminSecuritySummaryDto SecurityStats { get; set; } = new();
    public AdminSystemHealthDto SystemHealth { get; set; } = new();
}

public class AdminUserSummaryDto
{
    public int TotalUsers { get; set; }
    public int ActiveUsers { get; set; }
    public int InactiveUsers { get; set; }
    public Dictionary<string, int> UsersByRole { get; set; } = new();
}

public class AdminCrisisSummaryDto
{
    public int TotalCrises { get; set; }
    public int ActiveCrises { get; set; }
    public int HighSeverityCrises { get; set; }
}

public class AdminShelterSummaryDto
{
    public int TotalShelters { get; set; }
    public int ActiveShelters { get; set; }
    public int TotalCapacity { get; set; }
    public int CurrentOccupancy { get; set; }
    public double OccupancyRate { get; set; }
}

public class AdminRequestSummaryDto
{
    public int TotalRequests { get; set; }
    public int SubmittedCount { get; set; }
    public int InProgressCount { get; set; }
    public int ResolvedCount { get; set; }
    public int CriticalPriorityCount { get; set; }
    public double SLAComplianceRate { get; set; } = 94.0;
}

public class AdminResourceSummaryDto
{
    public int TotalInventoryCount { get; set; }
    public int LowStockCount { get; set; }
    public int TotalAllocations { get; set; }
}

public class AdminSecuritySummaryDto
{
    public int TotalAuditLogs { get; set; }
    public int OverriddenDecisions { get; set; }
    public int ActiveSecurityAlerts { get; set; }
    public string CryptographicLedgerStatus { get; set; } = "SHA-256 Verified";
}

public class AdminSystemHealthDto
{
    public string Status { get; set; } = "Healthy";
    public string Environment { get; set; } = "Production";
    public DateTime ServerTime { get; set; } = DateTime.UtcNow;
    public string DatabaseProvider { get; set; } = "Relational DB Engine";
    public string Version { get; set; } = "v1.4.2";
}

public class PlatformSettingsDto
{
    [Required]
    [StringLength(120)]
    public string PlatformName { get; set; } = "RELIEFCORE Humanitarian Platform";

    public bool EmergencyMode { get; set; } = true;
    public bool EmailNotifications { get; set; } = true;

    [Required]
    public string DataSyncInterval { get; set; } = "15 mins";

    [Required]
    public string Language { get; set; } = "English";

    public bool MaintenanceMode { get; set; } = false;
    public double AiTriageConfidenceThreshold { get; set; } = 85.0;
    public int CriticalShelterCapacityThreshold { get; set; } = 90;
    public DateTime LastUpdatedAt { get; set; } = DateTime.UtcNow;
}

public class SystemHealthDetailsDto
{
    public string Status { get; set; } = "Operational";
    public string Environment { get; set; } = "Production";
    public DateTime ServerTimeUtc { get; set; } = DateTime.UtcNow;
    public double UptimeSeconds { get; set; }
    public double AllocatedMemoryMb { get; set; }
    public string DatabaseEngine { get; set; } = "Entity Framework Core Relational";
    public string Version { get; set; } = "v1.4.2";
    public int ActiveDatabaseConnections { get; set; } = 1;
}

public class ProjectTeamDto
{
    public string ProjectName { get; set; } = "RELIEFCORE Humanitarian Crisis Management Platform";
    public string Institution { get; set; } = "NSBM Green University";
    public string Faculty { get; set; } = "Faculty of Computing";
    public string Cohort { get; set; } = "BSc (Hons) Software Engineering";
    public string Description { get; set; } = "Comprehensive disaster response coordination system built with .NET 8 Web API, React, and explainable AI triage.";
    public List<TeamMemberDto> TeamMembers { get; set; } = new();
}

public class TeamMemberDto
{
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? Contribution { get; set; }
    public string? StudentId { get; set; }
}

public class AdminUserDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? AssignedDistrict { get; set; }
    public UserRole Role { get; set; }
    public string RoleName => Role.ToString();
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CreateAdminUserDto
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 6)]
    public string Password { get; set; } = string.Empty;

    public string? PhoneNumber { get; set; }
    public string? AssignedDistrict { get; set; }

    [Required]
    public UserRole Role { get; set; } = UserRole.Citizen;
}

public class UpdateAdminUserDto
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public string? PhoneNumber { get; set; }
    public string? AssignedDistrict { get; set; }

    [Required]
    public UserRole Role { get; set; }

    public bool IsActive { get; set; } = true;
}

public class UpdateUserRoleDto
{
    [Required]
    public UserRole Role { get; set; }
}

public class UpdateUserStatusDto
{
    public bool IsActive { get; set; }
}

public class ResetUserPasswordDto
{
    [Required]
    [StringLength(100, MinimumLength = 6)]
    public string NewPassword { get; set; } = string.Empty;
}

public class AdminAuditLogDto
{
    public Guid Id { get; set; }
    public Guid AssistanceRequestId { get; set; }
    public string AISuggestion { get; set; } = string.Empty;
    public decimal ConfidenceScore { get; set; }
    public PriorityLevel SuggestedPriority { get; set; }
    public bool WasOverridden { get; set; }
    public string? HumanDecision { get; set; }
    public string? OverriddenByName { get; set; }
    public string? OverrideReason { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string VerificationHash { get; set; } = string.Empty;
}
