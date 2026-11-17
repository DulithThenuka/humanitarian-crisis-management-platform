using HumanitarianCrisisPlatform.Domain.Common;

namespace HumanitarianCrisisPlatform.Domain.Entities;

public class IncidentAuditLog : BaseEntity
{
    public Guid IncidentId { get; set; }
    public Incident? Incident { get; set; }
    public string CaseNumber { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Detail { get; set; } = string.Empty;
    public Guid? ActorUserId { get; set; }
    public string ActorName { get; set; } = string.Empty;
    public string ActorRole { get; set; } = string.Empty;
    public bool IsInternal { get; set; } = true;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

