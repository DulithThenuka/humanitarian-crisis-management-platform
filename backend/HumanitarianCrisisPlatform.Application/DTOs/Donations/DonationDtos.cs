using System.ComponentModel.DataAnnotations;

namespace HumanitarianCrisisPlatform.Application.DTOs.Donations;

public class DonationDto
{
    public Guid Id { get; set; }
    public string TransactionCode { get; set; } = string.Empty;
    public string DonorName { get; set; } = string.Empty;
    public string? DonorEmail { get; set; }
    public string? DonorPhone { get; set; }
    public int DonationType { get; set; }
    public string DonationTypeName { get; set; } = string.Empty;
    public decimal? Amount { get; set; }
    public string Currency { get; set; } = "LKR";
    public string? ItemDescription { get; set; }
    public int? ItemQuantity { get; set; }
    public Guid? CrisisEventId { get; set; }
    public string? CrisisTitle { get; set; }
    public int Status { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public DateTime? ReceivedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CreateDonationDto
{
    [Required(ErrorMessage = "Donor or organisation name is required.")]
    [StringLength(200, MinimumLength = 2, ErrorMessage = "Donor name must be between 2 and 200 characters.")]
    public string DonorName { get; set; } = string.Empty;

    [EmailAddress(ErrorMessage = "Invalid email address format.")]
    [StringLength(256)]
    public string? DonorEmail { get; set; }

    [StringLength(20)]
    public string? DonorPhone { get; set; }

    /// <summary>
    /// 0 = Monetary, 1 = Material
    /// </summary>
    [Range(0, 1, ErrorMessage = "DonationType must be 0 (Monetary) or 1 (Material).")]
    public int DonationType { get; set; } = 0;

    [Range(0.01, 1_000_000_000, ErrorMessage = "Amount must be greater than zero.")]
    public decimal? Amount { get; set; }

    [StringLength(10)]
    public string? Currency { get; set; } = "LKR";

    public string? ItemDescription { get; set; }

    [Range(1, 1_000_000, ErrorMessage = "Item quantity must be at least 1.")]
    public int? ItemQuantity { get; set; }

    /// <summary>
    /// Optional relief package code (e.g., PKG-01..PKG-04) selected from the portal.
    /// </summary>
    public string? PackageId { get; set; }

    public Guid? CrisisEventId { get; set; }
}

public class UpdateDonationStatusDto
{
    /// <summary>
    /// 0 = Pledged, 1 = Received, 2 = Distributed
    /// </summary>
    [Range(0, 2, ErrorMessage = "Status must be 0 (Pledged), 1 (Received), or 2 (Distributed).")]
    public int Status { get; set; }
}

public class DonationSummaryDto
{
    public decimal TotalFundsRaised { get; set; }
    public decimal Recent48HoursAmount { get; set; }
    public int TotalDonationsCount { get; set; }
    public int ReliefPacksDistributed { get; set; }
    public int ActiveDonorsCount { get; set; }
    public int ActiveCentersCount { get; set; }
    public double UtilizationRatio { get; set; }
    public int ItemsReceivedCount { get; set; }
    public int ItemsDistributedCount { get; set; }
    public int PendingAllocationCount { get; set; }
    public int PledgedCount { get; set; }
    public int ReceivedCount { get; set; }
    public int DistributedCount { get; set; }
}

public class ReliefPackageDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Target { get; set; } = string.Empty;
    public decimal CostAmount { get; set; }
    public string CostFormatted { get; set; } = string.Empty;
    public string Impact { get; set; } = string.Empty;
    public int Funded { get; set; }
    public int Goal { get; set; }
    public string Badge { get; set; } = string.Empty;
}

public class DonationReceiptDto
{
    public string ReceiptNumber { get; set; } = string.Empty;
    public string TransactionCode { get; set; } = string.Empty;
    public Guid DonationId { get; set; }
    public string DonorName { get; set; } = string.Empty;
    public string? DonorEmail { get; set; }
    public string DonationTypeName { get; set; } = string.Empty;
    public decimal? Amount { get; set; }
    public string Currency { get; set; } = "LKR";
    public string? ItemDescription { get; set; }
    public int? ItemQuantity { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public string? CrisisTitle { get; set; }
    public DateTime IssuedAt { get; set; }
    public DateTime? ReceivedAt { get; set; }
    public string VerificationCode { get; set; } = string.Empty;
}

// =========================================================================
// Donor & Funding Officer Portal DTOs
// =========================================================================

public class DonorRecordDto
{
    public string Id { get; set; } = string.Empty;
    public string Source { get; set; } = string.Empty;
    public string DonorOrg { get; set; } = string.Empty;
    public string ContactPerson { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Type { get; set; } = "Monetary"; // Monetary or Material
    public string RecordedValue { get; set; } = string.Empty;
    public decimal RawValue { get; set; }
    public string Currency { get; set; } = "LKR";
    public string Verification { get; set; } = "Pending"; // Verified, Pending
    public string Allocation { get; set; } = "Unallocated";
    public string AllocationTarget { get; set; } = string.Empty;
    public string Status { get; set; } = "Review"; // Allocated, Review, Completed, Dispatched
    public string StatusColor { get; set; } = "#3d6b4f";
    public string StatusBg { get; set; } = "#edf2e6";
    public string StatusBorder { get; set; } = "#dfe5d8";
    public string OperationalArea { get; set; } = "Western Province";
    public string Notes { get; set; } = string.Empty;
    public string VerifiedAt { get; set; } = string.Empty;
    public string VerifiedBy { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string ComplianceDoc { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class CreateDonorRecordDto
{
    [Required]
    public string DonorOrg { get; set; } = string.Empty;
    public string Source { get; set; } = "Direct Contribution";
    public string ContactPerson { get; set; } = string.Empty;
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Type { get; set; } = "Monetary";
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "LKR";
    public string Category { get; set; } = "General Relief";
    public string OperationalArea { get; set; } = "Western Province";
    public string Notes { get; set; } = string.Empty;
    public string AllocationTarget { get; set; } = "Unallocated";
}

public class UpdateDonorRecordDto
{
    public string? DonorOrg { get; set; }
    public string? ContactPerson { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public decimal? Amount { get; set; }
    public string? Category { get; set; }
    public string? OperationalArea { get; set; }
    public string? Notes { get; set; }
    public string? AllocationTarget { get; set; }
    public string? Status { get; set; }
}

public class DonorDecisionDto
{
    [Required]
    public string Action { get; set; } = "submit-approval"; // "submit-approval", "request-clarification", "escalate"
    public string DecisionReason { get; set; } = string.Empty;
    public string? Note { get; set; }
}

public class FundingCampaignDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public decimal TargetAmount { get; set; }
    public decimal RaisedAmount { get; set; }
    public int PercentFunded { get; set; }
    public string Status { get; set; } = "Active"; // Active, Completed, Paused
    public string OperationalArea { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string TargetDescription { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}

public class CreateFundingCampaignDto
{
    [Required]
    public string Title { get; set; } = string.Empty;
    [Range(1000, 1000000000)]
    public decimal TargetAmount { get; set; }
    public string OperationalArea { get; set; } = "Western Province";
    public string Category { get; set; } = "Emergency Relief";
    public string TargetDescription { get; set; } = string.Empty;
    public int DurationDays { get; set; } = 30;
}

public class FundingAllocationDto
{
    public string Id { get; set; } = string.Empty;
    public string AllocationCode { get; set; } = string.Empty;
    public string TargetHubOrDepot { get; set; } = string.Empty;
    public string Purpose { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "LKR";
    public string Status { get; set; } = "Pending Dual Approval"; // Pending Dual Approval, Approved, Dispatched
    public bool RequiresDualApproval { get; set; } = true;
    public string CoSignedBy { get; set; } = string.Empty;
    public string CoSignedAt { get; set; } = string.Empty;
    public string AuthorizedNote { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class ApproveFundingAllocationDto
{
    [Required]
    public string AuthorizedNote { get; set; } = string.Empty;
    public string? SecondarySignature { get; set; }
}

public class SuspiciousFlagDto
{
    public string Id { get; set; } = string.Empty;
    public string RecordId { get; set; } = string.Empty;
    public string DonorOrg { get; set; } = string.Empty;
    public string AnomalyReason { get; set; } = string.Empty;
    public string Severity { get; set; } = "warning"; // urgent, warning, info
    public int RiskScore { get; set; }
    public string Status { get; set; } = "Review"; // Review, Cleared, Escalated
    public string Details { get; set; } = string.Empty;
    public DateTime DetectedAt { get; set; } = DateTime.UtcNow;
    public string? ResolvedBy { get; set; }
    public DateTime? ResolvedAt { get; set; }
}

public class ResolveSuspiciousFlagDto
{
    [Required]
    public string Action { get; set; } = "clear"; // clear, dismiss, escalate
    public string ResolutionNotes { get; set; } = string.Empty;
}

public class FundingOfficerDashboardDto
{
    public FundingOfficerMetricDto RegisteredDonors { get; set; } = new();
    public FundingOfficerMetricDto MonetaryRecords { get; set; } = new();
    public FundingOfficerMetricDto MaterialDonations { get; set; } = new();
    public FundingOfficerMetricDto ActiveCampaigns { get; set; } = new();
    public FundingOfficerMetricDto PendingVerification { get; set; } = new();
    public FundingOfficerMetricDto AllocatedBalance { get; set; } = new();
    public List<PriorityAttentionItemDto> PriorityAttentionItems { get; set; } = new();
    public List<ConnectedWorkflowStepDto> ConnectedWorkflowSteps { get; set; } = new();
    public List<RecentActivityItemDto> RecentActivity { get; set; } = new();
}

public class FundingOfficerMetricDto
{
    public object Value { get; set; } = 0;
    public decimal? Raw { get; set; }
    public string Label { get; set; } = string.Empty;
    public string Subtext { get; set; } = string.Empty;
    public string Trend { get; set; } = string.Empty;
    public bool TrendUp { get; set; } = true;
}

public class PriorityAttentionItemDto
{
    public string Id { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string TagColor { get; set; } = string.Empty;
    public string BadgeText { get; set; } = string.Empty;
    public string RelatedTab { get; set; } = string.Empty;
    public string Timestamp { get; set; } = string.Empty;
    public string Details { get; set; } = string.Empty;
}

public class ConnectedWorkflowStepDto
{
    public int Step { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // completed, in-progress, upcoming
    public string NodeType { get; set; } = string.Empty;
    public string ActionLink { get; set; } = string.Empty;
}

public class RecentActivityItemDto
{
    public string Id { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string RecordId { get; set; } = string.Empty;
    public string Source { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Officer { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Amount { get; set; } = string.Empty;
}

public class FundingReportsSummaryDto
{
    public decimal TotalMonetaryInflow { get; set; }
    public decimal TotalMonetaryAllocated { get; set; }
    public decimal NetAvailableReserve { get; set; }
    public int TotalMaterialUnitsInflow { get; set; }
    public int TotalMaterialUnitsDistributed { get; set; }
    public int MaterialUnitsInReserve { get; set; }
    public List<ReportBreakdownItemDto> SectorBreakdowns { get; set; } = new();
    public List<ReportBreakdownItemDto> DistrictBreakdowns { get; set; } = new();
    public List<ReportTimelinePointDto> TimelineTrend { get; set; } = new();
}

public class ReportBreakdownItemDto
{
    public string Category { get; set; } = string.Empty;
    public decimal MonetaryAmount { get; set; }
    public int MaterialUnits { get; set; }
    public int RecordCount { get; set; }
    public double Percentage { get; set; }
}

public class ReportTimelinePointDto
{
    public string Label { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public int Units { get; set; }
}

