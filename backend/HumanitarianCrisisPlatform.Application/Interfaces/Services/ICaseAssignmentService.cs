using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Incidents;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Services;

public interface ICaseAssignmentService
{
    Task<Result<IReadOnlyList<IncidentResponseDto>>> GetMyAssignedAsync(
        Guid userId,
        string? userName = null,
        CancellationToken cancellationToken = default);

    Task<Result<IReadOnlyList<IncidentResponseDto>>> GetUnassignedAsync(
        CancellationToken cancellationToken = default);

    Task<Result<IncidentResponseDto>> AssignAsync(
        string idOrCaseNumber,
        AssignIncidentDto dto,
        Guid actorUserId,
        string actorName,
        string actorRole,
        CancellationToken cancellationToken = default);

    Task<Result<IncidentResponseDto>> ReassignAsync(
        string idOrCaseNumber,
        ReassignIncidentDto dto,
        Guid actorUserId,
        string actorName,
        string actorRole,
        CancellationToken cancellationToken = default);
}

