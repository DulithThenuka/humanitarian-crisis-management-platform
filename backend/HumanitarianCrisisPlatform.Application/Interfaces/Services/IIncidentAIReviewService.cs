using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Incidents;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Services;

public interface IIncidentAIReviewService
{
    Task<Result<IncidentAIReviewDto>> GetAIReviewAsync(
        string idOrCaseNumber,
        CancellationToken cancellationToken = default);

    Task<Result<IncidentAIReviewDto>> GenerateAIReviewAsync(
        string idOrCaseNumber,
        Guid actorUserId,
        string actorName,
        string actorRole,
        CancellationToken cancellationToken = default);

    Task<Result<IncidentAIReviewDto>> RecordHumanDecisionAsync(
        string idOrCaseNumber,
        RecordAIReviewDecisionDto dto,
        Guid reviewerUserId,
        string reviewerName,
        string reviewerRole,
        CancellationToken cancellationToken = default);
}

