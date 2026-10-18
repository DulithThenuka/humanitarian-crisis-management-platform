using HumanitarianCrisisPlatform.Domain.Common;

namespace HumanitarianCrisisPlatform.Domain.Entities;

public class Resource : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public decimal TotalQuantity { get; set; }
    public decimal AllocatedQuantity { get; set; } = 0;
    public decimal MinimumThreshold { get; set; } = 0;
    public string? WarehouseLocation { get; set; }
    public DateTime? ExpiryDate { get; set; }

    public decimal AvailableQuantity => TotalQuantity - AllocatedQuantity;
    public bool IsBelowThreshold => AvailableQuantity <= MinimumThreshold;

    public ICollection<ResourceAllocation> Allocations { get; set; } = new List<ResourceAllocation>();
}
