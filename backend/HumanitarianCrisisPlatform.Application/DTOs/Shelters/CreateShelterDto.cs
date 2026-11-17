namespace HumanitarianCrisisPlatform.Application.DTOs.Shelters;

public class CreateShelterDto
{
    public string Name { get; set; } = string.Empty;
    public string? FacilityName { get; set; }
    public string Address { get; set; } = string.Empty;
    public string? Area { get; set; }
    public decimal Latitude { get; set; } = 6.9271m;
    public decimal Longitude { get; set; } = 79.8612m;
    public int TotalCapacity { get; set; }
    public int? Capacity { get; set; }
    public int CurrentOccupancy { get; set; } = 0;
    public int? Occupied { get; set; }
    public string? Facilities { get; set; }
    public string? Accessibility { get; set; }
    public string? ContactPhone { get; set; }
    public string? ManagerContact { get; set; }
    public string? Status { get; set; } = "Operational";
    public string? Notes { get; set; }
    public Guid? CrisisEventId { get; set; }
}

