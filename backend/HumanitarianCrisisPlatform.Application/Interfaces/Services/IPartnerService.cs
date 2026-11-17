using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Partners;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Services;

public interface IPartnerService
{
    Task<Result<PartnerPortalSummaryDto>> GetDashboardSummaryAsync(CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<PartnerOrganisationDto>>> GetPartnersAsync(string? search = null, string? status = null, CancellationToken cancellationToken = default);
    Task<Result<PartnerOrganisationDto>> GetPartnerByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<PartnerOrganisationDto>> CreatePartnerAsync(CreatePartnerOrganisationDto dto, string? userId, CancellationToken cancellationToken = default);
    Task<Result<PartnerOrganisationDto>> UpdatePartnerStatusAsync(Guid id, UpdatePartnerStatusDto dto, string? userId, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<PartnerCommitmentDto>>> GetCommitmentsAsync(Guid? partnerId = null, CancellationToken cancellationToken = default);
    Task<Result<PartnerCommitmentDto>> LogCommitmentAsync(CreatePartnerCommitmentDto dto, Guid? userId, CancellationToken cancellationToken = default);
    Task<Result<PartnerCommitmentDto>> UpdateCommitmentStatusAsync(Guid commitmentId, UpdateCommitmentStatusDto dto, string? userId, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<SectorZoneDto>>> GetSectorZonesAsync(CancellationToken cancellationToken = default);
    Task<Result<SectorZoneDto>> AssignPartnerToZoneAsync(AssignPartnerZoneDto dto, string? userId, CancellationToken cancellationToken = default);
}

