namespace HumanitarianCrisisPlatform.Application.DTOs.Shelters;

public class AllocateShelterDto
{
    public Guid ShelterId { get; set; }
    public Guid? AssistanceRequestId { get; set; }
    public string PersonName { get; set; } = string.Empty;
    public int NumberOfPersons { get; set; } = 1;
    public string? Notes { get; set; }
}
