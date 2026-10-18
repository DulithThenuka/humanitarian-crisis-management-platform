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
}
