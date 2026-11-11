using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Application.DTOs.Incidents;

public class IncidentResponseDto
{
    public Guid Id { get; set; }
    public string CaseNumber { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public IncidentCategory CategoryEnum { get; set; }
    public string OperationalArea { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public PriorityLevel PriorityLevel { get; set; }
    public string PriorityType { get; set; } = string.Empty;
    public string Verification { get; set; } = string.Empty;
    public string VerificationType { get; set; } = string.Empty;
    public string AssignedStaff { get; set; } = string.Empty;
    public Guid? AssignedToUserId { get; set; }
    public string Status { get; set; } = string.Empty;
    public IncidentStatus StatusEnum { get; set; }
    public string StatusType { get; set; } = string.Empty;
    public int AffectedPeopleCount { get; set; } = 1;
    public string AffectedPeople { get; set; } = "1 person";
    public string CurrentSafety { get; set; } = string.Empty;
    public string Accessibility { get; set; } = string.Empty;
    public string SubmittedAgo { get; set; } = string.Empty;
    public string CitizenQuote { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Address { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string? ContactPhone { get; set; }
    public Guid? CitizenId { get; set; }
    public Guid? AssistanceRequestId { get; set; }
    public Guid? CrisisEventId { get; set; }
    public bool IsDuplicate { get; set; }
    public Guid? MergedIntoIncidentId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? VerifiedAt { get; set; }
    public DateTime? EscalatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public DateTime? ClosedAt { get; set; }
    public string? ResolutionNotes { get; set; }
    public string? InternalNotes { get; set; }
    public List<string> Notes { get; set; } = new();
}

public class CreateIncidentDto
{
    public string? CaseNumber { get; set; }
    public string? Title { get; set; }
    public string Category { get; set; } = "Emergency Shelter";
    public string OperationalArea { get; set; } = "Kelani East - Zone 03";
    public string Priority { get; set; } = "Medium";
    public string? Description { get; set; }
    public string? CitizenQuote { get; set; }
    public string? AssignedStaff { get; set; }
    public Guid? AssignedToUserId { get; set; }
    public int AffectedPeople { get; set; } = 1;
    public string? CurrentSafety { get; set; }
    public string? Accessibility { get; set; }
    public string? Address { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string? ContactPhone { get; set; }
    public Guid? CitizenId { get; set; }
    public Guid? AssistanceRequestId { get; set; }
    public Guid? CrisisEventId { get; set; }
}

public class UpdateIncidentDto
{
    public string? Title { get; set; }
    public string? Category { get; set; }
    public string? OperationalArea { get; set; }
    public string? Priority { get; set; }
    public string? Status { get; set; }
    public string? Verification { get; set; }
    public string? Description { get; set; }
    public string? CitizenQuote { get; set; }
    public string? AssignedStaff { get; set; }
    public Guid? AssignedToUserId { get; set; }
    public int? AffectedPeople { get; set; }
    public string? CurrentSafety { get; set; }
    public string? Accessibility { get; set; }
    public string? Address { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string? ContactPhone { get; set; }
    public string? Note { get; set; }
}

