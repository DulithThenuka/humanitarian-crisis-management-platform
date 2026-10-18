namespace HumanitarianCrisisPlatform.Domain.Exceptions;

public class CapacityExceededException : DomainException
{
    public Guid ShelterId { get; }
    public int RequestedCapacity { get; }
    public int AvailableCapacity { get; }

    public CapacityExceededException(Guid shelterId, int requested, int available)
        : base($"Shelter '{shelterId}' cannot accommodate {requested} persons. Available capacity: {available}")
    {
        ShelterId = shelterId;
        RequestedCapacity = requested;
        AvailableCapacity = available;
    }
}
