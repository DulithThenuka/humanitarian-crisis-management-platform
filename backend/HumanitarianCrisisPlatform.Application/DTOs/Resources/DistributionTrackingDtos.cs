namespace HumanitarianCrisisPlatform.Application.DTOs.Resources;

public class DistributionTrackingDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public string Team { get; set; } = "Logistics Team Alpha";
    public string Status { get; set; } = "Dispatched";
    public string StatusBadge { get; set; } = "info";
    public int CurrentStep { get; set; } = 4;
    public string DispatchDate { get; set; } = string.Empty;
    public string ExpectedDelivery { get; set; } = string.Empty;
    public string RelatedAllocation { get; set; } = string.Empty;
    public string DeliveryConfirmation { get; set; } = string.Empty;
    public List<DistributionHistoryStepDto> History { get; set; } = new();
}

public class DistributionHistoryStepDto
{
    public string Time { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Sub { get; set; } = string.Empty;
}

public class UpdateDispatchStatusDto
{
    public int Step { get; set; }
    public string? Status { get; set; }
    public string? Notes { get; set; }
    public string? Team { get; set; }
}

public class ConfirmDeliveryDto
{
    public string? DeliveredTo { get; set; }
    public string? ConfirmationNotes { get; set; }
}
