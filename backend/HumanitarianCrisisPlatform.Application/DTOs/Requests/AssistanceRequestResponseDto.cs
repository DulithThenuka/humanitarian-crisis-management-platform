using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Application.DTOs.Requests;

public class AssistanceRequestResponseDto
{
    public Guid Id { get; set; }
    public Guid RequestorId { get; set; }
    public string RequestorName { get; set; } = string.Empty;
    public Guid? CrisisEventId { get; set; }
    public string? CrisisEventTitle { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public PriorityLevel Urgency { get; set; }
    public RequestStatus Status { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string? Address { get; set; }
    public int NumberOfPeople { get; set; }
    public string? ContactPhone { get; set; }
    public decimal? AIPriorityScore { get; set; }
    public decimal? AIConfidence { get; set; }
    public bool IsDuplicate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
}
