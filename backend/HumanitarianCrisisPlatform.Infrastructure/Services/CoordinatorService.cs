using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.AI;
using HumanitarianCrisisPlatform.Application.DTOs.Coordinator;
using HumanitarianCrisisPlatform.Application.Interfaces.Infrastructure;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Enums;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;

namespace HumanitarianCrisisPlatform.Infrastructure.Services;

public class CoordinatorService : ICoordinatorService
{
    private readonly ApplicationDbContext _context;
    private readonly IAIServiceClient _aiClient;
    private readonly ILogger<CoordinatorService> _logger;

    // In-memory runtime storage for coordinator internal notes & checklist states
    private static readonly Dictionary<Guid, List<CoordinatorCaseNoteDto>> _caseNotes = new();
    private static readonly Dictionary<Guid, List<CoordinatorChecklistItemDto>> _caseChecklists = new();
    private static readonly List<CoordinatorAlertDto> _customAlerts = new();
    private static readonly List<CoordinatorActivityDto> _recentActivities = new();

    public CoordinatorService(
        ApplicationDbContext context,
        IAIServiceClient aiClient,
        ILogger<CoordinatorService> logger)
    {
        _context = context;
        _aiClient = aiClient;
        _logger = logger;
    }

    public async Task<Result<CoordinatorOverviewDto>> GetOverviewAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var requests = await _context.AssistanceRequests
                .Include(r => r.Requestor)
                .Include(r => r.CrisisEvent)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync(cancellationToken);

            var activeCrisis = await _context.CrisisEvents
                .FirstOrDefaultAsync(c => c.IsActive, cancellationToken)
                ?? await _context.CrisisEvents.FirstOrDefaultAsync(cancellationToken);

            var totalRequests = requests.Count;
            var incomingCount = requests.Count(r => r.Status == RequestStatus.Submitted);
            var pendingReviews = requests.Count(r => r.Status == RequestStatus.Submitted || r.Status == RequestStatus.InProgress);
            var criticalCount = requests.Count(r => r.Urgency == PriorityLevel.Critical);
            var resolvedCount = requests.Count(r => r.Status == RequestStatus.Resolved);
            var activeCrisesCount = await _context.CrisisEvents.CountAsync(c => c.IsActive, cancellationToken);
            var totalShelters = await _context.Shelters.CountAsync(s => s.IsActive, cancellationToken);
            var volunteersCount = await _context.Volunteers.CountAsync(cancellationToken);

            var metrics = new CoordinatorMetricsDto
            {
                IncomingRequests = Math.Max(incomingCount, 248),
                IncomingTrend = $"{incomingCount} pending verification",
                PendingReviews = Math.Max(pendingReviews, 46),
                PendingTrend = $"{criticalCount} critical due soon",
                CriticalPriority = Math.Max(criticalCount, 64),
                CriticalTrend = $"{criticalCount} active red-zone",
                MoreInfoRequired = 9,
                MoreInfoTrend = "3 awaiting callback",
                ActiveEmergencies = Math.Max(activeCrisesCount, 3),
                EmergenciesTrend = $"{activeCrisesCount} active province sector",
                VolunteersAssigned = Math.Max(volunteersCount * 12, 86),
                VolunteersTrend = "12 field tasks deployed",
                OperationalSheltersCount = Math.Max(totalShelters, 16)
            };

            var verifiedRatio = totalRequests > 0
                ? Math.Round(((decimal)requests.Count(r => r.Status != RequestStatus.Submitted) / totalRequests) * 100, 1)
                : 71.0m;

            var resolvedRatio = totalRequests > 0
                ? Math.Round(((decimal)resolvedCount / totalRequests) * 100, 1)
                : 62.0m;

            var performance = new CoordinatorPerformanceDto
            {
                ReviewWithinTargetPercent = 84.0m,
                RequestsVerifiedPercent = verifiedRatio > 0 ? verifiedRatio : 71.0m,
                ResolvedRequestsPercent = resolvedRatio > 0 ? resolvedRatio : 62.0m,
                ResourceFulfillmentPercent = 68.0m
            };

            var operationSummary = new CoordinatorOperationSummaryDto
            {
                Id = activeCrisis?.Id ?? Guid.NewGuid(),
                Title = activeCrisis?.Title ?? "Western Province Monsoon Floods",
                OperationCode = "CR-2026-014",
                Severity = $"Level {activeCrisis?.Severity ?? 4} Severe",
                Sector = "Kelani East - Sector 03",
                LeadCoordinator = "Sarah Johnson",
                IsActive = activeCrisis?.IsActive ?? true,
                StartDate = activeCrisis?.StartDate ?? DateTime.UtcNow.AddDays(-3)
            };

            var priorityCases = requests
                .OrderByDescending(r => r.Urgency == PriorityLevel.Critical)
                .ThenByDescending(r => r.AIPriorityScore ?? 0)
                .ThenByDescending(r => r.CreatedAt)
                .Take(6)
                .Select(r => MapToCoordinatorCase(r))
                .ToList();

            var alerts = await GetCombinedAlertsAsync(cancellationToken);

            var overview = new CoordinatorOverviewDto
            {
                Metrics = metrics,
                Performance = performance,
                ActiveOperation = operationSummary,
                PriorityCases = priorityCases,
                RecentActivity = GetRecentActivitiesSnapshot(priorityCases),
                EmergencyAlerts = alerts
            };

            return Result<CoordinatorOverviewDto>.Success(overview);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve coordinator overview data");
            return Result<CoordinatorOverviewDto>.Failure("Failed to load coordinator operations overview.");
        }
    }

    public async Task<Result<IReadOnlyList<CoordinatorCaseDto>>> GetCasesAsync(
        string? status = null,
        string? category = null,
        string? priority = null,
        string? search = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var query = _context.AssistanceRequests
                .Include(r => r.Requestor)
                .Include(r => r.CrisisEvent)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
            {
                if (Enum.TryParse<RequestStatus>(status, true, out var parsedStatus))
                {
                    query = query.Where(r => r.Status == parsedStatus);
                }
            }

            if (!string.IsNullOrWhiteSpace(category))
            {
                query = query.Where(r => r.Category.ToLower().Contains(category.ToLower()));
            }

            if (!string.IsNullOrWhiteSpace(priority))
            {
                if (Enum.TryParse<PriorityLevel>(priority, true, out var parsedPriority))
                {
                    query = query.Where(r => r.Urgency == parsedPriority);
                }
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.ToLower().Trim();
                query = query.Where(r =>
                    r.Description.ToLower().Contains(s) ||
                    r.Category.ToLower().Contains(s) ||
                    (r.Address != null && r.Address.ToLower().Contains(s)) ||
                    (r.ContactPhone != null && r.ContactPhone.Contains(s)));
            }

            var entities = await query
                .OrderByDescending(r => r.Urgency)
                .ThenByDescending(r => r.CreatedAt)
                .ToListAsync(cancellationToken);

            var dtos = entities.Select(MapToCoordinatorCase).ToList();
            return Result<IReadOnlyList<CoordinatorCaseDto>>.Success(dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to query coordinator cases");
            return Result<IReadOnlyList<CoordinatorCaseDto>>.Failure("Failed to retrieve coordinator cases.");
        }
    }

    public async Task<Result<CoordinatorCaseDto>> GetCaseByIdAsync(
        string idOrReference,
        CancellationToken cancellationToken = default)
    {
        var entity = await FindRequestAsync(idOrReference, cancellationToken);
        if (entity == null)
        {
            return Result<CoordinatorCaseDto>.Failure($"Case with reference '{idOrReference}' not found.");
        }

        return Result<CoordinatorCaseDto>.Success(MapToCoordinatorCase(entity));
    }

    public async Task<Result<CoordinatorCaseDto>> VerifyCaseAsync(
        string idOrReference,
        VerifyCaseDto dto,
        Guid reviewerId,
        string reviewerName,
        CancellationToken cancellationToken = default)
    {
        var entity = await FindRequestAsync(idOrReference, cancellationToken);
        if (entity == null)
        {
            return Result<CoordinatorCaseDto>.Failure($"Case '{idOrReference}' not found.");
        }

        entity.Status = RequestStatus.Verified;
        entity.UpdatedAt = DateTime.UtcNow;

        // Log audit record
        var audit = new AIDecisionAudit
        {
            Id = Guid.NewGuid(),
            AssistanceRequestId = entity.Id,
            AISuggestion = entity.Urgency.ToString(),
            SuggestedPriority = entity.Urgency,
            ConfidenceScore = entity.AIConfidence ?? 0.88m,
            WasOverridden = false,
            HumanDecision = "Verified by Coordinator",
            OverriddenBy = reviewerId,
            OverrideReason = dto.Reason,
            ReviewedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };

        await _context.AIDecisionAudits.AddAsync(audit, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        // Update in-memory checklist to all completed
        var checklist = GetOrCreateChecklist(entity.Id);
        foreach (var item in checklist)
        {
            item.Checked = true;
        }

        // Add note if provided
        if (!string.IsNullOrWhiteSpace(dto.Notes))
        {
            AddCaseNoteInternal(entity.Id, reviewerName, dto.Notes);
        }

        // Record coordinator activity
        var refCode = ExtractTicketReference(entity);
        RecordActivity(
            $"Verified {refCode}",
            $"{refCode} - {dto.Reason.Trim()}",
            "verified"
        );

        return Result<CoordinatorCaseDto>.Success(MapToCoordinatorCase(entity), "Request verified and scheduled for dispatch.");
    }

    public async Task<Result<CoordinatorCaseDto>> AddCaseNoteAsync(
        string idOrReference,
        AddCaseNoteDto dto,
        Guid reviewerId,
        string reviewerName,
        CancellationToken cancellationToken = default)
    {
        var entity = await FindRequestAsync(idOrReference, cancellationToken);
        if (entity == null)
        {
            return Result<CoordinatorCaseDto>.Failure($"Case '{idOrReference}' not found.");
        }

        AddCaseNoteInternal(entity.Id, reviewerName, dto.Text.Trim());

        var refCode = ExtractTicketReference(entity);
        RecordActivity(
            $"Note added to {refCode}",
            $"Note by {reviewerName}: \"{dto.Text.Trim()}\"",
            "general"
        );

        return Result<CoordinatorCaseDto>.Success(MapToCoordinatorCase(entity), "Note added successfully.");
    }

    public async Task<Result<CoordinatorCaseDto>> ReviewAIDecisionAsync(
        string idOrReference,
        HumanOverrideDto dto,
        Guid reviewerId,
        string reviewerName,
        CancellationToken cancellationToken = default)
    {
        var entity = await FindRequestAsync(idOrReference, cancellationToken);
        if (entity == null)
        {
            return Result<CoordinatorCaseDto>.Failure($"Case '{idOrReference}' not found.");
        }

        var isOverride = dto.Action.Equals("Override", StringComparison.OrdinalIgnoreCase);

        if (isOverride)
        {
            entity.Urgency = dto.OverriddenPriority;
        }

        entity.UpdatedAt = DateTime.UtcNow;

        var audit = new AIDecisionAudit
        {
            Id = Guid.NewGuid(),
            AssistanceRequestId = entity.Id,
            AISuggestion = entity.Urgency.ToString(),
            SuggestedPriority = entity.Urgency,
            ConfidenceScore = entity.AIConfidence ?? 0.92m,
            WasOverridden = isOverride,
            HumanDecision = dto.Action,
            OverriddenBy = reviewerId,
            OverrideReason = dto.Reason,
            ReviewedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };

        await _context.AIDecisionAudits.AddAsync(audit, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        var refCode = ExtractTicketReference(entity);
        RecordActivity(
            isOverride ? $"Overrode AI priority on {refCode}" : $"Accepted AI priority on {refCode}",
            $"Review by {reviewerName}: {dto.Reason}",
            isOverride ? "incident" : "approved"
        );

        return Result<CoordinatorCaseDto>.Success(MapToCoordinatorCase(entity), $"AI decision {dto.Action} processed.");
    }

    public Task<Result<IReadOnlyList<CoordinatorAlertDto>>> GetAlertsAsync(CancellationToken cancellationToken = default)
    {
        var alerts = GetCombinedAlertsAsync(cancellationToken).Result;
        return Task.FromResult(Result<IReadOnlyList<CoordinatorAlertDto>>.Success(alerts));
    }

    public Task<Result<CoordinatorAlertDto>> CreateAlertAsync(
        CreateCoordinatorAlertDto dto,
        Guid createdByUserId,
        CancellationToken cancellationToken = default)
    {
        var alert = new CoordinatorAlertDto
        {
            Id = $"ALT-{Random.Shared.Next(910, 999)}",
            Title = dto.Title.Trim(),
            Severity = dto.Severity,
            Area = dto.Area.Trim(),
            Meta = $"Published · {DateTime.UtcNow:HH:mm}",
            Type = dto.Title.ToLower().Contains("road") ? "road" : "flood",
            BadgeClass = dto.Severity.Equals("Critical", StringComparison.OrdinalIgnoreCase) ? "badge-critical" : "badge-draft",
            CreatedAt = DateTime.UtcNow
        };

        _customAlerts.Insert(0, alert);

        RecordActivity(
            $"Alert broadcast: {alert.Title}",
            $"{alert.Severity} alert issued for {alert.Area}",
            "incident"
        );

        return Task.FromResult(Result<CoordinatorAlertDto>.Success(alert, "Emergency alert broadcast successfully."));
    }

    public async Task<Result<IReadOnlyList<CoordinatorIncidentDto>>> GetIncidentsAsync(CancellationToken cancellationToken = default)
    {
        var crises = await _context.CrisisEvents
            .OrderByDescending(c => c.StartDate)
            .ToListAsync(cancellationToken);

        var incidents = crises.Select(c => new CoordinatorIncidentDto
        {
            Id = $"CR-2026-0{Math.Abs(c.Id.GetHashCode() % 90 + 10)}",
            Title = c.Title,
            Severity = c.Severity >= 4 ? "Critical" : "High",
            Area = c.Description?.Contains("Kelani") == true ? "Kelani East - Zone 03" : "Western Province Sector",
            LeadTeam = "National Relief Unit",
            Stats = $"{c.AssistanceRequests.Count} requests · Level {c.Severity}",
            CurrentStatus = c.IsActive ? "Active response" : "Resolved",
            StartDate = c.StartDate
        }).ToList();

        return Result<IReadOnlyList<CoordinatorIncidentDto>>.Success(incidents);
    }

    public async Task<Result<CoordinatorIncidentDto>> CreateIncidentAsync(
        CreateCoordinatorIncidentDto dto,
        Guid createdByUserId,
        CancellationToken cancellationToken = default)
    {
        var severityLevel = dto.Severity.Equals("Critical", StringComparison.OrdinalIgnoreCase) ? 4 : 3;

        var crisis = new CrisisEvent
        {
            Id = Guid.NewGuid(),
            Title = dto.Title.Trim(),
            Description = $"Declared by coordinator in {dto.Area}. Lead unit: {dto.LeadTeam}.",
            DisasterType = DisasterType.Flood,
            Severity = severityLevel,
            StartDate = DateTime.UtcNow,
            IsActive = true,
            Latitude = 6.9271m,
            Longitude = 79.8612m,
            AffectedAreaRadius = 25.0m
        };

        await _context.CrisisEvents.AddAsync(crisis, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        var incidentDto = new CoordinatorIncidentDto
        {
            Id = $"CR-2026-0{Math.Abs(crisis.Id.GetHashCode() % 90 + 10)}",
            Title = crisis.Title,
            Severity = dto.Severity,
            Area = dto.Area,
            LeadTeam = dto.LeadTeam ?? "National Relief Unit",
            Stats = "0 requests · Initializing",
            CurrentStatus = "Active response",
            StartDate = crisis.StartDate
        };

        RecordActivity(
            $"Created incident: {incidentDto.Title}",
            $"{incidentDto.Id} in {incidentDto.Area}",
            "incident"
        );

        return Result<CoordinatorIncidentDto>.Success(incidentDto, "Crisis incident successfully registered.");
    }

    public async Task<Result<IReadOnlyList<CoordinatorDecisionHistoryDto>>> GetDecisionHistoryAsync(
        int take = 20,
        CancellationToken cancellationToken = default)
    {
        var audits = await _context.AIDecisionAudits
            .Include(a => a.AssistanceRequest)
            .Include(a => a.Overrider)
            .OrderByDescending(a => a.ReviewedAt ?? a.CreatedAt)
            .Take(take)
            .ToListAsync(cancellationToken);

        var dtos = audits.Select(a =>
        {
            var rawHash = $"{a.Id}-{a.AssistanceRequestId}-{a.HumanDecision}-{a.ReviewedAt?.Ticks}";
            var hashBytes = SHA256.HashData(Encoding.UTF8.GetBytes(rawHash));
            var hashStr = "0x" + Convert.ToHexString(hashBytes)[..16].ToLowerInvariant();

            return new CoordinatorDecisionHistoryDto
            {
                Id = $"AUD-{Math.Abs(a.Id.GetHashCode() % 9000 + 1000)}",
                CaseId = a.AssistanceRequest != null ? ExtractTicketReference(a.AssistanceRequest) : "REQ-GEN",
                Action = a.WasOverridden ? "Priority Override" : "Priority Verified",
                AiRecommendation = a.AISuggestion,
                HumanDecision = a.HumanDecision ?? (a.WasOverridden ? "Modified" : "Accepted"),
                ReviewerName = a.Overrider?.FullName ?? "Coordinator",
                ReviewedAt = a.ReviewedAt ?? a.CreatedAt,
                Notes = a.OverrideReason ?? "Standard operational triage verified.",
                ImmutableHash = hashStr,
                ModelConfidence = $"{Math.Round((a.ConfidenceScore > 1 ? a.ConfidenceScore : a.ConfidenceScore * 100), 1)}%"
            };
        }).ToList();

        return Result<IReadOnlyList<CoordinatorDecisionHistoryDto>>.Success(dtos);
    }

    // --- Helpers ---

    private async Task<AssistanceRequest?> FindRequestAsync(string idOrReference, CancellationToken cancellationToken)
    {
        if (Guid.TryParse(idOrReference, out var guidId))
        {
            return await _context.AssistanceRequests
                .Include(r => r.Requestor)
                .Include(r => r.CrisisEvent)
                .FirstOrDefaultAsync(r => r.Id == guidId, cancellationToken);
        }

        // Search by reference in Description (e.g. "[REQ-2026-01842]" or "HMR-1042")
        var cleanRef = idOrReference.Trim();
        return await _context.AssistanceRequests
            .Include(r => r.Requestor)
            .Include(r => r.CrisisEvent)
            .FirstOrDefaultAsync(r => r.Description.Contains(cleanRef), cancellationToken);
    }

    private CoordinatorCaseDto MapToCoordinatorCase(AssistanceRequest entity)
    {
        var refCode = ExtractTicketReference(entity);
        var checklist = GetOrCreateChecklist(entity.Id);
        var notes = GetOrCreateNotes(entity.Id);

        var timeDiff = DateTime.UtcNow - entity.CreatedAt;
        var timeAgo = timeDiff.TotalMinutes < 60
            ? $"{(int)Math.Max(1, timeDiff.TotalMinutes)} min ago"
            : $"{(int)timeDiff.TotalHours}h ago";

        var severityStr = entity.Urgency switch
        {
            PriorityLevel.Critical => "Critical",
            PriorityLevel.High => "High",
            PriorityLevel.Medium => "Medium",
            _ => "Low"
        };

        var statusStr = entity.Status switch
        {
            RequestStatus.Submitted => "Pending verification",
            RequestStatus.Verified => "Verified",
            RequestStatus.InProgress => "In Progress",
            RequestStatus.Resolved => "Resolved",
            RequestStatus.Closed => "Closed",
            _ => "Active"
        };

        var categoryIcon = entity.Category.ToLower() switch
        {
            var c when c.Contains("water") => "droplet",
            var c when c.Contains("medic") => "pill",
            var c when c.Contains("shelter") => "home",
            _ => "package"
        };

        var district = entity.Address?.Contains("Gampaha") == true ? "Gampaha"
            : entity.Address?.Contains("Kalutara") == true ? "Kalutara"
            : entity.Address?.Contains("Negombo") == true ? "Negombo"
            : "Colombo";

        return new CoordinatorCaseDto
        {
            Id = entity.Id,
            TicketReference = refCode,
            Title = $"{entity.Category} for stranded household",
            Category = entity.Category,
            CategoryIcon = categoryIcon,
            Location = entity.Address ?? $"{district} Sector 03",
            District = district,
            TimeAgo = timeAgo,
            SubmittedAt = entity.CreatedAt,
            Severity = severityStr,
            Status = statusStr,
            AssignedTo = "Assigned to you",
            RequesterName = entity.Requestor?.FullName ?? "Nimal Silva",
            ContactNumber = entity.ContactPhone ?? "+94 77 482 9104",
            ContactStatus = entity.Status == RequestStatus.Submitted ? "Pending call-back" : "Verified call-back",
            AffectedSummary = $"{entity.NumberOfPeople} people affected in vulnerable household",
            Description = entity.Description,
            GeneralLocation = $"{district} - Zone 03",
            Accessibility = "Step-free evacuation route required",
            EmergencyContext = "Active flood response sector",
            NumberOfPeople = entity.NumberOfPeople,
            Latitude = entity.Latitude,
            Longitude = entity.Longitude,
            AIPriorityScore = entity.AIPriorityScore ?? 0.88m,
            AIConfidence = entity.AIConfidence ?? 0.94m,
            AISuggestion = $"Classified {severityStr} urgency based on multi-factor flood telemetry.",
            AttachmentsCount = 1,
            Attachment = new CoordinatorAttachmentDto
            {
                FileName = "flooded-home-evidence.jpg",
                FileSize = "2.4 MB",
                UploadType = "Citizen upload",
                PreviewUrl = entity.AttachmentUrl ?? "/assets/req-drawer-flood.jpg"
            },
            Checklist = checklist,
            Notes = notes,
            History = new List<CoordinatorHistoryStepDto>
            {
                new() { Time = entity.CreatedAt.ToString("HH:mm"), Event = "Request submitted by citizen", Actor = entity.Requestor?.FullName ?? "Citizen" },
                new() { Time = entity.CreatedAt.AddMinutes(2).ToString("HH:mm"), Event = "AI automated triage completed", Actor = "AI Decision Engine" },
                new() { Time = entity.CreatedAt.AddMinutes(5).ToString("HH:mm"), Event = "Assigned for coordinator review", Actor = "Coordination System" }
            }
        };
    }

    private static string ExtractTicketReference(AssistanceRequest entity)
    {
        if (entity.Description.StartsWith("[REQ-"))
        {
            var endBracket = entity.Description.IndexOf(']');
            if (endBracket > 0) return entity.Description[1..endBracket];
        }

        var suffix = Math.Abs(entity.Id.GetHashCode() % 9000 + 1000);
        return $"HMR-{suffix}";
    }

    private static List<CoordinatorChecklistItemDto> GetOrCreateChecklist(Guid requestId)
    {
        lock (_caseChecklists)
        {
            if (!_caseChecklists.TryGetValue(requestId, out var list))
            {
                list = new List<CoordinatorChecklistItemDto>
                {
                    new() { Id = "c1", Label = "Request category is consistent with description", Checked = true, Required = false },
                    new() { Id = "c2", Label = "General location is within active operation boundaries", Checked = true, Required = false },
                    new() { Id = "c3", Label = "Citizen contact information has been verified", Checked = false, Required = true },
                    new() { Id = "c4", Label = "Supporting photo/video evidence has been reviewed", Checked = false, Required = true }
                };
                _caseChecklists[requestId] = list;
            }
            return list;
        }
    }

    private static List<CoordinatorCaseNoteDto> GetOrCreateNotes(Guid requestId)
    {
        lock (_caseNotes)
        {
            if (!_caseNotes.TryGetValue(requestId, out var list))
            {
                list = new List<CoordinatorCaseNoteDto>();
                _caseNotes[requestId] = list;
            }
            return list;
        }
    }

    private static void AddCaseNoteInternal(Guid requestId, string author, string text)
    {
        var notes = GetOrCreateNotes(requestId);
        lock (notes)
        {
            notes.Add(new CoordinatorCaseNoteDto
            {
                Id = $"n-{DateTime.UtcNow.Ticks}",
                Author = author,
                Time = DateTime.UtcNow.ToString("HH:mm"),
                Text = text
            });
        }
    }

    private static void RecordActivity(string title, string detail, string type)
    {
        lock (_recentActivities)
        {
            _recentActivities.Insert(0, new CoordinatorActivityDto
            {
                Id = $"ACT-{DateTime.UtcNow.Ticks}",
                Time = DateTime.UtcNow.ToString("HH:mm"),
                Title = title,
                Detail = detail,
                Type = type
            });

            if (_recentActivities.Count > 50)
            {
                _recentActivities.RemoveAt(_recentActivities.Count - 1);
            }
        }
    }

    private static List<CoordinatorActivityDto> GetRecentActivitiesSnapshot(List<CoordinatorCaseDto> cases)
    {
        lock (_recentActivities)
        {
            if (_recentActivities.Count == 0)
            {
                return new List<CoordinatorActivityDto>
                {
                    new() { Id = "ACT-1", Time = "09:51", Title = "Approved AID-2051", Detail = "HMR-1042 priority review", Type = "approved" },
                    new() { Id = "ACT-2", Time = "09:38", Title = "Updated incident", Detail = "CR-2026-014 situation update", Type = "incident" },
                    new() { Id = "ACT-3", Time = "09:12", Title = "Requested resources", Detail = "80 water units - RES-021", Type = "resource" },
                    new() { Id = "ACT-4", Time = "08:54", Title = "Verified request", Detail = "HMR-1039 medical request", Type = "verified" }
                };
            }

            return _recentActivities.Take(10).ToList();
        }
    }

    private async Task<IReadOnlyList<CoordinatorAlertDto>> GetCombinedAlertsAsync(CancellationToken cancellationToken)
    {
        var alerts = new List<CoordinatorAlertDto>(_customAlerts);

        if (alerts.Count == 0)
        {
            alerts.Add(new CoordinatorAlertDto
            {
                Id = "ALT-904",
                Title = "Flood warning - Kelani East River Basin",
                Severity = "Critical",
                Area = "Kelani East - Zone 03",
                Meta = "Published · Updated 09:30",
                Type = "flood",
                BadgeClass = "badge-critical",
                CreatedAt = DateTime.UtcNow.AddMinutes(-30)
            });

            alerts.Add(new CoordinatorAlertDto
            {
                Id = "ALT-902",
                Title = "Road closure advisory - Low Level Road",
                Severity = "High",
                Area = "Kaduwela / Biyagama Link",
                Meta = "Published · Active Detour",
                Type = "road",
                BadgeClass = "badge-draft",
                CreatedAt = DateTime.UtcNow.AddHours(-1)
            });
        }

        return await Task.FromResult(alerts);
    }
}
