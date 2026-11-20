using HumanitarianCrisisPlatform.Application.DTOs.Resources;

namespace HumanitarianCrisisPlatform.Application.Validators;

public class CreateResourceValidator
{
    public List<string> Validate(CreateResourceDto dto)
    {
        var errors = new List<string>();
        if (string.IsNullOrWhiteSpace(dto.Name))
            errors.Add("Item name is required.");
        if (dto.Quantity < 0)
            errors.Add("Quantity cannot be negative.");
        if (dto.MinimumThreshold < 0)
            errors.Add("Minimum threshold cannot be negative.");
        return errors;
    }
}

public class UpdateResourceValidator
{
    public List<string> Validate(UpdateResourceDto dto)
    {
        var errors = new List<string>();
        if (dto.Name != null && string.IsNullOrWhiteSpace(dto.Name))
            errors.Add("Item name cannot be empty.");
        if (dto.TotalQuantity.HasValue && dto.TotalQuantity.Value < 0)
            errors.Add("Quantity cannot be negative.");
        if (dto.MinimumThreshold.HasValue && dto.MinimumThreshold.Value < 0)
            errors.Add("Minimum threshold cannot be negative.");
        return errors;
    }
}

public class UpdateStockQuantityValidator
{
    public List<string> Validate(UpdateStockQuantityDto dto)
    {
        var errors = new List<string>();
        if (dto.Quantity < 0)
            errors.Add("Stock quantity cannot be negative.");
        return errors;
    }
}

public class StockAdjustmentValidator
{
    public List<string> Validate(StockAdjustmentDto dto)
    {
        var errors = new List<string>();
        if (dto.NewQuantity.HasValue && dto.NewQuantity.Value < 0)
            errors.Add("Stock quantity cannot be negative.");
        return errors;
    }
}

public class CreateSupplierValidator
{
    public List<string> Validate(CreateSupplierDto dto)
    {
        var errors = new List<string>();
        if (string.IsNullOrWhiteSpace(dto.Name))
            errors.Add("Supplier name is required.");
        return errors;
    }
}
