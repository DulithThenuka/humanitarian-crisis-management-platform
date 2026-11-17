using HumanitarianCrisisPlatform.Domain.Common;
using HumanitarianCrisisPlatform.Domain.Enums;
using HumanitarianCrisisPlatform.Domain.Exceptions;

namespace HumanitarianCrisisPlatform.Domain.Entities;

public class IncidentAIReview : AuditableEntity
{
    public Guid IncidentId { get; set; }
    public Incident? Incident { get; set; }

    public string ReferenceCode { get; set; } = string.Empty;
    public string RecommendedCategory { get; set; } = string.Empty;
    public PriorityLevel RecommendedPriority { get; set; } = PriorityLevel.Medium;
    public string UrgencyAssessment { get; set; } = string.Empty;
    public decimal ConfidenceScore { get; set; } = 0.85m;
    public string Reasoning { get; set; } = string.Empty;
    public string RecommendedNextActions { get; set; } = string.Empty;
    public string? DuplicateSuggestionCaseNumber { get; set; }
    public decimal? DuplicateSimilarityScore { get; set; }
    public bool IsRuleBasedDemonstration { get; set; } = true;
    public string ProviderLabel { get; set; } = "Rule-Based Demonstration Decision Support";

    // Human review & governance fields (AI never auto-rejects)
    public bool IsReviewedByHuman { get; set; } = false;
    public string? HumanDecision { get; set; }
    public string? DecisionReason { get; set; }
    public PriorityLevel? FinalPriority { get; set; }
    public Guid? ReviewedByUserId { get; set; }
    public User? ReviewedByUser { get; set; }
    public string? ReviewedByName { get; set; }
    public DateTime? ReviewedAt { get; set; }

    public void ValidateDecision(string decision, string reason)
    {
        if (string.IsNullOrWhiteSpace(decision))
            throw new DomainException("Human decision is required.");

        if (string.IsNullOrWhiteSpace(reason))
            throw new DomainException("A justification reason is required when recording a human decision on an AI review.");
    }
}

