using HumanitarianCrisisPlatform.Application.Interfaces.Infrastructure;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Infrastructure.AI;

public class RuleBasedIncidentAIProvider : IIncidentAIProvider
{
    private static readonly string[] CriticalKeywords =
    {
        "flood", "overnight", "children", "cannot walk", "insulin", "urgent", "submerged",
        "boat", "rescue", "trapped", "bleeding", "unconscious", "infant", "rising", "critical"
    };

    private static readonly string[] HighKeywords =
    {
        "stranded", "wheelchair", "cut off", "water surge", "medicine", "exhausted", "baby formula", "injury", "severe"
    };

    public Task<IncidentAIReview> GenerateRecommendationAsync(
        Incident incident,
        IReadOnlyList<Incident> existingIncidents,
        CancellationToken cancellationToken = default)
    {
        var lower = (incident.Description ?? string.Empty).ToLowerInvariant();
        var criticalHits = CriticalKeywords.Count(k => lower.Contains(k));
        var highHits = HighKeywords.Count(k => lower.Contains(k));

        PriorityLevel recommendedPriority;
        decimal confidence;
        string reasoning;

        if (criticalHits >= 2 || incident.Priority == PriorityLevel.Critical)
        {
            recommendedPriority = PriorityLevel.Critical;
            confidence = 0.88m;
            reasoning = "Rule-based demonstration analysis: acute vulnerability indicators (children/elderly mobility or critical medical dependency) detected in citizen narrative.";
        }
        else if (criticalHits == 1 || highHits >= 1 || incident.Priority == PriorityLevel.High)
        {
            recommendedPriority = PriorityLevel.High;
            confidence = 0.84m;
            reasoning = "Rule-based demonstration analysis: significant hazard or accessibility constraint requires prioritized field coordination.";
        }
        else
        {
            recommendedPriority = PriorityLevel.Medium;
            confidence = 0.80m;
            reasoning = "Rule-based demonstration analysis: standard humanitarian supply or shelter support request requiring human verification.";
        }

        var categoryShort = incident.Category switch
        {
            IncidentCategory.EmergencyShelter => "shelter",
            IncidentCategory.Medicine => "medical support",
            IncidentCategory.Food => "food & water",
            IncidentCategory.Transport => "transport evacuation",
            _ => incident.CategoryDisplay.ToLowerInvariant()
        };

        var urgencyAssessment = $"Classify as {categoryShort} · {recommendedPriority.ToString().ToLowerInvariant()} priority";

        var nextActions = incident.Category switch
        {
            IncidentCategory.EmergencyShelter =>
                "Verify household head count and mobility constraints;Confirm accessible shelter capacity in operational sector;Dispatch shelter handoff after human decision",
            IncidentCategory.Medicine =>
                "Verify cold-chain medication specification;Coordinate with Medical Dispatch Unit;Confirm delivery window with household contact",
            IncidentCategory.Transport =>
                "Escalate boat/accessible transport requirement to Senior Incident Coordinator;Confirm water depth and pickup landmark;Log volunteer rescue handoff",
            _ =>
                "Verify household ration and infant formula requirements;Assign local distribution team;Notify citizen once dispatch is scheduled"
        };

        var duplicateCandidate = existingIncidents
            .FirstOrDefault(x => x.Id != incident.Id && x.CaseNumber == "HMR-1039")
            ?? existingIncidents.FirstOrDefault(x => x.Id != incident.Id);

        var review = new IncidentAIReview
        {
            Id = Guid.NewGuid(),
            IncidentId = incident.Id,
            ReferenceCode = "DEMO-AI-2051",
            RecommendedCategory = incident.CategoryDisplay,
            RecommendedPriority = recommendedPriority,
            UrgencyAssessment = urgencyAssessment,
            ConfidenceScore = confidence,
            Reasoning = reasoning,
            RecommendedNextActions = nextActions,
            DuplicateSuggestionCaseNumber = duplicateCandidate?.CaseNumber ?? "HMR-1039",
            DuplicateSimilarityScore = 0.24m,
            IsRuleBasedDemonstration = true,
            ProviderLabel = "Rule-Based Demonstration Decision Support (Human Review Required)",
            IsReviewedByHuman = false
        };

        return Task.FromResult(review);
    }
}

