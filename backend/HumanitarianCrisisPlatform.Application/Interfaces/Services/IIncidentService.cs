using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Incidents;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Services;

public interface IIncidentService
{
    Task<Result<IReadOnlyList<IncidentResponseDto>>> GetAllAsync(
        string? status = null,
        string? operationalArea = null,
        string? priority = null,
        string? search = null,
        Guid? currentUserId = null,
        string? currentUserRole = null,
        CancellationToken cancellationToken = default);

    Task<Result<IncidentResponseDto>> GetByIdAsync(
        string idOrCaseNumber,
        Guid? currentUserId = null,
        string? currentUserRole = null,
        CancellationToken cancellationToken = default);

    Task<Result<IncidentResponseDto>> CreateAsync(
        CreateIncidentDto dto,
        Guid actorUserId,
        string actorName,
        string actorRole,
        CancellationToken cancellationToken = default);

    Task<Result<IncidentResponseDto>> UpdateAsync(
        string idOrCaseNumber,
        UpdateIncidentDto dto,
        Guid actorUserId,
        string actorName,
        string actorRole,
        CancellationToken cancellationToken = default);

    Task<Result<IncidentResponseDto>> UpdateStatusAsync(
        string idOrCaseNumber,
        UpdateIncidentStatusDto dto,
        Guid actorUserId,
        string actorName,
        string actorRole,
        CancellationToken cancellationToken = default);

    Task<Result<IncidentResponseDto>> UpdatePriorityAsync(
        string idOrCaseNumber,
        UpdateIncidentPriorityDto dto,
        Guid actorUserId,
        string actorName,
        string actorRole,
        CancellationToken cancellationToken = default);

    Task<Result<IncidentResponseDto>> VerifyAsync(
        string idOrCaseNumber,
        VerifyIncidentDto dto,
        Guid actorUserId,
        string actorName,
        string actorRole,
        CancellationToken cancellationToken = default);

    Task<Result<IncidentResponseDto>> EscalateAsync(
        string idOrCaseNumber,
        EscalateIncidentDto dto,
        Guid actorUserId,
        string actorName,
        string actorRole,
        CancellationToken cancellationToken = default);

    Task<Result<IncidentResponseDto>> ResolveAsync(
        string idOrCaseNumber,
        ResolveIncidentDto dto,
        Guid actorUserId,
        string actorName,
        string actorRole,
        CancellationToken cancellationToken = default);

    Task<Result<IncidentResponseDto>> CloseAsync(
        string idOrCaseNumber,
        CloseIncidentDto dto,
        Guid actorUserId,
        string actorName,
        string actorRole,
        CancellationToken cancellationToken = default);

    Task<Result<IncidentHistoryDto>> GetHistoryAsync(
        string idOrCaseNumber,
        Guid? currentUserId = null,
        string? currentUserRole = null,
        CancellationToken cancellationToken = default);

    Task<Result<IncidentResponseDto>> MergeAsync(
        string idOrCaseNumber,
        MergeIncidentDto dto,
        Guid actorUserId,
        string actorName,
        string actorRole,
        CancellationToken cancellationToken = default);

    Task<Result<IReadOnlyList<IncidentCommunicationDto>>> GetCommunicationsAsync(
        string idOrCaseNumber,
        Guid? currentUserId = null,
        string? currentUserRole = null,
        CancellationToken cancellationToken = default);

    Task<Result<IncidentCommunicationDto>> AddCommunicationAsync(
        string idOrCaseNumber,
        CreateIncidentCommunicationDto dto,
        Guid actorUserId,
        string actorName,
        string actorRole,
        CancellationToken cancellationToken = default);
}

