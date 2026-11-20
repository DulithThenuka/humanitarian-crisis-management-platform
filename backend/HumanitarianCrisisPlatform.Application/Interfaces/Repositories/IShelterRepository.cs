using HumanitarianCrisisPlatform.Domain.Entities;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Repositories;

public interface IShelterRepository : IRepository<Shelter>
{
    Task<IReadOnlyList<Shelter>> GetActiveSheltersAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Shelter>> GetNearbySheltersAsync(decimal latitude, decimal longitude, double radiusKm, CancellationToken cancellationToken = default);
    Task<Shelter?> GetWithAllocationsAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Shelter>> GetAllWithAllocationsAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ShelterAllocation>> GetAllocationsAsync(Guid? shelterId = null, string? status = null, string? search = null, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ShelterAllocation>> GetAllAllocationsWithDetailsAsync(CancellationToken cancellationToken = default);
    Task<ShelterAllocation?> GetAllocationByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ShelterAllocation> AddAllocationAsync(ShelterAllocation allocation, CancellationToken cancellationToken = default);
    Task UpdateAllocationAsync(ShelterAllocation allocation, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ResourceAllocation>> GetShelterResourceAllocationsAsync(Guid? shelterId = null, CancellationToken cancellationToken = default);
    Task<ResourceAllocation?> GetShelterResourceAllocationByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ResourceAllocation> AddResourceAllocationAsync(ResourceAllocation allocation, CancellationToken cancellationToken = default);
    Task UpdateResourceAllocationAsync(ResourceAllocation allocation, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<AssistanceRequest>> GetPendingIntakeRequestsAsync(CancellationToken cancellationToken = default);
}
