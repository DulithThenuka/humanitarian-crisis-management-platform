using HumanitarianCrisisPlatform.Domain.Common;

namespace HumanitarianCrisisPlatform.Domain.Entities;

/// <summary>
/// Represents a volunteer task/opportunity posted by coordinators.
/// Volunteers browse and accept these opportunities.
/// </summary>
public class VolunteerOpportunity : AuditableEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;    // Medical, Logistics, Rescue, etc.
    public string Location { get; set; } = string.Empty;
    public string? Coordinator { get; set; }
    public string? CoordinatorPhone { get; set; }
    public string Priority { get; set; } = "Medium";       // High, Medium, Low
    public DateTime? Deadline { get; set; }
    public int MaxVolunteers { get; set; } = 1;
    public int AcceptedCount { get; set; } = 0;
    public bool IsActive { get; set; } = true;

    // Link to crisis event (optional)
    public Guid? CrisisEventId { get; set; }
    public CrisisEvent? CrisisEvent { get; set; }

    // Coordinator who posted this opportunity
    public Guid? PostedByUserId { get; set; }
    public User? PostedByUser { get; set; }

    public ICollection<VolunteerAssignment> Assignments { get; set; } = new List<VolunteerAssignment>();
    public ICollection<Volunteer> AcceptedVolunteers { get; set; } = new List<Volunteer>();
}
