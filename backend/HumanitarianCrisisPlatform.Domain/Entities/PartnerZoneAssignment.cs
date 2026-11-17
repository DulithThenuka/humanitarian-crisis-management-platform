using HumanitarianCrisisPlatform.Domain.Common;

namespace HumanitarianCrisisPlatform.Domain.Entities;

public class PartnerZoneAssignment : AuditableEntity
{
    public Guid PartnerOrganisationId { get; set; }
    public PartnerOrganisation? PartnerOrganisation { get; set; }

    public Guid SectorZoneId { get; set; }
    public SectorZone? SectorZone { get; set; }

    public string RoleSummary { get; set; } = string.Empty;
}

