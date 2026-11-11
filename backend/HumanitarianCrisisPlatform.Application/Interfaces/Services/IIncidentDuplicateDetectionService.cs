using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Incidents;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Services;

public interface IIncidentDuplicateDetectionService
{
    Task<Result<IReadOnlyList<IncidentDuplicateCandidateDto>>> FindPossibleDuplicatesAsync(
        string idOrCaseNumber,
        CancellationToken cancellationToken = default);
}

