using Microsoft.EntityFrameworkCore;
using HumanitarianCrisisPlatform.Application.Interfaces.Repositories;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;

namespace HumanitarianCrisisPlatform.Infrastructure.Repositories;

public class ResourceRepository : Repository<Resource>, IResourceRepository
{
    public ResourceRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IReadOnlyList<Resource>> GetLowStockResourcesAsync(CancellationToken cancellationToken = default)
        => await _dbSet.Where(r => (r.TotalQuantity - r.AllocatedQuantity) <= r.MinimumThreshold).AsNoTracking().ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Resource>> GetByCategoryAsync(string category, CancellationToken cancellationToken = default)
        => await _dbSet.Where(r => r.Category == category).AsNoTracking().ToListAsync(cancellationToken);

    public async Task AddAllocationAsync(ResourceAllocation allocation, CancellationToken cancellationToken = default)
    {
        await _context.ResourceAllocations.AddAsync(allocation, cancellationToken);
    }

    public async Task<IReadOnlyList<ResourceAllocation>> GetAllAllocationsWithDetailsAsync(CancellationToken cancellationToken = default)
    {
        return await _context.ResourceAllocations
            .Include(a => a.Resource)
            .Include(a => a.AssistanceRequest)
            .Include(a => a.Shelter)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}
