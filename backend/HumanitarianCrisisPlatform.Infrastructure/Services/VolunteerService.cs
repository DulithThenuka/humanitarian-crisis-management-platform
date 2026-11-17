using Microsoft.EntityFrameworkCore;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Volunteers;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;

namespace HumanitarianCrisisPlatform.Infrastructure.Services;

/// <summary>
/// Full implementation of IVolunteerService.
/// Uses ApplicationDbContext directly (consistent with AdminService, CrisisService, HomeService patterns).
/// </summary>
public class VolunteerService : IVolunteerService
{
    private readonly ApplicationDbContext _context;

    public VolunteerService(ApplicationDbContext context)
    {
        _context = context;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PROFILE
    // ─────────────────────────────────────────────────────────────────────────

    public async Task<Result<VolunteerDto>> GetProfileAsync(Guid volunteerId)
    {
        var v = await _context.Volunteers
            .Include(x => x.User)
            .Include(x => x.Assignments)
            .FirstOrDefaultAsync(x => x.Id == volunteerId);

        if (v is null)
            return Result<VolunteerDto>.Failure("Volunteer profile not found.");

        return Result<VolunteerDto>.Success(MapToDto(v));
    }

    public async Task<Result<VolunteerDto>> GetProfileByUserIdAsync(Guid userId)
    {
        var v = await _context.Volunteers
            .Include(x => x.User)
            .Include(x => x.Assignments)
            .FirstOrDefaultAsync(x => x.UserId == userId);

        if (v is null)
            return Result<VolunteerDto>.Failure("Volunteer profile not found for this user.");

        return Result<VolunteerDto>.Success(MapToDto(v));
    }

    public async Task<Result<VolunteerDto>> UpdateProfileAsync(Guid volunteerId, UpdateVolunteerProfileDto dto)
    {
        var v = await _context.Volunteers
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.Id == volunteerId);

        if (v is null)
            return Result<VolunteerDto>.Failure("Volunteer profile not found.");

        if (dto.Skills is not null) v.Skills = dto.Skills;
        if (dto.Availability is not null) v.Availability = dto.Availability;
        if (dto.ServiceArea is not null) v.ServiceArea = dto.ServiceArea;
        if (dto.BloodGroup is not null) v.BloodGroup = dto.BloodGroup;
        if (dto.EmergencyContact is not null) v.EmergencyContact = dto.EmergencyContact;
        if (dto.Certifications is not null) v.Certifications = dto.Certifications;
        if (dto.PreferredCategories is not null) v.PreferredCategories = dto.PreferredCategories;
        if (dto.Latitude.HasValue) v.Latitude = dto.Latitude;
        if (dto.Longitude.HasValue) v.Longitude = dto.Longitude;
        if (dto.MaxTravelDistance.HasValue) v.MaxTravelDistance = dto.MaxTravelDistance;

        if (dto.PhoneNumber is not null && v.User is not null)
            v.User.PhoneNumber = dto.PhoneNumber;

        v.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Result<VolunteerDto>.Success(MapToDto(v), "Profile updated successfully.");
    }

    public async Task<Result<VolunteerMetricsDto>> GetMetricsAsync(Guid volunteerId)
    {
        var v = await _context.Volunteers
            .Include(x => x.Assignments)
            .FirstOrDefaultAsync(x => x.Id == volunteerId);

        if (v is null)
            return Result<VolunteerMetricsDto>.Failure("Volunteer not found.");

        var opportunityCount = await _context.VolunteerOpportunities
            .CountAsync(o => o.IsActive && o.AcceptedCount < o.MaxVolunteers);

        var metrics = new VolunteerMetricsDto
        {
            TotalAssignments = v.Assignments.Count,
            CompletedAssignments = v.Assignments.Count(a => a.AssignmentStatus == 3),
            ActiveAssignments = v.Assignments.Count(a => a.AssignmentStatus == 2),
            PendingAssignments = v.Assignments.Count(a => a.AssignmentStatus == 0 || a.AssignmentStatus == 1),
            TotalHoursServed = v.TotalHoursServed,
            AvailableOpportunities = opportunityCount,
            UnreadNotifications = 0 // Notifications are simulated from assignments
        };

        return Result<VolunteerMetricsDto>.Success(metrics);
    }

    public async Task<Result<bool>> UpdateDutyStatusAsync(Guid volunteerId, UpdateDutyStatusDto dto)
    {
        var v = await _context.Volunteers.FindAsync(volunteerId);
        if (v is null)
            return Result<bool>.Failure("Volunteer not found.");

        v.DutyStatus = dto.DutyStatus;
        v.IsAvailable = dto.DutyStatus == "Available";
        v.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Result<bool>.Success(true, $"Duty status updated to {dto.DutyStatus}.");
    }

    public async Task<Result<bool>> UpdateAvailabilityAsync(Guid volunteerId, UpdateAvailabilityDto dto)
    {
        var v = await _context.Volunteers.FindAsync(volunteerId);
        if (v is null)
            return Result<bool>.Failure("Volunteer not found.");

        v.IsAvailable = dto.IsAvailable;
        if (dto.Availability is not null) v.Availability = dto.Availability;
        if (dto.DutyStatus is not null) v.DutyStatus = dto.DutyStatus;
        v.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Result<bool>.Success(true, "Availability updated.");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // OPPORTUNITIES
    // ─────────────────────────────────────────────────────────────────────────

    public async Task<Result<IReadOnlyList<VolunteerOpportunityDto>>> GetOpportunitiesAsync(bool activeOnly = true)
    {
        var query = _context.VolunteerOpportunities.AsQueryable();
        if (activeOnly) query = query.Where(o => o.IsActive);

        var list = await query
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => MapOpportunityToDto(o))
            .ToListAsync();

        return Result<IReadOnlyList<VolunteerOpportunityDto>>.Success(list);
    }

    public async Task<Result<VolunteerOpportunityDto>> GetOpportunityByIdAsync(Guid id)
    {
        var o = await _context.VolunteerOpportunities.FindAsync(id);
        if (o is null)
            return Result<VolunteerOpportunityDto>.Failure("Opportunity not found.");

        return Result<VolunteerOpportunityDto>.Success(MapOpportunityToDto(o));
    }

    public async Task<Result<VolunteerOpportunityDto>> CreateOpportunityAsync(Guid coordinatorUserId, CreateOpportunityDto dto)
    {
        var opportunity = new VolunteerOpportunity
        {
            Title = dto.Title,
            Description = dto.Description,
            Category = dto.Category,
            Location = dto.Location,
            Coordinator = dto.Coordinator,
            CoordinatorPhone = dto.CoordinatorPhone,
            Priority = dto.Priority,
            Deadline = dto.Deadline,
            MaxVolunteers = dto.MaxVolunteers,
            IsActive = true,
            CrisisEventId = dto.CrisisEventId,
            PostedByUserId = coordinatorUserId,
            CreatedAt = DateTime.UtcNow
        };

        _context.VolunteerOpportunities.Add(opportunity);
        await _context.SaveChangesAsync();

        return Result<VolunteerOpportunityDto>.Success(MapOpportunityToDto(opportunity), "Opportunity created.");
    }

    public async Task<Result<bool>> AcceptOpportunityAsync(Guid volunteerId, AcceptOpportunityDto dto)
    {
        var volunteer = await _context.Volunteers
            .Include(v => v.AcceptedOpportunities)
            .FirstOrDefaultAsync(v => v.Id == volunteerId);

        if (volunteer is null)
            return Result<bool>.Failure("Volunteer not found.");

        var opportunity = await _context.VolunteerOpportunities
            .Include(o => o.AcceptedVolunteers)
            .FirstOrDefaultAsync(o => o.Id == dto.OpportunityId);

        if (opportunity is null)
            return Result<bool>.Failure("Opportunity not found.");

        if (!opportunity.IsActive)
            return Result<bool>.Failure("This opportunity is no longer active.");

        if (opportunity.AcceptedCount >= opportunity.MaxVolunteers)
            return Result<bool>.Failure("This opportunity is already at full capacity.");

        if (opportunity.AcceptedVolunteers.Any(v => v.Id == volunteerId))
            return Result<bool>.Failure("You have already accepted this opportunity.");

        // Create assignment record
        var assignment = new VolunteerAssignment
        {
            VolunteerId = volunteerId,
            OpportunityId = opportunity.Id,
            Title = opportunity.Title,
            TaskDescription = opportunity.Description,
            Category = opportunity.Category,
            Location = opportunity.Location,
            Coordinator = opportunity.Coordinator,
            CoordinatorPhone = opportunity.CoordinatorPhone,
            Priority = opportunity.Priority,
            Deadline = opportunity.Deadline,
            AssignmentStatus = 1, // Accepted
            Notes = dto.Notes,
            StartTime = DateTime.UtcNow
        };

        opportunity.AcceptedVolunteers.Add(volunteer);
        opportunity.AcceptedCount++;

        if (opportunity.AcceptedCount >= opportunity.MaxVolunteers)
            opportunity.IsActive = false;

        _context.VolunteerAssignments.Add(assignment);
        await _context.SaveChangesAsync();

        return Result<bool>.Success(true, $"You have accepted opportunity: {opportunity.Title}");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ASSIGNMENTS
    // ─────────────────────────────────────────────────────────────────────────

    public async Task<Result<IReadOnlyList<VolunteerAssignmentDto>>> GetAssignmentsAsync(Guid volunteerId)
    {
        var assignments = await _context.VolunteerAssignments
            .Where(a => a.VolunteerId == volunteerId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

        var dtos = assignments.Select(MapAssignmentToDto).ToList();
        return Result<IReadOnlyList<VolunteerAssignmentDto>>.Success(dtos);
    }

    public async Task<Result<IReadOnlyList<VolunteerAssignmentDto>>> GetAllAssignmentsAsync()
    {
        var assignments = await _context.VolunteerAssignments
            .Include(a => a.Volunteer).ThenInclude(v => v!.User)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

        var dtos = assignments.Select(MapAssignmentToDto).ToList();
        return Result<IReadOnlyList<VolunteerAssignmentDto>>.Success(dtos);
    }

    public async Task<Result<bool>> RespondToAssignmentAsync(Guid volunteerId, RespondToAssignmentDto dto)
    {
        var assignment = await _context.VolunteerAssignments
            .FirstOrDefaultAsync(a => a.Id == dto.AssignmentId && a.VolunteerId == volunteerId);

        if (assignment is null)
            return Result<bool>.Failure("Assignment not found.");

        switch (dto.Action.ToLowerInvariant())
        {
            case "accept":
                assignment.AssignmentStatus = 1;
                break;
            case "inprogress":
                assignment.AssignmentStatus = 2;
                break;
            case "complete":
                assignment.AssignmentStatus = 3;
                break;
            case "decline":
                assignment.AssignmentStatus = 4;
                break;
            default:
                return Result<bool>.Failure($"Unknown action: {dto.Action}. Valid: accept, inprogress, complete, decline");
        }

        if (dto.Notes is not null) assignment.Notes = dto.Notes;

        if (assignment.AssignmentStatus == 3)
        {
            assignment.EndTime = DateTime.UtcNow;

            // Update volunteer totals
            var volunteer = await _context.Volunteers.FindAsync(volunteerId);
            if (volunteer is not null)
            {
                volunteer.CompletedAssignments++;
                volunteer.TotalHoursServed += assignment.LoggedHours;
                volunteer.UpdatedAt = DateTime.UtcNow;
            }
        }

        assignment.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Result<bool>.Success(true, $"Assignment status updated to {dto.Action}.");
    }

    public async Task<Result<bool>> LogShiftHoursAsync(Guid volunteerId, LogShiftHoursDto dto)
    {
        if (dto.Hours <= 0 || dto.Hours > 24)
            return Result<bool>.Failure("Hours must be between 0.1 and 24.");

        var assignment = await _context.VolunteerAssignments
            .FirstOrDefaultAsync(a => a.Id == dto.AssignmentId && a.VolunteerId == volunteerId);

        if (assignment is null)
            return Result<bool>.Failure("Assignment not found.");

        assignment.LoggedHours += dto.Hours;
        assignment.HoursApproved = false; // Requires coordinator approval
        if (dto.ShiftNotes is not null) assignment.ShiftNotes = dto.ShiftNotes;
        assignment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Result<bool>.Success(true, $"{dto.Hours}h logged. Awaiting coordinator approval.");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // NOTIFICATIONS (derived from assignment changes)
    // ─────────────────────────────────────────────────────────────────────────

    public async Task<Result<IReadOnlyList<VolunteerNotificationDto>>> GetNotificationsAsync(Guid volunteerId)
    {
        var assignments = await _context.VolunteerAssignments
            .Where(a => a.VolunteerId == volunteerId)
            .OrderByDescending(a => a.UpdatedAt ?? a.CreatedAt)
            .Take(20)
            .ToListAsync();

        var notifications = assignments.Select(a => new VolunteerNotificationDto
        {
            Id = a.Id,
            Title = a.AssignmentStatus switch
            {
                0 => "New Task Offered",
                1 => "Task Accepted",
                2 => "Task In Progress",
                3 => "Task Completed",
                4 => "Task Declined",
                _ => "Assignment Update"
            },
            Message = $"{a.Title ?? a.TaskDescription} — {StatusLabel(a.AssignmentStatus)}",
            Type = a.AssignmentStatus switch
            {
                0 => "info",
                1 => "success",
                3 => "success",
                4 => "warning",
                _ => "info"
            },
            IsRead = a.AssignmentStatus != 0,
            CreatedAt = a.UpdatedAt ?? a.CreatedAt,
            AssignmentId = a.Id
        }).ToList();

        return Result<IReadOnlyList<VolunteerNotificationDto>>.Success(notifications);
    }

    public async Task<Result<bool>> MarkNotificationsReadAsync(Guid volunteerId, List<Guid>? ids = null)
    {
        // No separate notifications table — mark offered assignments as acknowledged
        var query = _context.VolunteerAssignments
            .Where(a => a.VolunteerId == volunteerId && a.AssignmentStatus == 0);

        if (ids is { Count: > 0 })
            query = query.Where(a => ids.Contains(a.Id));

        var items = await query.ToListAsync();
        // Status stays 0 (Offered) but we consider them "read" — no model change needed
        // This is a no-op in current model; frontend handles read state locally.
        return Result<bool>.Success(true, $"{items.Count} notifications acknowledged.");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // COORDINATOR ACTIONS
    // ─────────────────────────────────────────────────────────────────────────

    public async Task<Result<IReadOnlyList<VolunteerDto>>> GetAllVolunteersAsync()
    {
        var volunteers = await _context.Volunteers
            .Include(v => v.User)
            .Include(v => v.Assignments)
            .OrderBy(v => v.User!.FullName)
            .ToListAsync();

        var dtos = volunteers.Select(MapToDto).ToList();
        return Result<IReadOnlyList<VolunteerDto>>.Success(dtos);
    }

    public async Task<Result<bool>> AssignTaskAsync(AssignTaskDto dto)
    {
        var volunteer = await _context.Volunteers.FindAsync(dto.VolunteerId);
        if (volunteer is null)
            return Result<bool>.Failure("Volunteer not found.");

        // Optionally look up opportunity details
        string? title = dto.Title;
        string? category = dto.Category;
        string? location = dto.Location;
        string? priority = dto.Priority;
        DateTime? deadline = dto.Deadline;

        if (dto.OpportunityId.HasValue)
        {
            var opp = await _context.VolunteerOpportunities.FindAsync(dto.OpportunityId.Value);
            if (opp is not null)
            {
                title ??= opp.Title;
                category ??= opp.Category;
                location ??= opp.Location;
                priority ??= opp.Priority;
                deadline ??= opp.Deadline;
            }
        }

        var assignment = new VolunteerAssignment
        {
            VolunteerId = dto.VolunteerId,
            AssistanceRequestId = dto.AssistanceRequestId,
            OpportunityId = dto.OpportunityId,
            TaskDescription = dto.TaskDescription,
            Title = title,
            Category = category,
            Location = location,
            Priority = priority,
            Deadline = deadline,
            Notes = dto.Notes,
            AssignmentStatus = 0, // Offered
            StartTime = DateTime.UtcNow
        };

        _context.VolunteerAssignments.Add(assignment);
        await _context.SaveChangesAsync();

        return Result<bool>.Success(true, "Task assigned successfully.");
    }

    public async Task<Result<bool>> BulkAssignAsync(BulkAssignDto dto)
    {
        if (!dto.VolunteerIds.Any())
            return Result<bool>.Failure("No volunteers specified.");

        var assignments = dto.VolunteerIds.Select(vid => new VolunteerAssignment
        {
            VolunteerId = vid,
            OpportunityId = dto.OpportunityId,
            TaskDescription = dto.TaskDescription,
            Category = dto.Category,
            Location = dto.Location,
            Priority = dto.Priority,
            Deadline = dto.Deadline,
            AssignmentStatus = 0,
            StartTime = DateTime.UtcNow
        });

        await _context.VolunteerAssignments.AddRangeAsync(assignments);
        await _context.SaveChangesAsync();

        return Result<bool>.Success(true, $"{dto.VolunteerIds.Count} volunteers assigned.");
    }

    public async Task<Result<bool>> ApproveHoursAsync(Guid coordinatorUserId, ApproveHoursDto dto)
    {
        var assignment = await _context.VolunteerAssignments
            .Include(a => a.Volunteer)
            .FirstOrDefaultAsync(a => a.Id == dto.AssignmentId);

        if (assignment is null)
            return Result<bool>.Failure("Assignment not found.");

        assignment.HoursApproved = dto.Approved;
        assignment.UpdatedAt = DateTime.UtcNow;

        if (dto.Approved && assignment.Volunteer is not null)
        {
            assignment.Volunteer.TotalHoursServed += assignment.LoggedHours;
            assignment.Volunteer.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        return Result<bool>.Success(true, dto.Approved ? "Hours approved." : "Hours approval revoked.");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // MAPPING HELPERS
    // ─────────────────────────────────────────────────────────────────────────

    private static VolunteerDto MapToDto(Volunteer v) => new()
    {
        Id = v.Id,
        UserId = v.UserId,
        FullName = v.User?.FullName ?? string.Empty,
        Email = v.User?.Email ?? string.Empty,
        PhoneNumber = v.User?.PhoneNumber,
        Skills = v.Skills,
        Availability = v.Availability,
        IsAvailable = v.IsAvailable,
        Latitude = v.Latitude,
        Longitude = v.Longitude,
        MaxTravelDistance = v.MaxTravelDistance,
        VolunteerCode = v.VolunteerCode,
        DutyStatus = v.DutyStatus,
        ServiceArea = v.ServiceArea,
        BloodGroup = v.BloodGroup,
        EmergencyContact = v.EmergencyContact,
        VerificationTier = v.VerificationTier,
        Certifications = v.Certifications,
        PreferredCategories = v.PreferredCategories,
        TotalHoursServed = v.TotalHoursServed,
        CompletedAssignments = v.CompletedAssignments,
        ActiveAssignments = v.Assignments.Count(a => a.AssignmentStatus == 2)
    };

    private static VolunteerAssignmentDto MapAssignmentToDto(VolunteerAssignment a) => new()
    {
        Id = a.Id,
        Title = a.Title ?? a.TaskDescription,
        TaskDescription = a.TaskDescription,
        Category = a.Category,
        Location = a.Location,
        Coordinator = a.Coordinator,
        CoordinatorPhone = a.CoordinatorPhone,
        Priority = a.Priority,
        Deadline = a.Deadline,
        StartTime = a.StartTime,
        EndTime = a.EndTime,
        Notes = a.Notes,
        AssignmentStatus = a.AssignmentStatus,
        AssignmentStatusLabel = StatusLabel(a.AssignmentStatus),
        LoggedHours = a.LoggedHours,
        HoursApproved = a.HoursApproved,
        OpportunityId = a.OpportunityId,
        AssistanceRequestId = a.AssistanceRequestId,
        CreatedAt = a.CreatedAt
    };

    private static VolunteerOpportunityDto MapOpportunityToDto(VolunteerOpportunity o) => new()
    {
        Id = o.Id,
        Title = o.Title,
        Description = o.Description,
        Category = o.Category,
        Location = o.Location,
        Coordinator = o.Coordinator,
        Priority = o.Priority,
        Deadline = o.Deadline,
        MaxVolunteers = o.MaxVolunteers,
        AcceptedCount = o.AcceptedCount,
        SpotsLeft = Math.Max(0, o.MaxVolunteers - o.AcceptedCount),
        IsActive = o.IsActive,
        CrisisEventId = o.CrisisEventId,
        CreatedAt = o.CreatedAt
    };

    private static string StatusLabel(int status) => status switch
    {
        0 => "Offered",
        1 => "Accepted",
        2 => "In Progress",
        3 => "Completed",
        4 => "Declined",
        _ => "Unknown"
    };
}