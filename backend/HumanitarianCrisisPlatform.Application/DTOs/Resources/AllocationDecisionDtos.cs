using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Application.DTOs.Resources;

public class ResourceAllocationRequestDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public Guid ResourceId { get; set; }
    public string Item { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Cluster { get; set; } = string.Empty;
    public decimal RequestedQty { get; set; }
    public decimal AvailableQty { get; set; }
    public decimal RemainingStock => Math.Max(0, AvailableQty - RequestedQty);
    public string Priority { get; set; } = "Medium";
    public string PriorityTag { get; set; } = "warning";
    public string Destination { get; set; } = "Emergency Relief Center";
    public string RelatedRecord { get; set; } = string.Empty;
    public string Coordinator { get; set; } = "Emergency Coordinator";
    public int DispatchStatus { get; set; }
    public string StatusBadge { get; set; } = "pending";
    public string? Notes { get; set; }
    public string? ManagerNote { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? DispatchedAt { get; set; }
    public DateTime? DeliveredAt { get; set; }
}

public class ApproveAllocationDto
{
    public decimal? ApprovedQuantity { get; set; }
    public string? ManagerNote { get; set; }
}

public class RejectAllocationDto
{
    public string Reason { get; set; } = string.Empty;
}
