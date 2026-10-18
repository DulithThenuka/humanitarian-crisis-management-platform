using HumanitarianCrisisPlatform.Domain.Common;

namespace HumanitarianCrisisPlatform.Domain.Entities;

public class VolunteerAssignment : AuditableEntity
{
    public Guid VolunteerId { get; set; }
    public Volunteer? Volunteer { get; set; }
    public Guid? AssistanceRequestId { get; set; }
    public AssistanceRequest? AssistanceRequest { get; set; }
    public string TaskDescription { get; set; } = string.Empty;
    public int AssignmentStatus { get; set; } = 0;
    public decimal? AIMatchScore { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public string? Notes { get; set; }
}
