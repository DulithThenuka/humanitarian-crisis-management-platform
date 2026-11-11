using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HumanitarianCrisisPlatform.Domain.Entities;

namespace HumanitarianCrisisPlatform.Infrastructure.Data.Configurations;

public class IncidentConfiguration : IEntityTypeConfiguration<Incident>
{
    public void Configure(EntityTypeBuilder<Incident> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.CaseNumber).HasMaxLength(32).IsRequired();
        builder.Property(x => x.Title).HasMaxLength(200).IsRequired();
        builder.Property(x => x.Description).IsRequired();
        builder.Property(x => x.CategoryDisplay).HasMaxLength(100).IsRequired();
        builder.Property(x => x.VerificationStatus).HasMaxLength(100).IsRequired();
        builder.Property(x => x.OperationalArea).HasMaxLength(200).IsRequired();
        builder.Property(x => x.Address).HasMaxLength(500);
        builder.Property(x => x.Latitude).HasPrecision(9, 6);
        builder.Property(x => x.Longitude).HasPrecision(9, 6);
        builder.Property(x => x.CurrentSafety).HasMaxLength(300);
        builder.Property(x => x.AccessibilityNeeds).HasMaxLength(300);
        builder.Property(x => x.ContactPhone).HasMaxLength(50);
        builder.Property(x => x.AssignedStaffName).HasMaxLength(150);

        // Indexes and constraints
        builder.HasIndex(x => x.CaseNumber).IsUnique();
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.Priority);
        builder.HasIndex(x => x.OperationalArea);
        builder.HasIndex(x => x.AssignedToUserId);
        builder.HasIndex(x => x.CitizenId);

        // Relationships reusing existing entities
        builder.HasOne(x => x.Citizen)
               .WithMany()
               .HasForeignKey(x => x.CitizenId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.AssignedToUser)
               .WithMany()
               .HasForeignKey(x => x.AssignedToUserId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.AssistanceRequest)
               .WithMany()
               .HasForeignKey(x => x.AssistanceRequestId)
               .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(x => x.CrisisEvent)
               .WithMany()
               .HasForeignKey(x => x.CrisisEventId)
               .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(x => x.MergedIntoIncident)
               .WithMany()
               .HasForeignKey(x => x.MergedIntoIncidentId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}

public class IncidentAssignmentConfiguration : IEntityTypeConfiguration<IncidentAssignment>
{
    public void Configure(EntityTypeBuilder<IncidentAssignment> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.AssigneeName).HasMaxLength(150).IsRequired();
        builder.Property(x => x.AssignedByName).HasMaxLength(150);
        builder.Property(x => x.OperationalArea).HasMaxLength(200);
        builder.Property(x => x.Reason).HasMaxLength(1000).IsRequired();

        builder.HasIndex(x => new { x.IncidentId, x.IsActive });

        builder.HasOne(x => x.Incident)
               .WithMany(i => i.Assignments)
               .HasForeignKey(x => x.IncidentId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.AssigneeUser)
               .WithMany()
               .HasForeignKey(x => x.AssigneeUserId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.AssignedByUser)
               .WithMany()
               .HasForeignKey(x => x.AssignedByUserId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}

public class IncidentStatusHistoryConfiguration : IEntityTypeConfiguration<IncidentStatusHistory>
{
    public void Configure(EntityTypeBuilder<IncidentStatusHistory> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.ChangedByName).HasMaxLength(150).IsRequired();
        builder.Property(x => x.ChangedByRole).HasMaxLength(100).IsRequired();
        builder.Property(x => x.Reason).HasMaxLength(1000).IsRequired();

        builder.HasIndex(x => new { x.IncidentId, x.ChangedAt });

        builder.HasOne(x => x.Incident)
               .WithMany(i => i.StatusHistories)
               .HasForeignKey(x => x.IncidentId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.ChangedByUser)
               .WithMany()
               .HasForeignKey(x => x.ChangedByUserId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}

public class IncidentEscalationConfiguration : IEntityTypeConfiguration<IncidentEscalation>
{
    public void Configure(EntityTypeBuilder<IncidentEscalation> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.EscalatedByName).HasMaxLength(150).IsRequired();
        builder.Property(x => x.EscalatedToRole).HasMaxLength(150).IsRequired();
        builder.Property(x => x.Reason).HasMaxLength(1000).IsRequired();

        builder.HasIndex(x => x.IncidentId);

        builder.HasOne(x => x.Incident)
               .WithMany(i => i.Escalations)
               .HasForeignKey(x => x.IncidentId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.EscalatedByUser)
               .WithMany()
               .HasForeignKey(x => x.EscalatedByUserId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.EscalatedToUser)
               .WithMany()
               .HasForeignKey(x => x.EscalatedToUserId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}

public class IncidentCommunicationConfiguration : IEntityTypeConfiguration<IncidentCommunication>
{
    public void Configure(EntityTypeBuilder<IncidentCommunication> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.SenderName).HasMaxLength(150).IsRequired();
        builder.Property(x => x.SenderRole).HasMaxLength(100).IsRequired();
        builder.Property(x => x.RecipientWorkflow).HasMaxLength(200).IsRequired();
        builder.Property(x => x.Title).HasMaxLength(300).IsRequired();
        builder.Property(x => x.Message).IsRequired();
        builder.Property(x => x.CaseTag).HasMaxLength(200);

        builder.HasIndex(x => new { x.IncidentId, x.SentAt });

        builder.HasOne(x => x.Incident)
               .WithMany(i => i.Communications)
               .HasForeignKey(x => x.IncidentId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.SenderUser)
               .WithMany()
               .HasForeignKey(x => x.SenderUserId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}

public class IncidentAIReviewConfiguration : IEntityTypeConfiguration<IncidentAIReview>
{
    public void Configure(EntityTypeBuilder<IncidentAIReview> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.ReferenceCode).HasMaxLength(64).IsRequired();
        builder.Property(x => x.RecommendedCategory).HasMaxLength(100).IsRequired();
        builder.Property(x => x.UrgencyAssessment).HasMaxLength(300).IsRequired();
        builder.Property(x => x.ConfidenceScore).HasPrecision(5, 4);
        builder.Property(x => x.DuplicateSimilarityScore).HasPrecision(5, 4);
        builder.Property(x => x.ProviderLabel).HasMaxLength(200).IsRequired();
        builder.Property(x => x.HumanDecision).HasMaxLength(200);
        builder.Property(x => x.ReviewedByName).HasMaxLength(150);

        builder.HasIndex(x => x.IncidentId);

        builder.HasOne(x => x.Incident)
               .WithMany(i => i.AIReviews)
               .HasForeignKey(x => x.IncidentId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.ReviewedByUser)
               .WithMany()
               .HasForeignKey(x => x.ReviewedByUserId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}

public class IncidentAuditLogConfiguration : IEntityTypeConfiguration<IncidentAuditLog>
{
    public void Configure(EntityTypeBuilder<IncidentAuditLog> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.CaseNumber).HasMaxLength(32).IsRequired();
        builder.Property(x => x.Action).HasMaxLength(100).IsRequired();
        builder.Property(x => x.Detail).HasMaxLength(1000).IsRequired();
        builder.Property(x => x.ActorName).HasMaxLength(150).IsRequired();
        builder.Property(x => x.ActorRole).HasMaxLength(100).IsRequired();

        builder.HasIndex(x => new { x.IncidentId, x.Timestamp });

        builder.HasOne(x => x.Incident)
               .WithMany(i => i.AuditLogs)
               .HasForeignKey(x => x.IncidentId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}

