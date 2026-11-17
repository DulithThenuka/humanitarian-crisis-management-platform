using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HumanitarianCrisisPlatform.Domain.Entities;

namespace HumanitarianCrisisPlatform.Infrastructure.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.FullName).HasMaxLength(200).IsRequired();
        builder.Property(x => x.Email).HasMaxLength(256).IsRequired();
        builder.Property(x => x.PasswordHash).HasMaxLength(500).IsRequired();
        builder.Property(x => x.PhoneNumber).HasMaxLength(50);

        builder.HasIndex(x => x.Email).IsUnique();
    }
}

public class CrisisEventConfiguration : IEntityTypeConfiguration<CrisisEvent>
{
    public void Configure(EntityTypeBuilder<CrisisEvent> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Title).HasMaxLength(300).IsRequired();
        builder.Property(x => x.Latitude).HasPrecision(9, 6);
        builder.Property(x => x.Longitude).HasPrecision(9, 6);
        builder.Property(x => x.AffectedAreaRadius).HasPrecision(10, 2);
    }
}

public class ShelterAllocationConfiguration : IEntityTypeConfiguration<ShelterAllocation>
{
    public void Configure(EntityTypeBuilder<ShelterAllocation> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.PersonName).HasMaxLength(200).IsRequired();

        builder.HasIndex(x => x.ShelterId);

        builder.HasOne(x => x.Shelter)
               .WithMany(s => s.Allocations)
               .HasForeignKey(x => x.ShelterId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.AssistanceRequest)
               .WithMany(r => r.ShelterAllocations)
               .HasForeignKey(x => x.AssistanceRequestId)
               .OnDelete(DeleteBehavior.SetNull);
    }
}

public class ResourceAllocationConfiguration : IEntityTypeConfiguration<ResourceAllocation>
{
    public void Configure(EntityTypeBuilder<ResourceAllocation> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Quantity).HasPrecision(12, 2);

        builder.HasIndex(x => x.ResourceId);

        builder.HasOne(x => x.Resource)
               .WithMany(r => r.Allocations)
               .HasForeignKey(x => x.ResourceId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.AssistanceRequest)
               .WithMany(r => r.ResourceAllocations)
               .HasForeignKey(x => x.AssistanceRequestId)
               .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(x => x.Shelter)
               .WithMany()
               .HasForeignKey(x => x.ShelterId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}

public class VolunteerConfiguration : IEntityTypeConfiguration<Volunteer>
{
    public void Configure(EntityTypeBuilder<Volunteer> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Latitude).HasPrecision(9, 6);
        builder.Property(x => x.Longitude).HasPrecision(9, 6);
        builder.Property(x => x.MaxTravelDistance).HasPrecision(10, 2);

        builder.HasIndex(x => x.IsAvailable);

        builder.HasOne(x => x.User)
               .WithMany()
               .HasForeignKey(x => x.UserId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}

public class VolunteerAssignmentConfiguration : IEntityTypeConfiguration<VolunteerAssignment>
{
    public void Configure(EntityTypeBuilder<VolunteerAssignment> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.TaskDescription).IsRequired();
        builder.Property(x => x.AIMatchScore).HasPrecision(5, 4);

        builder.HasIndex(x => x.VolunteerId);

        builder.HasOne(x => x.Volunteer)
               .WithMany(v => v.Assignments)
               .HasForeignKey(x => x.VolunteerId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.AssistanceRequest)
               .WithMany(r => r.VolunteerAssignments)
               .HasForeignKey(x => x.AssistanceRequestId)
               .OnDelete(DeleteBehavior.SetNull);
    }
}

public class DonationConfiguration : IEntityTypeConfiguration<Donation>
{
    public void Configure(EntityTypeBuilder<Donation> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.DonorName).HasMaxLength(200).IsRequired();
        builder.Property(x => x.DonorEmail).HasMaxLength(256);
        builder.Property(x => x.DonorPhone).HasMaxLength(50);
        builder.Property(x => x.Amount).HasPrecision(12, 2);
        builder.Property(x => x.Currency).HasMaxLength(10);

        builder.HasOne(x => x.CrisisEvent)
               .WithMany()
               .HasForeignKey(x => x.CrisisEventId)
               .OnDelete(DeleteBehavior.SetNull);
    }
}

