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
            .Where(d => d.Amount.HasValue && d.Status >= 0)
            .Sum(d => d.Amount!.Value);

        var recent48HoursAmount = donations
            .Where(d => d.Amount.HasValue && d.Status >= 0 && d.CreatedAt >= cutoff48h)
            .Sum(d => d.Amount!.Value);

        var activeDonorsCount = donations
            .Select(d => d.DonorName.Trim().ToLowerInvariant())
            .Where(n => !string.IsNullOrEmpty(n))
            .Distinct()
            .Count();

        var pledgedCount = donations.Count(d => d.Status == 0);
        var receivedCount = donations.Count(d => d.Status == 1);
        var distributedCount = donations.Count(d => d.Status >= 2);

        var itemsReceivedCount = donations
            .Where(d => d.ItemQuantity.HasValue && d.Status >= 0)
            .Sum(d => d.ItemQuantity!.Value);

        var itemsDistributedCount = donations
            .Where(d => d.Status >= 2 && d.ItemQuantity.HasValue)
            .Sum(d => d.ItemQuantity!.Value);

        var pendingAllocationCount = donations
            .Where(d => d.Status == 1 && d.ItemQuantity.HasValue)
            .Sum(d => d.ItemQuantity!.Value);

        var reliefPacksDistributed = donations.Count(d => d.Status >= 2);

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
            .Where(d => d.ItemDescription != null && d.Status >= 0)
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

    // =========================================================================
    // Advanced Donor & Funding Officer Portal Operations (Database-Backed)
    // =========================================================================

    private static string FormatDonationCode(Guid id) =>
        $"DON-{id.ToString("N")[..4].ToUpperInvariant()}";

    private static string FormatCampaignCode(Guid id) =>
        $"CMP-{id.ToString("N")[..4].ToUpperInvariant()}";

    private static string FormatDonorCode(string donorName)
    {
        var hash = Math.Abs(donorName.Trim().ToLowerInvariant().GetHashCode());
        return $"DNR-{(hash % 9000 + 1000)}";
    }

    private static string InferDonorType(Donation d)
    {
        var name = d.DonorName.ToLowerInvariant();
        if (name.Contains("foundation") || name.Contains("trust") || name.Contains("ngo") || name.Contains("red cross"))
            return "NGO / Foundation";
        if (name.Contains("un ") || name.Contains("ocha") || name.Contains("ministry") || name.Contains("consortium"))
            return "Institutional";
        if (name.Contains("ltd") || name.Contains("corp") || name.Contains("association") || name.Contains("exporters") || name.Contains("club"))
            return "Corporate";
        return "Individual";
    }

    private async Task<Donation?> FindDonationByIdOrCodeAsync(string idOrCode, CancellationToken cancellationToken)
    {
        if (Guid.TryParse(idOrCode, out var guid))
        {
            return await _context.Donations
                .Include(d => d.CrisisEvent)
                .FirstOrDefaultAsync(d => d.Id == guid, cancellationToken);
        }

        var normalized = idOrCode.Trim().ToUpperInvariant();
        var all = await _context.Donations
            .Include(d => d.CrisisEvent)
            .ToListAsync(cancellationToken);

        return all.FirstOrDefault(d => FormatDonationCode(d.Id) == normalized);
    }

    private static DonorRecordDto MapDonationToRecordDto(Donation d)
    {
        var code = FormatDonationCode(d.Id);
        var isMonetary = d.DonationType == 0;
        var isFlagged = (d.AuditHash ?? "").Contains("FLAG", StringComparison.OrdinalIgnoreCase)
                     || (d.AuditHash ?? "").Contains("ESCALATED", StringComparison.OrdinalIgnoreCase)
                     || (d.AuditHash ?? "").Contains("INVESTIGATING", StringComparison.OrdinalIgnoreCase);

        var verification = d.Status switch
        {
            -1 => "Rejected",
            0 => isFlagged ? "Flagged" : "Pending",
            _ => "Verified"
        };

        var statusLabel = d.Status switch
        {
            -1 => "Rejected",
            0 => isFlagged ? "Flagged" : "Pending",
            1 => "Verified",
            2 => "Allocated",
            3 => "Dispatched",
            _ => "Pending"
        };

        var (color, bg, border) = d.Status switch
        {
            -1 => ("#dc2626", "#fef2f2", "#fecaca"),
            0 => isFlagged ? ("#dc2626", "#fef2f2", "#fecaca") : ("#b45309", "#fffbeb", "#fde68a"),
            1 => ("#0f766e", "#f0fdfa", "#99f6e4"),
            2 => ("#3d6b4f", "#edf2e6", "#dfe5d8"),
            3 => ("#1e40af", "#eff6ff", "#bfdbfe"),
            _ => ("#b45309", "#fffbeb", "#fde68a")
        };

        return new DonorRecordDto
        {
            Id = code,
            DonationGuid = d.Id,
            CrisisEventId = d.CrisisEventId,
            Source = d.CrisisEvent?.Title ?? "General Relief Fund",
            DonorOrg = d.DonorName,
            ContactPerson = d.DonorName,
            Email = d.DonorEmail ?? "Not provided",
            Phone = d.DonorPhone ?? "Not provided",
            Type = isMonetary ? "Monetary" : "Material",
            RecordedValue = isMonetary
                ? $"{d.Currency ?? "LKR"} {(d.Amount ?? 0):N0}"
                : $"{(d.ItemQuantity ?? 0):N0} units",
            RawValue = isMonetary ? (d.Amount ?? 0) : (d.ItemQuantity ?? 0),
            Currency = isMonetary ? (d.Currency ?? "LKR") : "Units",
            Verification = verification,
            Allocation = d.Status >= 2 ? (d.TargetDistrict ?? d.CrisisEvent?.Title ?? "Allocated") : "Unallocated",
            AllocationTarget = d.TargetDistrict ?? d.CrisisEvent?.Title ?? "Unallocated",
            Status = statusLabel,
            StatusColor = color,
            StatusBg = bg,
            StatusBorder = border,
            OperationalArea = d.TargetDistrict ?? "Western Province",
            Notes = d.ItemDescription ?? string.Empty,
            VerifiedAt = d.ReceivedAt?.ToString("yyyy-MM-dd HH:mm") ?? "Pending Review",
            VerifiedBy = d.VerifiedBy ?? (d.Status >= 1 ? "Funding Officer" : "Awaiting Verification"),
            Category = d.Sector ?? (isMonetary ? "Monetary Grant" : "Relief Supplies"),
            ComplianceDoc = $"DOC-{code}-AUDIT.pdf",
            CreatedAt = d.CreatedAt
        };
    }

    private static List<SuspiciousFlagDto> BuildFlagsFromDonations(IEnumerable<Donation> donations)
    {
        var flags = new List<SuspiciousFlagDto>();
        foreach (var d in donations)
        {
            var code = FormatDonationCode(d.Id);
            var hash = d.AuditHash ?? string.Empty;
            var isHighMonetary = d.DonationType == 0 && (d.Amount ?? 0) >= 1_000_000m;
            var isHighMaterial = d.DonationType == 1 && (d.ItemQuantity ?? 0) >= 200;
            var isExplicitlyFlagged = hash.Contains("FLAG", StringComparison.OrdinalIgnoreCase)
                                   || hash.Contains("ESCALATED", StringComparison.OrdinalIgnoreCase)
                                   || hash.Contains("INVESTIGATING", StringComparison.OrdinalIgnoreCase);

            if (!isHighMonetary && !isHighMaterial && !isExplicitlyFlagged)
                continue;

            var riskFactors = new List<string>();
            if (isHighMonetary)
                riskFactors.Add($"High-value monetary contribution ({d.Currency ?? "LKR"} {d.Amount:N0}) exceeds standard single-officer threshold (LKR 1,000,000).");
            if (isHighMaterial)
                riskFactors.Add($"Large material batch ({d.ItemQuantity:N0} units) requires warehouse intake confirmation.");
            if (string.IsNullOrWhiteSpace(d.DonorEmail))
                riskFactors.Add("Missing donor contact email for tax/audit verification.");
            if (isExplicitlyFlagged)
                riskFactors.Add($"Audit marker recorded: {hash}.");

            var reviewStatus = d.Status switch
            {
                -1 => "Rejected",
                >= 1 when !hash.Contains("ESCALATED", StringComparison.OrdinalIgnoreCase) => "Cleared",
                _ when hash.Contains("ESCALATED", StringComparison.OrdinalIgnoreCase) => "Escalated",
                _ when hash.Contains("INVESTIGATING", StringComparison.OrdinalIgnoreCase) => "Under Investigation",
                _ => "Open"
            };

            var riskScore = Math.Min(95, (isHighMonetary ? 55 : 0) + (isHighMaterial ? 50 : 0) + (string.IsNullOrWhiteSpace(d.DonorEmail) ? 20 : 10) + (isExplicitlyFlagged ? 20 : 0));

            flags.Add(new SuspiciousFlagDto
            {
                Id = $"FLG-{d.Id.ToString("N")[..4].ToUpperInvariant()}",
                RecordId = code,
                DonationGuid = d.Id,
                DonorOrg = d.DonorName,
                AnomalyReason = isHighMonetary
                    ? $"High-value contribution ({d.Currency ?? "LKR"} {d.Amount:N0}) pending dual compliance verification."
                    : isHighMaterial
                        ? $"High-volume material batch ({d.ItemQuantity:N0} units) pending warehouse manifest check."
                        : "Flagged by Funding Officer for secondary compliance review.",
                Severity = riskScore >= 75 ? "urgent" : "warning",
                RiskScore = riskScore,
                Status = reviewStatus,
                Details = d.ItemDescription ?? "Automated rule-based threshold check triggered for human officer verification.",
                RiskFactors = riskFactors,
                AIRecommendation = "Advisory only: Review supporting documentation and verify donor identity before clearing. AI cannot approve, reject, accuse, or allocate funds.",
                DecisionReason = d.LastModifiedBy,
                DetectedAt = d.CreatedAt,
                ResolvedBy = d.VerifiedBy,
                ResolvedAt = d.UpdatedAt
            });
        }
        return flags
            .OrderByDescending(f => f.Status == "Open" || f.Status == "Under Investigation")
            .ThenByDescending(f => f.DetectedAt)
            .ToList();
    }

    public async Task<Result<FundingOfficerDashboardDto>> GetFundingOfficerDashboardAsync(CancellationToken cancellationToken = default)
    {
        var dbDonations = await _context.Donations
            .AsNoTracking()
            .Include(d => d.CrisisEvent)
            .OrderByDescending(d => d.UpdatedAt ?? d.CreatedAt)
            .ToListAsync(cancellationToken);

        var crises = await _context.CrisisEvents
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var allocations = await _context.ResourceAllocations
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var verifiedMonetary = dbDonations
            .Where(d => d.DonationType == 0 && d.Status >= 1 && d.Amount.HasValue)
            .Sum(d => d.Amount!.Value);

        var allocatedMonetary = dbDonations
            .Where(d => d.DonationType == 0 && d.Status >= 2 && d.Amount.HasValue)
            .Sum(d => d.Amount!.Value);

        var unallocatedMonetary = Math.Max(0m, verifiedMonetary - allocatedMonetary);

        var totalMaterialUnits = dbDonations
            .Where(d => d.DonationType == 1 && d.Status >= 0 && d.ItemQuantity.HasValue)
            .Sum(d => d.ItemQuantity!.Value);

        var materialCategoriesCount = dbDonations
            .Where(d => d.DonationType == 1 && !string.IsNullOrWhiteSpace(d.Sector))
            .Select(d => d.Sector!.Trim().ToLowerInvariant())
            .Distinct()
            .Count();

        var registeredDonorsCount = dbDonations
            .Select(d => d.DonorName.Trim().ToLowerInvariant())
            .Where(n => !string.IsNullOrEmpty(n))
            .Distinct()
            .Count();

        var activeCampaignsCount = crises.Count(c => c.IsActive);
        var pendingVerificationsCount = dbDonations.Count(d => d.Status == 0);

        var allocationPct = verifiedMonetary > 0
            ? Math.Min(100, (int)Math.Round(allocatedMonetary / verifiedMonetary * 100m))
            : 0;

        var flags = BuildFlagsFromDonations(dbDonations);
        var openFlags = flags.Where(f => f.Status == "Open" || f.Status == "Under Investigation").ToList();

        var priorityItems = new List<PriorityAttentionItemDto>();
        foreach (var f in openFlags.Take(3))
        {
            priorityItems.Add(new PriorityAttentionItemDto
            {
                Id = f.RecordId,
                Code = $"{f.RecordId} compliance flag",
                Description = f.AnomalyReason,
                Status = f.Severity,
                TagColor = f.Severity == "urgent" ? "#dc2626" : "#d97706",
                BadgeText = f.Severity,
                RelatedTab = "suspicious",
                Timestamp = f.DetectedAt.ToString("MMM dd, HH:mm"),
                Details = f.Details
            });
        }

        foreach (var pending in dbDonations.Where(d => d.Status == 0).Take(3))
        {
            var code = FormatDonationCode(pending.Id);
            if (priorityItems.Any(p => p.Id == code)) continue;
            priorityItems.Add(new PriorityAttentionItemDto
            {
                Id = code,
                Code = $"{code} pending verification",
                Description = $"{pending.DonorName} ({(pending.DonationType == 0 ? $"LKR {pending.Amount:N0}" : $"{pending.ItemQuantity:N0} units")})",
                Status = "pending",
                TagColor = "#d97706",
                BadgeText = "pending",
                RelatedTab = "donations",
                Timestamp = pending.CreatedAt.ToString("MMM dd, HH:mm"),
                Details = pending.ItemDescription ?? "Awaiting Funding Officer verification."
            });
        }

        var recentActivity = dbDonations.Take(6).Select(d =>
        {
            var code = FormatDonationCode(d.Id);
            var actionText = d.Status switch
            {
                -1 => "Rejected during compliance review",
                0 => "Donation intake recorded (awaiting verification)",
                1 => "Donation verified and cleared",
                2 => "Funds/supplies allocated to target operation",
                3 => "Dispatched to relief hub",
                _ => "Donation updated"
            };
            return new RecentActivityItemDto
            {
                Id = $"ACT-{d.Id.ToString("N")[..6].ToUpperInvariant()}",
                Time = (d.UpdatedAt ?? d.CreatedAt).ToString("MMM dd, HH:mm"),
                RecordId = code,
                Source = d.DonorName,
                Action = actionText,
                Officer = d.VerifiedBy ?? "Funding Officer",
                Type = d.DonationType == 0 ? "Monetary" : "Material",
                Amount = d.DonationType == 0 ? $"LKR {(d.Amount ?? 0):N0}" : $"{(d.ItemQuantity ?? 0):N0} units"
            };
        }).ToList();

        var dashboard = new FundingOfficerDashboardDto
        {
            RegisteredDonors = new FundingOfficerMetricDto
            {
                Value = registeredDonorsCount,
                Raw = registeredDonorsCount,
                Label = "Registered donors",
                Subtext = "Verified & active contributors",
                Trend = $"{dbDonations.Count} total records",
                TrendUp = true
            },
            MonetaryRecords = new FundingOfficerMetricDto
            {
                Value = verifiedMonetary >= 1_000_000m
                    ? $"LKR {verifiedMonetary / 1_000_000m:F2}m"
                    : $"LKR {verifiedMonetary:N0}",
                Raw = verifiedMonetary,
                Label = "Verified monetary",
                Subtext = $"{dbDonations.Count(d => d.DonationType == 0 && d.Status >= 1)} verified grants",
                Trend = $"LKR {unallocatedMonetary:N0} unallocated",
                TrendUp = true
            },
            MaterialDonations = new FundingOfficerMetricDto
            {
                Value = totalMaterialUnits.ToString("N0"),
                Raw = totalMaterialUnits,
                Label = "Material donations",
                Subtext = "Recorded supply units",
                Trend = $"{Math.Max(1, materialCategoriesCount)} categories",
                TrendUp = true
            },
            ActiveCampaigns = new FundingOfficerMetricDto
            {
                Value = activeCampaignsCount,
                Raw = activeCampaignsCount,
                Label = "Active campaigns",
                Subtext = $"{crises.Count} total operations",
                Trend = "Live crisis operations",
                TrendUp = true
            },
            PendingVerification = new FundingOfficerMetricDto
            {
                Value = pendingVerificationsCount,
                Raw = pendingVerificationsCount,
                Label = "Pending verification",
                Subtext = "Awaiting officer review",
                Trend = $"{openFlags.Count} flagged",
                TrendUp = pendingVerificationsCount == 0
            },
            AllocatedBalance = new FundingOfficerMetricDto
            {
                Value = $"{allocationPct}%",
                Raw = allocationPct,
                Label = "Allocated balance",
                Subtext = $"LKR {allocatedMonetary:N0} allocated",
                Trend = $"{allocations.Count} depot dispatches",
                TrendUp = true
            },
            AvailableUnallocated = new FundingOfficerMetricDto
            {
                Value = $"LKR {unallocatedMonetary:N0}",
                Raw = unallocatedMonetary,
                Label = "Available unallocated",
                Subtext = "Verified funds ready to allocate",
                Trend = "Verified minus allocated",
                TrendUp = true
            },
            OpenSuspiciousFlagsCount = openFlags.Count,
            PriorityAttentionItems = priorityItems,
            ConnectedWorkflowSteps = new List<ConnectedWorkflowStepDto>
            {
                new() { Step = 1, Title = "Donation intake", Description = $"{dbDonations.Count} contributions logged", Status = dbDonations.Any() ? "completed" : "upcoming", NodeType = "intake", ActionLink = "donations" },
                new() { Step = 2, Title = "Officer verification", Description = $"{dbDonations.Count(d => d.Status >= 1)} verified, {pendingVerificationsCount} pending", Status = pendingVerificationsCount > 0 ? "in-progress" : "completed", NodeType = "verification", ActionLink = "donors" },
                new() { Step = 3, Title = "Campaign & hub allocation", Description = $"LKR {allocatedMonetary:N0} allocated", Status = allocatedMonetary > 0 ? "completed" : "in-progress", NodeType = "allocation", ActionLink = "allocations" },
                new() { Step = 4, Title = "Field dispatch", Description = $"{dbDonations.Count(d => d.Status == 3)} dispatched to shelters", Status = dbDonations.Any(d => d.Status == 3) ? "completed" : "upcoming", NodeType = "dispatch", ActionLink = "allocations" }
            },
            RecentActivity = recentActivity
        };

        return Result<FundingOfficerDashboardDto>.Success(dashboard);
    }

    public async Task<Result<IReadOnlyList<DonorProfileDto>>> GetDonorProfilesAsync(
        string? type = null,
        string? status = null,
        string? search = null,
        CancellationToken cancellationToken = default)
    {
        var donations = await _context.Donations
            .AsNoTracking()
            .Include(d => d.CrisisEvent)
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync(cancellationToken);

        var profiles = donations
            .GroupBy(d => d.DonorName.Trim(), StringComparer.OrdinalIgnoreCase)
            .Select(g =>
            {
                var first = g.First();
                var anyFlagged = g.Any(d => (d.AuditHash ?? "").Contains("FLAG", StringComparison.OrdinalIgnoreCase)
                                         || (d.AuditHash ?? "").Contains("ESCALATED", StringComparison.OrdinalIgnoreCase));
                var anyVerified = g.Any(d => d.Status >= 1);

                var verStatus = anyFlagged ? "Flagged" : anyVerified ? "Verified" : "Pending";

                return new DonorProfileDto
                {
                    DonorId = FormatDonorCode(g.Key),
                    DonorName = first.DonorName,
                    DonorType = InferDonorType(first),
                    VerificationStatus = verStatus,
                    TotalMonetaryAmount = g.Where(d => d.DonationType == 0 && d.Status >= 0).Sum(d => d.Amount ?? 0),
                    TotalMaterialUnits = g.Where(d => d.DonationType == 1 && d.Status >= 0).Sum(d => d.ItemQuantity ?? 0),
                    DonationCount = g.Count(),
                    LatestContributionDate = g.Max(d => d.CreatedAt),
                    OperationalArea = first.TargetDistrict ?? "Western Province",
                    DonationHistory = g.Select(MapDonationToRecordDto).ToList()
                };
            })
            .OrderByDescending(p => p.LatestContributionDate)
            .AsEnumerable();

        if (!string.IsNullOrWhiteSpace(type) && !type.Equals("all", StringComparison.OrdinalIgnoreCase))
        {
            profiles = profiles.Where(p => p.DonorType.Equals(type, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(status) && !status.Equals("all", StringComparison.OrdinalIgnoreCase))
        {
            profiles = profiles.Where(p => p.VerificationStatus.Equals(status, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var q = search.Trim().ToLowerInvariant();
            profiles = profiles.Where(p =>
                p.DonorId.ToLowerInvariant().Contains(q) ||
                p.DonorName.ToLowerInvariant().Contains(q) ||
                p.DonorType.ToLowerInvariant().Contains(q) ||
                p.OperationalArea.ToLowerInvariant().Contains(q));
        }

        return Result<IReadOnlyList<DonorProfileDto>>.Success(profiles.ToList());
    }

    public async Task<Result<DonorProfileDto>> UpdateDonorVerificationAsync(
        string donorId,
        UpdateDonorVerificationDto dto,
        string? officerName,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.AuditNote))
        {
            return Result<DonorProfileDto>.Failure("An authorised audit note is required.");
        }

        var donations = await _context.Donations
            .Include(d => d.CrisisEvent)
            .ToListAsync(cancellationToken);

        var matching = donations
            .Where(d => FormatDonorCode(d.DonorName).Equals(donorId, StringComparison.OrdinalIgnoreCase)
                     || d.DonorName.Equals(donorId, StringComparison.OrdinalIgnoreCase))
            .ToList();

        if (!matching.Any())
        {
            return Result<DonorProfileDto>.Failure($"Donor profile '{donorId}' was not found.");
        }

        var officer = string.IsNullOrWhiteSpace(officerName) ? "Funding Officer" : officerName;
        foreach (var d in matching)
        {
            if (dto.Status.Equals("Verified", StringComparison.OrdinalIgnoreCase))
            {
                if (d.Status == 0) d.Status = 1;
                d.VerifiedBy = officer;
                d.ReceivedAt ??= DateTime.UtcNow;
                d.AuditHash = "[CLEARED]";
            }
            else if (dto.Status.Equals("Flagged", StringComparison.OrdinalIgnoreCase))
            {
                d.Status = 0;
                d.AuditHash = "[FLAGGED]";
            }
            else
            {
                d.Status = 0;
            }
            d.LastModifiedBy = $"{officer}: {dto.AuditNote.Trim()}";
            d.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync(cancellationToken);

        var refreshed = await GetDonorProfilesAsync(null, null, null, cancellationToken);
        var updatedProfile = refreshed.Data?.FirstOrDefault(p => p.DonorId.Equals(FormatDonorCode(matching[0].DonorName), StringComparison.OrdinalIgnoreCase));
        return updatedProfile != null
            ? Result<DonorProfileDto>.Success(updatedProfile, $"Donor {updatedProfile.DonorName} verification status updated to {dto.Status}.")
            : Result<DonorProfileDto>.Failure("Failed to reload updated donor profile.");
    }

    public async Task<Result<IReadOnlyList<DonorRecordDto>>> GetDonorRecordsAsync(
        string? type = null,
        string? status = null,
        string? search = null,
        CancellationToken cancellationToken = default)
    {
        var dbDonations = await _context.Donations
            .AsNoTracking()
            .Include(d => d.CrisisEvent)
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync(cancellationToken);

        IEnumerable<DonorRecordDto> filtered = dbDonations.Select(MapDonationToRecordDto);

        if (!string.IsNullOrWhiteSpace(type) && !type.Equals("all", StringComparison.OrdinalIgnoreCase))
        {
            filtered = filtered.Where(x => x.Type.Equals(type, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(status) && !status.Equals("all", StringComparison.OrdinalIgnoreCase))
        {
            filtered = filtered.Where(x => x.Status.Equals(status, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var q = search.Trim().ToLowerInvariant();
            filtered = filtered.Where(x =>
                x.Id.ToLowerInvariant().Contains(q) ||
                x.DonorOrg.ToLowerInvariant().Contains(q) ||
                x.Source.ToLowerInvariant().Contains(q) ||
                x.AllocationTarget.ToLowerInvariant().Contains(q) ||
                x.Notes.ToLowerInvariant().Contains(q));
        }

        return Result<IReadOnlyList<DonorRecordDto>>.Success(filtered.ToList());
    }

    public async Task<Result<DonorRecordDto>> GetDonorRecordByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        var donation = await FindDonationByIdOrCodeAsync(id, cancellationToken);
        if (donation == null)
        {
            return Result<DonorRecordDto>.Failure($"Donation record '{id}' was not found.");
        }
        return Result<DonorRecordDto>.Success(MapDonationToRecordDto(donation));
    }

    public async Task<Result<DonorRecordDto>> CreateDonorRecordAsync(
        CreateDonorRecordDto dto,
        string? officerName,
        CancellationToken cancellationToken = default)
    {
        var isMonetary = dto.Type.Equals("Monetary", StringComparison.OrdinalIgnoreCase);
        if (dto.Amount <= 0)
        {
            return Result<DonorRecordDto>.Failure("Contribution amount or quantity must be greater than zero.");
        }

        Guid? crisisId = null;
        if (!string.IsNullOrWhiteSpace(dto.Source))
        {
            var matchedCrisis = await _context.CrisisEvents
                .FirstOrDefaultAsync(c => c.Title.ToLower() == dto.Source.Trim().ToLower(), cancellationToken);
            if (matchedCrisis != null)
            {
                crisisId = matchedCrisis.Id;
            }
        }

        var officer = string.IsNullOrWhiteSpace(officerName) ? "Funding Officer" : officerName;
        var dbDonation = new Donation
        {
            Id = Guid.NewGuid(),
            DonorName = dto.DonorOrg.Trim(),
            DonorEmail = string.IsNullOrWhiteSpace(dto.Email) ? null : dto.Email.Trim(),
            DonorPhone = string.IsNullOrWhiteSpace(dto.Phone) ? null : dto.Phone.Trim(),
            DonationType = isMonetary ? 0 : 1,
            Amount = isMonetary ? dto.Amount : null,
            Currency = string.IsNullOrWhiteSpace(dto.Currency) ? "LKR" : dto.Currency.Trim().ToUpperInvariant(),
            ItemQuantity = isMonetary ? null : (int)dto.Amount,
            ItemDescription = string.IsNullOrWhiteSpace(dto.Notes) ? $"{dto.Category} contribution" : dto.Notes.Trim(),
            Sector = dto.Category,
            TargetDistrict = string.IsNullOrWhiteSpace(dto.AllocationTarget) || dto.AllocationTarget == "Unallocated"
                ? dto.OperationalArea
                : dto.AllocationTarget,
            CrisisEventId = crisisId,
            Status = 0, // Queued as Pending verification
            CreatedAt = DateTime.UtcNow,
            CreatedBy = officer
        };

        _context.Donations.Add(dbDonation);
        await _context.SaveChangesAsync(cancellationToken);

        if (crisisId.HasValue)
        {
            await _context.Entry(dbDonation).Reference(d => d.CrisisEvent).LoadAsync(cancellationToken);
        }

        return Result<DonorRecordDto>.Success(
            MapDonationToRecordDto(dbDonation),
            $"Donation {FormatDonationCode(dbDonation.Id)} recorded and queued for verification.");
    }

    public async Task<Result<DonorRecordDto>> ProcessDonorDecisionAsync(
        string id,
        DonorDecisionDto dto,
        string? officerName,
        CancellationToken cancellationToken = default)
    {
        var donation = await FindDonationByIdOrCodeAsync(id, cancellationToken);
        if (donation == null)
        {
            return Result<DonorRecordDto>.Failure($"Donation record '{id}' was not found.");
        }

        var officer = string.IsNullOrWhiteSpace(officerName) ? "Funding Officer" : officerName;
        var action = dto.Action.Trim().ToLowerInvariant();
        var reason = string.IsNullOrWhiteSpace(dto.DecisionReason) ? dto.Note ?? "Officer action" : dto.DecisionReason.Trim();

        switch (action)
        {
            case "verify":
            case "submit-approval":
                if (donation.Status == -1)
                    return Result<DonorRecordDto>.Failure("Rejected donations cannot be verified without re-opening.");
                donation.Status = 1;
                donation.VerifiedBy = officer;
                donation.ReceivedAt ??= DateTime.UtcNow;
                donation.AuditHash = "[CLEARED]";
                break;

            case "allocate":
                if (donation.Status < 1)
                    return Result<DonorRecordDto>.Failure("Donation must be Verified before it can be Allocated.");
                donation.Status = 2;
                if (!string.IsNullOrWhiteSpace(dto.AllocationTarget))
                {
                    donation.TargetDistrict = dto.AllocationTarget.Trim();
                }
                break;

            case "dispatch":
                if (donation.Status < 2)
                    return Result<DonorRecordDto>.Failure("Donation must be Allocated before it can be Dispatched.");
                donation.Status = 3;
                break;

            case "request-clarification":
            case "flag":
                donation.Status = 0;
                donation.AuditHash = "[FLAGGED]";
                break;

            case "escalate":
                donation.Status = 0;
                donation.AuditHash = "[ESCALATED]";
                break;

            case "reject":
                if (string.IsNullOrWhiteSpace(dto.DecisionReason))
                    return Result<DonorRecordDto>.Failure("A rejection reason is required.");
                donation.Status = -1;
                donation.VerifiedBy = officer;
                break;

            case "memo-note":
                donation.ItemDescription = string.IsNullOrWhiteSpace(dto.Note) ? reason : dto.Note.Trim();
                break;

            default:
                return Result<DonorRecordDto>.Failure($"Unsupported action '{dto.Action}'.");
        }

        donation.LastModifiedBy = $"{officer} ({action}): {reason}";
        donation.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        return Result<DonorRecordDto>.Success(
            MapDonationToRecordDto(donation),
            $"Action '{action}' persisted for {FormatDonationCode(donation.Id)}.");
    }

    public async Task<Result<IReadOnlyList<FundingCampaignDto>>> GetCampaignsAsync(CancellationToken cancellationToken = default)
    {
        var crises = await _context.CrisisEvents
            .AsNoTracking()
            .OrderByDescending(c => c.IsActive)
            .ThenByDescending(c => c.StartDate)
            .ToListAsync(cancellationToken);

        var donations = await _context.Donations
            .AsNoTracking()
            .Include(d => d.CrisisEvent)
            .ToListAsync(cancellationToken);

        var campaigns = crises.Select(c =>
        {
            var linked = donations
                .Where(d => d.CrisisEventId == c.Id ||
                           (d.CrisisEventId == null && d.TargetDistrict != null &&
                            c.Title.Contains(d.TargetDistrict, StringComparison.OrdinalIgnoreCase)))
                .ToList();

            var verifiedMonetary = linked
                .Where(d => d.DonationType == 0 && d.Status >= 1 && d.Amount.HasValue)
                .Sum(d => d.Amount!.Value);

            var materialUnits = linked
                .Where(d => d.DonationType == 1 && d.Status >= 1 && d.ItemQuantity.HasValue)
                .Sum(d => d.ItemQuantity!.Value);

            var targetAmount = c.AffectedAreaRadius.HasValue && c.AffectedAreaRadius.Value >= 1000m
                ? c.AffectedAreaRadius.Value
                : Math.Max(1_000_000m, c.Severity * 2_000_000m);

            var pct = targetAmount > 0
                ? (int)Math.Min(100, Math.Round(verifiedMonetary / targetAmount * 100m))
                : 0;

            var status = !c.IsActive
                ? (c.EndDate.HasValue && c.EndDate.Value <= DateTime.UtcNow ? "Completed" : "Paused")
                : (pct >= 100 ? "Completed" : "Active");

            return new FundingCampaignDto
            {
                Id = FormatCampaignCode(c.Id),
                CrisisEventId = c.Id,
                Title = c.Title,
                TargetAmount = targetAmount,
                RaisedAmount = verifiedMonetary,
                RemainingAmount = Math.Max(0m, targetAmount - verifiedMonetary),
                MaterialUnitsReceived = materialUnits,
                DonationCount = linked.Count(d => d.Status >= 1),
                PercentFunded = pct,
                Status = status,
                OperationalArea = c.DisasterType.ToString(),
                Category = $"{c.DisasterType} Response (Severity {c.Severity})",
                TargetDescription = c.Description ?? "Emergency humanitarian response campaign.",
                StartDate = c.StartDate,
                EndDate = c.EndDate ?? c.StartDate.AddDays(30),
                LinkedDonations = linked.Select(MapDonationToRecordDto).ToList()
            };
        }).ToList();

        return Result<IReadOnlyList<FundingCampaignDto>>.Success(campaigns);
    }

    public async Task<Result<FundingCampaignDto>> CreateCampaignAsync(
        CreateFundingCampaignDto dto,
        CancellationToken cancellationToken = default)
    {
        var crisis = new CrisisEvent
        {
            Id = Guid.NewGuid(),
            Title = dto.Title.Trim(),
            Description = string.IsNullOrWhiteSpace(dto.TargetDescription) ? $"{dto.Category} - {dto.OperationalArea}" : dto.TargetDescription.Trim(),
            DisasterType = Domain.Enums.DisasterType.Flood,
            Severity = 3,
            AffectedAreaRadius = dto.TargetAmount,
            StartDate = DateTime.UtcNow,
            EndDate = DateTime.UtcNow.AddDays(Math.Max(1, dto.DurationDays)),
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.CrisisEvents.Add(crisis);
        await _context.SaveChangesAsync(cancellationToken);

        var campaigns = await GetCampaignsAsync(cancellationToken);
        var created = campaigns.Data?.FirstOrDefault(c => c.CrisisEventId == crisis.Id);
        return created != null
            ? Result<FundingCampaignDto>.Success(created, $"Campaign '{created.Title}' created and persisted.")
            : Result<FundingCampaignDto>.Failure("Campaign created but could not be reloaded.");
    }

    public async Task<Result<FundingCampaignDto>> UpdateCampaignStatusAsync(
        string id,
        UpdateCampaignStatusDto dto,
        CancellationToken cancellationToken = default)
    {
        var crises = await _context.CrisisEvents.ToListAsync(cancellationToken);
        var crisis = Guid.TryParse(id, out var guid)
            ? crises.FirstOrDefault(c => c.Id == guid)
            : crises.FirstOrDefault(c => FormatCampaignCode(c.Id).Equals(id, StringComparison.OrdinalIgnoreCase));

        if (crisis == null)
        {
            return Result<FundingCampaignDto>.Failure($"Campaign '{id}' was not found.");
        }

        var normalized = dto.Status.Trim().ToLowerInvariant();
        if (normalized == "active")
        {
            crisis.IsActive = true;
        }
        else if (normalized == "paused")
        {
            crisis.IsActive = false;
            crisis.EndDate = DateTime.UtcNow.AddDays(30);
        }
        else if (normalized == "completed" || normalized == "closed")
        {
            crisis.IsActive = false;
            crisis.EndDate = DateTime.UtcNow;
        }
        else
        {
            return Result<FundingCampaignDto>.Failure($"Unsupported campaign status '{dto.Status}'.");
        }

        crisis.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        var campaigns = await GetCampaignsAsync(cancellationToken);
        var updated = campaigns.Data?.FirstOrDefault(c => c.CrisisEventId == crisis.Id);
        return Result<FundingCampaignDto>.Success(updated!, $"Campaign status updated to {dto.Status}.");
    }

    public async Task<Result<AllocationOverviewDto>> GetAllocationOverviewAsync(CancellationToken cancellationToken = default)
    {
        var donations = await _context.Donations
            .AsNoTracking()
            .Include(d => d.CrisisEvent)
            .ToListAsync(cancellationToken);

        var resourceAllocations = await _context.ResourceAllocations
            .AsNoTracking()
            .Include(a => a.Resource)
            .Include(a => a.Shelter)
            .Include(a => a.AssistanceRequest)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync(cancellationToken);

        var totalVerifiedMonetary = donations
            .Where(d => d.DonationType == 0 && d.Status >= 1 && d.Amount.HasValue)
            .Sum(d => d.Amount!.Value);

        var totalAllocatedMonetary = donations
            .Where(d => d.DonationType == 0 && d.Status >= 2 && d.Amount.HasValue)
            .Sum(d => d.Amount!.Value);

        var totalDispatchedMonetary = donations
            .Where(d => d.DonationType == 0 && d.Status == 3 && d.Amount.HasValue)
            .Sum(d => d.Amount!.Value);

        var list = new List<FundingAllocationDto>();

        foreach (var d in donations.Where(d => d.Status >= 1).OrderByDescending(d => d.UpdatedAt ?? d.CreatedAt))
        {
            var code = FormatDonationCode(d.Id);
            list.Add(new FundingAllocationDto
            {
                Id = code,
                AllocationCode = $"ALC-{d.Id.ToString("N")[..6].ToUpperInvariant()}",
                SourceReference = $"{code} ({d.DonorName})",
                TargetHubOrDepot = d.TargetDistrict ?? d.CrisisEvent?.Title ?? "Unassigned Relief Hub",
                Purpose = d.ItemDescription ?? (d.DonationType == 0 ? "Monetary relief grant" : "Material relief batch"),
                Amount = d.DonationType == 0 ? (d.Amount ?? 0) : (d.ItemQuantity ?? 0),
                UtilizedAmount = d.Status == 3 ? (d.DonationType == 0 ? (d.Amount ?? 0) : (d.ItemQuantity ?? 0)) : 0,
                Currency = d.DonationType == 0 ? (d.Currency ?? "LKR") : "Units",
                Status = d.Status switch
                {
                    1 => "Pending Dual Approval",
                    2 => "Approved",
                    3 => "Dispatched",
                    _ => "Pending Dual Approval"
                },
                RequiresDualApproval = d.Status == 1,
                CoSignedBy = d.Status >= 2 ? (d.VerifiedBy ?? "Funding Officer") : string.Empty,
                CoSignedAt = d.Status >= 2 ? (d.UpdatedAt ?? d.ReceivedAt ?? d.CreatedAt).ToString("yyyy-MM-dd HH:mm") : string.Empty,
                AuthorizedNote = d.LastModifiedBy ?? "Verified contribution ready for allocation.",
                CreatedAt = d.CreatedAt
            });
        }

        foreach (var ra in resourceAllocations)
        {
            list.Add(new FundingAllocationDto
            {
                Id = ra.Id.ToString(),
                AllocationCode = $"RES-{ra.Id.ToString("N")[..4].ToUpperInvariant()}",
                SourceReference = ra.Resource?.Name ?? "Central Inventory",
                TargetHubOrDepot = ra.Shelter?.Name ?? (ra.AssistanceRequest != null ? $"Request {ra.AssistanceRequest.Id.ToString("N")[..6].ToUpperInvariant()}" : "Field Hub"),
                Purpose = ra.Notes ?? "Material supply dispatch",
                Amount = ra.Quantity,
                UtilizedAmount = ra.DispatchStatus >= 2 ? ra.Quantity : 0,
                Currency = ra.Resource?.Unit ?? "Units",
                Status = ra.DispatchStatus switch
                {
                    0 => "Pending Dual Approval",
                    1 => "Approved",
                    2 => "Dispatched",
                    _ => "Delivered"
                },
                RequiresDualApproval = ra.DispatchStatus == 0,
                CoSignedBy = ra.LastModifiedBy ?? string.Empty,
                CoSignedAt = ra.DispatchedAt?.ToString("yyyy-MM-dd HH:mm") ?? string.Empty,
                AuthorizedNote = ra.Notes ?? string.Empty,
                CreatedAt = ra.CreatedAt
            });
        }

        var overview = new AllocationOverviewDto
        {
            TotalVerifiedMonetary = totalVerifiedMonetary,
            TotalAllocatedMonetary = totalAllocatedMonetary,
            AvailableUnallocatedMonetary = Math.Max(0m, totalVerifiedMonetary - totalAllocatedMonetary),
            TotalDispatchedMonetary = totalDispatchedMonetary,
            HasExpenditureTracking = false,
            Allocations = list
        };

        return Result<AllocationOverviewDto>.Success(overview);
    }

    public async Task<Result<IReadOnlyList<FundingAllocationDto>>> GetAllocationsAsync(CancellationToken cancellationToken = default)
    {
        var overview = await GetAllocationOverviewAsync(cancellationToken);
        return Result<IReadOnlyList<FundingAllocationDto>>.Success(overview.Data?.Allocations ?? new List<FundingAllocationDto>());
    }

    public async Task<Result<FundingAllocationDto>> CreateAllocationAsync(
        CreateFundingAllocationDto dto,
        string? officerName,
        CancellationToken cancellationToken = default)
    {
        var overview = await GetAllocationOverviewAsync(cancellationToken);
        var available = overview.Data?.AvailableUnallocatedMonetary ?? 0m;

        var donation = await FindDonationByIdOrCodeAsync(dto.SourceReference, cancellationToken);
        if (donation == null)
        {
            return Result<FundingAllocationDto>.Failure($"Verified source donation '{dto.SourceReference}' was not found.");
        }

        if (donation.Status < 1)
        {
            return Result<FundingAllocationDto>.Failure("Only Verified donations can be allocated.");
        }

        if (donation.Status >= 2)
        {
            return Result<FundingAllocationDto>.Failure($"Donation '{dto.SourceReference}' is already {(donation.Status == 2 ? "Allocated" : "Dispatched")}.");
        }

        if (donation.DonationType == 0 && dto.Amount > available)
        {
            return Result<FundingAllocationDto>.Failure($"Cannot allocate LKR {dto.Amount:N0}: exceeds available verified unallocated balance (LKR {available:N0}).");
        }

        var officer = string.IsNullOrWhiteSpace(officerName) ? "Funding Officer" : officerName;
        donation.Status = 2;
        donation.TargetDistrict = dto.TargetHubOrDepot.Trim();
        donation.VerifiedBy = officer;
        donation.LastModifiedBy = $"{officer} (allocated): {dto.Purpose.Trim()} — {dto.AuthorizedNote}".Trim();
        donation.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        var updatedList = await GetAllocationsAsync(cancellationToken);
        var created = updatedList.Data?.FirstOrDefault(a => a.Id == FormatDonationCode(donation.Id));
        return Result<FundingAllocationDto>.Success(created!, $"Allocation for {FormatDonationCode(donation.Id)} approved.");
    }

    public async Task<Result<FundingAllocationDto>> ApproveAllocationAsync(
        string id,
        ApproveFundingAllocationDto dto,
        string? officerName,
        CancellationToken cancellationToken = default)
    {
        var officer = string.IsNullOrWhiteSpace(officerName) ? "Funding Officer" : officerName;
        var coSigner = string.IsNullOrWhiteSpace(dto.SecondarySignature)
            ? officer
            : $"{officer} & {dto.SecondarySignature.Trim()}";

        var donation = await FindDonationByIdOrCodeAsync(id, cancellationToken);
        if (donation != null)
        {
            if (donation.Status < 1)
            {
                return Result<FundingAllocationDto>.Failure("Donation must be Verified before allocation approval.");
            }
            if (donation.Status >= 2)
            {
                if (donation.Status == 2)
                {
                    donation.Status = 3;
                    donation.LastModifiedBy = $"{coSigner} (dispatched): {dto.AuthorizedNote}";
                    donation.UpdatedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync(cancellationToken);
                }
                else
                {
                    return Result<FundingAllocationDto>.Failure($"Allocation '{id}' is already Dispatched.");
                }
            }
            else
            {
                donation.Status = 2;
                donation.VerifiedBy = coSigner;
                donation.LastModifiedBy = $"{coSigner} (dual-approved): {dto.AuthorizedNote}";
                donation.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync(cancellationToken);
            }

            var list = await GetAllocationsAsync(cancellationToken);
            var updated = list.Data?.FirstOrDefault(a => a.Id == FormatDonationCode(donation.Id));
            return Result<FundingAllocationDto>.Success(updated!, $"Allocation {FormatDonationCode(donation.Id)} co-signed and updated.");
        }

        if (Guid.TryParse(id, out var raGuid))
        {
            var ra = await _context.ResourceAllocations.FirstOrDefaultAsync(r => r.Id == raGuid, cancellationToken);
            if (ra != null)
            {
                ra.DispatchStatus = ra.DispatchStatus == 0 ? 1 : 2;
                if (ra.DispatchStatus == 2) ra.DispatchedAt = DateTime.UtcNow;
                ra.LastModifiedBy = coSigner;
                ra.Notes = string.IsNullOrWhiteSpace(ra.Notes) ? dto.AuthorizedNote : $"{ra.Notes} | {dto.AuthorizedNote}";
                ra.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync(cancellationToken);

                var list = await GetAllocationsAsync(cancellationToken);
                var updated = list.Data?.FirstOrDefault(a => a.Id == ra.Id.ToString());
                return Result<FundingAllocationDto>.Success(updated!, "Resource allocation co-signed and updated.");
            }
        }

        return Result<FundingAllocationDto>.Failure($"Allocation '{id}' not found.");
    }

    public async Task<Result<IReadOnlyList<SuspiciousFlagDto>>> GetSuspiciousFlagsAsync(CancellationToken cancellationToken = default)
    {
        var donations = await _context.Donations
            .AsNoTracking()
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync(cancellationToken);

        return Result<IReadOnlyList<SuspiciousFlagDto>>.Success(BuildFlagsFromDonations(donations));
    }

    public async Task<Result<SuspiciousFlagDto>> ResolveSuspiciousFlagAsync(
        string id,
        ResolveSuspiciousFlagDto dto,
        string? officerName,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.ResolutionNotes))
        {
            return Result<SuspiciousFlagDto>.Failure("A human decision reason is mandatory.");
        }

        var donations = await _context.Donations.ToListAsync(cancellationToken);
        var donation = donations.FirstOrDefault(d =>
            $"FLG-{d.Id.ToString("N")[..4].ToUpperInvariant()}".Equals(id, StringComparison.OrdinalIgnoreCase)
            || FormatDonationCode(d.Id).Equals(id, StringComparison.OrdinalIgnoreCase)
            || (Guid.TryParse(id, out var g) && d.Id == g));

        if (donation == null)
        {
            return Result<SuspiciousFlagDto>.Failure($"Flagged record '{id}' was not found.");
        }

        var officer = string.IsNullOrWhiteSpace(officerName) ? "Funding Officer" : officerName;
        var action = dto.Action.Trim().ToLowerInvariant();

        switch (action)
        {
            case "clear":
                donation.Status = Math.Max(1, donation.Status);
                donation.AuditHash = "[CLEARED]";
                donation.ReceivedAt ??= DateTime.UtcNow;
                break;

            case "investigate":
                donation.Status = 0;
                donation.AuditHash = "[INVESTIGATING]";
                break;

            case "escalate":
                donation.Status = 0;
                donation.AuditHash = "[ESCALATED]";
                break;

            case "reject":
                donation.Status = -1;
                donation.AuditHash = "[REJECTED]";
                break;

            default:
                return Result<SuspiciousFlagDto>.Failure($"Unsupported flag decision '{dto.Action}'.");
        }

        donation.VerifiedBy = officer;
        donation.LastModifiedBy = $"{officer} ({action}): {dto.ResolutionNotes.Trim()}";
        donation.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        var updatedFlag = BuildFlagsFromDonations(new[] { donation }).FirstOrDefault()
            ?? new SuspiciousFlagDto
            {
                Id = $"FLG-{donation.Id.ToString("N")[..4].ToUpperInvariant()}",
                RecordId = FormatDonationCode(donation.Id),
                DonationGuid = donation.Id,
                DonorOrg = donation.DonorName,
                Status = action == "clear" ? "Cleared" : action == "reject" ? "Rejected" : action == "escalate" ? "Escalated" : "Under Investigation",
                DecisionReason = donation.LastModifiedBy,
                ResolvedBy = officer,
                ResolvedAt = DateTime.UtcNow
            };

        return Result<SuspiciousFlagDto>.Success(updatedFlag, $"Human decision '{updatedFlag.Status}' recorded for {updatedFlag.RecordId}.");
    }

    public async Task<Result<TransparencyReportDto>> GetTransparencyReportAsync(
        string? search = null,
        string? crisisId = null,
        string? status = null,
        DateTime? fromDate = null,
        DateTime? toDate = null,
        CancellationToken cancellationToken = default)
    {
        var donations = await _context.Donations
            .AsNoTracking()
            .Include(d => d.CrisisEvent)
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync(cancellationToken);

        IEnumerable<Donation> filtered = donations;

        if (!string.IsNullOrWhiteSpace(crisisId) && !crisisId.Equals("all", StringComparison.OrdinalIgnoreCase))
        {
            if (Guid.TryParse(crisisId, out var cGuid))
            {
                filtered = filtered.Where(d => d.CrisisEventId == cGuid);
            }
            else
            {
                filtered = filtered.Where(d =>
                    (d.CrisisEvent != null && d.CrisisEvent.Title.Contains(crisisId, StringComparison.OrdinalIgnoreCase)) ||
                    (d.TargetDistrict != null && d.TargetDistrict.Contains(crisisId, StringComparison.OrdinalIgnoreCase)));
            }
        }

        if (fromDate.HasValue)
        {
            filtered = filtered.Where(d => d.CreatedAt >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            filtered = filtered.Where(d => d.CreatedAt <= toDate.Value.AddDays(1));
        }

        var mapped = filtered.Select(MapDonationToRecordDto).AsEnumerable();

        if (!string.IsNullOrWhiteSpace(status) && !status.Equals("all", StringComparison.OrdinalIgnoreCase))
        {
            mapped = mapped.Where(r => r.Status.Equals(status, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var q = search.Trim().ToLowerInvariant();
            mapped = mapped.Where(r =>
                r.Id.ToLowerInvariant().Contains(q) ||
                r.DonorOrg.ToLowerInvariant().Contains(q) ||
                r.Source.ToLowerInvariant().Contains(q) ||
                r.AllocationTarget.ToLowerInvariant().Contains(q));
        }

        var finalRecords = mapped.ToList();
        var campaigns = (await GetCampaignsAsync(cancellationToken)).Data?.ToList() ?? new List<FundingCampaignDto>();
        var allocations = (await GetAllocationsAsync(cancellationToken)).Data?.ToList() ?? new List<FundingAllocationDto>();

        var report = new TransparencyReportDto
        {
            TotalVerifiedMonetary = finalRecords.Where(r => r.Type == "Monetary" && (r.Status == "Verified" || r.Status == "Allocated" || r.Status == "Dispatched")).Sum(r => r.RawValue),
            TotalPendingMonetary = finalRecords.Where(r => r.Type == "Monetary" && (r.Status == "Pending" || r.Status == "Flagged")).Sum(r => r.RawValue),
            TotalMaterialUnits = (int)finalRecords.Where(r => r.Type == "Material" && r.Status != "Rejected").Sum(r => r.RawValue),
            VerifiedCount = finalRecords.Count(r => r.Status == "Verified" || r.Status == "Allocated" || r.Status == "Dispatched"),
            PendingCount = finalRecords.Count(r => r.Status == "Pending" || r.Status == "Flagged"),
            RejectedCount = finalRecords.Count(r => r.Status == "Rejected"),
            AllocatedCount = finalRecords.Count(r => r.Status == "Allocated"),
            DispatchedCount = finalRecords.Count(r => r.Status == "Dispatched"),
            TotalAllocatedAmount = finalRecords.Where(r => r.Type == "Monetary" && (r.Status == "Allocated" || r.Status == "Dispatched")).Sum(r => r.RawValue),
            HasExpenditureTracking = false,
            CampaignSummaries = campaigns,
            AllocationSummaries = allocations,
            Records = finalRecords
        };

        return Result<TransparencyReportDto>.Success(report);
    }
}
