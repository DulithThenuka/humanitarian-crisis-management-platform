using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Application.Validators;

public static class IncidentStatusTransitionValidator
{
    private static readonly Dictionary<IncidentStatus, HashSet<IncidentStatus>> AllowedTransitions = new()
    {
        [IncidentStatus.Open] = new()
        {
            IncidentStatus.Open,
            IncidentStatus.Assigned,
            IncidentStatus.Pending,
            IncidentStatus.Verified,
            IncidentStatus.InProgress,
            IncidentStatus.Escalated,
            IncidentStatus.Resolved,
            IncidentStatus.Merged
        },
        [IncidentStatus.Assigned] = new()
        {
            IncidentStatus.Open,
            IncidentStatus.Assigned,
            IncidentStatus.Pending,
            IncidentStatus.Verified,
            IncidentStatus.InProgress,
            IncidentStatus.Escalated,
            IncidentStatus.Resolved,
            IncidentStatus.Merged
        },
        [IncidentStatus.Pending] = new()
        {
            IncidentStatus.Open,
            IncidentStatus.Assigned,
            IncidentStatus.Pending,
            IncidentStatus.Verified,
            IncidentStatus.InProgress,
            IncidentStatus.Escalated,
            IncidentStatus.Resolved,
            IncidentStatus.Merged
        },
        [IncidentStatus.Verified] = new()
        {
            IncidentStatus.Open,
            IncidentStatus.Assigned,
            IncidentStatus.Pending,
            IncidentStatus.Verified,
            IncidentStatus.InProgress,
            IncidentStatus.Escalated,
            IncidentStatus.Resolved,
            IncidentStatus.Merged
        },
        [IncidentStatus.InProgress] = new()
        {
            IncidentStatus.Open,
            IncidentStatus.Assigned,
            IncidentStatus.Pending,
            IncidentStatus.Verified,
            IncidentStatus.InProgress,
            IncidentStatus.Escalated,
            IncidentStatus.Resolved,
            IncidentStatus.Merged
        },
        [IncidentStatus.Escalated] = new()
        {
            IncidentStatus.Open,
            IncidentStatus.Assigned,
            IncidentStatus.Pending,
            IncidentStatus.Verified,
            IncidentStatus.InProgress,
            IncidentStatus.Escalated,
            IncidentStatus.Resolved,
            IncidentStatus.Closed
        },
        [IncidentStatus.Resolved] = new()
        {
            IncidentStatus.Resolved,
            IncidentStatus.Closed,
            IncidentStatus.InProgress,
            IncidentStatus.Escalated,
            IncidentStatus.Open
        },
        [IncidentStatus.Closed] = new()
        {
            IncidentStatus.Closed,
            IncidentStatus.Open // Reopen if needed
        },
        [IncidentStatus.Merged] = new()
        {
            IncidentStatus.Merged
        }
    };

    public static Result ValidateTransition(IncidentStatus fromStatus, IncidentStatus toStatus, string? reason)
    {
        if (string.IsNullOrWhiteSpace(reason))
        {
            return Result.Failure("A valid operational reason is required for status transitions.");
        }

        if (fromStatus == IncidentStatus.Merged && toStatus != IncidentStatus.Merged)
        {
            return Result.Failure("Merged duplicate cases cannot transition to another operational status.");
        }

        if (fromStatus == IncidentStatus.Closed && toStatus != IncidentStatus.Closed && toStatus != IncidentStatus.Open)
        {
            return Result.Failure($"Cannot transition directly from Closed to {toStatus}. Reopen the incident to Open first.");
        }

        if (!AllowedTransitions.TryGetValue(fromStatus, out var allowed) || !allowed.Contains(toStatus))
        {
            return Result.Failure($"Invalid status transition from '{fromStatus}' to '{toStatus}'.");
        }

        return Result.Success();
    }

    public static IncidentStatus ParseStatus(string? statusText, IncidentStatus fallback = IncidentStatus.Open)
    {
        if (string.IsNullOrWhiteSpace(statusText))
            return fallback;

        var normalized = statusText.Trim().Replace(" ", "").Replace("-", "").Replace("_", "");
        if (Enum.TryParse<IncidentStatus>(normalized, true, out var parsed))
            return parsed;

        return fallback;
    }

    public static PriorityLevel ParsePriority(string? priorityText, PriorityLevel fallback = PriorityLevel.Medium)
    {
        if (string.IsNullOrWhiteSpace(priorityText))
            return fallback;

        if (Enum.TryParse<PriorityLevel>(priorityText.Trim(), true, out var parsed))
            return parsed;

        return fallback;
    }
}

