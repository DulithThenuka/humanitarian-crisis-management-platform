using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HumanitarianCrisisPlatform.Domain.Entities;

namespace HumanitarianCrisisPlatform.Infrastructure.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.FullName)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(x => x.Email)
            .HasMaxLength(256)
            .IsRequired();

        builder.Property(x => x.PasswordHash)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(x => x.PhoneNumber)
            .HasMaxLength(50)
            .IsRequired(false);

        // Explicit configuration for AssignedDistrict
        builder.Property(x => x.AssignedDistrict)
            .HasMaxLength(100)
            .IsRequired(false);

        builder.HasIndex(x => x.Email)
            .IsUnique();
    }
}
