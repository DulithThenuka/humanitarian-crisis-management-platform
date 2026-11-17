namespace HumanitarianCrisisPlatform.Application.DTOs.Coordinator;

// ─── Dashboard Metrics ─────────────────────────────────────────────────────────
public class CoordinatorDashboardDto
{
    public CoordinatorMetricsDto Metrics { get; set; } = new();
    public List<PriorityCaseDto> PriorityCases { get; set; } = new();
    public List<RecentActivityDto> RecentActivity { get; set; } = new();
    public CoordinatorUserDto User { get; set; } = new();
}

public class CoordinatorMetricsDto
{
    public int IncomingRequests { get; set; }
    public int PendingReviews { get; set; }
    public int CriticalPriority { get; set; }
    public int MoreInfoRequired { get; set; }
    public int ActiveEmergencies { get; set; }
    public int VolunteersAssigned { get; set; }
    public int TotalVolunteers { get; set; }
    public int AvailableVolunteers { get; set; }
    public int ActiveCrises { get; set; }
    public int ResolvedToday { get; set; }
}

public class CoordinatorUserDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string Role { get; set; } = "Coordinator";
}

// ─── Priority Case ─────────────────────────────────────────────────────────────
public class PriorityCaseDto
{
    public Guid Id { get; set; }
    public string CaseId { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? AIPriority { get; set; }
    public string? Verification { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? SubmittedBy { get; set; }
}

// ─── Recent Activity ──────────────────────────────────────────────────────────
public class RecentActivityDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Detail { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;  // approved, incident, resource
    public DateTime Timestamp { get; set; }
}

// ─── Emergency Alert ──────────────────────────────────────────────────────────
public class EmergencyAlertDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Status { get; set; } = "Draft";
    public string? AffectedArea { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsPublished { get; set; }
}

public class CreateEmergencyAlertDto
{
    public string Title { get; set; } = string.Empty;
    public string Severity { get; set; } = "Medium";
    public string Type { get; set; } = string.Empty;
    public string? AffectedArea { get; set; }
    public string? Message { get; set; }
    public Guid? CrisisEventId { get; set; }
}

// ─── Coordinator Profile Update ───────────────────────────────────────────────
public class UpdateCoordinatorProfileDto
{
    public string? FullName { get; set; }
    public string? PhoneNumber { get; set; }
}

// ─── Volunteer Coordination ───────────────────────────────────────────────────
public class VolunteerCoordinationSummaryDto
{
    public int TotalVolunteers { get; set; }
    public int AvailableVolunteers { get; set; }
    public int ActiveAssignments { get; set; }
    public int CompletedToday { get; set; }
    public List<VolunteerSummaryItem> Volunteers { get; set; } = new();
}

public class VolunteerSummaryItem
{
    public Guid Id { get; set; }
    public string VolunteerCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? DutyStatus { get; set; }
    public bool IsAvailable { get; set; }
    public string? Skills { get; set; }
    public string? ServiceArea { get; set; }
    public int ActiveAssignments { get; set; }
    public decimal TotalHoursServed { get; set; }
}

// ─── Coordinator Notification ─────────────────────────────────────────────────
public class CoordinatorNotificationDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = "info";
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}

// ─── Request Triage ───────────────────────────────────────────────────────────
public class TriageRequestDto
{
    public Guid RequestId { get; set; }
    public string Action { get; set; } = string.Empty;  // approve, reject, more-info, escalate
    public string? Notes { get; set; }
    public string? Priority { get; set; }
}
