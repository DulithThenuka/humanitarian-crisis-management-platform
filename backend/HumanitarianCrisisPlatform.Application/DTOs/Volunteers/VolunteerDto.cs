namespace HumanitarianCrisisPlatform.Application.DTOs.Volunteers;

// ─── Core Volunteer DTO ────────────────────────────────────────────────────────
public class VolunteerDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Skills { get; set; }
    public string? Availability { get; set; }
    public bool IsAvailable { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public decimal? MaxTravelDistance { get; set; }

    // Extended profile
    public string? VolunteerCode { get; set; }
    public string? DutyStatus { get; set; }
    public string? ServiceArea { get; set; }
    public string? BloodGroup { get; set; }
    public string? EmergencyContact { get; set; }
    public string? VerificationTier { get; set; }
    public string? Certifications { get; set; }
    public string? PreferredCategories { get; set; }
    public decimal TotalHoursServed { get; set; }
    public int CompletedAssignments { get; set; }
    public int ActiveAssignments { get; set; }
}

// ─── Volunteer Metrics ─────────────────────────────────────────────────────────
public class VolunteerMetricsDto
{
    public int TotalAssignments { get; set; }
    public int CompletedAssignments { get; set; }
    public int ActiveAssignments { get; set; }
    public int PendingAssignments { get; set; }
    public decimal TotalHoursServed { get; set; }
    public int AvailableOpportunities { get; set; }
    public int UnreadNotifications { get; set; }
}

// ─── Assignment Task (coordinator assigns a volunteer) ────────────────────────
public class AssignTaskDto
{
    public Guid VolunteerId { get; set; }
    public Guid? AssistanceRequestId { get; set; }
    public Guid? OpportunityId { get; set; }
    public string TaskDescription { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? Category { get; set; }
    public string? Location { get; set; }
    public string? Priority { get; set; }
    public DateTime? Deadline { get; set; }
    public string? Notes { get; set; }
}

// ─── Volunteer Assignment DTO (returned to volunteer portal) ──────────────────
public class VolunteerAssignmentDto
{
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public string TaskDescription { get; set; } = string.Empty;
    public string? Category { get; set; }
    public string? Location { get; set; }
    public string? Coordinator { get; set; }
    public string? CoordinatorPhone { get; set; }
    public string? Priority { get; set; }
    public DateTime? Deadline { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public string? Notes { get; set; }
    public int AssignmentStatus { get; set; }
    public string AssignmentStatusLabel { get; set; } = string.Empty;
    public decimal LoggedHours { get; set; }
    public bool HoursApproved { get; set; }
    public Guid? OpportunityId { get; set; }
    public Guid? AssistanceRequestId { get; set; }
    public DateTime CreatedAt { get; set; }
}

// ─── Opportunity DTO ──────────────────────────────────────────────────────────
public class VolunteerOpportunityDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string? Coordinator { get; set; }
    public string Priority { get; set; } = "Medium";
    public DateTime? Deadline { get; set; }
    public int MaxVolunteers { get; set; }
    public int AcceptedCount { get; set; }
    public int SpotsLeft { get; set; }
    public bool IsActive { get; set; }
    public Guid? CrisisEventId { get; set; }
    public DateTime CreatedAt { get; set; }
}

// ─── Create Opportunity (coordinator) ─────────────────────────────────────────
public class CreateOpportunityDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string? Coordinator { get; set; }
    public string? CoordinatorPhone { get; set; }
    public string Priority { get; set; } = "Medium";
    public DateTime? Deadline { get; set; }
    public int MaxVolunteers { get; set; } = 1;
    public Guid? CrisisEventId { get; set; }
}

// ─── Accept Opportunity (volunteer accepts an open slot) ──────────────────────
public class AcceptOpportunityDto
{
    public Guid OpportunityId { get; set; }
    public string? Notes { get; set; }
}

// ─── Respond to Assignment (volunteer accept/decline/complete) ─────────────────
public class RespondToAssignmentDto
{
    public Guid AssignmentId { get; set; }
    public string Action { get; set; } = string.Empty;  // "accept","decline","complete","inprogress"
    public string? Notes { get; set; }
}

// ─── Log Shift Hours ──────────────────────────────────────────────────────────
public class LogShiftHoursDto
{
    public Guid AssignmentId { get; set; }
    public decimal Hours { get; set; }
    public string? ShiftNotes { get; set; }
}

// ─── Approve Hours (coordinator) ──────────────────────────────────────────────
public class ApproveHoursDto
{
    public Guid AssignmentId { get; set; }
    public bool Approved { get; set; } = true;
}

// ─── Duty Status ──────────────────────────────────────────────────────────────
public class UpdateDutyStatusDto
{
    public string DutyStatus { get; set; } = "Available"; // Available, On Duty, Off Duty
}

// ─── Availability ─────────────────────────────────────────────────────────────
public class UpdateAvailabilityDto
{
    public bool IsAvailable { get; set; }
    public string? Availability { get; set; }
    public string? DutyStatus { get; set; }
}

// ─── Profile Update ───────────────────────────────────────────────────────────
public class UpdateVolunteerProfileDto
{
    public string? Skills { get; set; }
    public string? Availability { get; set; }
    public string? ServiceArea { get; set; }
    public string? BloodGroup { get; set; }
    public string? EmergencyContact { get; set; }
    public string? Certifications { get; set; }
    public string? PreferredCategories { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public decimal? MaxTravelDistance { get; set; }
    public string? PhoneNumber { get; set; }
}

// ─── Notifications ────────────────────────────────────────────────────────────
public class VolunteerNotificationDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = "info"; // info, success, warning, urgent
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid? AssignmentId { get; set; }
    public Guid? OpportunityId { get; set; }
}

// ─── Coordinator: Bulk/batch assignment ───────────────────────────────────────
public class BulkAssignDto
{
    public List<Guid> VolunteerIds { get; set; } = new();
    public Guid? OpportunityId { get; set; }
    public string TaskDescription { get; set; } = string.Empty;
    public string? Category { get; set; }
    public string? Location { get; set; }
    public string? Priority { get; set; }
    public DateTime? Deadline { get; set; }
}
