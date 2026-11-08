using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Crisis;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Services;

public interface ICrisisService
{
    Task<Result<CrisisSummaryStatsDto>> GetCrisisSummaryStatsAsync(CancellationToken cancellationToken = default);

    Task<Result<IReadOnlyList<CrisisEventDto>>> GetCrisesAsync(
        bool? isActive = null,
        DisasterType? disasterType = null,
        int? minSeverity = null,
        string? search = null,
        CancellationToken cancellationToken = default);

    Task<Result<CrisisDetailDto>> GetCrisisByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<Result<CrisisEventDto>> CreateCrisisAsync(
        CreateCrisisEventDto dto,
        Guid createdByUserId,
        CancellationToken cancellationToken = default);

    Task<Result<CrisisEventDto>> UpdateCrisisAsync(
        Guid id,
        UpdateCrisisEventDto dto,
        Guid updatedByUserId,
        CancellationToken cancellationToken = default);

    Task<Result<bool>> CloseCrisisAsync(
        Guid id,
        CloseCrisisDto? dto,
        Guid closedByUserId,
        CancellationToken cancellationToken = default);

    Task<Result<bool>> AssignResponseTeamAsync(
        Guid id,
        AssignCrisisTeamDto dto,
        Guid assignedByUserId,
        CancellationToken cancellationToken = default);

    Task<Result<IReadOnlyList<CrisisHazardZoneDto>>> GetHazardZonesAsync(
        Guid? crisisId = null,
        CancellationToken cancellationToken = default);
}

