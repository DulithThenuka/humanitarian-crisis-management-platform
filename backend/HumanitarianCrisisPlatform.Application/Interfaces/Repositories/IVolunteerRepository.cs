using HumanitarianCrisisPlatform.Domain.Entities;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Repositories;

public interface IVolunteerRepository : IRepository<Volunteer>
{
    Task<IReadOnlyList<Volunteer>> GetAllWithUserAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<VolunteerAssignment>> GetAllAssignmentsWithDetailsAsync(CancellationToken cancellationToken = default);
    Task AddAssignmentAsync(VolunteerAssignment assignment, CancellationToken cancellationToken = default);
}

