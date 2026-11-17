using HumanitarianCrisisPlatform.Domain.Common;
using HumanitarianCrisisPlatform.Domain.Enums;
using HumanitarianCrisisPlatform.Domain.Exceptions;

namespace HumanitarianCrisisPlatform.Domain.Entities;

public class IncidentEscalation : AuditableEntity
{
    public Guid IncidentId { get; set; }
    public Incident? Incident { get; set; }

    public Guid? EscalatedByUserId { get; set; }
    public User? EscalatedByUser { get; set; }
    public string EscalatedByName { get; set; } = string.Empty;

    public string EscalatedToRole { get; set; } = "Emergency Coordinator";
    public Guid? EscalatedToUserId { get; set; }
    public User? EscalatedToUser { get; set; }

    public string Reason { get; set; } = string.Empty;
    public PriorityLevel PreviousPriority { get; set; }
    public PriorityLevel NewPriority { get; set; } = PriorityLevel.Critical;
    public DateTime EscalatedAt { get; set; } = DateTime.UtcNow;
    public bool IsResolved { get; set; } = false;
    public DateTime? ResolvedAt { get; set; }

    public void Validate()
    {
        if (IncidentId == Guid.Empty)
            throw new DomainException("IncidentId is required for escalation.");

        if (string.IsNullOrWhiteSpace(Reason))
            throw new DomainException("Escalation reason is required.");
    }
}

