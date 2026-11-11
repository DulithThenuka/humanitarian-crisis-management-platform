namespace HumanitarianCrisisPlatform.Application.DTOs.Incidents;

public class IncidentCommunicationDto
{
    public Guid Id { get; set; }
    public Guid IncidentId { get; set; }
    public string CaseId { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Recipient { get; set; } = string.Empty;
    public string SenderName { get; set; } = string.Empty;
    public string SenderRole { get; set; } = string.Empty;
    public string CaseTag { get; set; } = string.Empty;
    public bool IsInternal { get; set; } = true;
    public bool IsVisibleToCitizen { get; set; }
    public DateTime SentAt { get; set; }
}

public class CreateIncidentCommunicationDto
{
    public string Recipient { get; set; } = "Resource & Logistics Manager";
    public string Message { get; set; } = string.Empty;
    public string? Title { get; set; }
    public bool IsInternal { get; set; } = true;
    public bool IsVisibleToCitizen { get; set; } = false;
}

