using HumanitarianCrisisPlatform.Domain.Entities;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Repositories;

public interface IShelterRepository : IRepository<Shelter>
{
    Task<IReadOnlyList<Shelter>> GetActiveSheltersAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Shelter>> GetNearbySheltersAsync(decimal latitude, decimal longitude, double radiusKm, CancellationToken cancellationToken = default);
}
