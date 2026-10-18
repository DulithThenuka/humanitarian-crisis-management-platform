using Xunit;
using Moq;
using HumanitarianCrisisPlatform.Application.DTOs.Requests;
using HumanitarianCrisisPlatform.Application.DTOs.AI;
using HumanitarianCrisisPlatform.Application.Interfaces;
using HumanitarianCrisisPlatform.Application.Interfaces.Infrastructure;
using HumanitarianCrisisPlatform.Application.Interfaces.Repositories;
using HumanitarianCrisisPlatform.Application.Services;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Tests.UnitTests.ServiceTests;

public class RequestServiceTests
{
    [Fact]
    public async Task CreateRequest_ShouldInvokeAIClassificationAndApplyHighPriority()
    {
        var repoMock = new Mock<IAssistanceRequestRepository>();
        var aiMock = new Mock<IAIServiceClient>();
        var uowMock = new Mock<IUnitOfWork>();

        var dto = new CreateAssistanceRequestDto
        {
            Category = "Medical",
            Description = "Severe bleeding and injury from collapsing wall",
            Urgency = PriorityLevel.Low
        };

        aiMock.Setup(x => x.ClassifyUrgencyAsync(It.IsAny<string>(), It.IsAny<string>(), default))
              .ReturnsAsync(new AIPriorityEvaluationDto
              {
                  PriorityScore = 95m,
                  ConfidenceScore = 0.92m,
                  RecommendedPriority = PriorityLevel.Critical,
                  Reasoning = "Life threat keywords detected"
              });

        repoMock.Setup(x => x.AddAsync(It.IsAny<AssistanceRequest>(), default))
                .ReturnsAsync((AssistanceRequest r, CancellationToken c) => r);

        var service = new AssistanceRequestService(repoMock.Object, aiMock.Object, uowMock.Object);
        var result = await service.CreateRequestAsync(dto, Guid.NewGuid());

        Assert.True(result.Succeeded);
        Assert.Equal(PriorityLevel.Critical, result.Data!.Urgency);
        Assert.Equal(95m, result.Data.AIPriorityScore);
    }
}
