using Xunit;
using Microsoft.AspNetCore.Mvc;
using HumanitarianCrisisPlatform.API.Controllers;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Auth;
using HumanitarianCrisisPlatform.Tests.IntegrationTests.Infrastructure;
using HumanitarianCrisisPlatform.Infrastructure.Security;

namespace HumanitarianCrisisPlatform.Tests.IntegrationTests.Controllers;

public class AuthControllerTests : IClassFixture<DatabaseFixture>
{
    private readonly DatabaseFixture _fixture;

    public AuthControllerTests(DatabaseFixture fixture)
    {
        _fixture = fixture;
    }

    [Fact]
    public async Task Login_WithInvalidCredentials_ShouldReturnUnauthorized()
    {
        var context = _fixture.CreateContext();
        var tokenGen = new JwtTokenGenerator(_fixture.Configuration);
        var controller = new AuthController(context, tokenGen);

        var result = await controller.Login(new LoginRequestDto
        {
            Email = "nonexistent@crisisplatform.org",
            Password = "WrongPassword123"
        });

        var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result.Result);
        var res = Assert.IsAssignableFrom<Result<AuthResponseDto>>(unauthorized.Value);
        Assert.False(res.Succeeded);
    }
}
