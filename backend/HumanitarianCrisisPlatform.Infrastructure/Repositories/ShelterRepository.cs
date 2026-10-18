using Microsoft.EntityFrameworkCore;
using HumanitarianCrisisPlatform.Application.Interfaces.Repositories;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;

namespace HumanitarianCrisisPlatform.Infrastructure.Repositories;

public class ShelterRepository : Repository<Shelter>, IShelterRepository
{
    public ShelterRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IReadOnlyList<Shelter>> GetActiveSheltersAsync(CancellationToken cancellationToken = default)
        => await _dbSet.Where(s => s.IsActive).AsNoTracking().ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Shelter>> GetNearbySheltersAsync(
        decimal latitude,
        decimal longitude,
        double radiusKm,
        CancellationToken cancellationToken = default)
    {
        // Bounding box filter first, refined in application service
        var delta = (decimal)(radiusKm / 111.0);
        return await _dbSet.Where(s =>
            s.IsActive &&
            s.Latitude >= latitude - delta && s.Latitude <= latitude + delta &&
            s.Longitude >= longitude - delta && s.Longitude <= longitude + delta)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }
}
