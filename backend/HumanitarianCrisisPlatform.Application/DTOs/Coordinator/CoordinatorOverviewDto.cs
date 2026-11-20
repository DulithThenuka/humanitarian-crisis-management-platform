namespace HumanitarianCrisisPlatform.Application.DTOs.Coordinator;

public class CoordinatorOverviewDto
{
    public CoordinatorMetricsDto Metrics { get; set; } = new();
    public IReadOnlyList<PriorityRequestSummaryDto> PriorityCases { get; set; } = Array.Empty<PriorityRequestSummaryDto>();
    public IReadOnlyList<CoordinatorActivityDto> RecentActivity { get; set; } = Array.Empty<CoordinatorActivityDto>();
}

public class CoordinatorMetricsDto
{
    public int TotalIncomingRequests { get; set; }
    public int PendingReviews { get; set; }
    public int CriticalRequests { get; set; }
    public int NeedInformation { get; set; }
    public int ActiveIncidents { get; set; }
    public int ActiveCrisisEvents { get; set; }
    public int TotalShelterCapacity { get; set; }
    public int CurrentShelterOccupancy { get; set; }
    public double ShelterUtilizationRate { get; set; }
    public int AvailableVolunteers { get; set; }
    public int LowStockResources { get; set; }
}

public class PriorityRequestSummaryDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Severity { get; set; } = "High";
    public string Status { get; set; } = "Pending Review";
    public string VerificationStatus { get; set; } = "Awaiting review";
    public string Location { get; set; } = string.Empty;
    public string CallerName { get; set; } = string.Empty;
    public string? CallerPhone { get; set; }
    public string SubmittedAt { get; set; } = string.Empty;
    public string AssignedTo { get; set; } = "Emergency Coordinator";
    public string OperationalArea { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int AffectedPeople { get; set; } = 1;
    public decimal? Lat { get; set; }
    public decimal? Lon { get; set; }
    public string? AttachmentUrl { get; set; }
    public int AttachmentsCount { get; set; }
    public decimal? AIConfidence { get; set; }
    public decimal? AIPriorityScore { get; set; }
    public IReadOnlyList<RequestChecklistItemDto> Checklist { get; set; } = Array.Empty<RequestChecklistItemDto>();
    public IReadOnlyList<CoordinatorNoteDto> Notes { get; set; } = Array.Empty<CoordinatorNoteDto>();
    public IReadOnlyList<RequestHistoryItemDto> History { get; set; } = Array.Empty<RequestHistoryItemDto>();
    public IReadOnlyList<RequestCommunicationDto> Communications { get; set; } = Array.Empty<RequestCommunicationDto>();
}

public class RequestHistoryItemDto
{
    public string Time { get; set; } = string.Empty;
    public string Event { get; set; } = string.Empty;
    public string Actor { get; set; } = string.Empty;
}

public class RequestCommunicationDto
{
    public Guid Id { get; set; }
    public string Time { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Recipient { get; set; } = "Citizen / Requestor";
    public string SenderName { get; set; } = string.Empty;
    public string SenderRole { get; set; } = string.Empty;
    public bool IsInternal { get; set; } = false;
    public bool IsVisibleToCitizen { get; set; } = true;
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
}

public class RequestChecklistItemDto
{
    public string Id { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public bool Checked { get; set; }
}

public class CoordinatorNoteDto
{
    public string Id { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
}

public class CoordinatorActivityDto
{
    public string Id { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Detail { get; set; } = string.Empty;
    public string Type { get; set; } = "general";
}
