using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Shelters;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Services;

public interface IShelterService
{
    Task<Result<IReadOnlyList<ShelterDto>>> GetAllSheltersAsync(
        string? query = null,
        string? district = null,
        string? status = null,
        CancellationToken cancellationToken = default);

    Task<Result<ShelterSummaryDto>> GetShelterSummaryAsync(CancellationToken cancellationToken = default);
    Task<Result<ShelterDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<ShelterDto>>> FindNearestSheltersAsync(decimal lat, decimal lon, double radiusKm = 25, CancellationToken cancellationToken = default);
    Task<Result<bool>> AllocateShelterAsync(AllocateShelterDto dto, CancellationToken cancellationToken = default);

    // Shelter Manager Dashboard & Core Operations
    Task<Result<ShelterDashboardDto>> GetShelterDashboardAsync(CancellationToken cancellationToken = default);
    Task<Result<ShelterDto>> CreateShelterAsync(CreateShelterDto dto, Guid userId, CancellationToken cancellationToken = default);
    Task<Result<ShelterDto>> UpdateShelterAsync(Guid id, UpdateShelterDto dto, Guid userId, CancellationToken cancellationToken = default);
    Task<Result<ShelterActionResultDto>> ExecuteShelterActionAsync(Guid shelterId, ShelterActionRequestDto dto, Guid userId, string userName, CancellationToken cancellationToken = default);

    // Placement Allocations
    Task<Result<IReadOnlyList<PlacementAllocationDto>>> GetPlacementsAsync(Guid? shelterId = null, string? status = null, string? search = null, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<ShelterIntakeQueueItemDto>>> GetIntakeQueueAsync(CancellationToken cancellationToken = default);
    Task<Result<PlacementAllocationDto>> CreatePlacementAsync(CreatePlacementDto dto, Guid userId, CancellationToken cancellationToken = default);
    Task<Result<PlacementAllocationDto>> UpdatePlacementStatusAsync(Guid id, UpdatePlacementStatusDto dto, Guid userId, CancellationToken cancellationToken = default);

    // Shelter Resource Requests
    Task<Result<IReadOnlyList<ShelterResourceRequestDto>>> GetResourceRequestsAsync(Guid? shelterId = null, string? status = null, string? urgency = null, CancellationToken cancellationToken = default);
    Task<Result<ShelterResourceRequestDto>> CreateResourceRequestAsync(CreateShelterResourceRequestDto dto, Guid userId, string userName, CancellationToken cancellationToken = default);
    Task<Result<ShelterResourceRequestDto>> UpdateResourceRequestStatusAsync(Guid id, UpdateShelterResourceStatusDto dto, Guid userId, CancellationToken cancellationToken = default);

    // Shelter Reports & Analytics
    Task<Result<ShelterReportsDto>> GetReportsAsync(CancellationToken cancellationToken = default);
    Task<Result<ExportReportResponseDto>> ExportReportAsync(string reportType, string format, CancellationToken cancellationToken = default);
}
