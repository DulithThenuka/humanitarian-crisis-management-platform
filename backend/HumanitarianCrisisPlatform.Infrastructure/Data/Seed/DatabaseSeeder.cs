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
                    Role = UserRole.Citizen,
                    IsActive = true
                }
            };

            await context.Users.AddRangeAsync(users);
            await context.SaveChangesAsync();
        }

        // 2. Seed Crisis Event
        CrisisEvent? activeCrisis = null;
        if (!await context.CrisisEvents.AnyAsync())
        {
            activeCrisis = new CrisisEvent
            {
                Id = Guid.Parse("a1111111-1111-1111-1111-111111111111"),
                Title = "Western Province Monsoon Floods",
                Description = "Heavy monsoon downpours triggered flash flooding along the Kelani and Kalu Ganga river basins. Multi-agency evacuation, high-ground shelter placement, and emergency ration supply convoys are actively deployed.",
                DisasterType = DisasterType.Flood,
                Severity = 4,
                Latitude = 6.9271m,
                Longitude = 79.8612m,
                AffectedAreaRadius = 35.0m,
                StartDate = DateTime.UtcNow.AddDays(-3),
                IsActive = true
            };

            await context.CrisisEvents.AddAsync(activeCrisis);
            await context.SaveChangesAsync();
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
    }
}
