using HumanitarianCrisisPlatform.Domain.Common;
using HumanitarianCrisisPlatform.Domain.Enums;
using HumanitarianCrisisPlatform.Domain.Exceptions;

namespace HumanitarianCrisisPlatform.Domain.Entities;

public class IncidentStatusHistory : BaseEntity
{
    public Guid IncidentId { get; set; }
    public Incident? Incident { get; set; }

    public IncidentStatus FromStatus { get; set; }
    public IncidentStatus ToStatus { get; set; }
    public PriorityLevel? FromPriority { get; set; }
    public PriorityLevel? ToPriority { get; set; }

    public Guid? ChangedByUserId { get; set; }
    public User? ChangedByUser { get; set; }
    public string ChangedByName { get; set; } = string.Empty;
    public string ChangedByRole { get; set; } = string.Empty;

    public string Reason { get; set; } = string.Empty;
    public bool IsInternalNote { get; set; } = false;
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

    public void Validate()
    {
        if (IncidentId == Guid.Empty)
            throw new DomainException("IncidentId is required for status history.");

        if (string.IsNullOrWhiteSpace(Reason))
            throw new DomainException("A reason is required when recording a status transition.");
    }
}

