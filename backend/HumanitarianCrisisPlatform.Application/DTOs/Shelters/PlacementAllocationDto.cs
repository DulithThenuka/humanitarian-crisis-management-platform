namespace HumanitarianCrisisPlatform.Application.DTOs.Shelters;

public class PlacementAllocationDto
{
    public Guid Id { get; set; }
    public string AllocationCode { get; set; } = string.Empty;
    public string EvacueeName { get; set; } = string.Empty;
    public string HeadOfFamily { get; set; } = string.Empty;
    public int PartySize { get; set; } = 1;
    public Guid ShelterId { get; set; }
    public string AssignedShelter { get; set; } = string.Empty;
    public string? AccessibilityNeeded { get; set; }
    public string? SpecialNotes { get; set; }
    public string Status { get; set; } = "Confirmed"; // Confirmed, Pending Reallocation, In Review, Discharged
    public string StatusType { get; set; } = "success"; // success, critical, warning, info
    public string AllocatedAt { get; set; } = string.Empty;
    public DateTime CheckInDate { get; set; }
    public DateTime? CheckOutDate { get; set; }
}

public class CreatePlacementDto
{
    public Guid ShelterId { get; set; }
    public Guid? AssistanceRequestId { get; set; }
    public string PersonName { get; set; } = string.Empty;
    public string? HeadOfFamily { get; set; }
    public int NumberOfPersons { get; set; } = 1;
    public string? AccessibilityNeeded { get; set; }
    public string? SpecialNotes { get; set; }
    public string? Notes { get; set; }
}

public class UpdatePlacementStatusDto
{
    public string Status { get; set; } = "Confirmed"; // Confirmed, Pending Reallocation, In Review, Discharged
    public Guid? TargetShelterId { get; set; }
    public string? Notes { get; set; }
}

