namespace HumanitarianCrisisPlatform.Application.DTOs.Resources;

public class ResourceOverviewDto
{
    public int TotalResources { get; set; }
    public int TotalCategories { get; set; }
    public decimal TotalStockQuantity { get; set; }
    public decimal AvailableStock { get; set; }
    public decimal AllocatedStock { get; set; }
    public string AvailablePercentage { get; set; } = "0%";
    public int LowStockWarnings { get; set; }
    public int CriticalShortages { get; set; }
    public int PendingAllocations { get; set; }
    public int HighPriorityPending { get; set; }
    public int ApprovedAllocations { get; set; }
    public decimal ApprovedUnits { get; set; }
    public int DispatchedCount { get; set; }
    public int DeliveredCount { get; set; }
    public int ExpiringSoonCount { get; set; }
    public List<CategoryStockDto> Categories { get; set; } = new();
    public List<ActivityLogItemDto> RecentActivity { get; set; } = new();
}

public class CategoryStockDto
{
    public string Category { get; set; } = string.Empty;
    public int ItemCount { get; set; }
    public decimal AvailableCount { get; set; }
    public decimal TotalCount { get; set; }
    public int Percent { get; set; }
}
