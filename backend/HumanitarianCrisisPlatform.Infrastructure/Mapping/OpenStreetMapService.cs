using HumanitarianCrisisPlatform.Application.Interfaces.Infrastructure;

namespace HumanitarianCrisisPlatform.Infrastructure.Mapping;

public class OpenStreetMapService : IMappingService
{
    private const double EarthRadiusKm = 6371.0;

    public double CalculateDistanceKm(decimal lat1, decimal lon1, decimal lat2, decimal lon2)
    {
        var dLat = ToRadians((double)(lat2 - lat1));
        var dLon = ToRadians((double)(lon2 - lon1));

        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(ToRadians((double)lat1)) * Math.Cos(ToRadians((double)lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return Math.Round(EarthRadiusKm * c, 2);
    }

    public Task<(decimal Latitude, decimal Longitude)?> GeocodeAddressAsync(string address, CancellationToken cancellationToken = default)
    {
        // Default Sri Lanka coordinate baseline for demo/fallback
        return Task.FromResult<(decimal Latitude, decimal Longitude)?>((6.9271m, 79.8612m));
    }

    private static double ToRadians(double degrees) => degrees * Math.PI / 180.0;
}
