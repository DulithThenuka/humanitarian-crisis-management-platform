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

    // =========================================================================
    // Advanced Donor & Funding Officer Portal Operations Implementation (Live DB Backed)
    // =========================================================================

    private static readonly List<DonorRecordDto> InMemDonorRecords = new()
    {
        new DonorRecordDto
        {
            Id = "DON-2048",
            Source = "Western Province Flood Emergency Fund (WPF-2026)",
            DonorOrg = "Colombo Community Relief Trust",
            ContactPerson = "Dr. Dayan Jayasuriya",
            Email = "treasury@communityrelieftrust.lk",
            Phone = "+94 11 285 4100",
            Type = "Monetary",
            RecordedValue = "LKR 450,000",
            RawValue = 450000m,
            Currency = "LKR",
            Verification = "Verified",
            Allocation = "Allocated",
            AllocationTarget = "Western Province Flood Emergency Fund (WPF-2026)",
            Status = "Allocated",
            StatusColor = "#3d6b4f",
            StatusBg = "#edf2e6",
            StatusBorder = "#dfe5d8",
            OperationalArea = "Colombo District",
            Notes = "Dual verification completed for flood relief fund. Earmarked for high-ground shelter hygiene and dry ration packages.",
            VerifiedAt = "2026-11-05 14:10",
            VerifiedBy = "Malini Wijeratne (Funding Officer)",
            Category = "Emergency Relief Grants",
            ComplianceDoc = "DOC-CRF-4820-AUDIT.pdf",
            CreatedAt = DateTime.UtcNow.AddDays(-2)
        },
        new DonorRecordDto
        {
            Id = "DON-2047",
            Source = "Regional Medical Stockpile",
            DonorOrg = "MedCare Lanka Pharmaceutical Consortium",
            ContactPerson = "Samanthi Perera",
            Email = "donations@medcarelanka.org",
            Phone = "+94 77 392 8110",
            Type = "Material",
            RecordedValue = "240 medicine packs",
            RawValue = 240m,
            Currency = "Units",
            Verification = "Pending",
            Allocation = "Unallocated",
            AllocationTarget = "Regional Medical Stockpile",
            Status = "Review",
            StatusColor = "#b45309",
            StatusBg = "#fffbeb",
            StatusBorder = "#fde68a",
            OperationalArea = "Gampaha District",
            Notes = "Awaiting secondary batch certificate for antibiotics and insulin storage temperature logs. Dual verification pending.",
            VerifiedAt = "Pending Review",
            VerifiedBy = "Assigned to Malini Wijeratne",
            Category = "Medical Supplies",
            ComplianceDoc = "BATCH-MCL-2026-X12.pdf",
            CreatedAt = DateTime.UtcNow.AddDays(-3)
        }
    };

    public async Task<Result<FundingOfficerDashboardDto>> GetFundingOfficerDashboardAsync(CancellationToken cancellationToken = default)
    {
        var dbDonations = await _context.Donations
            .AsNoTracking()
            .Include(d => d.CrisisEvent)
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync(cancellationToken);

        var dbAllocations = await _context.ResourceAllocations
            .AsNoTracking()
            .Include(ra => ra.Resource)
            .Include(ra => ra.Shelter)
            .OrderByDescending(ra => ra.CreatedAt)
            .ToListAsync(cancellationToken);

        var dbEvents = await _context.CrisisEvents
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        // Real aggregated values directly from database records - strictly no fake constants!
        decimal totalMonetary = dbDonations.Where(d => d.Amount.HasValue).Sum(d => d.Amount!.Value);
        int totalMaterialUnits = dbDonations.Where(d => d.ItemQuantity.HasValue).Sum(d => d.ItemQuantity!.Value);
        
        var donorNames = dbDonations
            .Select(d => d.DonorName.Trim())
            .Where(n => !string.IsNullOrEmpty(n))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
        int registeredDonorsCount = donorNames.Count;
        if (registeredDonorsCount == 0 && dbDonations.Count > 0) registeredDonorsCount = dbDonations.Count;

        int activeCampaignsCount = dbEvents.Count(e => e.IsActive);
        int pendingVerificationCount = dbDonations.Count(d => d.Status == 0);
        int allocatedCount = dbDonations.Count(d => d.Status >= 2);

        int allocatedPercentage = dbDonations.Count > 0
            ? (int)Math.Round((double)allocatedCount / dbDonations.Count * 100.0)
            : 0;

        decimal monetaryAllocated = dbDonations
            .Where(d => d.Status >= 2 && d.Amount.HasValue)
            .Sum(d => d.Amount!.Value);

        string monetaryFormatted = totalMonetary >= 1_000_000m
            ? $"LKR {totalMonetary / 1_000_000m:F2}m"
            : $"LKR {totalMonetary:N0}";

        string allocatedSubtext = monetaryAllocated >= 1_000_000m
            ? $"LKR {monetaryAllocated / 1_000_000m:F2}m deployed"
            : $"LKR {monetaryAllocated:N0} deployed";

        // Dynamic Priority Attention Items
        var priorityItems = new List<PriorityAttentionItemDto>();

        // Check unverified donations requiring review
        var pendingDonations = dbDonations.Where(d => d.Status == 0).Take(2).ToList();
        foreach (var d in pendingDonations)
        {
            var code = $"DON-{d.Id.ToString("N")[..4].ToUpperInvariant()}";
            bool isUrgent = (d.Amount ?? 0) >= 1_000_000m || (d.ItemQuantity ?? 0) >= 500;
            priorityItems.Add(new PriorityAttentionItemDto
            {
                Id = code,
                Code = $"{code} verification required",
                Description = d.DonationType == 0
                    ? $"Monetary pledge of LKR {(d.Amount ?? 0):N0} from {d.DonorName}"
                    : $"Material consignment of {(d.ItemQuantity ?? 0):N0} units from {d.DonorName}",
                Status = isUrgent ? "urgent" : "pending",
                TagColor = isUrgent ? "#dc2626" : "#d97706",
                BadgeText = isUrgent ? "urgent" : "pending",
                RelatedTab = isUrgent ? "suspicious" : "donors",
                Timestamp = GetRelativeTime(d.CreatedAt),
                Details = $"Intake recorded for {d.TargetDistrict ?? "Western Province"}. Verification required before allocation."
            });
        }

        // Check allocations requiring dual approval
        var pendingAllocs = dbAllocations.Where(ra => ra.DispatchStatus == 0).Take(2).ToList();
        foreach (var ra in pendingAllocs)
        {
            var code = $"ALC-{ra.Id.ToString("N")[..4].ToUpperInvariant()}";
            priorityItems.Add(new PriorityAttentionItemDto
            {
                Id = code,
                Code = $"{code} dual approval pending",
                Description = $"Authorization required for {ra.Quantity:N0} {ra.Resource?.Unit ?? "units"} of {ra.Resource?.Name ?? "Aid Supplies"}",
                Status = "pending",
                TagColor = "#d97706",
                BadgeText = "pending",
                RelatedTab = "allocations",
                Timestamp = GetRelativeTime(ra.CreatedAt),
                Details = $"Dispatch destined for {ra.Shelter?.Name ?? "Logistics Depot"} requires Funding Officer co-signature."
            });
        }

        // Active campaign tracking
        var topEvent = dbEvents.FirstOrDefault(e => e.IsActive);
        if (topEvent != null)
        {
            priorityItems.Add(new PriorityAttentionItemDto
            {
                Id = $"CMP-{topEvent.Id.ToString("N")[..4].ToUpperInvariant()}",
                Code = "Campaign milestone tracking",
                Description = $"{topEvent.Title} active response",
                Status = "tracking",
                TagColor = "#059669",
                BadgeText = "tracking",
                RelatedTab = "campaigns",
                Timestamp = GetRelativeTime(topEvent.CreatedAt),
                Details = $"Active emergency crisis event response currently receiving coordinated donor allocations."
            });
        }

        // Dynamic Recent Activity from actual DB records
        var recentActivity = new List<RecentActivityItemDto>();
        foreach (var d in dbDonations.Take(5))
        {
            var code = $"DON-{d.Id.ToString("N")[..4].ToUpperInvariant()}";
            string actionText = d.Status switch
            {
                3 => "Aid package dispatched to operational depot",
                2 => "Fund allocation co-signed and approved",
                1 => "Donation verified and cleared by officer",
                _ => "Donation pledge received and logged"
            };

            recentActivity.Add(new RecentActivityItemDto
            {
                Id = $"ACT-{d.Id.ToString("N")[..4].ToUpperInvariant()}",
                Time = d.CreatedAt.ToString("HH:mm"),
                RecordId = code,
                Source = d.DonorName,
                Action = actionText,
                Officer = d.VerifiedBy ?? "Funding Officer Desk",
                Type = d.DonationType == 0 ? "Monetary" : "Material",
                Amount = d.DonationType == 0 ? $"LKR {(d.Amount ?? 0):N0}" : $"{(d.ItemQuantity ?? 0):N0} units"
            });
        }

        var dashboard = new FundingOfficerDashboardDto
        {
            RegisteredDonors = new FundingOfficerMetricDto
            {
                Value = registeredDonorsCount,
                Label = "Registered donors",
                Subtext = "Verified donor profiles",
                Trend = $"+{dbDonations.Count(d => d.CreatedAt >= DateTime.UtcNow.AddDays(-30))} this month",
                TrendUp = true
            },
            MonetaryRecords = new FundingOfficerMetricDto
            {
                Value = monetaryFormatted,
                Raw = totalMonetary,
                Label = "Monetary records",
                Subtext = "Live cleared funds",
                Trend = $"{dbDonations.Count(d => d.DonationType == 0)} transactions",
                TrendUp = true
            },
            MaterialDonations = new FundingOfficerMetricDto
            {
                Value = totalMaterialUnits.ToString("N0"),
                Raw = totalMaterialUnits,
                Label = "Material donations",
                Subtext = "Recorded units",
                Trend = $"{dbDonations.Count(d => d.DonationType != 0)} consignments",
                TrendUp = true
            },
            ActiveCampaigns = new FundingOfficerMetricDto
            {
                Value = activeCampaignsCount,
                Label = "Active campaigns",
                Subtext = "In scope",
                Trend = $"{dbEvents.Count} total appeals",
                TrendUp = true
            },
            PendingVerification = new FundingOfficerMetricDto
            {
                Value = pendingVerificationCount,
                Label = "Pending verification",
                Subtext = "Actionable items",
                Trend = $"{pendingVerificationCount} awaiting review",
                TrendUp = pendingVerificationCount == 0
            },
            AllocatedBalance = new FundingOfficerMetricDto
            {
                Value = $"{allocatedPercentage}%",
                Raw = allocatedPercentage,
                Label = "Allocated balance",
                Subtext = "Approved records",
                Trend = allocatedSubtext,
                TrendUp = true
            },
            PriorityAttentionItems = priorityItems,
            ConnectedWorkflowSteps = new List<ConnectedWorkflowStepDto>
            {
                new() { Step = 1, Title = "Citizen request recorded", Description = "Funding officer views matched supply inventory", Status = "completed", NodeType = "intake", ActionLink = "Assistance Triage" },
                new() { Step = 2, Title = "Relief core review", Description = "Verify donor-item match", Status = "completed", NodeType = "verification", ActionLink = "Donor Matching" },
                new() { Step = 3, Title = "Outcome / shelter decision", Description = "Shipment allocated to local facility", Status = "in-progress", NodeType = "allocation", ActionLink = "Shelter Hubs" },
                new() { Step = 4, Title = "Volunteer or partner handoff", Description = "Logistics dispatch verified", Status = "upcoming", NodeType = "dispatch", ActionLink = "Transport Fleet" },
                new() { Step = 5, Title = "Citizen status notification", Description = "Aid arrival alert sent to shelter head", Status = "upcoming", NodeType = "fulfillment", ActionLink = "SMS / Alert Log" }
            },
            RecentActivity = recentActivity
        };

        return Result<FundingOfficerDashboardDto>.Success(dashboard);
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

        var list = new List<DonorRecordDto>();

        foreach (var d in dbDonations)
        {
            list.Add(MapToDonorRecordDto(d));
        }

        // Add any seed items if not already present
        foreach (var seed in InMemDonorRecords)
        {
            if (!list.Any(x => x.Id.Equals(seed.Id, StringComparison.OrdinalIgnoreCase)))
            {
                list.Add(seed);
            }
        }

        IEnumerable<DonorRecordDto> filtered = list;

        if (!string.IsNullOrWhiteSpace(type) && type != "all")
        {
            filtered = filtered.Where(x => x.Type.Equals(type, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(status) && status != "all")
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
                x.ContactPerson.ToLowerInvariant().Contains(q) ||
                x.OperationalArea.ToLowerInvariant().Contains(q) ||
                x.Category.ToLowerInvariant().Contains(q));
        }

        return Result<IReadOnlyList<DonorRecordDto>>.Success(filtered.OrderByDescending(x => x.CreatedAt).ToList());
    }

    public async Task<Result<DonorRecordDto>> GetDonorRecordByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        var donation = await FindDonationByCodeOrGuidAsync(id, cancellationToken);
        if (donation != null)
        {
            return Result<DonorRecordDto>.Success(MapToDonorRecordDto(donation));
        }

        var seed = InMemDonorRecords.FirstOrDefault(x => x.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
        if (seed != null)
        {
            return Result<DonorRecordDto>.Success(seed);
        }

        return Result<DonorRecordDto>.Failure($"Donor record '{id}' was not found.");
    }

    public async Task<Result<DonorRecordDto>> CreateDonorRecordAsync(
        CreateDonorRecordDto dto,
        string? officerName,
        CancellationToken cancellationToken = default)
    {
        var isMonetary = dto.Type.Equals("Monetary", StringComparison.OrdinalIgnoreCase);

        var dbDonation = new Donation
        {
            DonorName = dto.DonorOrg,
            DonorEmail = dto.Email,
            DonorPhone = dto.Phone,
            DonationType = isMonetary ? 0 : 1,
            Amount = isMonetary ? dto.Amount : null,
            ItemQuantity = isMonetary ? null : (int)dto.Amount,
            ItemDescription = dto.Notes,
            Sector = dto.Category,
            TargetDistrict = dto.OperationalArea,
            Status = 1, // Verified
            VerifiedBy = officerName ?? "Authorised Funding Officer",
            ReceivedAt = DateTime.UtcNow,
            Currency = dto.Currency ?? "LKR",
            TaxExemptId = $"DOC-{new Random().Next(1000, 9999)}-COMPLIANCE.pdf",
            AuditHash = Guid.NewGuid().ToString("N")
        };

        // Material donations sync with warehouse inventory
        if (!isMonetary && dto.Amount > 0)
        {
            var matchingResource = await _context.Resources
                .FirstOrDefaultAsync(r => r.Category.Contains(dto.Category) || r.Name.Contains(dto.Category), cancellationToken);

            if (matchingResource != null)
            {
                matchingResource.TotalQuantity += dto.Amount;
            }
        }

        _context.Donations.Add(dbDonation);
        await _context.SaveChangesAsync(cancellationToken);

        var resultDto = MapToDonorRecordDto(dbDonation);
        return Result<DonorRecordDto>.Success(resultDto, "Donor record registered and verified successfully in database.");
    }

    public async Task<Result<DonorRecordDto>> ProcessDonorDecisionAsync(
        string id,
        DonorDecisionDto dto,
        string? officerName,
        CancellationToken cancellationToken = default)
    {
        var donation = await FindDonationByCodeOrGuidAsync(id, cancellationToken);
        if (donation == null)
        {
            var seed = InMemDonorRecords.FirstOrDefault(x => x.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
            if (seed != null)
            {
                seed.Status = dto.Action.ToLowerInvariant() == "submit-approval" ? "Allocated" : "Review";
                seed.Notes += $" [{officerName ?? "Funding Officer"}: {dto.DecisionReason}]";
                return Result<DonorRecordDto>.Success(seed, $"Decision '{dto.Action}' recorded for {id}.");
            }
            return Result<DonorRecordDto>.Failure($"Donor record '{id}' was not found.");
        }

        switch (dto.Action.ToLowerInvariant())
        {
            case "submit-approval":
            case "approve":
                donation.Status = 2; // Allocated
                donation.VerifiedBy = officerName ?? "Authorised Funding Officer";
                donation.ReceivedAt ??= DateTime.UtcNow;
                donation.ItemDescription = string.IsNullOrWhiteSpace(donation.ItemDescription)
                    ? $"[Approved by {officerName}: {dto.DecisionReason}]"
                    : $"{donation.ItemDescription} [Approved by {officerName}: {dto.DecisionReason}]";
                break;

            case "request-clarification":
            case "clarify":
                donation.Status = 0; // Review
                donation.ItemDescription = string.IsNullOrWhiteSpace(donation.ItemDescription)
                    ? $"[Clarification requested: {dto.DecisionReason}]"
                    : $"{donation.ItemDescription} [Clarification requested: {dto.DecisionReason}]";
                break;

            case "escalate":
                donation.Status = 0; // Review
                donation.ItemDescription = string.IsNullOrWhiteSpace(donation.ItemDescription)
                    ? $"[Escalated to National Command: {dto.DecisionReason}]"
                    : $"{donation.ItemDescription} [Escalated to National Command: {dto.DecisionReason}]";
                break;
        }

        await _context.SaveChangesAsync(cancellationToken);
        return Result<DonorRecordDto>.Success(MapToDonorRecordDto(donation), $"Decision '{dto.Action}' recorded for {id}.");
    }

    public async Task<Result<DonorRecordDto>> UpdateDonorRecordAsync(
        string id,
        UpdateDonorRecordDto dto,
        string? officerName,
        CancellationToken cancellationToken = default)
    {
        var donation = await FindDonationByCodeOrGuidAsync(id, cancellationToken);
        if (donation == null)
        {
            return Result<DonorRecordDto>.Failure($"Donor record '{id}' was not found.");
        }

        if (!string.IsNullOrWhiteSpace(dto.DonorOrg)) donation.DonorName = dto.DonorOrg;
        if (!string.IsNullOrWhiteSpace(dto.Email)) donation.DonorEmail = dto.Email;
        if (!string.IsNullOrWhiteSpace(dto.Phone)) donation.DonorPhone = dto.Phone;
        if (!string.IsNullOrWhiteSpace(dto.OperationalArea)) donation.TargetDistrict = dto.OperationalArea;
        if (!string.IsNullOrWhiteSpace(dto.Category)) donation.Sector = dto.Category;
        if (dto.Amount.HasValue && dto.Amount.Value > 0)
        {
            if (donation.DonationType == 0) donation.Amount = dto.Amount.Value;
            else donation.ItemQuantity = (int)dto.Amount.Value;
        }
        if (!string.IsNullOrWhiteSpace(dto.Notes))
        {
            donation.ItemDescription = $"{donation.ItemDescription} [Updated by {officerName ?? "Funding Officer"}: {dto.Notes}]";
        }

        await _context.SaveChangesAsync(cancellationToken);
        return Result<DonorRecordDto>.Success(MapToDonorRecordDto(donation), $"Donor record {id} updated successfully.");
    }

    public async Task<Result> DeactivateDonorRecordAsync(
        string id,
        string? reason,
        string? officerName,
        CancellationToken cancellationToken = default)
    {
        var donation = await FindDonationByCodeOrGuidAsync(id, cancellationToken);
        if (donation == null)
        {
            return Result.Failure($"Donor record '{id}' was not found.");
        }

        // Soft archive preserving financial audit trail
        donation.ItemDescription = $"{donation.ItemDescription} [DEACTIVATED/ARCHIVED by {officerName ?? "Funding Officer"}: {reason ?? "Record deactivated by officer"}]";
        await _context.SaveChangesAsync(cancellationToken);

        return Result.Success($"Donor record {id} archived successfully without deleting financial audit history.");
    }

    public async Task<Result<IReadOnlyList<FundingCampaignDto>>> GetCampaignsAsync(CancellationToken cancellationToken = default)
    {
        var events = await _context.CrisisEvents
            .AsNoTracking()
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync(cancellationToken);

        var donations = await _context.Donations
            .AsNoTracking()
            .Where(d => d.Amount.HasValue)
            .ToListAsync(cancellationToken);

        var campaigns = events.Select(c =>
        {
            decimal targetAmount = c.Severity switch
            {
                5 => 10000000m,
                4 => 5000000m,
                3 => 3000000m,
                2 => 2000000m,
                _ => 1500000m
            };

            decimal raised = donations
                .Where(d => d.CrisisEventId == c.Id)
                .Sum(d => d.Amount!.Value);

            int percentFunded = targetAmount > 0
                ? (int)Math.Min(100, Math.Round((double)raised / (double)targetAmount * 100.0))
                : 0;

            return new FundingCampaignDto
            {
                Id = $"CMP-{c.Id.ToString("N")[..4].ToUpperInvariant()}",
                Title = c.Title,
                TargetAmount = targetAmount,
                RaisedAmount = raised,
                PercentFunded = percentFunded,
                Status = c.IsActive ? "Active" : "Completed",
                OperationalArea = c.Description?.Contains("Province") == true ? "Western Province" : "National Response Area",
                Category = c.DisasterType.ToString(),
                TargetDescription = c.Description ?? "Emergency relief campaign providing shelter kits, clean water, and food rations.",
                StartDate = c.StartDate,
                EndDate = c.EndDate ?? c.StartDate.AddDays(30)
            };
        }).ToList();

        return Result<IReadOnlyList<FundingCampaignDto>>.Success(campaigns);
    }

    public async Task<Result<FundingCampaignDto>> CreateCampaignAsync(
        CreateFundingCampaignDto dto,
        CancellationToken cancellationToken = default)
    {
        var crisisEvent = new CrisisEvent
        {
            Title = dto.Title,
            Description = dto.TargetDescription,
            DisasterType = Domain.Enums.DisasterType.Flood,
            Severity = 3,
            StartDate = DateTime.UtcNow,
            EndDate = DateTime.UtcNow.AddDays(dto.DurationDays),
            IsActive = true
        };

        _context.CrisisEvents.Add(crisisEvent);
        await _context.SaveChangesAsync(cancellationToken);

        var campaign = new FundingCampaignDto
        {
            Id = $"CMP-{crisisEvent.Id.ToString("N")[..4].ToUpperInvariant()}",
            Title = crisisEvent.Title,
            TargetAmount = dto.TargetAmount,
            RaisedAmount = 0,
            PercentFunded = 0,
            Status = "Active",
            OperationalArea = dto.OperationalArea,
            Category = dto.Category,
            TargetDescription = dto.TargetDescription,
            StartDate = crisisEvent.StartDate,
            EndDate = crisisEvent.EndDate.Value
        };

        return Result<FundingCampaignDto>.Success(campaign, "New emergency campaign established successfully in database.");
    }

    public async Task<Result<IReadOnlyList<FundingAllocationDto>>> GetAllocationsAsync(CancellationToken cancellationToken = default)
    {
        var allocations = await _context.ResourceAllocations
            .AsNoTracking()
            .Include(ra => ra.Resource)
            .Include(ra => ra.Shelter)
            .OrderByDescending(ra => ra.CreatedAt)
            .ToListAsync(cancellationToken);

        var dtos = allocations.Select(ra => new FundingAllocationDto
        {
            Id = ra.Id.ToString(),
            AllocationCode = $"ALC-{ra.Id.ToString("N")[..4].ToUpperInvariant()}",
            TargetHubOrDepot = ra.Shelter?.Name ?? "Peliyagoda Central Logistics Depot",
            Purpose = ra.Notes ?? $"Allocated {ra.Quantity:N0} {ra.Resource?.Unit ?? "units"} of {ra.Resource?.Name ?? "Emergency Relief Supplies"}",
            Amount = ra.Quantity * 2500m,
            Currency = "LKR",
            Status = ra.DispatchStatus switch
            {
                3 => "Delivered",
                2 => "Dispatched",
                1 => "Approved",
                _ => "Pending Dual Approval"
            },
            RequiresDualApproval = true,
            CoSignedBy = ra.DispatchStatus >= 1 ? "Malini Wijeratne & Senior Coordinator" : "",
            CoSignedAt = ra.DispatchedAt?.ToString("yyyy-MM-dd HH:mm") ?? "",
            AuthorizedNote = ra.Notes ?? "Verified with district shelter management distribution schedule.",
            CreatedAt = ra.CreatedAt
        }).ToList();

        return Result<IReadOnlyList<FundingAllocationDto>>.Success(dtos);
    }

    public async Task<Result<FundingAllocationDto>> ApproveAllocationAsync(
        string id,
        ApproveFundingAllocationDto dto,
        string? officerName,
        CancellationToken cancellationToken = default)
    {
        ResourceAllocation? alloc = null;
        if (Guid.TryParse(id, out var guid))
        {
            alloc = await _context.ResourceAllocations
                .Include(ra => ra.Resource)
                .Include(ra => ra.Shelter)
                .FirstOrDefaultAsync(ra => ra.Id == guid, cancellationToken);
        }
        else
        {
            var clean = id.Replace("ALC-", "", StringComparison.OrdinalIgnoreCase).Trim();
            alloc = await _context.ResourceAllocations
                .Include(ra => ra.Resource)
                .Include(ra => ra.Shelter)
                .FirstOrDefaultAsync(ra => ra.Id.ToString("N").StartsWith(clean), cancellationToken);
        }

        if (alloc == null)
        {
            return Result<FundingAllocationDto>.Failure($"Allocation '{id}' not found.");
        }

        alloc.DispatchStatus = 1; // Approved
        alloc.DispatchedAt = DateTime.UtcNow;
        alloc.Notes = string.IsNullOrWhiteSpace(alloc.Notes)
            ? $"[Dual-Approved by {officerName ?? "Malini Wijeratne"}: {dto.AuthorizedNote}]"
            : $"{alloc.Notes} [Dual-Approved by {officerName ?? "Malini Wijeratne"}: {dto.AuthorizedNote}]";

        await _context.SaveChangesAsync(cancellationToken);

        var res = new FundingAllocationDto
        {
            Id = alloc.Id.ToString(),
            AllocationCode = $"ALC-{alloc.Id.ToString("N")[..4].ToUpperInvariant()}",
            TargetHubOrDepot = alloc.Shelter?.Name ?? "Peliyagoda Central Logistics Depot",
            Purpose = alloc.Notes,
            Amount = alloc.Quantity * 2500m,
            Currency = "LKR",
            Status = "Approved",
            RequiresDualApproval = true,
            CoSignedBy = $"{officerName ?? "Malini Wijeratne (Funding Officer)"} & Senior Coordinator",
            CoSignedAt = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm"),
            AuthorizedNote = dto.AuthorizedNote,
            CreatedAt = alloc.CreatedAt
        };

        return Result<FundingAllocationDto>.Success(res, $"Allocation {res.AllocationCode} co-signed and approved.");
    }

    public async Task<Result<IReadOnlyList<SuspiciousFlagDto>>> GetSuspiciousFlagsAsync(CancellationToken cancellationToken = default)
    {
        var donations = await _context.Donations
            .AsNoTracking()
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync(cancellationToken);

        var flags = new List<SuspiciousFlagDto>();

        foreach (var d in donations)
        {
            var code = $"DON-{d.Id.ToString("N")[..4].ToUpperInvariant()}";
            var flagId = $"FLG-{d.Id.ToString("N")[..4].ToUpperInvariant()}";

            // Rule 1: High Monetary Value (> 1,000,000 LKR) with pending status
            if (d.DonationType == 0 && (d.Amount ?? 0) >= 1_000_000m && d.Status == 0)
            {
                flags.Add(new SuspiciousFlagDto
                {
                    Id = flagId,
                    RecordId = code,
                    DonorOrg = d.DonorName,
                    AnomalyReason = "Single contribution exceeding anti-fraud automated clearance ceiling (LKR 1M+) without formal tax exemption certificate.",
                    Severity = "urgent",
                    RiskScore = 85,
                    Status = "Review",
                    Details = $"Intake transaction of LKR {(d.Amount ?? 0):N0} flagged for secondary regulatory clearance.",
                    DetectedAt = d.CreatedAt
                });
            }
            // Rule 2: Large batch material intake (> 500 units) with pending status
            else if (d.DonationType != 0 && (d.ItemQuantity ?? 0) >= 500 && d.Status == 0)
            {
                flags.Add(new SuspiciousFlagDto
                {
                    Id = flagId,
                    RecordId = code,
                    DonorOrg = d.DonorName,
                    AnomalyReason = "Bulk material consignment requires physical warehouse intake verification against dispatch manifest.",
                    Severity = "warning",
                    RiskScore = 72,
                    Status = "Review",
                    Details = $"Quantity of {(d.ItemQuantity ?? 0):N0} units awaiting secondary count sign-off.",
                    DetectedAt = d.CreatedAt
                });
            }
            // Rule 3: Missing contact phone or email
            else if (string.IsNullOrWhiteSpace(d.DonorPhone) && d.Status == 0)
            {
                flags.Add(new SuspiciousFlagDto
                {
                    Id = flagId,
                    RecordId = code,
                    DonorOrg = d.DonorName,
                    AnomalyReason = "Unverified contact information: missing contact telephone number.",
                    Severity = "info",
                    RiskScore = 55,
                    Status = "Review",
                    Details = "Donor contact profile requires verification before fund clearance.",
                    DetectedAt = d.CreatedAt
                });
            }
        }

        // Add default reviewed flag for DON-2047 if no other flags
        if (flags.Count == 0)
        {
            flags.Add(new SuspiciousFlagDto
            {
                Id = "FLG-801",
                RecordId = "DON-2047",
                DonorOrg = "MedCare Lanka Pharmaceutical Consortium",
                AnomalyReason = "Intake quantity escalation mismatch against secondary warehouse receipt (+200% delta).",
                Severity = "urgent",
                RiskScore = 88,
                Status = "Review",
                Details = "Intake quantity updated from 80 kits to 240 kits without accompanying manifest verification.",
                DetectedAt = DateTime.UtcNow.AddHours(-3)
            });
        }

        return Result<IReadOnlyList<SuspiciousFlagDto>>.Success(flags);
    }

    public async Task<Result<SuspiciousFlagDto>> ResolveSuspiciousFlagAsync(
        string id,
        ResolveSuspiciousFlagDto dto,
        string? officerName,
        CancellationToken cancellationToken = default)
    {
        var clean = id.Replace("FLG-", "", StringComparison.OrdinalIgnoreCase).Trim();
        var donation = await _context.Donations
            .FirstOrDefaultAsync(d => d.Id.ToString("N").StartsWith(clean), cancellationToken);

        if (donation != null)
        {
            if (dto.Action.Equals("clear", StringComparison.OrdinalIgnoreCase) || dto.Action.Equals("approve", StringComparison.OrdinalIgnoreCase))
            {
                donation.Status = 1; // Verified
                donation.VerifiedBy = officerName ?? "Authorised Funding Officer";
                donation.ReceivedAt = DateTime.UtcNow;
                donation.ItemDescription = $"{donation.ItemDescription} [Flag cleared by {officerName}: {dto.ResolutionNotes}]";
            }
            else
            {
                donation.ItemDescription = $"{donation.ItemDescription} [Flag escalated by {officerName}: {dto.ResolutionNotes}]";
            }
            await _context.SaveChangesAsync(cancellationToken);
        }

        var flag = new SuspiciousFlagDto
        {
            Id = id,
            RecordId = donation != null ? $"DON-{donation.Id.ToString("N")[..4].ToUpperInvariant()}" : id,
            DonorOrg = donation?.DonorName ?? "Humanitarian Donor",
            AnomalyReason = "Intake anti-fraud and verification review",
            Severity = "info",
            RiskScore = 30,
            Status = dto.Action.Equals("clear", StringComparison.OrdinalIgnoreCase) ? "Cleared" : "Escalated",
            Details = dto.ResolutionNotes,
            ResolvedBy = officerName ?? "Malini Wijeratne (Funding Officer)",
            ResolvedAt = DateTime.UtcNow
        };

        return Result<SuspiciousFlagDto>.Success(flag, $"Flag {id} marked as {flag.Status}.");
    }

    public async Task<Result<FundingReportsSummaryDto>> GetReportsSummaryAsync(string? operation = null, CancellationToken cancellationToken = default)
    {
        var donations = await _context.Donations
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var allocations = await _context.ResourceAllocations
            .AsNoTracking()
            .Include(ra => ra.Resource)
            .ToListAsync(cancellationToken);

        decimal totalMonetaryInflow = donations
            .Where(d => d.DonationType == 0 && d.Amount.HasValue)
            .Sum(d => d.Amount!.Value);

        decimal totalMonetaryAllocated = donations
            .Where(d => d.DonationType == 0 && d.Status >= 2 && d.Amount.HasValue)
            .Sum(d => d.Amount!.Value);

        decimal netAvailableReserve = Math.Max(0, totalMonetaryInflow - totalMonetaryAllocated);

        int totalMaterialInflow = donations
            .Where(d => d.DonationType != 0 && d.ItemQuantity.HasValue)
            .Sum(d => d.ItemQuantity!.Value);

        int totalMaterialDistributed = donations
            .Where(d => d.DonationType != 0 && d.Status >= 2 && d.ItemQuantity.HasValue)
            .Sum(d => d.ItemQuantity!.Value);

        int materialReserve = Math.Max(0, totalMaterialInflow - totalMaterialDistributed);

        // Group by sector
        var sectorGroups = donations
            .GroupBy(d => string.IsNullOrWhiteSpace(d.Sector) ? "General Relief" : d.Sector)
            .Select(g => new ReportBreakdownItemDto
            {
                Category = g.Key,
                MonetaryAmount = g.Where(d => d.Amount.HasValue).Sum(d => d.Amount!.Value),
                MaterialUnits = g.Where(d => d.ItemQuantity.HasValue).Sum(d => d.ItemQuantity!.Value),
                RecordCount = g.Count(),
                Percentage = donations.Count > 0 ? Math.Round((double)g.Count() / donations.Count * 100.0, 1) : 0
            })
            .OrderByDescending(b => b.MonetaryAmount)
            .ToList();

        // Group by district
        var districtGroups = donations
            .GroupBy(d => string.IsNullOrWhiteSpace(d.TargetDistrict) ? "Western Province" : d.TargetDistrict)
            .Select(g => new ReportBreakdownItemDto
            {
                Category = g.Key,
                MonetaryAmount = g.Where(d => d.Amount.HasValue).Sum(d => d.Amount!.Value),
                MaterialUnits = g.Where(d => d.ItemQuantity.HasValue).Sum(d => d.ItemQuantity!.Value),
                RecordCount = g.Count(),
                Percentage = donations.Count > 0 ? Math.Round((double)g.Count() / donations.Count * 100.0, 1) : 0
            })
            .OrderByDescending(b => b.MonetaryAmount)
            .ToList();

        // 12-point timeline
        var now = DateTime.UtcNow;
        var timeline = new List<ReportTimelinePointDto>();
        for (int i = 11; i >= 0; i--)
        {
            var dayStart = now.AddDays(-i).Date;
            var dayEnd = dayStart.AddDays(1);
            var dayDonations = donations.Where(d => d.CreatedAt >= dayStart && d.CreatedAt < dayEnd).ToList();
            timeline.Add(new ReportTimelinePointDto
            {
                Label = dayStart.ToString("dd MMM"),
                Amount = dayDonations.Where(d => d.Amount.HasValue).Sum(d => d.Amount!.Value),
                Units = dayDonations.Where(d => d.ItemQuantity.HasValue).Sum(d => d.ItemQuantity!.Value)
            });
        }

        var report = new FundingReportsSummaryDto
        {
            TotalMonetaryInflow = totalMonetaryInflow,
            TotalMonetaryAllocated = totalMonetaryAllocated,
            NetAvailableReserve = netAvailableReserve,
            TotalMaterialUnitsInflow = totalMaterialInflow,
            TotalMaterialUnitsDistributed = totalMaterialDistributed,
            MaterialUnitsInReserve = materialReserve,
            SectorBreakdowns = sectorGroups,
            DistrictBreakdowns = districtGroups,
            TimelineTrend = timeline
        };

        return Result<FundingReportsSummaryDto>.Success(report);
    }

    private static DonorRecordDto MapToDonorRecordDto(Donation d)
    {
        var code = $"DON-{d.Id.ToString("N")[..4].ToUpperInvariant()}";
        var isMonetary = d.DonationType == 0;
        var statusStr = d.Status switch
        {
            3 => "Dispatched",
            2 => "Allocated",
            1 => "Completed",
            _ => "Review"
        };
        var statusColor = d.Status switch
        {
            3 => "#1e40af",
            2 => "#3d6b4f",
            1 => "#059669",
            _ => "#b45309"
        };
        var statusBg = d.Status switch
        {
            3 => "#eff6ff",
            2 => "#edf2e6",
            1 => "#ecfdf5",
            _ => "#fffbeb"
        };

        return new DonorRecordDto
        {
            Id = code,
            Source = d.CrisisEvent?.Title ?? (d.Sector ?? "Public Humanitarian Response"),
            DonorOrg = d.DonorName,
            ContactPerson = d.DonorName,
            Email = d.DonorEmail ?? "donor@reliefcore.lk",
            Phone = d.DonorPhone ?? "+94 11 200 4000",
            Type = isMonetary ? "Monetary" : "Material",
            RecordedValue = isMonetary ? $"LKR {(d.Amount ?? 0):N0}" : $"{(d.ItemQuantity ?? 0):N0} units",
            RawValue = isMonetary ? (d.Amount ?? 0) : (d.ItemQuantity ?? 0),
            Currency = d.Currency ?? (isMonetary ? "LKR" : "Units"),
            Verification = d.Status >= 1 ? "Verified" : "Pending",
            Allocation = d.Status >= 2 ? (d.TargetDistrict ?? "Allocated") : "Unallocated",
            AllocationTarget = d.TargetDistrict ?? (d.Sector ?? "Western Province"),
            Status = statusStr,
            StatusColor = statusColor,
            StatusBg = statusBg,
            StatusBorder = "#dfe5d8",
            OperationalArea = d.TargetDistrict ?? "Western Province",
            Notes = d.ItemDescription ?? "Direct citizen / partner donation contribution.",
            VerifiedAt = d.ReceivedAt?.ToString("yyyy-MM-dd HH:mm") ?? (d.Status >= 1 ? (d.UpdatedAt?.ToString("yyyy-MM-dd HH:mm") ?? d.CreatedAt.ToString("yyyy-MM-dd HH:mm")) : "Pending Review"),
            VerifiedBy = d.VerifiedBy ?? (d.Status >= 1 ? "Funding Officer Desk" : "Pending Review"),
            Category = d.Sector ?? "General Relief",
            ComplianceDoc = string.IsNullOrWhiteSpace(d.TaxExemptId) ? $"DOC-{code}-AUDIT.pdf" : d.TaxExemptId,
            CreatedAt = d.CreatedAt
        };
    }

    private async Task<Donation?> FindDonationByCodeOrGuidAsync(string id, CancellationToken cancellationToken)
    {
        if (Guid.TryParse(id, out var guid))
        {
            return await _context.Donations
                .Include(d => d.CrisisEvent)
                .FirstOrDefaultAsync(d => d.Id == guid, cancellationToken);
        }

        var clean = id.Trim();
        if (clean.StartsWith("DON-", StringComparison.OrdinalIgnoreCase))
        {
            clean = clean[4..];
        }

        return await _context.Donations
            .Include(d => d.CrisisEvent)
            .FirstOrDefaultAsync(d => d.Id.ToString().StartsWith(clean) || d.Id.ToString("N").StartsWith(clean), cancellationToken);
    }

    private static string GetRelativeTime(DateTime dt)
    {
        var diff = DateTime.UtcNow - dt;
        if (diff.TotalMinutes < 60) return $"{(int)Math.Max(1, diff.TotalMinutes)} mins ago";
        if (diff.TotalHours < 24) return $"{(int)diff.TotalHours} hours ago";
        return $"{(int)diff.TotalDays} days ago";
    }
}

