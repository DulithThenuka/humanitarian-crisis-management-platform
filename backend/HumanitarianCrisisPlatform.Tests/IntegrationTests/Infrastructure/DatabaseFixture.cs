using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;

namespace HumanitarianCrisisPlatform.Tests.IntegrationTests.Infrastructure;

public class DatabaseFixture : IDisposable
{
    public IConfiguration Configuration { get; }

    public DatabaseFixture()
    {
        var inMemorySettings = new Dictionary<string, string?>
        {
            {"Jwt:Key", "TestSecretKeyForHumanitarianCrisisPlatformTestingPurposeOnly123456789"},
            {"Jwt:Issuer", "TestIssuer"},
            {"Jwt:Audience", "TestAudience"}
        };

        Configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();
    }

    public ApplicationDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }

    public void Dispose() { }
}
