using Microsoft.EntityFrameworkCore;
using Xunit;
using HumanitarianCrisisPlatform.Application.DTOs.Partners;
using HumanitarianCrisisPlatform.Application.Services;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;
using HumanitarianCrisisPlatform.Infrastructure.Repositories;

namespace HumanitarianCrisisPlatform.Tests.UnitTests.ServiceTests;

public class PartnerServiceTests
{
    private static ApplicationDbContext CreateInMemoryDb()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(options);
    }

    private static PartnerService CreateService(ApplicationDbContext db)
    {
        var repo = new PartnerRepository(db);
        var uow = new UnitOfWork(db);
        return new PartnerService(repo, uow);
    }

    [Fact]
    public async Task CreatePartnerAsync_CreatesAndPersistsPartner()
    {
        using var db = CreateInMemoryDb();
        var service = CreateService(db);

        var dto = new CreatePartnerOrganisationDto
        {
            Code = "PART-101",
            Name = "Care International Sri Lanka",
            Acronym = "CARE",
            Type = "International NGO",
            LeadContact = "Anura Bandara",
            Phone = "+94 11 555 0199",
            Email = "ops@care.lk",
            Status = "Active Response",
            MouStatus = "Active MoU (2025-2027)",
            FieldTeamsCount = 5,
            FleetCount = 4
        };

        var result = await service.CreatePartnerAsync(dto, "coordinator-1");

        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.Equal("PART-101", result.Data!.Code);
        Assert.Equal("status-active", result.Data.StatusClass);
        Assert.Equal(1, await db.PartnerOrganisations.CountAsync());
    }

    [Fact]
    public async Task CreatePartnerAsync_RejectsDuplicateCode()
    {
        using var db = CreateInMemoryDb();
        db.PartnerOrganisations.Add(new PartnerOrganisation
        {
            Code = "PART-001",
            Name = "Existing Partner",
            Acronym = "EP",
            Type = "NGO",
            LeadContact = "Lead",
            Phone = "011",
            Email = "a@b.com",
            MouStatus = "Active MoU"
        });
        await db.SaveChangesAsync();

        var service = CreateService(db);
        var result = await service.CreatePartnerAsync(new CreatePartnerOrganisationDto
        {
            Code = "part-001",
            Name = "Duplicate",
            Acronym = "DUP",
            Type = "NGO",
            LeadContact = "Lead",
            Phone = "011",
            Email = "dup@b.com",
            MouStatus = "Active MoU"
        }, null);

        Assert.False(result.Succeeded);
        Assert.Contains("already exists", result.Errors[0], StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task LogCommitmentAsync_PersistsCommitmentAndUpdatesSummary()
    {
        using var db = CreateInMemoryDb();
        var partner = new PartnerOrganisation
        {
            Code = "PART-001",
            Name = "Sri Lanka Red Cross",
            Acronym = "SLRCS",
            Type = "First Response",
            LeadContact = "Dr. Rohan",
            Phone = "+94 11 269 1095",
            Email = "ops@redcross.lk",
            MouStatus = "Active MoU",
            FieldTeamsCount = 6,
            FleetCount = 10
        };
        db.PartnerOrganisations.Add(partner);
        await db.SaveChangesAsync();

        var service = CreateService(db);
        var logResult = await service.LogCommitmentAsync(new CreatePartnerCommitmentDto
        {
            PartnerOrganisationId = partner.Id,
            Item = "Inflatable Rescue Boats",
            Qty = 4,
            DestinationZone = "Kelani East - Sector 03",
            Status = "Deployed",
            EstimatedValueLkr = 12_000_000m
        }, Guid.NewGuid());

        Assert.True(logResult.Succeeded);
        Assert.Equal("Inflatable Rescue Boats", logResult.Data!.Item);
        Assert.Equal(4, logResult.Data.Qty);

        var summaryResult = await service.GetDashboardSummaryAsync();
        Assert.True(summaryResult.Succeeded);
        Assert.Equal(1, summaryResult.Data!.AccreditedPartnersCount);
        Assert.Equal(100, summaryResult.Data.DispatchedPercentage);
        Assert.Equal(12m, summaryResult.Data.PledgedAidValueMillionsLkr);
    }

    [Fact]
    public async Task UpdateCommitmentStatusAsync_ReturnsFailureWhenNotFound()
    {
        using var db = CreateInMemoryDb();
        var service = CreateService(db);

        var result = await service.UpdateCommitmentStatusAsync(
            Guid.NewGuid(),
            new UpdateCommitmentStatusDto { Status = "Delivered" },
            "admin");

        Assert.False(result.Succeeded);
    }
}

