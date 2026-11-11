using Xunit;
using Microsoft.AspNetCore.Mvc;
using HumanitarianCrisisPlatform.API.Controllers;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Auth;
using HumanitarianCrisisPlatform.Domain.Enums;
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

    [Fact]
    public async Task Login_WithSeededCoordinatorCredentials_ShouldReturnSuccessAndToken()
    {
        var context = _fixture.CreateContext();
        var tokenGen = new JwtTokenGenerator(_fixture.Configuration);
        var controller = new AuthController(context, tokenGen);

        var result = await controller.Login(new LoginRequestDto
        {
            Email = "sarah.johnson@reliefcore.org",
            Password = "Password123!"
        });

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var res = Assert.IsAssignableFrom<Result<AuthResponseDto>>(okResult.Value);
        Assert.True(res.Succeeded);
        Assert.NotNull(res.Data);
        Assert.NotEmpty(res.Data.Token);
        Assert.Equal("sarah.johnson@reliefcore.org", res.Data.Email);
        Assert.Equal("Sarah Johnson", res.Data.FullName);
        Assert.Equal("Coordinator", res.Data.Role);
    }

    [Fact]
    public async Task Login_CaseInsensitiveEmail_ShouldSucceed()
    {
        var context = _fixture.CreateContext();
        var tokenGen = new JwtTokenGenerator(_fixture.Configuration);
        var controller = new AuthController(context, tokenGen);

        var result = await controller.Login(new LoginRequestDto
        {
            Email = "  AMARA.CHEN@RELIEFCORE.ORG  ",
            Password = "Password123!"
        });

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var res = Assert.IsAssignableFrom<Result<AuthResponseDto>>(okResult.Value);
        Assert.True(res.Succeeded);
        Assert.NotNull(res.Data);
        Assert.Equal("Amara Chen", res.Data.FullName);
        Assert.Equal("Coordinator", res.Data.Role);
    }

    [Fact]
    public async Task Register_NewUser_ShouldCreateUserAndReturnJwtToken()
    {
        var context = _fixture.CreateContext();
        var tokenGen = new JwtTokenGenerator(_fixture.Configuration);
        var controller = new AuthController(context, tokenGen);

        var registerDto = new RegisterRequestDto
        {
            FullName = "New Responder",
            Email = "responder.new@reliefcore.org",
            Password = "SecurePassword2026!",
            PhoneNumber = "+94 77 999 8888",
            Role = UserRole.Volunteer
        };

        var result = await controller.Register(registerDto);
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var res = Assert.IsAssignableFrom<Result<AuthResponseDto>>(okResult.Value);
        Assert.True(res.Succeeded);
        Assert.NotNull(res.Data);
        Assert.Equal("New Responder", res.Data.FullName);
        Assert.Equal("Volunteer", res.Data.Role);
        Assert.NotEmpty(res.Data.Token);

        // Verify login works with the new account
        var loginResult = await controller.Login(new LoginRequestDto
        {
            Email = "responder.new@reliefcore.org",
            Password = "SecurePassword2026!"
        });

        var loginOk = Assert.IsType<OkObjectResult>(loginResult.Result);
        var loginRes = Assert.IsAssignableFrom<Result<AuthResponseDto>>(loginOk.Value);
        Assert.True(loginRes.Succeeded);
        Assert.Equal("responder.new@reliefcore.org", loginRes.Data!.Email);
    }

    [Fact]
    public async Task Register_DuplicateEmail_ShouldReturnBadRequest()
    {
        var context = _fixture.CreateContext();
        var tokenGen = new JwtTokenGenerator(_fixture.Configuration);
        var controller = new AuthController(context, tokenGen);

        var registerDto = new RegisterRequestDto
        {
            FullName = "Sarah Duplicate",
            Email = "sarah.johnson@reliefcore.org",
            Password = "Password123!",
            Role = UserRole.Coordinator
        };

        // First register ensure seeded or register once
        await controller.Login(new LoginRequestDto { Email = "sarah.johnson@reliefcore.org", Password = "Password123!" });

        var result = await controller.Register(registerDto);
        var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
        var res = Assert.IsAssignableFrom<Result<AuthResponseDto>>(badRequest.Value);
        Assert.False(res.Succeeded);
    }
}
