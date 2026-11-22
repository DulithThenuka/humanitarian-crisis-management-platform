using System;

namespace HumanitarianCrisisPlatform.Application.DTOs.Admin;

public class AdminNotificationDto
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = "CitizenRegistration"; // "CitizenRegistration", "VolunteerRegistration", "System"
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string Role { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsRead { get; set; } = false;
    public string Priority { get; set; } = "Normal"; // "Normal", "High", "Critical"
}
