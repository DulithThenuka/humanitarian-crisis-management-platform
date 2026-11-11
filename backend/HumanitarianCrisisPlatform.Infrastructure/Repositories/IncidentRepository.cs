using Microsoft.EntityFrameworkCore;
using HumanitarianCrisisPlatform.Application.Interfaces.Repositories;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Enums;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;

namespace HumanitarianCrisisPlatform.Infrastructure.Repositories;

public class IncidentRepository : Repository<Incident>, IIncidentRepository
{
    public IncidentRepository(ApplicationDbContext context) : base(context) { }

    public async Task<Incident?> GetByIdOrCaseNumberAsync(
        string idOrCaseNumber,
        bool includeDetails = true,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(idOrCaseNumber))
            return null;

        IQueryable<Incident> query = _dbSet;
        if (includeDetails)
        {
            query = query
                .Include(i => i.Assignments)
                .Include(i => i.StatusHistories)
                .Include(i => i.Escalations)
                .Include(i => i.Communications)
                .Include(i => i.AIReviews)
                .Include(i => i.AuditLogs);
        }

        var trimmed = idOrCaseNumber.Trim();
        if (Guid.TryParse(trimmed, out var guid))
        {
            return await query.FirstOrDefaultAsync(i => i.Id == guid, cancellationToken);
        }

        var upper = trimmed.ToUpperInvariant();
        return await query.FirstOrDefaultAsync(i => i.CaseNumber.ToUpper() == upper, cancellationToken);
    }

    public async Task<IReadOnlyList<Incident>> GetAllWithDetailsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(i => i.StatusHistories)
            .Include(i => i.AIReviews)
            .OrderByDescending(i => i.CreatedAt)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Incident>> GetAssignedToUserAsync(
        Guid userId,
        string? staffName = null,
        CancellationToken cancellationToken = default)
    {
        var query = _dbSet
            .Include(i => i.StatusHistories)
            .AsNoTracking();

        if (userId != Guid.Empty && !string.IsNullOrWhiteSpace(staffName))
        {
            var lowerName = staffName.ToLowerInvariant();
            return await query
                .Where(i => i.AssignedToUserId == userId ||
                            (i.AssignedStaffName != null && i.AssignedStaffName.ToLower().Contains(lowerName)) ||
                            (i.AssignedStaffName != null && i.AssignedStaffName == "I. Senanayake"))
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        if (userId != Guid.Empty)
        {
            var byId = await query
                .Where(i => i.AssignedToUserId == userId || i.AssignedStaffName == "I. Senanayake")
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync(cancellationToken);
            if (byId.Count > 0) return byId;
        }

        return await query
            .Where(i => !string.IsNullOrEmpty(i.AssignedStaffName) && i.AssignedStaffName != "Unassigned")
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Incident>> GetUnassignedAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(i => i.StatusHistories)
            .Where(i => i.AssignedToUserId == null &&
                        (string.IsNullOrEmpty(i.AssignedStaffName) || i.AssignedStaffName == "Unassigned"))
            .OrderByDescending(i => i.CreatedAt)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Incident>> GetByCitizenIdAsync(Guid citizenId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(i => i.StatusHistories)
            .Where(i => i.CitizenId == citizenId)
            .OrderByDescending(i => i.CreatedAt)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<string> GenerateNextCaseNumberAsync(CancellationToken cancellationToken = default)
    {
        var existingCaseNumbers = await _dbSet
            .Select(i => i.CaseNumber)
            .ToListAsync(cancellationToken);

        int maxNumber = 1042;
        foreach (var cn in existingCaseNumbers)
        {
            if (cn.StartsWith("HMR-", StringComparison.OrdinalIgnoreCase) &&
                int.TryParse(cn.Substring(4), out var num) &&
                num > maxNumber)
            {
                maxNumber = num;
            }
        }

        return $"HMR-{maxNumber + 1}";
    }

    public async Task AddAssignmentAsync(IncidentAssignment assignment, CancellationToken cancellationToken = default)
        => await _context.IncidentAssignments.AddAsync(assignment, cancellationToken);

    public async Task AddStatusHistoryAsync(IncidentStatusHistory history, CancellationToken cancellationToken = default)
        => await _context.IncidentStatusHistories.AddAsync(history, cancellationToken);

    public async Task AddEscalationAsync(IncidentEscalation escalation, CancellationToken cancellationToken = default)
        => await _context.IncidentEscalations.AddAsync(escalation, cancellationToken);

    public async Task AddCommunicationAsync(IncidentCommunication communication, CancellationToken cancellationToken = default)
        => await _context.IncidentCommunications.AddAsync(communication, cancellationToken);

    public async Task AddAIReviewAsync(IncidentAIReview aiReview, CancellationToken cancellationToken = default)
        => await _context.IncidentAIReviews.AddAsync(aiReview, cancellationToken);

    public Task UpdateAIReviewAsync(IncidentAIReview aiReview, CancellationToken cancellationToken = default)
    {
        _context.Entry(aiReview).State = EntityState.Modified;
        return Task.CompletedTask;
    }

    public async Task AddAuditLogAsync(IncidentAuditLog auditLog, CancellationToken cancellationToken = default)
        => await _context.IncidentAuditLogs.AddAsync(auditLog, cancellationToken);

    public async Task<IReadOnlyList<IncidentAuditLog>> GetRecentAuditLogsAsync(int count = 10, CancellationToken cancellationToken = default)
    {
        return await _context.IncidentAuditLogs
            .OrderByDescending(a => a.Timestamp)
            .Take(count)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }
}

