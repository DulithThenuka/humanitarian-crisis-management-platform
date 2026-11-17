using System.ComponentModel.DataAnnotations;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Application.DTOs.Coordinator;

public class VerifyAssistanceRequestDto
{
    [Required]
    [MinLength(3)]
    public string Reason { get; set; } = string.Empty;

    public bool ChecklistConfirmed { get; set; } = true;
    public string? Notes { get; set; }
}

public class EscalateAssistanceRequestDto
{
    [Required]
    [MinLength(3)]
    public string Reason { get; set; } = string.Empty;

    public PriorityLevel Urgency { get; set; } = PriorityLevel.Critical;
}

public class AddRequestNoteDto
{
    [Required]
    [MinLength(1)]
    public string Text { get; set; } = string.Empty;
}
