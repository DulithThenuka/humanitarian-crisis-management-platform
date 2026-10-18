using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Application.DTOs.Resources;

public class AllocateResourceDto
{
    public Guid ResourceId { get; set; }
    public Guid? AssistanceRequestId { get; set; }
    public Guid? ShelterId { get; set; }
    public decimal Quantity { get; set; }
    public PriorityLevel Priority { get; set; } = PriorityLevel.Medium;
    public string? Notes { get; set; }
}
