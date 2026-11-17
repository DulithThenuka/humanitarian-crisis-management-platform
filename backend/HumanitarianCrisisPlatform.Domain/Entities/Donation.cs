using HumanitarianCrisisPlatform.Domain.Common;

namespace HumanitarianCrisisPlatform.Domain.Entities;

public class Donation : AuditableEntity
{
    public string DonorName { get; set; } = string.Empty;
    public string? DonorEmail { get; set; }
    public string? DonorPhone { get; set; }
    public int DonationType { get; set; } = 0; // 0 = MonetaryGrant, 1 = InKindSupplies, 2 = LogisticsAsset
    public decimal? Amount { get; set; }
    public string? Currency { get; set; } = "LKR";
    public string? ItemDescription { get; set; }
    public int? ItemQuantity { get; set; }
    public string? Sector { get; set; }
    public string? TargetDistrict { get; set; }
    public string? VerifiedBy { get; set; }
    public string? TaxExemptId { get; set; }
    public string? AuditHash { get; set; }
    public Guid? CrisisEventId { get; set; }
    public CrisisEvent? CrisisEvent { get; set; }
    public int Status { get; set; } = 0; // 0 = PendingAudit, 1 = VerifiedAndCleared, 2 = AllocatedToDepot, 3 = ActiveDeployment
    public DateTime? ReceivedAt { get; set; }
}
