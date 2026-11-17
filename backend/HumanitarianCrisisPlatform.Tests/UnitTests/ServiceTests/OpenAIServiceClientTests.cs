using System.Net;
using System.Text;
using System.Text.Json;
using HumanitarianCrisisPlatform.Application.DTOs.AI;
using HumanitarianCrisisPlatform.Domain.Enums;
using HumanitarianCrisisPlatform.Infrastructure.AI;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using Moq.Protected;
using Xunit;

namespace HumanitarianCrisisPlatform.Tests.UnitTests.ServiceTests;

public class OpenAIServiceClientTests
{
    private (OpenAIServiceClient client, Mock<HttpMessageHandler> handlerMock) CreateClientWithResponse(string openAiJsonResponse)
    {
        var inMemorySettings = new Dictionary<string, string?>
        {
            {"OpenAI:ApiKey", "test-api-key-12345"}
        };
        IConfiguration config = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();

        var handlerMock = new Mock<HttpMessageHandler>(MockBehavior.Strict);
        
        var openAiApiWrapper = new
        {
            choices = new[]
            {
                new
                {
                    message = new
                    {
                        content = openAiJsonResponse
                    }
                }
            }
        };

        var httpResponse = new HttpResponseMessage(HttpStatusCode.OK)
        {
            Content = new StringContent(JsonSerializer.Serialize(openAiApiWrapper), Encoding.UTF8, "application/json")
        };

        handlerMock
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            )
            .ReturnsAsync(httpResponse);

        var httpClient = new HttpClient(handlerMock.Object);
        var fallbackService = new RuleBasedFallbackAIService();
        var client = new OpenAIServiceClient(httpClient, config, NullLogger<OpenAIServiceClient>.Instance, fallbackService);

        return (client, handlerMock);
    }

    [Fact]
    public async Task ClassifyUrgencyAsync_WhenConfidenceProvided_ShouldReturnValidConfidence()
    {
        var rawJson = JsonSerializer.Serialize(new
        {
            priority = "Critical",
            priorityScore = 95,
            confidenceScore = 0.94,
            reasoning = "Trapped by water"
        });

        var (client, _) = CreateClientWithResponse(rawJson);

        var result = await client.ClassifyUrgencyAsync("Floodwater entered home", "Shelter");

        Assert.Equal(PriorityLevel.Critical, result.RecommendedPriority);
        Assert.Equal(0.94m, result.ConfidenceScore);
        Assert.Equal(95m, result.PriorityScore);
    }

    [Fact]
    public async Task ClassifyUrgencyAsync_WhenConfidenceMissing_ShouldReturnNullConfidence_NeverAssume085()
    {
        var rawJson = JsonSerializer.Serialize(new
        {
            priority = "High",
            priorityScore = 75,
            reasoning = "Food rations needed"
        });

        var (client, _) = CreateClientWithResponse(rawJson);

        var result = await client.ClassifyUrgencyAsync("Need food rations", "Food");

        Assert.Equal(PriorityLevel.High, result.RecommendedPriority);
        Assert.Null(result.ConfidenceScore);
    }

    [Fact]
    public async Task ClassifyUrgencyAsync_WhenConfidenceOutOfBounds_ShouldReturnNullConfidence()
    {
        var rawJson = JsonSerializer.Serialize(new
        {
            priority = "Medium",
            priorityScore = 50,
            confidenceScore = 150.0, // Invalid: exceeds 100
            reasoning = "Check location"
        });

        var (client, _) = CreateClientWithResponse(rawJson);

        var result = await client.ClassifyUrgencyAsync("Check location", "General");

        Assert.Null(result.ConfidenceScore);
    }

    [Fact]
    public async Task ExecuteServiceAsync_WhenConfidencePercentProvided_ShouldReturnValidPercent()
    {
        var rawJson = JsonSerializer.Serialize(new
        {
            outputTitle = "Urgency Assessment",
            outputSummary = "Immediate rescue required",
            confidencePercent = 88,
            riskFlags = new[] { "Water level rising" }
        });

        var (client, _) = CreateClientWithResponse(rawJson);

        var input = new ExecuteWorkspaceServiceDto { InputText = "Elderly citizen stranded on roof", Category = "Rescue" };
        var result = await client.ExecuteServiceAsync("urgency-priority", input);

        Assert.True(result.IsAIExecuted);
        Assert.Equal(88, result.ConfidencePercent);
    }

    [Fact]
    public async Task ExecuteServiceAsync_WhenConfidenceMissing_ShouldReturnNullPercent_NeverAssume90()
    {
        var rawJson = JsonSerializer.Serialize(new
        {
            outputTitle = "Resource Allocation Recommendation",
            outputSummary = "Dispatched 2 water tankers",
            riskFlags = new string[0]
        });

        var (client, _) = CreateClientWithResponse(rawJson);

        var input = new ExecuteWorkspaceServiceDto { InputText = "Water shortage in Sector 4", Category = "Water" };
        var result = await client.ExecuteServiceAsync("resource-matching", input);

        Assert.True(result.IsAIExecuted);
        Assert.Null(result.ConfidencePercent);
    }
}
