using System.ComponentModel.DataAnnotations;

namespace HumanitarianCrisisPlatform.Application.DTOs.Coordinator;

public class CoordinatorPerformanceDto
{
    public decimal ReviewWithinTargetPercent { get; set; } = 84.0m;
    public decimal RequestsVerifiedPercent { get; set; } = 71.0m;
    public decimal ResolvedRequestsPercent { get; set; } = 62.0m;
    public decimal ResourceFulfillmentPercent { get; set; } = 68.0m;
}

public class CoordinatorOperationSummaryDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = "Western Province Monsoon Floods";
    public string OperationCode { get; set; } = "CR-2026-014";
    public string Severity { get; set; } = "Critical / Level 4";
    public string Sector { get; set; } = "Kelani East - Sector 03";
    public string LeadCoordinator { get; set; } = "Sarah Johnson";
    public bool IsActive { get; set; } = true;
    public DateTime StartDate { get; set; } = DateTime.UtcNow.AddDays(-3);
}

public class CoordinatorCaseDto
{
    public Guid Id { get; set; }
    public string TicketReference { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string CategoryIcon { get; set; } = "home";
    public string Location { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string TimeAgo { get; set; } = "Just now";
    public DateTime SubmittedAt { get; set; }
    public string Severity { get; set; } = "High";
    public string Status { get; set; } = "Pending verification";
    public string AssignedTo { get; set; } = "Assigned to you";
    public string RequesterName { get; set; } = string.Empty;
    public string ContactNumber { get; set; } = string.Empty;
    public string ContactStatus { get; set; } = "Pending call-back";
    public string AffectedSummary { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string GeneralLocation { get; set; } = string.Empty;
    public string Accessibility { get; set; } = "Standard access";
    public string EmergencyContext { get; set; } = "Active incident";
    public int NumberOfPeople { get; set; } = 1;
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public decimal? AIPriorityScore { get; set; }
    public decimal? AIConfidence { get; set; }
    public string? AISuggestion { get; set; }
    public int AttachmentsCount { get; set; } = 0;
    public CoordinatorAttachmentDto? Attachment { get; set; }
    public List<CoordinatorChecklistItemDto> Checklist { get; set; } = new();
    public List<CoordinatorCaseNoteDto> Notes { get; set; } = new();
    public List<CoordinatorHistoryStepDto> History { get; set; } = new();
}

public class CoordinatorAttachmentDto
{
    public string FileName { get; set; } = "incident-evidence.jpg";
    public string FileSize { get; set; } = "2.4 MB";
    public string UploadType { get; set; } = "Citizen upload";
    public string PreviewUrl { get; set; } = "/assets/req-drawer-flood.jpg";
}

public class CoordinatorChecklistItemDto
{
    public string Id { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public bool Checked { get; set; }
    public bool Required { get; set; }
}

public class CoordinatorCaseNoteDto
{
    public string Id { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
}

public class CoordinatorHistoryStepDto
{
    public string Time { get; set; } = string.Empty;
    public string Event { get; set; } = string.Empty;
    public string Actor { get; set; } = string.Empty;
}

public class VerifyCaseDto
{
    [Required]
    public string Reason { get; set; } = string.Empty;
    public bool ConfirmedCheck { get; set; } = true;
    public string? AssignedTeam { get; set; }
    public string? Notes { get; set; }
}

public class AddCaseNoteDto
{
    [Required]
    public string Text { get; set; } = string.Empty;
}

public class CoordinatorAlertDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Severity { get; set; } = "High";
    public string Area { get; set; } = "Western Province";
    public string Meta { get; set; } = "Published";
    public string Type { get; set; } = "flood";
    public string BadgeClass { get; set; } = "badge-critical";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class CreateCoordinatorAlertDto
{
    [Required]
    public string Title { get; set; } = string.Empty;
    public string Severity { get; set; } = "Critical";
    public string Area { get; set; } = "Kelani East - Zone 03";
    public string? Instructions { get; set; }
}

public class CoordinatorIncidentDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Severity { get; set; } = "High";
    public string Area { get; set; } = string.Empty;
    public string LeadTeam { get; set; } = "National Relief Unit";
    public string Stats { get; set; } = string.Empty;
    public string CurrentStatus { get; set; } = "Active response";
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
}

public class CreateCoordinatorIncidentDto
{
    [Required]
    public string Title { get; set; } = string.Empty;
    public string Severity { get; set; } = "High";
    public string Area { get; set; } = "Western Province Sector";
    public string? LeadTeam { get; set; } = "National Relief Unit";
}
