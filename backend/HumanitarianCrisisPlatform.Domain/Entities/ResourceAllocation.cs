using HumanitarianCrisisPlatform.Domain.Common;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Domain.Entities;

public class ResourceAllocation : AuditableEntity
{
    public Guid ResourceId { get; set; }
    public Resource? Resource { get; set; }
    public Guid? AssistanceRequestId { get; set; }
    public AssistanceRequest? AssistanceRequest { get; set; }
    public Guid? ShelterId { get; set; }
    public Shelter? Shelter { get; set; }
    public decimal Quantity { get; set; }
    public int DispatchStatus { get; set; } = 0;
    public PriorityLevel Priority { get; set; } = PriorityLevel.Medium;
    public DateTime? DispatchedAt { get; set; }
    public DateTime? DeliveredAt { get; set; }
    public string? Notes { get; set; }
}
