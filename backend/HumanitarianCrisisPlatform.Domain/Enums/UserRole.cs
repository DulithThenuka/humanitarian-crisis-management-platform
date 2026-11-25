using System.Text.Json.Serialization;

namespace HumanitarianCrisisPlatform.Domain.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum UserRole
{
    Citizen = 0,
    Coordinator = 1,
    LogisticsManager = 2,
    Volunteer = 3,
    Admin = 4,
    CaseManager = 5,
    ShelterManager = 6,
    VolunteerCoordinator = 7,
    DonorOfficer = 8,
    PartnerOfficer = 9
}
