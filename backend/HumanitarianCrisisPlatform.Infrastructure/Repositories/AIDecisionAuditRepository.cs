using Microsoft.EntityFrameworkCore;
using HumanitarianCrisisPlatform.Application.Interfaces.Repositories;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;

namespace HumanitarianCrisisPlatform.Infrastructure.Repositories;

public class AIDecisionAuditRepository : Repository<AIDecisionAudit>, IAIDecisionAuditRepository
{
    public AIDecisionAuditRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IReadOnlyList<AIDecisionAudit>> GetPendingReviewsAsync(CancellationToken cancellationToken = default)
        => await _dbSet.Where(a => a.ReviewedAt == null).Include(a => a.AssistanceRequest).AsNoTracking().ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<AIDecisionAudit>> GetByRequestIdAsync(Guid requestId, CancellationToken cancellationToken = default)
        => await _dbSet.Where(a => a.AssistanceRequestId == requestId).AsNoTracking().ToListAsync(cancellationToken);
}
