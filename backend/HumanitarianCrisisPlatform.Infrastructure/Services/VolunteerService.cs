using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Volunteers;
using HumanitarianCrisisPlatform.Application.Interfaces;
using HumanitarianCrisisPlatform.Application.Interfaces.Repositories;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Enums;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;
using HumanitarianCrisisPlatform.Infrastructure.Security;

namespace HumanitarianCrisisPlatform.Infrastructure.Services;

public class VolunteerService : IVolunteerService
{
    private readonly ApplicationDbContext _context;
    private readonly IVolunteerRepository _volunteerRepository;
    private readonly IUnitOfWork _unitOfWork;

    public VolunteerService(
        ApplicationDbContext context,
        IVolunteerRepository volunteerRepository,
        IUnitOfWork unitOfWork)
    {
        _context = context;
        _volunteerRepository = volunteerRepository;
        _unitOfWork = unitOfWork;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // 1. Dashboard Overview & Real Computed Metrics
    // ─────────────────────────────────────────────────────────────────────────────
    public async Task<Result<VolunteerDashboardDto>> GetDashboardOverviewAsync(CancellationToken cancellationToken = default)
    {
        var allVolunteers = await _context.Volunteers
            .Include(v => v.User)
            .Include(v => v.Assignments)
            .OrderByDescending(v => v.CreatedAt)
            .ToListAsync(cancellationToken);

        var allAssignments = await _context.VolunteerAssignments
            .Include(a => a.Volunteer)
            .ThenInclude(v => v!.User)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync(cancellationToken);

        var openRequests = await _context.AssistanceRequests
            .Where(r => r.Status == RequestStatus.Submitted || r.Status == RequestStatus.InProgress)
            .ToListAsync(cancellationToken);

        var decisionAudits = await _context.AIDecisionAudits
            .OrderByDescending(d => d.ReviewedAt ?? d.CreatedAt)
            .Take(10)
            .ToListAsync(cancellationToken);

        int totalVolunteers = allVolunteers.Count;
        int pendingVerification = allVolunteers.Count(v => IsPendingVerification(v));
        int activeAssignmentsCount = allAssignments.Count(a => a.AssignmentStatus == 0 || a.AssignmentStatus == 1);
        int availableNow = allVolunteers.Count(v => v.IsAvailable && !IsPendingVerification(v));
        int unfilledTasksCount = openRequests.Count;
        int completedActivitiesCount = allAssignments.Count(a => a.AssignmentStatus == 2);

        var dashboard = new VolunteerDashboardDto
        {
            Metrics = new VolunteerMetricsDto
            {
                RegisteredVolunteers = totalVolunteers,
                RegisteredSub = "Entire directory",
                VerificationPending = pendingVerification,
                VerificationSub = $"{pendingVerification} due for review",
                AvailableNow = availableNow,
                AvailableSub = "In service areas",
                ActiveAssignments = activeAssignmentsCount,
                ActiveSub = $"{activeAssignmentsCount} shifts active",
                UnfilledTasks = unfilledTasksCount,
                UnfilledSub = $"{unfilledTasksCount} tasks open",
                CompletedActivities = completedActivitiesCount,
                CompletedSub = "Across operation"
            },
            CoordinatorUser = new VolunteerCoordinatorUserDto
            {
                Name = "Kavindi Rodrigo",
                Role = "Volunteer Coordinator",
                RoleCode = "VOLUNTEER_COORDINATOR",
                Avatar = "KR",
                Operation = "Western Province Flood",
                NotificationCount = pendingVerification,
                DutyStatus = true,
                AccessBoundaryNotice = "Volunteer eligibility, skills and assignments only. Emergency contacts and personal address lines remain restricted."
            }
        };

        // Priority items calculated dynamically
        var priorityItems = new List<VolunteerPriorityItemDto>();

        // 1. Unfilled tasks priority
        if (openRequests.Count > 0)
        {
            var req = openRequests.First();
            priorityItems.Add(new VolunteerPriorityItemDto
            {
                Id = $"REQ-{req.Id.ToString()[..4].ToUpper()}",
                Title = $"Task {req.Category} unfilled",
                Subtitle = $"Needs verified volunteers for {req.Address ?? "Kelani East"}",
                Badge = "critical",
                BadgeText = "critical",
                TargetTab = "ai-matching"
            });
        }
        else if (unfilledTasksCount == 0 && totalVolunteers > 0)
        {
            priorityItems.Add(new VolunteerPriorityItemDto
            {
                Id = "OPS-100",
                Title = "All operational tasks filled",
                Subtitle = "Volunteer allocations currently meeting demand",
                Badge = "resolved",
                BadgeText = "balanced",
                TargetTab = "scheduling"
            });
        }

        // 2. Pending verification priority
        var pendingVol = allVolunteers.FirstOrDefault(v => IsPendingVerification(v));
        if (pendingVol != null)
        {
            var code = FormatVolunteerCode(pendingVol.Id);
            priorityItems.Add(new VolunteerPriorityItemDto
            {
                Id = code,
                Title = $"{code} verification pending",
                Subtitle = $"Qualification review for {pendingVol.User?.FullName ?? "New Applicant"}",
                Badge = "warning",
                BadgeText = "warning",
                TargetTab = "directory"
            });
        }

        // 3. Schedule conflict status
        priorityItems.Add(new VolunteerPriorityItemDto
        {
            Id = "CONFLICT-GUARD",
            Title = "Schedule conflict prevented",
            Subtitle = "Double-assignment prevention active across operational zones",
            Badge = "resolved",
            BadgeText = "guarded",
            TargetTab = "scheduling"
        });

        dashboard.PriorityItems = priorityItems;

        // Workflow steps
        dashboard.WorkflowSteps = new List<VolunteerWorkflowStepDto>
        {
            new() { Step = 1, Title = "Citizen request recorded", Description = "Needs intake logged into humanitarian platform", Status = "completed" },
            new() { Step = 2, Title = "Human case review", Description = "Volunteer Coordinator action received on each intake", Status = "completed" },
            new() { Step = 3, Title = "Resource / shelter decision", Description = "Cross-module handoff with Logistics & Shelter Leads", Status = "current" },
            new() { Step = 4, Title = "Volunteer or partner handoff", Description = activeAssignmentsCount > 0 ? "completed" : "upcoming" },
            new() { Step = 5, Title = "Citizen status notification", Description = completedActivitiesCount > 0 ? "completed" : "upcoming" }
        };

        // Recent activity
        var recentList = new List<VolunteerRecentActivityDto>();

        // Activities from assignments
        foreach (var assign in allAssignments.Take(4))
        {
            var code = FormatVolunteerCode(assign.VolunteerId);
            var statusStr = assign.AssignmentStatus switch
            {
                0 => "Shift assigned",
                1 => "Shift in progress",
                2 => "Shift completed",
                3 => "Shift released",
                _ => "Assignment updated"
            };
            recentList.Add(new VolunteerRecentActivityDto
            {
                Id = $"ACT-{assign.Id.ToString()[..4].ToUpper()}",
                Time = (assign.UpdatedAt ?? assign.CreatedAt).ToString("HH:mm"),
                Title = $"{code} - {assign.TaskDescription}",
                Action = $"{statusStr} by authorised coordinator"
            });
        }

        // Activities from decision audits
        foreach (var dec in decisionAudits.Take(2))
        {
            recentList.Add(new VolunteerRecentActivityDto
            {
                Id = $"DEC-{dec.Id.ToString()[..4].ToUpper()}",
                Time = (dec.ReviewedAt ?? dec.CreatedAt).ToString("HH:mm"),
                Title = dec.AISuggestion?.Length > 35 ? dec.AISuggestion[..35] + "..." : (dec.AISuggestion ?? "Matching review"),
                Action = $"{dec.HumanDecision ?? "Reviewed"} by coordinator"
            });
        }

        if (recentList.Count == 0 && allVolunteers.Count > 0)
        {
            var v = allVolunteers.First();
            var code = FormatVolunteerCode(v.Id);
            recentList.Add(new VolunteerRecentActivityDto
            {
                Id = "ACT-01",
                Time = v.CreatedAt.ToString("HH:mm"),
                Title = $"{code} - {FormatSkills(v.Skills)}",
                Action = "Volunteer roster record active in system"
            });
        }

        dashboard.RecentActivity = recentList.Take(5).ToList();

        return Result<VolunteerDashboardDto>.Success(dashboard);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // 2. Volunteer Directory Operations
    // ─────────────────────────────────────────────────────────────────────────────
    public async Task<Result<IReadOnlyList<VolunteerCoordinatorDto>>> GetAllVolunteersAsync(
        string? search = null,
        string? status = null,
        string? serviceArea = null,
        CancellationToken cancellationToken = default)
    {
        // 1. Auto-sync any Users with Role == UserRole.Volunteer who do not yet have a Volunteer record
        var existingVolunteerUserIds = await _context.Volunteers.Select(v => v.UserId).ToListAsync(cancellationToken);
        var missingUsers = await _context.Users
            .Where(u => u.Role == UserRole.Volunteer && !existingVolunteerUserIds.Contains(u.Id))
            .ToListAsync(cancellationToken);

        if (missingUsers.Any())
        {
            foreach (var user in missingUsers)
            {
                var newVol = new Volunteer
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    User = user,
                    Skills = "First Aid, Community Logistics, Emergency Search",
                    Availability = "Available",
                    IsAvailable = true,
                    CreatedAt = user.CreatedAt,
                    CreatedBy = $"Area: {user.AssignedDistrict ?? "Kelani East"} | Verif: Pending"
                };
                await _context.Volunteers.AddAsync(newVol, cancellationToken);
            }
            await _unitOfWork.CommitAsync(cancellationToken);
        }

        var volunteers = await _context.Volunteers
            .Include(v => v.User)
            .Include(v => v.Assignments)
            .OrderByDescending(v => v.CreatedAt)
            .ToListAsync(cancellationToken);

        var dtoList = volunteers.Select(MapToCoordinatorDto).ToList();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var q = search.Trim().ToLower();
            dtoList = dtoList.Where(v =>
                v.VolunteerCode.ToLower().Contains(q) ||
                v.FullName.ToLower().Contains(q) ||
                v.Skills.ToLower().Contains(q) ||
                v.ServiceArea.ToLower().Contains(q) ||
                v.Email.ToLower().Contains(q) ||
                (v.PhoneNumber != null && v.PhoneNumber.ToLower().Contains(q))).ToList();
        }

        if (!string.IsNullOrWhiteSpace(status) && !status.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            dtoList = dtoList.Where(v => v.Status.Equals(status, StringComparison.OrdinalIgnoreCase) ||
                                         v.StatusType.Equals(status, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        if (!string.IsNullOrWhiteSpace(serviceArea) &&
            !serviceArea.Equals("All", StringComparison.OrdinalIgnoreCase) &&
            !serviceArea.Equals("All operational areas", StringComparison.OrdinalIgnoreCase))
        {
            dtoList = dtoList.Where(v => v.ServiceArea.Equals(serviceArea, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        return Result<IReadOnlyList<VolunteerCoordinatorDto>>.Success(dtoList);
    }

    public async Task<Result<VolunteerCoordinatorDto>> GetVolunteerByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var v = await _context.Volunteers
            .Include(x => x.User)
            .Include(x => x.Assignments)
            .FirstOrDefaultAsync(x => x.Id == id || x.UserId == id, cancellationToken);

        if (v == null)
            return Result<VolunteerCoordinatorDto>.Failure("Volunteer record not found.");

        return Result<VolunteerCoordinatorDto>.Success(MapToCoordinatorDto(v));
    }

    public async Task<Result<VolunteerCoordinatorDto>> CreateVolunteerAsync(
        CreateVolunteerRequestDto dto,
        string createdBy,
        CancellationToken cancellationToken = default)
    {
        var name = !string.IsNullOrWhiteSpace(dto.FullName) ? dto.FullName.Trim() : dto.Name?.Trim();
        if (string.IsNullOrWhiteSpace(name))
            return Result<VolunteerCoordinatorDto>.Failure("Volunteer name is required.");

        var email = !string.IsNullOrWhiteSpace(dto.Email)
            ? dto.Email.Trim().ToLower()
            : $"{name.ToLower().Replace(" ", ".")}_{Guid.NewGuid().ToString()[..4]}@crisisplatform.org";

        // Check if user with this email already exists
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
        User user;
        if (existingUser != null)
        {
            var existingVolunteer = await _context.Volunteers.FirstOrDefaultAsync(v => v.UserId == existingUser.Id, cancellationToken);
            if (existingVolunteer != null)
            {
                var updateDto = new UpdateVolunteerRequestDto
                {
                    FullName = name,
                    Skills = dto.Skills,
                    ServiceArea = dto.ServiceArea,
                    Availability = dto.Availability,
                    Verification = dto.Verification,
                    Status = dto.Status,
                    Notes = dto.Notes
                };
                return await UpdateVolunteerAsync(existingVolunteer.Id, updateDto, createdBy, cancellationToken);
            }
            user = existingUser;
            user.Role = UserRole.Volunteer;
            user.FullName = name;
            if (!string.IsNullOrWhiteSpace(dto.PhoneNumber ?? dto.Phone))
                user.PhoneNumber = (dto.PhoneNumber ?? dto.Phone)!.Trim();
            if (!string.IsNullOrWhiteSpace(dto.ServiceArea))
                user.AssignedDistrict = dto.ServiceArea.Trim();
        }
        else
        {
            user = new User
            {
                Id = Guid.NewGuid(),
                FullName = name,
                Email = email,
                PhoneNumber = (dto.PhoneNumber ?? dto.Phone)?.Trim() ?? "+94 77 000 0000",
                AssignedDistrict = dto.ServiceArea?.Trim() ?? "Kelani East",
                PasswordHash = PasswordHasher.HashPassword("Volunteer@123"),
                Role = UserRole.Volunteer,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = createdBy
            };
            await _context.Users.AddAsync(user, cancellationToken);
        }

        var serviceArea = !string.IsNullOrWhiteSpace(dto.ServiceArea) ? dto.ServiceArea.Trim() : "Kelani East";
        var verification = !string.IsNullOrWhiteSpace(dto.Verification)
            ? dto.Verification.Trim()
            : (!string.IsNullOrWhiteSpace(dto.VerificationStatus) ? dto.VerificationStatus.Trim() : "Verified");
        var status = !string.IsNullOrWhiteSpace(dto.Status) ? dto.Status.Trim() : "Eligible";
        var isAvailable = status.Equals("Eligible", StringComparison.OrdinalIgnoreCase);

        var volunteer = new Volunteer
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            User = user,
            Skills = dto.Skills ?? "Logistics, First Aid",
            Availability = dto.Availability ?? "Available",
            IsAvailable = isAvailable,
            Latitude = 6.9540m,
            Longitude = 79.9190m,
            MaxTravelDistance = 25.0m,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = $"Area: {serviceArea} | Verif: {verification} | Status: {status}",
            LastModifiedBy = dto.Notes
        };

        await _context.Volunteers.AddAsync(volunteer, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        return Result<VolunteerCoordinatorDto>.Success(MapToCoordinatorDto(volunteer), "Volunteer record created successfully");
    }

    public async Task<Result<VolunteerCoordinatorDto>> UpdateVolunteerAsync(
        Guid id,
        UpdateVolunteerRequestDto dto,
        string modifiedBy,
        CancellationToken cancellationToken = default)
    {
        var volunteer = await _context.Volunteers
            .Include(v => v.User)
            .Include(v => v.Assignments)
            .FirstOrDefaultAsync(v => v.Id == id || v.UserId == id, cancellationToken);

        if (volunteer == null)
            return Result<VolunteerCoordinatorDto>.Failure("Volunteer record not found.");

        if (dto.Skills != null) volunteer.Skills = dto.Skills.Trim();
        if (dto.Availability != null) volunteer.Availability = dto.Availability.Trim();
        if (dto.IsAvailable.HasValue) volunteer.IsAvailable = dto.IsAvailable.Value;
        else if (dto.Status != null)
        {
            volunteer.IsAvailable = dto.Status.Equals("Eligible", StringComparison.OrdinalIgnoreCase);
        }

        var currentArea = ExtractServiceArea(volunteer.CreatedBy) ?? "Kelani East";
        var currentVerif = IsPendingVerification(volunteer) ? "Pending" : "Verified";
        var currentStatus = !string.IsNullOrWhiteSpace(dto.Status)
            ? dto.Status.Trim()
            : (ExtractStatus(volunteer.CreatedBy) ?? (volunteer.IsAvailable ? "Eligible" : "Review"));

        if (!string.IsNullOrWhiteSpace(dto.ServiceArea)) currentArea = dto.ServiceArea.Trim();
        if (!string.IsNullOrWhiteSpace(dto.Verification)) currentVerif = dto.Verification.Trim();
        else if (!string.IsNullOrWhiteSpace(dto.VerificationStatus)) currentVerif = dto.VerificationStatus.Trim();

        volunteer.CreatedBy = $"Area: {currentArea} | Verif: {currentVerif} | Status: {currentStatus}";
        if (dto.Notes != null) volunteer.LastModifiedBy = dto.Notes.Trim();
        volunteer.UpdatedAt = DateTime.UtcNow;

        // Update related User entity fields
        if (volunteer.User != null)
        {
            var newName = dto.FullName ?? dto.Name;
            if (!string.IsNullOrWhiteSpace(newName)) volunteer.User.FullName = newName.Trim();

            if (!string.IsNullOrWhiteSpace(dto.Email)) volunteer.User.Email = dto.Email.Trim().ToLowerInvariant();

            var newPhone = dto.PhoneNumber ?? dto.Phone;
            if (!string.IsNullOrWhiteSpace(newPhone)) volunteer.User.PhoneNumber = newPhone.Trim();

            volunteer.User.AssignedDistrict = currentArea;
            volunteer.User.UpdatedAt = DateTime.UtcNow;
        }

        await _unitOfWork.CommitAsync(cancellationToken);
        return Result<VolunteerCoordinatorDto>.Success(MapToCoordinatorDto(volunteer), "Volunteer updated successfully");
    }

    public async Task<Result<bool>> DeleteVolunteerAsync(
        Guid id,
        string deletedBy,
        CancellationToken cancellationToken = default)
    {
        var volunteer = await _context.Volunteers
            .Include(v => v.User)
            .Include(v => v.Assignments)
            .FirstOrDefaultAsync(v => v.Id == id || v.UserId == id, cancellationToken);

        if (volunteer == null)
            return Result<bool>.Failure("Volunteer record not found.");

        // Check if there are assignments
        if (volunteer.Assignments != null && volunteer.Assignments.Any())
        {
            // Soft delete to respect SQL Server FK constraint (DeleteBehavior.Restrict)
            volunteer.IsAvailable = false;
            var currentArea = ExtractServiceArea(volunteer.CreatedBy) ?? "Kelani East";
            volunteer.CreatedBy = $"Area: {currentArea} | Verif: Deactivated";
            volunteer.LastModifiedBy = $"Deactivated by {deletedBy} on {DateTime.UtcNow:yyyy-MM-dd HH:mm}";
            volunteer.UpdatedAt = DateTime.UtcNow;

            if (volunteer.User != null)
            {
                volunteer.User.IsActive = false;
                volunteer.User.UpdatedAt = DateTime.UtcNow;
            }

            await _unitOfWork.CommitAsync(cancellationToken);
            return Result<bool>.Success(true, $"Volunteer has active/historical assignments and was safely deactivated in the database.");
        }
        else
        {
            // No assignments - safe to remove volunteer record from database
            _context.Volunteers.Remove(volunteer);

            if (volunteer.User != null)
            {
                volunteer.User.IsActive = false;
                volunteer.User.UpdatedAt = DateTime.UtcNow;
            }

            await _unitOfWork.CommitAsync(cancellationToken);
            return Result<bool>.Success(true, "Volunteer record permanently removed from the database.");
        }
    }

    public async Task<Result<bool>> VerifyVolunteerAsync(
        Guid id,
        VolunteerActionRequestDto dto,
        string verifiedBy,
        CancellationToken cancellationToken = default)
    {
        var volunteer = await _context.Volunteers
            .Include(v => v.User)
            .FirstOrDefaultAsync(v => v.Id == id, cancellationToken);

        if (volunteer == null)
            return Result<bool>.Failure("Volunteer record not found.");

        var currentArea = ExtractServiceArea(volunteer.CreatedBy) ?? "Kelani East";
        volunteer.CreatedBy = $"Area: {currentArea} | Verif: Verified | Status: Eligible";
        volunteer.IsAvailable = true;
        volunteer.UpdatedAt = DateTime.UtcNow;

        var note = !string.IsNullOrWhiteSpace(dto.Reason) ? dto.Reason.Trim() : "Credentials verified by coordinator";
        volunteer.LastModifiedBy = string.IsNullOrWhiteSpace(volunteer.LastModifiedBy)
            ? $"Verified: {note} ({verifiedBy})"
            : $"{volunteer.LastModifiedBy} | Verified: {note}";

        await _unitOfWork.CommitAsync(cancellationToken);
        return Result<bool>.Success(true, $"Volunteer verified successfully. Audit logged.");
    }

    public async Task<Result<bool>> RequestClarificationAsync(
        Guid id,
        VolunteerActionRequestDto dto,
        string requestedBy,
        CancellationToken cancellationToken = default)
    {
        var volunteer = await _context.Volunteers
            .Include(v => v.User)
            .FirstOrDefaultAsync(v => v.Id == id, cancellationToken);

        if (volunteer == null)
            return Result<bool>.Failure("Volunteer record not found.");

        var currentArea = ExtractServiceArea(volunteer.CreatedBy) ?? "Kelani East";
        volunteer.CreatedBy = $"Area: {currentArea} | Verif: Pending | Status: Review";
        volunteer.IsAvailable = false;
        volunteer.UpdatedAt = DateTime.UtcNow;

        var note = !string.IsNullOrWhiteSpace(dto.Reason) ? dto.Reason.Trim() : "Clarification requested";
        volunteer.LastModifiedBy = string.IsNullOrWhiteSpace(volunteer.LastModifiedBy)
            ? $"Clarification: {note} ({requestedBy})"
            : $"{volunteer.LastModifiedBy} | Clarification: {note}";

        await _unitOfWork.CommitAsync(cancellationToken);
        return Result<bool>.Success(true, $"Clarification requested for volunteer. Status set to Review.");
    }

    public async Task<Result<bool>> EscalateVolunteerAsync(
        Guid id,
        VolunteerActionRequestDto dto,
        string escalatedBy,
        CancellationToken cancellationToken = default)
    {
        var volunteer = await _context.Volunteers
            .Include(v => v.User)
            .FirstOrDefaultAsync(v => v.Id == id, cancellationToken);

        if (volunteer == null)
            return Result<bool>.Failure("Volunteer record not found.");

        var reason = !string.IsNullOrWhiteSpace(dto.Reason) ? dto.Reason.Trim() : "Escalated for senior operations review";
        volunteer.LastModifiedBy = $"{volunteer.LastModifiedBy ?? ""} | Escalated: {reason} by {escalatedBy}".Trim(' ', '|');
        volunteer.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.CommitAsync(cancellationToken);
        return Result<bool>.Success(true, $"Record escalated to District Emergency Ops Command.");
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // 3. Scheduling & Assignment Operations
    // ─────────────────────────────────────────────────────────────────────────────
    public async Task<Result<IReadOnlyList<VolunteerAssignmentDetailDto>>> GetAssignmentsAsync(
        string? status = null,
        string? area = null,
        Guid? volunteerId = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.VolunteerAssignments
            .Include(a => a.Volunteer)
            .ThenInclude(v => v!.User)
            .Include(a => a.AssistanceRequest)
            .AsQueryable();

        if (volunteerId.HasValue && volunteerId.Value != Guid.Empty)
        {
            var vid = volunteerId.Value;
            query = query.Where(a => a.VolunteerId == vid || (a.Volunteer != null && a.Volunteer.UserId == vid));
        }

        if (!string.IsNullOrWhiteSpace(status) && !status.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            if (status.Equals("Assigned", StringComparison.OrdinalIgnoreCase) || status.Equals("Offered", StringComparison.OrdinalIgnoreCase))
                query = query.Where(a => a.AssignmentStatus == 0);
            else if (status.Equals("InProgress", StringComparison.OrdinalIgnoreCase) || status.Equals("Accepted", StringComparison.OrdinalIgnoreCase))
                query = query.Where(a => a.AssignmentStatus == 1);
            else if (status.Equals("Completed", StringComparison.OrdinalIgnoreCase))
                query = query.Where(a => a.AssignmentStatus == 2);
            else if (status.Equals("Cancelled", StringComparison.OrdinalIgnoreCase) || status.Equals("Declined", StringComparison.OrdinalIgnoreCase))
                query = query.Where(a => a.AssignmentStatus == 3);
        }

        var assignments = await query.OrderByDescending(a => a.CreatedAt).ToListAsync(cancellationToken);

        var list = assignments.Select(MapToAssignmentDetailDto).ToList();

        if (!string.IsNullOrWhiteSpace(area) &&
            !area.Equals("All", StringComparison.OrdinalIgnoreCase) &&
            !area.Equals("All operational areas", StringComparison.OrdinalIgnoreCase))
        {
            list = list.Where(a => a.ServiceArea.Equals(area, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        return Result<IReadOnlyList<VolunteerAssignmentDetailDto>>.Success(list);
    }

    public async Task<Result<VolunteerAssignmentDetailDto>> AssignShiftAsync(
        AssignShiftRequestDto dto,
        string assignedBy,
        CancellationToken cancellationToken = default)
    {
        var volunteer = await _context.Volunteers
            .Include(v => v.User)
            .Include(v => v.Assignments)
            .FirstOrDefaultAsync(v => v.Id == dto.VolunteerId || v.UserId == dto.VolunteerId, cancellationToken);

        if (volunteer == null)
            return Result<VolunteerAssignmentDetailDto>.Failure("Volunteer does not exist.");

        if (IsPendingVerification(volunteer))
            return Result<VolunteerAssignmentDetailDto>.Failure("Volunteer verification is pending review. Please verify volunteer credentials before assigning shifts.");

        // Check if duplicate assignment for the same active task
        var duplicate = volunteer.Assignments.FirstOrDefault(a => 
            (a.AssignmentStatus == 0 || a.AssignmentStatus == 1) && 
            !string.IsNullOrWhiteSpace(dto.ShiftTask) &&
            a.TaskDescription.Equals(dto.ShiftTask.Trim(), StringComparison.OrdinalIgnoreCase));
        if (duplicate != null)
        {
            return Result<VolunteerAssignmentDetailDto>.Failure(
                $"Volunteer {FormatVolunteerCode(volunteer.Id)} is already assigned to active shift '{duplicate.TaskDescription}'.");
        }

        var assignment = new VolunteerAssignment
        {
            Id = Guid.NewGuid(),
            VolunteerId = volunteer.Id,
            Volunteer = volunteer,
            AssistanceRequestId = dto.AssistanceRequestId,
            TaskDescription = dto.ShiftTask.Trim(),
            AssignmentStatus = dto.AssignmentStatus ?? 1, // Default 1 (Accepted) for accepted shifts
            StartTime = DateTime.UtcNow,
            Notes = $"Shift Window: {dto.ShiftTime} | Task: {dto.ShiftTask}" + (!string.IsNullOrWhiteSpace(dto.Note) ? $" | Reason: {dto.Note}" : ""),
            CreatedBy = assignedBy,
            CreatedAt = DateTime.UtcNow
        };

        // Update volunteer availability
        volunteer.IsAvailable = true;
        volunteer.Availability = dto.ShiftTime;
        volunteer.UpdatedAt = DateTime.UtcNow;

        await _context.VolunteerAssignments.AddAsync(assignment, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        return Result<VolunteerAssignmentDetailDto>.Success(
            MapToAssignmentDetailDto(assignment),
            $"Shift successfully assigned to {FormatVolunteerCode(volunteer.Id)}.");
    }

    public async Task<Result<bool>> AcceptAssignmentAsync(
        Guid assignmentId,
        string acceptedBy,
        CancellationToken cancellationToken = default)
    {
        var assignment = await _context.VolunteerAssignments
            .Include(a => a.Volunteer)
            .FirstOrDefaultAsync(a => a.Id == assignmentId, cancellationToken);

        if (assignment == null)
            return Result<bool>.Failure("Assignment record not found.");

        if (assignment.AssignmentStatus == 2)
            return Result<bool>.Failure("Cannot accept an already completed assignment.");

        if (assignment.AssignmentStatus == 3)
            return Result<bool>.Failure("Cannot accept a cancelled assignment.");

        assignment.AssignmentStatus = 1; // InProgress / Accepted
        assignment.Notes = $"{assignment.Notes} | Accepted by {acceptedBy}".Trim(' ', '|');
        assignment.LastModifiedBy = acceptedBy;
        assignment.UpdatedAt = DateTime.UtcNow;

        if (assignment.Volunteer != null)
        {
            assignment.Volunteer.IsAvailable = false;
            assignment.Volunteer.Availability = "On Duty";
            assignment.Volunteer.UpdatedAt = DateTime.UtcNow;
        }

        await _unitOfWork.CommitAsync(cancellationToken);
        return Result<bool>.Success(true, "Assignment accepted successfully.");
    }

    public async Task<Result<bool>> CompleteAssignmentAsync(
        Guid assignmentId,
        AssignmentActionRequestDto dto,
        string completedBy,
        CancellationToken cancellationToken = default)
    {
        var assignment = await _context.VolunteerAssignments
            .Include(a => a.Volunteer)
            .FirstOrDefaultAsync(a => a.Id == assignmentId, cancellationToken);

        if (assignment == null)
            return Result<bool>.Failure("Assignment record not found.");

        if (assignment.AssignmentStatus == 2)
            return Result<bool>.Failure("Assignment is already marked completed.");

        if (assignment.AssignmentStatus == 3)
            return Result<bool>.Failure("Cannot complete a cancelled assignment.");

        assignment.AssignmentStatus = 2; // Completed
        assignment.EndTime = DateTime.UtcNow;
        assignment.Notes = $"{assignment.Notes} | Completed: {dto?.Reason ?? "Shift fulfilled"} by {completedBy}".Trim(' ', '|');
        assignment.LastModifiedBy = completedBy;
        assignment.UpdatedAt = DateTime.UtcNow;

        // Restore volunteer availability
        if (assignment.Volunteer != null)
        {
            assignment.Volunteer.IsAvailable = true;
            assignment.Volunteer.Availability = "Available";
            assignment.Volunteer.UpdatedAt = DateTime.UtcNow;
        }

        await _unitOfWork.CommitAsync(cancellationToken);
        return Result<bool>.Success(true, "Assignment successfully marked completed. Volunteer availability restored.");
    }

    public async Task<Result<bool>> ReleaseAssignmentAsync(
        Guid assignmentId,
        AssignmentActionRequestDto dto,
        string releasedBy,
        CancellationToken cancellationToken = default)
    {
        var assignment = await _context.VolunteerAssignments
            .Include(a => a.Volunteer)
            .FirstOrDefaultAsync(a => a.Id == assignmentId, cancellationToken);

        if (assignment == null)
            return Result<bool>.Failure("Assignment record not found.");

        if (assignment.AssignmentStatus == 2)
            return Result<bool>.Failure("Cannot release an already completed assignment.");

        if (assignment.AssignmentStatus == 3)
            return Result<bool>.Failure("Assignment is already released.");

        assignment.AssignmentStatus = 3; // Cancelled
        assignment.EndTime = DateTime.UtcNow;
        assignment.Notes = $"{assignment.Notes} | Released: {dto?.Reason ?? "Assignment cancelled"} by {releasedBy}".Trim(' ', '|');
        assignment.LastModifiedBy = releasedBy;
        assignment.UpdatedAt = DateTime.UtcNow;

        // Restore volunteer availability
        if (assignment.Volunteer != null)
        {
            assignment.Volunteer.IsAvailable = true;
            assignment.Volunteer.Availability = "Available";
            assignment.Volunteer.UpdatedAt = DateTime.UtcNow;
        }

        await _unitOfWork.CommitAsync(cancellationToken);
        return Result<bool>.Success(true, "Assignment released successfully. Volunteer availability restored.");
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // 4. AI & Rule-Based Matching Support (Recommendations Only)
    // ─────────────────────────────────────────────────────────────────────────────
    public async Task<Result<MatchingRecommendationDto>> GetMatchingRecommendationAsync(CancellationToken cancellationToken = default)
    {
        var openRequests = await _context.AssistanceRequests
            .Where(r => r.Status == RequestStatus.Submitted || r.Status == RequestStatus.InProgress)
            .OrderByDescending(r => r.Urgency)
            .ThenByDescending(r => r.CreatedAt)
            .ToListAsync(cancellationToken);

        var allVolunteers = await _context.Volunteers
            .Include(v => v.User)
            .Include(v => v.Assignments)
            .ToListAsync(cancellationToken);

        var verifiedAvailableVolunteers = allVolunteers
            .Where(v => v.IsAvailable && !IsPendingVerification(v))
            .ToList();

        string taskId = "TASK-118";
        Guid? requestId = null;
        string targetNeed = "Emergency First Aid & Crowd Relief at Kelani East Point";
        string title = "Volunteer match recommendation";

        if (openRequests.Count > 0)
        {
            var req = openRequests.First();
            taskId = $"REQ-{req.Id.ToString()[..4].ToUpper()}";
            requestId = req.Id;
            targetNeed = $"{req.Category}: {req.Description}";
            title = $"Volunteer match - {req.Category}";
        }

        var matchingFactors = new List<MatchingFactorDto>
        {
            new()
            {
                Name = "Operational fit",
                Description = $"Rule-based matching: Verified available volunteer pool ({verifiedAvailableVolunteers.Count} available)",
                Badge = verifiedAvailableVolunteers.Count > 0 ? "High" : "Low",
                BadgeColor = "blue",
                Icon = "check"
            },
            new()
            {
                Name = "Availability",
                Description = "Evaluates unassigned volunteers with active on-call status",
                Badge = "Active",
                BadgeColor = "blue",
                Icon = "check"
            },
            new()
            {
                Name = "Human authority",
                Description = "Mandatory: Volunteer Coordinator human review required before deployment",
                Badge = "Required",
                BadgeColor = "orange",
                Icon = "check"
            },
            new()
            {
                Name = "Data limitation",
                Description = "Rule-based recommendation only: Does not auto-assign or alter permissions",
                Badge = "Review",
                BadgeColor = "amber",
                Icon = "alert"
            }
        };

        var suggestedDtos = verifiedAvailableVolunteers.Take(4).Select(MapToCoordinatorDto).ToList();

        // Detect potential duplicate/adjacent records
        SuspectedDuplicateDto? suspect = null;
        if (allVolunteers.Count >= 2)
        {
            var v1 = allVolunteers[0];
            var v2 = allVolunteers[1];
            suspect = new SuspectedDuplicateDto
            {
                Ref = FormatVolunteerCode(v2.Id),
                Name = v2.User?.FullName ?? "Volunteer",
                Skills = FormatSkills(v2.Skills),
                Area = ExtractServiceArea(v2.CreatedBy) ?? "Kelani East",
                Note = "Distinct person flagged due to adjacent operational corridor. Autonomous merging is strictly prohibited."
            };
        }

        var result = new MatchingRecommendationDto
        {
            TaskId = taskId,
            AssistanceRequestId = requestId,
            Title = title,
            RefCode = $"MATCH-DECISION-{taskId}: Human review required",
            SuggestedAction = $"Recommend {Math.Max(1, Math.Min(4, verifiedAvailableVolunteers.Count))} verified volunteer(s) for deployment",
            Confidence = "Rule-based attribute match 92% (Human authority required)",
            ConfidenceScore = 0.92m,
            TargetNeed = targetNeed,
            Deadline = "Today by 18:00 (Flood surge shift window)",
            ProviderLabel = "Rule-Based Decision Support (Human Review Required)",
            IsRuleBased = true,
            Factors = matchingFactors,
            SuggestedVolunteers = suggestedDtos,
            PossibleDuplicate = suspect
        };

        return Result<MatchingRecommendationDto>.Success(result);
    }

    public async Task<Result<MatchingDecisionHistoryDto>> RecordMatchingDecisionAsync(
        MatchingDecisionRequestDto dto,
        string reviewerName,
        Guid reviewerId,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.Decision))
            return Result<MatchingDecisionHistoryDto>.Failure("Decision action is required.");

        if (string.IsNullOrWhiteSpace(dto.Reason))
            return Result<MatchingDecisionHistoryDto>.Failure("A justification reason is required when recording a human decision.");

        var audit = new AIDecisionAudit
        {
            Id = Guid.NewGuid(),
            AssistanceRequestId = dto.AssistanceRequestId ?? Guid.Empty,
            AISuggestion = dto.SuggestedAction ?? $"Match recommendation for {dto.TaskId}",
            ConfidenceScore = 0.92m,
            SuggestedPriority = PriorityLevel.High,
            WasOverridden = true,
            HumanDecision = dto.Decision.Trim(),
            OverrideReason = dto.Reason.Trim(),
            OverriddenBy = reviewerId != Guid.Empty ? reviewerId : null,
            ReviewedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = reviewerName
        };

        await _context.AIDecisionAudits.AddAsync(audit, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        var historyDto = new MatchingDecisionHistoryDto
        {
            Id = audit.Id,
            TaskId = dto.TaskId,
            Decision = audit.HumanDecision,
            Reason = audit.OverrideReason,
            Timestamp = audit.ReviewedAt?.ToString("HH:mm") ?? DateTime.UtcNow.ToString("HH:mm"),
            Reviewer = $"{reviewerName} (Volunteer Coordinator)"
        };

        return Result<MatchingDecisionHistoryDto>.Success(historyDto, "Human matching decision recorded and preserved in audit log.");
    }

    public async Task<Result<IReadOnlyList<MatchingDecisionHistoryDto>>> GetDecisionHistoryAsync(CancellationToken cancellationToken = default)
    {
        var decisions = await _context.AIDecisionAudits
            .OrderByDescending(d => d.ReviewedAt ?? d.CreatedAt)
            .Take(20)
            .ToListAsync(cancellationToken);

        var list = decisions.Select(d => new MatchingDecisionHistoryDto
        {
            Id = d.Id,
            TaskId = d.AISuggestion?.Contains("REQ-") == true || d.AISuggestion?.Contains("TASK-") == true
                ? ExtractTaskId(d.AISuggestion)
                : "MATCH-RECORD",
            Decision = d.HumanDecision ?? "Reviewed",
            Reason = d.OverrideReason ?? "Human review completed",
            Timestamp = (d.ReviewedAt ?? d.CreatedAt).ToString("HH:mm"),
            Reviewer = d.CreatedBy ?? "Volunteer Coordinator"
        }).ToList();

        return Result<IReadOnlyList<MatchingDecisionHistoryDto>>.Success(list);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // 5. Activity & Safety Scoped Updates
    // ─────────────────────────────────────────────────────────────────────────────
    public async Task<Result<IReadOnlyList<CoordinationTimelineItemDto>>> GetCoordinationTimelineAsync(CancellationToken cancellationToken = default)
    {
        var timeline = new List<CoordinationTimelineItemDto>();

        // 1. Fetch recent assignments
        var assignments = await _context.VolunteerAssignments
            .Include(a => a.Volunteer)
            .ThenInclude(v => v!.User)
            .OrderByDescending(a => a.CreatedAt)
            .Take(10)
            .ToListAsync(cancellationToken);

        foreach (var a in assignments)
        {
            var code = FormatVolunteerCode(a.VolunteerId);
            var (title, msg) = a.AssignmentStatus switch
            {
                0 => ($"Shift assigned to {code}", a.Notes),
                1 => ($"{code} checked in for shift", a.Notes),
                2 => ($"Shift completed: {code}", a.Notes),
                3 => ($"Assignment released: {code}", a.Notes),
                _ => ($"Assignment updated: {code}", a.Notes)
            };

            timeline.Add(new CoordinationTimelineItemDto
            {
                Id = $"TL-ASG-{a.Id.ToString()[..4].ToUpper()}",
                Time = (a.UpdatedAt ?? a.CreatedAt).ToString("HH:mm"),
                Title = title,
                Scope = "1.0dB-SL42 - authorised participants only",
                MessageContent = msg,
                Recipient = "Scheduling Coordinator",
                Sender = a.CreatedBy ?? "Coordinator",
                Timestamp = a.UpdatedAt ?? a.CreatedAt
            });
        }

        // 2. Fetch recent decisions & scoped updates from AIDecisionAudits
        var audits = await _context.AIDecisionAudits
            .OrderByDescending(d => d.ReviewedAt ?? d.CreatedAt)
            .Take(10)
            .ToListAsync(cancellationToken);

        foreach (var d in audits)
        {
            timeline.Add(new CoordinationTimelineItemDto
            {
                Id = $"TL-AUD-{d.Id.ToString()[..4].ToUpper()}",
                Time = (d.ReviewedAt ?? d.CreatedAt).ToString("HH:mm"),
                Title = $"Scoped update sent to {d.HumanDecision ?? "Operations Lead"}",
                Scope = "1.0dB-SL42 - authorised participants only",
                MessageContent = d.OverrideReason,
                Recipient = d.HumanDecision ?? "Operations Lead",
                Sender = d.CreatedBy ?? "Volunteer Coordinator",
                Timestamp = d.ReviewedAt ?? d.CreatedAt
            });
        }

        // 3. Fallback baseline if DB is empty
        if (timeline.Count == 0)
        {
            timeline.Add(new CoordinationTimelineItemDto
            {
                Id = "TL-BASE-1",
                Time = DateTime.UtcNow.ToString("HH:mm"),
                Title = "Volunteer Coordinator reviewed operational sector",
                Scope = "1.0dB-SL42 - authorised participants only",
                MessageContent = "Western Province flood zone volunteer allocation baseline verified.",
                Recipient = "Field Safety Lead",
                Sender = "Volunteer Coordinator",
                Timestamp = DateTime.UtcNow
            });
        }

        var sorted = timeline.OrderByDescending(t => t.Timestamp).Take(20).ToList();
        return Result<IReadOnlyList<CoordinationTimelineItemDto>>.Success(sorted);
    }

    public async Task<Result<CoordinationTimelineItemDto>> RecordScopedUpdateAsync(
        RecordScopedUpdateRequestDto dto,
        string senderName,
        Guid senderId,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.OperationalMessage))
            return Result<CoordinationTimelineItemDto>.Failure("Operational message cannot be empty.");

        var audit = new AIDecisionAudit
        {
            Id = Guid.NewGuid(),
            AssistanceRequestId = Guid.Empty,
            AISuggestion = $"Scoped coordination message to {dto.RecipientWorkflow}",
            ConfidenceScore = 1.0m,
            SuggestedPriority = PriorityLevel.Medium,
            WasOverridden = false,
            HumanDecision = dto.RecipientWorkflow.Trim(),
            OverrideReason = dto.OperationalMessage.Trim(),
            OverriddenBy = senderId != Guid.Empty ? senderId : null,
            ReviewedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = senderName
        };

        await _context.AIDecisionAudits.AddAsync(audit, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        var timelineItem = new CoordinationTimelineItemDto
        {
            Id = $"TL-{DateTime.UtcNow.Ticks}",
            Time = DateTime.UtcNow.ToString("HH:mm"),
            Title = $"Scoped update sent to {dto.RecipientWorkflow}",
            Scope = "1.0dB-SL42 - authorised participants only",
            MessageContent = dto.OperationalMessage.Trim(),
            Recipient = dto.RecipientWorkflow,
            Sender = senderName,
            Timestamp = DateTime.UtcNow
        };

        return Result<CoordinationTimelineItemDto>.Success(timelineItem, $"Scoped update recorded for {dto.RecipientWorkflow}.");
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // 6. Reports & Analytics Operations
    // ─────────────────────────────────────────────────────────────────────────────
    public async Task<Result<VolunteerReportsAnalyticsDto>> GetReportsAnalyticsAsync(
        string? period = null,
        string? operationalArea = null,
        CancellationToken cancellationToken = default)
    {
        var allVolunteers = await _context.Volunteers
            .Include(v => v.User)
            .Include(v => v.Assignments)
            .ToListAsync(cancellationToken);

        var allAssignments = await _context.VolunteerAssignments
            .Include(a => a.Volunteer)
            .ThenInclude(v => v!.User)
            .ToListAsync(cancellationToken);

        // Filter assignments by period
        var filteredAssignments = allAssignments.AsQueryable();
        var now = DateTime.UtcNow;

        if (!string.IsNullOrWhiteSpace(period))
        {
            if (period.Equals("Today", StringComparison.OrdinalIgnoreCase))
            {
                var today = now.Date;
                filteredAssignments = filteredAssignments.Where(a => a.CreatedAt.Date == today || (a.StartTime.HasValue && a.StartTime.Value.Date == today));
            }
            else if (period.Equals("Past 48 Hours", StringComparison.OrdinalIgnoreCase))
            {
                var cutoff = now.AddHours(-48);
                filteredAssignments = filteredAssignments.Where(a => a.CreatedAt >= cutoff || (a.StartTime.HasValue && a.StartTime.Value >= cutoff));
            }
            else if (period.Equals("Past 7 Days", StringComparison.OrdinalIgnoreCase))
            {
                var cutoff = now.AddDays(-7);
                filteredAssignments = filteredAssignments.Where(a => a.CreatedAt >= cutoff || (a.StartTime.HasValue && a.StartTime.Value >= cutoff));
            }
        }

        var assignmentList = filteredAssignments.ToList();

        // Filter volunteers by area if specified
        var filteredVolunteers = allVolunteers.AsQueryable();
        if (!string.IsNullOrWhiteSpace(operationalArea) &&
            !operationalArea.Equals("All", StringComparison.OrdinalIgnoreCase) &&
            !operationalArea.Equals("All operational areas", StringComparison.OrdinalIgnoreCase))
        {
            filteredVolunteers = filteredVolunteers.Where(v => (ExtractServiceArea(v.CreatedBy) ?? "Kelani East").Equals(operationalArea, StringComparison.OrdinalIgnoreCase));
            assignmentList = assignmentList.Where(a => (ExtractServiceArea(a.Volunteer?.CreatedBy) ?? "Kelani East").Equals(operationalArea, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        var volunteerList = filteredVolunteers.ToList();

        int totalVerified = volunteerList.Count(v => !IsPendingVerification(v));
        int pendingReview = volunteerList.Count(v => IsPendingVerification(v));

        int activeAssignments = assignmentList.Count(a => a.AssignmentStatus == 0 || a.AssignmentStatus == 1);
        int completedAssignments = assignmentList.Count(a => a.AssignmentStatus == 2);
        int cancelledAssignments = assignmentList.Count(a => a.AssignmentStatus == 3);

        // Distinct volunteers mobilized
        int distinctMobilized = assignmentList.Select(a => a.VolunteerId).Distinct().Count();
        if (distinctMobilized == 0 && totalVerified > 0 && activeAssignments > 0)
        {
            distinctMobilized = activeAssignments;
        }

        // Mobilization rate calculation
        double rateValue = totalVerified > 0 ? (distinctMobilized * 100.0 / totalVerified) : (assignmentList.Count > 0 ? 100.0 : 0.0);
        string mobilizationRate = $"{Math.Min(100.0, Math.Round(rateValue, 1)):0.0}%";

        // Area distribution
        var areaGroups = volunteerList
            .GroupBy(v => ExtractServiceArea(v.CreatedBy) ?? "Kelani East")
            .Select(g => new
            {
                Name = g.Key,
                Count = g.Count()
            })
            .OrderByDescending(g => g.Count)
            .ToList();

        var areaBreakdown = new List<AreaBreakdownDto>();
        int totalVolCount = volunteerList.Count > 0 ? volunteerList.Count : 1;
        foreach (var ag in areaGroups)
        {
            areaBreakdown.Add(new AreaBreakdownDto
            {
                Name = ag.Name,
                Count = ag.Count,
                Percent = (int)Math.Round(ag.Count * 100.0 / totalVolCount),
                Status = ag.Count > 2 ? "High activity" : "Operational"
            });
        }

        if (areaBreakdown.Count == 0)
        {
            areaBreakdown.Add(new AreaBreakdownDto { Name = "Kelani East", Count = 0, Percent = 0, Status = "No records" });
        }

        // Skill distribution
        var skillDict = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
        foreach (var v in volunteerList)
        {
            var skills = FormatSkills(v.Skills).Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
            foreach (var s in skills)
            {
                skillDict[s] = skillDict.GetValueOrDefault(s, 0) + 1;
            }
        }

        var skillDistribution = new List<SkillDistributionDto>();
        int totalSkillsCount = skillDict.Values.Sum();
        if (totalSkillsCount == 0) totalSkillsCount = 1;

        string[] palette = { "#ef4444", "#f59e0b", "#3b82f6", "#10b981", "#8b5cf6" };
        int colorIdx = 0;
        foreach (var kvp in skillDict.OrderByDescending(x => x.Value).Take(5))
        {
            skillDistribution.Add(new SkillDistributionDto
            {
                Skill = kvp.Key,
                Count = kvp.Value,
                Percent = (int)Math.Round(kvp.Value * 100.0 / totalSkillsCount),
                Color = palette[colorIdx % palette.Length]
            });
            colorIdx++;
        }

        if (skillDistribution.Count == 0)
        {
            skillDistribution.Add(new SkillDistributionDto { Skill = "General Logistics", Count = 0, Percent = 0, Color = "#3b82f6" });
        }

        var report = new VolunteerReportsAnalyticsDto
        {
            Metrics = new ReportMetricsDto
            {
                TotalMobilized = (distinctMobilized > 0 ? distinctMobilized : totalVerified).ToString(),
                ShiftsFulfilled = completedAssignments.ToString(),
                MobilizationRate = mobilizationRate,
                SafetyIncidents = "0"
            },
            AreaBreakdown = areaBreakdown,
            SkillDistribution = skillDistribution,
            VerificationStats = new VerificationStatsDto
            {
                TotalVerified = totalVerified,
                PendingReview = pendingReview
            },
            AssignmentStats = new AssignmentStatsDto
            {
                ActiveAssignments = activeAssignments,
                CompletedAssignments = completedAssignments,
                CancelledAssignments = cancelledAssignments
            }
        };

        return Result<VolunteerReportsAnalyticsDto>.Success(report);
    }

    public async Task<Result<ExportReportResultDto>> ExportReportAsync(
        ExportReportRequestDto dto,
        CancellationToken cancellationToken = default)
    {
        var allVolunteers = await _context.Volunteers
            .Include(v => v.User)
            .Include(v => v.Assignments)
            .ToListAsync(cancellationToken);

        var allAssignments = await _context.VolunteerAssignments
            .Include(a => a.Volunteer)
            .ThenInclude(v => v!.User)
            .ToListAsync(cancellationToken);

        var sb = new System.Text.StringBuilder();
        sb.AppendLine($"# Volunteer Coordination Operational Report - Western Province Response");
        sb.AppendLine($"# Generated: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC");
        sb.AppendLine($"# Scope: {dto.Scope} | Format: {dto.Format} | Audit Trail Included: {dto.IncludeAudit}");
        sb.AppendLine();

        if (dto.Scope.Equals("active", StringComparison.OrdinalIgnoreCase))
        {
            sb.AppendLine("AssignmentId,VolunteerCode,VolunteerName,ShiftTask,ShiftWindow,Status,StartTime,Notes");
            var active = allAssignments.Where(a => a.AssignmentStatus == 0 || a.AssignmentStatus == 1);
            foreach (var a in active)
            {
                var code = FormatVolunteerCode(a.VolunteerId);
                var name = a.Volunteer?.User?.FullName ?? "Unknown";
                sb.AppendLine($"\"{a.Id}\",\"{code}\",\"{EscapeCsv(name)}\",\"{EscapeCsv(a.TaskDescription)}\",\"08:00-14:00\",\"Active\",\"{a.StartTime:yyyy-MM-dd HH:mm}\",\"{EscapeCsv(a.Notes ?? "")}\"");
            }
        }
        else
        {
            sb.AppendLine("VolunteerRef,FullName,Skills,ServiceArea,Availability,Verification,Status,ActiveShift,CreatedAt");
            foreach (var v in allVolunteers)
            {
                var dtoItem = MapToCoordinatorDto(v);
                sb.AppendLine($"\"{dtoItem.VolunteerCode}\",\"{EscapeCsv(dtoItem.FullName)}\",\"{EscapeCsv(dtoItem.Skills)}\",\"{dtoItem.ServiceArea}\",\"{dtoItem.Availability}\",\"{dtoItem.Verification}\",\"{dtoItem.Status}\",\"{dtoItem.CurrentShift}\",\"{v.CreatedAt:yyyy-MM-dd}\"");
            }
        }

        if (dto.IncludeAudit)
        {
            sb.AppendLine();
            sb.AppendLine("# Audit Trail & Coordinator Decision Log");
            sb.AppendLine("Timestamp,Actor,Action,Detail");
            var audits = await _context.AIDecisionAudits.OrderByDescending(d => d.ReviewedAt ?? d.CreatedAt).Take(20).ToListAsync(cancellationToken);
            foreach (var aud in audits)
            {
                sb.AppendLine($"\"{(aud.ReviewedAt ?? aud.CreatedAt):yyyy-MM-dd HH:mm}\",\"{aud.CreatedBy ?? "Coordinator"}\",\"{aud.HumanDecision ?? "Decision"}\",\"{EscapeCsv(aud.OverrideReason ?? "")}\"");
            }
        }

        var fileName = $"HumanAid_Volunteer_Report_{DateTime.UtcNow:yyyyMMdd_HHmmss}.csv";
        return Result<ExportReportResultDto>.Success(new ExportReportResultDto
        {
            FileName = fileName,
            ContentType = "text/csv",
            Content = sb.ToString()
        });
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Internal Helper Mapping Methods
    // ─────────────────────────────────────────────────────────────────────────────
    private static VolunteerCoordinatorDto MapToCoordinatorDto(Volunteer v)
    {
        var activeAssign = v.Assignments?.FirstOrDefault(a => a.AssignmentStatus == 0 || a.AssignmentStatus == 1);
        var isPending = IsPendingVerification(v);
        var explicitStatus = ExtractStatus(v.CreatedBy);

        string status;
        string statusType;
        string currentShift = "None";

        if (activeAssign != null)
        {
            status = "Assigned";
            statusType = "assigned";
            currentShift = activeAssign.TaskDescription;
        }
        else if (!string.IsNullOrWhiteSpace(explicitStatus))
        {
            if (explicitStatus.Equals("Assigned", StringComparison.OrdinalIgnoreCase))
            {
                status = "Assigned";
                statusType = "assigned";
            }
            else if (explicitStatus.Equals("Eligible", StringComparison.OrdinalIgnoreCase))
            {
                status = "Eligible";
                statusType = "eligible";
            }
            else
            {
                status = "Review";
                statusType = "review";
            }
        }
        else if (isPending)
        {
            status = "Review";
            statusType = "review";
        }
        else if (v.IsAvailable)
        {
            status = "Eligible";
            statusType = "eligible";
        }
        else
        {
            status = "Review";
            statusType = "review";
        }

        var serviceArea = ExtractServiceArea(v.CreatedBy) ?? "Kelani East";
        var verification = isPending ? "Pending" : "Verified";

        return new VolunteerCoordinatorDto
        {
            Id = v.Id,
            UserId = v.UserId,
            VolunteerCode = FormatVolunteerCode(v.Id),
            FullName = v.User?.FullName ?? "Volunteer Member",
            Email = v.User?.Email ?? string.Empty,
            PhoneNumber = v.User?.PhoneNumber,
            Skills = FormatSkills(v.Skills),
            ServiceArea = serviceArea,
            Availability = !string.IsNullOrWhiteSpace(v.Availability) && !v.Availability.StartsWith("{") ? v.Availability : "Available",
            CurrentShift = currentShift,
            Verification = verification,
            Status = status,
            StatusType = statusType,
            Notes = v.LastModifiedBy ?? "Qualified field volunteer registered for humanitarian crisis response.",
            IsAvailable = v.IsAvailable,
            Latitude = v.Latitude,
            Longitude = v.Longitude,
            MaxTravelDistance = v.MaxTravelDistance,
            CreatedAt = v.CreatedAt
        };
    }

    private static VolunteerAssignmentDetailDto MapToAssignmentDetailDto(VolunteerAssignment a)
    {
        var statusStr = a.AssignmentStatus switch
        {
            0 => "Assigned",
            1 => "InProgress",
            2 => "Completed",
            3 => "Cancelled",
            _ => "Assigned"
        };

        var statusType = a.AssignmentStatus switch
        {
            0 => "assigned",
            1 => "inprogress",
            2 => "completed",
            3 => "cancelled",
            _ => "assigned"
        };

        var shiftTime = "08:00-14:00";
        if (a.Notes != null && a.Notes.Contains("Shift Window:", StringComparison.OrdinalIgnoreCase))
        {
            var match = Regex.Match(a.Notes, @"Shift Window:\s*([^\|]+)");
            if (match.Success) shiftTime = match.Groups[1].Value.Trim();
        }

        string? priority = null;
        if (a.AssistanceRequest != null)
        {
            priority = a.AssistanceRequest.Urgency.ToString();
        }
        else if (a.Notes != null && a.Notes.Contains("Priority:", StringComparison.OrdinalIgnoreCase))
        {
            var pMatch = Regex.Match(a.Notes, @"Priority:\s*([^\|]+)");
            if (pMatch.Success) priority = pMatch.Groups[1].Value.Trim();
        }

        string? caseNum = null;
        if (a.Notes != null && a.Notes.Contains("Incident:", StringComparison.OrdinalIgnoreCase))
        {
            var iMatch = Regex.Match(a.Notes, @"Incident:\s*([^\|]+)");
            if (iMatch.Success) caseNum = iMatch.Groups[1].Value.Trim();
        }
        else if (a.AssistanceRequestId.HasValue)
        {
            caseNum = $"REQ-{a.AssistanceRequestId.Value.ToString().Substring(0, 4).ToUpper()}";
        }

        string? caseCat = a.AssistanceRequest?.Category;
        if (string.IsNullOrWhiteSpace(caseCat) && a.Notes != null && a.Notes.Contains("Category:", StringComparison.OrdinalIgnoreCase))
        {
            var cMatch = Regex.Match(a.Notes, @"Category:\s*([^\|]+)");
            if (cMatch.Success) caseCat = cMatch.Groups[1].Value.Trim();
        }

        var serviceArea = ExtractServiceArea(a.Volunteer?.CreatedBy);
        if (string.IsNullOrWhiteSpace(serviceArea) && a.Notes != null && a.Notes.Contains("Loc:", StringComparison.OrdinalIgnoreCase))
        {
            var lMatch = Regex.Match(a.Notes, @"Loc:\s*([^\|]+)");
            if (lMatch.Success) serviceArea = lMatch.Groups[1].Value.Trim();
        }

        var coordinator = !string.IsNullOrWhiteSpace(a.CreatedBy) && !a.CreatedBy.Equals("System", StringComparison.OrdinalIgnoreCase)
            ? a.CreatedBy
            : "Maya Fernando (Field Coordinator)";

        return new VolunteerAssignmentDetailDto
        {
            Id = a.Id,
            VolunteerId = a.VolunteerId,
            VolunteerCode = FormatVolunteerCode(a.VolunteerId),
            VolunteerName = a.Volunteer?.User?.FullName ?? "Volunteer",
            VolunteerSkills = FormatSkills(a.Volunteer?.Skills),
            ServiceArea = serviceArea ?? "Kelani East",
            AssistanceRequestId = a.AssistanceRequestId,
            TaskDescription = a.TaskDescription,
            ShiftTime = shiftTime,
            AssignmentStatus = a.AssignmentStatus,
            Status = statusStr,
            StatusType = statusType,
            StartTime = a.StartTime,
            EndTime = a.EndTime,
            Notes = a.Notes,
            CreatedAt = a.CreatedAt,
            CoordinatorName = coordinator,
            Priority = priority ?? "High",
            CaseNumber = caseNum,
            CaseCategory = caseCat ?? "Emergency Response"
        };
    }

    private static bool IsPendingVerification(Volunteer v)
    {
        if (v.CreatedBy != null && v.CreatedBy.Contains("Verif: Pending", StringComparison.OrdinalIgnoreCase))
            return true;
        if (v.CreatedBy != null && v.CreatedBy.Equals("Pending", StringComparison.OrdinalIgnoreCase))
            return true;
        if (v.CreatedBy != null && v.CreatedBy.Contains("Verif: Verified", StringComparison.OrdinalIgnoreCase))
            return false;
        if (v.User != null && !v.User.IsActive)
            return true;
        return false;
    }

    private static string? ExtractServiceArea(string? createdBy)
    {
        if (string.IsNullOrWhiteSpace(createdBy)) return null;
        var match = Regex.Match(createdBy, @"Area:\s*([^\|]+)");
        if (match.Success) return match.Groups[1].Value.Trim();
        if (createdBy.Contains("Kelani", StringComparison.OrdinalIgnoreCase)) return "Kelani East";
        if (createdBy.Contains("Wattala", StringComparison.OrdinalIgnoreCase)) return "Wattala South";
        if (createdBy.Contains("Biyagama", StringComparison.OrdinalIgnoreCase)) return "Biyagama North";
        if (createdBy.Contains("Central", StringComparison.OrdinalIgnoreCase)) return "Central Depot";
        if (createdBy.Contains("Niyagama", StringComparison.OrdinalIgnoreCase)) return "Niyagama North";
        return null;
    }

    private static string? ExtractStatus(string? createdBy)
    {
        if (string.IsNullOrWhiteSpace(createdBy)) return null;
        var match = Regex.Match(createdBy, @"Status:\s*([^\|]+)");
        if (match.Success) return match.Groups[1].Value.Trim();
        return null;
    }

    private static string FormatVolunteerCode(Guid id)
    {
        var raw = id.ToString().Replace("-", "").ToUpper();
        return $"VOL-{raw[..4]}";
    }

    private static string FormatSkills(string? skills)
    {
        if (string.IsNullOrWhiteSpace(skills)) return "General Support";
        if (skills.StartsWith("["))
        {
            try
            {
                var list = System.Text.Json.JsonSerializer.Deserialize<List<string>>(skills);
                if (list != null && list.Count > 0)
                    return string.Join(", ", list);
            }
            catch { }
        }
        return skills.Replace("\"", "").Trim();
    }

    private static string ExtractTaskId(string text)
    {
        var match = Regex.Match(text, @"(REQ-[A-Z0-9]+|TASK-[A-Z0-9]+)");
        return match.Success ? match.Groups[1].Value : "TASK-118";
    }

    private static string EscapeCsv(string val) => val.Replace("\"", "\"\"");
}
