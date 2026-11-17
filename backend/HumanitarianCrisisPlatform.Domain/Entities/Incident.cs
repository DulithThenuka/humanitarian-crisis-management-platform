using HumanitarianCrisisPlatform.Domain.Common;
using HumanitarianCrisisPlatform.Domain.Enums;
using HumanitarianCrisisPlatform.Domain.Exceptions;

namespace HumanitarianCrisisPlatform.Domain.Entities;

public class Incident : AuditableEntity
{
    public string CaseNumber { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public IncidentCategory Category { get; set; } = IncidentCategory.EmergencyShelter;
    public string CategoryDisplay { get; set; } = "Emergency Shelter";
    public PriorityLevel Priority { get; set; } = PriorityLevel.Medium;
    public IncidentStatus Status { get; set; } = IncidentStatus.Open;
    public string VerificationStatus { get; set; } = "Awaiting review";
    public string OperationalArea { get; set; } = string.Empty;
    public string? Address { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public int AffectedPeople { get; set; } = 1;
    public string? CurrentSafety { get; set; }
    public string? AccessibilityNeeds { get; set; }
    public string? ContactPhone { get; set; }

    // Relationships reusing existing entities
    public Guid? CitizenId { get; set; }
    public User? Citizen { get; set; }

    public Guid? AssistanceRequestId { get; set; }
    public AssistanceRequest? AssistanceRequest { get; set; }

    public Guid? CrisisEventId { get; set; }
    public CrisisEvent? CrisisEvent { get; set; }

    public Guid? AssignedToUserId { get; set; }
    public User? AssignedToUser { get; set; }
    public string? AssignedStaffName { get; set; }

    // Duplicate & merge tracking
    public bool IsDuplicate { get; set; } = false;
    public Guid? MergedIntoIncidentId { get; set; }
    public Incident? MergedIntoIncident { get; set; }

    // Lifecycle timestamps and internal notes
    public DateTime? VerifiedAt { get; set; }
    public Guid? VerifiedByUserId { get; set; }
    public DateTime? EscalatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public DateTime? ClosedAt { get; set; }
    public string? ResolutionNotes { get; set; }
    public string? InternalNotes { get; set; }

    // Navigation collections
    public ICollection<IncidentAssignment> Assignments { get; set; } = new List<IncidentAssignment>();
    public ICollection<IncidentStatusHistory> StatusHistories { get; set; } = new List<IncidentStatusHistory>();
    public ICollection<IncidentEscalation> Escalations { get; set; } = new List<IncidentEscalation>();
    public ICollection<IncidentCommunication> Communications { get; set; } = new List<IncidentCommunication>();
    public ICollection<IncidentAIReview> AIReviews { get; set; } = new List<IncidentAIReview>();
    public ICollection<IncidentAuditLog> AuditLogs { get; set; } = new List<IncidentAuditLog>();

    public void Validate()
    {
        if (string.IsNullOrWhiteSpace(CaseNumber))
            throw new DomainException("Incident CaseNumber is required.");

        if (string.IsNullOrWhiteSpace(Description))
            throw new DomainException("Incident Description / Citizen narrative is required.");

        if (string.IsNullOrWhiteSpace(OperationalArea))
            throw new DomainException("Incident OperationalArea is required.");

        if (AffectedPeople <= 0)
            throw new DomainException("AffectedPeople must be at least 1.");

        if (Latitude.HasValue && (Latitude.Value < -90m || Latitude.Value > 90m))
            throw new DomainException("Latitude must be between -90 and 90 degrees.");

        if (Longitude.HasValue && (Longitude.Value < -180m || Longitude.Value > 180m))
            throw new DomainException("Longitude must be between -180 and 180 degrees.");

        if (MergedIntoIncidentId.HasValue && MergedIntoIncidentId.Value == Id)
            throw new DomainException("An incident cannot be merged into itself.");
    }

    public static IncidentCategory ParseCategory(string? categoryInput)
    {
        if (string.IsNullOrWhiteSpace(categoryInput))
            return IncidentCategory.EmergencyShelter;

        var normalized = categoryInput.Trim().ToLowerInvariant();
        if (normalized.Contains("shelter")) return IncidentCategory.EmergencyShelter;
        if (normalized.Contains("med")) return IncidentCategory.Medicine;
        if (normalized.Contains("food") || normalized.Contains("ration")) return IncidentCategory.Food;
        if (normalized.Contains("transport") || normalized.Contains("evac") || normalized.Contains("boat")) return IncidentCategory.Transport;
        if (normalized.Contains("water") || normalized.Contains("sanit")) return IncidentCategory.WaterAndSanitation;
        if (normalized.Contains("rescue") || normalized.Contains("search")) return IncidentCategory.SearchAndRescue;

        if (Enum.TryParse<IncidentCategory>(categoryInput, true, out var parsed))
            return parsed;

        return IncidentCategory.Other;
    }

    public static string FormatCategoryDisplay(IncidentCategory category, string? customDisplay = null)
    {
        if (!string.IsNullOrWhiteSpace(customDisplay))
            return customDisplay.Trim();

        return category switch
        {
            IncidentCategory.EmergencyShelter => "Emergency Shelter",
            IncidentCategory.Medicine => "Medicine",
            IncidentCategory.Food => "Food",
            IncidentCategory.Transport => "Transport",
            IncidentCategory.WaterAndSanitation => "Water & Sanitation",
            IncidentCategory.SearchAndRescue => "Search & Rescue",
            _ => "Other"
        };
    }
}

