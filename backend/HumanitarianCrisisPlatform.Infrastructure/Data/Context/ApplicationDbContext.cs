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
    public DbSet<VolunteerOpportunity> VolunteerOpportunities => Set<VolunteerOpportunity>();
    public DbSet<Donation> Donations => Set<Donation>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        // VolunteerOpportunity → Volunteer (many-to-many via AcceptedVolunteers)
        modelBuilder.Entity<VolunteerOpportunity>()
            .HasMany(o => o.AcceptedVolunteers)
            .WithMany(v => v.AcceptedOpportunities)
            .UsingEntity(j => j.ToTable("VolunteerOpportunityAcceptances"));

        // VolunteerOpportunity → PostedByUser
        modelBuilder.Entity<VolunteerOpportunity>()
            .HasOne(o => o.PostedByUser)
            .WithMany()
            .HasForeignKey(o => o.PostedByUserId)
            .OnDelete(DeleteBehavior.SetNull);

        // VolunteerOpportunity → CrisisEvent
        modelBuilder.Entity<VolunteerOpportunity>()
            .HasOne(o => o.CrisisEvent)
            .WithMany()
            .HasForeignKey(o => o.CrisisEventId)
            .OnDelete(DeleteBehavior.SetNull);

        // VolunteerAssignment → VolunteerOpportunity
        modelBuilder.Entity<VolunteerAssignment>()
            .HasOne(a => a.Opportunity)
            .WithMany(o => o.Assignments)
            .HasForeignKey(a => a.OpportunityId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
