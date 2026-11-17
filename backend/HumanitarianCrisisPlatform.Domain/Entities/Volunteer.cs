using HumanitarianCrisisPlatform.Domain.Common;

namespace HumanitarianCrisisPlatform.Domain.Entities;

public class Volunteer : AuditableEntity
{
    public Guid UserId { get; set; }
    public User? User { get; set; }

    // Core availability
    public string? Skills { get; set; }
    public string? Availability { get; set; }
    public bool IsAvailable { get; set; } = true;
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public decimal? MaxTravelDistance { get; set; }

    // Extended profile fields
    public string? VolunteerCode { get; set; }          // e.g. VOL-LK-8841
    public string? DutyStatus { get; set; }             // Available, On Duty, Off Duty
    public string? ServiceArea { get; set; }
    public string? BloodGroup { get; set; }
    public string? EmergencyContact { get; set; }
    public string? VerificationTier { get; set; }       // Basic, Verified, Expert
    public string? Certifications { get; set; }         // JSON or CSV list
    public string? PreferredCategories { get; set; }    // CSV list
    public decimal TotalHoursServed { get; set; } = 0;
    public int CompletedAssignments { get; set; } = 0;

    public ICollection<VolunteerAssignment> Assignments { get; set; } = new List<VolunteerAssignment>();
    public ICollection<VolunteerOpportunity> AcceptedOpportunities { get; set; } = new List<VolunteerOpportunity>();
}
