using Microsoft.EntityFrameworkCore;
using HumanitarianCrisisPlatform.Application.Interfaces.Repositories;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;

namespace HumanitarianCrisisPlatform.Infrastructure.Repositories;

public class VolunteerRepository : Repository<Volunteer>, IVolunteerRepository
{
    public VolunteerRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IReadOnlyList<Volunteer>> GetAllWithUserAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Volunteers
            .Include(v => v.User)
            .Include(v => v.Assignments)
            .OrderByDescending(v => v.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<Volunteer?> GetByIdWithUserAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Volunteers
            .Include(v => v.User)
            .Include(v => v.Assignments)
            .FirstOrDefaultAsync(v => v.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyList<VolunteerAssignment>> GetAllAssignmentsWithDetailsAsync(CancellationToken cancellationToken = default)
    {
        return await _context.VolunteerAssignments
            .Include(a => a.Volunteer)
            .ThenInclude(v => v!.User)
            .Include(a => a.AssistanceRequest)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<VolunteerAssignment?> GetAssignmentByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.VolunteerAssignments
            .Include(a => a.Volunteer)
            .ThenInclude(v => v!.User)
            .Include(a => a.AssistanceRequest)
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
    }

    public async Task AddAssignmentAsync(VolunteerAssignment assignment, CancellationToken cancellationToken = default)
    {
        await _context.VolunteerAssignments.AddAsync(assignment, cancellationToken);
    }

    public async Task AddUserAsync(User user, CancellationToken cancellationToken = default)
    {
        await _context.Users.AddAsync(user, cancellationToken);
    }
}
