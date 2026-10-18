using HumanitarianCrisisPlatform.Domain.Entities;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Repositories;

public interface IAIDecisionAuditRepository : IRepository<AIDecisionAudit>
{
    Task<IReadOnlyList<AIDecisionAudit>> GetPendingReviewsAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<AIDecisionAudit>> GetByRequestIdAsync(Guid requestId, CancellationToken cancellationToken = default);
}
