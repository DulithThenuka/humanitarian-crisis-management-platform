using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Application.DTOs.AI;

public class AIProviderStatusDto
{
    public bool IsConnected { get; set; }
    public string Provider { get; set; } = "OpenAI";
    public string Model { get; set; } = "gpt-4o-mini";
    public string Status { get; set; } = "CONFIG_REQUIRED"; // ONLINE | CONFIG_REQUIRED | OFFLINE | ERROR
    public string Message { get; set; } = string.Empty;
    public DateTime CheckedAt { get; set; } = DateTime.UtcNow;
}

public class AIOperationsOverviewDto
{
    public int PendingRecommendationsCount { get; set; }
    public int CriticalPendingCount { get; set; }
    public int AwaitingApprovalCount { get; set; }
    public int? OldestPendingMinutes { get; set; }
    public int? AverageConfidencePercent { get; set; }
    public int HumanOverrideRatePercent { get; set; }
    public int ServicesOnlineCount { get; set; }
    public AIProviderStatusDto ProviderStatus { get; set; } = new();
    public List<AIServiceStatusDto> Services { get; set; } = new();
}

public class AIServiceStatusDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Desc { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public string Status { get; set; } = "CONFIG_REQUIRED"; // ONLINE | CONFIG_REQUIRED | ATTENTION | OFFLINE
    public string StatusType { get; set; } = "attention"; // online | attention | offline
    public string Stat { get; set; } = string.Empty;
    public int LatencyMs { get; set; }
    public string Accuracy { get; set; } = "N/A";
    public int ConfidenceThreshold { get; set; } = 80;
}

public class AIDecisionQueueItemDto
{
    public string DecisionId { get; set; } = string.Empty;
    public Guid IncidentId { get; set; }
    public string RelatedRecord { get; set; } = string.Empty; // e.g. "HMR-1042"
    public string Category { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Service { get; set; } = "Urgency & Priority";
    public string Recommendation { get; set; } = string.Empty;
    public int? Confidence { get; set; }
    public string Priority { get; set; } = "Medium";
    public string PriorityType { get; set; } = "medium"; // critical | high | medium | low
    public string ReviewStatus { get; set; } = "Pending approval";
    public string StatusType { get; set; } = "pending"; // pending | approved | review | deferred
    public string Submitted { get; set; } = "Just now";
    public DateTime SubmittedAt { get; set; }
    public int AffectedCount { get; set; } = 1;
    public int UrgencyScore { get; set; } = 50;
    public string RiskFlag { get; set; } = "None";
    public string RiskFlagType { get; set; } = "none"; // alert | none
    public string Caller { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public List<double> Coordinates { get; set; } = new();
    public List<string> SelectedResources { get; set; } = new();
    public string? HumanDecision { get; set; }
    public string? DecisionReason { get; set; }
}

public class AIDecisionCaseDetailDto
{
    public string DecisionId { get; set; } = string.Empty;
    public Guid IncidentId { get; set; }
    public string RelatedRecord { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string CurrentPriority { get; set; } = string.Empty;
    public string RecommendedPriority { get; set; } = string.Empty;
    public int UrgencyScore { get; set; }
    public int? Confidence { get; set; }
    public decimal? ConfidenceScore { get; set; }
    public string Reasoning { get; set; } = string.Empty;
    public List<string> RecommendedNextActions { get; set; } = new();
    public string Caller { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public int AffectedCount { get; set; } = 1;
    public string OperationalArea { get; set; } = string.Empty;
    public DateTime GeneratedAt { get; set; }
    public string? DuplicateSuggestionCaseNumber { get; set; }
    public decimal? DuplicateSimilarityScore { get; set; }
    public string ReviewStatus { get; set; } = "Pending approval";
    public bool IsReviewedByHuman { get; set; }
    public string? HumanDecision { get; set; }
    public string? DecisionReason { get; set; }
    public string? ReviewedByName { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public bool IsRuleBased { get; set; } = true;
    public string ProviderLabel { get; set; } = string.Empty;
    public List<AIReviewFactorDetailDto> Factors { get; set; } = new();
}

public class AIReviewFactorDetailDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Desc { get; set; } = string.Empty;
    public string Tag { get; set; } = string.Empty;
    public string TagType { get; set; } = string.Empty;
}

public class RecordAIDecisionInputDto
{
    public string CaseId { get; set; } = string.Empty; // e.g. "AID-2051" or "HMR-1042"
    public string Decision { get; set; } = "Approve"; // Approve | Modify | Reject | Defer
    public string Reason { get; set; } = string.Empty;
    public string? OverriddenPriority { get; set; } // Critical | High | Medium | Low
}

public class DecisionTraceDetailDto
{
    public string CaseId { get; set; } = string.Empty;
    public string CaseNumber { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Caller { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public int AffectedCount { get; set; } = 1;
    public DateTime CreatedAt { get; set; }
    public string? HumanDecision { get; set; }
    public string? DecisionReason { get; set; }
    public string? ReviewedBy { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public List<DecisionAuditEntryDto> AuditTrail { get; set; } = new();
    public List<StatusTransitionEntryDto> StatusTransitions { get; set; } = new();
    public List<SupervisorNoteDto> SupervisorNotes { get; set; } = new();
}

public class DecisionAuditEntryDto
{
    public Guid Id { get; set; }
    public string Action { get; set; } = string.Empty;
    public string Detail { get; set; } = string.Empty;
    public string ActorName { get; set; } = string.Empty;
    public string ActorRole { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}

public class StatusTransitionEntryDto
{
    public string FromStatus { get; set; } = string.Empty;
    public string ToStatus { get; set; } = string.Empty;
    public string FromPriority { get; set; } = string.Empty;
    public string ToPriority { get; set; } = string.Empty;
    public string ChangedBy { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}

public class SupervisorNoteDto
{
    public int Id { get; set; }
    public string Author { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
}

public class AddSupervisorNoteDto
{
    public string NoteText { get; set; } = string.Empty;
}

public class ExecuteWorkspaceServiceDto
{
    public string InputText { get; set; } = string.Empty;
    public string? Category { get; set; }
    public string? RelatedCaseNumber { get; set; }
    public Dictionary<string, string>? Parameters { get; set; }
}

public class WorkspaceServiceResultDto
{
    public string ServiceId { get; set; } = string.Empty;
    public string ServiceName { get; set; } = string.Empty;
    public bool IsAIExecuted { get; set; }
    public string Provider { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int ExecutionTimeMs { get; set; }
    public int? ConfidencePercent { get; set; }
    public string OutputTitle { get; set; } = string.Empty;
    public string OutputSummary { get; set; } = string.Empty;
    public object? StructuredData { get; set; }
    public List<string> RiskFlags { get; set; } = new();
}

public class AIDiagnosticResultDto
{
    public bool IsOnline { get; set; }
    public string Provider { get; set; } = "OpenAI";
    public string Model { get; set; } = "gpt-4o-mini";
    public int LatencyMs { get; set; }
    public string Status { get; set; } = "OPTIMAL";
    public string EndpointUsed { get; set; } = "https://api.openai.com/v1/responses";
    public string Message { get; set; } = string.Empty;
    public string? ErrorDetails { get; set; }
    public bool InferenceVerified { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

public class AITelemetryDto
{
    public decimal AccuracyRate { get; set; } = 94.2m;
    public int TotalVerifiedCases { get; set; }
    public decimal MeanConfidenceScore { get; set; } = 88.4m;
    public decimal HumanOverrideRate { get; set; } = 5.8m;
    public int TotalReviewedCases { get; set; }
    public int TotalOverridesCount { get; set; }
    public int InferenceLatencyMs { get; set; } = 142;
    public string ModelName { get; set; } = "gpt-4o-mini";
    public bool IsConfigured { get; set; }
    public string ProviderStatus { get; set; } = "CONFIG_REQUIRED";
    public Dictionary<string, decimal> DistrictFairness { get; set; } = new();
}

public class AIOperationalDatabaseContext
{
    public List<string> ExistingCaseDescriptions { get; set; } = new();
    public List<AIOperationalShelterSummary> AvailableShelters { get; set; } = new();
    public List<AIOperationalResourceSummary> AvailableResources { get; set; } = new();
    public List<AIOperationalVolunteerSummary> AvailableVolunteers { get; set; } = new();
    public List<AIOperationalCrisisSummary> ActiveCrises { get; set; } = new();
    public int TotalOpenRequestsCount { get; set; }
    public int CriticalRequestsCount { get; set; }
}

public class AIOperationalShelterSummary
{
    public string Name { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public int TotalCapacity { get; set; }
    public int OccupiedBeds { get; set; }
    public int AvailableBeds { get; set; }
    public string Facilities { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

public class AIOperationalResourceSummary
{
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal AvailableQuantity { get; set; }
    public string Unit { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
}

public class AIOperationalVolunteerSummary
{
    public string Id { get; set; } = string.Empty;
    public string Skills { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string AvailabilityStatus { get; set; } = string.Empty;
}

public class AIOperationalCrisisSummary
{
    public string Title { get; set; } = string.Empty;
    public string DisasterType { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
}

