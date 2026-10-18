namespace HumanitarianCrisisPlatform.Domain.Exceptions;

public class ResourceShortageException : DomainException
{
    public Guid ResourceId { get; }
    public decimal RequestedQuantity { get; }
    public decimal AvailableQuantity { get; }

    public ResourceShortageException(Guid resourceId, decimal requested, decimal available)
        : base($"Insufficient stock for resource '{resourceId}'. Requested: {requested}, Available: {available}")
    {
        ResourceId = resourceId;
        RequestedQuantity = requested;
        AvailableQuantity = available;
    }
}
