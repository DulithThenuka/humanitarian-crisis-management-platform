using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HumanitarianCrisisPlatform.Domain.Entities;

namespace HumanitarianCrisisPlatform.Infrastructure.Data.Configurations;

public class PartnerOrganisationConfiguration : IEntityTypeConfiguration<PartnerOrganisation>
{
    public void Configure(EntityTypeBuilder<PartnerOrganisation> builder)
    {
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Code).IsRequired().HasMaxLength(30);
        builder.HasIndex(p => p.Code).IsUnique();
        builder.Property(p => p.Name).IsRequired().HasMaxLength(200);
        builder.Property(p => p.Acronym).IsRequired().HasMaxLength(30);
        builder.Property(p => p.Type).IsRequired().HasMaxLength(150);
        builder.Property(p => p.LeadContact).IsRequired().HasMaxLength(150);
        builder.Property(p => p.Phone).IsRequired().HasMaxLength(40);
        builder.Property(p => p.Email).IsRequired().HasMaxLength(150);
        builder.Property(p => p.Status).IsRequired().HasMaxLength(60);
        builder.Property(p => p.StatusClass).IsRequired().HasMaxLength(40);
        builder.Property(p => p.MouStatus).IsRequired().HasMaxLength(120);
        builder.Property(p => p.MouBadge).IsRequired().HasMaxLength(40);
    }
}

