using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Home;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Services;

public interface IHomeService
{
    Task<Result<HomeSummaryDto>> GetHomeSummaryAsync(CancellationToken cancellationToken = default);
    Task<Result<TrackRequestResultDto>> TrackRequestAsync(string reference, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<SafetyGuidanceDto>>> GetSafetyGuidanceAsync(CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<HomeAlertDto>>> GetActiveAlertsAsync(CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<EmergencyContactDto>>> GetEmergencyHotlinesAsync(CancellationToken cancellationToken = default);
}

