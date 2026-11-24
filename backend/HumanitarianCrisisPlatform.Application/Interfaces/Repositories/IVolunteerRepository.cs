using HumanitarianCrisisPlatform.Domain.Entities;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Repositories;

public interface IVolunteerRepository : IRepository<Volunteer>
{
    Task<IReadOnlyList<Volunteer>> GetAllWithUserAsync(CancellationToken cancellationToken = default);
    Task<Volunteer?> GetByIdWithUserAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<VolunteerAssignment>> GetAllAssignmentsWithDetailsAsync(CancellationToken cancellationToken = default);
    Task<VolunteerAssignment?> GetAssignmentByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAssignmentAsync(VolunteerAssignment assignment, CancellationToken cancellationToken = default);
    Task AddUserAsync(User user, CancellationToken cancellationToken = default);
}
