namespace HumanitarianCrisisPlatform.Application.DTOs.Incidents;

public class IncidentAIReviewDto
{
    public Guid Id { get; set; }
    public Guid IncidentId { get; set; }
    public string CaseId { get; set; } = string.Empty;
    public string ReferenceCode { get; set; } = string.Empty;
    public string RecommendedCategory { get; set; } = string.Empty;
    public string RecommendedPriority { get; set; } = string.Empty;
    public string UrgencyAssessment { get; set; } = string.Empty;
    public decimal ConfidenceScore { get; set; }
    public int ConfidencePercent { get; set; }
    public string Reasoning { get; set; } = string.Empty;
    public List<string> RecommendedNextActions { get; set; } = new();
    public List<AIReviewFactorDto> Factors { get; set; } = new();
    public string? DuplicateSuggestionCaseNumber { get; set; }
    public decimal? DuplicateSimilarityScore { get; set; }
    public bool IsRuleBasedDemonstration { get; set; } = true;
    public string ProviderLabel { get; set; } = "Rule-Based Demonstration Decision Support";
    public bool IsReviewedByHuman { get; set; }
    public string? HumanDecision { get; set; }
    public string? DecisionReason { get; set; }
    public string? ReviewedByName { get; set; }
    public DateTime? ReviewedAt { get; set; }
}

public class AIReviewFactorDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Desc { get; set; } = string.Empty;
    public string Tag { get; set; } = string.Empty;
    public string TagType { get; set; } = string.Empty;
}

public class RecordAIReviewDecisionDto
{
    public string Decision { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public string? OverriddenPriority { get; set; }
}

