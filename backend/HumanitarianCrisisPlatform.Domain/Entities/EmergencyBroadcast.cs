using HumanitarianCrisisPlatform.Domain.Common;

namespace HumanitarianCrisisPlatform.Domain.Entities;

public class EmergencyBroadcast : AuditableEntity
{
    public string Title { get; set; } = string.Empty;
    public string Severity { get; set; } = "Emergency"; // Emergency, Warning, Advisory, Info
    public string Channels { get; set; } = "SMS Broadcast, Push Notification, Field Radio";
    public string TargetRegion { get; set; } = string.Empty;
    public string TargetAudience { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string SentBy { get; set; } = "DMC Emergency Command";
    public string DeliveryRate { get; set; } = "99.2%";
    public string Status { get; set; } = "Active Live"; // Active Live, Archived, Draft
    public bool IsActive { get; set; } = true;
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
}
