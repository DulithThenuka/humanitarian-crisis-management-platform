using Xunit;
using Moq;
using HumanitarianCrisisPlatform.Application.DTOs.Resources;
using HumanitarianCrisisPlatform.Application.Interfaces;
using HumanitarianCrisisPlatform.Application.Interfaces.Repositories;
using HumanitarianCrisisPlatform.Application.Services;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Exceptions;

namespace HumanitarianCrisisPlatform.Tests.UnitTests.ServiceTests;

public class AllocationServiceTests
{
    [Fact]
    public async Task DispatchAllocation_ShouldThrowWhenStockIsInsufficient()
    {
        var repoMock = new Mock<IResourceRepository>();
        var uowMock = new Mock<IUnitOfWork>();

        var resourceId = Guid.NewGuid();
        var resource = new Resource
        {
            Id = resourceId,
            Name = "First Aid Kits",
            TotalQuantity = 10,
            AllocatedQuantity = 8
        }; // Available is 2

        repoMock.Setup(r => r.GetByIdAsync(resourceId, default)).ReturnsAsync(resource);

        var service = new ResourceAllocationService(repoMock.Object, uowMock.Object);
        var dto = new AllocateResourceDto
        {
            ResourceId = resourceId,
            Quantity = 5
        };

        await Assert.ThrowsAsync<ResourceShortageException>(() => service.DispatchAllocationAsync(dto));
    }
}
