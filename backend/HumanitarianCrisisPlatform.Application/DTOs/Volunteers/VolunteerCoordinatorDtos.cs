using System.ComponentModel.DataAnnotations;

namespace HumanitarianCrisisPlatform.Application.DTOs.Volunteers;

/// <summary>
/// Comprehensive DTO representing a Volunteer record for the Volunteer Coordinator portal.
/// </summary>
public class VolunteerCoordinatorDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string VolunteerCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string Skills { get; set; } = string.Empty;
    public string ServiceArea { get; set; } = "Kelani East";
    public string Availability { get; set; } = "Available";
    public string CurrentShift { get; set; } = "None";
    public string Verification { get; set; } = "Verified";
    public string Status { get; set; } = "Eligible";
    public string StatusType { get; set; } = "eligible";
    public string? Notes { get; set; }
    public bool IsAvailable { get; set; } = true;
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public decimal? MaxTravelDistance { get; set; }
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// Metrics and dashboard summary DTO for the Volunteer Coordinator dashboard.
/// </summary>
public class VolunteerDashboardDto
{
    public VolunteerMetricsDto Metrics { get; set; } = new();
    public List<VolunteerPriorityItemDto> PriorityItems { get; set; } = new();
    public List<VolunteerWorkflowStepDto> WorkflowSteps { get; set; } = new();
    public List<VolunteerRecentActivityDto> RecentActivity { get; set; } = new();
    public VolunteerCoordinatorUserDto CoordinatorUser { get; set; } = new();
}

public class VolunteerMetricsDto
{
    public int RegisteredVolunteers { get; set; }
    public string RegisteredSub { get; set; } = "Entire directory";
    public int VerificationPending { get; set; }
    public string VerificationSub { get; set; } = "0 due today";
    public int AvailableNow { get; set; }
    public string AvailableSub { get; set; } = "In service areas";
    public int ActiveAssignments { get; set; }
    public string ActiveSub { get; set; } = "0 shifts today";
    public int UnfilledTasks { get; set; }
    public string UnfilledSub { get; set; } = "0 high priority";
    public int CompletedActivities { get; set; }
    public string CompletedSub { get; set; } = "Across operation";
}

public class VolunteerPriorityItemDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string Badge { get; set; } = "resolved"; // "critical", "warning", "resolved"
    public string BadgeText { get; set; } = "resolved";
    public string TargetTab { get; set; } = "directory";
}

public class VolunteerWorkflowStepDto
{
    public int Step { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "upcoming"; // "completed", "current", "upcoming"
}

public class VolunteerRecentActivityDto
{
    public string Id { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
}

public class VolunteerCoordinatorUserDto
{
    public string Name { get; set; } = "Kavindi Rodrigo";
    public string Role { get; set; } = "Volunteer Coordinator";
    public string RoleCode { get; set; } = "VOLUNTEER_COORDINATOR";
    public string Avatar { get; set; } = "KR";
    public string Operation { get; set; } = "Western Province Flood";
    public int NotificationCount { get; set; } = 0;
    public bool DutyStatus { get; set; } = true;
    public string AccessBoundaryNotice { get; set; } = "Volunteer eligibility, skills and assignments only. Emergency contacts are restricted.";
}

public class CreateVolunteerRequestDto
{
    private string _name = string.Empty;
    public string Name
    {
        get => _name;
        set => _name = value;
    }
    public string? FullName
    {
        get => _name;
        set { if (!string.IsNullOrWhiteSpace(value)) _name = value; }
    }
    public string? Email { get; set; }
    private string? _phone;
    public string? PhoneNumber
    {
        get => _phone;
        set => _phone = value;
    }
    public string? Phone
    {
        get => _phone;
        set { if (!string.IsNullOrWhiteSpace(value)) _phone = value; }
    }
    public string? Skills { get; set; } = "Logistics, First Aid";
    public string? ServiceArea { get; set; } = "Kelani East";
    public string? Availability { get; set; } = "Available";
    private string? _verification = "Verified";
    public string? Verification
    {
        get => _verification;
        set => _verification = value;
    }
    public string? VerificationStatus
    {
        get => _verification;
        set { if (!string.IsNullOrWhiteSpace(value)) _verification = value; }
    }
    public string? Status { get; set; } = "Eligible";
    public string? Notes { get; set; }
}

public class UpdateVolunteerRequestDto
{
    private string? _name;
    public string? Name
    {
        get => _name;
        set => _name = value;
    }
    public string? FullName
    {
        get => _name;
        set { if (!string.IsNullOrWhiteSpace(value)) _name = value; }
    }
    public string? Email { get; set; }
    private string? _phone;
    public string? PhoneNumber
    {
        get => _phone;
        set => _phone = value;
    }
    public string? Phone
    {
        get => _phone;
        set { if (!string.IsNullOrWhiteSpace(value)) _phone = value; }
    }
    public string? Skills { get; set; }
    public string? ServiceArea { get; set; }
    public string? Availability { get; set; }
    private string? _verification;
    public string? Verification
    {
        get => _verification;
        set => _verification = value;
    }
    public string? VerificationStatus
    {
        get => _verification;
        set { if (!string.IsNullOrWhiteSpace(value)) _verification = value; }
    }
    public string? Status { get; set; }
    public string? Notes { get; set; }
    public bool? IsAvailable { get; set; }
}

public class VolunteerActionRequestDto
{
    private string _reason = string.Empty;
    public string Reason
    {
        get => _reason;
        set => _reason = value;
    }
    public string? Note
    {
        get => _reason;
        set { if (!string.IsNullOrWhiteSpace(value) && string.IsNullOrWhiteSpace(_reason)) _reason = value; }
    }
    public string? Notes { get; set; }
    public string? Action { get; set; }
    public string? ServiceArea { get; set; }
}

public class VolunteerAssignmentDetailDto
{
    public Guid Id { get; set; }
    public Guid VolunteerId { get; set; }
    public string VolunteerCode { get; set; } = string.Empty;
    public string VolunteerName { get; set; } = string.Empty;
    public string VolunteerSkills { get; set; } = string.Empty;
    public string ServiceArea { get; set; } = string.Empty;
    public Guid? AssistanceRequestId { get; set; }
    public string TaskDescription { get; set; } = string.Empty;
    public string ShiftTime { get; set; } = "08:00-14:00";
    public int AssignmentStatus { get; set; }
    public string Status { get; set; } = "Assigned";
    public string StatusType { get; set; } = "assigned";
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? CoordinatorName { get; set; }
    public string? Priority { get; set; }
    public string? CaseNumber { get; set; }
    public string? CaseCategory { get; set; }
}

public class AssignShiftRequestDto
{
    [Required]
    public Guid VolunteerId { get; set; }

    [Required]
    public string ShiftTime { get; set; } = "08:00-14:00";

    [Required]
    public string ShiftTask { get; set; } = "Supply delivery";

    public Guid? AssistanceRequestId { get; set; }
    public string? Note { get; set; }
    public int? AssignmentStatus { get; set; }
}

public class AssignmentActionRequestDto
{
    public string? Reason { get; set; }
    public string? Note { get; set; }
}

public class MatchingRecommendationDto
{
    public string TaskId { get; set; } = string.Empty;
    public Guid? AssistanceRequestId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string RefCode { get; set; } = string.Empty;
    public string SuggestedAction { get; set; } = string.Empty;
    public string Confidence { get; set; } = string.Empty;
    public decimal ConfidenceScore { get; set; } = 0.85m;
    public string TargetNeed { get; set; } = string.Empty;
    public string Deadline { get; set; } = string.Empty;
    public string ProviderLabel { get; set; } = "Rule-Based Matching Algorithm (Human-in-the-Loop)";
    public bool IsRuleBased { get; set; } = true;
    public List<MatchingFactorDto> Factors { get; set; } = new();
    public List<VolunteerCoordinatorDto> SuggestedVolunteers { get; set; } = new();
    public SuspectedDuplicateDto? PossibleDuplicate { get; set; }
}

public class MatchingFactorDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Badge { get; set; } = "High";
    public string BadgeColor { get; set; } = "blue";
    public string Icon { get; set; } = "check";
}

public class SuspectedDuplicateDto
{
    public string Ref { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Skills { get; set; } = string.Empty;
    public string Area { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;
}

public class MatchingDecisionRequestDto
{
    [Required]
    public string TaskId { get; set; } = string.Empty;

    public Guid? AssistanceRequestId { get; set; }

    [Required]
    public string Decision { get; set; } = string.Empty;

    [Required]
    public string Reason { get; set; } = string.Empty;

    public string? SuggestedAction { get; set; }
}

public class MatchingDecisionHistoryDto
{
    public Guid Id { get; set; }
    public string TaskId { get; set; } = string.Empty;
    public string Decision { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public string Timestamp { get; set; } = string.Empty;
    public string Reviewer { get; set; } = string.Empty;
}

public class CoordinationTimelineItemDto
{
    public string Id { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Scope { get; set; } = "1.0dB-SL42 - authorised participants only";
    public string? MessageContent { get; set; }
    public string Recipient { get; set; } = string.Empty;
    public string Sender { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}

public class RecordScopedUpdateRequestDto
{
    [Required]
    public string RecipientWorkflow { get; set; } = "Resource & Logistics Manager";

    [Required]
    public string OperationalMessage { get; set; } = string.Empty;
}

public class VolunteerReportsAnalyticsDto
{
    public ReportMetricsDto Metrics { get; set; } = new();
    public List<AreaBreakdownDto> AreaBreakdown { get; set; } = new();
    public List<SkillDistributionDto> SkillDistribution { get; set; } = new();
    public VerificationStatsDto VerificationStats { get; set; } = new();
    public AssignmentStatsDto AssignmentStats { get; set; } = new();
}

public class ReportMetricsDto
{
    public string TotalMobilized { get; set; } = "0";
    public string ShiftsFulfilled { get; set; } = "0";
    public string MobilizationRate { get; set; } = "0%";
    public string SafetyIncidents { get; set; } = "0";
}

public class AreaBreakdownDto
{
    public string Name { get; set; } = string.Empty;
    public int Count { get; set; }
    public int Percent { get; set; }
    public string Status { get; set; } = "Operational";
}

public class SkillDistributionDto
{
    public string Skill { get; set; } = string.Empty;
    public int Count { get; set; }
    public int Percent { get; set; }
    public string Color { get; set; } = "#2563eb";
}

public class VerificationStatsDto
{
    public int TotalVerified { get; set; }
    public int PendingReview { get; set; }
}

public class AssignmentStatsDto
{
    public int ActiveAssignments { get; set; }
    public int CompletedAssignments { get; set; }
    public int CancelledAssignments { get; set; }
}

public class ExportReportRequestDto
{
    public string Scope { get; set; } = "all"; // all, active, unfilled, area
    public string Format { get; set; } = "csv"; // csv, pdf
    public bool IncludeAudit { get; set; } = true;
    public string? OperationalArea { get; set; }
    public string? Period { get; set; }
}

public class ExportReportResultDto
{
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = "text/csv";
    public string Content { get; set; } = string.Empty;
}
