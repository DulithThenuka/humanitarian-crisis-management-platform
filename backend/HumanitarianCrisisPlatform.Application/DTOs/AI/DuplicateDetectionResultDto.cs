namespace HumanitarianCrisisPlatform.Application.DTOs.AI;

public class DuplicateDetectionResultDto
{
    public bool IsDuplicate { get; set; }
    public Guid? MatchingRequestId { get; set; }
    public decimal SimilarityScore { get; set; }
    public string Reason { get; set; } = string.Empty;
}
