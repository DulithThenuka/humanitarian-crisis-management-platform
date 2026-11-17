using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HumanitarianCrisisPlatform.Domain.Entities;

namespace HumanitarianCrisisPlatform.Infrastructure.Data.Configurations;

public class SectorZoneConfiguration : IEntityTypeConfiguration<SectorZone>
{
    public void Configure(EntityTypeBuilder<SectorZone> builder)
    {
        builder.HasKey(z => z.Id);
        builder.Property(z => z.Name).IsRequired().HasMaxLength(200);
        builder.Property(z => z.ZoneCode).IsRequired().HasMaxLength(150);
        builder.Property(z => z.PriorityStatus).IsRequired().HasMaxLength(80);
        builder.Property(z => z.StatusClass).IsRequired().HasMaxLength(40);
        builder.Property(z => z.Description).HasMaxLength(500);
        builder.Property(z => z.LeadAgency).HasMaxLength(150);
    }
}

