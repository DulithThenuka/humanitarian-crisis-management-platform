namespace HumanitarianCrisisPlatform.Application.DTOs.Resources;

public class ActivityLogItemDto
{
    public string Id { get; set; } = string.Empty;
    public string Reference { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string RelatedRecord { get; set; } = string.Empty;
    public string UserTeam { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string Detail { get; set; } = string.Empty;
    public string Status { get; set; } = "Recorded";
    public DateTime Timestamp { get; set; }
}

public class DutyStatusDto
{
    public bool IsOnDuty { get; set; }
    public string OfficerName { get; set; } = "Dilan Perera";
    public string Role { get; set; } = "Relief / Resource Manager";
    public string AssignedDistrict { get; set; } = "Western Province Flood Response";
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
