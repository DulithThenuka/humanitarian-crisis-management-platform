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
        // Apply EF Core migrations for relational providers (SQL Server LocalDB);
        // keep EnsureCreatedAsync() for InMemory test providers.
        if (context.Database.IsRelational())
        {
            await context.Database.MigrateAsync();
        }
        else
        {
            await context.Database.EnsureCreatedAsync();
        }

        var defaultPasswordHash = PasswordHasher.HashPassword("Password123!");
        var caseManagerId = Guid.Parse("77777777-7777-7777-7777-777777777777");
        var citizenId = Guid.Parse("66666666-6666-6666-6666-666666666666");
        var volunteerUserId = Guid.Parse("55555555-5555-5555-5555-555555555555");

        // Seed Users if none exist
        if (!await context.Users.AnyAsync())
        {
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
                    Id = citizenId,
                    FullName = "Nimal Fernando",
                    Email = "citizen@reliefcore.org",
                    PasswordHash = defaultPasswordHash,
                    PhoneNumber = "+94 77 678 9012",
                    Role = UserRole.Citizen,
                    IsActive = true
                },
                new User
                {
                    Id = caseManagerId,
                    FullName = "Ishara Senanayake",
                    Email = "ishara.senanayake@reliefcore.org",
                    PasswordHash = defaultPasswordHash,
                    PhoneNumber = "+94 77 789 0123",
                    Role = UserRole.CaseManager,
                    IsActive = true
                }
            };

            await context.Users.AddRangeAsync(users);
            await context.SaveChangesAsync();
        }
        else if (!await context.Users.AnyAsync(u => u.Role == UserRole.CaseManager))
        {
            context.Users.Add(new User
            {
                Id = caseManagerId,
                FullName = "Ishara Senanayake",
                Email = "ishara.senanayake@reliefcore.org",
                PasswordHash = defaultPasswordHash,
                PhoneNumber = "+94 77 789 0123",
                Role = UserRole.CaseManager,
                IsActive = true
            });
            await context.SaveChangesAsync();
        }

        // Seed Crisis Events if none exist
        var floodCrisisId = Guid.Parse("f6a7b8c9-d0e1-2345-fabc-456789012345");
        var landslideCrisisId = Guid.Parse("a7b8c9d0-e1f2-3456-abcd-567890123456");
        var cycloneCrisisId = Guid.Parse("b8c9d0e1-f2a3-4567-bcde-678901234567");

        if (!await context.CrisisEvents.AnyAsync())
        {
            var crisisEvents = new List<CrisisEvent>
            {
                new()
                {
                    Id = floodCrisisId,
                    Title = "2024 Southern Province Floods",
                    Description = "Severe flooding across the Southern Province affecting multiple districts. Major river systems have overflowed causing widespread displacement.",
                    DisasterType = DisasterType.Flood,
                    Severity = 4,
                    Latitude = 6.0535m,
                    Longitude = 80.2210m,
                    AffectedAreaRadius = 50.00m,
                    StartDate = new DateTime(2024, 5, 15, 6, 0, 0, DateTimeKind.Utc),
                    IsActive = true
                },
                new()
                {
                    Id = landslideCrisisId,
                    Title = "Badulla District Landslide",
                    Description = "Multiple landslides triggered by heavy monsoon rains in the Badulla District hill country region.",
                    DisasterType = DisasterType.Landslide,
                    Severity = 3,
                    Latitude = 6.9934m,
                    Longitude = 81.0550m,
                    AffectedAreaRadius = 15.00m,
                    StartDate = new DateTime(2024, 6, 20, 14, 30, 0, DateTimeKind.Utc),
                    IsActive = true
                },
                new()
                {
                    Id = cycloneCrisisId,
                    Title = "Eastern Coast Cyclone Warning",
                    Description = "Category 2 tropical cyclone approaching the eastern coastline with expected landfall within 48 hours.",
                    DisasterType = DisasterType.Storm,
                    Severity = 5,
                    Latitude = 7.8731m,
                    Longitude = 81.6747m,
                    AffectedAreaRadius = 100.00m,
                    StartDate = new DateTime(2024, 7, 10, 0, 0, 0, DateTimeKind.Utc),
                    IsActive = false
                }
            };
            await context.CrisisEvents.AddRangeAsync(crisisEvents);
            await context.SaveChangesAsync();
        }

        // Seed Shelters if none exist
        if (!await context.Shelters.AnyAsync())
        {
            var shelters = new List<Shelter>
            {
                new()
                {
                    Id = Guid.Parse("10000000-0000-0000-0000-000000000001"),
                    Name = "Galle Community Hall Shelter",
                    Address = "Main Street, Galle, Southern Province",
                    Latitude = 6.0329m,
                    Longitude = 80.2168m,
                    TotalCapacity = 200,
                    CurrentOccupancy = 45,
                    Facilities = "[\"Water Supply\",\"First Aid\",\"Toilets\",\"Kitchen\",\"Electricity\",\"WiFi\"]",
                    ContactPhone = "+94912234567",
                    IsActive = true,
                    CrisisEventId = floodCrisisId
                },
                new()
                {
                    Id = Guid.Parse("10000000-0000-0000-0000-000000000002"),
                    Name = "Matara Public School Shelter",
                    Address = "School Lane, Matara, Southern Province",
                    Latitude = 5.9485m,
                    Longitude = 80.5353m,
                    TotalCapacity = 150,
                    CurrentOccupancy = 80,
                    Facilities = "[\"Water Supply\",\"First Aid\",\"Toilets\",\"Electricity\"]",
                    ContactPhone = "+94412345678",
                    IsActive = true,
                    CrisisEventId = floodCrisisId
                },
                new()
                {
                    Id = Guid.Parse("10000000-0000-0000-0000-000000000003"),
                    Name = "Badulla Town Hall Emergency Centre",
                    Address = "Town Hall Road, Badulla",
                    Latitude = 6.9934m,
                    Longitude = 81.0550m,
                    TotalCapacity = 100,
                    CurrentOccupancy = 25,
                    Facilities = "[\"Water Supply\",\"First Aid\",\"Toilets\",\"Kitchen\"]",
                    ContactPhone = "+94552345678",
                    IsActive = true,
                    CrisisEventId = landslideCrisisId
                }
            };
            await context.Shelters.AddRangeAsync(shelters);
            await context.SaveChangesAsync();
        }

        // Seed Resources if none exist
        if (!await context.Resources.AnyAsync())
        {
            var resources = new List<Resource>
            {
                new() { Id = Guid.Parse("20000000-0000-0000-0000-000000000001"), Name = "Drinking Water Bottles (500ml)", Category = "Water", Unit = "Units", TotalQuantity = 10000m, AllocatedQuantity = 2500m, MinimumThreshold = 1000m, WarehouseLocation = "Central Warehouse, Colombo" },
                new() { Id = Guid.Parse("20000000-0000-0000-0000-000000000002"), Name = "Rice (50kg Bags)", Category = "Food", Unit = "Bags", TotalQuantity = 500m, AllocatedQuantity = 120m, MinimumThreshold = 50m, WarehouseLocation = "Central Warehouse, Colombo" },
                new() { Id = Guid.Parse("20000000-0000-0000-0000-000000000003"), Name = "First Aid Kits", Category = "Medicine", Unit = "Units", TotalQuantity = 300m, AllocatedQuantity = 75m, MinimumThreshold = 30m, WarehouseLocation = "Medical Supplies Depot, Kandy" },
                new() { Id = Guid.Parse("20000000-0000-0000-0000-000000000004"), Name = "Emergency Blankets", Category = "Equipment", Unit = "Units", TotalQuantity = 2000m, AllocatedQuantity = 400m, MinimumThreshold = 200m, WarehouseLocation = "Central Warehouse, Colombo" },
                new() { Id = Guid.Parse("20000000-0000-0000-0000-000000000005"), Name = "Paracetamol (500mg)", Category = "Medicine", Unit = "Boxes", TotalQuantity = 1000m, AllocatedQuantity = 150m, MinimumThreshold = 100m, WarehouseLocation = "Medical Supplies Depot, Kandy" },
                new() { Id = Guid.Parse("20000000-0000-0000-0000-000000000006"), Name = "Tarpaulin Sheets", Category = "Equipment", Unit = "Units", TotalQuantity = 800m, AllocatedQuantity = 200m, MinimumThreshold = 100m, WarehouseLocation = "Logistics Hub, Galle" }
            };
            await context.Resources.AddRangeAsync(resources);
            await context.SaveChangesAsync();
        }

        // Seed Volunteers if none exist
        if (!await context.Volunteers.AnyAsync())
        {
            var resolvedVolunteerUserId = await context.Users
                .Where(u => u.Role == UserRole.Volunteer)
                .Select(u => (Guid?)u.Id)
                .FirstOrDefaultAsync();

            if (resolvedVolunteerUserId.HasValue)
            {
                context.Volunteers.Add(new Volunteer
                {
                    Id = Guid.Parse("30000000-0000-0000-0000-000000000001"),
                    UserId = resolvedVolunteerUserId.Value,
                    Skills = "[\"First Aid\",\"Search and Rescue\",\"Driving\",\"Translation (Sinhala/Tamil/English)\"]",
                    Availability = "{\"monday\":\"09:00-17:00\",\"tuesday\":\"09:00-17:00\",\"wednesday\":\"09:00-17:00\",\"thursday\":\"09:00-17:00\",\"friday\":\"09:00-17:00\",\"saturday\":\"10:00-14:00\",\"sunday\":\"unavailable\"}",
                    IsAvailable = true,
                    Latitude = 6.9271m,
                    Longitude = 79.8612m,
                    MaxTravelDistance = 50.00m
                });
                await context.SaveChangesAsync();
            }
        }

        // Seed Initial Incident / Case Manager Records if none exist
        if (!await context.Incidents.AnyAsync())
        {
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
                AffectedPeople = 9,
                CurrentSafety = "Cut off by water surge",
                AccessibilityNeeds = "Wheelchair user in group",
                Description = "Boat rescue needed. Ground floor flooded 4 feet deep.",
                Latitude = 6.9090m,
                Longitude = 80.0840m,
                VerifiedAt = now.AddMinutes(-40),
                EscalatedAt = now.AddMinutes(-30),
                CreatedAt = now.AddMinutes(-55),
                CreatedBy = "System"
            };

            await context.Incidents.AddRangeAsync(inc1042, inc1039, inc1035, inc1036);

            // Seed initial AI reviews
            var aiReviews = new List<IncidentAIReview>
            {
                new()
                {
                    IncidentId = inc1042.Id,
                    ReferenceCode = "DEMO-AI-2051",
                    RecommendedCategory = "Emergency Shelter",
                    RecommendedPriority = PriorityLevel.Critical,
                    UrgencyAssessment = "Classify as shelter · critical priority",
                    ConfidenceScore = 0.88m,
                    Reasoning = "Rule-based demonstration analysis: flood water ingress with two children and an older adult with limited mobility.",
                    RecommendedNextActions = "Verify household head count and mobility constraints;Confirm accessible shelter capacity in Kelani East - Zone 03;Record human decision before dispatching handoff",
                    DuplicateSuggestionCaseNumber = "HMR-1039",
                    DuplicateSimilarityScore = 0.22m,
                    IsRuleBasedDemonstration = true,
                    ProviderLabel = "Rule-Based Demonstration Decision Support"
                },
                new()
                {
                    IncidentId = inc1039.Id,
                    ReferenceCode = "DEMO-AI-2052",
                    RecommendedCategory = "Medicine",
                    RecommendedPriority = PriorityLevel.Critical,
                    UrgencyAssessment = "Classify as medical support · critical priority",
                    ConfidenceScore = 0.91m,
                    Reasoning = "Rule-based demonstration analysis: time-critical insulin dependency with submerged cold storage.",
                    RecommendedNextActions = "Verify cold-chain medication specification;Coordinate with Medical Dispatch Unit",
                    DuplicateSuggestionCaseNumber = "HMR-1042",
                    DuplicateSimilarityScore = 0.22m,
                    IsRuleBasedDemonstration = true,
                    ProviderLabel = "Rule-Based Demonstration Decision Support"
                }
            };
            await context.IncidentAIReviews.AddRangeAsync(aiReviews);

            // Seed initial communications for HMR-1042
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
    }
}
