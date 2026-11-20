using System.ComponentModel.DataAnnotations;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Application.DTOs.Crisis;

public class CrisisSummaryStatsDto
{
    public int TotalCrises { get; set; }
    public int ActiveCrises { get; set; }
    public int HighSeverityCrises { get; set; }
    public int TotalEstimatedAffected { get; set; }
    public int ActiveSheltersCount { get; set; }
    public int OpenRequestsCount { get; set; }
    public int DispatchedResponseUnits { get; set; }
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
}

public class CrisisEventDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DisasterType DisasterType { get; set; }
    public string DisasterTypeName => DisasterType.ToString();
    public int Severity { get; set; }
    public string SeverityLabel { get; set; } = string.Empty;
    public string SeverityClass { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public decimal? AffectedAreaRadius { get; set; }
    public int EstimatedAffectedCount { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsActive { get; set; }
    public string Status { get; set; } = "Active Response";
    public string? AssignedLeadTeam { get; set; }
    public int OpenRequestsCount { get; set; }
    public int LinkedSheltersCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CrisisDetailDto : CrisisEventDto
{
    public List<CrisisLinkedRequestDto> RecentRequests { get; set; } = new();
    public List<CrisisLinkedShelterDto> OperationalShelters { get; set; } = new();
    public List<CrisisResponseUnitDto> DeployedUnits { get; set; } = new();
    public List<CrisisHazardZoneDto> HazardZones { get; set; } = new();
    public List<CrisisOperationalIssueDto> UnresolvedIssues { get; set; } = new();
}

public class CrisisLinkedRequestDto
{
    public Guid Id { get; set; }
    public string ReferenceNumber { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public PriorityLevel Urgency { get; set; }
    public RequestStatus Status { get; set; }
    public int NumberOfPeople { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CrisisLinkedShelterDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public int TotalCapacity { get; set; }
    public int CurrentOccupancy { get; set; }
    public double OccupancyRate { get; set; }
    public bool IsActive { get; set; }
}

public class CrisisResponseUnitDto
{
    public string UnitName { get; set; } = string.Empty;
    public string Leader { get; set; } = string.Empty;
    public string Status { get; set; } = "Deployed";
    public string OperationalDirective { get; set; } = string.Empty;
    public DateTime DeployedAt { get; set; }
}

public class CrisisOperationalIssueDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public int Percentage { get; set; }
    public string Severity { get; set; } = "High";
}

public class CrisisHazardZoneDto
{
    public string ZoneName { get; set; } = string.Empty;
    public string RiskLevel { get; set; } = "High Risk";
    public string PolygonColor { get; set; } = "#ef4444";
    public List<decimal[]> Coordinates { get; set; } = new();
}

public class CreateCrisisEventDto
{
    [Required]
    [StringLength(200, MinimumLength = 3)]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required]
    public DisasterType DisasterType { get; set; } = DisasterType.Flood;

    [Range(1, 5)]
    public int Severity { get; set; } = 3;

    [StringLength(200)]
    public string Region { get; set; } = "Western Province";

    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public decimal? AffectedAreaRadius { get; set; } = 15.0m;
    public int EstimatedAffectedCount { get; set; } = 1000;
    public string? LeadTeam { get; set; } = "National Emergency Relief Unit";
}

public class UpdateCrisisEventDto
{
    [Required]
    [StringLength(200, MinimumLength = 3)]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required]
    public DisasterType DisasterType { get; set; }

    [Range(1, 5)]
    public int Severity { get; set; }

    [StringLength(200)]
    public string? Region { get; set; }

    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public decimal? AffectedAreaRadius { get; set; }
    public int EstimatedAffectedCount { get; set; }
    public bool IsActive { get; set; } = true;
    public string? LeadTeam { get; set; }
}

public class CloseCrisisDto
{
    public string? ResolutionSummary { get; set; }
    public DateTime? ClosedAt { get; set; }
}

public class AssignCrisisTeamDto
{
    [Required]
    [StringLength(150, MinimumLength = 2)]
    public string TeamName { get; set; } = string.Empty;

    public string? OperationalDirectives { get; set; }
    public string? ContactLeader { get; set; }
}

