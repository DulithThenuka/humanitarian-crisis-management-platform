using HumanitarianCrisisPlatform.Application.DTOs.Resources;

namespace HumanitarianCrisisPlatform.Application.Validators;

public class AllocateResourceValidator
{
    public List<string> Validate(AllocateResourceDto dto)
    {
        var errors = new List<string>();
        if (dto.ResourceId == Guid.Empty)
            errors.Add("ResourceId is required.");
        if (dto.Quantity <= 0)
            errors.Add("Quantity must be greater than zero.");
        return errors;
    }
}
