using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Requests;
using HumanitarianCrisisPlatform.Application.Interfaces;
using HumanitarianCrisisPlatform.Application.Interfaces.Infrastructure;
using HumanitarianCrisisPlatform.Application.Interfaces.Repositories;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Application.Services;

public class AssistanceRequestService : IAssistanceRequestService
{
    private readonly IAssistanceRequestRepository _repository;
    private readonly IAIServiceClient _aiClient;
    private readonly IUnitOfWork _unitOfWork;

    public AssistanceRequestService(
        IAssistanceRequestRepository repository,
        IAIServiceClient aiClient,
        IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _aiClient = aiClient;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<AssistanceRequestResponseDto>> CreateRequestAsync(
        CreateAssistanceRequestDto dto,
        Guid requestorId,
        CancellationToken cancellationToken = default)
    {
        var request = new AssistanceRequest
        {
            RequestorId = requestorId,
            CrisisEventId = dto.CrisisEventId,
            Category = dto.Category,
            Description = dto.Description,
            Urgency = dto.Urgency,
            Status = RequestStatus.Submitted,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            Address = dto.Address,
            NumberOfPeople = dto.NumberOfPeople,
            ContactPhone = dto.ContactPhone,
            AttachmentUrl = dto.AttachmentUrl
        };

        // Run AI classification
        try
        {
            var evaluation = await _aiClient.ClassifyUrgencyAsync(dto.Description, dto.Category, cancellationToken);
            request.AIPriorityScore = evaluation.PriorityScore;
            request.AIConfidence = evaluation.ConfidenceScore;
            request.Urgency = evaluation.RecommendedPriority;
        }
        catch
        {
            // Fallback preserves initial user-provided urgency
        }

        var created = await _repository.AddAsync(request, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        return Result<AssistanceRequestResponseDto>.Success(MapToDto(created));
    }

    public async Task<Result<AssistanceRequestResponseDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var item = await _repository.GetByIdAsync(id, cancellationToken);
        if (item == null) return Result<AssistanceRequestResponseDto>.Failure("Request not found");
        return Result<AssistanceRequestResponseDto>.Success(MapToDto(item));
    }

    public async Task<Result<IReadOnlyList<AssistanceRequestResponseDto>>> GetAllAsync(
        RequestStatus? status = null,
        PriorityLevel? urgency = null,
        CancellationToken cancellationToken = default)
    {
        var items = await _repository.GetAllAsync(cancellationToken);
        var query = items.AsEnumerable();
        if (status.HasValue) query = query.Where(r => r.Status == status.Value);
        if (urgency.HasValue) query = query.Where(r => r.Urgency == urgency.Value);
        return Result<IReadOnlyList<AssistanceRequestResponseDto>>.Success(query.Select(MapToDto).ToList());
    }

    public async Task<Result<AssistanceRequestResponseDto>> UpdateStatusAsync(
        Guid id,
        UpdateRequestStatusDto dto,
        CancellationToken cancellationToken = default)
    {
        var item = await _repository.GetByIdAsync(id, cancellationToken);
        if (item == null) return Result<AssistanceRequestResponseDto>.Failure("Request not found");

        item.Status = dto.Status;
        if (dto.Status == RequestStatus.Resolved) item.ResolvedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(item, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        return Result<AssistanceRequestResponseDto>.Success(MapToDto(item));
    }

    public async Task<Result<IReadOnlyList<AssistanceRequestResponseDto>>> GetByRequestorAsync(
        Guid requestorId,
        CancellationToken cancellationToken = default)
    {
        var items = await _repository.GetByRequestorAsync(requestorId, cancellationToken);
        return Result<IReadOnlyList<AssistanceRequestResponseDto>>.Success(items.Select(MapToDto).ToList());
    }

    private static AssistanceRequestResponseDto MapToDto(AssistanceRequest entity) => new()
    {
        Id = entity.Id,
        RequestorId = entity.RequestorId,
        RequestorName = entity.Requestor?.FullName ?? "Unknown",
        CrisisEventId = entity.CrisisEventId,
        CrisisEventTitle = entity.CrisisEvent?.Title,
        Category = entity.Category,
        Description = entity.Description,
        Urgency = entity.Urgency,
        Status = entity.Status,
        Latitude = entity.Latitude,
        Longitude = entity.Longitude,
        Address = entity.Address,
        NumberOfPeople = entity.NumberOfPeople,
        ContactPhone = entity.ContactPhone,
        AIPriorityScore = entity.AIPriorityScore,
        AIConfidence = entity.AIConfidence,
        IsDuplicate = entity.IsDuplicate,
        CreatedAt = entity.CreatedAt,
        ResolvedAt = entity.ResolvedAt
    };
}
