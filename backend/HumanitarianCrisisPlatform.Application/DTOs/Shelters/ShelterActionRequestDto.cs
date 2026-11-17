namespace HumanitarianCrisisPlatform.Application.DTOs.Shelters;

public class ShelterActionRequestDto
{
    public string ActionType { get; set; } = "allocation"; // allocation, clarification, escalation
    public string Reason { get; set; } = string.Empty;
    public int? AdditionalOccupants { get; set; } = 1;
}

public class ShelterActionResultDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string ActionType { get; set; } = string.Empty;
    public Guid ShelterId { get; set; }
    public string ShelterName { get; set; } = string.Empty;
    public int UpdatedOccupancy { get; set; }
    public int UpdatedAvailable { get; set; }
    public string UpdatedStatus { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

