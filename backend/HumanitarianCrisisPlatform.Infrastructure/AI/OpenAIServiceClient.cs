using System.Diagnostics;
using System.Net.Http.Headers;
using System.Text;
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

    private string? GetApiKey()
    {
        var key = _config["OpenAI:ApiKey"];
        if (string.IsNullOrWhiteSpace(key))
            key = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
        return string.IsNullOrWhiteSpace(key) ? null : key.Trim();
    }

    public async Task<AIProviderStatusDto> GetProviderStatusAsync(CancellationToken cancellationToken = default)
    {
        var apiKey = GetApiKey();
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            return new AIProviderStatusDto
            {
                IsConnected = false,
                Provider = "OpenAI",
                Model = "gpt-4o-mini",
                Status = "CONFIG_REQUIRED",
                Message = "OpenAI API key not configured in appsettings.json or OPENAI_API_KEY environment variable. Operating in deterministic rule-based decision governance.",
                CheckedAt = DateTime.UtcNow
            };
        }

        try
        {
            using var request = new HttpRequestMessage(HttpMethod.Get, "https://api.openai.com/v1/models");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            using var response = await _httpClient.SendAsync(request, cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                return new AIProviderStatusDto
                {
                    IsConnected = true,
                    Provider = "OpenAI",
                    Model = "gpt-4o-mini",
                    Status = "ONLINE",
                    Message = "Connected to OpenAI API. Live structured intelligence active with human safety governance.",
                    CheckedAt = DateTime.UtcNow
                };
            }

            return new AIProviderStatusDto
            {
                IsConnected = false,
                Provider = "OpenAI",
                Model = "gpt-4o-mini",
                Status = "ERROR",
                Message = $"OpenAI responded with HTTP {(int)response.StatusCode} ({response.ReasonPhrase}). Falling back to rule-based governance.",
                CheckedAt = DateTime.UtcNow
            };
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to connect to OpenAI API endpoint.");
            return new AIProviderStatusDto
            {
                IsConnected = false,
                Provider = "OpenAI",
                Model = "gpt-4o-mini",
                Status = "OFFLINE",
                Message = $"OpenAI endpoint unreachable ({ex.Message}). Operating under transparent rule-based fallback.",
                CheckedAt = DateTime.UtcNow
            };
        }
    }

    public async Task<AIPriorityEvaluationDto> ClassifyUrgencyAsync(string text, string category, CancellationToken cancellationToken = default)
    {
        var apiKey = GetApiKey();
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            return await _fallbackService.ClassifyUrgencyAsync(text, category, cancellationToken);
        }

        try
        {
            var systemPrompt = "You are an AI decision-support assistant for humanitarian emergency triage. Evaluate the situation narrative and return a JSON object with: priority (Critical, High, Medium, or Low), priorityScore (0-100 decimal), confidenceScore (0.0-1.0 decimal), and reasoning (concise explanation). Never decide final assistance independently.";
            var userPrompt = $"Category: {category}\nCitizen Narrative: {text}";

            var jsonResult = await CallOpenAIStructuredAsync(apiKey, systemPrompt, userPrompt, cancellationToken);
            if (jsonResult != null)
            {
                using var doc = JsonDocument.Parse(jsonResult);
                var root = doc.RootElement;

                var prioStr = root.TryGetProperty("priority", out var pElem) ? pElem.GetString() : "Medium";
                var score = root.TryGetProperty("priorityScore", out var sElem) && sElem.TryGetDecimal(out var sVal) ? sVal : 50m;
                
                decimal? conf = null;
                if (root.TryGetProperty("confidenceScore", out var cElem) && cElem.ValueKind == JsonValueKind.Number && cElem.TryGetDecimal(out var parsedConf))
                {
                    if (parsedConf >= 0m && parsedConf <= 1m)
                    {
                        conf = parsedConf;
                    }
                    else if (parsedConf > 1m && parsedConf <= 100m)
                    {
                        conf = Math.Round(parsedConf / 100m, 4);
                    }
                }
                else if (root.TryGetProperty("confidence", out var altConfElem) && altConfElem.ValueKind == JsonValueKind.Number && altConfElem.TryGetDecimal(out var parsedAltConf))
                {
                    if (parsedAltConf >= 0m && parsedAltConf <= 1m)
                    {
                        conf = parsedAltConf;
                    }
                    else if (parsedAltConf > 1m && parsedAltConf <= 100m)
                    {
                        conf = Math.Round(parsedAltConf / 100m, 4);
                    }
                }

                var reason = root.TryGetProperty("reasoning", out var rElem) ? rElem.GetString() : "Evaluated by OpenAI decision support.";

                if (!Enum.TryParse<PriorityLevel>(prioStr, true, out var parsedPriority))
                    parsedPriority = PriorityLevel.Medium;

                return new AIPriorityEvaluationDto
                {
                    RecommendedPriority = parsedPriority,
                    PriorityScore = score,
                    ConfidenceScore = conf,
                    Reasoning = reason ?? "Evaluated by OpenAI."
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "OpenAI ClassifyUrgencyAsync failed. Falling back to rule-based engine.");
        }

        return await _fallbackService.ClassifyUrgencyAsync(text, category, cancellationToken);
    }

    public async Task<DuplicateDetectionResultDto> DetectDuplicateAsync(string text, IEnumerable<string> existingCases, CancellationToken cancellationToken = default)
    {
        var apiKey = GetApiKey();
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            return await _fallbackService.DetectDuplicateAsync(text, existingCases, cancellationToken);
        }

        try
        {
            var existingList = existingCases.Take(5).ToList();
            if (!existingList.Any())
            {
                return new DuplicateDetectionResultDto { IsDuplicate = false, SimilarityScore = 0m, Reason = "No existing records to compare." };
            }

            var systemPrompt = "You are an emergency duplicate detection assistant. Compare the new request against existing reports. Return JSON with: isDuplicate (boolean), similarityScore (0.0 to 1.0), reason (string explaining semantic similarity or distinction).";
            var userPrompt = $"New report:\n{text}\n\nExisting candidate reports:\n" + string.Join("\n---\n", existingList);

            var jsonResult = await CallOpenAIStructuredAsync(apiKey, systemPrompt, userPrompt, cancellationToken);
            if (jsonResult != null)
            {
                using var doc = JsonDocument.Parse(jsonResult);
                var root = doc.RootElement;
                return new DuplicateDetectionResultDto
                {
                    IsDuplicate = root.TryGetProperty("isDuplicate", out var dElem) && dElem.GetBoolean(),
                    SimilarityScore = root.TryGetProperty("similarityScore", out var sElem) ? sElem.GetDecimal() : 0m,
                    Reason = root.TryGetProperty("reason", out var rElem) ? (rElem.GetString() ?? "Analyzed by OpenAI.") : "Analyzed by OpenAI."
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "OpenAI DetectDuplicateAsync failed. Falling back to rule-based engine.");
        }

        return await _fallbackService.DetectDuplicateAsync(text, existingCases, cancellationToken);
    }

    public async Task<WorkspaceServiceResultDto> ExecuteServiceAsync(
        string serviceId,
        ExecuteWorkspaceServiceDto input,
        object? databaseContext = null,
        CancellationToken cancellationToken = default)
    {
        var apiKey = GetApiKey();
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            return await _fallbackService.ExecuteServiceAsync(serviceId, input, databaseContext, cancellationToken);
        }

        var sw = Stopwatch.StartNew();
        try
        {
            var systemPrompt = $"You are a specialized humanitarian AI microservice for '{serviceId}'. Process the request and return JSON with: outputTitle (string), outputSummary (string), confidencePercent (integer 1-100), and riskFlags (array of strings).";
            var userPrompt = $"Input text: {input.InputText}\nCategory: {input.Category}\nRelated Case: {input.RelatedCaseNumber}";

            var jsonResult = await CallOpenAIStructuredAsync(apiKey, systemPrompt, userPrompt, cancellationToken);
            sw.Stop();

            if (jsonResult != null)
            {
                using var doc = JsonDocument.Parse(jsonResult);
                var root = doc.RootElement;

                var flags = new List<string>();
                if (root.TryGetProperty("riskFlags", out var fElem) && fElem.ValueKind == JsonValueKind.Array)
                {
                    foreach (var item in fElem.EnumerateArray())
                    {
                        var str = item.GetString();
                        if (!string.IsNullOrWhiteSpace(str)) flags.Add(str);
                    }
                }

                int? confPercent = null;
                if (root.TryGetProperty("confidencePercent", out var cElem) && cElem.ValueKind == JsonValueKind.Number && cElem.TryGetInt32(out var parsedInt))
                {
                    if (parsedInt >= 0 && parsedInt <= 100)
                    {
                        confPercent = parsedInt;
                    }
                }
                else if (root.TryGetProperty("confidenceScore", out var csElem) && csElem.ValueKind == JsonValueKind.Number && csElem.TryGetDecimal(out var parsedScore))
                {
                    if (parsedScore >= 0m && parsedScore <= 1m)
                    {
                        confPercent = (int)Math.Round(parsedScore * 100m);
                    }
                    else if (parsedScore > 1m && parsedScore <= 100m)
                    {
                        confPercent = (int)Math.Round(parsedScore);
                    }
                }
                else if (root.TryGetProperty("confidence", out var altElem) && altElem.ValueKind == JsonValueKind.Number && altElem.TryGetDecimal(out var parsedAltVal))
                {
                    if (parsedAltVal >= 0m && parsedAltVal <= 1m)
                    {
                        confPercent = (int)Math.Round(parsedAltVal * 100m);
                    }
                    else if (parsedAltVal > 1m && parsedAltVal <= 100m)
                    {
                        confPercent = (int)Math.Round(parsedAltVal);
                    }
                }

                return new WorkspaceServiceResultDto
                {
                    ServiceId = serviceId,
                    ServiceName = serviceId,
                    IsAIExecuted = true,
                    Provider = "OpenAI",
                    Model = "gpt-4o-mini",
                    ExecutionTimeMs = (int)sw.ElapsedMilliseconds,
                    ConfidencePercent = confPercent,
                    OutputTitle = root.TryGetProperty("outputTitle", out var tElem) ? (tElem.GetString() ?? "Processed by OpenAI") : "Processed by OpenAI",
                    OutputSummary = root.TryGetProperty("outputSummary", out var sElem) ? (sElem.GetString() ?? "") : "",
                    RiskFlags = flags,
                    StructuredData = jsonResult
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "OpenAI ExecuteServiceAsync failed for {ServiceId}. Falling back to rule-based engine.", serviceId);
        }

        return await _fallbackService.ExecuteServiceAsync(serviceId, input, databaseContext, cancellationToken);
    }

    private async Task<string?> CallOpenAIStructuredAsync(
        string apiKey,
        string systemPrompt,
        string userPrompt,
        CancellationToken cancellationToken)
    {
        var payload = new
        {
            model = "gpt-4o-mini",
            response_format = new { type = "json_object" },
            messages = new[]
            {
                new { role = "system", content = systemPrompt },
                new { role = "user", content = userPrompt }
            },
            temperature = 0.2
        };

        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions")
        {
            Content = content
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

        using var response = await _httpClient.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            var err = await response.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogWarning("OpenAI chat completion returned HTTP {Status}: {Error}", response.StatusCode, err);
            return null;
        }

        var respString = await response.Content.ReadAsStringAsync(cancellationToken);
        using var doc = JsonDocument.Parse(respString);
        var choices = doc.RootElement.GetProperty("choices");
        if (choices.GetArrayLength() > 0)
        {
            return choices[0].GetProperty("message").GetProperty("content").GetString();
        }

        return null;
    }
}
