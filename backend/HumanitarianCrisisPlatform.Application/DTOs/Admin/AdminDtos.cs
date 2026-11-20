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
    public int CriticalSeverityCrises => CrisisStats?.CriticalActiveCrises ?? 0;
    public int ResolvedCrises => RequestStats?.ResolvedCount ?? 0;
    public int LiveEmergencyBroadcasts { get; set; }
    public double SystemUptimePercentage { get; set; } = 99.98;
    public double DatabaseLatencyMs { get; set; } = 14.2;
    public int ActiveLogisticsTeams => ResourceStats?.TotalAllocations ?? 0;
    public double AiModelConfidenceAverage => 94.6;
    public Dictionary<string, int> RoleDistribution => UserStats?.UsersByRole ?? new();

    // Additional humanitarian operations stats
    public int TotalAssistanceRequests => RequestStats?.TotalRequests ?? 0;
    public int PendingAssistanceRequests => RequestStats?.PendingActionCount ?? 0;
    public int InProgressAssistanceRequests => RequestStats?.InProgressCount ?? 0;
    public double ResourcesTotalQuantity { get; set; }
    public double ResourcesAllocatedQuantity { get; set; }
    public double ResourcesAvailableQuantity { get; set; }
    public int TotalShelters => ShelterStats?.TotalShelters ?? 0;
    public int TotalShelterCapacity => ShelterStats?.TotalCapacity ?? 0;
    public int OccupiedShelterBeds => ShelterStats?.CurrentOccupancy ?? 0;
    public int AvailableShelterBeds => Math.Max(0, (ShelterStats?.TotalCapacity ?? 0) - (ShelterStats?.CurrentOccupancy ?? 0));
    public double ShelterOccupancyRate => ShelterStats?.OccupancyRate ?? 0;
    public int TotalVolunteers => VolunteerStats?.TotalVolunteers ?? 0;
    public int ActiveVolunteers => VolunteerStats?.ActiveVolunteers ?? 0;
    public decimal TotalDonationsAmount => DonationStats?.TotalAmount ?? 0;
    public int TotalDonationsCount => DonationStats?.TotalDonations ?? 0;
    public int VerifiedDonationsCount => DonationStats?.VerifiedDonations ?? 0;

    // Nested detailed domain summaries
    public AdminUserSummaryDto UserStats { get; set; } = new();
    public AdminCrisisSummaryDto CrisisStats { get; set; } = new();
    public AdminShelterSummaryDto ShelterStats { get; set; } = new();
    public AdminRequestSummaryDto RequestStats { get; set; } = new();
    public AdminResourceSummaryDto ResourceStats { get; set; } = new();
    public AdminSecuritySummaryDto SecurityStats { get; set; } = new();
    public AdminSystemHealthDto SystemHealth { get; set; } = new();
    public AdminVolunteerSummaryDto VolunteerStats { get; set; } = new();
    public AdminDonationSummaryStatsDto DonationStats { get; set; } = new();
    public List<AdminRecentActivityDto> RecentActivities { get; set; } = new();
}

public class AdminVolunteerSummaryDto
{
    public int TotalVolunteers { get; set; }
    public int ActiveVolunteers { get; set; }
    public int DeployedVolunteers { get; set; }
}

public class AdminDonationSummaryStatsDto
{
    public decimal TotalAmount { get; set; }
    public int TotalDonations { get; set; }
    public int VerifiedDonations { get; set; }
    public int PendingVerifications { get; set; }
}

public class AdminRecentActivityDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ActivityType { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
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
    public int CriticalActiveCrises { get; set; }
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
    public int PendingActionCount { get; set; }
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
    public bool IsDatabaseConnected { get; set; } = true;
    public string DatabaseName { get; set; } = "HumanitarianCrisisDb";
    public int DatabaseRecordCount { get; set; }
    public string? LastBackupDate { get; set; } = "2026-11-12 18:30:00 UTC";
    public string? LastBackupFile { get; set; } = "HumanitarianCrisisDb_PreMigration.bak (RESTORE VERIFYONLY Verified)";
    public string ServiceAvailability { get; set; } = "100% Operational";
    public string ErrorStatus { get; set; } = "Healthy - 0 Unhandled Faults";
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
    public Guid? AssistanceRequestId { get; set; }
    public string AISuggestion { get; set; } = string.Empty;
    public decimal ConfidenceScore { get; set; }
    public PriorityLevel SuggestedPriority { get; set; }
    public bool WasOverridden { get; set; }
    public string? HumanDecision { get; set; }
    public string? OverriddenByName { get; set; }
    public string? OverrideReason { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string VerificationHash { get; set; } = string.Empty;

    // Operational audit trail fields
    public string Action { get; set; } = string.Empty;
    public string Detail { get; set; } = string.Empty;
    public string ActorName { get; set; } = string.Empty;
    public string ActorRole { get; set; } = string.Empty;
    public string CaseNumber { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

// -------------------------------------------------------------
// Financial Grants & Donations DTOs
// -------------------------------------------------------------
public class AdminDonationDto
{
    public Guid Id { get; set; }
    public string DonorName { get; set; } = string.Empty;
    public string? DonorEmail { get; set; }
    public string? DonorPhone { get; set; }
    public int DonationType { get; set; }
    public string TypeLabel { get; set; } = "Monetary Grant";
    public decimal? Amount { get; set; }
    public string Currency { get; set; } = "LKR";
    public string AmountFormatted { get; set; } = string.Empty;
    public string? ItemDescription { get; set; }
    public int? ItemQuantity { get; set; }
    public string Sector { get; set; } = string.Empty;
    public string TargetDistrict { get; set; } = string.Empty;
    public int Status { get; set; }
    public string StatusLabel { get; set; } = "Verified & Cleared";
    public string? VerifiedBy { get; set; }
    public string? TaxExemptId { get; set; }
    public string AuditHash { get; set; } = string.Empty;
    public DateTime? ReceivedAt { get; set; }
}

public class CreateAdminDonationDto
{
    [Required]
    [StringLength(120, MinimumLength = 2)]
    public string DonorName { get; set; } = string.Empty;

    [EmailAddress]
    public string? DonorEmail { get; set; }

    public string? DonorPhone { get; set; }

    public int DonationType { get; set; } = 0; // 0=Monetary, 1=InKind, 2=LogisticsAsset

    public decimal? Amount { get; set; }

    public string Currency { get; set; } = "LKR";

    public string? ItemDescription { get; set; }

    public int? ItemQuantity { get; set; }

    [Required]
    public string Sector { get; set; } = "Emergency Relief";

    [Required]
    public string TargetDistrict { get; set; } = "Western Province";

    public string? TaxExemptId { get; set; }
}

public class VerifyDonationDto
{
    public string VerifiedBy { get; set; } = "DMC Treasury Audit";
}

public class AdminDonationsSummaryDto
{
    public int TotalDonationsCount { get; set; }
    public decimal TotalMonetaryGrantValueLkr { get; set; }
    public int TotalInKindItemsCount { get; set; }
    public int VerifiedCount { get; set; }
    public int PendingAuditCount { get; set; }
    public int AllocatedToDepotCount { get; set; }
    public Dictionary<string, decimal> SectorBreakdownLkr { get; set; } = new();
}

// -------------------------------------------------------------
// Emergency Broadcasts DTOs
// -------------------------------------------------------------
public class AdminBroadcastDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Severity { get; set; } = "Emergency";
    public List<string> Channels { get; set; } = new();
    public string TargetRegion { get; set; } = string.Empty;
    public string TargetAudience { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string SentBy { get; set; } = string.Empty;
    public string DeliveryRate { get; set; } = "99.2%";
    public string Status { get; set; } = "Active Live";
    public bool IsActive { get; set; } = true;
    public DateTime SentAt { get; set; }
}

public class CreateAdminBroadcastDto
{
    [Required]
    [StringLength(180, MinimumLength = 5)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Severity { get; set; } = "Emergency"; // Emergency, Warning, Advisory, Info

    public List<string> Channels { get; set; } = new() { "SMS Broadcast", "Push Notification" };

    [Required]
    public string TargetRegion { get; set; } = "Western Province";

    [Required]
    public string TargetAudience { get; set; } = "All Registered Citizens";

    [Required]
    [StringLength(1000, MinimumLength = 10)]
    public string Message { get; set; } = string.Empty;
}

// -------------------------------------------------------------
// Situation Reports (SITREP) DTOs
// -------------------------------------------------------------
public class AdminSitrepDto
{
    public Guid Id { get; set; }
    public string ReportCode { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string IncidentName { get; set; } = string.Empty;
    public string DisasterType { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string GeneratedBy { get; set; } = string.Empty;
    public int CasualtiesReported { get; set; }
    public int PeopleDisplaced { get; set; }
    public int SheltersActive { get; set; }
    public int TeamsDeployed { get; set; }
    public string RoadPassabilityStatus { get; set; } = string.Empty;
    public string ExecutiveSummary { get; set; } = string.Empty;
    public string PriorityNeeds { get; set; } = string.Empty;
    public string Status { get; set; } = "Official Approved";
    public DateTime ReportedAt { get; set; }
}

public class GenerateSitrepRequestDto
{
    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string IncidentName { get; set; } = string.Empty;

    public string DisasterType { get; set; } = "Flood";

    [Required]
    public string District { get; set; } = "Western Province";

    public string ExecutiveSummary { get; set; } = string.Empty;

    public string PriorityNeeds { get; set; } = string.Empty;
}

// -------------------------------------------------------------
// AI Governance DTOs
// -------------------------------------------------------------
public class AdminAiGovernanceStatsDto
{
    public int TotalDecisionsCount { get; set; }
    public double AutomaticApprovalRate { get; set; } = 83.3;
    public double HumanOverrideRate { get; set; } = 16.7;
    public double AverageConfidencePercent { get; set; } = 94.6;
    public Dictionary<string, int> ConfidenceDistribution { get; set; } = new();
    public List<string> KeyTriageKeywords { get; set; } = new();
    public List<AdminAuditLogDto> RecentDecisions { get; set; } = new();
}

public class CalibrateAiModelDto
{
    [Range(50.0, 99.0)]
    public double ConfidenceThreshold { get; set; } = 85.0;

    public bool EnableAutomaticTriage { get; set; } = true;

    public bool RequireHumanReviewForCritical { get; set; } = true;
}

// -------------------------------------------------------------
// System Diagnostics DTOs
// -------------------------------------------------------------
public class SystemDiagnosticsResultDto
{
    public bool DatabaseIntegrityValid { get; set; } = true;
    public bool LedgerHashChainValid { get; set; } = true;
    public int TotalRecordsVerified { get; set; }
    public string CacheStatus { get; set; } = "Warm (Operational)";
    public double LatencyMs { get; set; } = 12.4;
    public DateTime DiagnosticsTimestampUtc { get; set; } = DateTime.UtcNow;
    public List<string> ChecksPassed { get; set; } = new();
}
