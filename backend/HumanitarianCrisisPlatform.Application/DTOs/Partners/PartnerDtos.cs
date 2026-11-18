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

// =========================================================================
// Partner Organisation Officer Portal DTOs
// =========================================================================

public class PartnerOfficerProfileDto
{
    public string FullName { get; set; } = "Ravindu Perera";
    public string ShortName { get; set; } = "RP";
    public string Role { get; set; } = "Partner Organisation Officer";
    public string Organisation { get; set; } = "National Relief Unit";
    public string OperationalArea { get; set; } = "Western Province Crisis Operations";
}

public class PartnerOfficerMetricItemDto
{
    public string Value { get; set; } = string.Empty;
    public string Sub { get; set; } = string.Empty;
}

public class PartnerOfficerMetricsDto
{
    public PartnerOfficerMetricItemDto VerificationStatus { get; set; } = new() { Value = "Verified", Sub = "National Relief Unit" };
    public PartnerOfficerMetricItemDto CollaborationRequests { get; set; } = new() { Value = "14", Sub = "5 awaiting review" };
    public PartnerOfficerMetricItemDto ResourcesOffered { get; set; } = new() { Value = "2,480", Sub = "Demo units" };
    public PartnerOfficerMetricItemDto ActiveCommitments { get; set; } = new() { Value = "18", Sub = "6 due today" };
    public PartnerOfficerMetricItemDto PendingApprovals { get; set; } = new() { Value = "5", Sub = "Organisation scope" };
    public PartnerOfficerMetricItemDto OnTimeDeliveries { get; set; } = new() { Value = "89%", Sub = "Demo summary" };
}

public class PartnerOfficerPriorityItemDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Desc { get; set; } = string.Empty;
    public string Tag { get; set; } = "critical"; // critical, warning, success
    public string RelatedTab { get; set; } = "profile";
    public string Timestamp { get; set; } = string.Empty;
}

public class PartnerOfficerWorkflowStepDto
{
    public int Step { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Sub { get; set; } = string.Empty;
    public string Status { get; set; } = "completed"; // completed, pending
}

public class PartnerOfficerActivityItemDto
{
    public string Id { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string RecordId { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
}

public class PartnerOfficerDashboardDto
{
    public PartnerOfficerProfileDto Officer { get; set; } = new();
    public PartnerOfficerMetricsDto Metrics { get; set; } = new();
    public List<PartnerOfficerPriorityItemDto> PriorityAttention { get; set; } = new();
    public List<PartnerOfficerWorkflowStepDto> WorkflowSteps { get; set; } = new();
    public List<PartnerOfficerActivityItemDto> Activity { get; set; } = new();
    public List<PartnerTimelineEntryDto> Timeline { get; set; } = new();
}

public class PartnerRecordDto
{
    public string Id { get; set; } = string.Empty;
    public string SharedIncident { get; set; } = string.Empty;
    public string Contribution { get; set; } = string.Empty;
    public string Quantity { get; set; } = string.Empty;
    public string ResponsibleOrg { get; set; } = string.Empty;
    public string Deadline { get; set; } = string.Empty;
    public string Status { get; set; } = "Dispatched"; // Dispatched, Confirmed, Awaiting response, Delayed
    public string StatusBadge { get; set; } = "dispatched";
    public string OperationalArea { get; set; } = "Western Province";
    public string Notes { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class CreatePartnerRecordDto
{
    public string SharedIncident { get; set; } = "CR-2026-014";
    [Required]
    public string Contribution { get; set; } = string.Empty;
    [Required]
    public string Quantity { get; set; } = string.Empty;
    public string ResponsibleOrg { get; set; } = "National Relief Unit";
    public string Deadline { get; set; } = "Today";
    public string Status { get; set; } = "Confirmed";
    public string OperationalArea { get; set; } = "Western Province";
    public string Notes { get; set; } = string.Empty;
}

public class ProcessPartnerRecordActionDto
{
    [Required]
    public string Action { get; set; } = "confirm"; // confirm, clarify, escalate
    public string? Note { get; set; }
}

public class PartnerTimelineEntryDto
{
    public string Id { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Scope { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class CreatePartnerTimelineEntryDto
{
    [Required]
    public string Title { get; set; } = string.Empty;
    public string Scope { get; set; } = "HMR-1042 · authorised participants only";
    public string Recipient { get; set; } = "Resource & Logistics Manager";
    public string Message { get; set; } = string.Empty;
}

