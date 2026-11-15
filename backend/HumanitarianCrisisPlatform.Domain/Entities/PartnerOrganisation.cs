using HumanitarianCrisisPlatform.Domain.Common;

namespace HumanitarianCrisisPlatform.Domain.Entities;

public class PartnerOrganisation : AuditableEntity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Acronym { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string LeadContact { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Status { get; set; } = "Active Response";
    public string StatusClass { get; set; } = "status-active";
    public string MouStatus { get; set; } = string.Empty;
    public string MouBadge { get; set; } = "badge-verified";
    public int FieldTeamsCount { get; set; }
    public int FleetCount { get; set; }

    public ICollection<PartnerCommitment> Commitments { get; set; } = new List<PartnerCommitment>();
    public ICollection<PartnerZoneAssignment> ZoneAssignments { get; set; } = new List<PartnerZoneAssignment>();
}

