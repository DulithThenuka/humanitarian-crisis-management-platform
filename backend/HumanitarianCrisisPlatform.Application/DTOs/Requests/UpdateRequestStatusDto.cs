using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Application.DTOs.Requests;

public class UpdateRequestStatusDto
{
    public RequestStatus Status { get; set; }
    public string? ResolutionNotes { get; set; }
}
