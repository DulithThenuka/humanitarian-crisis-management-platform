using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Infrastructure.Security;

public class JwtTokenGenerator
{
    private readonly IConfiguration _config;

    public JwtTokenGenerator(IConfiguration config)
    {
        _config = config;
    }

    public JwtSettings GetSettings() => JwtSettings.FromConfiguration(_config);

    public DateTime GetExpirationUtc(DateTime? utcNow = null)
    {
        var settings = GetSettings();
        return (utcNow ?? DateTime.UtcNow).AddHours(settings.EffectiveExpirationHours);
    }

    public string GenerateToken(User user)
    {
        var settings = GetSettings();
        var key = settings.CreateSymmetricSecurityKey(includeKeyId: true);
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var nowUtc = DateTime.UtcNow;
        var expiresUtc = nowUtc.AddHours(settings.EffectiveExpirationHours);

        var claimsList = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("role", user.Role.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        if (user.Role == UserRole.LogisticsManager)
        {
            claimsList.Add(new Claim(ClaimTypes.Role, "ResourceManager"));
            claimsList.Add(new Claim(ClaimTypes.Role, "Logistics Manager"));
            claimsList.Add(new Claim(ClaimTypes.Role, "Resource Manager"));
            claimsList.Add(new Claim("role", "ResourceManager"));
        }

        var token = new JwtSecurityToken(
            issuer: settings.EffectiveIssuer,
            audience: settings.EffectiveAudience,
            claims: claimsList,
            notBefore: nowUtc,
            expires: expiresUtc,
            signingCredentials: creds
        );

        token.Header[JwtHeaderParameterNames.Kid] = settings.EffectiveKeyId;

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
