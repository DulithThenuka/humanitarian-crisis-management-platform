using HumanitarianCrisisPlatform.Domain.Common;

namespace HumanitarianCrisisPlatform.Domain.Entities;

public class SituationReport : AuditableEntity
{
    public string ReportCode { get; set; } = string.Empty; // e.g. "SITREP-2026-WP-014"
    public string Title { get; set; } = string.Empty;
    public string IncidentName { get; set; } = string.Empty;
    public string DisasterType { get; set; } = "Flood";
    public string District { get; set; } = "Western Province";
    public string GeneratedBy { get; set; } = "National Emergency Coordinator";
    public int CasualtiesReported { get; set; }
    public int PeopleDisplaced { get; set; }
    public int SheltersActive { get; set; }
    public int TeamsDeployed { get; set; }
    public string RoadPassabilityStatus { get; set; } = "Restricted Passability";
    public string ExecutiveSummary { get; set; } = string.Empty;
    public string PriorityNeeds { get; set; } = string.Empty;
    public string Status { get; set; } = "Official Approved";
    public DateTime ReportedAt { get; set; } = DateTime.UtcNow;
}
