using Xunit;
using Moq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
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
        serviceMock.Setup(s => s.GetAllAsync(null, null, null, It.IsAny<CancellationToken>()))
                   .ReturnsAsync(Result<IReadOnlyList<AssistanceRequestResponseDto>>.Success(new List<AssistanceRequestResponseDto>()));

        var controller = new AssistanceRequestsController(serviceMock.Object, coordinatorMock.Object);
        var httpContext = new DefaultHttpContext();
        httpContext.User = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Role, "Coordinator")
        }, "TestAuth"));
        controller.ControllerContext = new ControllerContext { HttpContext = httpContext };

        var actionResult = await controller.GetAll(null, null, null);

        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var result = Assert.IsAssignableFrom<Result<IReadOnlyList<AssistanceRequestResponseDto>>>(okResult.Value);
        Assert.True(result.Succeeded);
    }
}
