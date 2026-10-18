using Microsoft.EntityFrameworkCore;
using HumanitarianCrisisPlatform.Application.Interfaces.Repositories;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Enums;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;

namespace HumanitarianCrisisPlatform.Infrastructure.Repositories;

public class AssistanceRequestRepository : Repository<AssistanceRequest>, IAssistanceRequestRepository
{
    public AssistanceRequestRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IReadOnlyList<AssistanceRequest>> GetByStatusAsync(RequestStatus status, CancellationToken cancellationToken = default)
        => await _dbSet.Where(r => r.Status == status).Include(r => r.Requestor).AsNoTracking().ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<AssistanceRequest>> GetByCrisisEventAsync(Guid crisisEventId, CancellationToken cancellationToken = default)
        => await _dbSet.Where(r => r.CrisisEventId == crisisEventId).AsNoTracking().ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<AssistanceRequest>> GetByRequestorAsync(Guid requestorId, CancellationToken cancellationToken = default)
        => await _dbSet.Where(r => r.RequestorId == requestorId).OrderByDescending(r => r.CreatedAt).AsNoTracking().ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<AssistanceRequest>> GetPotentialDuplicatesAsync(
        decimal lat,
        decimal lon,
        string category,
        CancellationToken cancellationToken = default)
    {
        // 0.05 degrees is approximately ~5km
        var minLat = lat - 0.05m;
        var maxLat = lat + 0.05m;
        var minLon = lon - 0.05m;
        var maxLon = lon + 0.05m;

        return await _dbSet.Where(r =>
            r.Latitude >= minLat && r.Latitude <= maxLat &&
            r.Longitude >= minLon && r.Longitude <= maxLon)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }
}
