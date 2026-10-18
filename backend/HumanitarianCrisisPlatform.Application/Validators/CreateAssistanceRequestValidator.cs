using HumanitarianCrisisPlatform.Application.DTOs.Requests;

namespace HumanitarianCrisisPlatform.Application.Validators;

public class CreateAssistanceRequestValidator
{
    public List<string> Validate(CreateAssistanceRequestDto dto)
    {
        var errors = new List<string>();
        if (string.IsNullOrWhiteSpace(dto.Category))
            errors.Add("Category is required.");
        if (string.IsNullOrWhiteSpace(dto.Description))
            errors.Add("Description is required.");
        if (dto.NumberOfPeople <= 0)
            errors.Add("Number of people must be at least 1.");
        return errors;
    }
}
