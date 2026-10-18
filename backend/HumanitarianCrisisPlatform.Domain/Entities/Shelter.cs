using HumanitarianCrisisPlatform.Domain.Common;

namespace HumanitarianCrisisPlatform.Domain.Entities;

public class Shelter : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public int TotalCapacity { get; set; }
    public int CurrentOccupancy { get; set; } = 0;
    public string? Facilities { get; set; }
    public string? ContactPhone { get; set; }
    public bool IsActive { get; set; } = true;
    public Guid? CrisisEventId { get; set; }
    public CrisisEvent? CrisisEvent { get; set; }

    public ICollection<ShelterAllocation> Allocations { get; set; } = new List<ShelterAllocation>();
}
