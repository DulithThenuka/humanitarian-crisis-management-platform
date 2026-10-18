using System.Text.Json;
using HumanitarianCrisisPlatform.Application.DTOs.AI;
using HumanitarianCrisisPlatform.Application.Interfaces.Infrastructure;
using HumanitarianCrisisPlatform.Domain.Enums;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace HumanitarianCrisisPlatform.Infrastructure.AI;

public class OpenAIServiceClient : IAIServiceClient
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;
    private readonly ILogger<OpenAIServiceClient> _logger;
    private readonly RuleBasedFallbackAIService _fallbackService;

    public OpenAIServiceClient(
        HttpClient httpClient,
        IConfiguration config,
        ILogger<OpenAIServiceClient> logger,
        RuleBasedFallbackAIService fallbackService)
    {
        _httpClient = httpClient;
        _config = config;
        _logger = logger;
        _fallbackService = fallbackService;
    }

    public async Task<AIPriorityEvaluationDto> ClassifyUrgencyAsync(string text, string category, CancellationToken cancellationToken = default)
    {
        var apiKey = _config["OpenAI:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            _logger.LogWarning("OpenAI API key missing. Using rule-based fallback.");
            return await _fallbackService.ClassifyUrgencyAsync(text, category, cancellationToken);
        }

        try
        {
            // Simulated OpenAI prompt execution with resilience
            return await _fallbackService.ClassifyUrgencyAsync(text, category, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "OpenAI service call failed. Falling back to rule-based classifier.");
            return await _fallbackService.ClassifyUrgencyAsync(text, category, cancellationToken);
        }
    }

    public async Task<DuplicateDetectionResultDto> DetectDuplicateAsync(string text, IEnumerable<string> existingCases, CancellationToken cancellationToken = default)
    {
        return await _fallbackService.DetectDuplicateAsync(text, existingCases, cancellationToken);
    }
}
