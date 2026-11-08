using System.ComponentModel.DataAnnotations;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Application.DTOs.Admin;

public class AdminDashboardStatsDto
{
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

public class AdminUserDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
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
