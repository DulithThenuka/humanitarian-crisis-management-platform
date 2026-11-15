using System.ComponentModel.DataAnnotations;

namespace HumanitarianCrisisPlatform.Application.DTOs.Partners;

public class PartnerOrganisationDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Acronym { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string LeadContact { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string StatusClass { get; set; } = string.Empty;
    public string MouStatus { get; set; } = string.Empty;
    public string MouBadge { get; set; } = string.Empty;
    public int FieldTeamsCount { get; set; }
    public int FleetCount { get; set; }
    public List<string> AssignedZones { get; set; } = new();
    public List<PartnerCommitmentDto> Commitments { get; set; } = new();
}

public class PartnerCommitmentDto
{
    public Guid Id { get; set; }
    public Guid PartnerOrganisationId { get; set; }
    public string PartnerCode { get; set; } = string.Empty;
    public string PartnerName { get; set; } = string.Empty;
    public string PartnerAcronym { get; set; } = string.Empty;
    public string Item { get; set; } = string.Empty;
    public int Qty { get; set; }
    public string Status { get; set; } = string.Empty;
    public string DestinationZone { get; set; } = string.Empty;
    public decimal EstimatedValueLkr { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class SectorZoneDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ZoneCode { get; set; } = string.Empty;
    public string PriorityStatus { get; set; } = string.Empty;
    public string StatusClass { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string LeadAgency { get; set; } = string.Empty;
    public int CoveragePercent { get; set; }
    public List<SectorPartnerSummaryDto> AssignedPartners { get; set; } = new();
}

public class SectorPartnerSummaryDto
{
    public Guid PartnerId { get; set; }
    public string PartnerName { get; set; } = string.Empty;
    public string PartnerAcronym { get; set; } = string.Empty;
    public string RoleSummary { get; set; } = string.Empty;
}

public class PartnerPortalSummaryDto
{
    public int AccreditedPartnersCount { get; set; }
    public int VerifiedMouPercentage { get; set; }
    public int JointResponseUnitsCount { get; set; }
    public int ActiveZonesCount { get; set; }
    public decimal PledgedAidValueMillionsLkr { get; set; }
    public int DispatchedPercentage { get; set; }
    public int FleetDeployedCount { get; set; }
    public int TotalCommitmentsCount { get; set; }
}

public class CreatePartnerOrganisationDto
{
    [Required, StringLength(30)]
    public string Code { get; set; } = string.Empty;

    [Required, StringLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required, StringLength(30)]
    public string Acronym { get; set; } = string.Empty;

    [Required, StringLength(150)]
    public string Type { get; set; } = string.Empty;

    [Required, StringLength(150)]
    public string LeadContact { get; set; } = string.Empty;

    [Required, StringLength(40)]
    public string Phone { get; set; } = string.Empty;

    [Required, EmailAddress, StringLength(150)]
    public string Email { get; set; } = string.Empty;

    [StringLength(60)]
    public string Status { get; set; } = "Active Response";

    [Required, StringLength(120)]
    public string MouStatus { get; set; } = string.Empty;

    [Range(0, 10000)]
    public int FieldTeamsCount { get; set; }

    [Range(0, 10000)]
    public int FleetCount { get; set; }
}

public class UpdatePartnerStatusDto
{
    [Required, StringLength(60)]
    public string Status { get; set; } = string.Empty;

    [StringLength(120)]
    public string? MouStatus { get; set; }
}

public class CreatePartnerCommitmentDto
{
    [Required]
    public Guid PartnerOrganisationId { get; set; }

    [Required, StringLength(250, MinimumLength = 2)]
    public string Item { get; set; } = string.Empty;

    [Range(1, 10000000)]
    public int Qty { get; set; }

    [Required, StringLength(150)]
    public string DestinationZone { get; set; } = string.Empty;

    [StringLength(50)]
    public string Status { get; set; } = "Pledged";

    [Range(0, 10000000000)]
    public decimal EstimatedValueLkr { get; set; }
}

public class UpdateCommitmentStatusDto
{
    [Required, StringLength(50)]
    public string Status { get; set; } = string.Empty;
}

public class AssignPartnerZoneDto
{
    [Required]
    public Guid PartnerOrganisationId { get; set; }

    [Required]
    public Guid SectorZoneId { get; set; }

    [Required, StringLength(200)]
    public string RoleSummary { get; set; } = string.Empty;
}

