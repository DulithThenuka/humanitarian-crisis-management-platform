using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Resources;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Services;

public interface IResourceAllocationService
{
    Task<Result<IReadOnlyList<ResourceDto>>> GetInventoryAsync(CancellationToken cancellationToken = default);
    Task<Result<bool>> DispatchAllocationAsync(AllocateResourceDto dto, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<ResourceDto>>> GetLowStockAlertsAsync(CancellationToken cancellationToken = default);
}
