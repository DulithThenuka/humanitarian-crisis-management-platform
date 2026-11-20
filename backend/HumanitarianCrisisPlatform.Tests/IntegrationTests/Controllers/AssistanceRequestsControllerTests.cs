using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using HumanitarianCrisisPlatform.API.Controllers;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Requests;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;

namespace HumanitarianCrisisPlatform.Tests.IntegrationTests.Controllers;

public class AssistanceRequestsControllerTests
{
    [Fact]
    public async Task GetAll_ShouldReturnOkWithList()
    {
        var serviceMock = new Mock<IAssistanceRequestService>();
        var coordinatorMock = new Mock<ICoordinatorService>();
        serviceMock.Setup(s => s.GetAllAsync(null, null, default))
                   .ReturnsAsync(Result<IReadOnlyList<AssistanceRequestResponseDto>>.Success(new List<AssistanceRequestResponseDto>()));

        var controller = new AssistanceRequestsController(serviceMock.Object, coordinatorMock.Object);
        var actionResult = await controller.GetAll(null, null);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<IReadOnlyList<AssistanceRequestResponseDto>>>(okResult.Value);
        Assert.True(result.Succeeded);
    }
}
