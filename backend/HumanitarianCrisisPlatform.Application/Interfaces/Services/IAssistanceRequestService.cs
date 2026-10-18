using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Requests;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Services;

public interface IAssistanceRequestService
{
    Task<Result<AssistanceRequestResponseDto>> CreateRequestAsync(CreateAssistanceRequestDto dto, Guid requestorId, CancellationToken cancellationToken = default);
    Task<Result<AssistanceRequestResponseDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<AssistanceRequestResponseDto>>> GetAllAsync(RequestStatus? status = null, PriorityLevel? urgency = null, CancellationToken cancellationToken = default);
    Task<Result<AssistanceRequestResponseDto>> UpdateStatusAsync(Guid id, UpdateRequestStatusDto dto, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<AssistanceRequestResponseDto>>> GetByRequestorAsync(Guid requestorId, CancellationToken cancellationToken = default);
}
