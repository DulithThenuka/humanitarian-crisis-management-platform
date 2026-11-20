namespace HumanitarianCrisisPlatform.Application.DTOs.Shelters;

public class UpdateShelterDto
{
    public string? Name { get; set; }
    public string? Address { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public int? TotalCapacity { get; set; }
    public int? CurrentOccupancy { get; set; }
    public string? Facilities { get; set; }
    public string? ContactPhone { get; set; }
    public bool? IsActive { get; set; }
    public string? Notes { get; set; }
}

