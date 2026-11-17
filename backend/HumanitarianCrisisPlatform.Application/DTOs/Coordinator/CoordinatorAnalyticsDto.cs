namespace HumanitarianCrisisPlatform.Application.DTOs.Coordinator;

public class CoordinatorAnalyticsDto
{
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    public string Period { get; set; } = "30d";
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    // 1. KPI Metrics
    public AnalyticsKpiMetricsDto Metrics { get; set; } = new();

    // 2. Incoming Requests Trend over time
    public IReadOnlyList<TrendDataPointDto> RequestsOverTime { get; set; } = Array.Empty<TrendDataPointDto>();

    // 3. Priority Distribution
    public PriorityDistributionDto PriorityDistribution { get; set; } = new();

    // 4. Request Status Distribution
    public IReadOnlyList<CategoryDistributionDto> StatusDistribution { get; set; } = Array.Empty<CategoryDistributionDto>();

    // 5. Requests by Category
    public IReadOnlyList<CategoryDistributionDto> RequestsByCategory { get; set; } = Array.Empty<CategoryDistributionDto>();

    // 6. Operational Progress & Incident Performance
    public IReadOnlyList<OperationalProgressItemDto> OperationalProgress { get; set; } = Array.Empty<OperationalProgressItemDto>();

    // 7. Resource Coordination Performance
    public ResourceAnalyticsSummaryDto ResourceCoordination { get; set; } = new();

    // 8. Shelter Placement Coordination
    public ShelterAnalyticsSummaryDto ShelterCoordination { get; set; } = new();

    // 9. Volunteer Assignment Coordination
    public VolunteerAnalyticsSummaryDto VolunteerCoordination { get; set; } = new();
}

public class AnalyticsKpiMetricsDto
{
    public int IncomingRequestsCount { get; set; }
    public string IncomingRequestsTrend { get; set; } = string.Empty;

    public string AvgInitialReviewTime { get; set; } = "N/A";
    public double? AvgInitialReviewMinutes { get; set; }
    public string AvgInitialReviewTarget { get; set; } = "Target: < 30m";

    public string AvgResolutionTime { get; set; } = "N/A";
    public double? AvgResolutionHours { get; set; }
    public string AvgResolutionTrend { get; set; } = string.Empty;

    public string OpenVsResolvedRatio { get; set; } = "0 / 0";
    public int OpenRequestsCount { get; set; }
    public int ResolvedRequestsCount { get; set; }
    public double ResolutionRatePct { get; set; }

    public string ResourceFulfillmentRatio { get; set; } = "0%";
    public decimal DeliveredQuantity { get; set; }
    public decimal TotalAllocatedQuantity { get; set; }
    public double ResourceFulfillmentPct { get; set; }
}

public class TrendDataPointDto
{
    public string Time { get; set; } = string.Empty;
    public int Count { get; set; }
    public bool IsPeak { get; set; }
}

public class PriorityDistributionDto
{
    public int Total { get; set; }
    public IReadOnlyList<PrioritySliceDto> Slices { get; set; } = Array.Empty<PrioritySliceDto>();
}

public class PrioritySliceDto
{
    public string Name { get; set; } = string.Empty;
    public int Count { get; set; }
    public double Pct { get; set; }
    public string Color { get; set; } = string.Empty;
}

public class CategoryDistributionDto
{
    public string Category { get; set; } = string.Empty;
    public int Count { get; set; }
    public double Pct { get; set; }
}

public class OperationalProgressItemDto
{
    public string Label { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string TypeClass { get; set; } = string.Empty;
}

public class ResourceAnalyticsSummaryDto
{
    public int TotalAllocations { get; set; }
    public int FulfilledCount { get; set; }
    public int DispatchedCount { get; set; }
    public int PendingCount { get; set; }
    public decimal DeliveredQuantity { get; set; }
    public decimal TotalQuantity { get; set; }
    public double FulfillmentRatePct { get; set; }
}

public class ShelterAnalyticsSummaryDto
{
    public int TotalPlacementRequests { get; set; }
    public int ApprovedCount { get; set; }
    public int PendingCount { get; set; }
    public int TotalEvacueesRequested { get; set; }
    public int TotalCapacityAvailable { get; set; }
    public double UtilizationRatePct { get; set; }
}

public class VolunteerAnalyticsSummaryDto
{
    public int TotalAssignmentRequests { get; set; }
    public int AssignedCount { get; set; }
    public int PendingCount { get; set; }
    public int VolunteersRequested { get; set; }
    public int VolunteersAssigned { get; set; }
    public int AvailableVolunteersCount { get; set; }
}

