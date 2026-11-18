using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Partners;
using HumanitarianCrisisPlatform.Application.Interfaces;
using HumanitarianCrisisPlatform.Application.Interfaces.Repositories;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;
using HumanitarianCrisisPlatform.Domain.Entities;

namespace HumanitarianCrisisPlatform.Application.Services;

public class PartnerService : IPartnerService
{
    private static readonly HashSet<string> DispatchedStatuses = new(StringComparer.OrdinalIgnoreCase)
    {
        "Deployed", "Distributing", "Serving", "Active", "Delivered", "Dispatched", "Installed", "Erected"
    };

    private readonly IPartnerRepository _partnerRepository;
    private readonly IUnitOfWork _unitOfWork;

    public PartnerService(IPartnerRepository partnerRepository, IUnitOfWork unitOfWork)
    {
        _partnerRepository = partnerRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<PartnerPortalSummaryDto>> GetDashboardSummaryAsync(CancellationToken cancellationToken = default)
    {
        var partners = await _partnerRepository.GetAllPartnersWithDetailsAsync(cancellationToken: cancellationToken);
        var zones = await _partnerRepository.GetAllSectorZonesWithPartnersAsync(cancellationToken);
        var commitments = await _partnerRepository.GetAllCommitmentsAsync(cancellationToken: cancellationToken);

        var totalPartners = partners.Count;
        var verifiedMous = partners.Count(p => !p.MouStatus.Contains("Pending", StringComparison.OrdinalIgnoreCase));
        var verifiedPct = totalPartners == 0 ? 0 : (int)Math.Round((double)verifiedMous * 100 / totalPartners);

        var totalCommitments = commitments.Count;
        var dispatchedCommitments = commitments.Count(c => DispatchedStatuses.Contains(c.Status));
        var dispatchedPct = totalCommitments == 0 ? 0 : (int)Math.Round((double)dispatchedCommitments * 100 / totalCommitments);

        var totalValueMillions = Math.Round(commitments.Sum(c => c.EstimatedValueLkr) / 1_000_000m, 2);

        var summary = new PartnerPortalSummaryDto
        {
            AccreditedPartnersCount = totalPartners,
            VerifiedMouPercentage = verifiedPct,
            JointResponseUnitsCount = partners.Sum(p => p.FieldTeamsCount),
            ActiveZonesCount = zones.Count,
            PledgedAidValueMillionsLkr = totalValueMillions,
            DispatchedPercentage = dispatchedPct,
            FleetDeployedCount = partners.Sum(p => p.FleetCount),
            TotalCommitmentsCount = totalCommitments
        };

        return Result<PartnerPortalSummaryDto>.Success(summary);
    }

    public async Task<Result<IReadOnlyList<PartnerOrganisationDto>>> GetPartnersAsync(
        string? search = null,
        string? status = null,
        CancellationToken cancellationToken = default)
    {
        var partners = await _partnerRepository.GetAllPartnersWithDetailsAsync(search, status, cancellationToken);
        var dtos = partners.Select(MapPartnerToDto).ToList();
        return Result<IReadOnlyList<PartnerOrganisationDto>>.Success(dtos);
    }

    public async Task<Result<PartnerOrganisationDto>> GetPartnerByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var partner = await _partnerRepository.GetPartnerByIdWithDetailsAsync(id, cancellationToken);
        if (partner is null)
            return Result<PartnerOrganisationDto>.Failure($"Partner organisation '{id}' was not found.");

        return Result<PartnerOrganisationDto>.Success(MapPartnerToDto(partner));
    }

    public async Task<Result<PartnerOrganisationDto>> CreatePartnerAsync(
        CreatePartnerOrganisationDto dto,
        string? userId,
        CancellationToken cancellationToken = default)
    {
        var existing = await _partnerRepository.GetPartnerByCodeAsync(dto.Code.Trim(), cancellationToken);
        if (existing is not null)
            return Result<PartnerOrganisationDto>.Failure($"A partner organisation with code '{dto.Code}' already exists.");

        var entity = new PartnerOrganisation
        {
            Code = dto.Code.Trim().ToUpperInvariant(),
            Name = dto.Name.Trim(),
            Acronym = dto.Acronym.Trim().ToUpperInvariant(),
            Type = dto.Type.Trim(),
            LeadContact = dto.LeadContact.Trim(),
            Phone = dto.Phone.Trim(),
            Email = dto.Email.Trim(),
            Status = string.IsNullOrWhiteSpace(dto.Status) ? "Active Response" : dto.Status.Trim(),
            StatusClass = ResolveStatusClass(dto.Status),
            MouStatus = dto.MouStatus.Trim(),
            MouBadge = ResolveMouBadge(dto.MouStatus),
            FieldTeamsCount = dto.FieldTeamsCount,
            FleetCount = dto.FleetCount,
            CreatedBy = userId
        };

        await _partnerRepository.AddAsync(entity, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        return Result<PartnerOrganisationDto>.Success(MapPartnerToDto(entity), "Partner organisation registered successfully.");
    }

    public async Task<Result<PartnerOrganisationDto>> UpdatePartnerStatusAsync(
        Guid id,
        UpdatePartnerStatusDto dto,
        string? userId,
        CancellationToken cancellationToken = default)
    {
        var partner = await _partnerRepository.GetPartnerByIdWithDetailsAsync(id, cancellationToken);
        if (partner is null)
            return Result<PartnerOrganisationDto>.Failure($"Partner organisation '{id}' was not found.");

        partner.Status = dto.Status.Trim();
        partner.StatusClass = ResolveStatusClass(dto.Status);

        if (!string.IsNullOrWhiteSpace(dto.MouStatus))
        {
            partner.MouStatus = dto.MouStatus.Trim();
            partner.MouBadge = ResolveMouBadge(dto.MouStatus);
        }

        partner.UpdatedAt = DateTime.UtcNow;
        partner.LastModifiedBy = userId;

        await _partnerRepository.UpdateAsync(partner, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        return Result<PartnerOrganisationDto>.Success(MapPartnerToDto(partner), "Partner organisation status updated.");
    }

    public async Task<Result<IReadOnlyList<PartnerCommitmentDto>>> GetCommitmentsAsync(
        Guid? partnerId = null,
        CancellationToken cancellationToken = default)
    {
        var commitments = await _partnerRepository.GetAllCommitmentsAsync(partnerId, cancellationToken);
        var dtos = commitments.Select(MapCommitmentToDto).ToList();
        return Result<IReadOnlyList<PartnerCommitmentDto>>.Success(dtos);
    }

    public async Task<Result<PartnerCommitmentDto>> LogCommitmentAsync(
        CreatePartnerCommitmentDto dto,
        Guid? userId,
        CancellationToken cancellationToken = default)
    {
        if (dto.Qty <= 0)
            return Result<PartnerCommitmentDto>.Failure("Commitment quantity must be greater than zero.");

        var partner = await _partnerRepository.GetPartnerByIdWithDetailsAsync(dto.PartnerOrganisationId, cancellationToken);
        if (partner is null)
            return Result<PartnerCommitmentDto>.Failure($"Partner organisation '{dto.PartnerOrganisationId}' was not found.");

        var commitment = new PartnerCommitment
        {
            PartnerOrganisationId = partner.Id,
            PartnerOrganisation = partner,
            Item = dto.Item.Trim(),
            Quantity = dto.Qty,
            DestinationZone = dto.DestinationZone.Trim(),
            Status = string.IsNullOrWhiteSpace(dto.Status) ? "Pledged" : dto.Status.Trim(),
            EstimatedValueLkr = dto.EstimatedValueLkr,
            LoggedByUserId = userId,
            CreatedBy = userId?.ToString()
        };

        await _partnerRepository.AddCommitmentAsync(commitment, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        return Result<PartnerCommitmentDto>.Success(MapCommitmentToDto(commitment), "Resource commitment logged successfully.");
    }

    public async Task<Result<PartnerCommitmentDto>> UpdateCommitmentStatusAsync(
        Guid commitmentId,
        UpdateCommitmentStatusDto dto,
        string? userId,
        CancellationToken cancellationToken = default)
    {
        var commitment = await _partnerRepository.GetCommitmentByIdAsync(commitmentId, cancellationToken);
        if (commitment is null)
            return Result<PartnerCommitmentDto>.Failure($"Commitment '{commitmentId}' was not found.");

        commitment.Status = dto.Status.Trim();
        commitment.UpdatedAt = DateTime.UtcNow;
        commitment.LastModifiedBy = userId;

        await _unitOfWork.CommitAsync(cancellationToken);

        return Result<PartnerCommitmentDto>.Success(MapCommitmentToDto(commitment), "Commitment status updated.");
    }

    public async Task<Result<IReadOnlyList<SectorZoneDto>>> GetSectorZonesAsync(CancellationToken cancellationToken = default)
    {
        var zones = await _partnerRepository.GetAllSectorZonesWithPartnersAsync(cancellationToken);
        var dtos = zones.Select(MapZoneToDto).ToList();
        return Result<IReadOnlyList<SectorZoneDto>>.Success(dtos);
    }

    public async Task<Result<SectorZoneDto>> AssignPartnerToZoneAsync(
        AssignPartnerZoneDto dto,
        string? userId,
        CancellationToken cancellationToken = default)
    {
        var partner = await _partnerRepository.GetByIdAsync(dto.PartnerOrganisationId, cancellationToken);
        if (partner is null)
            return Result<SectorZoneDto>.Failure($"Partner organisation '{dto.PartnerOrganisationId}' was not found.");

        var zone = await _partnerRepository.GetSectorZoneByIdAsync(dto.SectorZoneId, cancellationToken);
        if (zone is null)
            return Result<SectorZoneDto>.Failure($"Sector zone '{dto.SectorZoneId}' was not found.");

        var existing = await _partnerRepository.GetZoneAssignmentAsync(dto.PartnerOrganisationId, dto.SectorZoneId, cancellationToken);
        if (existing is not null)
        {
            existing.RoleSummary = dto.RoleSummary.Trim();
            existing.UpdatedAt = DateTime.UtcNow;
            existing.LastModifiedBy = userId;
        }
        else
        {
            await _partnerRepository.AddZoneAssignmentAsync(new PartnerZoneAssignment
            {
                PartnerOrganisationId = dto.PartnerOrganisationId,
                SectorZoneId = dto.SectorZoneId,
                RoleSummary = dto.RoleSummary.Trim(),
                CreatedBy = userId
            }, cancellationToken);
        }

        await _unitOfWork.CommitAsync(cancellationToken);

        var updatedZone = await _partnerRepository.GetSectorZoneByIdAsync(dto.SectorZoneId, cancellationToken);
        return Result<SectorZoneDto>.Success(MapZoneToDto(updatedZone!), "Partner assigned to sector zone.");
    }

    private static PartnerOrganisationDto MapPartnerToDto(PartnerOrganisation p)
    {
        return new PartnerOrganisationDto
        {
            Id = p.Id,
            Code = p.Code,
            Name = p.Name,
            Acronym = p.Acronym,
            Type = p.Type,
            LeadContact = p.LeadContact,
            Phone = p.Phone,
            Email = p.Email,
            Status = p.Status,
            StatusClass = p.StatusClass,
            MouStatus = p.MouStatus,
            MouBadge = p.MouBadge,
            FieldTeamsCount = p.FieldTeamsCount,
            FleetCount = p.FleetCount,
            AssignedZones = p.ZoneAssignments
                .Where(za => za.SectorZone != null)
                .Select(za => za.SectorZone!.ZoneCode)
                .Distinct()
                .ToList(),
            Commitments = p.Commitments
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new PartnerCommitmentDto
                {
                    Id = c.Id,
                    PartnerOrganisationId = p.Id,
                    PartnerCode = p.Code,
                    PartnerName = p.Name,
                    PartnerAcronym = p.Acronym,
                    Item = c.Item,
                    Qty = c.Quantity,
                    Status = c.Status,
                    DestinationZone = c.DestinationZone,
                    EstimatedValueLkr = c.EstimatedValueLkr,
                    CreatedAt = c.CreatedAt
                })
                .ToList()
        };
    }

    private static PartnerCommitmentDto MapCommitmentToDto(PartnerCommitment c)
    {
        return new PartnerCommitmentDto
        {
            Id = c.Id,
            PartnerOrganisationId = c.PartnerOrganisationId,
            PartnerCode = c.PartnerOrganisation?.Code ?? string.Empty,
            PartnerName = c.PartnerOrganisation?.Name ?? string.Empty,
            PartnerAcronym = c.PartnerOrganisation?.Acronym ?? string.Empty,
            Item = c.Item,
            Qty = c.Quantity,
            Status = c.Status,
            DestinationZone = c.DestinationZone,
            EstimatedValueLkr = c.EstimatedValueLkr,
            CreatedAt = c.CreatedAt
        };
    }

    private static SectorZoneDto MapZoneToDto(SectorZone z)
    {
        return new SectorZoneDto
        {
            Id = z.Id,
            Name = z.Name,
            ZoneCode = z.ZoneCode,
            PriorityStatus = z.PriorityStatus,
            StatusClass = z.StatusClass,
            Description = z.Description,
            LeadAgency = z.LeadAgency,
            CoveragePercent = z.CoveragePercent,
            AssignedPartners = z.PartnerAssignments
                .Where(pa => pa.PartnerOrganisation != null)
                .Select(pa => new SectorPartnerSummaryDto
                {
                    PartnerId = pa.PartnerOrganisationId,
                    PartnerName = pa.PartnerOrganisation!.Name,
                    PartnerAcronym = pa.PartnerOrganisation.Acronym,
                    RoleSummary = pa.RoleSummary
                })
                .ToList()
        };
    }

    private static string ResolveStatusClass(string? status)
    {
        if (string.IsNullOrWhiteSpace(status)) return "status-active";
        var s = status.Trim().ToLowerInvariant();
        if (s.Contains("staged")) return "status-staged";
        if (s.Contains("transit")) return "status-transit";
        if (s.Contains("mobilis") || s.Contains("pending") || s.Contains("warning")) return "status-warning";
        return "status-active";
    }

    private static string ResolveMouBadge(string mouStatus)
    {
        var s = mouStatus.Trim().ToLowerInvariant();
        if (s.Contains("pending") || s.Contains("review")) return "badge-review";
        if (s.Contains("un ") || s.StartsWith("un")) return "badge-un";
        return "badge-verified";
    }

    // =========================================================================
    // Partner Organisation Officer Implementation
    // =========================================================================

    private static readonly List<PartnerRecordDto> InMemOfficerRecords = new()
    {
        new PartnerRecordDto
        {
            Id = "COM-118",
            SharedIncident = "CR-2026-014",
            Contribution = "Drinking water",
            Quantity = "800 units",
            ResponsibleOrg = "National Relief Unit",
            Deadline = "18 Feb · 14:00",
            Status = "Dispatched",
            StatusBadge = "dispatched",
            OperationalArea = "Western Province",
            Notes = "Dispatched via convoy Bravo-3. Arrival inspection confirmed.",
            CreatedAt = DateTime.UtcNow.AddHours(-2)
        },
        new PartnerRecordDto
        {
            Id = "COM-115",
            SharedIncident = "CR-2026-014",
            Contribution = "Medical support team",
            Quantity = "1 team",
            ResponsibleOrg = "MedCare Lanka",
            Deadline = "18 Feb · 16:00",
            Status = "Confirmed",
            StatusBadge = "confirmed",
            OperationalArea = "Western Province",
            Notes = "Medical team of 6 clinicians equipped with trauma packs.",
            CreatedAt = DateTime.UtcNow.AddHours(-4)
        },
        new PartnerRecordDto
        {
            Id = "REQ-309",
            SharedIncident = "CR-2026-011",
            Contribution = "Transport vehicles",
            Quantity = "4 vehicles",
            ResponsibleOrg = "Partner network",
            Deadline = "19 Feb · 09:00",
            Status = "Awaiting response",
            StatusBadge = "awaiting",
            OperationalArea = "Southern Province",
            Notes = "Awaiting operating area safety certification before dispatching 4WD trucks.",
            CreatedAt = DateTime.UtcNow.AddHours(-6)
        },
        new PartnerRecordDto
        {
            Id = "COM-109",
            SharedIncident = "CR-2026-014",
            Contribution = "Family food kits",
            Quantity = "320 kits",
            ResponsibleOrg = "Community Relief Lanka",
            Deadline = "18 Feb · 12:00",
            Status = "Delayed",
            StatusBadge = "delayed",
            OperationalArea = "Western Province",
            Notes = "Responsible organisation asked for ETA due to road blockages near Kelani river basin.",
            CreatedAt = DateTime.UtcNow.AddHours(-8)
        }
    };

    private static readonly List<PartnerTimelineEntryDto> InMemTimeline = new()
    {
        new PartnerTimelineEntryDto
        {
            Id = "tl-1",
            Time = "10:14",
            Title = "Partner Officer reviewed linked record",
            Scope = "HMR-1042 · authorised participants only",
            Author = "Ravindu Perera",
            CreatedAt = DateTime.UtcNow.AddMinutes(-30)
        },
        new PartnerTimelineEntryDto
        {
            Id = "tl-2",
            Time = "10:02",
            Title = "Scoped handoff received",
            Scope = "HMR-1042 · authorised participants only",
            Author = "Emergency Coordinator (Amara Chen)",
            CreatedAt = DateTime.UtcNow.AddMinutes(-42)
        },
        new PartnerTimelineEntryDto
        {
            Id = "tl-3",
            Time = "09:48",
            Title = "Citizen update prepared",
            Scope = "HMR-1042 · authorised participants only",
            Author = "Field Dispatch Team",
            CreatedAt = DateTime.UtcNow.AddMinutes(-56)
        },
        new PartnerTimelineEntryDto
        {
            Id = "tl-4",
            Time = "09:30",
            Title = "Simulated recommendation generated",
            Scope = "HMR-1042 · authorised participants only",
            Author = "HumanAid AI Triage Engine",
            CreatedAt = DateTime.UtcNow.AddMinutes(-74)
        }
    };

    public async Task<Result<PartnerOfficerDashboardDto>> GetOfficerDashboardAsync(
        string? organisation = null,
        CancellationToken cancellationToken = default)
    {
        var commitments = await _partnerRepository.GetAllCommitmentsAsync(cancellationToken: cancellationToken);
        var totalCommitments = InMemOfficerRecords.Count + commitments.Count;

        var dashboard = new PartnerOfficerDashboardDto
        {
            Officer = new PartnerOfficerProfileDto
            {
                FullName = "Ravindu Perera",
                ShortName = "RP",
                Role = "Partner Organisation Officer",
                Organisation = string.IsNullOrWhiteSpace(organisation) ? "National Relief Unit" : organisation,
                OperationalArea = "Western Province Crisis Operations"
            },
            Metrics = new PartnerOfficerMetricsDto
            {
                VerificationStatus = new() { Value = "Verified", Sub = string.IsNullOrWhiteSpace(organisation) ? "National Relief Unit" : organisation },
                CollaborationRequests = new() { Value = "14", Sub = "5 awaiting review" },
                ResourcesOffered = new() { Value = "2,480", Sub = "Demo units" },
                ActiveCommitments = new() { Value = totalCommitments.ToString(), Sub = "6 due today" },
                PendingApprovals = new() { Value = "5", Sub = "Organisation scope" },
                OnTimeDeliveries = new() { Value = "89%", Sub = "Demo summary" }
            },
            PriorityAttention = new List<PartnerOfficerPriorityItemDto>
            {
                new() { Id = "COM-109", Title = "COM-109 delayed", Desc = "Responsible organisation asked for ETA", Tag = "critical", RelatedTab = "profile", Timestamp = "12 mins ago" },
                new() { Id = "REQ-309", Title = "REQ-309 needs response", Desc = "Operating-area coordination requested", Tag = "warning", RelatedTab = "requests", Timestamp = "25 mins ago" },
                new() { Id = "COM-102", Title = "Receipt confirmation", Desc = "COM-102 confirmed by authorised recipient", Tag = "success", RelatedTab = "contributions", Timestamp = "1 hour ago" }
            },
            WorkflowSteps = new List<PartnerOfficerWorkflowStepDto>
            {
                new() { Step = 1, Title = "Citizen request recorded", Sub = "Only relevant roles receive the handoff", Status = "completed" },
                new() { Step = 2, Title = "Human case review", Sub = "Partner Officer action retained in audit history", Status = "completed" },
                new() { Step = 3, Title = "Resource / shelter decision", Sub = "Only relevant roles receive the handoff", Status = "pending" },
                new() { Step = 4, Title = "Volunteer or partner handoff", Sub = "Only relevant roles receive the handoff", Status = "pending" },
                new() { Step = 5, Title = "Citizen status notification", Sub = "Only relevant roles receive the handoff", Status = "pending" }
            },
            Activity = new List<PartnerOfficerActivityItemDto>
            {
                new() { Id = "act-1", Time = "10:12", RecordId = "COM-118 · CR-2026-014", Text = "Prototype record updated by authorised staff" },
                new() { Id = "act-2", Time = "09:45", RecordId = "COM-115 · CR-2026-014", Text = "Medical team deployment confirmed" },
                new() { Id = "act-3", Time = "08:30", RecordId = "REQ-309 · CR-2026-011", Text = "Transport vehicle request received" }
            },
            Timeline = InMemTimeline
        };

        return Result<PartnerOfficerDashboardDto>.Success(dashboard);
    }

    public async Task<Result<IReadOnlyList<PartnerRecordDto>>> GetOfficerRecordsAsync(
        string? status = null,
        string? search = null,
        string? operationalArea = null,
        CancellationToken cancellationToken = default)
    {
        var commitments = await _partnerRepository.GetAllCommitmentsAsync(cancellationToken: cancellationToken);
        var list = new List<PartnerRecordDto>(InMemOfficerRecords);

        foreach (var c in commitments)
        {
            var code = $"COM-{c.Id.ToString("N")[..3].ToUpperInvariant()}";
            if (!list.Any(x => x.Id == code))
            {
                list.Add(new PartnerRecordDto
                {
                    Id = code,
                    SharedIncident = "CR-2026-014",
                    Contribution = c.Item,
                    Quantity = $"{c.Quantity:N0} units",
                    ResponsibleOrg = c.PartnerOrganisation?.Name ?? "Partner Network",
                    Deadline = "Today · 18:00",
                    Status = c.Status,
                    StatusBadge = c.Status.ToLowerInvariant() switch
                    {
                        "deployed" or "dispatched" => "dispatched",
                        "delivered" or "confirmed" => "confirmed",
                        "delayed" => "delayed",
                        _ => "awaiting"
                    },
                    OperationalArea = c.DestinationZone,
                    Notes = $"Estimated value: LKR {c.EstimatedValueLkr:N0}. Direct partner pledge.",
                    CreatedAt = c.CreatedAt
                });
            }
        }

        IEnumerable<PartnerRecordDto> filtered = list;

        if (!string.IsNullOrWhiteSpace(status) && status != "all")
        {
            filtered = filtered.Where(x => x.Status.Equals(status, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(operationalArea) && operationalArea != "all")
        {
            filtered = filtered.Where(x => x.OperationalArea.Contains(operationalArea, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var q = search.Trim().ToLowerInvariant();
            filtered = filtered.Where(x =>
                x.Id.ToLowerInvariant().Contains(q) ||
                x.Contribution.ToLowerInvariant().Contains(q) ||
                x.ResponsibleOrg.ToLowerInvariant().Contains(q) ||
                x.SharedIncident.ToLowerInvariant().Contains(q));
        }

        return Result<IReadOnlyList<PartnerRecordDto>>.Success(filtered.OrderByDescending(x => x.CreatedAt).ToList());
    }

    public Task<Result<PartnerRecordDto>> GetOfficerRecordByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        var item = InMemOfficerRecords.FirstOrDefault(x => x.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
        if (item is null)
        {
            return Task.FromResult(Result<PartnerRecordDto>.Failure($"Record '{id}' was not found."));
        }
        return Task.FromResult(Result<PartnerRecordDto>.Success(item));
    }

    public Task<Result<PartnerRecordDto>> CreateOfficerRecordAsync(
        CreatePartnerRecordDto dto,
        string? officerName,
        CancellationToken cancellationToken = default)
    {
        var id = $"COM-{new Random().Next(120, 999)}";
        var record = new PartnerRecordDto
        {
            Id = id,
            SharedIncident = dto.SharedIncident,
            Contribution = dto.Contribution,
            Quantity = dto.Quantity,
            ResponsibleOrg = dto.ResponsibleOrg,
            Deadline = dto.Deadline,
            Status = dto.Status,
            StatusBadge = dto.Status.ToLowerInvariant() switch
            {
                "dispatched" => "dispatched",
                "confirmed" => "confirmed",
                "delayed" => "delayed",
                _ => "awaiting"
            },
            OperationalArea = dto.OperationalArea,
            Notes = string.IsNullOrWhiteSpace(dto.Notes)
                ? $"Logged by {officerName ?? "Partner Officer"}"
                : $"{dto.Notes} [Logged by {officerName ?? "Partner Officer"}]",
            CreatedAt = DateTime.UtcNow
        };

        InMemOfficerRecords.Insert(0, record);
        return Task.FromResult(Result<PartnerRecordDto>.Success(record, $"Record {id} registered into organisation directory."));
    }

    public Task<Result<PartnerRecordDto>> ProcessRecordActionAsync(
        string id,
        ProcessPartnerRecordActionDto dto,
        string? officerName,
        CancellationToken cancellationToken = default)
    {
        var item = InMemOfficerRecords.FirstOrDefault(x => x.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
        if (item is null)
        {
            return Task.FromResult(Result<PartnerRecordDto>.Failure($"Record '{id}' was not found."));
        }

        switch (dto.Action.ToLowerInvariant())
        {
            case "confirm":
                item.Status = "Confirmed";
                item.StatusBadge = "confirmed";
                item.Notes += $" [Confirmed by {officerName ?? "Partner Officer"}: {dto.Note ?? "Commitment verified"}]";
                break;

            case "clarify":
                item.Status = "Awaiting response";
                item.StatusBadge = "awaiting";
                item.Notes += $" [Clarification requested by {officerName ?? "Partner Officer"}: {dto.Note ?? "Pending information"}]";
                break;

            case "escalate":
                item.Notes += $" [Escalated to Emergency Coordinator by {officerName ?? "Partner Officer"}: {dto.Note ?? "Priority escalation"}]";
                break;
        }

        return Task.FromResult(Result<PartnerRecordDto>.Success(item, $"Action '{dto.Action}' processed for {id}."));
    }

    public Task<Result<IReadOnlyList<PartnerTimelineEntryDto>>> GetTimelineAsync(CancellationToken cancellationToken = default)
    {
        return Task.FromResult(Result<IReadOnlyList<PartnerTimelineEntryDto>>.Success(InMemTimeline.OrderByDescending(x => x.CreatedAt).ToList()));
    }

    public Task<Result<PartnerTimelineEntryDto>> AddTimelineEntryAsync(
        CreatePartnerTimelineEntryDto dto,
        string? officerName,
        CancellationToken cancellationToken = default)
    {
        var entry = new PartnerTimelineEntryDto
        {
            Id = $"tl-{InMemTimeline.Count + 1}",
            Time = DateTime.UtcNow.ToString("HH:mm"),
            Title = string.IsNullOrWhiteSpace(dto.Title) ? $"Coordination update to {dto.Recipient}" : dto.Title,
            Scope = dto.Scope,
            Author = officerName ?? "Ravindu Perera (Partner Officer)",
            CreatedAt = DateTime.UtcNow
        };

        InMemTimeline.Insert(0, entry);
        return Task.FromResult(Result<PartnerTimelineEntryDto>.Success(entry, "Coordination update recorded."));
    }
}

