namespace HumanitarianCrisisPlatform.Application.DTOs.Coordinator;

public class CoordinatorDecisionHistoryDto
{
    public DecisionHistorySummaryDto Summary { get; set; } = new();
    public IReadOnlyList<DecisionHistoryItemDto> Records { get; set; } = Array.Empty<DecisionHistoryItemDto>();
}

public class DecisionHistorySummaryDto
{
    public int DecisionsToday { get; set; }
    public int AIReviews { get; set; }
    public int Escalations { get; set; }
}

public class DecisionHistoryItemDto
{
    public string Id { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string RelatedRecord { get; set; } = string.Empty;
    public string Coordinator { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public string Status { get; set; } = "Verified";
    public string StatusClass { get; set; } = "pill-verified";
}
