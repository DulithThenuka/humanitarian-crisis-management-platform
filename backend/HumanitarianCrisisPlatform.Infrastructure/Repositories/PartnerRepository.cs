using Microsoft.EntityFrameworkCore;
using HumanitarianCrisisPlatform.Application.Interfaces.Repositories;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;

namespace HumanitarianCrisisPlatform.Infrastructure.Repositories;

public class PartnerRepository : Repository<PartnerOrganisation>, IPartnerRepository
{
    public PartnerRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IReadOnlyList<PartnerOrganisation>> GetAllPartnersWithDetailsAsync(
        string? search = null,
        string? status = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.PartnerOrganisations
            .Include(p => p.Commitments)
            .Include(p => p.ZoneAssignments)
                .ThenInclude(za => za.SectorZone)
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && !status.Equals("ALL", StringComparison.OrdinalIgnoreCase))
        {
            var normalizedStatus = status.Trim().ToLowerInvariant();
            query = query.Where(p =>
                p.Status.ToLower() == normalizedStatus ||
                p.StatusClass.ToLower() == normalizedStatus);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLowerInvariant();
            query = query.Where(p =>
                p.Name.ToLower().Contains(term) ||
                p.Acronym.ToLower().Contains(term) ||
                p.Code.ToLower().Contains(term) ||
                p.Type.ToLower().Contains(term) ||
                p.ZoneAssignments.Any(za => za.SectorZone != null && za.SectorZone.ZoneCode.ToLower().Contains(term)));
        }

        return await query.OrderBy(p => p.Code).ToListAsync(cancellationToken);
    }

    public async Task<PartnerOrganisation?> GetPartnerByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.PartnerOrganisations
            .Include(p => p.Commitments)
            .Include(p => p.ZoneAssignments)
                .ThenInclude(za => za.SectorZone)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public async Task<PartnerOrganisation?> GetPartnerByCodeAsync(string code, CancellationToken cancellationToken = default)
    {
        var normalized = code.Trim().ToUpperInvariant();
        return await _context.PartnerOrganisations
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Code.ToUpper() == normalized, cancellationToken);
    }

    public async Task<IReadOnlyList<PartnerCommitment>> GetAllCommitmentsAsync(
        Guid? partnerId = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.PartnerCommitments
            .Include(c => c.PartnerOrganisation)
            .AsNoTracking()
            .AsQueryable();

        if (partnerId.HasValue && partnerId.Value != Guid.Empty)
        {
            query = query.Where(c => c.PartnerOrganisationId == partnerId.Value);
        }

        return await query.OrderByDescending(c => c.CreatedAt).ToListAsync(cancellationToken);
    }

    public async Task<PartnerCommitment?> GetCommitmentByIdAsync(Guid commitmentId, CancellationToken cancellationToken = default)
    {
        return await _context.PartnerCommitments
            .Include(c => c.PartnerOrganisation)
            .FirstOrDefaultAsync(c => c.Id == commitmentId, cancellationToken);
    }

    public async Task<PartnerCommitment> AddCommitmentAsync(PartnerCommitment commitment, CancellationToken cancellationToken = default)
    {
        await _context.PartnerCommitments.AddAsync(commitment, cancellationToken);
        return commitment;
    }

    public async Task<IReadOnlyList<SectorZone>> GetAllSectorZonesWithPartnersAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SectorZones
            .Include(z => z.PartnerAssignments)
                .ThenInclude(pa => pa.PartnerOrganisation)
            .AsNoTracking()
            .OrderBy(z => z.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<SectorZone?> GetSectorZoneByIdAsync(Guid zoneId, CancellationToken cancellationToken = default)
    {
        return await _context.SectorZones
            .Include(z => z.PartnerAssignments)
                .ThenInclude(pa => pa.PartnerOrganisation)
            .FirstOrDefaultAsync(z => z.Id == zoneId, cancellationToken);
    }

    public async Task<PartnerZoneAssignment?> GetZoneAssignmentAsync(
        Guid partnerId,
        Guid zoneId,
        CancellationToken cancellationToken = default)
    {
        return await _context.PartnerZoneAssignments
            .FirstOrDefaultAsync(za => za.PartnerOrganisationId == partnerId && za.SectorZoneId == zoneId, cancellationToken);
    }

    public async Task AddZoneAssignmentAsync(PartnerZoneAssignment assignment, CancellationToken cancellationToken = default)
    {
        await _context.PartnerZoneAssignments.AddAsync(assignment, cancellationToken);
    }
}

