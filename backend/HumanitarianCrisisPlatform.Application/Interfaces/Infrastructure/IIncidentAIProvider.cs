using HumanitarianCrisisPlatform.Application.DTOs.Incidents;
using HumanitarianCrisisPlatform.Domain.Entities;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Infrastructure;

public interface IIncidentAIProvider
{
    Task<IncidentAIReview> GenerateRecommendationAsync(Incident incident, IReadOnlyList<Incident> existingIncidents, CancellationToken cancellationToken = default);
}

