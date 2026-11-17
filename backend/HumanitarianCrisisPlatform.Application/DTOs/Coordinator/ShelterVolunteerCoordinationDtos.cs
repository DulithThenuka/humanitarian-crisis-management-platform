using System.ComponentModel.DataAnnotations;

namespace HumanitarianCrisisPlatform.Application.DTOs.Coordinator;

/// <summary>
/// Root dashboard DTO for Emergency Coordinator Shelter and Volunteer coordination.
/// </summary>
public class ShelterVolunteerDashboardDto
{
    public ShelterVolunteerMetricsDto Metrics { get; set; } = new();
    public List<CoordinatorShelterDto> Shelters { get; set; } = new();
    public List<CoordinatorShelterRecommendationDto> ShelterRecommendations { get; set; } = new();
    public List<CoordinatorShelterPlacementRequestDto> ShelterRequests { get; set; } = new();
    public List<CoordinatorVolunteerRequirementDto> VolunteerRequirements { get; set; } = new();
    public List<CoordinatorVolunteerAssignmentRequestDto> VolunteerRequests { get; set; } = new();
    public VolunteerAvailabilitySummaryDto VolunteerSummary { get; set; } = new();
    public List<UnifiedCoordinationHistoryDto> UnifiedHistory { get; set; } = new();
}

/// <summary>
/// Top-level KPI metrics for shelter capacity and coordination requests.
/// </summary>
public class ShelterVolunteerMetricsDto
{
    public int AvailableShelterCapacity { get; set; }
    public int ActiveShelterRequests { get; set; }
    public int PendingVolunteerRequests { get; set; }
    public int ApprovedCoordinationRequests { get; set; }
    public int TotalSheltersCount { get; set; }
    public int TotalVolunteersCount { get; set; }
}

/// <summary>
/// Detailed shelter information card DTO for Emergency Coordinator.
/// </summary>
public class CoordinatorShelterDto
{
    public Guid Id { get; set; }
    public string ShelterCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public int TotalCapacity { get; set; }
    public int CurrentOccupancy { get; set; }
    public int RemainingCapacity { get; set; }
    public decimal UtilizationPercentage { get; set; }
    public string Status { get; set; } = "Operational";
    public List<string> Facilities { get; set; } = new();
    public string AccessibilityInfo { get; set; } = string.Empty;
    public string? ContactPhone { get; set; }
    public DateTime LastUpdated { get; set; }
    public int SuitabilityScore { get; set; } = 85;
    public List<string> SuitabilityReasons { get; set; } = new();
    public string SuitabilityStatus { get; set; } = "Suitable";
}

/// <summary>
/// Recommendation DTO suggesting suitable shelters for active incidents.
/// </summary>
public class CoordinatorShelterRecommendationDto
{
    public Guid ShelterId { get; set; }
    public string ShelterName { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public int RemainingCapacity { get; set; }
    public string IncidentCaseNumber { get; set; } = string.Empty;
    public int MatchScore { get; set; }
    public string RecommendationRationale { get; set; } = string.Empty;
    public string AccessibilityFacilities { get; set; } = string.Empty;
    public string OperationalStatus { get; set; } = "Operational";
    public int PeopleNeedingPlacement { get; set; }
}

/// <summary>
/// Shelter placement request submitted by Coordinator to Shelter Manager.
/// </summary>
public class CoordinatorShelterPlacementRequestDto
{
    public Guid Id { get; set; }
    public string RequestNumber { get; set; } = string.Empty;
    public Guid ShelterId { get; set; }
    public string ShelterName { get; set; } = string.Empty;
    public string ShelterLocation { get; set; } = string.Empty;
    public string RelatedIncident { get; set; } = string.Empty;
    public Guid? RelatedAssistanceRequestId { get; set; }
    public int NumberOfPersons { get; set; }
    public string? SpecialRequirements { get; set; }
    public string? AccessibilityNeeds { get; set; }
    public string Priority { get; set; } = "High";
    public string? CoordinatorNotes { get; set; }
    public string Status { get; set; } = "Submitted";
    public string ShelterManagerResponse { get; set; } = string.Empty;
    public string SubmittedBy { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public DateTime LastUpdatedAt { get; set; }
}

/// <summary>
/// Form DTO for submitting a shelter placement request.
/// </summary>
public class SubmitShelterPlacementRequestDto
{
    [Required]
    public Guid ShelterId { get; set; }

    public string? RelatedIncident { get; set; }

    public Guid? RelatedAssistanceRequestId { get; set; }

    [Range(1, 10000, ErrorMessage = "Number of persons must be at least 1.")]
    public int NumberOfPersons { get; set; } = 1;

    public string? SpecialRequirements { get; set; }

    public string? AccessibilityNeeds { get; set; }

    public string Priority { get; set; } = "High";

    public string? CoordinatorNotes { get; set; }
}

/// <summary>
/// Overview of volunteer requirement identified from active incidents.
/// </summary>
public class CoordinatorVolunteerRequirementDto
{
    public string Id { get; set; } = string.Empty;
    public string RelatedIncident { get; set; } = string.Empty;
    public int RequiredVolunteers { get; set; }
    public string RequiredSkills { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public DateTime RequiredDate { get; set; }
    public string Priority { get; set; } = "High";
    public string Status { get; set; } = "Active Requirement";
    public string TaskDescription { get; set; } = string.Empty;
}

/// <summary>
/// Volunteer assignment request submitted by Coordinator to Volunteer Manager.
/// </summary>
public class CoordinatorVolunteerAssignmentRequestDto
{
    public Guid Id { get; set; }
    public string RequestNumber { get; set; } = string.Empty;
    public string RelatedIncident { get; set; } = string.Empty;
    public Guid? RelatedAssistanceRequestId { get; set; }
    public int RequiredVolunteerCount { get; set; }
    public int ApprovedOrAssignedCount { get; set; }
    public string RequiredSkills { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public DateTime RequiredDate { get; set; }
    public string Priority { get; set; } = "High";
    public string TaskDescription { get; set; } = string.Empty;
    public string? AdditionalInstructions { get; set; }
    public string Status { get; set; } = "Submitted";
    public string VolunteerManagerResponse { get; set; } = string.Empty;
    public string SubmittedBy { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public DateTime LastUpdatedAt { get; set; }
}

/// <summary>
/// Form DTO for submitting a volunteer assignment request.
/// </summary>
public class SubmitVolunteerAssignmentRequestDto
{
    [Required]
    public string RelatedIncident { get; set; } = string.Empty;

    public Guid? RelatedAssistanceRequestId { get; set; }

    [Range(1, 1000, ErrorMessage = "Required volunteer count must be at least 1.")]
    public int RequiredVolunteerCount { get; set; } = 1;

    [Required]
    public string RequiredSkills { get; set; } = string.Empty;

    [Required]
    public string Location { get; set; } = string.Empty;

    public DateTime? RequiredDate { get; set; }

    public string Priority { get; set; } = "High";

    [Required]
    public string TaskDescription { get; set; } = string.Empty;

    public string? AdditionalInstructions { get; set; }
}

/// <summary>
/// High-level summary of volunteer availability without exposing private details.
/// </summary>
public class VolunteerAvailabilitySummaryDto
{
    public int TotalRegisteredVolunteers { get; set; }
    public int AvailableVolunteers { get; set; }
    public int OnAssignmentVolunteers { get; set; }
    public List<SkillSummaryDto> TopSkills { get; set; } = new();
    public List<string> GeneralAreas { get; set; } = new();
}

public class SkillSummaryDto
{
    public string Skill { get; set; } = string.Empty;
    public int Count { get; set; }
}

/// <summary>
/// Combined coordination request history item (Shelter Placement or Volunteer Assignment).
/// </summary>
public class UnifiedCoordinationHistoryDto
{
    public Guid Id { get; set; }
    public string RequestNumber { get; set; } = string.Empty;
    public string RequestType { get; set; } = string.Empty; // "Shelter Placement" | "Volunteer Assignment"
    public string RelatedIncident { get; set; } = string.Empty;
    public string TargetName { get; set; } = string.Empty; // Shelter name or Task title
    public int QuantityOrCount { get; set; }
    public string Priority { get; set; } = "High";
    public string Status { get; set; } = "Submitted";
    public DateTime SubmittedAt { get; set; }
    public DateTime LastUpdatedAt { get; set; }
    public string ManagerResponse { get; set; } = string.Empty;
    public string SubmittedBy { get; set; } = string.Empty;
    public string Details { get; set; } = string.Empty;
}

