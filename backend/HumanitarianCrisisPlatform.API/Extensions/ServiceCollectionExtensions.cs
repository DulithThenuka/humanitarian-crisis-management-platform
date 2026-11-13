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
        // Database Configuration: supports InMemory or SQL Server
        var useInMemory = config.GetValue<bool>("UseInMemoryDatabase", false);
        var connectionString = config.GetConnectionString("DefaultConnection");

        if (useInMemory || string.IsNullOrWhiteSpace(connectionString))
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseInMemoryDatabase("HumanitarianCrisisDb"));
        }
        else
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(connectionString));
        }

        services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<ApplicationDbContext>());
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Repositories
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IAssistanceRequestRepository, AssistanceRequestRepository>();
        services.AddScoped<IShelterRepository, ShelterRepository>();
        services.AddScoped<IResourceRepository, ResourceRepository>();
        services.AddScoped<IAIDecisionAuditRepository, AIDecisionAuditRepository>();
        services.AddScoped<IIncidentRepository, IncidentRepository>();

        // Domain & Application Services
        services.AddScoped<IAssistanceRequestService, AssistanceRequestService>();
        services.AddScoped<IShelterService, ShelterService>();
        services.AddScoped<IResourceAllocationService, ResourceAllocationService>();
        services.AddScoped<IAIDecisionService, AIDecisionService>();
        services.AddScoped<VolunteerService>();
        services.AddScoped<IIncidentService, IncidentService>();
        services.AddScoped<ICaseAssignmentService, CaseAssignmentService>();
        services.AddScoped<IIncidentAIReviewService, IncidentAIReviewService>();
        services.AddScoped<IIncidentReportingService, IncidentReportingService>();
        services.AddScoped<IIncidentDuplicateDetectionService, RuleBasedIncidentDuplicateDetectionService>();

        // Infrastructure Services
        services.AddHttpClient<OpenAIServiceClient>();
        services.AddSingleton<RuleBasedFallbackAIService>();
        services.AddSingleton<IIncidentAIProvider, RuleBasedIncidentAIProvider>();
        services.AddScoped<IAIServiceClient, OpenAIServiceClient>();
        services.AddSingleton<IMappingService, OpenStreetMapService>();
        services.AddScoped<INotificationService, EmailNotificationService>();
        services.AddSingleton<IConfiguration>(config);
        services.AddSingleton(_ => new JwtTokenGenerator(config));

        return services;
    }
}
