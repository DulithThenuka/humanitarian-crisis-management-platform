using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Application.DTOs.AI;

public class HumanOverrideDto
{
    public Guid DecisionAuditId { get; set; }
    public PriorityLevel OverriddenPriority { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Action { get; set; } = "Override"; // Override or Approve
}
