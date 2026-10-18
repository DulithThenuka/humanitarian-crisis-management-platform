using HumanitarianCrisisPlatform.Domain.Common;

namespace HumanitarianCrisisPlatform.Domain.Entities;

public class ShelterAllocation : AuditableEntity
{
    public Guid ShelterId { get; set; }
    public Shelter? Shelter { get; set; }
    public Guid? AssistanceRequestId { get; set; }
    public AssistanceRequest? AssistanceRequest { get; set; }
    public string PersonName { get; set; } = string.Empty;
    public int NumberOfPersons { get; set; } = 1;
    public DateTime CheckInDate { get; set; } = DateTime.UtcNow;
    public DateTime? CheckOutDate { get; set; }
    public string? Notes { get; set; }
}
