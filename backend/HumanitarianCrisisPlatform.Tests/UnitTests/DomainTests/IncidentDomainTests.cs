using Xunit;
using HumanitarianCrisisPlatform.Application.Validators;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Enums;
using HumanitarianCrisisPlatform.Domain.Exceptions;

namespace HumanitarianCrisisPlatform.Tests.UnitTests.DomainTests;

public class IncidentDomainTests
{
    [Fact]
    public void Incident_Validate_ShouldSucceed_WhenRequiredFieldsAreValid()
    {
        var incident = new Incident
        {
            CaseNumber = "HMR-1050",
            Title = "Emergency Shelter Request",
            Description = "Flood water rising in Kelani sector.",
            Category = IncidentCategory.EmergencyShelter,
            CategoryDisplay = "Emergency Shelter",
            OperationalArea = "Kelani East - Zone 03",
            AffectedPeople = 5,
            Latitude = 6.95m,
            Longitude = 79.92m
        };

        var exception = Record.Exception(() => incident.Validate());
        Assert.Null(exception);
    }

    [Fact]
    public void Incident_Validate_ShouldThrowDomainException_WhenAffectedPeopleIsZero()
    {
        var incident = new Incident
        {
            CaseNumber = "HMR-1051",
            Description = "Need shelter",
            OperationalArea = "Wattala South",
            AffectedPeople = 0
        };

        Assert.Throws<DomainException>(() => incident.Validate());
    }

    [Fact]
    public void IncidentStatusTransitionValidator_ShouldRejectTransitionFromMerged()
    {
        var result = IncidentStatusTransitionValidator.ValidateTransition(
            IncidentStatus.Merged,
            IncidentStatus.Open,
            "Attempt to reopen merged duplicate");

        Assert.False(result.Succeeded);
    }

    [Fact]
    public void IncidentStatusTransitionValidator_ShouldRequireReason()
    {
        var result = IncidentStatusTransitionValidator.ValidateTransition(
            IncidentStatus.Open,
            IncidentStatus.Assigned,
            "");

        Assert.False(result.Succeeded);
    }

    [Theory]
    [InlineData(IncidentStatus.Open, "Open", 0, "open")]
    [InlineData(IncidentStatus.Assigned, "Assigned", 1, "assigned")]
    [InlineData(IncidentStatus.Pending, "Pending", 2, "pending")]
    [InlineData(IncidentStatus.Verified, "Verified", 3, "verified")]
    [InlineData(IncidentStatus.InProgress, "In Progress", 4, "in-progress")]
    [InlineData(IncidentStatus.Escalated, "Escalated", 5, "escalated")]
    [InlineData(IncidentStatus.Resolved, "Resolved", 6, "resolved")]
    [InlineData(IncidentStatus.Closed, "Closed", 7, "closed")]
    [InlineData(IncidentStatus.Merged, "Merged", 8, "merged")]
    public void IncidentMapper_ToDto_ShouldMapStatusAndStatusEnumAndStatusTypeConsistently(
        IncidentStatus status,
        string expectedStatusDisplay,
        int expectedStatusEnumValue,
        string expectedStatusType)
    {
        var incident = new Incident
        {
            Id = Guid.NewGuid(),
            CaseNumber = "HMR-1042",
            Title = "Emergency Shelter Request",
            Description = "Flood water entered our home overnight.",
            Category = IncidentCategory.EmergencyShelter,
            CategoryDisplay = "Emergency Shelter",
            OperationalArea = "Kelani East - Zone 03",
            AffectedPeople = 6,
            Status = status
        };

        var dto = HumanitarianCrisisPlatform.Application.Services.IncidentMapper.ToDto(incident);

        Assert.Equal(expectedStatusDisplay, dto.Status);
        Assert.Equal(status, dto.StatusEnum);
        Assert.Equal(expectedStatusEnumValue, (int)dto.StatusEnum);
        Assert.Equal(expectedStatusType, dto.StatusType);
    }
}

