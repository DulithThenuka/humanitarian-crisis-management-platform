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

    public async Task<IReadOnlyList<Resource>> GetFilteredResourcesAsync(
        string? category, 
        string? stockStatus, 
        string? location, 
        string? search, 
        CancellationToken cancellationToken = default)
    {
        var query = _dbSet.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(category) && !category.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(r => r.Category == category);
        }

        if (!string.IsNullOrWhiteSpace(location) && !location.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(r => r.WarehouseLocation == location);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(r => r.Name.ToLower().Contains(s) || r.Category.ToLower().Contains(s) || (r.WarehouseLocation != null && r.WarehouseLocation.ToLower().Contains(s)));
        }

        var list = await query.OrderBy(r => r.Name).ToListAsync(cancellationToken);

        if (!string.IsNullOrWhiteSpace(stockStatus) && !stockStatus.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            if (stockStatus.Equals("Shortage", StringComparison.OrdinalIgnoreCase))
            {
                list = list.Where(r => r.AvailableQuantity <= 0).ToList();
            }
            else if (stockStatus.Equals("Low stock", StringComparison.OrdinalIgnoreCase) || stockStatus.Equals("LowStock", StringComparison.OrdinalIgnoreCase))
            {
                list = list.Where(r => r.AvailableQuantity > 0 && r.AvailableQuantity <= r.MinimumThreshold).ToList();
            }
            else if (stockStatus.Equals("Available", StringComparison.OrdinalIgnoreCase))
            {
                list = list.Where(r => r.AvailableQuantity > r.MinimumThreshold).ToList();
            }
        }

        return list;
    }

    public async Task<Resource?> GetByIdWithAllocationsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(r => r.Allocations)
                .ThenInclude(a => a.AssistanceRequest)
            .Include(r => r.Allocations)
                .ThenInclude(a => a.Shelter)
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
    }

    public async Task<ResourceAllocation?> GetAllocationByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.ResourceAllocations
            .Include(a => a.Resource)
            .Include(a => a.AssistanceRequest)
            .Include(a => a.Shelter)
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
    }

    public Task UpdateAllocationAsync(ResourceAllocation allocation, CancellationToken cancellationToken = default)
    {
        _context.ResourceAllocations.Update(allocation);
        return Task.CompletedTask;
    }

    public async Task<IReadOnlyList<PartnerOrganisation>> GetSuppliersAsync(string? search, string? status, CancellationToken cancellationToken = default)
    {
        var query = _context.PartnerOrganisations.AsNoTracking().AsQueryable();

        // Include partners whose type is Supplier or registered vendors/relief providers
        query = query.Where(p => p.Type == "Supplier" || p.Type.Contains("Supplier") || p.Type.Contains("Partner") || p.Type.Contains("Logistics") || p.Type.Contains("Relief"));

        if (!string.IsNullOrWhiteSpace(status) && !status.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(p => p.Status.ToLower().Contains(status.ToLower()));
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(p => p.Name.ToLower().Contains(s) || p.Code.ToLower().Contains(s) || p.LeadContact.ToLower().Contains(s));
        }

        return await query.OrderBy(p => p.Name).ToListAsync(cancellationToken);
    }

    public async Task<PartnerOrganisation> AddSupplierAsync(PartnerOrganisation supplier, CancellationToken cancellationToken = default)
    {
        await _context.PartnerOrganisations.AddAsync(supplier, cancellationToken);
        return supplier;
    }

    public async Task<IReadOnlyList<Donation>> GetDonatedSuppliesAsync(string? search, CancellationToken cancellationToken = default)
    {
        var query = _context.Donations.AsNoTracking().AsQueryable();

        // Only in-kind material or logistics asset donations
        query = query.Where(d => d.DonationType == 1 || d.DonationType == 2 || d.ItemDescription != null);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(d => d.DonorName.ToLower().Contains(s) || (d.ItemDescription != null && d.ItemDescription.ToLower().Contains(s)));
        }

        return await query.OrderByDescending(d => d.ReceivedAt ?? d.CreatedAt).ToListAsync(cancellationToken);
    }

    public async Task<Donation?> GetDonationByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Donations.FirstOrDefaultAsync(d => d.Id == id, cancellationToken);
    }

    public Task UpdateDonationAsync(Donation donation, CancellationToken cancellationToken = default)
    {
        _context.Donations.Update(donation);
        return Task.CompletedTask;
    }
}
