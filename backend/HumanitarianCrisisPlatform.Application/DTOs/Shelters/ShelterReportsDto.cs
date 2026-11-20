namespace HumanitarianCrisisPlatform.Application.DTOs.Shelters;

public class ShelterReportsDto
{
    public ShelterDailySummaryDto DailySummary { get; set; } = new();
    public List<ShelterAreaOccupancyDto> AreaOccupancies { get; set; } = new();
}

public class ShelterDailySummaryDto
{
    public int TotalAdmissions { get; set; }
    public int Discharges { get; set; }
    public string OccupancyRateAverage { get; set; } = "0%";
    public int SafetyCompliantShelters { get; set; }
    public int PendingSafetyInspections { get; set; }
}

public class ShelterAreaOccupancyDto
{
    public string Area { get; set; } = string.Empty;
    public double Rate { get; set; }
    public int TotalCap { get; set; }
    public int Occupied { get; set; }
}

public class ExportReportRequestDto
{
    public string ReportType { get; set; } = "full-occupancy"; // full-occupancy, capacity-bottlenecks, evacuee-placements, logistics-supply
    public string Format { get; set; } = "pdf"; // pdf, csv, json
}

public class ExportReportResponseDto
{
    public string ReportType { get; set; } = string.Empty;
    public string Format { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public string FileBase64 { get; set; } = string.Empty;
    public string GeneratedAt { get; set; } = string.Empty;
    public int RecordCount { get; set; }
}

