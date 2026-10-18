using HumanitarianCrisisPlatform.Application.DTOs.AI;

namespace HumanitarianCrisisPlatform.Application.Validators;

public class HumanOverrideValidator
{
    public List<string> Validate(HumanOverrideDto dto)
    {
        var errors = new List<string>();
        if (dto.DecisionAuditId == Guid.Empty)
            errors.Add("DecisionAuditId is required.");
        if (string.IsNullOrWhiteSpace(dto.Reason))
            errors.Add("Override reason must be documented for governance audit.");
        return errors;
    }
}
