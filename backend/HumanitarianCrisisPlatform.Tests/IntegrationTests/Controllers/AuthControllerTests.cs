using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
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

    [Fact]
    public async Task Login_WithCaseManagerCredentials_ShouldGenerateJwtValidatedByJwtBearer()
    {
        var context = _fixture.CreateContext();
        var tokenGen = new JwtTokenGenerator(_fixture.Configuration);
        var controller = new AuthController(context, tokenGen);

        var loginResponse = await controller.Login(new LoginRequestDto
        {
            Email = "ishara.senanayake@reliefcore.org",
            Password = "Password123!"
        });

        var okResult = Assert.IsType<OkObjectResult>(loginResponse.Result);
        var res = Assert.IsAssignableFrom<Result<AuthResponseDto>>(okResult.Value);
        Assert.True(res.Succeeded);
        Assert.NotNull(res.Data);
        Assert.Equal("ishara.senanayake@reliefcore.org", res.Data.Email);
        Assert.Equal("CaseManager", res.Data.Role);
        Assert.False(string.IsNullOrWhiteSpace(res.Data.Token));

        var services = new Microsoft.Extensions.DependencyInjection.ServiceCollection();
        services.AddLogging();
        HumanitarianCrisisPlatform.API.Extensions.JwtAuthenticationExtensions.AddJwtAuthentication(services, _fixture.Configuration);
        using var provider = services.BuildServiceProvider();

        var jwtOptionsMonitor = Microsoft.Extensions.DependencyInjection.ServiceProviderServiceExtensions
            .GetRequiredService<Microsoft.Extensions.Options.IOptionsMonitor<Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerOptions>>(provider);
        var jwtOptions = jwtOptionsMonitor.Get(Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme);

        var jwtHandler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
        var parsedJwt = jwtHandler.ReadJwtToken(res.Data.Token);
        Assert.Equal(Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256, parsedJwt.Header.Alg);
        Assert.Equal(jwtOptions.TokenValidationParameters.IssuerSigningKey.KeyId, parsedJwt.Header.Kid);

        var jsonWebTokenHandler = new Microsoft.IdentityModel.JsonWebTokens.JsonWebTokenHandler();
        var validationResult = await jsonWebTokenHandler.ValidateTokenAsync(res.Data.Token, jwtOptions.TokenValidationParameters);
        Assert.True(validationResult.IsValid, validationResult.Exception?.ToString());

        var httpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext
        {
            RequestServices = provider
        };
        httpContext.Request.Headers.Authorization = $"Bearer {res.Data.Token}";

        var authService = Microsoft.Extensions.DependencyInjection.ServiceProviderServiceExtensions
            .GetRequiredService<Microsoft.AspNetCore.Authentication.IAuthenticationService>(provider);
        var authResult = await authService.AuthenticateAsync(
            httpContext,
            Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme);

        Assert.True(authResult.Succeeded, authResult.Failure?.ToString());
        Assert.NotNull(authResult.Principal);
        Assert.True(authResult.Principal!.IsInRole("CaseManager"));
    }

    [Fact]
    public void JwtSettings_WhenKeyNotConfigured_ShouldThrowInvalidOperationExceptionWithoutExposingSecrets()
    {
        var emptyConfig = new Microsoft.Extensions.Configuration.ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Issuer"] = "HumanitarianCrisisPlatform",
                ["Jwt:Audience"] = "HumanitarianCrisisPlatformClient"
            })
            .Build();

        var settings = JwtSettings.FromConfiguration(emptyConfig);
        Assert.Equal(string.Empty, settings.Key);

        var ex = Assert.Throws<InvalidOperationException>(() => settings.GetSigningKeyBytes());
        Assert.Contains("JWT signing key is not configured", ex.Message);
        Assert.Contains("User Secrets", ex.Message);
        Assert.Contains("Jwt__Key", ex.Message);
    }

    [Fact]
    public async Task JwtSettings_WhenConfiguredViaProductionEnvironmentVariable_ShouldLoadKeyAndValidateToken()
    {
        const string prodKey = "ProductionEnvironmentSecretKeyMinimum256BitsLong123456789";
        var prodConfig = new Microsoft.Extensions.Configuration.ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt__Key"] = prodKey,
                ["Jwt:Issuer"] = "HumanitarianCrisisPlatform",
                ["Jwt:Audience"] = "HumanitarianCrisisPlatformClient",
                ["Jwt:KeyId"] = "HumanAid-JwtSigningKey-v1"
            })
            .Build();

        var settings = JwtSettings.FromConfiguration(prodConfig);
        Assert.Equal(prodKey, settings.Key);

        var tokenGen = new JwtTokenGenerator(prodConfig);
        var testUser = new HumanitarianCrisisPlatform.Domain.Entities.User
        {
            Id = Guid.NewGuid(),
            Email = "coordinator.prod@reliefcore.org",
            FullName = "Production Coordinator",
            Role = UserRole.Coordinator
        };

        var token = tokenGen.GenerateToken(testUser);
        Assert.False(string.IsNullOrWhiteSpace(token));

        var validationParams = settings.CreateTokenValidationParameters();
        var handler = new Microsoft.IdentityModel.JsonWebTokens.JsonWebTokenHandler();
        var result = await handler.ValidateTokenAsync(token, validationParams);
        Assert.True(result.IsValid, result.Exception?.ToString());
    }

    [Fact]
    public async Task JwtSettings_WhenConfiguredViaStandardConfigOrUserSecrets_ShouldLoadKeyAndValidateToken()
    {
        const string devKey = "UserSecretsDevelopmentKeyMinimum256BitsLong123456789";
        var devConfig = new Microsoft.Extensions.Configuration.ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = devKey,
                ["Jwt:Issuer"] = "HumanitarianCrisisPlatform",
                ["Jwt:Audience"] = "HumanitarianCrisisPlatformClient",
                ["Jwt:KeyId"] = "HumanAid-JwtSigningKey-v1"
            })
            .Build();

        var settings = JwtSettings.FromConfiguration(devConfig);
        Assert.Equal(devKey, settings.Key);

        var tokenGen = new JwtTokenGenerator(devConfig);
        var testUser = new HumanitarianCrisisPlatform.Domain.Entities.User
        {
            Id = Guid.NewGuid(),
            Email = "casemanager.dev@reliefcore.org",
            FullName = "Dev CaseManager",
            Role = UserRole.CaseManager
        };

        var token = tokenGen.GenerateToken(testUser);
        Assert.False(string.IsNullOrWhiteSpace(token));

        var validationParams = settings.CreateTokenValidationParameters();
        var handler = new Microsoft.IdentityModel.JsonWebTokens.JsonWebTokenHandler();
        var result = await handler.ValidateTokenAsync(token, validationParams);
        Assert.True(result.IsValid, result.Exception?.ToString());
    }
}
