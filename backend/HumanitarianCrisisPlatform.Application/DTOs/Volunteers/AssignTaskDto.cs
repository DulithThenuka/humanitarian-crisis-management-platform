namespace HumanitarianCrisisPlatform.Application.DTOs.Volunteers;

public class AssignTaskDto
{
    public Guid VolunteerId { get; set; }
    public Guid? AssistanceRequestId { get; set; }
    public string TaskDescription { get; set; } = string.Empty;
    public string? Notes { get; set; }
}
