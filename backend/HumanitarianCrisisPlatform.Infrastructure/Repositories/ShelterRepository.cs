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

    public async Task<Shelter?> GetWithAllocationsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(s => s.Allocations)
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyList<Shelter>> GetAllWithAllocationsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(s => s.Allocations)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<ShelterAllocation>> GetAllocationsAsync(
        Guid? shelterId = null,
        string? status = null,
        string? search = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.ShelterAllocations
            .Include(a => a.Shelter)
            .AsNoTracking()
            .AsQueryable();

        if (shelterId.HasValue && shelterId.Value != Guid.Empty)
        {
            query = query.Where(a => a.ShelterId == shelterId.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(a =>
                a.PersonName.ToLower().Contains(s) ||
                (a.Notes != null && a.Notes.ToLower().Contains(s)) ||
                (a.Shelter != null && a.Shelter.Name.ToLower().Contains(s)));
        }

        if (!string.IsNullOrWhiteSpace(status) && !status.Equals("ALL", StringComparison.OrdinalIgnoreCase))
        {
            if (status.Equals("Discharged", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(a => a.CheckOutDate != null);
            }
            else if (status.Equals("Confirmed", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(a => a.CheckOutDate == null && (a.Notes == null || !a.Notes.Contains("Pending Reallocation")));
            }
            else if (status.Equals("Pending Reallocation", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(a => a.Notes != null && a.Notes.Contains("Pending Reallocation"));
            }
        }

        return await query.OrderByDescending(a => a.CheckInDate).ToListAsync(cancellationToken);
    }

    public async Task<ShelterAllocation?> GetAllocationByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.ShelterAllocations
            .Include(a => a.Shelter)
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
    }

    public async Task<ShelterAllocation> AddAllocationAsync(ShelterAllocation allocation, CancellationToken cancellationToken = default)
    {
        await _context.ShelterAllocations.AddAsync(allocation, cancellationToken);
        return allocation;
    }

    public Task UpdateAllocationAsync(ShelterAllocation allocation, CancellationToken cancellationToken = default)
    {
        _context.Entry(allocation).State = EntityState.Modified;
        return Task.CompletedTask;
    }

    public async Task<IReadOnlyList<ResourceAllocation>> GetShelterResourceAllocationsAsync(Guid? shelterId = null, CancellationToken cancellationToken = default)
    {
        var query = _context.ResourceAllocations
            .Include(r => r.Shelter)
            .Include(r => r.Resource)
            .Where(r => r.ShelterId != null)
            .AsNoTracking()
            .AsQueryable();

        if (shelterId.HasValue && shelterId.Value != Guid.Empty)
        {
            query = query.Where(r => r.ShelterId == shelterId.Value);
        }

        return await query.OrderByDescending(r => r.CreatedAt).ToListAsync(cancellationToken);
    }

    public async Task<ResourceAllocation?> GetShelterResourceAllocationByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.ResourceAllocations
            .Include(r => r.Shelter)
            .Include(r => r.Resource)
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
    }

    public async Task<ResourceAllocation> AddResourceAllocationAsync(ResourceAllocation allocation, CancellationToken cancellationToken = default)
    {
        await _context.ResourceAllocations.AddAsync(allocation, cancellationToken);
        return allocation;
    }

    public Task UpdateResourceAllocationAsync(ResourceAllocation allocation, CancellationToken cancellationToken = default)
    {
        _context.Entry(allocation).State = EntityState.Modified;
        return Task.CompletedTask;
    }
}
