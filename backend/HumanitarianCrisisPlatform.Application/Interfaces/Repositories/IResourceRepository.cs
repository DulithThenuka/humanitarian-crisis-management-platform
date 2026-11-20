using HumanitarianCrisisPlatform.Domain.Entities;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Repositories;

public interface IResourceRepository : IRepository<Resource>
{
    Task<IReadOnlyList<Resource>> GetLowStockResourcesAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Resource>> GetByCategoryAsync(string category, CancellationToken cancellationToken = default);
    Task AddAllocationAsync(ResourceAllocation allocation, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ResourceAllocation>> GetAllAllocationsWithDetailsAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Resource>> GetFilteredResourcesAsync(string? category, string? stockStatus, string? location, string? search, CancellationToken cancellationToken = default);
    Task<Resource?> GetByIdWithAllocationsAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ResourceAllocation?> GetAllocationByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);
    Task UpdateAllocationAsync(ResourceAllocation allocation, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<PartnerOrganisation>> GetSuppliersAsync(string? search, string? status, CancellationToken cancellationToken = default);
    Task<PartnerOrganisation> AddSupplierAsync(PartnerOrganisation supplier, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Donation>> GetDonatedSuppliesAsync(string? search, CancellationToken cancellationToken = default);
    Task<Donation?> GetDonationByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task UpdateDonationAsync(Donation donation, CancellationToken cancellationToken = default);
}
