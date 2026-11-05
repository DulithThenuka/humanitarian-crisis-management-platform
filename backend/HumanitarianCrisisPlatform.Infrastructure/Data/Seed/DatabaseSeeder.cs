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

        // Seed Users if none exist
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
    }
}
