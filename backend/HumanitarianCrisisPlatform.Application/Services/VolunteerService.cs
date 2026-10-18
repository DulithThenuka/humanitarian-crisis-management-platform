using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Volunteers;
using HumanitarianCrisisPlatform.Application.Interfaces;
using HumanitarianCrisisPlatform.Domain.Entities;

namespace HumanitarianCrisisPlatform.Application.Services;

public class VolunteerService
{
    private readonly IUnitOfWork _unitOfWork;

    public VolunteerService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<bool>> AssignTaskAsync(AssignTaskDto dto, CancellationToken cancellationToken = default)
    {
        var assignment = new VolunteerAssignment
        {
            VolunteerId = dto.VolunteerId,
            AssistanceRequestId = dto.AssistanceRequestId,
            TaskDescription = dto.TaskDescription,
            Notes = dto.Notes,
            AssignmentStatus = 0, // Assigned
            StartTime = DateTime.UtcNow
        };

        await _unitOfWork.CommitAsync(cancellationToken);
        return Result<bool>.Success(true, "Task assigned to volunteer");
    }
}
