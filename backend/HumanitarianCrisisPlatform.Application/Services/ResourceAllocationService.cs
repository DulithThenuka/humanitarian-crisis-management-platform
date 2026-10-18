using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Resources;
using HumanitarianCrisisPlatform.Application.Interfaces;
using HumanitarianCrisisPlatform.Application.Interfaces.Repositories;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Exceptions;

namespace HumanitarianCrisisPlatform.Application.Services;

public class ResourceAllocationService : IResourceAllocationService
{
    private readonly IResourceRepository _repository;
    private readonly IUnitOfWork _unitOfWork;

    public ResourceAllocationService(IResourceRepository repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<IReadOnlyList<ResourceDto>>> GetInventoryAsync(CancellationToken cancellationToken = default)
    {
        var items = await _repository.GetAllAsync(cancellationToken);
        return Result<IReadOnlyList<ResourceDto>>.Success(items.Select(MapToDto).ToList());
    }

    public async Task<Result<bool>> DispatchAllocationAsync(AllocateResourceDto dto, CancellationToken cancellationToken = default)
    {
        var resource = await _repository.GetByIdAsync(dto.ResourceId, cancellationToken);
        if (resource == null) return Result<bool>.Failure("Resource not found");

        if (resource.AvailableQuantity < dto.Quantity)
        {
            throw new ResourceShortageException(dto.ResourceId, dto.Quantity, resource.AvailableQuantity);
        }

        resource.AllocatedQuantity += dto.Quantity;
        var allocation = new ResourceAllocation
        {
            ResourceId = dto.ResourceId,
            AssistanceRequestId = dto.AssistanceRequestId,
            ShelterId = dto.ShelterId,
            Quantity = dto.Quantity,
            Priority = dto.Priority,
            Notes = dto.Notes,
            DispatchStatus = 1, // Dispatched
            DispatchedAt = DateTime.UtcNow
        };

        resource.Allocations.Add(allocation);
        await _repository.UpdateAsync(resource, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        return Result<bool>.Success(true, "Allocation dispatched successfully");
    }

    public async Task<Result<IReadOnlyList<ResourceDto>>> GetLowStockAlertsAsync(CancellationToken cancellationToken = default)
    {
        var items = await _repository.GetLowStockResourcesAsync(cancellationToken);
        return Result<IReadOnlyList<ResourceDto>>.Success(items.Select(MapToDto).ToList());
    }

    private static ResourceDto MapToDto(Resource r) => new()
    {
        Id = r.Id,
        Name = r.Name,
        Category = r.Category,
        Unit = r.Unit,
        TotalQuantity = r.TotalQuantity,
        AllocatedQuantity = r.AllocatedQuantity,
        MinimumThreshold = r.MinimumThreshold,
        WarehouseLocation = r.WarehouseLocation
    };
}
