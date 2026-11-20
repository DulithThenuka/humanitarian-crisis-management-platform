using HumanitarianCrisisPlatform.Domain.Common;
using HumanitarianCrisisPlatform.Domain.Exceptions;

namespace HumanitarianCrisisPlatform.Domain.Entities;

public class IncidentCommunication : AuditableEntity
{
    public Guid IncidentId { get; set; }
    public Incident? Incident { get; set; }

    public Guid? SenderUserId { get; set; }
    public User? SenderUser { get; set; }
    public string SenderName { get; set; } = string.Empty;
    public string SenderRole { get; set; } = string.Empty;

    public string RecipientWorkflow { get; set; } = "Resource & Logistics Manager";
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string CaseTag { get; set; } = string.Empty;

    public bool IsInternal { get; set; } = true;
    public bool IsVisibleToCitizen { get; set; } = false;
    public DateTime SentAt { get; set; } = DateTime.UtcNow;

    public void Validate()
    {
        if (IncidentId == Guid.Empty)
            throw new DomainException("IncidentId is required for communication.");

        if (string.IsNullOrWhiteSpace(Message))
            throw new DomainException("Communication message cannot be empty.");
    }
}

