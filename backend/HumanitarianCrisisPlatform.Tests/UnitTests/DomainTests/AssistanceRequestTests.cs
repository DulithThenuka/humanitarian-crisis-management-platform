using Xunit;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Tests.UnitTests.DomainTests;

public class AssistanceRequestTests
{
    [Fact]
    public void NewRequest_ShouldInitializeWithSubmittedStatusAndMediumPriority()
    {
        var request = new AssistanceRequest
        {
            Category = "Rescue",
            Description = "Family stranded on rooftop"
        };

        Assert.Equal(RequestStatus.Submitted, request.Status);
        Assert.Equal(PriorityLevel.Medium, request.Urgency);
        Assert.NotEqual(Guid.Empty, request.Id);
        Assert.False(request.IsDuplicate);
    }

    [Fact]
    public void ResolveRequest_ShouldSetResolvedTimestamp()
    {
        var request = new AssistanceRequest
        {
            Category = "Medical",
            Description = "Need first aid supplies"
        };

        request.Status = RequestStatus.Resolved;
        request.ResolvedAt = DateTime.UtcNow;

        Assert.Equal(RequestStatus.Resolved, request.Status);
        Assert.NotNull(request.ResolvedAt);
    }
}
