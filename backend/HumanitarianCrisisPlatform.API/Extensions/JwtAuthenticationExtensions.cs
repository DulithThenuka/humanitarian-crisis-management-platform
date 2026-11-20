using Microsoft.AspNetCore.Authentication.JwtBearer;
using HumanitarianCrisisPlatform.Infrastructure.Security;

namespace HumanitarianCrisisPlatform.API.Extensions;

public static class JwtAuthenticationExtensions
{
    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration config)
    {
        var jwtSettings = JwtSettings.FromConfiguration(config);
        services.AddSingleton(jwtSettings);

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = false;
            options.SaveToken = true;
            options.MapInboundClaims = true;
            options.TokenValidationParameters = jwtSettings.CreateTokenValidationParameters();
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    if (context.Request.Headers.TryGetValue("Authorization", out var authHeaderValues))
                    {
                        var normalizedToken = JwtSettings.NormalizeBearerToken(authHeaderValues.ToString());
                        if (!string.IsNullOrWhiteSpace(normalizedToken))
                        {
                            context.Token = normalizedToken;
                        }
                    }

                    return Task.CompletedTask;
                }
            };
        });

        services.AddAuthorization();

        return services;
    }
}
