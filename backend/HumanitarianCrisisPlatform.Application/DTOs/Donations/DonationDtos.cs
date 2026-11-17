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

