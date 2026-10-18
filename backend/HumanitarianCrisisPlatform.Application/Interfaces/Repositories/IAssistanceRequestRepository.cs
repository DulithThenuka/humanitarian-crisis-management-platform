using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Repositories;

public interface IAssistanceRequestRepository : IRepository<AssistanceRequest>
{
    Task<IReadOnlyList<AssistanceRequest>> GetByStatusAsync(RequestStatus status, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<AssistanceRequest>> GetByCrisisEventAsync(Guid crisisEventId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<AssistanceRequest>> GetByRequestorAsync(Guid requestorId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<AssistanceRequest>> GetPotentialDuplicatesAsync(decimal lat, decimal lon, string category, CancellationToken cancellationToken = default);
}
