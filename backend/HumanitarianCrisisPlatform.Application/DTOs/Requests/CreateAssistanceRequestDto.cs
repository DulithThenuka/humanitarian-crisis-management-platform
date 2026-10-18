using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Application.DTOs.Requests;

public class CreateAssistanceRequestDto
{
    public Guid? CrisisEventId { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public PriorityLevel Urgency { get; set; } = PriorityLevel.Medium;
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string? Address { get; set; }
    public int NumberOfPeople { get; set; } = 1;
    public string? ContactPhone { get; set; }
    public string? AttachmentUrl { get; set; }
}
