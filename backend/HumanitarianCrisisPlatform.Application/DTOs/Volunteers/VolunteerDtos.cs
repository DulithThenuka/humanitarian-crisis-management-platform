using System;
using System.Collections.Generic;

namespace HumanitarianCrisisPlatform.Application.DTOs.Volunteers;

public class VolunteerCertificationDto
{
    public string Title { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Year { get; set; } = string.Empty;
}

public class VolunteerProfileDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string VolunteerId { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string Role { get; set; } = "Humanitarian Volunteer";
    public string RoleCode { get; set; } = "VOLUNTEER";
    public string ShortRole { get; set; } = "Verified Volunteer";
    public string Avatar { get; set; } = "NP";
    public string? Skills { get; set; }
    public string? Availability { get; set; }
    public bool IsAvailable { get; set; } = true;
    public bool DutyStatus { get; set; } = true;
    public string DutyLoggedTime { get; set; } = "Logged 18:00 - Logistics, First Aid and Shelter shifts";
    public string OperationArea { get; set; } = "Kelani East and nearby service areas";
    public string ServiceArea { get; set; } = "Kelani East";
    public string BloodGroup { get; set; } = "O+";
    public string EmergencyContact { get; set; } = "Sunil Perera (Father) - +94 71 987 6543";
    public string VerificationTier { get; set; } = "Tier 2 - Field Operative (Verified)";
    public int NotificationCount { get; set; } = 3;
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public decimal? MaxTravelDistance { get; set; }
    public List<VolunteerCertificationDto> Certifications { get; set; } = new();
}

public class UpdateVolunteerProfileDto
{
    public string? PhoneNumber { get; set; }
    public string? Skills { get; set; }
    public string? Availability { get; set; }
    public string? ServiceArea { get; set; }
    public bool? DutyStatus { get; set; }
    public string? DutyLoggedTime { get; set; }
    public string? BloodGroup { get; set; }
    public string? EmergencyContact { get; set; }
    public decimal? MaxTravelDistance { get; set; }
}

public class VolunteerMetricsDto
{
    public int AssignedTasks { get; set; }
    public string AssignedSub { get; set; } = "1 upcoming";
    public int PendingAcceptance { get; set; }
    public string PendingSub { get; set; } = "1 responding by 18:00";
    public int InProgress { get; set; }
    public string InProgressSub { get; set; } = "Current assignment";
    public int CompletedTasks { get; set; }
    public string CompletedSub { get; set; } = "38 volunteer hours";
}

public class VolunteerUpcomingSummaryDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Day { get; set; } = "19";
    public string Month { get; set; } = "FEB";
    public string DateStr { get; set; } = "19 Feb 2026";
    public string Time { get; set; } = "08:30-13:30";
    public string ReportingBy { get; set; } = "Today - 18:00";
    public string Location { get; set; } = "Kelani East Distribution Point";
    public string Area { get; set; } = "Kelani East";
    public List<string> Tags { get; set; } = new();
    public string Coordinator { get; set; } = "Maya Fernando";
    public string CoordinatorPhone { get; set; } = "+94 77 555 0192";
    public string Description { get; set; } = string.Empty;
    public string PpeRequired { get; set; } = "Reflective vest, safety boots, work gloves";
    public string Status { get; set; } = "Offered";
}

public class VolunteerNotificationItemDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string Type { get; set; } = "assignment";
    public bool Unread { get; set; }
}

public class VolunteerActivitySummaryDto
{
    public int CompletedAssignments { get; set; }
    public string VolunteerHours { get; set; } = "38h";
    public string PrimaryServiceArea { get; set; } = "Kelani East";
    public string CoordinatorVerificationStatus { get; set; } = "Verified";
}

public class VolunteerOpportunityDto
{
    public string Id { get; set; } = string.Empty;
    public string CategoryCode { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Duration { get; set; } = "4 hours";
    public string Date { get; set; } = string.Empty;
    public string VolunteersNeeded { get; set; } = "2 volunteers";
    public string Location { get; set; } = string.Empty;
    public string Priority { get; set; } = "Medium";
    public string PriorityColor { get; set; } = "blue";
    public List<string> Skills { get; set; } = new();
    public string EligibilityType { get; set; } = "eligible";
    public string EligibilityText { get; set; } = "You meet the basic eligibility requirements.";
    public string Coordinator { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public string Shift { get; set; } = string.Empty;
}

public class VolunteerAssignmentItemDto
{
    public string Id { get; set; } = string.Empty;
    public Guid? DatabaseId { get; set; }
    public string TaskTitle { get; set; } = string.Empty;
    public string Assigned { get; set; } = "Today";
    public string Deadline { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Coordinator { get; set; } = "Maya Fernando";
    public string Priority { get; set; } = "Medium";
    public string Status { get; set; } = "Offered"; // Offered, Accepted, In Progress, Completed, Declined
    public string NextAction { get; set; } = "Open task";
    public string ActionType { get; set; } = "open";
    public string Details { get; set; } = string.Empty;
    public string? Shift { get; set; }
    public decimal? AIMatchScore { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public string? Notes { get; set; }
}

public class UpdateAssignmentStatusDto
{
    public string Action { get; set; } = "Accept"; // Accept, Decline, Start, Complete
    public string? Notes { get; set; }
}

public class VolunteerDashboardDto
{
    public VolunteerProfileDto Profile { get; set; } = new();
    public VolunteerMetricsDto Metrics { get; set; } = new();
    public VolunteerUpcomingSummaryDto? UpcomingAssignment { get; set; }
    public List<VolunteerAssignmentItemDto> UpcomingList { get; set; } = new();
    public List<VolunteerNotificationItemDto> Notifications { get; set; } = new();
    public VolunteerActivitySummaryDto ActivitySummary { get; set; } = new();
    public List<VolunteerOpportunityDto> Opportunities { get; set; } = new();
    public List<VolunteerAssignmentItemDto> Assignments { get; set; } = new();
}

// -------------------------------------------------------------
// Volunteer Coordinator DTOs
// -------------------------------------------------------------

public class CoordinatorMetricsDto
{
    public int RegisteredVolunteers { get; set; }
    public string RegisteredSub { get; set; } = "Entire directory";
    public int VerificationPending { get; set; }
    public string VerificationSub { get; set; } = "6 due today";
    public int AvailableNow { get; set; }
    public string AvailableSub { get; set; } = "In service areas";
    public int ActiveAssignments { get; set; }
    public string ActiveSub { get; set; } = "12 shifts today";
    public int UnfilledTasks { get; set; }
    public string UnfilledSub { get; set; } = "3 high priority";
    public int CompletedActivities { get; set; }
    public string CompletedSub { get; set; } = "Across operation";
}

public class CoordinatorPriorityItemDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string Badge { get; set; } = "warning";
    public string BadgeText { get; set; } = "warning";
    public string TargetTab { get; set; } = "directory";
}

public class CoordinatorWorkflowStepDto
{
    public int Step { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "upcoming"; // completed, current, upcoming
}

public class CoordinatorActivityItemDto
{
    public string Id { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
}

public class VolunteerRosterItemDto
{
    public string Id { get; set; } = string.Empty;
    public Guid? DatabaseId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Skills { get; set; } = string.Empty;
    public string ServiceArea { get; set; } = string.Empty;
    public string Availability { get; set; } = "Available";
    public string CurrentShift { get; set; } = "None";
    public string Verification { get; set; } = "Verified";
    public string Status { get; set; } = "Eligible";
    public string StatusType { get; set; } = "eligible";
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public int TotalHours { get; set; } = 38;
}

public class CreateVolunteerRecordDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Skills { get; set; } = string.Empty;
    public string ServiceArea { get; set; } = "Kelani East";
    public string Availability { get; set; } = "Available";
    public string Status { get; set; } = "Eligible";
    public string Verification { get; set; } = "Verified";
    public string Notes { get; set; } = string.Empty;
}

public class AssignVolunteerShiftDto
{
    public string VolunteerId { get; set; } = string.Empty;
    public string ShiftTime { get; set; } = "08:00-14:00";
    public string ShiftTask { get; set; } = "Supply delivery";
    public string? ServiceArea { get; set; }
    public string? Note { get; set; }
}

public class VolunteerMatchingRecommendationDto
{
    public string TaskId { get; set; } = string.Empty;
    public string TaskTitle { get; set; } = string.Empty;
    public string RequiredSkill { get; set; } = string.Empty;
    public string Urgency { get; set; } = "Critical";
    public string Location { get; set; } = string.Empty;
    public int MatchScore { get; set; } = 96;
    public string MatchedVolunteerId { get; set; } = string.Empty;
    public string MatchedVolunteerName { get; set; } = string.Empty;
    public string MatchRationale { get; set; } = string.Empty;
    public string ProximityKm { get; set; } = "1.8 km";
}

public class VolunteerCoordinatorDashboardDto
{
    public string CoordinatorName { get; set; } = "Kavindi Rodrigo";
    public string CoordinatorRole { get; set; } = "Volunteer Coordinator";
    public string Operation { get; set; } = "Western Province Flood";
    public int NotificationCount { get; set; } = 2;
    public bool DutyStatus { get; set; } = true;
    public CoordinatorMetricsDto Metrics { get; set; } = new();
    public List<CoordinatorPriorityItemDto> PriorityAttentionItems { get; set; } = new();
    public List<CoordinatorWorkflowStepDto> ConnectedWorkflow { get; set; } = new();
    public List<CoordinatorActivityItemDto> RecentActivity { get; set; } = new();
    public List<VolunteerRosterItemDto> Volunteers { get; set; } = new();
}
