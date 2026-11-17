namespace HumanitarianCrisisPlatform.Application.DTOs.Coordinator;

public class ResourceCoordinationDashboardDto
{
    public List<ResourceRequirementDto> Requirements { get; set; } = new();
    public List<ResourceShortageDto> Shortages { get; set; } = new();
    public List<CoordinatorAllocationRequestDto> AllocationRequests { get; set; } = new();
    public List<ResourceRecommendationDto> Recommendations { get; set; } = new();
    public List<ResourceCoordinationHistoryDto> CoordinationHistory { get; set; } = new();
    public ResourceCoordinationMetricsDto Metrics { get; set; } = new();
}

public class ResourceRequirementDto
{
    public string Id { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string ResourceName { get; set; } = string.Empty;
    public decimal RequiredQuantity { get; set; }
    public decimal AllocatedQuantity { get; set; }
    public decimal OutstandingQuantity => Math.Max(0, RequiredQuantity - AllocatedQuantity);
    public string Unit { get; set; } = "Units";
    public string Destination { get; set; } = string.Empty;
    public string Urgency { get; set; } = "High";
    public string RelatedRecord { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending Allocation";
}

public class ResourceShortageDto
{
    public string Id { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string ResourceName { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public decimal RequiredQuantity { get; set; }
    public decimal AvailableQuantity { get; set; }
    public decimal DeficitQuantity { get; set; }
    public string Unit { get; set; } = "Units";
    public string Severity { get; set; } = "Critical";
    public string ImpactSummary { get; set; } = string.Empty;
    public List<string> AffectedRequests { get; set; } = new();
}

public class CoordinatorAllocationRequestDto
{
    public Guid Id { get; set; }
    public string RequestNumber { get; set; } = string.Empty;
    public Guid ResourceId { get; set; }
    public string ResourceName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal RequestedQuantity { get; set; }
    public decimal? ApprovedQuantity { get; set; }
    public string Unit { get; set; } = "Units";
    public string Destination { get; set; } = string.Empty;
    public string Urgency { get; set; } = "High";
    public string Justification { get; set; } = string.Empty;
    public string? RelatedRecord { get; set; }
    public Guid? RelatedAssistanceRequestId { get; set; }
    public string Status { get; set; } = "Submitted";
    public string? ResponseNotes { get; set; }
    public string SubmittedBy { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
}

public class SubmitResourceAllocationRequestDto
{
    public Guid? ResourceId { get; set; }
    public string Category { get; set; } = string.Empty;
    public string? ResourceName { get; set; }
    public decimal RequestedQuantity { get; set; }
    public string Destination { get; set; } = string.Empty;
    public string Urgency { get; set; } = "High";
    public string Justification { get; set; } = string.Empty;
    public string? RelatedRecord { get; set; }
    public Guid? RelatedAssistanceRequestId { get; set; }
}

public class ResourceRecommendationDto
{
    public string Id { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string ResourceName { get; set; } = string.Empty;
    public decimal RecommendedQuantity { get; set; }
    public string Unit { get; set; } = "Units";
    public string Destination { get; set; } = string.Empty;
    public string Urgency { get; set; } = "Critical";
    public string Reason { get; set; } = string.Empty;
    public string RelatedRecord { get; set; } = string.Empty;
    public string RecommendationSource { get; set; } = "Crisis Need Assessment";
}

public class ResourceCoordinationHistoryDto
{
    public string Id { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public string TimeFormatted { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Detail { get; set; } = string.Empty;
    public string Actor { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Type { get; set; } = "request";
}

public class ResourceCoordinationMetricsDto
{
    public int ActiveRequirementsCount { get; set; }
    public int CriticalShortagesCount { get; set; }
    public int PendingRequestsCount { get; set; }
    public int ApprovedRequestsCount { get; set; }
    public decimal TotalUnitsRequested { get; set; }
    public decimal TotalUnitsApproved { get; set; }
}

