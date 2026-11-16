using System.ComponentModel.DataAnnotations;

namespace HumanitarianCrisisPlatform.Application.DTOs.Coordinator;

public class EmergencyAlertDto
{
    public string Id { get; set; } = string.Empty;
    public Guid? SourceCrisisEventId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = "Flood warning";
    public string Severity { get; set; } = "High";
    public string SeverityClass { get; set; } = "pill-high";
    public string Area { get; set; } = "Western Province";
    public string? RelatedIncident { get; set; }
    public string Publication { get; set; } = "Published";
    public string Tab { get; set; } = "active";
    public string CreatedBy { get; set; } = "Emergency Coordinator";
    public string? CreatedDate { get; set; }
    public string LastUpdated { get; set; } = "Just now";
    public string? StartTime { get; set; }
    public string? ExpiryTime { get; set; }
    public string? ScheduledDate { get; set; }
    public string? ResolutionNotes { get; set; }
    public string? ResolvedAt { get; set; }
    public string? ResolvedBy { get; set; }
    public string Message { get; set; } = string.Empty;
    public IReadOnlyList<string> SafetyInstructions { get; set; } = Array.Empty<string>();
}

public class CreateAlertDto
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public string Category { get; set; } = "Flood warning";

    public string Severity { get; set; } = "Critical";

    [Required]
    [MaxLength(2000)]
    public string Message { get; set; } = string.Empty;

    public string Area { get; set; } = "Kelani East - Zone 03";

    public string? RelatedIncident { get; set; }

    public string? StartTime { get; set; }
    public string? ExpiryTime { get; set; }
    public string? ScheduledDate { get; set; }

    public object? SafetyInstructions { get; set; }

    public bool IsDraft { get; set; } = false;
    public string? PublicationStatus { get; set; } // "Draft", "Scheduled", "Published"
}

public class UpdateAlertDto
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public string Category { get; set; } = "Flood warning";

    public string Severity { get; set; } = "Critical";

    [Required]
    [MaxLength(2000)]
    public string Message { get; set; } = string.Empty;

    public string Area { get; set; } = "Western Province";

    public string? RelatedIncident { get; set; }

    public string? StartTime { get; set; }
    public string? ExpiryTime { get; set; }
    public string? ScheduledDate { get; set; }

    public object? SafetyInstructions { get; set; }

    public string? PublicationStatus { get; set; } // "Draft", "Scheduled", "Published", "Resolved"
    public string? ResolutionNotes { get; set; }
}

public class ResolveAlertDto
{
    public string? ResolutionNotes { get; set; }
}
