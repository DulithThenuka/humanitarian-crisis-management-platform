namespace HumanitarianCrisisPlatform.Application.DTOs.Resources;

public class StockAlertDto
{
    public string Id { get; set; } = string.Empty;
    public Guid? ResourceId { get; set; }
    public string Item { get; set; } = string.Empty;
    public string Tag { get; set; } = "critical";
    public string Code { get; set; } = string.Empty;
    public string TagType { get; set; } = "critical";
    public string IconType { get; set; } = "droplet";
    public decimal? Available { get; set; }
    public decimal? Requested { get; set; }
    public decimal? Threshold { get; set; }
    public decimal? ExpiringQty { get; set; }
    public int? DaysLeft { get; set; }
    public string RecommendedAction { get; set; } = string.Empty;
}

public class ReorderRequestDto
{
    public Guid ResourceId { get; set; }
    public decimal Quantity { get; set; }
    public string? Urgency { get; set; } = "High";
    public string? TargetDepot { get; set; } = "Central Depot";
    public string? Notes { get; set; }
}
