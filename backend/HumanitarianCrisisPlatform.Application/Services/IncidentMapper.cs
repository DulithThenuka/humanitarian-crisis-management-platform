using HumanitarianCrisisPlatform.Application.DTOs.Incidents;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Application.Services;

public static class IncidentMapper
{
    public static bool IsCitizenRole(string? role)
        => string.Equals(role, "Citizen", StringComparison.OrdinalIgnoreCase);

    public static IncidentResponseDto ToDto(Incident entity, bool redactForCitizen = false)
    {
        var priorityStr = entity.Priority.ToString();
        var priorityType = priorityStr.ToLowerInvariant();

        var statusStr = FormatStatusDisplay(entity.Status);
        var statusType = entity.Status switch
        {
            IncidentStatus.Open => "open",
            IncidentStatus.Assigned => "assigned",
            IncidentStatus.Pending => "pending",
            IncidentStatus.Verified => "assigned",
            IncidentStatus.InProgress => "assigned",
            IncidentStatus.Escalated => "escalated",
            IncidentStatus.Resolved => "verified",
            IncidentStatus.Closed => "closed",
            IncidentStatus.Merged => "closed",
            _ => "open"
        };

        var verificationStr = string.IsNullOrWhiteSpace(entity.VerificationStatus)
            ? "Awaiting review"
            : entity.VerificationStatus;

        var verificationType = verificationStr.ToLowerInvariant() switch
        {
            var v when v.Contains("verified") => "verified",
            var v when v.Contains("need") || v.Contains("clarif") => "warning",
            _ => "pending"
        };

        var notes = new List<string>();
        if (!redactForCitizen)
        {
            if (!string.IsNullOrWhiteSpace(entity.InternalNotes))
            {
                notes.AddRange(entity.InternalNotes.Split('\n', StringSplitOptions.RemoveEmptyEntries));
            }
            if (entity.StatusHistories != null && entity.StatusHistories.Count > 0)
            {
                foreach (var h in entity.StatusHistories.OrderByDescending(x => x.ChangedAt))
                {
                    if (!string.IsNullOrWhiteSpace(h.Reason) && !notes.Contains(h.Reason))
                    {
                        notes.Add(h.Reason);
                    }
                }
            }
        }

        return new IncidentResponseDto
        {
            Id = entity.Id,
            CaseNumber = entity.CaseNumber,
            Title = string.IsNullOrWhiteSpace(entity.Title) ? entity.CategoryDisplay : entity.Title,
            Category = string.IsNullOrWhiteSpace(entity.CategoryDisplay)
                ? Incident.FormatCategoryDisplay(entity.Category)
                : entity.CategoryDisplay,
            CategoryEnum = entity.Category,
            OperationalArea = entity.OperationalArea,
            Priority = priorityStr,
            PriorityLevel = entity.Priority,
            PriorityType = priorityType,
            Verification = verificationStr,
            VerificationType = verificationType,
            AssignedStaff = string.IsNullOrWhiteSpace(entity.AssignedStaffName) ? "Unassigned" : entity.AssignedStaffName,
            AssignedToUserId = entity.AssignedToUserId,
            Status = statusStr,
            StatusEnum = entity.Status,
            StatusType = statusType,
            AffectedPeopleCount = entity.AffectedPeople,
            AffectedPeople = entity.AffectedPeople == 1 ? "1 person" : $"{entity.AffectedPeople} people",
            CurrentSafety = entity.CurrentSafety ?? "Reported location",
            Accessibility = entity.AccessibilityNeeds ?? "None specified",
            SubmittedAgo = FormatSubmittedAgo(entity.CreatedAt),
            CitizenQuote = entity.Description,
            Description = entity.Description,
            Address = entity.Address,
            Latitude = entity.Latitude,
            Longitude = entity.Longitude,
            ContactPhone = redactForCitizen ? entity.ContactPhone : null, // Role-scoped privacy
            CitizenId = entity.CitizenId,
            AssistanceRequestId = entity.AssistanceRequestId,
            CrisisEventId = entity.CrisisEventId,
            IsDuplicate = entity.IsDuplicate,
            MergedIntoIncidentId = entity.MergedIntoIncidentId,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
            VerifiedAt = entity.VerifiedAt,
            EscalatedAt = entity.EscalatedAt,
            ResolvedAt = entity.ResolvedAt,
            ClosedAt = entity.ClosedAt,
            ResolutionNotes = entity.ResolutionNotes,
            InternalNotes = redactForCitizen ? null : entity.InternalNotes,
            Notes = notes
        };
    }

    public static string FormatStatusDisplay(IncidentStatus status)
    {
        return status switch
        {
            IncidentStatus.InProgress => "In Progress",
            _ => status.ToString()
        };
    }

    public static string FormatSubmittedAgo(DateTime createdAt)
    {
        var diff = DateTime.UtcNow - createdAt;
        if (diff.TotalMinutes < 2) return "Just now";
        if (diff.TotalMinutes < 60) return $"{(int)diff.TotalMinutes} minutes ago";
        if (diff.TotalHours < 24) return $"{(int)diff.TotalHours} hours ago";
        return $"{(int)diff.TotalDays} days ago";
    }
}

