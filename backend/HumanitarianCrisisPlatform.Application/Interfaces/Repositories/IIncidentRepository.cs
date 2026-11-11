using HumanitarianCrisisPlatform.Domain.Entities;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Repositories;

public interface IIncidentRepository : IRepository<Incident>
{
    Task<Incident?> GetByIdOrCaseNumberAsync(string idOrCaseNumber, bool includeDetails = true, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Incident>> GetAllWithDetailsAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Incident>> GetAssignedToUserAsync(Guid userId, string? staffName = null, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Incident>> GetUnassignedAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Incident>> GetByCitizenIdAsync(Guid citizenId, CancellationToken cancellationToken = default);
    Task<string> GenerateNextCaseNumberAsync(CancellationToken cancellationToken = default);
    Task AddAssignmentAsync(IncidentAssignment assignment, CancellationToken cancellationToken = default);
    Task AddStatusHistoryAsync(IncidentStatusHistory history, CancellationToken cancellationToken = default);
    Task AddEscalationAsync(IncidentEscalation escalation, CancellationToken cancellationToken = default);
    Task AddCommunicationAsync(IncidentCommunication communication, CancellationToken cancellationToken = default);
    Task AddAIReviewAsync(IncidentAIReview aiReview, CancellationToken cancellationToken = default);
    Task UpdateAIReviewAsync(IncidentAIReview aiReview, CancellationToken cancellationToken = default);
    Task AddAuditLogAsync(IncidentAuditLog auditLog, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<IncidentAuditLog>> GetRecentAuditLogsAsync(int count = 10, CancellationToken cancellationToken = default);
}

