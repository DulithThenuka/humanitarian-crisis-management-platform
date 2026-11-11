namespace HumanitarianCrisisPlatform.Application.DTOs.Incidents;

public class IncidentDuplicateCandidateDto
{
    public Guid CandidateIncidentId { get; set; }
    public string CandidateCaseNumber { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string OperationalArea { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string PriorityType { get; set; } = string.Empty;
    public string CitizenQuote { get; set; } = string.Empty;
    public decimal SimilarityScore { get; set; }
    public bool IsPotentialDuplicate { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string AuditMandate { get; set; } = string.Empty;
}

public class IncidentHistoryDto
{
    public Guid IncidentId { get; set; }
    public string CaseNumber { get; set; } = string.Empty;
    public List<IncidentStatusHistoryItemDto> StatusHistory { get; set; } = new();
    public List<IncidentAssignmentItemDto> Assignments { get; set; } = new();
    public List<IncidentEscalationItemDto> Escalations { get; set; } = new();
    public List<IncidentAuditLogItemDto> AuditLogs { get; set; } = new();
}

public class IncidentStatusHistoryItemDto
{
    public Guid Id { get; set; }
    public string FromStatus { get; set; } = string.Empty;
    public string ToStatus { get; set; } = string.Empty;
    public string? FromPriority { get; set; }
    public string? ToPriority { get; set; }
    public string ChangedByName { get; set; } = string.Empty;
    public string ChangedByRole { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public DateTime ChangedAt { get; set; }
}

public class IncidentAssignmentItemDto
{
    public Guid Id { get; set; }
    public string AssigneeName { get; set; } = string.Empty;
    public string AssignedByName { get; set; } = string.Empty;
    public string? OperationalArea { get; set; }
    public string Reason { get; set; } = string.Empty;
    public DateTime AssignedAt { get; set; }
    public bool IsActive { get; set; }
}

public class IncidentEscalationItemDto
{
    public Guid Id { get; set; }
    public string EscalatedByName { get; set; } = string.Empty;
    public string EscalatedToRole { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public string PreviousPriority { get; set; } = string.Empty;
    public string NewPriority { get; set; } = string.Empty;
    public DateTime EscalatedAt { get; set; }
    public bool IsResolved { get; set; }
}

public class IncidentAuditLogItemDto
{
    public Guid Id { get; set; }
    public string CaseNumber { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Detail { get; set; } = string.Empty;
    public string ActorName { get; set; } = string.Empty;
    public string ActorRole { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}

public class IncidentReportSummaryDto
{
    public int TotalIncidents { get; set; }
    public int OpenUnresolvedCount { get; set; }
    public int EscalatedCount { get; set; }
    public int VerifiedCount { get; set; }
    public int ResolvedCount { get; set; }
    public int ClosedCount { get; set; }
    public int AIOverridesCount { get; set; }
    public List<ReportBarItemDto> ReportBarsData { get; set; } = new();
    public List<ReportBreakdownItemDto> ReportBreakdown { get; set; } = new();
    public Dictionary<string, int> ByCategory { get; set; } = new();
    public Dictionary<string, int> ByPriority { get; set; } = new();
    public Dictionary<string, int> ByStatus { get; set; } = new();
}

public class ReportBarItemDto
{
    public string Hour { get; set; } = string.Empty;
    public int Height { get; set; }
    public int Count { get; set; }
}

public class ReportBreakdownItemDto
{
    public string Label { get; set; } = string.Empty;
    public int Pct { get; set; }
}

