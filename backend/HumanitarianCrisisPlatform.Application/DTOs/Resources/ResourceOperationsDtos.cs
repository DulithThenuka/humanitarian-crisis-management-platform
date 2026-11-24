namespace HumanitarianCrisisPlatform.Application.DTOs.Resources;

public class CreateResourceDto
{
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = "Water";
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = "units";
    public string? StorageLocation { get; set; } = "Central Depot";
    public decimal MinimumThreshold { get; set; } = 100;
    public DateTime? ExpiryDate { get; set; }
    public string? Notes { get; set; }
}

public class UpdateResourceDto
{
    public string? Name { get; set; }
    public string? Category { get; set; }
    public decimal? TotalQuantity { get; set; }
    public string? Unit { get; set; }
    public string? StorageLocation { get; set; }
    public decimal? MinimumThreshold { get; set; }
    public DateTime? ExpiryDate { get; set; }
}

public class StockAdjustmentDto
{
    public decimal QuantityDelta { get; set; }
    public decimal? NewQuantity { get; set; }
    public string Reason { get; set; } = "Stock adjustment";
    public string? Notes { get; set; }
}

public class UpdateStockQuantityDto
{
    public decimal Quantity { get; set; }
    public string Reason { get; set; } = "Stock quantity update";
    public string? Notes { get; set; }
}
