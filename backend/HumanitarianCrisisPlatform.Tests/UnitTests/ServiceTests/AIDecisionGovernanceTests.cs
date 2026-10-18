using Xunit;
using Moq;
using HumanitarianCrisisPlatform.Application.DTOs.AI;
using HumanitarianCrisisPlatform.Application.Interfaces;
using HumanitarianCrisisPlatform.Application.Interfaces.Infrastructure;
using HumanitarianCrisisPlatform.Application.Interfaces.Repositories;
using HumanitarianCrisisPlatform.Application.Services;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Tests.UnitTests.ServiceTests;

public class AIDecisionGovernanceTests
{
    [Fact]
    public async Task HumanOverride_ShouldAuditLogReasonAndAdjustPriority()
    {
        var aiMock = new Mock<IAIServiceClient>();
        var auditMock = new Mock<IAIDecisionAuditRepository>();
        var reqMock = new Mock<IAssistanceRequestRepository>();
        var uowMock = new Mock<IUnitOfWork>();

        var auditId = Guid.NewGuid();
        var reqId = Guid.NewGuid();

        var audit = new AIDecisionAudit
        {
            Id = auditId,
            AssistanceRequestId = reqId,
            SuggestedPriority = PriorityLevel.Low
        };

        var request = new AssistanceRequest
        {
            Id = reqId,
            Urgency = PriorityLevel.Low
        };

        auditMock.Setup(a => a.GetByIdAsync(auditId, default)).ReturnsAsync(audit);
        reqMock.Setup(r => r.GetByIdAsync(reqId, default)).ReturnsAsync(request);

        var service = new AIDecisionService(aiMock.Object, auditMock.Object, reqMock.Object, uowMock.Object);

        var overrideDto = new HumanOverrideDto
        {
            DecisionAuditId = auditId,
            OverriddenPriority = PriorityLevel.Critical,
            Reason = "Field coordinator verified collapsed bridge and medical emergency on site",
            Action = "Override"
        };

        var result = await service.ProcessHumanOverrideAsync(overrideDto, Guid.NewGuid());

        Assert.True(result.Succeeded);
        Assert.True(audit.WasOverridden);
        Assert.Equal(PriorityLevel.Critical, request.Urgency);
        Assert.Equal("Field coordinator verified collapsed bridge and medical emergency on site", audit.OverrideReason);
    }
}
