namespace HumanitarianCrisisPlatform.Application.DTOs.Resources;

public class ResourceDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public decimal TotalQuantity { get; set; }
    public decimal AllocatedQuantity { get; set; }
    public decimal AvailableQuantity => TotalQuantity - AllocatedQuantity;
    public decimal MinimumThreshold { get; set; }
    public bool IsBelowThreshold => AvailableQuantity <= MinimumThreshold;
    public string? WarehouseLocation { get; set; }
    public string StorageLocation => WarehouseLocation ?? "Central Depot";
    public DateTime? ExpiryDate { get; set; }
    public string StockStatus => AvailableQuantity <= 0 ? "Shortage" : (AvailableQuantity <= MinimumThreshold ? "Low stock" : "Available");
    public string StatusBadge => AvailableQuantity <= 0 ? "shortage" : (AvailableQuantity <= MinimumThreshold ? "warning" : "available");
    public string LastUpdated { get; set; } = "Recently";
    public DateTime? UpdatedAt { get; set; }
}
