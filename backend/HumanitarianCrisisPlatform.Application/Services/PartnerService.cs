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
}

