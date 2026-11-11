namespace HumanitarianCrisisPlatform.Application.DTOs.Home;

public class HomeSummaryDto
{
    public HomeCrisisDto ActiveCrisis { get; set; } = new();
    public HomeMetricsDto Metrics { get; set; } = new();
    public List<HomeAssistanceCategoryDto> QuickCategories { get; set; } = new();
    public List<HomeShelterPreviewDto> VerifiedShelters { get; set; } = new();
    public List<HomeAlertDto> SafetyAlerts { get; set; } = new();
    public List<EmergencyContactDto> EmergencyHotlines { get; set; } = new();
}

public class HomeCrisisDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty;
    public string DisasterType { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int AffectedCount { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public DateTime StartDate { get; set; }
}

public class HomeMetricsDto
{
    public int PeopleSupported { get; set; }
    public int ActiveResponseOperations { get; set; }
    public double RequestsReviewedOnTimePercent { get; set; }
    public int OperationalSheltersCount { get; set; }
    public int TotalShelterCapacity { get; set; }
    public int CurrentShelterOccupancy { get; set; }
    public double ShelterOccupancyPercent { get; set; }
    public int ActiveGroundTeams { get; set; }
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
}

public class HomeAssistanceCategoryDto
{
    public string Key { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string CategoryParam { get; set; } = string.Empty;
    public int OpenRequestsCount { get; set; }
}

public class HomeShelterPreviewDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public int TotalCapacity { get; set; }
    public int CurrentOccupancy { get; set; }
    public int AvailableBeds { get; set; }
    public double OccupancyPercent { get; set; }
    public bool IsOperational { get; set; }
    public string? ContactNumber { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
}

public class HomeAlertDto
{
    public string Id { get; set; } = string.Empty;
    public string Level { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public DateTime IssuedAt { get; set; }
}

public class EmergencyContactDto
{
    public string Name { get; set; } = string.Empty;
    public string Number { get; set; } = string.Empty;
    public string Service { get; set; } = string.Empty;
    public string Hours { get; set; } = string.Empty;
}

public class TrackRequestResultDto
{
    public Guid Id { get; set; }
    public string PublicReference { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Urgency { get; set; } = string.Empty;
    public string CoarseLocation { get; set; } = string.Empty;
    public int PeopleCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? AssignedTeam { get; set; }
    public string? StatusNote { get; set; }
    public List<RequestTimelineStepDto> Timeline { get; set; } = new();
}

public class RequestTimelineStepDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public bool IsCompleted { get; set; }
    public bool IsCurrent { get; set; }
}

public class SafetyGuidanceDto
{
    public string HazardType { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<string> ActionItems { get; set; } = new();
    public List<string> PackItems { get; set; } = new();
}

