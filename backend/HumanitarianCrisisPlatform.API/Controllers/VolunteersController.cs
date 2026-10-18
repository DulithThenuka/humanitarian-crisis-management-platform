using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Volunteers;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;

namespace HumanitarianCrisisPlatform.API.Controllers;

public class VolunteersController : BaseApiController
{
    private readonly ApplicationDbContext _context;

    public VolunteersController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = "Coordinator,Admin")]
    public async Task<ActionResult<Result<IReadOnlyList<VolunteerDto>>>> GetAll()
    {
        var volunteers = await _context.Volunteers
            .Include(v => v.User)
            .Select(v => new VolunteerDto
            {
                Id = v.Id,
                UserId = v.UserId,
                FullName = v.User != null ? v.User.FullName : string.Empty,
                Email = v.User != null ? v.User.Email : string.Empty,
                PhoneNumber = v.User != null ? v.User.PhoneNumber : null,
                Skills = v.Skills,
                Availability = v.Availability,
                IsAvailable = v.IsAvailable,
                Latitude = v.Latitude,
                Longitude = v.Longitude,
                MaxTravelDistance = v.MaxTravelDistance
            })
            .ToListAsync();

        return Ok(Result<IReadOnlyList<VolunteerDto>>.Success(volunteers));
    }

    [HttpPost("assign")]
    [Authorize(Roles = "Coordinator,Admin")]
    public async Task<ActionResult<Result<bool>>> AssignTask([FromBody] AssignTaskDto dto)
    {
        var assignment = new VolunteerAssignment
        {
            VolunteerId = dto.VolunteerId,
            AssistanceRequestId = dto.AssistanceRequestId,
            TaskDescription = dto.TaskDescription,
            Notes = dto.Notes,
            AssignmentStatus = 0,
            StartTime = DateTime.UtcNow
        };

        _context.VolunteerAssignments.Add(assignment);
        await _context.SaveChangesAsync();
        return Ok(Result<bool>.Success(true, "Task successfully assigned"));
    }
}
