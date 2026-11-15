using HumanitarianCrisisPlatform.Domain.Common;

namespace HumanitarianCrisisPlatform.Domain.Entities;

public class PartnerCommitment : AuditableEntity
{
    public Guid PartnerOrganisationId { get; set; }
    public PartnerOrganisation? PartnerOrganisation { get; set; }

    public string Item { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public string Status { get; set; } = "Pledged";
    public string DestinationZone { get; set; } = string.Empty;
    public decimal EstimatedValueLkr { get; set; }
    public Guid? LoggedByUserId { get; set; }
}

