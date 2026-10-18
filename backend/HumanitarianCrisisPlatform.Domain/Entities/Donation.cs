using HumanitarianCrisisPlatform.Domain.Common;

namespace HumanitarianCrisisPlatform.Domain.Entities;

public class Donation : AuditableEntity
{
    public string DonorName { get; set; } = string.Empty;
    public string? DonorEmail { get; set; }
    public string? DonorPhone { get; set; }
    public int DonationType { get; set; } = 0;
    public decimal? Amount { get; set; }
    public string? Currency { get; set; } = "USD";
    public string? ItemDescription { get; set; }
    public int? ItemQuantity { get; set; }
    public Guid? CrisisEventId { get; set; }
    public CrisisEvent? CrisisEvent { get; set; }
    public int Status { get; set; } = 0;
    public DateTime? ReceivedAt { get; set; }
}
