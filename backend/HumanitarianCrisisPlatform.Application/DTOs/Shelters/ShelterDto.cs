namespace HumanitarianCrisisPlatform.Application.DTOs.Shelters;

public class ShelterDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string FacilityName { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
<<<<<<< Updated upstream
=======
    public string District { get; set; } = string.Empty;
    public string Area { get; set; } = string.Empty;
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public int TotalCapacity { get; set; }
    public int CurrentOccupancy { get; set; }
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    public int AvailableCapacity => TotalCapacity - CurrentOccupancy;
=======
=======
>>>>>>> Stashed changes
    public int Capacity => TotalCapacity;
    public int Occupied => CurrentOccupancy;
    public int Available => AvailableCapacity;
    public int AvailableCapacity => Math.Max(0, TotalCapacity - CurrentOccupancy);
    public double OccupancyPercent => TotalCapacity > 0 ? Math.Round((double)CurrentOccupancy / TotalCapacity * 100, 1) : 0;
    public string Status { get; set; } = "Operational";
    public string StatusType { get; set; } = "success";
    public bool GuardActive { get; set; } = true;
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    public string? Facilities { get; set; }
    public string? Accessibility => Facilities;
    public string? ContactPhone { get; set; }
    public string? ManagerContact => ContactPhone;
    public string? Notes { get; set; }
    public bool IsActive { get; set; } = true;
    public double? DistanceKm { get; set; }
}
