namespace HumanitarianCrisisPlatform.Application.DTOs.Resources;

public class ResourceDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public decimal TotalQuantity { get; set; }
    public decimal AllocatedQuantity { get; set; }
    public decimal AvailableQuantity => TotalQuantity - AllocatedQuantity;
    public decimal MinimumThreshold { get; set; }
    public bool IsBelowThreshold => AvailableQuantity <= MinimumThreshold;
    public string? WarehouseLocation { get; set; }
}
