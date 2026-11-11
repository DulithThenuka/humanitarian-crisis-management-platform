using Microsoft.EntityFrameworkCore;
using HumanitarianCrisisPlatform.Application.Common.Interfaces;
using HumanitarianCrisisPlatform.Domain.Entities;
using System.Reflection;

namespace HumanitarianCrisisPlatform.Infrastructure.Data.Context;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<CrisisEvent> CrisisEvents => Set<CrisisEvent>();
    public DbSet<AssistanceRequest> AssistanceRequests => Set<AssistanceRequest>();
    public DbSet<AIDecisionAudit> AIDecisionAudits => Set<AIDecisionAudit>();
    public DbSet<Shelter> Shelters => Set<Shelter>();
    public DbSet<ShelterAllocation> ShelterAllocations => Set<ShelterAllocation>();
    public DbSet<Resource> Resources => Set<Resource>();
    public DbSet<ResourceAllocation> ResourceAllocations => Set<ResourceAllocation>();
    public DbSet<Volunteer> Volunteers => Set<Volunteer>();
    public DbSet<VolunteerAssignment> VolunteerAssignments => Set<VolunteerAssignment>();
    public DbSet<Donation> Donations => Set<Donation>();

    // Incident / Case Manager Module DbSets
    public DbSet<Incident> Incidents => Set<Incident>();
    public DbSet<IncidentAssignment> IncidentAssignments => Set<IncidentAssignment>();
    public DbSet<IncidentStatusHistory> IncidentStatusHistories => Set<IncidentStatusHistory>();
    public DbSet<IncidentEscalation> IncidentEscalations => Set<IncidentEscalation>();
    public DbSet<IncidentCommunication> IncidentCommunications => Set<IncidentCommunication>();
    public DbSet<IncidentAIReview> IncidentAIReviews => Set<IncidentAIReview>();
    public DbSet<IncidentAuditLog> IncidentAuditLogs => Set<IncidentAuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
