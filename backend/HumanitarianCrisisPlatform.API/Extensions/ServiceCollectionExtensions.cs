using Microsoft.EntityFrameworkCore;
using HumanitarianCrisisPlatform.Application.Common.Interfaces;
using HumanitarianCrisisPlatform.Application.Interfaces;
using HumanitarianCrisisPlatform.Application.Interfaces.Infrastructure;
using HumanitarianCrisisPlatform.Application.Interfaces.Repositories;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;
using HumanitarianCrisisPlatform.Application.Services;
using HumanitarianCrisisPlatform.Infrastructure.AI;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;
using HumanitarianCrisisPlatform.Infrastructure.Mapping;
using HumanitarianCrisisPlatform.Infrastructure.Notifications;
using HumanitarianCrisisPlatform.Infrastructure.Repositories;
using HumanitarianCrisisPlatform.Infrastructure.Security;

namespace HumanitarianCrisisPlatform.API.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
    {
        // Database
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(config.GetConnectionString("DefaultConnection") ?? "Server=(localdb)\\mssqllocaldb;Database=HumanitarianCrisisDb;Trusted_Connection=True;MultipleActiveResultSets=true"));

        services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<ApplicationDbContext>());
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Repositories
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IAssistanceRequestRepository, AssistanceRequestRepository>();
        services.AddScoped<IShelterRepository, ShelterRepository>();
        services.AddScoped<IResourceRepository, ResourceRepository>();
        services.AddScoped<IAIDecisionAuditRepository, AIDecisionAuditRepository>();

        // Domain & Application Services
        services.AddScoped<IAssistanceRequestService, AssistanceRequestService>();
        services.AddScoped<IShelterService, ShelterService>();
        services.AddScoped<IResourceAllocationService, ResourceAllocationService>();
        services.AddScoped<IAIDecisionService, AIDecisionService>();
        services.AddScoped<VolunteerService>();

        // Infrastructure Services
        services.AddHttpClient<OpenAIServiceClient>();
        services.AddSingleton<RuleBasedFallbackAIService>();
        services.AddScoped<IAIServiceClient, OpenAIServiceClient>();
        services.AddSingleton<IMappingService, OpenStreetMapService>();
        services.AddScoped<INotificationService, EmailNotificationService>();
        services.AddSingleton<JwtTokenGenerator>();

        return services;
    }
}
