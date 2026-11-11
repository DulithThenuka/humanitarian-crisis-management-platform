namespace HumanitarianCrisisPlatform.Application.DTOs.Shelters;

public class ShelterSummaryDto
{
    public int TotalShelters { get; set; }
    public int TotalCapacity { get; set; }
    public int CurrentOccupancy { get; set; }
    public int AvailableBeds { get; set; }
    public double OccupancyPercent { get; set; }
    public int OpenSheltersCount { get; set; }
    public int LimitedSheltersCount { get; set; }
    public int FullSheltersCount { get; set; }
    public List<DistrictShelterCountDto> DistrictCounts { get; set; } = new();
}

public class DistrictShelterCountDto
{
    public string District { get; set; } = string.Empty;
    public int ShelterCount { get; set; }
    public int TotalCapacity { get; set; }
    public int CurrentOccupancy { get; set; }
    public int AvailableBeds { get; set; }
}

