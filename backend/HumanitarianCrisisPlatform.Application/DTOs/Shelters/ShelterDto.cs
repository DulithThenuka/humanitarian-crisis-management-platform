namespace HumanitarianCrisisPlatform.Application.DTOs.Shelters;

public class ShelterDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public int TotalCapacity { get; set; }
    public int CurrentOccupancy { get; set; }
    public int AvailableCapacity => Math.Max(0, TotalCapacity - CurrentOccupancy);
    public double OccupancyPercent => TotalCapacity > 0 ? Math.Round((double)CurrentOccupancy / TotalCapacity * 100, 1) : 0;
    public string Status { get; set; } = "Open";
    public string? Facilities { get; set; }
    public string? ContactPhone { get; set; }
    public bool IsActive { get; set; }
    public double? DistanceKm { get; set; }
    public List<string> Amenities { get; set; } = new();
}
