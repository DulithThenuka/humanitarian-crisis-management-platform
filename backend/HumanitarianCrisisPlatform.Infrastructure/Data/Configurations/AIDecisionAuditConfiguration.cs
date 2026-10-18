using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HumanitarianCrisisPlatform.Domain.Entities;

namespace HumanitarianCrisisPlatform.Infrastructure.Data.Configurations;

public class AIDecisionAuditConfiguration : IEntityTypeConfiguration<AIDecisionAudit>
{
    public void Configure(EntityTypeBuilder<AIDecisionAudit> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.AISuggestion).IsRequired();
        builder.Property(x => x.ConfidenceScore).HasPrecision(5, 4);

        builder.HasOne(x => x.AssistanceRequest)
               .WithMany(r => r.AIDecisionAudits)
               .HasForeignKey(x => x.AssistanceRequestId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Overrider)
               .WithMany()
               .HasForeignKey(x => x.OverriddenBy)
               .OnDelete(DeleteBehavior.Restrict);
    }
}
