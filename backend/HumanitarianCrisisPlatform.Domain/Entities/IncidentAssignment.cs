using HumanitarianCrisisPlatform.Domain.Common;
using HumanitarianCrisisPlatform.Domain.Exceptions;

namespace HumanitarianCrisisPlatform.Domain.Entities;

public class IncidentAssignment : AuditableEntity
{
    public Guid IncidentId { get; set; }
    public Incident? Incident { get; set; }

    public Guid? AssigneeUserId { get; set; }
    public User? AssigneeUser { get; set; }
    public string AssigneeName { get; set; } = string.Empty;

    public Guid? AssignedByUserId { get; set; }
    public User? AssignedByUser { get; set; }
    public string AssignedByName { get; set; } = string.Empty;

    public string? OperationalArea { get; set; }
    public string Reason { get; set; } = string.Empty;
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UnassignedAt { get; set; }
    public bool IsActive { get; set; } = true;

    public void Validate()
    {
        if (IncidentId == Guid.Empty)
            throw new DomainException("IncidentId is required for assignment.");

        if (string.IsNullOrWhiteSpace(AssigneeName) && (!AssigneeUserId.HasValue || AssigneeUserId == Guid.Empty))
            throw new DomainException("Either AssigneeUserId or AssigneeName must be provided.");
    }
}

