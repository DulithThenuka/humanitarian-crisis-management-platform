using HumanitarianCrisisPlatform.Domain.Entities;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Repositories;

public interface IPartnerRepository : IRepository<PartnerOrganisation>
{
    Task<IReadOnlyList<PartnerOrganisation>> GetAllPartnersWithDetailsAsync(string? search = null, string? status = null, CancellationToken cancellationToken = default);
    Task<PartnerOrganisation?> GetPartnerByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);
    Task<PartnerOrganisation?> GetPartnerByCodeAsync(string code, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<PartnerCommitment>> GetAllCommitmentsAsync(Guid? partnerId = null, CancellationToken cancellationToken = default);
    Task<PartnerCommitment?> GetCommitmentByIdAsync(Guid commitmentId, CancellationToken cancellationToken = default);
    Task<PartnerCommitment> AddCommitmentAsync(PartnerCommitment commitment, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<SectorZone>> GetAllSectorZonesWithPartnersAsync(CancellationToken cancellationToken = default);
    Task<SectorZone?> GetSectorZoneByIdAsync(Guid zoneId, CancellationToken cancellationToken = default);
    Task<PartnerZoneAssignment?> GetZoneAssignmentAsync(Guid partnerId, Guid zoneId, CancellationToken cancellationToken = default);
    Task AddZoneAssignmentAsync(PartnerZoneAssignment assignment, CancellationToken cancellationToken = default);
}

