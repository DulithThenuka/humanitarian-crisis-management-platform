namespace HumanitarianCrisisPlatform.Application.DTOs.Incidents;

public class IncidentDashboardDto
{
    public DashboardMetricsDto Metrics { get; set; } = new();
    public List<PriorityAttentionItemDto> PriorityAttentionItems { get; set; } = new();
    public List<WorkflowStepDto> WorkflowSteps { get; set; } = new();
    public List<RecentActivityItemDto> RecentActivityItems { get; set; } = new();
    public bool IsLiveBackendData { get; set; } = true;
}

public class DashboardMetricsDto
{
    public MetricCardDto AssignedCases { get; set; } = new();
    public MetricCardDto OpenUnresolved { get; set; } = new();
    public MetricCardDto Escalated { get; set; } = new();
    public MetricCardDto AwaitingVerification { get; set; } = new();
    public MetricCardDto NeedInformation { get; set; } = new();
    public MetricCardDto MedianResponse { get; set; } = new();
}

public class MetricCardDto
{
    public object Value { get; set; } = 0;
    public string Sub { get; set; } = string.Empty;
}

public class PriorityAttentionItemDto
{
    public string Id { get; set; } = string.Empty;
    public int Num { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Desc { get; set; } = string.Empty;
    public string PillText { get; set; } = string.Empty;
    public string PillType { get; set; } = string.Empty;
}

public class WorkflowStepDto
{
    public int Step { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Desc { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

public class RecentActivityItemDto
{
    public string Id { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string CaseId { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Detail { get; set; } = string.Empty;
}

