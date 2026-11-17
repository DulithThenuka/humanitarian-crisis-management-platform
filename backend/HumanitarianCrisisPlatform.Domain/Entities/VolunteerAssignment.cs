using HumanitarianCrisisPlatform.Domain.Common;

namespace HumanitarianCrisisPlatform.Domain.Entities;

public class VolunteerAssignment : AuditableEntity
{
    public Guid VolunteerId { get; set; }
    public Volunteer? Volunteer { get; set; }

    public Guid? AssistanceRequestId { get; set; }
    public AssistanceRequest? AssistanceRequest { get; set; }

    public Guid? OpportunityId { get; set; }
    public VolunteerOpportunity? Opportunity { get; set; }

    public string TaskDescription { get; set; } = string.Empty;

    // 0=Offered, 1=Accepted, 2=InProgress, 3=Completed, 4=Declined
    public int AssignmentStatus { get; set; } = 0;

    public decimal? AIMatchScore { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public string? Notes { get; set; }

    // Extended fields for volunteer portal
    public string? Title { get; set; }
    public string? Category { get; set; }
    public string? Location { get; set; }
    public string? Coordinator { get; set; }
    public string? CoordinatorPhone { get; set; }
    public string? Priority { get; set; }           // High, Medium, Low
    public DateTime? Deadline { get; set; }
    public decimal LoggedHours { get; set; } = 0;
    public string? ShiftNotes { get; set; }
    public bool HoursApproved { get; set; } = false;
}
