using HumanitarianCrisisPlatform.Domain.Common;

namespace HumanitarianCrisisPlatform.Domain.Entities;

public class Volunteer : AuditableEntity
{
    public Guid UserId { get; set; }
    public User? User { get; set; }
    public string? Skills { get; set; }
    public string? Availability { get; set; }
    public bool IsAvailable { get; set; } = true;
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public decimal? MaxTravelDistance { get; set; }

    public ICollection<VolunteerAssignment> Assignments { get; set; } = new List<VolunteerAssignment>();
}
