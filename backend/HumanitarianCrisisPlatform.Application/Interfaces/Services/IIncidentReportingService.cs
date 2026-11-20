using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Incidents;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Services;

public interface IIncidentReportingService
{
    Task<Result<IncidentDashboardDto>> GetDashboardAsync(
        Guid? userId = null,
        string? userName = null,
        CancellationToken cancellationToken = default);

    Task<Result<IncidentReportSummaryDto>> GetReportSummaryAsync(
        string? operation = null,
        CancellationToken cancellationToken = default);
}

