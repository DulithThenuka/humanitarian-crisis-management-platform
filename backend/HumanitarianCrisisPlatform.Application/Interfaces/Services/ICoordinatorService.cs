using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.AI;
using HumanitarianCrisisPlatform.Application.DTOs.Coordinator;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Services;

public interface ICoordinatorService
{
    Task<Result<CoordinatorOverviewDto>> GetOverviewAsync(CancellationToken cancellationToken = default);

    Task<Result<IReadOnlyList<CoordinatorCaseDto>>> GetCasesAsync(
        string? status = null,
        string? category = null,
        string? priority = null,
        string? search = null,
        CancellationToken cancellationToken = default);

    Task<Result<CoordinatorCaseDto>> GetCaseByIdAsync(
        string idOrReference,
        CancellationToken cancellationToken = default);

    Task<Result<CoordinatorCaseDto>> VerifyCaseAsync(
        string idOrReference,
        VerifyCaseDto dto,
        Guid reviewerId,
        string reviewerName,
        CancellationToken cancellationToken = default);

    Task<Result<CoordinatorCaseDto>> AddCaseNoteAsync(
        string idOrReference,
        AddCaseNoteDto dto,
        Guid reviewerId,
        string reviewerName,
        CancellationToken cancellationToken = default);

    Task<Result<CoordinatorCaseDto>> ReviewAIDecisionAsync(
        string idOrReference,
        HumanOverrideDto dto,
        Guid reviewerId,
        string reviewerName,
        CancellationToken cancellationToken = default);

    Task<Result<IReadOnlyList<CoordinatorAlertDto>>> GetAlertsAsync(CancellationToken cancellationToken = default);

    Task<Result<CoordinatorAlertDto>> CreateAlertAsync(
        CreateCoordinatorAlertDto dto,
        Guid createdByUserId,
        CancellationToken cancellationToken = default);

    Task<Result<IReadOnlyList<CoordinatorIncidentDto>>> GetIncidentsAsync(CancellationToken cancellationToken = default);

    Task<Result<CoordinatorIncidentDto>> CreateIncidentAsync(
        CreateCoordinatorIncidentDto dto,
        Guid createdByUserId,
        CancellationToken cancellationToken = default);

    Task<Result<IReadOnlyList<CoordinatorDecisionHistoryDto>>> GetDecisionHistoryAsync(
        int take = 20,
        CancellationToken cancellationToken = default);
}
