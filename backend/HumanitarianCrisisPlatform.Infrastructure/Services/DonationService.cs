using Microsoft.EntityFrameworkCore;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Donations;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;

namespace HumanitarianCrisisPlatform.Infrastructure.Services;

public class DonationService : IDonationService
{
    private readonly ApplicationDbContext _context;

    private static readonly IReadOnlyList<ReliefPackageTemplate> PackageCatalog = new List<ReliefPackageTemplate>
    {
        new("PKG-01", "Displaced Family 7-Day Ration Pack", "4-5 Person Household", 7500m,
            "Rice, dhal, canned fish, milk powder, biscuits, tea, matches & clean water", 1200, "Most Urgent"),
        new("PKG-02", "Clean Drinking Water Bowser Delivery", "500 Flood-Stranded Citizens", 25000m,
            "6,000 Litres of certified potable drinking water dispatched via municipal tanker", 60, "High Impact"),
        new("PKG-03", "Emergency Medical & Triage Kit", "Community First-Aid Post", 15000m,
            "Antiseptics, bandages, burn cream, ORS rehydration salts, fever medication & sterile gloves", 250, "Critical Care"),
        new("PKG-04", "Infant Care & Maternal Nutrition Pack", "Mothers with Infants in Shelters", 10000m,
            "Infant formula, sterile baby bottles, diapers, baby soap & maternal nutritional supplements", 400, "Vulnerable")
    };

    public DonationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<DonationSummaryDto>> GetSummaryAsync(CancellationToken cancellationToken = default)
    {
        var donations = await _context.Donations
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var cutoff48h = DateTime.UtcNow.AddHours(-48);
        var activeCentersCount = await _context.Shelters
            .AsNoTracking()
            .CountAsync(s => s.IsActive, cancellationToken);

        var totalFundsRaised = donations
            .Where(d => d.Amount.HasValue)
            .Sum(d => d.Amount!.Value);

        var recent48HoursAmount = donations
            .Where(d => d.Amount.HasValue && d.CreatedAt >= cutoff48h)
            .Sum(d => d.Amount!.Value);

        var activeDonorsCount = donations
            .Select(d => d.DonorName.Trim().ToLowerInvariant())
            .Where(n => !string.IsNullOrEmpty(n))
            .Distinct()
            .Count();

        var pledgedCount = donations.Count(d => d.Status == 0);
        var receivedCount = donations.Count(d => d.Status == 1);
        var distributedCount = donations.Count(d => d.Status == 2);

        var itemsReceivedCount = donations
            .Where(d => d.ItemQuantity.HasValue)
            .Sum(d => d.ItemQuantity!.Value);

        var itemsDistributedCount = donations
            .Where(d => d.Status == 2 && d.ItemQuantity.HasValue)
            .Sum(d => d.ItemQuantity!.Value);

        var pendingAllocationCount = donations
            .Where(d => d.Status != 2 && d.ItemQuantity.HasValue)
            .Sum(d => d.ItemQuantity!.Value);

        var reliefPacksDistributed = donations.Count(d => d.Status == 2);

        double utilizationRatio = donations.Count == 0
            ? 0
            : Math.Round((double)(receivedCount + distributedCount) / donations.Count * 100.0, 1);

        var summary = new DonationSummaryDto
        {
            TotalFundsRaised = totalFundsRaised,
            Recent48HoursAmount = recent48HoursAmount,
            TotalDonationsCount = donations.Count,
            ReliefPacksDistributed = reliefPacksDistributed,
            ActiveDonorsCount = activeDonorsCount,
            ActiveCentersCount = activeCentersCount,
            UtilizationRatio = utilizationRatio,
            ItemsReceivedCount = itemsReceivedCount,
            ItemsDistributedCount = itemsDistributedCount,
            PendingAllocationCount = pendingAllocationCount,
            PledgedCount = pledgedCount,
            ReceivedCount = receivedCount,
            DistributedCount = distributedCount
        };

        return Result<DonationSummaryDto>.Success(summary);
    }

    public async Task<Result<IReadOnlyList<ReliefPackageDto>>> GetReliefPackagesAsync(CancellationToken cancellationToken = default)
    {
        var donations = await _context.Donations
            .AsNoTracking()
            .Where(d => d.ItemDescription != null)
            .Select(d => new { d.ItemDescription, d.ItemQuantity })
            .ToListAsync(cancellationToken);

        var packages = PackageCatalog.Select(pkg =>
        {
            var fundedFromDb = donations
                .Where(d => d.ItemDescription!.Contains(pkg.Id, StringComparison.OrdinalIgnoreCase)
                         || d.ItemDescription!.Contains(pkg.Name, StringComparison.OrdinalIgnoreCase))
                .Sum(d => d.ItemQuantity ?? 1);

            return new ReliefPackageDto
            {
                Id = pkg.Id,
                Name = pkg.Name,
                Target = pkg.Target,
                CostAmount = pkg.CostAmount,
                CostFormatted = $"Rs. {pkg.CostAmount:N0}",
                Impact = pkg.Impact,
                Funded = fundedFromDb,
                Goal = pkg.Goal,
                Badge = pkg.Badge
            };
        }).ToList();

        return Result<IReadOnlyList<ReliefPackageDto>>.Success(packages);
    }

    public async Task<Result<IReadOnlyList<DonationDto>>> GetDonationsAsync(
        int? status = null,
        int? donationType = null,
        Guid? crisisEventId = null,
        string? search = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Donations
            .AsNoTracking()
            .Include(d => d.CrisisEvent)
            .AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(d => d.Status == status.Value);
        }

        if (donationType.HasValue)
        {
            query = query.Where(d => d.DonationType == donationType.Value);
        }

        if (crisisEventId.HasValue)
        {
            query = query.Where(d => d.CrisisEventId == crisisEventId.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLowerInvariant();
            query = query.Where(d =>
                d.DonorName.ToLower().Contains(term) ||
                (d.ItemDescription != null && d.ItemDescription.ToLower().Contains(term)) ||
                (d.DonorEmail != null && d.DonorEmail.ToLower().Contains(term)));
        }

        var items = await query
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync(cancellationToken);

        var dtos = items.Select(MapToDto).ToList();
        return Result<IReadOnlyList<DonationDto>>.Success(dtos);
    }

    public async Task<Result<DonationDto>> GetDonationByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var donation = await _context.Donations
            .AsNoTracking()
            .Include(d => d.CrisisEvent)
            .FirstOrDefaultAsync(d => d.Id == id, cancellationToken);

        if (donation == null)
        {
            return Result<DonationDto>.Failure($"Donation with ID '{id}' was not found.");
        }

        return Result<DonationDto>.Success(MapToDto(donation));
    }

    public async Task<Result<DonationDto>> CreateDonationAsync(
        CreateDonationDto dto,
        Guid? currentUserId,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.DonorName))
        {
            return Result<DonationDto>.Failure("Donor or organisation name is required.");
        }

        ReliefPackageTemplate? matchedPackage = null;
        if (!string.IsNullOrWhiteSpace(dto.PackageId))
        {
            matchedPackage = PackageCatalog.FirstOrDefault(p =>
                p.Id.Equals(dto.PackageId.Trim(), StringComparison.OrdinalIgnoreCase));
            if (matchedPackage == null)
            {
                return Result<DonationDto>.Failure($"Relief package '{dto.PackageId}' does not exist.");
            }
        }

        if (dto.CrisisEventId.HasValue)
        {
            var crisisExists = await _context.CrisisEvents
                .AnyAsync(c => c.Id == dto.CrisisEventId.Value, cancellationToken);
            if (!crisisExists)
            {
                return Result<DonationDto>.Failure($"Crisis event '{dto.CrisisEventId.Value}' was not found.");
            }
        }

        decimal? effectiveAmount = dto.Amount;
        string? effectiveDescription = dto.ItemDescription?.Trim();
        int? effectiveQuantity = dto.ItemQuantity;

        if (matchedPackage != null)
        {
            var qty = effectiveQuantity ?? 1;
            effectiveQuantity = qty;
            effectiveAmount ??= matchedPackage.CostAmount * qty;
            if (string.IsNullOrWhiteSpace(effectiveDescription))
            {
                effectiveDescription = $"{matchedPackage.Id}: {qty}x {matchedPackage.Name}";
            }
        }

        if (dto.DonationType == 0 && (!effectiveAmount.HasValue || effectiveAmount.Value <= 0))
        {
            return Result<DonationDto>.Failure("Monetary donations require an amount greater than zero or a valid relief package.");
        }

        if (dto.DonationType == 1 && string.IsNullOrWhiteSpace(effectiveDescription))
        {
            return Result<DonationDto>.Failure("Material donations require an item description.");
        }

        var donation = new Donation
        {
            Id = Guid.NewGuid(),
            DonorName = dto.DonorName.Trim(),
            DonorEmail = string.IsNullOrWhiteSpace(dto.DonorEmail) ? null : dto.DonorEmail.Trim(),
            DonorPhone = string.IsNullOrWhiteSpace(dto.DonorPhone) ? null : dto.DonorPhone.Trim(),
            DonationType = dto.DonationType,
            Amount = effectiveAmount,
            Currency = string.IsNullOrWhiteSpace(dto.Currency) ? "LKR" : dto.Currency.Trim().ToUpperInvariant(),
            ItemDescription = effectiveDescription,
            ItemQuantity = effectiveQuantity,
            CrisisEventId = dto.CrisisEventId,
            Status = 0, // Pledged
            CreatedAt = DateTime.UtcNow,
            CreatedBy = currentUserId.HasValue && currentUserId.Value != Guid.Empty
                ? currentUserId.Value.ToString()
                : "DonorPortal"
        };

        _context.Donations.Add(donation);
        await _context.SaveChangesAsync(cancellationToken);

        if (donation.CrisisEventId.HasValue)
        {
            await _context.Entry(donation).Reference(d => d.CrisisEvent).LoadAsync(cancellationToken);
        }

        return Result<DonationDto>.Success(MapToDto(donation), "Donation pledge registered successfully.");
    }

    public async Task<Result<DonationDto>> UpdateDonationStatusAsync(
        Guid id,
        UpdateDonationStatusDto dto,
        Guid? currentUserId,
        CancellationToken cancellationToken = default)
    {
        if (dto.Status is < 0 or > 2)
        {
            return Result<DonationDto>.Failure("Invalid status value. Allowed values: 0 (Pledged), 1 (Received), 2 (Distributed).");
        }

        var donation = await _context.Donations
            .Include(d => d.CrisisEvent)
            .FirstOrDefaultAsync(d => d.Id == id, cancellationToken);

        if (donation == null)
        {
            return Result<DonationDto>.Failure($"Donation with ID '{id}' was not found.");
        }

        donation.Status = dto.Status;
        if (dto.Status >= 1 && !donation.ReceivedAt.HasValue)
        {
            donation.ReceivedAt = DateTime.UtcNow;
        }
        donation.UpdatedAt = DateTime.UtcNow;
        if (currentUserId.HasValue && currentUserId.Value != Guid.Empty)
        {
            donation.LastModifiedBy = currentUserId.Value.ToString();
        }

        await _context.SaveChangesAsync(cancellationToken);

        return Result<DonationDto>.Success(MapToDto(donation), $"Donation status updated to {GetStatusName(donation.Status)}.");
    }

    public async Task<Result<DonationReceiptDto>> GetReceiptAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var donation = await _context.Donations
            .AsNoTracking()
            .Include(d => d.CrisisEvent)
            .FirstOrDefaultAsync(d => d.Id == id, cancellationToken);

        if (donation == null)
        {
            return Result<DonationReceiptDto>.Failure($"Donation with ID '{id}' was not found.");
        }

        var shortCode = donation.Id.ToString("N")[..8].ToUpperInvariant();
        var receipt = new DonationReceiptDto
        {
            ReceiptNumber = $"RCT-{donation.CreatedAt:yyyyMMdd}-{shortCode}",
            TransactionCode = FormatTransactionCode(donation.Id),
            DonationId = donation.Id,
            DonorName = donation.DonorName,
            DonorEmail = donation.DonorEmail,
            DonationTypeName = GetDonationTypeName(donation.DonationType),
            Amount = donation.Amount,
            Currency = donation.Currency ?? "LKR",
            ItemDescription = donation.ItemDescription,
            ItemQuantity = donation.ItemQuantity,
            StatusName = GetStatusName(donation.Status),
            CrisisTitle = donation.CrisisEvent?.Title,
            IssuedAt = DateTime.UtcNow,
            ReceivedAt = donation.ReceivedAt,
            VerificationCode = $"VER-{shortCode}"
        };

        return Result<DonationReceiptDto>.Success(receipt);
    }

    public async Task<Result> DeleteDonationAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var donation = await _context.Donations.FirstOrDefaultAsync(d => d.Id == id, cancellationToken);
        if (donation == null)
        {
            return Result.Failure($"Donation with ID '{id}' was not found.");
        }

        _context.Donations.Remove(donation);
        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success("Donation record removed successfully.");
    }

    private static DonationDto MapToDto(Donation d) => new()
    {
        Id = d.Id,
        TransactionCode = FormatTransactionCode(d.Id),
        DonorName = d.DonorName,
        DonorEmail = d.DonorEmail,
        DonorPhone = d.DonorPhone,
        DonationType = d.DonationType,
        DonationTypeName = GetDonationTypeName(d.DonationType),
        Amount = d.Amount,
        Currency = d.Currency ?? "LKR",
        ItemDescription = d.ItemDescription,
        ItemQuantity = d.ItemQuantity,
        CrisisEventId = d.CrisisEventId,
        CrisisTitle = d.CrisisEvent?.Title,
        Status = d.Status,
        StatusName = GetStatusName(d.Status),
        ReceivedAt = d.ReceivedAt,
        CreatedAt = d.CreatedAt,
        UpdatedAt = d.UpdatedAt
    };

    private static string FormatTransactionCode(Guid id) =>
        $"TXN-{id.ToString("N")[..6].ToUpperInvariant()}";

    private static string GetDonationTypeName(int donationType) => donationType switch
    {
        0 => "Monetary",
        1 => "Material",
        _ => "Other"
    };

    private static string GetStatusName(int status) => status switch
    {
        0 => "Pledged",
        1 => "Received",
        2 => "Distributed",
        _ => "Unknown"
    };

    private sealed record ReliefPackageTemplate(
        string Id,
        string Name,
        string Target,
        decimal CostAmount,
        string Impact,
        int Goal,
        string Badge);
}

