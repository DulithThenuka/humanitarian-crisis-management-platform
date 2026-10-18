using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Application.DTOs.AI;

public class AIPriorityEvaluationDto
{
    public decimal PriorityScore { get; set; } // 0-100
    public decimal ConfidenceScore { get; set; } // 0-1
    public PriorityLevel RecommendedPriority { get; set; }
    public string Reasoning { get; set; } = string.Empty;
    public List<string> ExtractedEntities { get; set; } = new();
}
