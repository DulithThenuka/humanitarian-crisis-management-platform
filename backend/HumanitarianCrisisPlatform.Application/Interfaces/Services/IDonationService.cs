using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Donations;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Services;

public interface IDonationService
{
    Task<Result<DonationSummaryDto>> GetSummaryAsync(CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<ReliefPackageDto>>> GetReliefPackagesAsync(CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<DonationDto>>> GetDonationsAsync(
        int? status = null,
        int? donationType = null,
        Guid? crisisEventId = null,
        string? search = null,
        CancellationToken cancellationToken = default);
    Task<Result<DonationDto>> GetDonationByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<DonationDto>> CreateDonationAsync(CreateDonationDto dto, Guid? currentUserId, CancellationToken cancellationToken = default);
    Task<Result<DonationDto>> UpdateDonationStatusAsync(Guid id, UpdateDonationStatusDto dto, Guid? currentUserId, CancellationToken cancellationToken = default);
    Task<Result<DonationReceiptDto>> GetReceiptAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result> DeleteDonationAsync(Guid id, CancellationToken cancellationToken = default);
}

