namespace HumanitarianCrisisPlatform.Application.DTOs.Shelters;

public class ShelterDashboardDto
{
    public ShelterDashboardMetricsDto Metrics { get; set; } = new();
    public List<PriorityAttentionItemDto> PriorityItems { get; set; } = new();
    public List<ShelterWorkflowStepDto> WorkflowSteps { get; set; } = new();
    public List<ShelterActivityLogDto> RecentActivity { get; set; } = new();
}

public class ShelterDashboardMetricsDto
{
    public int RegisteredShelters { get; set; }
    public int OperationalShelters { get; set; }
    public int CurrentOccupancy { get; set; }
    public int AcrossSites { get; set; }
    public int RemainingCapacity { get; set; }
    public int NearCapacityCount { get; set; }
    public int SupplyShortages { get; set; }
    public int CriticalShortages { get; set; }
    public int AdmissionsToday { get; set; }
    public int TransfersToday { get; set; }
}

public class PriorityAttentionItemDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string Badge { get; set; } = "info"; // critical, warning, info
    public string BadgeText { get; set; } = "info";
    public string? TargetShelterId { get; set; }
    public string Category { get; set; } = "General"; // Placement, Capacity, Supply, General
}

public class ShelterWorkflowStepDto
{
    public int Step { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "pending"; // completed, active, pending
}

public class ShelterActivityLogDto
{
    public string Id { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string? ShelterId { get; set; }
}

