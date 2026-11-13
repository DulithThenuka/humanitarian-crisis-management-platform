using HumanitarianCrisisPlatform.Domain.Entities;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Repositories;

public interface IResourceRepository : IRepository<Resource>
{
    Task<IReadOnlyList<Resource>> GetLowStockResourcesAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Resource>> GetByCategoryAsync(string category, CancellationToken cancellationToken = default);
    Task AddAllocationAsync(ResourceAllocation allocation, CancellationToken cancellationToken = default);
}
