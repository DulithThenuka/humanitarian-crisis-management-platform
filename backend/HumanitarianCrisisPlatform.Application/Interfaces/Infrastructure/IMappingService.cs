namespace HumanitarianCrisisPlatform.Application.Interfaces.Infrastructure;

public interface IMappingService
{
    double CalculateDistanceKm(decimal lat1, decimal lon1, decimal lat2, decimal lon2);
    Task<(decimal Latitude, decimal Longitude)?> GeocodeAddressAsync(string address, CancellationToken cancellationToken = default);
}
