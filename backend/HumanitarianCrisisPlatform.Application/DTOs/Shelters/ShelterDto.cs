namespace HumanitarianCrisisPlatform.Application.DTOs.Shelters;

public class ShelterDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public int TotalCapacity { get; set; }
    public int CurrentOccupancy { get; set; }
    public int AvailableCapacity => TotalCapacity - CurrentOccupancy;
    public string? Facilities { get; set; }
    public string? ContactPhone { get; set; }
    public bool IsActive { get; set; }
    public double? DistanceKm { get; set; }
}
