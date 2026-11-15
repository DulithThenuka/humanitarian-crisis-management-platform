using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HumanitarianCrisisPlatform.Domain.Entities;

namespace HumanitarianCrisisPlatform.Infrastructure.Data.Configurations;

public class PartnerZoneAssignmentConfiguration : IEntityTypeConfiguration<PartnerZoneAssignment>
{
    public void Configure(EntityTypeBuilder<PartnerZoneAssignment> builder)
    {
        builder.HasKey(za => za.Id);
        builder.Property(za => za.RoleSummary).IsRequired().HasMaxLength(200);
        builder.HasIndex(za => new { za.PartnerOrganisationId, za.SectorZoneId }).IsUnique();

        builder.HasOne(za => za.PartnerOrganisation)
            .WithMany(p => p.ZoneAssignments)
            .HasForeignKey(za => za.PartnerOrganisationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(za => za.SectorZone)
            .WithMany(z => z.PartnerAssignments)
            .HasForeignKey(za => za.SectorZoneId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

