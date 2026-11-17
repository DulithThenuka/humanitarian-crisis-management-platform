using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Application.DTOs.Incidents;

public class AssignIncidentDto
{
    public Guid? AssigneeUserId { get; set; }
    public string AssigneeName { get; set; } = string.Empty;
    public string? OperationalArea { get; set; }
    public string Reason { get; set; } = "Assigned to case manager within operational sector.";
}

public class ReassignIncidentDto
{
    public Guid? NewAssigneeUserId { get; set; }
    public string NewAssigneeName { get; set; } = string.Empty;
    public string? OperationalArea { get; set; }
    public string Reason { get; set; } = "Reassigned for operational workload balance.";
}

public class UpdateIncidentStatusDto
{
    public string Status { get; set; } = string.Empty;
    public string? Verification { get; set; }
    public string Reason { get; set; } = "Operational review verified; status updated within assigned scope.";
}

public class UpdateIncidentPriorityDto
{
    public string Priority { get; set; } = string.Empty;
    public string Reason { get; set; } = "Priority adjusted based on operational triage.";
}

public class VerifyIncidentDto
{
    public string VerificationStatus { get; set; } = "Verified";
    public string Reason { get; set; } = "Case evidence and contact verified by Case Manager.";
}

public class EscalateIncidentDto
{
    public string EscalatedToRole { get; set; } = "Emergency Coordinator";
    public Guid? EscalatedToUserId { get; set; }
    public string? TargetPriority { get; set; } = "Critical";
    public string Reason { get; set; } = "Escalated for senior operations specialist review.";
}

public class ResolveIncidentDto
{
    public string ResolutionNotes { get; set; } = "Assistance delivered and operational case resolved.";
    public string Reason { get; set; } = "Verified resolution of humanitarian assistance need.";
}

public class CloseIncidentDto
{
    public string Reason { get; set; } = "Case closed following final verification and audit review.";
}

public class MergeIncidentDto
{
    public string TargetIncidentIdOrCaseNumber { get; set; } = string.Empty;
    public string Reason { get; set; } = "Confirmed duplicate case record; merged after human comparison.";
}

