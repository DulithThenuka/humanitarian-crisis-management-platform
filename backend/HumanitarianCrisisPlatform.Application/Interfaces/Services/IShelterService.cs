using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Shelters;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Services;

public interface IShelterService
{
    Task<Result<IReadOnlyList<ShelterDto>>> GetAllSheltersAsync(CancellationToken cancellationToken = default);
    Task<Result<ShelterDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<ShelterDto>>> FindNearestSheltersAsync(decimal lat, decimal lon, double radiusKm = 25, CancellationToken cancellationToken = default);
    Task<Result<bool>> AllocateShelterAsync(AllocateShelterDto dto, CancellationToken cancellationToken = default);
}
