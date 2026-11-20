using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Application.DTOs.Shelters;

public class ShelterResourceRequestDto
{
    public Guid Id { get; set; }
    public string RequestCode { get; set; } = string.Empty;
    public Guid ShelterId { get; set; }
    public string ShelterName { get; set; } = string.Empty;
    public Guid? ResourceId { get; set; }
    public string ItemCategory { get; set; } = string.Empty;
    public string RequestedQuantity { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public string Urgency { get; set; } = "High"; // Critical, High, Medium, Low
    public string UrgencyType { get; set; } = "warning"; // critical, warning, info
    public string Status { get; set; } = "Pending"; // Pending, Approved, Dispatched, Delivered, Cancelled
    public string StatusType { get; set; } = "info"; // critical, warning, info, success
    public string RequestedBy { get; set; } = string.Empty;
    public string Eta { get; set; } = string.Empty;
    public DateTime? DispatchedAt { get; set; }
    public DateTime? DeliveredAt { get; set; }
    public string? Notes { get; set; }
}

public class CreateShelterResourceRequestDto
{
    public Guid ShelterId { get; set; }
    public Guid? ResourceId { get; set; }
    public string ItemCategory { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public string? Unit { get; set; }
    public PriorityLevel Priority { get; set; } = PriorityLevel.High;
    public string? Notes { get; set; }
}

public class UpdateShelterResourceStatusDto
{
    public int DispatchStatus { get; set; } // 0=Pending, 1=Dispatched, 2=Delivered, 3=Cancelled
    public string? Notes { get; set; }
}

