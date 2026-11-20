using HumanitarianCrisisPlatform.Domain.Common;

namespace HumanitarianCrisisPlatform.Domain.Entities;

public class SectorZone : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string ZoneCode { get; set; } = string.Empty;
    public string PriorityStatus { get; set; } = "Monitoring Stage";
    public string StatusClass { get; set; } = "status-warning";
    public string Description { get; set; } = string.Empty;
    public string LeadAgency { get; set; } = string.Empty;
    public int CoveragePercent { get; set; }

    public ICollection<PartnerZoneAssignment> PartnerAssignments { get; set; } = new List<PartnerZoneAssignment>();
}

