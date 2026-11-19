namespace HumanitarianCrisisPlatform.Application.DTOs.Resources;

public class SupplierDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Categories { get; set; } = string.Empty;
    public string ContactRef { get; set; } = string.Empty;
    public string Status { get; set; } = "Verified";
    public string StatusBadge { get; set; } = "verified";
    public string LastDelivery { get; set; } = "Recently";
    public string Location { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

public class CreateSupplierDto
{
    public string Name { get; set; } = string.Empty;
    public string Categories { get; set; } = "Relief Supplies";
    public string? ContactRef { get; set; }
    public string? Location { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Notes { get; set; }
}

public class DonatedSupplyDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Donor { get; set; } = string.Empty;
    public string Items { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public string IntakeDate { get; set; } = string.Empty;
    public string Depot { get; set; } = "Central Depot";
    public string Status { get; set; } = "Stocked";
}
