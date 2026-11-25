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

    // Advanced Donor & Funding Officer Portal Operations
    Task<Result<FundingOfficerDashboardDto>> GetFundingOfficerDashboardAsync(CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<DonorRecordDto>>> GetDonorRecordsAsync(string? type = null, string? status = null, string? search = null, CancellationToken cancellationToken = default);
    Task<Result<DonorRecordDto>> GetDonorRecordByIdAsync(string id, CancellationToken cancellationToken = default);
    Task<Result<DonorRecordDto>> CreateDonorRecordAsync(CreateDonorRecordDto dto, string? officerName, CancellationToken cancellationToken = default);
    Task<Result<DonorRecordDto>> ProcessDonorDecisionAsync(string id, DonorDecisionDto dto, string? officerName, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<FundingCampaignDto>>> GetCampaignsAsync(CancellationToken cancellationToken = default);
    Task<Result<FundingCampaignDto>> CreateCampaignAsync(CreateFundingCampaignDto dto, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<FundingAllocationDto>>> GetAllocationsAsync(CancellationToken cancellationToken = default);
    Task<Result<FundingAllocationDto>> ApproveAllocationAsync(string id, ApproveFundingAllocationDto dto, string? officerName, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<SuspiciousFlagDto>>> GetSuspiciousFlagsAsync(CancellationToken cancellationToken = default);
    Task<Result<SuspiciousFlagDto>> ResolveSuspiciousFlagAsync(string id, ResolveSuspiciousFlagDto dto, string? officerName, CancellationToken cancellationToken = default);
    Task<Result<DonorRecordDto>> UpdateDonorRecordAsync(string id, UpdateDonorRecordDto dto, string? officerName, CancellationToken cancellationToken = default);
    Task<Result> DeactivateDonorRecordAsync(string id, string? reason, string? officerName, CancellationToken cancellationToken = default);
    Task<Result<FundingReportsSummaryDto>> GetReportsSummaryAsync(string? operation = null, CancellationToken cancellationToken = default);
}

