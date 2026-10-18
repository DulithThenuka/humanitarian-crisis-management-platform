using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Shelters;
using HumanitarianCrisisPlatform.Application.Interfaces;
using HumanitarianCrisisPlatform.Application.Interfaces.Infrastructure;
using HumanitarianCrisisPlatform.Application.Interfaces.Repositories;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Exceptions;

namespace HumanitarianCrisisPlatform.Application.Services;

public class ShelterService : IShelterService
{
    private readonly IShelterRepository _repository;
    private readonly IMappingService _mappingService;
    private readonly IUnitOfWork _unitOfWork;

    public ShelterService(
        IShelterRepository repository,
        IMappingService mappingService,
        IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _mappingService = mappingService;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<IReadOnlyList<ShelterDto>>> GetAllSheltersAsync(CancellationToken cancellationToken = default)
    {
        var shelters = await _repository.GetAllAsync(cancellationToken);
        return Result<IReadOnlyList<ShelterDto>>.Success(shelters.Select(s => MapToDto(s)).ToList());
    }

    public async Task<Result<ShelterDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var shelter = await _repository.GetByIdAsync(id, cancellationToken);
        if (shelter == null) return Result<ShelterDto>.Failure("Shelter not found");
        return Result<ShelterDto>.Success(MapToDto(shelter));
    }

    public async Task<Result<IReadOnlyList<ShelterDto>>> FindNearestSheltersAsync(
        decimal lat,
        decimal lon,
        double radiusKm = 25,
        CancellationToken cancellationToken = default)
    {
        var active = await _repository.GetActiveSheltersAsync(cancellationToken);
        var nearby = active
            .Select(s =>
            {
                var distance = _mappingService.CalculateDistanceKm(lat, lon, s.Latitude, s.Longitude);
                return (Shelter: s, Distance: distance);
            })
            .Where(x => x.Distance <= radiusKm)
            .OrderBy(x => x.Distance)
            .Select(x => MapToDto(x.Shelter, x.Distance))
            .ToList();

        return Result<IReadOnlyList<ShelterDto>>.Success(nearby);
    }

    public async Task<Result<bool>> AllocateShelterAsync(AllocateShelterDto dto, CancellationToken cancellationToken = default)
    {
        var shelter = await _repository.GetByIdAsync(dto.ShelterId, cancellationToken);
        if (shelter == null) return Result<bool>.Failure("Shelter not found");

        var available = shelter.TotalCapacity - shelter.CurrentOccupancy;
        if (dto.NumberOfPersons > available)
        {
            throw new CapacityExceededException(dto.ShelterId, dto.NumberOfPersons, available);
        }

        shelter.CurrentOccupancy += dto.NumberOfPersons;
        var allocation = new ShelterAllocation
        {
            ShelterId = dto.ShelterId,
            AssistanceRequestId = dto.AssistanceRequestId,
            PersonName = dto.PersonName,
            NumberOfPersons = dto.NumberOfPersons,
            Notes = dto.Notes,
            CheckInDate = DateTime.UtcNow
        };

        shelter.Allocations.Add(allocation);
        await _repository.UpdateAsync(shelter, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        return Result<bool>.Success(true, "Evacuee allocated successfully");
    }

    private static ShelterDto MapToDto(Shelter s, double? distance = null) => new()
    {
        Id = s.Id,
        Name = s.Name,
        Address = s.Address,
        Latitude = s.Latitude,
        Longitude = s.Longitude,
        TotalCapacity = s.TotalCapacity,
        CurrentOccupancy = s.CurrentOccupancy,
        Facilities = s.Facilities,
        ContactPhone = s.ContactPhone,
        IsActive = s.IsActive,
        DistanceKm = distance
    };
}
