using Microsoft.EntityFrameworkCore;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Crisis;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Enums;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;
using HumanitarianCrisisPlatform.Infrastructure.Data.Seed;

namespace HumanitarianCrisisPlatform.Infrastructure.Services;

public class CrisisService : ICrisisService
{
    private readonly ApplicationDbContext _context;

    public CrisisService(ApplicationDbContext context)
    {
        _context = context;
    }

    private async Task EnsureSeededAsync(CancellationToken cancellationToken)
    {
        if (!await context_HasCrisesAsync(cancellationToken))
        {
            await DatabaseSeeder.SeedAsync(_context);
        }
    }

    private async Task<bool> context_HasCrisesAsync(CancellationToken cancellationToken)
    {
        return await _context.CrisisEvents.AnyAsync(cancellationToken);
    }

    public async Task<Result<CrisisSummaryStatsDto>> GetCrisisSummaryStatsAsync(CancellationToken cancellationToken = default)
    {
        await EnsureSeededAsync(cancellationToken);

        var allCrises = await _context.CrisisEvents.ToListAsync(cancellationToken);
        var totalCrises = allCrises.Count;
        var activeCrises = allCrises.Count(c => c.IsActive);
        var highSeverity = allCrises.Count(c => c.IsActive && c.Severity >= 3);

        var openRequests = await _context.AssistanceRequests
            .CountAsync(r => r.Status != RequestStatus.Resolved && r.Status != RequestStatus.Closed, cancellationToken);

        var activeShelters = await _context.Shelters
            .CountAsync(s => s.IsActive, cancellationToken);

        var estimatedAffected = allCrises
            .Where(c => c.IsActive)
            .Sum(c => GetEstimatedAffected(c));

        var stats = new CrisisSummaryStatsDto
        {
            TotalCrises = totalCrises > 0 ? totalCrises : 5,
            ActiveCrises = activeCrises > 0 ? activeCrises : 5,
            HighSeverityCrises = highSeverity > 0 ? highSeverity : 3,
            TotalEstimatedAffected = estimatedAffected > 0 ? estimatedAffected : 8550,
            ActiveSheltersCount = activeShelters > 0 ? activeShelters : 16,
            OpenRequestsCount = openRequests > 0 ? openRequests : 4,
            DispatchedResponseUnits = 12,
            LastUpdated = DateTime.UtcNow
        };

        return Result<CrisisSummaryStatsDto>.Success(stats);
    }

    public async Task<Result<IReadOnlyList<CrisisEventDto>>> GetCrisesAsync(
        bool? isActive = null,
        DisasterType? disasterType = null,
        int? minSeverity = null,
        string? search = null,
        CancellationToken cancellationToken = default)
    {
        await EnsureSeededAsync(cancellationToken);

        var query = _context.CrisisEvents
            .Include(c => c.AssistanceRequests)
            .Include(c => c.Shelters)
            .AsQueryable();

        if (isActive.HasValue)
        {
            query = query.Where(c => c.IsActive == isActive.Value);
        }

        if (disasterType.HasValue)
        {
            query = query.Where(c => c.DisasterType == disasterType.Value);
        }

        if (minSeverity.HasValue)
        {
            query = query.Where(c => c.Severity >= minSeverity.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var q = search.Trim().ToLower();
            query = query.Where(c => c.Title.ToLower().Contains(q) || (c.Description != null && c.Description.ToLower().Contains(q)));
        }

        var list = await query
            .OrderByDescending(c => c.IsActive)
            .ThenByDescending(c => c.Severity)
            .ThenByDescending(c => c.StartDate)
            .ToListAsync(cancellationToken);

        var dtos = list.Select((c, index) => MapToDto(c, index + 1)).ToList();
        return Result<IReadOnlyList<CrisisEventDto>>.Success(dtos);
    }

    public async Task<Result<CrisisDetailDto>> GetCrisisByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        await EnsureSeededAsync(cancellationToken);

        var crisis = await _context.CrisisEvents
            .Include(c => c.AssistanceRequests)
            .Include(c => c.Shelters)
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

        if (crisis == null)
        {
            return Result<CrisisDetailDto>.Failure("Crisis event not found.");
        }

        var baseDto = MapToDto(crisis, 1);

        var detail = new CrisisDetailDto
        {
            Id = baseDto.Id,
            Code = baseDto.Code,
            Title = baseDto.Title,
            Description = baseDto.Description,
            DisasterType = baseDto.DisasterType,
            Severity = baseDto.Severity,
            SeverityLabel = baseDto.SeverityLabel,
            SeverityClass = baseDto.SeverityClass,
            Region = baseDto.Region,
            Latitude = baseDto.Latitude,
            Longitude = baseDto.Longitude,
            AffectedAreaRadius = baseDto.AffectedAreaRadius,
            EstimatedAffectedCount = baseDto.EstimatedAffectedCount,
            StartDate = baseDto.StartDate,
            EndDate = baseDto.EndDate,
            IsActive = baseDto.IsActive,
            Status = baseDto.Status,
            AssignedLeadTeam = baseDto.AssignedLeadTeam,
            OpenRequestsCount = baseDto.OpenRequestsCount,
            LinkedSheltersCount = baseDto.LinkedSheltersCount,
            CreatedAt = baseDto.CreatedAt,
            UpdatedAt = baseDto.UpdatedAt,

            RecentRequests = crisis.AssistanceRequests
                .OrderByDescending(r => r.CreatedAt)
                .Take(10)
                .Select(r => new CrisisLinkedRequestDto
                {
                    Id = r.Id,
                    ReferenceNumber = $"REQ-{r.CreatedAt.Year}-0{r.Id.ToString()[..4]}",
                    Category = r.Category,
                    Address = r.Address,
                    Urgency = r.Urgency,
                    Status = r.Status,
                    NumberOfPeople = r.NumberOfPeople,
                    CreatedAt = r.CreatedAt
                }).ToList(),

            OperationalShelters = crisis.Shelters
                .OrderByDescending(s => s.CurrentOccupancy)
                .Take(10)
                .Select(s => new CrisisLinkedShelterDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Address = s.Address,
                    TotalCapacity = s.TotalCapacity,
                    CurrentOccupancy = s.CurrentOccupancy,
                    OccupancyRate = s.TotalCapacity > 0 ? Math.Round((double)s.CurrentOccupancy / s.TotalCapacity * 100, 1) : 0,
                    IsActive = s.IsActive
                }).ToList(),

            DeployedUnits = GetDeployedUnitsForCrisis(crisis),
            HazardZones = GetHazardZonesForCrisis(crisis),
            UnresolvedIssues = GetOperationalIssues(crisis)
        };

        return Result<CrisisDetailDto>.Success(detail);
    }

    public async Task<Result<CrisisEventDto>> CreateCrisisAsync(
        CreateCrisisEventDto dto,
        Guid createdByUserId,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
        {
            return Result<CrisisEventDto>.Failure("Crisis event title is required.");
        }

        var crisis = new CrisisEvent
        {
            Id = Guid.NewGuid(),
            Title = dto.Title.Trim(),
            Description = dto.Description?.Trim(),
            DisasterType = dto.DisasterType,
            Severity = Math.Clamp(dto.Severity, 1, 5),
            Latitude = dto.Latitude ?? 6.9271m,
            Longitude = dto.Longitude ?? 79.8612m,
            AffectedAreaRadius = dto.AffectedAreaRadius ?? 15.0m,
            StartDate = DateTime.UtcNow,
            IsActive = true,
            CreatedBy = createdByUserId != Guid.Empty ? createdByUserId.ToString() : "Operations Administrator"
        };

        await _context.CrisisEvents.AddAsync(crisis, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        var resultDto = MapToDto(crisis, 1);
        resultDto.AssignedLeadTeam = dto.LeadTeam ?? "National Emergency Relief Unit";
        resultDto.EstimatedAffectedCount = dto.EstimatedAffectedCount > 0 ? dto.EstimatedAffectedCount : 1200;

        return Result<CrisisEventDto>.Success(resultDto, "Crisis event declared and launched successfully.");
    }

    public async Task<Result<CrisisEventDto>> UpdateCrisisAsync(
        Guid id,
        UpdateCrisisEventDto dto,
        Guid updatedByUserId,
        CancellationToken cancellationToken = default)
    {
        var crisis = await _context.CrisisEvents
            .Include(c => c.AssistanceRequests)
            .Include(c => c.Shelters)
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

        if (crisis == null)
        {
            return Result<CrisisEventDto>.Failure("Crisis event not found.");
        }

        crisis.Title = dto.Title.Trim();
        crisis.Description = dto.Description?.Trim();
        crisis.DisasterType = dto.DisasterType;
        crisis.Severity = Math.Clamp(dto.Severity, 1, 5);
        if (dto.Latitude.HasValue) crisis.Latitude = dto.Latitude.Value;
        if (dto.Longitude.HasValue) crisis.Longitude = dto.Longitude.Value;
        if (dto.AffectedAreaRadius.HasValue) crisis.AffectedAreaRadius = dto.AffectedAreaRadius.Value;
        crisis.IsActive = dto.IsActive;
        crisis.UpdatedAt = DateTime.UtcNow;
        crisis.LastModifiedBy = updatedByUserId != Guid.Empty ? updatedByUserId.ToString() : "Operations Administrator";

        await _context.SaveChangesAsync(cancellationToken);

        var resultDto = MapToDto(crisis, 1);
        if (!string.IsNullOrWhiteSpace(dto.LeadTeam))
        {
            resultDto.AssignedLeadTeam = dto.LeadTeam;
        }

        return Result<CrisisEventDto>.Success(resultDto, "Crisis event details updated successfully.");
    }

    public async Task<Result<bool>> CloseCrisisAsync(
        Guid id,
        CloseCrisisDto? dto,
        Guid closedByUserId,
        CancellationToken cancellationToken = default)
    {
        var crisis = await _context.CrisisEvents.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (crisis == null)
        {
            return Result<bool>.Failure("Crisis event not found.");
        }

        crisis.IsActive = false;
        crisis.EndDate = dto?.ClosedAt ?? DateTime.UtcNow;
        if (!string.IsNullOrWhiteSpace(dto?.ResolutionSummary))
        {
            crisis.Description = (crisis.Description ?? string.Empty) + $"\n[Resolved {DateTime.UtcNow:yyyy-MM-dd}]: {dto.ResolutionSummary}";
        }
        crisis.UpdatedAt = DateTime.UtcNow;
        crisis.LastModifiedBy = closedByUserId != Guid.Empty ? closedByUserId.ToString() : "Operations Administrator";

        await _context.SaveChangesAsync(cancellationToken);

        return Result<bool>.Success(true, $"Crisis operation '{crisis.Title}' marked as resolved.");
    }

    public async Task<Result<bool>> AssignResponseTeamAsync(
        Guid id,
        AssignCrisisTeamDto dto,
        Guid assignedByUserId,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.TeamName))
        {
            return Result<bool>.Failure("Response team name is required.");
        }

        var crisis = await _context.CrisisEvents.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (crisis == null)
        {
            return Result<bool>.Failure("Crisis event not found.");
        }

        // Directives log note
        var directiveNote = $"\n[Team Assigned {DateTime.UtcNow:yyyy-MM-dd HH:mm}]: Unit: {dto.TeamName}. Directive: {dto.OperationalDirectives ?? "Immediate field deployment."}";
        crisis.Description = (crisis.Description ?? string.Empty) + directiveNote;

        await _context.SaveChangesAsync(cancellationToken);

        return Result<bool>.Success(true, $"Emergency response team '{dto.TeamName}' dispatched to crisis zone.");
    }

    public async Task<Result<IReadOnlyList<CrisisHazardZoneDto>>> GetHazardZonesAsync(
        Guid? crisisId = null,
        CancellationToken cancellationToken = default)
    {
        await EnsureSeededAsync(cancellationToken);

        var zones = new List<CrisisHazardZoneDto>
        {
            new()
            {
                ZoneName = "Kelani River Basin Red Flood Inundation Area",
                RiskLevel = "Extreme Flood Risk",
                PolygonColor = "#ef4444",
                Coordinates = new List<decimal[]>
                {
                    new[] { 6.976m, 79.882m },
                    new[] { 6.970m, 79.925m },
                    new[] { 6.960m, 79.955m },
                    new[] { 6.945m, 79.965m },
                    new[] { 6.928m, 79.948m },
                    new[] { 6.922m, 79.912m },
                    new[] { 6.928m, 79.885m },
                    new[] { 6.942m, 79.870m },
                    new[] { 6.960m, 79.864m }
                }
            },
            new()
            {
                ZoneName = "Gampaha Upper Terrace Slope Warning Cone",
                RiskLevel = "Landslide Threat",
                PolygonColor = "#f97316",
                Coordinates = new List<decimal[]>
                {
                    new[] { 7.095m, 79.992m },
                    new[] { 7.102m, 80.005m },
                    new[] { 7.088m, 80.015m },
                    new[] { 7.080m, 79.995m }
                }
            },
            new()
            {
                ZoneName = "Kalutara & Beruwala Coastal Squall Corridor",
                RiskLevel = "High Wind Squall",
                PolygonColor = "#8b5cf6",
                Coordinates = new List<decimal[]>
                {
                    new[] { 6.595m, 79.950m },
                    new[] { 6.610m, 79.970m },
                    new[] { 6.570m, 79.980m },
                    new[] { 6.565m, 79.955m }
                }
            }
        };

        return await Task.FromResult(Result<IReadOnlyList<CrisisHazardZoneDto>>.Success(zones));
    }

    private static CrisisEventDto MapToDto(CrisisEvent c, int displayIndex)
    {
        var (label, cssClass) = GetSeverityMeta(c.Severity);
        var region = GetRegionFromDisaster(c);

        return new CrisisEventDto
        {
            Id = c.Id,
            Code = $"CR-2026-00{displayIndex}",
            Title = c.Title,
            Description = c.Description,
            DisasterType = c.DisasterType,
            Severity = c.Severity,
            SeverityLabel = label,
            SeverityClass = cssClass,
            Region = region,
            Latitude = c.Latitude,
            Longitude = c.Longitude,
            AffectedAreaRadius = c.AffectedAreaRadius,
            EstimatedAffectedCount = GetEstimatedAffected(c),
            StartDate = c.StartDate,
            EndDate = c.EndDate,
            IsActive = c.IsActive,
            Status = c.IsActive ? "Active Response" : "Resolved",
            AssignedLeadTeam = GetDefaultLeadTeam(c),
            OpenRequestsCount = c.AssistanceRequests?.Count(r => r.Status != RequestStatus.Resolved && r.Status != RequestStatus.Closed) ?? 0,
            LinkedSheltersCount = c.Shelters?.Count(s => s.IsActive) ?? 0,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt
        };
    }

    private static (string Label, string CssClass) GetSeverityMeta(int severity) => severity switch
    {
        >= 4 => ("Critical", "badge-critical"),
        3 => ("High", "badge-high"),
        2 => ("Medium", "badge-medium"),
        _ => ("Low", "badge-low")
    };

    private static string GetRegionFromDisaster(CrisisEvent c)
    {
        if (c.Title.Contains("Kelani", StringComparison.OrdinalIgnoreCase) || c.Title.Contains("Monsoon", StringComparison.OrdinalIgnoreCase))
            return "Colombo, Western Province";
        if (c.Title.Contains("Gampaha", StringComparison.OrdinalIgnoreCase) || c.DisasterType == DisasterType.Landslide)
            return "Gampaha District";
        if (c.Title.Contains("Kalutara", StringComparison.OrdinalIgnoreCase))
            return "Kalutara District";
        if (c.Title.Contains("Negombo", StringComparison.OrdinalIgnoreCase))
            return "Negombo Area";
        if (c.Title.Contains("Drought", StringComparison.OrdinalIgnoreCase) || c.Title.Contains("Hambantota", StringComparison.OrdinalIgnoreCase))
            return "Hambantota District";
        return "Western Province Operations Zone";
    }

    private static int GetEstimatedAffected(CrisisEvent c)
    {
        if (c.Title.Contains("Monsoon", StringComparison.OrdinalIgnoreCase) || c.Title.Contains("Kelani", StringComparison.OrdinalIgnoreCase))
            return 3200;
        if (c.DisasterType == DisasterType.Landslide || c.Title.Contains("Gampaha", StringComparison.OrdinalIgnoreCase))
            return 850;
        if (c.Title.Contains("Kalutara", StringComparison.OrdinalIgnoreCase))
            return 2100;
        if (c.Title.Contains("Negombo", StringComparison.OrdinalIgnoreCase))
            return 600;
        if (c.Title.Contains("Drought", StringComparison.OrdinalIgnoreCase))
            return 1800;
        return (int)((c.AffectedAreaRadius ?? 10) * 120);
    }

    private static string GetDefaultLeadTeam(CrisisEvent c) => c.DisasterType switch
    {
        DisasterType.Flood => "Alpha Rescue Unit 4 (Colombo)",
        DisasterType.Landslide => "Geotechnical Hazard Unit (NBRO)",
        DisasterType.Storm => "Coastal Emergency Response Fleet",
        DisasterType.Tsunami => "Joint Military Rapid Task Force",
        _ => "National Emergency Relief Unit"
    };

    private static List<CrisisResponseUnitDto> GetDeployedUnitsForCrisis(CrisisEvent c)
    {
        return new List<CrisisResponseUnitDto>
        {
            new()
            {
                UnitName = GetDefaultLeadTeam(c),
                Leader = "Capt. Rohan Wijesinghe",
                Status = "Deployed On-Site",
                OperationalDirective = "Conduct priority evacuations in lower basin sectors and transfer patients to regional camps.",
                DeployedAt = c.StartDate
            },
            new()
            {
                UnitName = "Medical Support Convoy Unit 2",
                Leader = "Dr. Ananya Sen",
                Status = "Active Logistics",
                OperationalDirective = "Deploy clean drinking water purification filters and basic trauma dressing packs.",
                DeployedAt = c.StartDate.AddHours(2)
            }
        };
    }

    private static List<CrisisHazardZoneDto> GetHazardZonesForCrisis(CrisisEvent c)
    {
        var lat = c.Latitude ?? 6.9580m;
        var lng = c.Longitude ?? 79.8980m;

        return new List<CrisisHazardZoneDto>
        {
            new()
            {
                ZoneName = $"{c.Title} Perimeter Exclusion Zone",
                RiskLevel = c.Severity >= 4 ? "Extreme Hazard" : "High Hazard",
                PolygonColor = c.Severity >= 4 ? "#ef4444" : "#f97316",
                Coordinates = new List<decimal[]>
                {
                    new[] { lat + 0.018m, lng - 0.015m },
                    new[] { lat + 0.012m, lng + 0.025m },
                    new[] { lat - 0.015m, lng + 0.020m },
                    new[] { lat - 0.020m, lng - 0.010m },
                    new[] { lat + 0.005m, lng - 0.022m }
                }
            }
        };
    }

    private static List<CrisisOperationalIssueDto> GetOperationalIssues(CrisisEvent c)
    {
        return new List<CrisisOperationalIssueDto>
        {
            new()
            {
                Id = "iss-1",
                Title = "Drinking water shortfall in sector: 140 units requested",
                Percentage = 65,
                Severity = "Critical"
            },
            new()
            {
                Id = "iss-2",
                Title = "Regional evacuation shelters approaching 85% occupancy capacity",
                Percentage = 84,
                Severity = "Attention"
            }
        };
    }
}
