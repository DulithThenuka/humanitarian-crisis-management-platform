using System;

namespace HumanitarianCrisisPlatform.Application.DTOs.Admin;

public class AdminRegistrationDetailsDto
{
    public Guid UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string Role { get; set; } = string.Empty;
    public DateTime RegistrationDate { get; set; }
    public string AccountStatus { get; set; } = "Active";
    public string VerificationStatus { get; set; } = "Pending Verification";
    public string? Location { get; set; }

    // Field Volunteer specific properties
    public bool IsVolunteer { get; set; } = false;
    public Guid? VolunteerId { get; set; }
    public string? Skills { get; set; }
    public string? Availability { get; set; }
    public decimal? MaxTravelDistance { get; set; }
}
