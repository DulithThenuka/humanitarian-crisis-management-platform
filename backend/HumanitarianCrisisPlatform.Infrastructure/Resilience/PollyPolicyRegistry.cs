using Polly;
using Polly.Retry;
using Microsoft.Extensions.Logging;

namespace HumanitarianCrisisPlatform.Infrastructure.Resilience;

public static class PollyPolicyRegistry
{
    public static AsyncRetryPolicy CreateHttpRetryPolicy(ILogger logger)
    {
        return Policy
            .Handle<HttpRequestException>()
            .Or<TimeoutException>()
            .WaitAndRetryAsync(
                3,
                retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)),
                (exception, timeSpan, retryCount, context) =>
                {
                    logger.LogWarning("Retry {RetryCount} after {Delay}s due to: {Message}",
                        retryCount, timeSpan.TotalSeconds, exception.Message);
                });
    }
}
