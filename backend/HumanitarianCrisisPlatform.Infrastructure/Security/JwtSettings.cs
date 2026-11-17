using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace HumanitarianCrisisPlatform.Infrastructure.Security;

public sealed class JwtSettings
{
    public const string SectionName = "Jwt";
    public const string DefaultIssuer = "HumanitarianCrisisPlatform";
    public const string DefaultAudience = "HumanitarianCrisisPlatformClient";
    public const string DefaultKeyId = "HumanAid-JwtSigningKey-v1";
    public const int DefaultExpirationHours = 8;
    public const int DefaultClockSkewSeconds = 60;

    public string Key { get; set; } = string.Empty;
    public string KeyId { get; set; } = DefaultKeyId;
    public string Issuer { get; set; } = DefaultIssuer;
    public string Audience { get; set; } = DefaultAudience;
    public int ExpirationHours { get; set; } = DefaultExpirationHours;
    public int ClockSkewSeconds { get; set; } = DefaultClockSkewSeconds;

    public string EffectiveKey =>
        !string.IsNullOrWhiteSpace(Key) ? Key.Trim() : string.Empty;

    public string EffectiveKeyId =>
        !string.IsNullOrWhiteSpace(KeyId) ? KeyId.Trim() : DefaultKeyId;

    public string EffectiveIssuer =>
        !string.IsNullOrWhiteSpace(Issuer) ? Issuer.Trim() : DefaultIssuer;

    public string EffectiveAudience =>
        !string.IsNullOrWhiteSpace(Audience) ? Audience.Trim() : DefaultAudience;

    public int EffectiveExpirationHours =>
        ExpirationHours > 0 ? ExpirationHours : DefaultExpirationHours;

    public int EffectiveClockSkewSeconds =>
        ClockSkewSeconds >= 0 ? ClockSkewSeconds : DefaultClockSkewSeconds;

    public static JwtSettings FromConfiguration(IConfiguration? configuration)
    {
        if (configuration == null)
        {
            return new JwtSettings();
        }

        // Support configuration via:
        // 1. "Jwt:Key" (.NET configuration, User Secrets, or standard env vars)
        // 2. "Jwt__Key" (production environment variable format)
        var key = configuration["Jwt:Key"];
        if (string.IsNullOrWhiteSpace(key))
        {
            key = configuration["Jwt__Key"];
        }

        var keyId = configuration["Jwt:KeyId"];
        var issuer = configuration["Jwt:Issuer"];
        var audience = configuration["Jwt:Audience"];

        var expirationHours = DefaultExpirationHours;
        if (int.TryParse(configuration["Jwt:ExpirationHours"], out var parsedExp) && parsedExp > 0)
        {
            expirationHours = parsedExp;
        }

        var clockSkewSeconds = DefaultClockSkewSeconds;
        if (int.TryParse(configuration["Jwt:ClockSkewSeconds"], out var parsedSkew) && parsedSkew >= 0)
        {
            clockSkewSeconds = parsedSkew;
        }

        return new JwtSettings
        {
            Key = key?.Trim() ?? string.Empty,
            KeyId = !string.IsNullOrWhiteSpace(keyId) ? keyId.Trim() : DefaultKeyId,
            Issuer = !string.IsNullOrWhiteSpace(issuer) ? issuer.Trim() : DefaultIssuer,
            Audience = !string.IsNullOrWhiteSpace(audience) ? audience.Trim() : DefaultAudience,
            ExpirationHours = expirationHours,
            ClockSkewSeconds = clockSkewSeconds
        };
    }

    public byte[] GetSigningKeyBytes()
    {
        if (string.IsNullOrWhiteSpace(EffectiveKey))
        {
            throw new InvalidOperationException(
                "JWT signing key is not configured. Configure 'Jwt:Key' via .NET User Secrets in development or the 'Jwt__Key' environment variable in production.");
        }

        var keyBytes = Encoding.UTF8.GetBytes(EffectiveKey);
        if (keyBytes.Length < 32)
        {
            throw new InvalidOperationException("JWT signing key must be at least 256 bits (32 UTF-8 bytes) for HMAC-SHA256.");
        }

        return keyBytes;
    }

    public SymmetricSecurityKey CreateSymmetricSecurityKey(bool includeKeyId = true)
    {
        var securityKey = new SymmetricSecurityKey(GetSigningKeyBytes());
        if (includeKeyId)
        {
            securityKey.KeyId = EffectiveKeyId;
        }

        return securityKey;
    }

    public IReadOnlyList<SecurityKey> CreateValidationSecurityKeys()
    {
        return new SecurityKey[]
        {
            CreateSymmetricSecurityKey(includeKeyId: true),
            CreateSymmetricSecurityKey(includeKeyId: false)
        };
    }

    public TokenValidationParameters CreateTokenValidationParameters()
    {
        var primarySigningKey = CreateSymmetricSecurityKey(includeKeyId: true);
        var validationKeys = CreateValidationSecurityKeys();

        return new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = primarySigningKey,
            IssuerSigningKeys = validationKeys,
            IssuerSigningKeyResolver = (_, _, _, _) => validationKeys,
            RequireSignedTokens = true,
            ValidAlgorithms = new[] { SecurityAlgorithms.HmacSha256 },
            ValidateIssuer = true,
            ValidIssuer = EffectiveIssuer,
            ValidateAudience = true,
            ValidAudience = EffectiveAudience,
            ValidateLifetime = true,
            RequireExpirationTime = true,
            RoleClaimType = ClaimTypes.Role,
            NameClaimType = ClaimTypes.Name,
            ClockSkew = TimeSpan.FromSeconds(EffectiveClockSkewSeconds)
        };
    }

    public static string? NormalizeBearerToken(string? authorizationHeader)
    {
        if (string.IsNullOrWhiteSpace(authorizationHeader))
        {
            return null;
        }

        var token = authorizationHeader.Trim();

        // Strip one or more leading "Bearer" prefixes (case-insensitive) and surrounding quotes/whitespace
        while (true)
        {
            token = token.Trim().Trim('"', '\'').Trim();
            if (token.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase) ||
                token.StartsWith("Bearer\t", StringComparison.OrdinalIgnoreCase))
            {
                token = token.Substring("Bearer".Length).Trim();
                continue;
            }

            if (string.Equals(token, "Bearer", StringComparison.OrdinalIgnoreCase))
            {
                return null;
            }

            break;
        }

        return string.IsNullOrWhiteSpace(token) ? null : token;
    }
}
