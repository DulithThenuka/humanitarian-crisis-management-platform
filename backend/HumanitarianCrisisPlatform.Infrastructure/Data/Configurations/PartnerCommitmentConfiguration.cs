using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HumanitarianCrisisPlatform.Domain.Entities;

namespace HumanitarianCrisisPlatform.Infrastructure.Data.Configurations;

public class PartnerCommitmentConfiguration : IEntityTypeConfiguration<PartnerCommitment>
{
    public void Configure(EntityTypeBuilder<PartnerCommitment> builder)
    {
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Item).IsRequired().HasMaxLength(250);
        builder.Property(c => c.Status).IsRequired().HasMaxLength(50);
        builder.Property(c => c.DestinationZone).IsRequired().HasMaxLength(150);
        builder.Property(c => c.EstimatedValueLkr).HasPrecision(18, 2);

        builder.HasOne(c => c.PartnerOrganisation)
            .WithMany(p => p.Commitments)
            .HasForeignKey(c => c.PartnerOrganisationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

