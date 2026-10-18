using HumanitarianCrisisPlatform.Domain.Common;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Domain.Entities;

public class CrisisEvent : AuditableEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DisasterType DisasterType { get; set; }
    public int Severity { get; set; } = 1;
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public decimal? AffectedAreaRadius { get; set; }
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    public DateTime? EndDate { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<AssistanceRequest> AssistanceRequests { get; set; } = new List<AssistanceRequest>();
    public ICollection<Shelter> Shelters { get; set; } = new List<Shelter>();
}
