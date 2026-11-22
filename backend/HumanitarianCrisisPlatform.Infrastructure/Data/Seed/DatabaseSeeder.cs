using Microsoft.EntityFrameworkCore;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Enums;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;
using HumanitarianCrisisPlatform.Infrastructure.Security;

namespace HumanitarianCrisisPlatform.Infrastructure.Data.Seed;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Ensure database schema is created
        await context.Database.EnsureCreatedAsync();

        // 1. Seed Users if none exist
        if (!await context.Users.AnyAsync())
        {
            var defaultPasswordHash = PasswordHasher.HashPassword("Password123!");

            var users = new List<User>
            {
                new User
                {
                    Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    FullName = "Sarah Johnson",
                    Email = "sarah.johnson@reliefcore.org",
                    PasswordHash = defaultPasswordHash,
                    PhoneNumber = "+94 77 123 4567",
                    AssignedDistrict = "Western Province / Colombo",
                    Role = UserRole.Coordinator,
                    IsActive = true
                },
                new User
                {
                    Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    FullName = "Amara Chen",
                    Email = "amara.chen@reliefcore.org",
                    PasswordHash = defaultPasswordHash,
                    PhoneNumber = "+94 77 234 5678",
                    AssignedDistrict = "Western Province / Gampaha",
                    Role = UserRole.Coordinator,
                    IsActive = true
                },
                new User
                {
                    Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                    FullName = "Operations Administrator",
                    Email = "admin@reliefcore.org",
                    PasswordHash = defaultPasswordHash,
                    PhoneNumber = "+94 77 345 6789",
                    AssignedDistrict = "National Command Center",
                    Role = UserRole.Admin,
                    IsActive = true
                },
                new User
                {
                    Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                    FullName = "David Silva",
                    Email = "logistics@reliefcore.org",
                    PasswordHash = defaultPasswordHash,
                    PhoneNumber = "+94 77 456 7890",
                    AssignedDistrict = "Western Province / Kalutara",
                    Role = UserRole.LogisticsManager,
                    IsActive = true
                },
                new User
                {
                    Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                    FullName = "Kamal Perera",
                    Email = "volunteer@reliefcore.org",
                    PasswordHash = defaultPasswordHash,
                    PhoneNumber = "+94 77 567 8901",
                    AssignedDistrict = "Southern Province / Galle",
                    Role = UserRole.Volunteer,
                    IsActive = true
                },
                new User
                {
                    Id = Guid.Parse("66666666-6666-6666-6666-666666666666"),
                    FullName = "Nimal Fernando",
                    Email = "citizen@reliefcore.org",
                    PasswordHash = defaultPasswordHash,
                    PhoneNumber = "+94 77 678 9012",
                    AssignedDistrict = "Sabaragamuwa / Ratnapura",
                    Role = UserRole.Citizen,
                    IsActive = true
                },
                new User
                {
                    Id = Guid.Parse("77777777-7777-7777-7777-777777777777"),
                    FullName = "Ishara Senanayake",
                    Email = "ishara.senanayake@reliefcore.org",
                    PasswordHash = defaultPasswordHash,
                    PhoneNumber = "+94 77 789 0123",
                    AssignedDistrict = "Western Province Command",
                    Role = UserRole.CaseManager,
                    IsActive = true
                },
                new User
                {
                    Id = Guid.Parse("88888888-8888-8888-8888-888888888888"),
                    FullName = "Tharushi De Alwis",
                    Email = "shelter.admin@reliefcore.org",
                    PasswordHash = defaultPasswordHash,
                    PhoneNumber = "+94 77 123 4567",
                    AssignedDistrict = "Western Province / Colombo Shelters",
                    Role = UserRole.ShelterManager,
                    IsActive = true
                },
                new User
                {
                    Id = Guid.Parse("99999999-9999-9999-9999-999999999999"),
                    FullName = "Kavindi Rodrigo",
                    Email = "volunteer.coordinator@reliefcore.org",
                    PasswordHash = defaultPasswordHash,
                    PhoneNumber = "+94 77 987 6543",
                    AssignedDistrict = "Western Province Flood Operations",
                    Role = UserRole.VolunteerCoordinator,
                    IsActive = true
                }
            };

            await context.Users.AddRangeAsync(users);
            await context.SaveChangesAsync();
        }
        else
        {
            var defaultPasswordHash = PasswordHasher.HashPassword("Password123!");
            if (!await context.Users.AnyAsync(u => u.Role == UserRole.CaseManager))
            {
                context.Users.Add(new User
                {
                    Id = Guid.Parse("77777777-7777-7777-7777-777777777777"),
                    FullName = "Ishara Senanayake",
                    Email = "ishara.senanayake@reliefcore.org",
                    PasswordHash = defaultPasswordHash,
                    PhoneNumber = "+94 77 789 0123",
                    AssignedDistrict = "Western Province Command",
                    Role = UserRole.CaseManager,
                    IsActive = true
                });
            }
            if (!await context.Users.AnyAsync(u => u.Role == UserRole.ShelterManager))
            {
                context.Users.Add(new User
                {
                    Id = Guid.Parse("88888888-8888-8888-8888-888888888888"),
                    FullName = "Tharushi De Alwis",
                    Email = "shelter.admin@reliefcore.org",
                    PasswordHash = defaultPasswordHash,
                    PhoneNumber = "+94 77 123 4567",
                    AssignedDistrict = "Western Province / Colombo Shelters",
                    Role = UserRole.ShelterManager,
                    IsActive = true
                });
            }
            if (!await context.Users.AnyAsync(u => u.Role == UserRole.VolunteerCoordinator))
            {
                context.Users.Add(new User
                {
                    Id = Guid.Parse("99999999-9999-9999-9999-999999999999"),
                    FullName = "Kavindi Rodrigo",
                    Email = "volunteer.coordinator@reliefcore.org",
                    PasswordHash = defaultPasswordHash,
                    PhoneNumber = "+94 77 987 6543",
                    AssignedDistrict = "Western Province Flood Operations",
                    Role = UserRole.VolunteerCoordinator,
                    IsActive = true
                });
            }
            await context.SaveChangesAsync();
        }

        // 2. Seed Crisis Events
        CrisisEvent? activeCrisis = null;
        if (!await context.CrisisEvents.AnyAsync())
        {
            var crises = new List<CrisisEvent>
            {
                new()
                {
                    Id = Guid.Parse("a1111111-1111-1111-1111-111111111111"),
                    Title = "Western Province Monsoon Floods",
                    Description = "Heavy monsoon downpours triggered flash flooding along the Kelani and Kalu Ganga river basins. Multi-agency evacuation, high-ground shelter placement, and emergency ration supply convoys are actively deployed.",
                    DisasterType = DisasterType.Flood,
                    Severity = 4,
                    Latitude = 6.9580m,
                    Longitude = 79.8980m,
                    AffectedAreaRadius = 35.0m,
                    StartDate = DateTime.UtcNow.AddDays(-3),
                    IsActive = true
                },
                new()
                {
                    Id = Guid.Parse("a2222222-2222-2222-2222-222222222222"),
                    Title = "Landslide Risk - Gampaha Terraces",
                    Description = "Soil instability detected on upper slope terraces following continuous rainfall. 140 households ordered to evacuate to Bandaranaike College safe grounds.",
                    DisasterType = DisasterType.Landslide,
                    Severity = 3,
                    Latitude = 7.0910m,
                    Longitude = 79.9980m,
                    AffectedAreaRadius = 15.0m,
                    StartDate = DateTime.UtcNow.AddHours(-18),
                    IsActive = true
                },
                new()
                {
                    Id = Guid.Parse("a3333333-3333-3333-3333-333333333333"),
                    Title = "Severe Coastal Storm & Wind Squall",
                    Description = "Gale-force coastal winds and squall lines damaging power grids and coastal fishing harbours in Beruwala and Kalutara South.",
                    DisasterType = DisasterType.Storm,
                    Severity = 4,
                    Latitude = 6.5850m,
                    Longitude = 79.9600m,
                    AffectedAreaRadius = 25.0m,
                    StartDate = DateTime.UtcNow.AddDays(-1),
                    IsActive = true
                },
                new()
                {
                    Id = Guid.Parse("a4444444-4444-4444-4444-444444444444"),
                    Title = "Coastal Erosion & Storm Surge",
                    Description = "High storm surge causing localized shoreline sand spit breach near Negombo lagoon entrance. Temporary rock rip-rap deployed.",
                    DisasterType = DisasterType.Storm,
                    Severity = 2,
                    Latitude = 7.2080m,
                    Longitude = 79.8350m,
                    AffectedAreaRadius = 10.0m,
                    StartDate = DateTime.UtcNow.AddDays(-2),
                    IsActive = true
                },
                new()
                {
                    Id = Guid.Parse("a5555555-5555-5555-5555-555555555555"),
                    Title = "Dry Zone Drought Emergency",
                    Description = "Agricultural water depletion in dry zone irrigation reservoirs. Tanker drinking water distribution activated across 6 vulnerable villages.",
                    DisasterType = DisasterType.Storm,
                    Severity = 3,
                    Latitude = 6.1240m,
                    Longitude = 81.1180m,
                    AffectedAreaRadius = 40.0m,
                    StartDate = DateTime.UtcNow.AddDays(-5),
                    IsActive = true
                }
            };

            await context.CrisisEvents.AddRangeAsync(crises);
            await context.SaveChangesAsync();
            activeCrisis = crises[0];
        }
        else
        {
            activeCrisis = await context.CrisisEvents.FirstOrDefaultAsync(c => c.IsActive);
        }

        // 3. Seed Shelters (16 verified operational shelters)
        if (!await context.Shelters.AnyAsync())
        {
            var crisisId = activeCrisis?.Id ?? Guid.Parse("a1111111-1111-1111-1111-111111111111");
            var shelters = new List<Shelter>
            {
                new() { Id = Guid.NewGuid(), Name = "Colombo Central Evacuation Camp", Address = "Colombo 07, Western Province", Latitude = 6.9147m, Longitude = 79.8732m, TotalCapacity = 500, CurrentOccupancy = 380, Facilities = "Medical, Kitchen, Clean Water, Restrooms", ContactPhone = "+94 11 269 1111", IsActive = true, CrisisEventId = crisisId },
                new() { Id = Guid.NewGuid(), Name = "Kelani Relief Center (St. Paul)", Address = "Kelaniya, Gampaha District", Latitude = 6.9544m, Longitude = 79.9192m, TotalCapacity = 350, CurrentOccupancy = 210, Facilities = "Dry Bedding, Power Generators, First Aid", ContactPhone = "+94 11 291 2233", IsActive = true, CrisisEventId = crisisId },
                new() { Id = Guid.NewGuid(), Name = "Kalutara North High Ground Shelter", Address = "Main Road, Kalutara North", Latitude = 6.5854m, Longitude = 79.9607m, TotalCapacity = 280, CurrentOccupancy = 195, Facilities = "Clean Water, Children Play Area, Kitchen", ContactPhone = "+94 34 222 3344", IsActive = true, CrisisEventId = crisisId },
                new() { Id = Guid.NewGuid(), Name = "Negombo Community Disaster Hall", Address = "Negombo Coastal Road", Latitude = 7.2088m, Longitude = 79.8358m, TotalCapacity = 300, CurrentOccupancy = 180, Facilities = "Boat Landing, High Ground, Generator", ContactPhone = "+94 31 223 4455", IsActive = true, CrisisEventId = crisisId },
                new() { Id = Guid.NewGuid(), Name = "Gampaha District General Camp", Address = "Bandaranayake Road, Gampaha", Latitude = 7.0840m, Longitude = 79.9939m, TotalCapacity = 400, CurrentOccupancy = 260, Facilities = "Full Medical Tent, Stockpile Hub", ContactPhone = "+94 33 222 5566", IsActive = true, CrisisEventId = crisisId },
                new() { Id = Guid.NewGuid(), Name = "Biyagama Evacuation Shelter", Address = "Biyagama Free Trade Zone Corridor", Latitude = 6.9400m, Longitude = 79.9700m, TotalCapacity = 250, CurrentOccupancy = 160, Facilities = "Water Bowser Dock, Meals", ContactPhone = "+94 11 248 7788", IsActive = true, CrisisEventId = crisisId },
                new() { Id = Guid.NewGuid(), Name = "Wellampitiya Community Centre", Address = "Wellampitiya Bridge Road", Latitude = 6.9480m, Longitude = 79.8850m, TotalCapacity = 200, CurrentOccupancy = 150, Facilities = "Sanitation Packs, Hot Food", ContactPhone = "+94 11 257 8899", IsActive = true, CrisisEventId = crisisId },
                new() { Id = Guid.NewGuid(), Name = "Kaduwela Multi-Purpose Hall", Address = "Avissawella Road, Kaduwela", Latitude = 6.9360m, Longitude = 79.9830m, TotalCapacity = 320, CurrentOccupancy = 215, Facilities = "Emergency Clinic, Bedding", ContactPhone = "+94 11 253 9900", IsActive = true, CrisisEventId = crisisId },
                new() { Id = Guid.NewGuid(), Name = "Sedawatta River Safety Base", Address = "Sedawatta Lowland Road", Latitude = 6.9600m, Longitude = 79.8800m, TotalCapacity = 150, CurrentOccupancy = 95, Facilities = "Boats, Lifejackets, Clean Water", ContactPhone = "+94 11 289 1010", IsActive = true, CrisisEventId = crisisId },
                new() { Id = Guid.NewGuid(), Name = "Wattala Parish Relief Ground", Address = "Negombo Road, Wattala", Latitude = 6.9890m, Longitude = 79.8920m, TotalCapacity = 220, CurrentOccupancy = 140, Facilities = "Dry Rations, Baby Care", ContactPhone = "+94 11 293 2020", IsActive = true, CrisisEventId = crisisId },
                new() { Id = Guid.NewGuid(), Name = "Panadura South Evacuation Center", Address = "Galle Road, Panadura", Latitude = 6.7130m, Longitude = 79.9070m, TotalCapacity = 180, CurrentOccupancy = 110, Facilities = "Medical Post, Drinking Water", ContactPhone = "+94 38 223 3030", IsActive = true, CrisisEventId = crisisId },
                new() { Id = Guid.NewGuid(), Name = "Horana High Ground Stadium Center", Address = "Ratnapura Road, Horana", Latitude = 6.7150m, Longitude = 80.0630m, TotalCapacity = 300, CurrentOccupancy = 175, Facilities = "Spacious Halls, Helipad Access", ContactPhone = "+94 34 226 4040", IsActive = true, CrisisEventId = crisisId },
                new() { Id = Guid.NewGuid(), Name = "Ja-Ela Safe Evacuation Shelter", Address = "Ja-Ela Interchange Zone", Latitude = 7.0750m, Longitude = 79.8920m, TotalCapacity = 160, CurrentOccupancy = 90, Facilities = "Solar Power, Clean Water", ContactPhone = "+94 11 224 5050", IsActive = true, CrisisEventId = crisisId },
                new() { Id = Guid.NewGuid(), Name = "Moratuwa University Shelter Complex", Address = "Katubedda, Moratuwa", Latitude = 6.7970m, Longitude = 79.9010m, TotalCapacity = 450, CurrentOccupancy = 310, Facilities = "WiFi, Telehealth, Tech Support", ContactPhone = "+94 11 265 6060", IsActive = true, CrisisEventId = crisisId },
                new() { Id = Guid.NewGuid(), Name = "Dehiwala Youth Center Shelter", Address = "Hill Street, Dehiwala", Latitude = 6.8510m, Longitude = 79.8660m, TotalCapacity = 200, CurrentOccupancy = 135, Facilities = "Infant Care, Female Quarters", ContactPhone = "+94 11 273 7070", IsActive = true, CrisisEventId = crisisId },
                new() { Id = Guid.NewGuid(), Name = "Peliyagoda Emergency Transit Camp", Address = "Kandy Road, Peliyagoda", Latitude = 6.9660m, Longitude = 79.8950m, TotalCapacity = 240, CurrentOccupancy = 150, Facilities = "Convoy Transit, Food Hub", ContactPhone = "+94 11 291 8080", IsActive = true, CrisisEventId = crisisId }
            };

            await context.Shelters.AddRangeAsync(shelters);
            await context.SaveChangesAsync();
        }

        // 4. Seed Resources
        if (!await context.Resources.AnyAsync())
        {
            var resources = new List<Resource>
            {
                new() { Id = Guid.NewGuid(), Name = "Bottled Drinking Water (1L)", Category = "Food & Water", Unit = "Bottles", TotalQuantity = 10000, AllocatedQuantity = 6200, MinimumThreshold = 1000, WarehouseLocation = "Colombo Central Hub" },
                new() { Id = Guid.NewGuid(), Name = "Dry Ration Rice Packs (10kg)", Category = "Food & Water", Unit = "Bags", TotalQuantity = 2500, AllocatedQuantity = 1800, MinimumThreshold = 300, WarehouseLocation = "Gampaha Distribution Depot" },
                new() { Id = Guid.NewGuid(), Name = "Emergency Trauma & First Aid Kits", Category = "Medical Supplies", Unit = "Kits", TotalQuantity = 1500, AllocatedQuantity = 950, MinimumThreshold = 200, WarehouseLocation = "Colombo Central Hub" },
                new() { Id = Guid.NewGuid(), Name = "Waterproof Heavy-Duty Tarpaulins", Category = "Shelter Materials", Unit = "Sheets", TotalQuantity = 800, AllocatedQuantity = 520, MinimumThreshold = 150, WarehouseLocation = "Kalutara Depot" },
                new() { Id = Guid.NewGuid(), Name = "Warm Thermal Blankets", Category = "Clothing & Bedding", Unit = "Pieces", TotalQuantity = 2000, AllocatedQuantity = 1480, MinimumThreshold = 250, WarehouseLocation = "Gampaha Distribution Depot" },
                new() { Id = Guid.NewGuid(), Name = "Family Hygiene & Sanitizer Kits", Category = "Hygiene Kits", Unit = "Boxes", TotalQuantity = 1200, AllocatedQuantity = 800, MinimumThreshold = 150, WarehouseLocation = "Colombo Central Hub" },
                new() { Id = Guid.NewGuid(), Name = "4-Person Inflatable Relief Tents", Category = "Shelter Materials", Unit = "Units", TotalQuantity = 300, AllocatedQuantity = 210, MinimumThreshold = 50, WarehouseLocation = "Kalutara Depot" }
            };

            await context.Resources.AddRangeAsync(resources);
            await context.SaveChangesAsync();
        }

        // 5. Seed Assistance Requests with Demonstration References
        if (!await context.AssistanceRequests.AnyAsync())
        {
            var citizenUser = await context.Users.FirstOrDefaultAsync(u => u.Role == UserRole.Citizen);
            var citizenId = citizenUser?.Id ?? Guid.Parse("66666666-6666-6666-6666-666666666666");
            var crisisId = activeCrisis?.Id ?? Guid.Parse("a1111111-1111-1111-1111-111111111111");

            var requests = new List<AssistanceRequest>
            {
                new()
                {
                    Id = Guid.Parse("e1111111-0000-0000-0000-000000001842"),
                    RequestorId = citizenId,
                    CrisisEventId = crisisId,
                    Category = "Medical Assistance",
                    Description = "[REQ-2026-01842] Urgent insulin and trauma dressings needed for stranded diabetic elder.",
                    Urgency = PriorityLevel.Critical,
                    Status = RequestStatus.InProgress,
                    Address = "No 42, Kelani Riverside Road, Colombo",
                    Latitude = 6.9530m,
                    Longitude = 79.8820m,
                    NumberOfPeople = 3,
                    ContactPhone = "+94 77 123 4567",
                    AIPriorityScore = 0.91m,
                    AIConfidence = 0.94m
                },
                new()
                {
                    Id = Guid.Parse("e2222222-0000-0000-0000-000000001877"),
                    RequestorId = citizenId,
                    CrisisEventId = crisisId,
                    Category = "Shelter Request",
                    Description = "[REQ-2026-01877] House inundated to chest height. Family of 5 on rooftop awaiting evacuation.",
                    Urgency = PriorityLevel.High,
                    Status = RequestStatus.InProgress,
                    Address = "Gampaha Lowland Zone B",
                    Latitude = 7.0850m,
                    Longitude = 79.9920m,
                    NumberOfPeople = 5,
                    ContactPhone = "+94 77 234 5678",
                    AIPriorityScore = 0.87m,
                    AIConfidence = 0.92m
                },
                new()
                {
                    Id = Guid.Parse("e3333333-0000-0000-0000-000000001835"),
                    RequestorId = citizenId,
                    CrisisEventId = crisisId,
                    Category = "Food Assistance",
                    Description = "[REQ-2026-01835] Dry rations and clean drinking water needed for 8 people stranded without power.",
                    Urgency = PriorityLevel.High,
                    Status = RequestStatus.Submitted,
                    Address = "Kalutara North River Basin",
                    Latitude = 6.5860m,
                    Longitude = 79.9610m,
                    NumberOfPeople = 8,
                    ContactPhone = "+94 77 345 6789",
                    AIPriorityScore = 0.82m,
                    AIConfidence = 0.88m
                },
                new()
                {
                    Id = Guid.Parse("e4444444-0000-0000-0000-000000001628"),
                    RequestorId = citizenId,
                    CrisisEventId = crisisId,
                    Category = "Safe Transportation",
                    Description = "[REQ-2026-01628] Boat extraction required for mother with newborn infant.",
                    Urgency = PriorityLevel.Medium,
                    Status = RequestStatus.InProgress,
                    Address = "Negombo Estuary Sector",
                    Latitude = 7.2090m,
                    Longitude = 79.8360m,
                    NumberOfPeople = 2,
                    ContactPhone = "+94 77 456 7890",
                    AIPriorityScore = 0.76m,
                    AIConfidence = 0.89m
                },
                new()
                {
                    Id = Guid.Parse("e5555555-0000-0000-0000-000000001821"),
                    RequestorId = citizenId,
                    CrisisEventId = crisisId,
                    Category = "Drinking Water",
                    Description = "[REQ-2026-01821] Well contaminated by flood silt. Urgently require clean water containers.",
                    Urgency = PriorityLevel.Medium,
                    Status = RequestStatus.Resolved,
                    Address = "Kalutara South High Road",
                    Latitude = 6.5780m,
                    Longitude = 79.9650m,
                    NumberOfPeople = 4,
                    ContactPhone = "+94 77 567 8901",
                    AIPriorityScore = 0.62m,
                    AIConfidence = 0.85m,
                    ResolvedAt = DateTime.UtcNow.AddHours(-2)
                }
            };

            await context.AssistanceRequests.AddRangeAsync(requests);
            await context.SaveChangesAsync();
        }

        // 6. Seed Volunteers
        if (!await context.Volunteers.AnyAsync())
        {
            var volunteerUser = await context.Users.FirstOrDefaultAsync(u => u.Role == UserRole.Volunteer);
            if (volunteerUser != null)
            {
                var volunteers = new List<Volunteer>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        UserId = volunteerUser.Id,
                        Skills = "Emergency First Aid, Boat SAR, Logistics Dispatch",
                        Availability = "24/7 On-Call",
                        IsAvailable = true,
                        Latitude = 6.9271m,
                        Longitude = 79.8612m,
                        MaxTravelDistance = 25.0m
                    }
                };

                await context.Volunteers.AddRangeAsync(volunteers);
                await context.SaveChangesAsync();
            }
        }

        // 7. Seed Corporate & Humanitarian Relief Donations
        if (!await context.Donations.AnyAsync())
        {
            var donations = new List<Donation>
            {
                new()
                {
                    Id = Guid.Parse("d1111111-0000-0000-0000-000000000101"),
                    DonorName = "Dilmah Tea Relief Trust",
                    DonorEmail = "csr@dilmahtea.com",
                    DonorPhone = "+94 11 482 2000",
                    DonationType = 0, // Monetary
                    Amount = 5000000m,
                    Currency = "LKR",
                    Sector = "Food & Clean Water",
                    TargetDistrict = "Colombo (Kelani Basin)",
                    Status = 1, // Verified & Cleared
                    ReceivedAt = DateTime.UtcNow.AddHours(-18),
                    VerifiedBy = "DMC Treasury Audit",
                    TaxExemptId = "TE-2026-8841",
                    AuditHash = "sha256-8f7a43e8bb219901"
                },
                new()
                {
                    Id = Guid.Parse("d2222222-0000-0000-0000-000000000102"),
                    DonorName = "UN OCHA Emergency Rapid Fund",
                    DonorEmail = "rapid-response@un.ocha.org",
                    DonationType = 0, // Monetary
                    Amount = 8500000m,
                    Currency = "LKR",
                    Sector = "Medical Field Hospitals",
                    TargetDistrict = "Western & Sabaragamuwa",
                    Status = 1, // Verified & Cleared
                    ReceivedAt = DateTime.UtcNow.AddHours(-36),
                    VerifiedBy = "UN Comptroller Office",
                    TaxExemptId = "UN-NGO-2026-002",
                    AuditHash = "sha256-12c49981e4b3017a"
                },
                new()
                {
                    Id = Guid.Parse("d3333333-0000-0000-0000-000000000103"),
                    DonorName = "John Keells Foundation",
                    DonorEmail = "community@keells.com",
                    DonationType = 1, // InKind
                    Amount = 3750000m,
                    Currency = "LKR",
                    ItemDescription = "Emergency Dry Ration Packs & Infant Hygiene Kits",
                    ItemQuantity = 2500,
                    Sector = "Dry Rations & Baby Care",
                    TargetDistrict = "Gampaha Evacuee Shelters",
                    Status = 2, // AllocatedToDepot
                    ReceivedAt = DateTime.UtcNow.AddHours(-40),
                    VerifiedBy = "Logistics Intake Dock",
                    TaxExemptId = "TE-2026-8812",
                    AuditHash = "sha256-99ea4871bb04bc33"
                },
                new()
                {
                    Id = Guid.Parse("d4444444-0000-0000-0000-000000000104"),
                    DonorName = "Commercial Bank CSR Division",
                    DonorEmail = "csr@combank.net",
                    DonationType = 0,
                    Amount = 3200000m,
                    Currency = "LKR",
                    Sector = "Water Bowsers & Fuel Reserves",
                    TargetDistrict = "Colombo & Kalutara",
                    Status = 1,
                    ReceivedAt = DateTime.UtcNow.AddHours(-52),
                    VerifiedBy = "DMC Treasury Audit",
                    TaxExemptId = "TE-2026-8790",
                    AuditHash = "sha256-33d1bb89aa04ff20"
                },
                new()
                {
                    Id = Guid.Parse("d5555555-0000-0000-0000-000000000105"),
                    DonorName = "Sri Lanka Red Cross Society",
                    DonorEmail = "disaster@redcross.lk",
                    DonationType = 1,
                    Amount = 2400000m,
                    Currency = "LKR",
                    ItemDescription = "Surgical Trauma & Emergency First Aid Kits",
                    ItemQuantity = 1200,
                    Sector = "Emergency Medical Care",
                    TargetDistrict = "Colombo Base Stations",
                    Status = 2,
                    ReceivedAt = DateTime.UtcNow.AddHours(-60),
                    VerifiedBy = "Medical Corps Logistics",
                    TaxExemptId = "RC-MED-2026",
                    AuditHash = "sha256-44aa9911e2477190"
                },
                new()
                {
                    Id = Guid.Parse("d6666666-0000-0000-0000-000000000106"),
                    DonorName = "Rotary Club Colombo West",
                    DonorEmail = "president@rotarycolombo.lk",
                    DonationType = 0,
                    Amount = 1800000m,
                    Currency = "LKR",
                    Sector = "Shelter Bedding & Tarpaulins",
                    TargetDistrict = "Western Province Shelters",
                    Status = 1,
                    ReceivedAt = DateTime.UtcNow.AddHours(-72),
                    VerifiedBy = "DMC Treasury Audit",
                    TaxExemptId = "TE-2026-8744",
                    AuditHash = "sha256-aa428801990141bb"
                },
                new()
                {
                    Id = Guid.Parse("d7777777-0000-0000-0000-000000000107"),
                    DonorName = "Aitken Spence Logistics Aid",
                    DonorEmail = "logistics.aid@aitkenspence.lk",
                    DonationType = 2, // LogisticsAsset
                    Amount = 4800000m,
                    Currency = "LKR",
                    ItemDescription = "6 4x4 Off-Road Transport Trucks for Flood Rescue Convoys",
                    ItemQuantity = 6,
                    Sector = "Flood Rescue Convoys",
                    TargetDistrict = "Western Province Command",
                    Status = 3, // ActiveDeployment
                    ReceivedAt = DateTime.UtcNow.AddHours(-80),
                    VerifiedBy = "Fleet Master Verification",
                    TaxExemptId = "TE-2026-8711",
                    AuditHash = "sha256-55bc9944bb2201ea"
                },
                new()
                {
                    Id = Guid.Parse("d8888888-0000-0000-0000-000000000108"),
                    DonorName = "Australia-Sri Lanka Disaster Solidarity",
                    DonorEmail = "aus.aid@dfat.gov.au",
                    DonationType = 0,
                    Amount = 2600000m,
                    Currency = "LKR",
                    Sector = "Mobile Water Purification Units",
                    TargetDistrict = "Kalutara & Galle",
                    Status = 0, // PendingAudit
                    ReceivedAt = DateTime.UtcNow.AddHours(-96),
                    VerifiedBy = "Central Bank Escrow Unit",
                    TaxExemptId = "PENDING-CB",
                    AuditHash = "sha256-77ee1134aa9940cb"
                }
            };

            await context.Donations.AddRangeAsync(donations);
            await context.SaveChangesAsync();
        }

        // 8. Seed Emergency Broadcasts & Alert Warnings
        if (!await context.EmergencyBroadcasts.AnyAsync())
        {
            var broadcasts = new List<EmergencyBroadcast>
            {
                new()
                {
                    Id = Guid.Parse("b1111111-0000-0000-0000-000000000091"),
                    Title = "Emergency Flash Flood Warning: Kelani River Basin",
                    Severity = "Emergency",
                    Channels = "SMS Broadcast, Push Notification, Field Radio",
                    TargetRegion = "Colombo & Gampaha Lowlands",
                    TargetAudience = "All Citizens in Zone A & B (45,200 recipients)",
                    Message = "CRITICAL ALERT: Kelani River has exceeded major flood level (1.84m). Immediate evacuation advised for low-lying areas of Wellampitiya, Kolonnawa, Kelaniya. Proceed to designated high-ground shelters.",
                    SentBy = "DMC Emergency Command / Sarah Johnson",
                    DeliveryRate = "99.2%",
                    Status = "Active Live",
                    IsActive = true,
                    SentAt = DateTime.UtcNow.AddMinutes(-45)
                },
                new()
                {
                    Id = Guid.Parse("b2222222-0000-0000-0000-000000000092"),
                    Title = "Severe Road Inundation: A1 Colombo-Kandy Road at Peliyagoda",
                    Severity = "Warning",
                    Channels = "Push Notification, Citizen Portal",
                    TargetRegion = "Peliyagoda & Kelaniya Corridors",
                    TargetAudience = "Commuters & Logistics Convoys (28,400 recipients)",
                    Message = "ROAD CLOSURE: A1 Highway submerged between Peliyagoda junction and 4th Mile Post. Light vehicles cannot pass. Use Southern Expressway or Minuwangoda diversion route.",
                    SentBy = "Traffic Police Disaster Liaison",
                    DeliveryRate = "98.7%",
                    Status = "Active Live",
                    IsActive = true,
                    SentAt = DateTime.UtcNow.AddHours(-2)
                },
                new()
                {
                    Id = Guid.Parse("b3333333-0000-0000-0000-000000000093"),
                    Title = "New High-Ground Relief Shelter Opened: Colombo Central School",
                    Severity = "Advisory",
                    Channels = "SMS Broadcast, Push Notification",
                    TargetRegion = "Colombo District - Zone A",
                    TargetAudience = "Registered Evacuees (18,500 recipients)",
                    Message = "SHELTER NOTIFICATION: Colombo Central School (Capacity 500) is now open with clean water, hot meals, and a Sri Lanka Red Cross medical aid post.",
                    SentBy = "Shelter Administration Lead",
                    DeliveryRate = "99.4%",
                    Status = "Active Live",
                    IsActive = true,
                    SentAt = DateTime.UtcNow.AddHours(-4)
                },
                new()
                {
                    Id = Guid.Parse("b4444444-0000-0000-0000-000000000094"),
                    Title = "Precautionary Boil Water Directive: Kalutara District",
                    Severity = "Warning",
                    Channels = "SMS Broadcast, Field Radio",
                    TargetRegion = "Kalutara South & Beruwala",
                    TargetAudience = "Residents in Coastal Inundation Areas (32,100 recipients)",
                    Message = "HEALTH DIRECTIVE: Groundwater wells contaminated due to sea surge. All tap and well water must be boiled vigorously for at least 3 minutes before drinking or food preparation.",
                    SentBy = "Ministry of Health Disaster Response",
                    DeliveryRate = "97.8%",
                    Status = "Active Live",
                    IsActive = true,
                    SentAt = DateTime.UtcNow.AddHours(-8)
                },
                new()
                {
                    Id = Guid.Parse("b5555555-0000-0000-0000-000000000089"),
                    Title = "Dam Spillway Gate #3 Release Notice: Laxapana Hydro Complex",
                    Severity = "Emergency",
                    Channels = "SMS Broadcast, Emergency Sirens",
                    TargetRegion = "Kelani Downstream Riparian Communities",
                    TargetAudience = "Riparian Riverfront Dwellings (24,000 recipients)",
                    Message = "DAM GATE NOTICE: 3 spillway gates opened due to torrential catchment rainfall. Expect river crest surge between 06:00 and 10:00. Maintain 100m clearance from riverbanks.",
                    SentBy = "Ceylon Electricity Board Hydro Security",
                    DeliveryRate = "99.8%",
                    Status = "Archived",
                    IsActive = false,
                    SentAt = DateTime.UtcNow.AddHours(-24)
                }
            };

            await context.EmergencyBroadcasts.AddRangeAsync(broadcasts);
            await context.SaveChangesAsync();
        }

        // 9. Seed Official Situation Reports (SITREPs)
        if (!await context.SituationReports.AnyAsync())
        {
            var reports = new List<SituationReport>
            {
                new()
                {
                    Id = Guid.Parse("c1111111-0000-0000-0000-000000000014"),
                    ReportCode = "SITREP-2026-WP-014",
                    Title = "Kelani River Basin Flash Flooding - Situation Report #14",
                    IncidentName = "Western Province Monsoon Inundation",
                    DisasterType = "Flood",
                    District = "Colombo",
                    GeneratedBy = "Operations Administrator",
                    CasualtiesReported = 0,
                    PeopleDisplaced = 3200,
                    SheltersActive = 16,
                    TeamsDeployed = 42,
                    RoadPassabilityStatus = "Major arterial roads restricted; boat corridors active",
                    ExecutiveSummary = "Water level at Nagalagam Street gauge recorded 1.84m (Major Flood). Tri-forces and volunteer search-and-rescue teams have evacuated 3,200 individuals across Wellampitiya and Kolonnawa.",
                    PriorityNeeds = "Potable water bowsers, infant care packs, emergency inflatable dinghies.",
                    Status = "Official Approved",
                    ReportedAt = DateTime.UtcNow.AddHours(-2)
                },
                new()
                {
                    Id = Guid.Parse("c2222222-0000-0000-0000-000000000015"),
                    ReportCode = "SITREP-2026-WP-015",
                    Title = "Gampaha Mudslide & Attanagalu Oya Inundation Report",
                    IncidentName = "Gampaha Rail Corridor Landslide",
                    DisasterType = "Landslide",
                    District = "Gampaha",
                    GeneratedBy = "Kasun Perera (District Lead)",
                    CasualtiesReported = 0,
                    PeopleDisplaced = 1450,
                    SheltersActive = 7,
                    TeamsDeployed = 18,
                    RoadPassabilityStatus = "A1 highway blocked at Miriswatta; clearance ongoing",
                    ExecutiveSummary = "Heavy mud deposits cleared from mainline railway tracks. 1,450 residents accommodated in verified secondary shelters with 100% ration coverage.",
                    PriorityNeeds = "Heavy earthmoving excavators, fuel reserves for drainage sumps.",
                    Status = "Official Approved",
                    ReportedAt = DateTime.UtcNow.AddHours(-5)
                }
            };

            await context.SituationReports.AddRangeAsync(reports);
            await context.SaveChangesAsync();
        }

        // 10. Seed Initial Incident / Case Manager Records if none exist
        if (!await context.Incidents.AnyAsync())
        {
            var caseManagerId = Guid.Parse("77777777-7777-7777-7777-777777777777");
            var citizenId = Guid.Parse("66666666-6666-6666-6666-666666666666");

            var resolvedCaseManagerId = await context.Users
                .Where(u => u.Role == UserRole.CaseManager)
                .Select(u => (Guid?)u.Id)
                .FirstOrDefaultAsync() ?? caseManagerId;

            var resolvedCitizenId = await context.Users
                .Where(u => u.Role == UserRole.Citizen)
                .Select(u => (Guid?)u.Id)
                .FirstOrDefaultAsync() ?? citizenId;

            var now = DateTime.UtcNow;

            var inc1042 = new Incident
            {
                Id = Guid.Parse("aaaaaaaa-1042-4000-8000-000000001042"),
                CaseNumber = "HMR-1042",
                Title = "Emergency Shelter",
                Category = IncidentCategory.EmergencyShelter,
                CategoryDisplay = "Emergency Shelter",
                OperationalArea = "Kelani East - Zone 03",
                Priority = PriorityLevel.Critical,
                Status = IncidentStatus.Open,
                VerificationStatus = "Awaiting review",
                AssignedToUserId = resolvedCaseManagerId,
                AssignedStaffName = "I. Senanayake",
                CitizenId = resolvedCitizenId,
                AffectedPeople = 6,
                CurrentSafety = "Temporary roadside location",
                AccessibilityNeeds = "Older adult with limited mobility",
                Description = "Flood water entered our home overnight. We have two children and my mother cannot walk far. We need a safe place before the water rises again.",
                Latitude = 6.9550m,
                Longitude = 79.9220m,
                CreatedAt = now.AddMinutes(-8),
                CreatedBy = "System"
            };

            var inc1039 = new Incident
            {
                Id = Guid.Parse("aaaaaaaa-1039-4000-8000-000000001039"),
                CaseNumber = "HMR-1039",
                Title = "Medicine",
                Category = IncidentCategory.Medicine,
                CategoryDisplay = "Medicine",
                OperationalArea = "Wattala South",
                Priority = PriorityLevel.Critical,
                Status = IncidentStatus.Assigned,
                VerificationStatus = "Verified",
                AssignedStaffName = "R. Perera",
                AffectedPeople = 2,
                CurrentSafety = "Sheltered with neighbor",
                AccessibilityNeeds = "Insulin-dependent diabetic",
                Description = "Urgent insulin supply needed within 6 hours. Refrigerated storage submerged.",
                Latitude = 6.9890m,
                Longitude = 79.8910m,
                VerifiedAt = now.AddMinutes(-15),
                CreatedAt = now.AddMinutes(-24),
                CreatedBy = "System"
            };

            var inc1035 = new Incident
            {
                Id = Guid.Parse("aaaaaaaa-1035-4000-8000-000000001035"),
                CaseNumber = "HMR-1035",
                Title = "Food",
                Category = IncidentCategory.Food,
                CategoryDisplay = "Food",
                OperationalArea = "Kaduwela West",
                Priority = PriorityLevel.Medium,
                Status = IncidentStatus.Pending,
                VerificationStatus = "Need information",
                AssignedToUserId = resolvedCaseManagerId,
                AssignedStaffName = "I. Senanayake",
                CitizenId = resolvedCitizenId,
                AffectedPeople = 4,
                CurrentSafety = "Upper floor of residence",
                AccessibilityNeeds = "Infant formula required",
                Description = "Drinking water exhausted. Need ration pack and baby formula.",
                Latitude = 6.9330m,
                Longitude = 79.9840m,
                CreatedAt = now.AddMinutes(-42),
                CreatedBy = "System"
            };

            var inc1036 = new Incident
            {
                Id = Guid.Parse("aaaaaaaa-1036-4000-8000-000000001036"),
                CaseNumber = "HMR-1036",
                Title = "Transport",
                Category = IncidentCategory.Transport,
                CategoryDisplay = "Transport",
                OperationalArea = "Hanwella Zone 02",
                Priority = PriorityLevel.High,
                Status = IncidentStatus.Escalated,
                VerificationStatus = "Verified",
                AssignedStaffName = "S. Silva",
                AffectedPeople = 8,
                CurrentSafety = "Community hall",
                AccessibilityNeeds = "Stretcher transport required",
                Description = "Bedridden elderly resident requires medical evacuation transport to district hospital.",
                Latitude = 6.8920m,
                Longitude = 80.0810m,
                VerifiedAt = now.AddMinutes(-30),
                CreatedAt = now.AddMinutes(-58),
                CreatedBy = "System"
            };

            var inc1028 = new Incident
            {
                Id = Guid.Parse("aaaaaaaa-1028-4000-8000-000000001028"),
                CaseNumber = "HMR-1028",
                Title = "Rescue",
                Category = IncidentCategory.SearchAndRescue,
                CategoryDisplay = "Rescue",
                OperationalArea = "Sedawatta Riverbank",
                Priority = PriorityLevel.Critical,
                Status = IncidentStatus.Assigned,
                VerificationStatus = "Verified",
                AssignedToUserId = resolvedCaseManagerId,
                AssignedStaffName = "I. Senanayake",
                CitizenId = resolvedCitizenId,
                AffectedPeople = 3,
                CurrentSafety = "Rooftop of single-story home",
                AccessibilityNeeds = "Non-swimmers, 1 infant",
                Description = "Trapped by rapid water level rise. Inflatable rescue boat needed immediately.",
                Latitude = 6.9480m,
                Longitude = 79.8880m,
                VerifiedAt = now.AddMinutes(-40),
                CreatedAt = now.AddMinutes(-75),
                CreatedBy = "System"
            };

            var inc1022 = new Incident
            {
                Id = Guid.Parse("aaaaaaaa-1022-4000-8000-000000001022"),
                CaseNumber = "HMR-1022",
                Title = "Water",
                Category = IncidentCategory.WaterAndSanitation,
                CategoryDisplay = "Water",
                OperationalArea = "Kolonnawa Center",
                Priority = PriorityLevel.Medium,
                Status = IncidentStatus.Resolved,
                VerificationStatus = "Verified",
                AssignedStaffName = "R. Perera",
                AffectedPeople = 12,
                CurrentSafety = "Temple relief center",
                AccessibilityNeeds = "None reported",
                Description = "Clean drinking water delivered by Red Cross mobile bowser.",
                Latitude = 6.9310m,
                Longitude = 79.8970m,
                VerifiedAt = now.AddHours(-3),
                CreatedAt = now.AddHours(-4),
                CreatedBy = "System"
            };

            var inc1019 = new Incident
            {
                Id = Guid.Parse("aaaaaaaa-1019-4000-8000-000000001019"),
                CaseNumber = "HMR-1019",
                Title = "Emergency Shelter",
                Category = IncidentCategory.EmergencyShelter,
                CategoryDisplay = "Emergency Shelter",
                OperationalArea = "Kelani East - Zone 03",
                Priority = PriorityLevel.Low,
                Status = IncidentStatus.Closed,
                VerificationStatus = "Duplicate",
                AssignedStaffName = "I. Senanayake",
                CitizenId = resolvedCitizenId,
                AffectedPeople = 2,
                CurrentSafety = "Self-evacuated to relatives",
                AccessibilityNeeds = "None",
                Description = "Duplicate submission of HMR-1042 by family member.",
                Latitude = 6.9555m,
                Longitude = 79.9225m,
                CreatedAt = now.AddMinutes(-5),
                CreatedBy = "System"
            };

            var incidents = new List<Incident> { inc1042, inc1039, inc1035, inc1036, inc1028, inc1022, inc1019 };
            await context.Incidents.AddRangeAsync(incidents);

            // Seed initial communications
            var comms = new List<IncidentCommunication>
            {
                new()
                {
                    IncidentId = inc1042.Id,
                    SenderUserId = resolvedCaseManagerId,
                    SenderName = "Ishara Senanayake",
                    SenderRole = "CaseManager",
                    RecipientWorkflow = "Resource & Logistics Manager",
                    Title = "Case Manager reviewed linked record",
                    Message = "Initial review of HMR-1042 shelter request completed.",
                    CaseTag = "HMR-1042 - authorised participants only",
                    IsInternal = true,
                    IsVisibleToCitizen = false,
                    SentAt = now.AddMinutes(-6)
                },
                new()
                {
                    IncidentId = inc1042.Id,
                    SenderUserId = resolvedCaseManagerId,
                    SenderName = "Ishara Senanayake",
                    SenderRole = "CaseManager",
                    RecipientWorkflow = "Shelter Coordinator",
                    Title = "Scoped handoff received",
                    Message = "Scoped handoff queued for Kelani East sector shelter coordinator.",
                    CaseTag = "HMR-1042 - authorised participants only",
                    IsInternal = true,
                    IsVisibleToCitizen = false,
                    SentAt = now.AddMinutes(-18)
                },
                new()
                {
                    IncidentId = inc1042.Id,
                    SenderUserId = resolvedCaseManagerId,
                    SenderName = "Ishara Senanayake",
                    SenderRole = "CaseManager",
                    RecipientWorkflow = "Citizen Notification Desk",
                    Title = "Citizen update prepared",
                    Message = "Your emergency shelter request HMR-1042 has been received and is under active review.",
                    CaseTag = "HMR-1042 - authorised participants only",
                    IsInternal = false,
                    IsVisibleToCitizen = true,
                    SentAt = now.AddMinutes(-32)
                },
                new()
                {
                    IncidentId = inc1042.Id,
                    SenderUserId = resolvedCaseManagerId,
                    SenderName = "System Decision Support",
                    SenderRole = "System",
                    RecipientWorkflow = "Case Manager",
                    Title = "Simulated recommendation generated",
                    Message = "DEMO-AI-2051 rule-based recommendation generated for human review.",
                    CaseTag = "HMR-1042 - authorised participants only",
                    IsInternal = true,
                    IsVisibleToCitizen = false,
                    SentAt = now.AddMinutes(-62)
                }
            };
            await context.IncidentCommunications.AddRangeAsync(comms);

            // Seed initial audit logs
            var auditLogs = new List<IncidentAuditLog>
            {
                new()
                {
                    IncidentId = inc1042.Id,
                    CaseNumber = "HMR-1042",
                    Action = "RecordUpdated",
                    Detail = "prototype record updated by authorised staff",
                    ActorUserId = resolvedCaseManagerId,
                    ActorName = "Ishara Senanayake",
                    ActorRole = "CaseManager",
                    IsInternal = true,
                    Timestamp = now.AddMinutes(-9)
                },
                new()
                {
                    IncidentId = inc1039.Id,
                    CaseNumber = "HMR-1039",
                    Action = "RecordUpdated",
                    Detail = "prototype record updated by authorised staff",
                    ActorUserId = resolvedCaseManagerId,
                    ActorName = "R. Perera",
                    ActorRole = "CaseManager",
                    IsInternal = true,
                    Timestamp = now.AddMinutes(-12)
                },
                new()
                {
                    IncidentId = inc1035.Id,
                    CaseNumber = "HMR-1035",
                    Action = "RecordUpdated",
                    Detail = "prototype record updated by authorised staff",
                    ActorUserId = resolvedCaseManagerId,
                    ActorName = "Ishara Senanayake",
                    ActorRole = "CaseManager",
                    IsInternal = true,
                    Timestamp = now.AddMinutes(-39)
                }
            };
            await context.IncidentAuditLogs.AddRangeAsync(auditLogs);

            await context.SaveChangesAsync();
        }

        // 11. Seed Initial Shelter Allocations
        if (!await context.ShelterAllocations.AnyAsync())
        {
            var sheltersList = await context.Shelters.Take(4).ToListAsync();
            if (sheltersList.Count > 0)
            {
                var allocations = new List<ShelterAllocation>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        ShelterId = sheltersList[0].Id,
                        PersonName = "Perera Family (4 members)",
                        NumberOfPersons = 4,
                        CheckInDate = DateTime.UtcNow.AddHours(-4),
                        Notes = "Step-free access (Elderly parent) | Diabetic medication refrigeration required"
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        ShelterId = sheltersList.Count > 1 ? sheltersList[1].Id : sheltersList[0].Id,
                        PersonName = "Silva Household (3 members)",
                        NumberOfPersons = 3,
                        CheckInDate = DateTime.UtcNow.AddHours(-3),
                        Notes = "Family areas (Infant 4 months) | Formula and baby cot provided in family wing"
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        ShelterId = sheltersList.Count > 2 ? sheltersList[2].Id : sheltersList[0].Id,
                        PersonName = "Gunasekara Family (5 members)",
                        NumberOfPersons = 5,
                        CheckInDate = DateTime.UtcNow.AddHours(-2),
                        Notes = "Medical support (Wheelchair user) | High-dependency assistance requested"
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        ShelterId = sheltersList.Count > 3 ? sheltersList[3].Id : sheltersList[0].Id,
                        PersonName = "Jayatissa Family (2 members)",
                        NumberOfPersons = 2,
                        CheckInDate = DateTime.UtcNow.AddHours(-1),
                        Notes = "Accessible toilets | Secondary triage confirmation completed"
                    }
                };

                await context.ShelterAllocations.AddRangeAsync(allocations);
                await context.SaveChangesAsync();
            }
        }

        // 12. Seed Shelter Resource Allocations
        if (!await context.ResourceAllocations.AnyAsync(r => r.ShelterId != null))
        {
            var sheltersList = await context.Shelters.Take(4).ToListAsync();
            var resourcesList = await context.Resources.Take(4).ToListAsync();
            if (sheltersList.Count > 0 && resourcesList.Count > 0)
            {
                var resourceRequests = new List<ResourceAllocation>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        ShelterId = sheltersList[0].Id,
                        ResourceId = resourcesList[0].Id,
                        Quantity = 60,
                        Priority = PriorityLevel.High,
                        DispatchStatus = 1, // Dispatched
                        DispatchedAt = DateTime.UtcNow.AddHours(-1),
                        Notes = "Bedding & Linens - 60 sleeping mats & blankets | Requested by Shelter Lead"
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        ShelterId = sheltersList.Count > 1 ? sheltersList[1].Id : sheltersList[0].Id,
                        ResourceId = resourcesList.Count > 1 ? resourcesList[1].Id : resourcesList[0].Id,
                        Quantity = 120,
                        Priority = PriorityLevel.Critical,
                        DispatchStatus = 0, // Pending / Approved
                        Notes = "Sanitation Kits - 120 Hygiene & Sanitation Packs | Urgent resupply"
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        ShelterId = sheltersList.Count > 2 ? sheltersList[2].Id : sheltersList[0].Id,
                        ResourceId = resourcesList.Count > 2 ? resourcesList[2].Id : resourcesList[0].Id,
                        Quantity = 40,
                        Priority = PriorityLevel.Medium,
                        DispatchStatus = 0, // Pending
                        Notes = "Baby Care & Nutrition - 40 Infant Formula & Diaper boxes"
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        ShelterId = sheltersList.Count > 3 ? sheltersList[3].Id : sheltersList[0].Id,
                        ResourceId = resourcesList.Count > 3 ? resourcesList[3].Id : resourcesList[0].Id,
                        Quantity = 5,
                        Priority = PriorityLevel.Critical,
                        DispatchStatus = 0, // Pending
                        Notes = "First Aid & Chronic Meds - 5 Emergency Medical Resupply Kits"
                    }
                };

                await context.ResourceAllocations.AddRangeAsync(resourceRequests);
                await context.SaveChangesAsync();
            }
        }
    }
}
