using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HumanitarianCrisisPlatform.Domain.Entities;

namespace HumanitarianCrisisPlatform.Infrastructure.Data.Configurations;

public class AssistanceRequestConfiguration : IEntityTypeConfiguration<AssistanceRequest>
{
    public void Configure(EntityTypeBuilder<AssistanceRequest> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Category).HasMaxLength(100).IsRequired();
        builder.Property(x => x.Description).IsRequired();
        builder.Property(x => x.Latitude).HasPrecision(9, 6);
        builder.Property(x => x.Longitude).HasPrecision(9, 6);
        builder.Property(x => x.Address).HasMaxLength(500);

        builder.HasOne(x => x.Requestor)
               .WithMany(u => u.AssistanceRequests)
               .HasForeignKey(x => x.RequestorId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.CrisisEvent)
               .WithMany(c => c.AssistanceRequests)
               .HasForeignKey(x => x.CrisisEventId)
               .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(x => x.DuplicateOf)
               .WithMany()
               .HasForeignKey(x => x.DuplicateOfId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}
