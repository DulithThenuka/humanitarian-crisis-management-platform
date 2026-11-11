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

    public async Task<Result<IReadOnlyList<ShelterDto>>> GetAllSheltersAsync(
        string? query = null,
        string? district = null,
        string? status = null,
        CancellationToken cancellationToken = default)
    {
        var shelters = await _repository.GetAllAsync(cancellationToken);
        var dtos = shelters.Select(s => MapToDto(s)).ToList();

        if (!string.IsNullOrWhiteSpace(query))
        {
            var q = query.Trim().ToLowerInvariant();
            dtos = dtos.Where(d => 
                d.Name.ToLowerInvariant().Contains(q) ||
                d.Address.ToLowerInvariant().Contains(q) ||
                (d.Facilities != null && d.Facilities.ToLowerInvariant().Contains(q)) ||
                d.District.ToLowerInvariant().Contains(q)
            ).ToList();
        }

        if (!string.IsNullOrWhiteSpace(district) && !district.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            dtos = dtos.Where(d => d.District.Equals(district, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        if (!string.IsNullOrWhiteSpace(status) && !status.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            dtos = dtos.Where(d => d.Status.Equals(status, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        return Result<IReadOnlyList<ShelterDto>>.Success(dtos);
    }

    public async Task<Result<ShelterSummaryDto>> GetShelterSummaryAsync(CancellationToken cancellationToken = default)
    {
        var shelters = await _repository.GetActiveSheltersAsync(cancellationToken);
        var dtos = shelters.Select(s => MapToDto(s)).ToList();

        var totalCapacity = dtos.Sum(s => s.TotalCapacity);
        var totalOccupied = dtos.Sum(s => s.CurrentOccupancy);
        var availableBeds = Math.Max(0, totalCapacity - totalOccupied);
        var occupancyPct = totalCapacity > 0 ? Math.Round((double)totalOccupied / totalCapacity * 100, 1) : 0;

        var openCount = dtos.Count(s => s.Status == "Open");
        var limitedCount = dtos.Count(s => s.Status == "Limited");
        var fullCount = dtos.Count(s => s.Status == "Full");

        var districtCounts = dtos
            .GroupBy(s => s.District)
            .Select(g => new DistrictShelterCountDto
            {
                District = g.Key,
                ShelterCount = g.Count(),
                TotalCapacity = g.Sum(x => x.TotalCapacity),
                CurrentOccupancy = g.Sum(x => x.CurrentOccupancy),
                AvailableBeds = Math.Max(0, g.Sum(x => x.TotalCapacity) - g.Sum(x => x.CurrentOccupancy))
            })
            .OrderBy(d => d.District)
            .ToList();

        var summary = new ShelterSummaryDto
        {
            TotalShelters = dtos.Count,
            TotalCapacity = totalCapacity,
            CurrentOccupancy = totalOccupied,
            AvailableBeds = availableBeds,
            OccupancyPercent = occupancyPct,
            OpenSheltersCount = openCount,
            LimitedSheltersCount = limitedCount,
            FullSheltersCount = fullCount,
            DistrictCounts = districtCounts
        };

        return Result<ShelterSummaryDto>.Success(summary);
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

    private static ShelterDto MapToDto(Shelter s, double? distance = null)
    {
        var addr = s.Address ?? string.Empty;
        var name = s.Name ?? string.Empty;
        var fac = s.Facilities ?? string.Empty;

        var district = "Western Province";
        if (addr.Contains("Gampaha", StringComparison.OrdinalIgnoreCase) || name.Contains("Gampaha", StringComparison.OrdinalIgnoreCase) ||
            addr.Contains("Kelaniya", StringComparison.OrdinalIgnoreCase) || addr.Contains("Biyagama", StringComparison.OrdinalIgnoreCase) ||
            addr.Contains("Wattala", StringComparison.OrdinalIgnoreCase) || addr.Contains("Ja-Ela", StringComparison.OrdinalIgnoreCase) ||
            addr.Contains("Peliyagoda", StringComparison.OrdinalIgnoreCase))
        {
            district = "Gampaha";
        }
        else if (addr.Contains("Kalutara", StringComparison.OrdinalIgnoreCase) || name.Contains("Kalutara", StringComparison.OrdinalIgnoreCase) ||
                 addr.Contains("Panadura", StringComparison.OrdinalIgnoreCase) || addr.Contains("Horana", StringComparison.OrdinalIgnoreCase) ||
                 addr.Contains("Beruwala", StringComparison.OrdinalIgnoreCase))
        {
            district = "Kalutara";
        }
        else if (addr.Contains("Negombo", StringComparison.OrdinalIgnoreCase) || name.Contains("Negombo", StringComparison.OrdinalIgnoreCase))
        {
            district = "Negombo";
        }
        else if (addr.Contains("Colombo", StringComparison.OrdinalIgnoreCase) || name.Contains("Colombo", StringComparison.OrdinalIgnoreCase) ||
                 addr.Contains("Wellampitiya", StringComparison.OrdinalIgnoreCase) || addr.Contains("Kaduwela", StringComparison.OrdinalIgnoreCase) ||
                 addr.Contains("Sedawatta", StringComparison.OrdinalIgnoreCase) || addr.Contains("Moratuwa", StringComparison.OrdinalIgnoreCase) ||
                 addr.Contains("Dehiwala", StringComparison.OrdinalIgnoreCase))
        {
            district = "Colombo";
        }

        var amenities = new List<string>();
        var facLower = fac.ToLowerInvariant();
        if (facLower.Contains("water") || facLower.Contains("clean")) amenities.Add("water");
        if (facLower.Contains("food") || facLower.Contains("meal") || facLower.Contains("kitchen") || facLower.Contains("ration")) amenities.Add("food");
        if (facLower.Contains("medic") || facLower.Contains("first aid") || facLower.Contains("clinic")) amenities.Add("medical");
        if (facLower.Contains("infant") || facLower.Contains("child") || facLower.Contains("pediatric") || facLower.Contains("mother") || facLower.Contains("female")) amenities.Add("infant");
        if (facLower.Contains("power") || facLower.Contains("generator") || facLower.Contains("charg") || facLower.Contains("solar")) amenities.Add("power");
        if (facLower.Contains("access") || facLower.Contains("wheelchair") || facLower.Contains("spacious") || facLower.Contains("helipad")) amenities.Add("access");
        if (amenities.Count == 0)
        {
            amenities.AddRange(new[] { "water", "food", "medical" });
        }

        var status = s.CurrentOccupancy >= s.TotalCapacity
            ? "Full"
            : (s.TotalCapacity > 0 && (double)s.CurrentOccupancy / s.TotalCapacity > 0.85)
                ? "Limited"
                : "Open";

        return new ShelterDto
        {
            Id = s.Id,
            Name = s.Name ?? string.Empty,
            Address = s.Address ?? string.Empty,
            District = district,
            Latitude = s.Latitude,
            Longitude = s.Longitude,
            TotalCapacity = s.TotalCapacity,
            CurrentOccupancy = s.CurrentOccupancy,
            Status = status,
            Facilities = s.Facilities,
            ContactPhone = s.ContactPhone,
            IsActive = s.IsActive,
            DistanceKm = distance,
            Amenities = amenities
        };
    }
}
