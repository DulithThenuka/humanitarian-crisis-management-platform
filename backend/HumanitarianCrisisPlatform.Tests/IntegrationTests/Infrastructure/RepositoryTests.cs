using Xunit;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Infrastructure.Repositories;
using HumanitarianCrisisPlatform.Tests.IntegrationTests.Infrastructure;

namespace HumanitarianCrisisPlatform.Tests.IntegrationTests.Infrastructure;

public class RepositoryTests : IClassFixture<DatabaseFixture>
{
    private readonly DatabaseFixture _fixture;

    public RepositoryTests(DatabaseFixture fixture)
    {
        _fixture = fixture;
    }

    [Fact]
    public async Task AddAndGetById_ShouldPersistShelterCorrectly()
    {
        using var context = _fixture.CreateContext();
        var repo = new ShelterRepository(context);

        var shelter = new Shelter
        {
            Name = "Emergency Camp Alpha",
            Address = "Sector 4, Southern Valley",
            Latitude = 6.0535m,
            Longitude = 80.2210m,
            TotalCapacity = 500,
            CurrentOccupancy = 120
        };

        await repo.AddAsync(shelter);
        await context.SaveChangesAsync();

        var retrieved = await repo.GetByIdAsync(shelter.Id);
        Assert.NotNull(retrieved);
        Assert.Equal("Emergency Camp Alpha", retrieved.Name);
        Assert.Equal(500, retrieved.TotalCapacity);
    }
}
