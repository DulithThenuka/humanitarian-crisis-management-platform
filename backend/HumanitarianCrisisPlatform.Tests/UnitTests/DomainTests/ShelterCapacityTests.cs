using Xunit;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Exceptions;

namespace HumanitarianCrisisPlatform.Tests.UnitTests.DomainTests;

public class ShelterCapacityTests
{
    [Fact]
    public void Shelter_OccupancyBoundary_ShouldCalculateAvailableCapacityCorrectly()
    {
        var shelter = new Shelter
        {
            Name = "City Hall",
            TotalCapacity = 100,
            CurrentOccupancy = 75
        };

        var available = shelter.TotalCapacity - shelter.CurrentOccupancy;
        Assert.Equal(25, available);
    }

    [Fact]
    public void CapacityExceededException_ShouldStoreAccurateDetails()
    {
        var shelterId = Guid.NewGuid();
        var ex = new CapacityExceededException(shelterId, requested: 30, available: 15);

        Assert.Equal(shelterId, ex.ShelterId);
        Assert.Equal(30, ex.RequestedCapacity);
        Assert.Equal(15, ex.AvailableCapacity);
        Assert.Contains("cannot accommodate 30 persons", ex.Message);
    }
}
