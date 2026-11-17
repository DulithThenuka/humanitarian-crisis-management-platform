using Microsoft.OpenApi.Models;
using HumanitarianCrisisPlatform.API.Extensions;
using HumanitarianCrisisPlatform.API.Filters;
using HumanitarianCrisisPlatform.API.Middleware;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;
using HumanitarianCrisisPlatform.Infrastructure.Data.Seed;

var builder = WebApplication.CreateBuilder(args);

// Ensure appsettings from the assembly base directory are loaded even if the process
// is launched from the solution or repository root directory.
var baseDirSettings = Path.Combine(AppContext.BaseDirectory, "appsettings.json");
if (!File.Exists(Path.Combine(builder.Environment.ContentRootPath, "appsettings.json")) && File.Exists(baseDirSettings))
{
    builder.Configuration.AddJsonFile(baseDirSettings, optional: true, reloadOnChange: false);
    var baseDirEnvSettings = Path.Combine(AppContext.BaseDirectory, $"appsettings.{builder.Environment.EnvironmentName}.json");
    if (File.Exists(baseDirEnvSettings))
    {
        builder.Configuration.AddJsonFile(baseDirEnvSettings, optional: true, reloadOnChange: false);
    }
}

// In Development, ensure .NET User Secrets are registered
if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddUserSecrets<Program>(optional: true);
}

// Ensure Environment Variables (supporting production Jwt__Key) are registered
builder.Configuration.AddEnvironmentVariables();

// Add services
builder.Services.AddControllers(options =>
{
    options.Filters.Add<ModelValidationFilter>();
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "RELIEFCORE Humanitarian Operations API",
        Version = "v1",
        Description = "Backend services for crisis management, authentication, triage, and resource allocation."
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Clean Architecture registrations
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddJwtAuthentication(builder.Configuration);

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Automatically seed database and ensure operational accounts exist
using (var scope = app.Services.CreateScope())
{
    try
    {
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await DatabaseSeeder.SeedAsync(context);
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding initial database users.");
    }
}

if (app.Environment.IsDevelopment() || true)
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "RELIEFCORE Humanitarian API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseMiddleware<RequestRateLimitingMiddleware>();

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

public partial class Program { }
