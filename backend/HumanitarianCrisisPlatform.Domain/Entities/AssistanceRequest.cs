using HumanitarianCrisisPlatform.Domain.Common;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Domain.Entities;

public class AssistanceRequest : AuditableEntity
{
    public Guid RequestorId { get; set; }
    public User? Requestor { get; set; }
    public Guid? CrisisEventId { get; set; }
    public CrisisEvent? CrisisEvent { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public PriorityLevel Urgency { get; set; } = PriorityLevel.Medium;
    public RequestStatus Status { get; set; } = RequestStatus.Submitted;
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string? Address { get; set; }
    public int NumberOfPeople { get; set; } = 1;
    public string? ContactPhone { get; set; }
    public string? AttachmentUrl { get; set; }
    public decimal? AIPriorityScore { get; set; }
    public decimal? AIConfidence { get; set; }
    public bool IsDuplicate { get; set; } = false;
    public Guid? DuplicateOfId { get; set; }
    public AssistanceRequest? DuplicateOf { get; set; }
    public DateTime? ResolvedAt { get; set; }

    public ICollection<AIDecisionAudit> AIDecisionAudits { get; set; } = new List<AIDecisionAudit>();
    public ICollection<ShelterAllocation> ShelterAllocations { get; set; } = new List<ShelterAllocation>();
    public ICollection<ResourceAllocation> ResourceAllocations { get; set; } = new List<ResourceAllocation>();
    public ICollection<VolunteerAssignment> VolunteerAssignments { get; set; } = new List<VolunteerAssignment>();
}
