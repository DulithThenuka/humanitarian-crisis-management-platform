using System.ComponentModel.DataAnnotations;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Application.DTOs.Coordinator;

public class CrisisEventResponseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DisasterType DisasterType { get; set; }
    public string DisasterTypeName => DisasterType.ToString();
    public int Severity { get; set; }
    public string SeverityLabel => Severity >= 4 ? "Critical" : Severity == 3 ? "High" : "Medium";
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public decimal? AffectedAreaRadius { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public int TotalRequestsCount { get; set; }
    public int TotalSheltersCount { get; set; }
}

public class CreateCrisisEventDto
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    public DisasterType DisasterType { get; set; } = DisasterType.Flood;

    [Range(1, 5)]
    public int Severity { get; set; } = 3;

    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public decimal? AffectedAreaRadius { get; set; }
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    public DateTime? EndDate { get; set; }
}

public class UpdateCrisisEventStatusDto
{
    public bool IsActive { get; set; }
    public DateTime? EndDate { get; set; }
}
