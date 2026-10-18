using HumanitarianCrisisPlatform.Domain.Common;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Domain.Entities;

public class AIDecisionAudit : AuditableEntity
{
    public Guid AssistanceRequestId { get; set; }
    public AssistanceRequest? AssistanceRequest { get; set; }
    public string AISuggestion { get; set; } = string.Empty;
    public decimal ConfidenceScore { get; set; }
    public PriorityLevel SuggestedPriority { get; set; }
    public bool WasOverridden { get; set; } = false;
    public string? HumanDecision { get; set; }
    public Guid? OverriddenBy { get; set; }
    public User? Overrider { get; set; }
    public string? OverrideReason { get; set; }
    public DateTime? ReviewedAt { get; set; }
}
