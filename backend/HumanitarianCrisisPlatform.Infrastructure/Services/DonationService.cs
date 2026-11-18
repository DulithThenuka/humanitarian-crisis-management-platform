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
    // Advanced Donor & Funding Officer Portal Operations Implementation
    // =========================================================================

    private static readonly List<DonorRecordDto> InMemDonorRecords = new()
    {
        new DonorRecordDto
        {
            Id = "DON-2048",
            Source = "Community Relief Fund",
            DonorOrg = "Colombo Community Relief Trust",
            ContactPerson = "Dr. Dayan Jayasuriya",
            Email = "treasury@communityrelieftrust.lk",
            Phone = "+94 11 285 4100",
            Type = "Monetary",
            RecordedValue = "LKR 450,000",
            RawValue = 450000m,
            Currency = "LKR",
            Verification = "Verified",
            Allocation = "Flood campaign",
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
            Source = "MedCare Lanka",
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
        },
        new DonorRecordDto
        {
            Id = "DON-2044",
            Source = "Public campaign",
            DonorOrg = "National Displaced Aid Consortium",
            ContactPerson = "Kavinda Wickramasinghe",
            Email = "aid@nationaldisplacedaid.lk",
            Phone = "+94 11 490 2233",
            Type = "Monetary",
            RecordedValue = "LKR 128,500",
            RawValue = 128500m,
            Currency = "LKR",
            Verification = "Verified",
            Allocation = "Shelter supplies",
            AllocationTarget = "Central High-Ground Shelter Hub",
            Status = "Completed",
            StatusColor = "#166534",
            StatusBg = "#f0fdf4",
            StatusBorder = "#bbf7d0",
            OperationalArea = "Kalutara District",
            Notes = "Matched with 150 thermal blankets and emergency family kits. Full audit trail verified.",
            VerifiedAt = "2026-11-02 09:30",
            VerifiedBy = "Malini Wijeratne (Funding Officer)",
            Category = "Shelter Logistics",
            ComplianceDoc = "DOC-PAC-1285-SIGNED.pdf",
            CreatedAt = DateTime.UtcNow.AddDays(-5)
        },
        new DonorRecordDto
        {
            Id = "DON-2041",
            Source = "WaterAid Response",
            DonorOrg = "WaterAid Sri Lanka Humanitarian Office",
            ContactPerson = "Anura Dissanayake",
            Email = "logistics@wateraid-response.org",
            Phone = "+94 71 883 1920",
            Type = "Material",
            RecordedValue = "1,200 water units",
            RawValue = 1200m,
            Currency = "Units",
            Verification = "Verified",
            Allocation = "RES-021",
            AllocationTarget = "Kelani Buffer Zone Depot (RES-021)",
            Status = "Dispatched",
            StatusColor = "#1e40af",
            StatusBg = "#eff6ff",
            StatusBorder = "#bfdbfe",
            OperationalArea = "Gampaha District",
            Notes = "Certified potable drinking water tanks delivered directly via road tanker. Dispatched to Kelaniya distribution cluster.",
            VerifiedAt = "2026-11-01 16:45",
            VerifiedBy = "Malini Wijeratne (Funding Officer)",
            Category = "Water & Sanitation",
            ComplianceDoc = "BATCH-WA-1200-QUALITY.pdf",
            CreatedAt = DateTime.UtcNow.AddDays(-7)
        }
    };

    private static readonly List<FundingCampaignDto> InMemCampaigns = new()
    {
        new FundingCampaignDto
        {
            Id = "CMP-101",
            Title = "Western Province Flood Emergency Fund (WPF-2026)",
            TargetAmount = 10000000m,
            RaisedAmount = 8400000m,
            PercentFunded = 84,
            Status = "Active",
            OperationalArea = "Western Province (All Districts)",
            Category = "Emergency Monsoon Response",
            TargetDescription = "Emergency aid, family shelter kits, and drinking water tankers across flooded regions.",
            StartDate = DateTime.UtcNow.AddDays(-14),
            EndDate = DateTime.UtcNow.AddDays(16)
        },
        new FundingCampaignDto
        {
            Id = "CMP-102",
            Title = "Clean Drinking Water Bowser Operations",
            TargetAmount = 2500000m,
            RaisedAmount = 2100000m,
            PercentFunded = 84,
            Status = "Active",
            OperationalArea = "Kelani River Basin",
            Category = "WASH Infrastructure",
            TargetDescription = "Deploying 100 bowser deliveries of potable water to contaminated water grid areas.",
            StartDate = DateTime.UtcNow.AddDays(-10),
            EndDate = DateTime.UtcNow.AddDays(20)
        },
        new FundingCampaignDto
        {
            Id = "CMP-103",
            Title = "High-Ground Shelter Winterization & Hygiene",
            TargetAmount = 5000000m,
            RaisedAmount = 3200000m,
            PercentFunded = 64,
            Status = "Active",
            OperationalArea = "Kaduwela & Biyagama Clusters",
            Category = "Shelter Support",
            TargetDescription = "Blankets, bedding, and hygiene sanitation packs for 4,000 evacuees.",
            StartDate = DateTime.UtcNow.AddDays(-7),
            EndDate = DateTime.UtcNow.AddDays(23)
        }
    };

    private static readonly List<FundingAllocationDto> InMemAllocations = new()
    {
        new FundingAllocationDto
        {
            Id = "ALC-301",
            AllocationCode = "ALC-2026-091",
            TargetHubOrDepot = "Central Depot - Peliyagoda",
            Purpose = "Emergency Dry Ration Procurement (5,000 packs)",
            Amount = 1850000m,
            Currency = "LKR",
            Status = "Approved",
            RequiresDualApproval = true,
            CoSignedBy = "Malini Wijeratne & Senior Coordinator",
            CoSignedAt = "2026-11-10 11:20",
            AuthorizedNote = "Verified with District Secretariat distribution schedule.",
            CreatedAt = DateTime.UtcNow.AddDays(-4)
        },
        new FundingAllocationDto
        {
            Id = "ALC-302",
            AllocationCode = "ALC-2026-092",
            TargetHubOrDepot = "Kaduwela Field Clinic Hub",
            Purpose = "Urgent Antibiotics & Medical Consumables",
            Amount = 850000m,
            Currency = "LKR",
            Status = "Pending Dual Approval",
            RequiresDualApproval = true,
            CoSignedBy = "",
            CoSignedAt = "",
            AuthorizedNote = "Awaiting secondary signature from Funding Officer co-signatory.",
            CreatedAt = DateTime.UtcNow.AddHours(-18)
        }
    };

    private static readonly List<SuspiciousFlagDto> InMemFlags = new()
    {
        new SuspiciousFlagDto
        {
            Id = "FLG-401",
            RecordId = "DON-2047",
            DonorOrg = "MedCare Lanka",
            AnomalyReason = "Quantity escalation mismatch against secondary warehouse receipt (+200% delta).",
            Severity = "urgent",
            RiskScore = 88,
            Status = "Review",
            Details = "Intake quantity spiked from 80 kits to 240 kits without accompanying manifest verification.",
            DetectedAt = DateTime.UtcNow.AddHours(-2)
        },
        new SuspiciousFlagDto
        {
            Id = "FLG-402",
            RecordId = "DON-2039",
            DonorOrg = "Private Anonymous Grant",
            AnomalyReason = "Single source contribution exceeding automated anti-fraud clearance ceiling without tax doc.",
            Severity = "warning",
            RiskScore = 65,
            Status = "Review",
            Details = "Single transaction of LKR 2,500,000 flagged for secondary regulatory clearance.",
            DetectedAt = DateTime.UtcNow.AddDays(-1)
        }
    };

    public async Task<Result<FundingOfficerDashboardDto>> GetFundingOfficerDashboardAsync(CancellationToken cancellationToken = default)
    {
        var dbDonations = await _context.Donations.AsNoTracking().ToListAsync(cancellationToken);
        
        decimal totalMonetary = dbDonations.Where(d => d.Amount.HasValue).Sum(d => d.Amount!.Value);
        if (totalMonetary == 0) totalMonetary = 8400000m;

        int totalMaterialUnits = dbDonations.Where(d => d.ItemQuantity.HasValue).Sum(d => d.ItemQuantity!.Value);
        if (totalMaterialUnits == 0) totalMaterialUnits = 38420;

        int registeredDonorsCount = InMemDonorRecords.Count + dbDonations.Select(d => d.DonorName).Distinct().Count();
        if (registeredDonorsCount < 214) registeredDonorsCount = 214;

        var dashboard = new FundingOfficerDashboardDto
        {
            RegisteredDonors = new FundingOfficerMetricDto
            {
                Value = registeredDonorsCount,
                Label = "Registered donors",
                Subtext = "Restricted directory",
                Trend = "+18 this month",
                TrendUp = true
            },
            MonetaryRecords = new FundingOfficerMetricDto
            {
                Value = $"LKR {totalMonetary / 1_000_000m:F1}m",
                Raw = totalMonetary,
                Label = "Monetary records",
                Subtext = "Demo transactions",
                Trend = "+24% vs baseline",
                TrendUp = true
            },
            MaterialDonations = new FundingOfficerMetricDto
            {
                Value = totalMaterialUnits.ToString("N0"),
                Raw = totalMaterialUnits,
                Label = "Material donations",
                Subtext = "Recorded units",
                Trend = "14 categories",
                TrendUp = true
            },
            ActiveCampaigns = new FundingOfficerMetricDto
            {
                Value = InMemCampaigns.Count(c => c.Status == "Active"),
                Label = "Active campaigns",
                Subtext = "In scope",
                Trend = "2 fully funded",
                TrendUp = true
            },
            PendingVerification = new FundingOfficerMetricDto
            {
                Value = InMemDonorRecords.Count(d => d.Verification == "Pending"),
                Label = "Pending verification",
                Subtext = "Actionable items",
                Trend = "3 high priority",
                TrendUp = false
            },
            AllocatedBalance = new FundingOfficerMetricDto
            {
                Value = "64%",
                Raw = 64,
                Label = "Allocated balance",
                Subtext = "Approved records",
                Trend = "LKR 5.37m deployed",
                TrendUp = true
            },
            PriorityAttentionItems = new List<PriorityAttentionItemDto>
            {
                new()
                {
                    Id = "DON-2047",
                    Code = "DON-2047 anomaly flag",
                    Description = "AI flag on value escalation requires review",
                    Status = "urgent",
                    TagColor = "#dc2626",
                    BadgeText = "urgent",
                    RelatedTab = "suspicious",
                    Timestamp = "15 mins ago",
                    Details = "Material intake quantity was updated without secondary warehouse receipt."
                },
                new()
                {
                    Id = "ALC-302",
                    Code = "ALC-302 approval pending",
                    Description = "Dual approval required before distribution",
                    Status = "pending",
                    TagColor = "#d97706",
                    BadgeText = "pending",
                    RelatedTab = "allocations",
                    Timestamp = "42 mins ago",
                    Details = "LKR 850,000 emergency medical allocation for Kaduwela requires Funding Officer co-signature."
                },
                new()
                {
                    Id = "CMP-104",
                    Code = "Campaign target update",
                    Description = "Kaduwela flood response reached 91%",
                    Status = "tracking",
                    TagColor = "#059669",
                    BadgeText = "tracking",
                    RelatedTab = "campaigns",
                    Timestamp = "2 hours ago",
                    Details = "Goal of LKR 3,500,000 reached LKR 3,185,000."
                }
            },
            ConnectedWorkflowSteps = new List<ConnectedWorkflowStepDto>
            {
                new() { Step = 1, Title = "Citizen request recorded", Description = "Funding officer views matched supply inventory", Status = "completed", NodeType = "intake", ActionLink = "Assistance Triage" },
                new() { Step = 2, Title = "Relief core review", Description = "Verify donor-item match", Status = "completed", NodeType = "verification", ActionLink = "Donor Matching" },
                new() { Step = 3, Title = "Outcome / shelter decision", Description = "Shipment allocated to local facility", Status = "in-progress", NodeType = "allocation", ActionLink = "Shelter Hubs" },
                new() { Step = 4, Title = "Volunteer or partner handoff", Description = "Logistics dispatch verified", Status = "upcoming", NodeType = "dispatch", ActionLink = "Transport Fleet" },
                new() { Step = 5, Title = "Citizen status notification", Description = "Aid arrival alert sent to shelter head", Status = "upcoming", NodeType = "fulfillment", ActionLink = "SMS / Alert Log" }
            },
            RecentActivity = new List<RecentActivityItemDto>
            {
                new() { Id = "ACT-101", Time = "14:10", RecordId = "DON-2048", Source = "Community Relief Fund", Action = "Allocation approved by authorised staff", Officer = "Malini Wijeratne", Type = "Monetary", Amount = "LKR 450,000" },
                new() { Id = "ACT-102", Time = "13:45", RecordId = "DON-2047", Source = "MedCare Lanka", Action = "Material intake recorded by authorised staff", Officer = "Rohan Senanayake", Type = "Material", Amount = "240 medicine packs" },
                new() { Id = "ACT-103", Time = "11:20", RecordId = "DON-2046", Source = "Public campaign", Action = "Monetary record submitted by authorised staff", Officer = "Amara Chen", Type = "Monetary", Amount = "LKR 120,000" }
            }
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
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync(cancellationToken);

        var list = new List<DonorRecordDto>(InMemDonorRecords);

        foreach (var d in dbDonations)
        {
            var code = $"DON-{d.Id.ToString("N")[..4].ToUpperInvariant()}";
            if (!list.Any(x => x.Id == code))
            {
                list.Add(new DonorRecordDto
                {
                    Id = code,
                    Source = d.CrisisEvent?.Title ?? "Public Relief Fund",
                    DonorOrg = d.DonorName,
                    ContactPerson = d.DonorName,
                    Email = d.DonorEmail ?? "donor@relief.lk",
                    Phone = d.DonorPhone ?? "+94 77 000 0000",
                    Type = d.DonationType == 0 ? "Monetary" : "Material",
                    RecordedValue = d.DonationType == 0 ? $"LKR {d.Amount:N0}" : $"{d.ItemQuantity:N0} units",
                    RawValue = d.Amount ?? d.ItemQuantity ?? 0,
                    Currency = d.Currency ?? "LKR",
                    Verification = d.Status >= 1 ? "Verified" : "Pending",
                    Allocation = d.Status == 2 ? "Dispatched" : "Unallocated",
                    AllocationTarget = d.TargetDistrict ?? "Western Province",
                    Status = d.Status switch
                    {
                        2 => "Dispatched",
                        1 => "Allocated",
                        _ => "Review"
                    },
                    StatusColor = d.Status switch
                    {
                        2 => "#1e40af",
                        1 => "#3d6b4f",
                        _ => "#b45309"
                    },
                    StatusBg = d.Status switch
                    {
                        2 => "#eff6ff",
                        1 => "#edf2e6",
                        _ => "#fffbeb"
                    },
                    StatusBorder = "#dfe5d8",
                    OperationalArea = d.TargetDistrict ?? "Western Province",
                    Notes = d.ItemDescription ?? "Direct citizen / partner donation contribution.",
                    VerifiedAt = d.ReceivedAt?.ToString("yyyy-MM-dd HH:mm") ?? "Pending Review",
                    VerifiedBy = d.VerifiedBy ?? "Funding Officer Team",
                    Category = d.Sector ?? "General Relief",
                    ComplianceDoc = $"DOC-{code}-AUDIT.pdf",
                    CreatedAt = d.CreatedAt
                });
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
                x.ContactPerson.ToLowerInvariant().Contains(q));
        }

        return Result<IReadOnlyList<DonorRecordDto>>.Success(filtered.OrderByDescending(x => x.CreatedAt).ToList());
    }

    public Task<Result<DonorRecordDto>> GetDonorRecordByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        var item = InMemDonorRecords.FirstOrDefault(x => x.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
        if (item == null)
        {
            return Task.FromResult(Result<DonorRecordDto>.Failure($"Donor record '{id}' was not found."));
        }
        return Task.FromResult(Result<DonorRecordDto>.Success(item));
    }

    public async Task<Result<DonorRecordDto>> CreateDonorRecordAsync(
        CreateDonorRecordDto dto,
        string? officerName,
        CancellationToken cancellationToken = default)
    {
        var id = $"DON-{new Random().Next(2050, 9999)}";
        var isMonetary = dto.Type.Equals("Monetary", StringComparison.OrdinalIgnoreCase);

        var record = new DonorRecordDto
        {
            Id = id,
            Source = dto.Source,
            DonorOrg = dto.DonorOrg,
            ContactPerson = string.IsNullOrWhiteSpace(dto.ContactPerson) ? dto.DonorOrg : dto.ContactPerson,
            Email = dto.Email,
            Phone = dto.Phone,
            Type = dto.Type,
            RecordedValue = isMonetary ? $"LKR {dto.Amount:N0}" : $"{dto.Amount:N0} units",
            RawValue = dto.Amount,
            Currency = dto.Currency,
            Verification = "Verified",
            Allocation = dto.AllocationTarget,
            AllocationTarget = dto.AllocationTarget,
            Status = "Allocated",
            StatusColor = "#3d6b4f",
            StatusBg = "#edf2e6",
            StatusBorder = "#dfe5d8",
            OperationalArea = dto.OperationalArea,
            Notes = dto.Notes,
            VerifiedAt = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm"),
            VerifiedBy = officerName ?? "Authorised Funding Officer",
            Category = dto.Category,
            ComplianceDoc = $"DOC-{id}-COMPLIANCE.pdf",
            CreatedAt = DateTime.UtcNow
        };

        InMemDonorRecords.Insert(0, record);

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
            VerifiedBy = officerName ?? "Funding Officer",
            ReceivedAt = DateTime.UtcNow
        };
        _context.Donations.Add(dbDonation);
        await _context.SaveChangesAsync(cancellationToken);

        return Result<DonorRecordDto>.Success(record, "Donor record registered and verified successfully.");
    }

    public Task<Result<DonorRecordDto>> ProcessDonorDecisionAsync(
        string id,
        DonorDecisionDto dto,
        string? officerName,
        CancellationToken cancellationToken = default)
    {
        var item = InMemDonorRecords.FirstOrDefault(x => x.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
        if (item == null)
        {
            return Task.FromResult(Result<DonorRecordDto>.Failure($"Donor record '{id}' was not found."));
        }

        switch (dto.Action.ToLowerInvariant())
        {
            case "submit-approval":
                item.Status = "Allocated";
                item.Verification = "Verified";
                item.StatusColor = "#3d6b4f";
                item.StatusBg = "#edf2e6";
                item.Notes += $" [Approved by {officerName ?? "Funding Officer"}: {dto.DecisionReason}]";
                break;

            case "request-clarification":
                item.Status = "Review";
                item.Verification = "Pending";
                item.StatusColor = "#b45309";
                item.StatusBg = "#fffbeb";
                item.Notes += $" [Clarification requested by {officerName ?? "Funding Officer"}: {dto.DecisionReason}]";
                break;

            case "escalate":
                item.Status = "Review";
                item.StatusColor = "#dc2626";
                item.StatusBg = "#fef2f2";
                item.Notes += $" [Escalated to National Command by {officerName ?? "Funding Officer"}: {dto.DecisionReason}]";
                break;
        }

        return Task.FromResult(Result<DonorRecordDto>.Success(item, $"Decision '{dto.Action}' recorded for {id}."));
    }

    public Task<Result<IReadOnlyList<FundingCampaignDto>>> GetCampaignsAsync(CancellationToken cancellationToken = default)
    {
        return Task.FromResult(Result<IReadOnlyList<FundingCampaignDto>>.Success(InMemCampaigns));
    }

    public Task<Result<FundingCampaignDto>> CreateCampaignAsync(
        CreateFundingCampaignDto dto,
        CancellationToken cancellationToken = default)
    {
        var campaign = new FundingCampaignDto
        {
            Id = $"CMP-{new Random().Next(105, 999)}",
            Title = dto.Title,
            TargetAmount = dto.TargetAmount,
            RaisedAmount = 0,
            PercentFunded = 0,
            Status = "Active",
            OperationalArea = dto.OperationalArea,
            Category = dto.Category,
            TargetDescription = dto.TargetDescription,
            StartDate = DateTime.UtcNow,
            EndDate = DateTime.UtcNow.AddDays(dto.DurationDays)
        };

        InMemCampaigns.Add(campaign);
        return Task.FromResult(Result<FundingCampaignDto>.Success(campaign, "New emergency campaign established successfully."));
    }

    public Task<Result<IReadOnlyList<FundingAllocationDto>>> GetAllocationsAsync(CancellationToken cancellationToken = default)
    {
        return Task.FromResult(Result<IReadOnlyList<FundingAllocationDto>>.Success(InMemAllocations));
    }

    public Task<Result<FundingAllocationDto>> ApproveAllocationAsync(
        string id,
        ApproveFundingAllocationDto dto,
        string? officerName,
        CancellationToken cancellationToken = default)
    {
        var alloc = InMemAllocations.FirstOrDefault(x => x.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
        if (alloc == null)
        {
            return Task.FromResult(Result<FundingAllocationDto>.Failure($"Allocation '{id}' not found."));
        }

        alloc.Status = "Approved";
        alloc.CoSignedBy = officerName ?? "Malini Wijeratne (Funding Officer)";
        alloc.CoSignedAt = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm");
        alloc.AuthorizedNote = dto.AuthorizedNote;

        return Task.FromResult(Result<FundingAllocationDto>.Success(alloc, $"Allocation {alloc.AllocationCode} co-signed and approved."));
    }

    public Task<Result<IReadOnlyList<SuspiciousFlagDto>>> GetSuspiciousFlagsAsync(CancellationToken cancellationToken = default)
    {
        return Task.FromResult(Result<IReadOnlyList<SuspiciousFlagDto>>.Success(InMemFlags));
    }

    public Task<Result<SuspiciousFlagDto>> ResolveSuspiciousFlagAsync(
        string id,
        ResolveSuspiciousFlagDto dto,
        string? officerName,
        CancellationToken cancellationToken = default)
    {
        var flag = InMemFlags.FirstOrDefault(x => x.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
        if (flag == null)
        {
            return Task.FromResult(Result<SuspiciousFlagDto>.Failure($"Flag '{id}' not found."));
        }

        flag.Status = dto.Action.ToLowerInvariant() == "clear" ? "Cleared" : "Escalated";
        flag.ResolvedBy = officerName ?? "Funding Officer";
        flag.ResolvedAt = DateTime.UtcNow;

        return Task.FromResult(Result<SuspiciousFlagDto>.Success(flag, $"Flag {id} marked as {flag.Status}."));
    }
}

