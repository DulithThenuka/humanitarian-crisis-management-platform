namespace HumanitarianCrisisPlatform.Application.DTOs.Volunteers;

public class VolunteerDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Skills { get; set; }
    public string? Availability { get; set; }
    public bool IsAvailable { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public decimal? MaxTravelDistance { get; set; }
}
