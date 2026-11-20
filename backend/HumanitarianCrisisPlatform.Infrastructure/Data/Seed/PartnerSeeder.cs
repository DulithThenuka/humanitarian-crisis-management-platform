using Microsoft.EntityFrameworkCore;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;

namespace HumanitarianCrisisPlatform.Infrastructure.Data.Seed;

public static class PartnerSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        if (await context.PartnerOrganisations.AnyAsync())
            return;

        var zoneKelani = new SectorZone
        {
            Id = Guid.Parse("a1111111-1111-1111-1111-111111111111"),
            Name = "Kelani River Basin - East Zone 03",
            ZoneCode = "Kelani East - Sector 03",
            PriorityStatus = "High Priority Flood",
            StatusClass = "status-active",
            Description = "Covering Kolonnawa, Kaduwela, Wellampitiya, Hanwella floodplains.",
            LeadAgency = "Sri Lanka Red Cross Society",
            CoveragePercent = 92
        };
        var zoneGampaha = new SectorZone
        {
            Id = Guid.Parse("a2222222-2222-2222-2222-222222222222"),
            Name = "Gampaha Ja-Ela Basin Zone 02",
            ZoneCode = "Gampaha - Ja-Ela Basin",
            PriorityStatus = "Severe Inundation",
            StatusClass = "status-active",
            Description = "Covering Ja-Ela, Kandana, Wattala low-lying residential clusters.",
            LeadAgency = "Sarvodaya Shramadana Movement",
            CoveragePercent = 88
        };
        var zoneKalutara = new SectorZone
        {
            Id = Guid.Parse("a3333333-3333-3333-3333-333333333333"),
            Name = "Kalutara & Kalu Ganga Basin Zone 01",
            ZoneCode = "Kalutara & Kalu Ganga Basin",
            PriorityStatus = "Monitoring Stage",
            StatusClass = "status-warning",
            Description = "Covering Millaniya, Horana, Bulathsinhala river banks.",
            LeadAgency = "UNICEF / National Water Board",
            CoveragePercent = 84
        };
        var zonePeliyagoda = new SectorZone
        {
            Id = Guid.Parse("a4444444-4444-4444-4444-444444444444"),
            Name = "Central Logistics Depot - Peliyagoda",
            ZoneCode = "Central Logistics Depot - Peliyagoda",
            PriorityStatus = "Active Staging Hub",
            StatusClass = "status-active",
            Description = "National supply chain staging and inter-agency dispatch hub.",
            LeadAgency = "World Food Programme (WFP)",
            CoveragePercent = 95
        };

        await context.SectorZones.AddRangeAsync(zoneKelani, zoneGampaha, zoneKalutara, zonePeliyagoda);

        var slrcs = new PartnerOrganisation
        {
            Id = Guid.Parse("b1111111-1111-1111-1111-111111111111"),
            Code = "PART-001",
            Name = "Sri Lanka Red Cross Society",
            Acronym = "SLRCS",
            Type = "Humanitarian / First Response",
            LeadContact = "Dr. Rohan Jayasinghe",
            Phone = "+94 11 269 1095",
            Email = "operations@redcross.lk",
            Status = "Active Response",
            StatusClass = "status-active",
            MouStatus = "Active MoU (2025-2027)",
            MouBadge = "badge-verified",
            FieldTeamsCount = 9,
            FleetCount = 18
        };
        var sarvodaya = new PartnerOrganisation
        {
            Id = Guid.Parse("b2222222-2222-2222-2222-222222222222"),
            Code = "PART-002",
            Name = "Sarvodaya Shramadana Movement",
            Acronym = "SARVODAYA",
            Type = "Community Relief & Volunteer Mobilisation",
            LeadContact = "Nimali Senaratne",
            Phone = "+94 11 265 5255",
            Email = "relief@sarvodaya.org",
            Status = "Active Response",
            StatusClass = "status-active",
            MouStatus = "Active MoU (2024-2027)",
            MouBadge = "badge-verified",
            FieldTeamsCount = 8,
            FleetCount = 10
        };
        var unicef = new PartnerOrganisation
        {
            Id = Guid.Parse("b3333333-3333-3333-3333-333333333333"),
            Code = "PART-003",
            Name = "UNICEF Emergency Country Office",
            Acronym = "UNICEF",
            Type = "UN Agency / Child & Maternal Protection",
            LeadContact = "Elena Vance (Cluster Lead)",
            Phone = "+94 11 276 8555",
            Email = "colombo@unicef.org",
            Status = "Active Support",
            StatusClass = "status-active",
            MouStatus = "UN Joint Framework Agreement",
            MouBadge = "badge-un",
            FieldTeamsCount = 4,
            FleetCount = 6
        };
        var wfp = new PartnerOrganisation
        {
            Id = Guid.Parse("b4444444-4444-4444-4444-444444444444"),
            Code = "PART-004",
            Name = "World Food Programme (WFP)",
            Acronym = "WFP",
            Type = "Food Security & Supply Chain Logistics",
            LeadContact = "Marcus Sterling",
            Phone = "+94 11 250 2490",
            Email = "srilanka.emergency@wfp.org",
            Status = "Mobilising",
            StatusClass = "status-warning",
            MouStatus = "Annual Humanitarian Agreement",
            MouBadge = "badge-verified",
            FieldTeamsCount = 3,
            FleetCount = 8
        };
        var sja = new PartnerOrganisation
        {
            Id = Guid.Parse("b5555555-5555-5555-5555-555555555555"),
            Code = "PART-005",
            Name = "St. John Ambulance Sri Lanka",
            Acronym = "SJA",
            Type = "Emergency Medical & Paramedic",
            LeadContact = "Dinesh Perera",
            Phone = "+94 11 243 7755",
            Email = "emergency@stjohn.lk",
            Status = "Active Response",
            StatusClass = "status-active",
            MouStatus = "Active MoU (2025-2026)",
            MouBadge = "badge-verified",
            FieldTeamsCount = 4,
            FleetCount = 4
        };

        await context.PartnerOrganisations.AddRangeAsync(slrcs, sarvodaya, unicef, wfp, sja);

        await context.PartnerZoneAssignments.AddRangeAsync(
            new PartnerZoneAssignment { PartnerOrganisationId = slrcs.Id, SectorZoneId = zoneKelani.Id, RoleSummary = "Boats & First Aid" },
            new PartnerZoneAssignment { PartnerOrganisationId = slrcs.Id, SectorZoneId = zoneKalutara.Id, RoleSummary = "Relief Rations" },
            new PartnerZoneAssignment { PartnerOrganisationId = sarvodaya.Id, SectorZoneId = zoneGampaha.Id, RoleSummary = "Community Meals" },
            new PartnerZoneAssignment { PartnerOrganisationId = unicef.Id, SectorZoneId = zoneKelani.Id, RoleSummary = "WASH Purification" },
            new PartnerZoneAssignment { PartnerOrganisationId = unicef.Id, SectorZoneId = zoneKalutara.Id, RoleSummary = "Child Protection" },
            new PartnerZoneAssignment { PartnerOrganisationId = wfp.Id, SectorZoneId = zoneGampaha.Id, RoleSummary = "Dry Rations" },
            new PartnerZoneAssignment { PartnerOrganisationId = wfp.Id, SectorZoneId = zonePeliyagoda.Id, RoleSummary = "Central Logistics Staging" },
            new PartnerZoneAssignment { PartnerOrganisationId = sja.Id, SectorZoneId = zoneKelani.Id, RoleSummary = "Paramedics" }
        );

        await context.PartnerCommitments.AddRangeAsync(
            new PartnerCommitment { PartnerOrganisationId = slrcs.Id, Item = "Inflatable Rescue Boats with Crew", Quantity = 12, Status = "Deployed", DestinationZone = "Kelani East - Sector 03", EstimatedValueLkr = 96_000_000m },
            new PartnerCommitment { PartnerOrganisationId = slrcs.Id, Item = "Emergency First Aid Mobile Units", Quantity = 6, Status = "Deployed", DestinationZone = "Kelani East - Sector 03", EstimatedValueLkr = 36_000_000m },
            new PartnerCommitment { PartnerOrganisationId = slrcs.Id, Item = "Dry Food Family Packs (7-day)", Quantity = 4500, Status = "Distributing", DestinationZone = "Kalutara & Kalu Ganga Basin", EstimatedValueLkr = 45_000_000m },
            new PartnerCommitment { PartnerOrganisationId = sarvodaya.Id, Item = "Community Kitchen Meal Distribution", Quantity = 15000, Status = "Daily", DestinationZone = "Gampaha - Ja-Ela Basin", EstimatedValueLkr = 30_000_000m },
            new PartnerCommitment { PartnerOrganisationId = sarvodaya.Id, Item = "Trained Community First Responders", Quantity = 320, Status = "Active", DestinationZone = "Gampaha - Ja-Ela Basin", EstimatedValueLkr = 16_000_000m },
            new PartnerCommitment { PartnerOrganisationId = sarvodaya.Id, Item = "Clean Drinking Water Carts", Quantity = 25, Status = "Deployed", DestinationZone = "Gampaha - Ja-Ela Basin", EstimatedValueLkr = 25_000_000m },
            new PartnerCommitment { PartnerOrganisationId = unicef.Id, Item = "School-in-a-Box & Child Safe Spaces", Quantity = 18, Status = "Staged", DestinationZone = "Kalutara & Kalu Ganga Basin", EstimatedValueLkr = 27_000_000m },
            new PartnerCommitment { PartnerOrganisationId = unicef.Id, Item = "WASH Water Purification Tablets", Quantity = 120000, Status = "Delivered", DestinationZone = "Kelani East - Sector 03", EstimatedValueLkr = 18_000_000m },
            new PartnerCommitment { PartnerOrganisationId = unicef.Id, Item = "Infant Nutrition & Hygiene Kits", Quantity = 2800, Status = "Distributing", DestinationZone = "Kelani East - Sector 03", EstimatedValueLkr = 28_000_000m },
            new PartnerCommitment { PartnerOrganisationId = wfp.Id, Item = "Fortified High-Energy Biscuits (MT)", Quantity = 45, Status = "In Transit", DestinationZone = "Central Logistics Depot - Peliyagoda", EstimatedValueLkr = 54_000_000m },
            new PartnerCommitment { PartnerOrganisationId = wfp.Id, Item = "Heavy-Duty 4x4 Supply Trucks", Quantity = 8, Status = "Staged", DestinationZone = "Central Logistics Depot - Peliyagoda", EstimatedValueLkr = 32_000_000m },
            new PartnerCommitment { PartnerOrganisationId = sja.Id, Item = "Paramedic Ambulances with Crew", Quantity = 4, Status = "Active", DestinationZone = "Kelani East - Sector 03", EstimatedValueLkr = 8_000_000m },
            new PartnerCommitment { PartnerOrganisationId = sja.Id, Item = "Triage First-Aid Tents", Quantity = 3, Status = "Deployed", DestinationZone = "Kelani East - Sector 03", EstimatedValueLkr = 5_000_000m }
        );

        await context.SaveChangesAsync();
    }
}

