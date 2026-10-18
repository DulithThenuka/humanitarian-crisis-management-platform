using HumanitarianCrisisPlatform.Application.DTOs.AI;
using HumanitarianCrisisPlatform.Application.Interfaces.Infrastructure;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Infrastructure.AI;

public class RuleBasedFallbackAIService : IAIServiceClient
{
    private static readonly string[] CriticalKeywords = { "trapped", "bleeding", "unconscious", "infant", "elderly", "collapsing", "drowning", "critical", "urgent", "death" };
    private static readonly string[] HighKeywords = { "injury", "broken", "severe", "shortage", "stranded", "medicines", "hypothermia", "flood" };
    private static readonly string[] MediumKeywords = { "food", "water", "blankets", "shelter", "clean water", "clothing" };

    public Task<AIPriorityEvaluationDto> ClassifyUrgencyAsync(string text, string category, CancellationToken cancellationToken = default)
    {
        var lower = text.ToLowerInvariant();
        var criticalMatches = CriticalKeywords.Count(k => lower.Contains(k));
        var highMatches = HighKeywords.Count(k => lower.Contains(k));
        var mediumMatches = MediumKeywords.Count(k => lower.Contains(k));

        PriorityLevel priority;
        decimal score;
        decimal confidence = 0.85m;
        string reason;

        if (criticalMatches > 0)
        {
            priority = PriorityLevel.Critical;
            score = 90m + Math.Min(criticalMatches * 3, 10);
            reason = $"Critical keywords detected: life-threatening indicators present.";
        }
        else if (highMatches > 0)
        {
            priority = PriorityLevel.High;
            score = 70m + Math.Min(highMatches * 4, 15);
            reason = $"High priority indicators detected regarding injury or acute hazards.";
        }
        else if (mediumMatches > 0)
        {
            priority = PriorityLevel.Medium;
            score = 45m + Math.Min(mediumMatches * 5, 20);
            reason = $"Supplies and shelter requested without immediate life threat.";
        }
        else
        {
            priority = PriorityLevel.Low;
            score = 25m;
            reason = "General assistance request with standard priority.";
        }

        return Task.FromResult(new AIPriorityEvaluationDto
        {
            PriorityScore = score,
            ConfidenceScore = confidence,
            RecommendedPriority = priority,
            Reasoning = reason
        });
    }

    public Task<DuplicateDetectionResultDto> DetectDuplicateAsync(string text, IEnumerable<string> existingCases, CancellationToken cancellationToken = default)
    {
        var lower = text.ToLowerInvariant().Split(' ', StringSplitOptions.RemoveEmptyEntries).ToHashSet();
        foreach (var existing in existingCases)
        {
            var exTokens = existing.ToLowerInvariant().Split(' ', StringSplitOptions.RemoveEmptyEntries).ToHashSet();
            var intersect = lower.Intersect(exTokens).Count();
            var union = lower.Union(exTokens).Count();
            var jaccard = union == 0 ? 0 : (decimal)intersect / union;

            if (jaccard > 0.65m)
            {
                return Task.FromResult(new DuplicateDetectionResultDto
                {
                    IsDuplicate = true,
                    SimilarityScore = jaccard,
                    Reason = $"Semantic overlap of {jaccard:P0} with an existing incident report."
                });
            }
        }

        return Task.FromResult(new DuplicateDetectionResultDto
        {
            IsDuplicate = false,
            SimilarityScore = 0m,
            Reason = "No significant textual similarity found with existing open cases."
        });
    }
}
