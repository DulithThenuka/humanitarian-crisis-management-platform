using System.ComponentModel.DataAnnotations;

namespace HumanitarianCrisisPlatform.Application.DTOs.Coordinator;

public class RequestAdditionalInfoDto
{
    [Required(ErrorMessage = "Information request message cannot be empty.")]
    public string Message { get; set; } = string.Empty;

    public string? Reason { get; set; }

    public string? Recipient { get; set; } = "Citizen / Requestor";
}
