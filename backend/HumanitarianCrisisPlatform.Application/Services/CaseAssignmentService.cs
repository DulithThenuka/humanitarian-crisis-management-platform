using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Incidents;
using HumanitarianCrisisPlatform.Application.Interfaces;
using HumanitarianCrisisPlatform.Application.Interfaces.Repositories;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Enums;
using HumanitarianCrisisPlatform.Domain.Exceptions;

namespace HumanitarianCrisisPlatform.Application.Services;

public class CaseAssignmentService : ICaseAssignmentService
{
    private readonly IIncidentRepository _incidentRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CaseAssignmentService(IIncidentRepository incidentRepository, IUnitOfWork unitOfWork)
    {
        _incidentRepository = incidentRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<IReadOnlyList<IncidentResponseDto>>> GetMyAssignedAsync(
        Guid userId,
        string? userName = null,
        CancellationToken cancellationToken = default)
    {
        var items = await _incidentRepository.GetAssignedToUserAsync(userId, userName, cancellationToken);
        return Result<IReadOnlyList<IncidentResponseDto>>.Success(
            items.Select(i => IncidentMapper.ToDto(i)).ToList());
    }

    public async Task<Result<IReadOnlyList<IncidentResponseDto>>> GetUnassignedAsync(
        CancellationToken cancellationToken = default)
    {
        var items = await _incidentRepository.GetUnassignedAsync(cancellationToken);
        return Result<IReadOnlyList<IncidentResponseDto>>.Success(
            items.Select(i => IncidentMapper.ToDto(i)).ToList());
    }

    public async Task<Result<IncidentResponseDto>> AssignAsync(
        string idOrCaseNumber,
        AssignIncidentDto dto,
        Guid actorUserId,
        string actorName,
        string actorRole,
        CancellationToken cancellationToken = default)
    {
        var incident = await _incidentRepository.GetByIdOrCaseNumberAsync(idOrCaseNumber, includeDetails: true, cancellationToken);
        if (incident == null)
            return Result<IncidentResponseDto>.Failure("Incident not found.");

        try
        {
            var assigneeName = !string.IsNullOrWhiteSpace(dto.AssigneeName)
                ? dto.AssigneeName.Trim()
                : (!string.IsNullOrWhiteSpace(actorName) ? actorName : "I. Senanayake");

            var previousStatus = incident.Status;
            incident.AssignedToUserId = dto.AssigneeUserId ?? (actorUserId != Guid.Empty ? actorUserId : null);
            incident.AssignedStaffName = assigneeName;
            if (!string.IsNullOrWhiteSpace(dto.OperationalArea))
                incident.OperationalArea = dto.OperationalArea.Trim();

            if (incident.Status == IncidentStatus.Open)
                incident.Status = IncidentStatus.Assigned;

            incident.UpdatedAt = DateTime.UtcNow;
            incident.LastModifiedBy = actorName;

            var assignment = new IncidentAssignment
            {
                IncidentId = incident.Id,
                AssigneeUserId = incident.AssignedToUserId,
                AssigneeName = assigneeName,
                AssignedByUserId = actorUserId != Guid.Empty ? actorUserId : null,
                AssignedByName = string.IsNullOrWhiteSpace(actorName) ? "Case Manager" : actorName,
                OperationalArea = incident.OperationalArea,
                Reason = string.IsNullOrWhiteSpace(dto.Reason) ? "Assigned to case manager." : dto.Reason.Trim(),
                AssignedAt = DateTime.UtcNow,
                IsActive = true
            };
            assignment.Validate();

            await _incidentRepository.UpdateAsync(incident, cancellationToken);
            await _incidentRepository.AddAssignmentAsync(assignment, cancellationToken);

            await _incidentRepository.AddStatusHistoryAsync(new IncidentStatusHistory
            {
                IncidentId = incident.Id,
                FromStatus = previousStatus,
                ToStatus = incident.Status,
                FromPriority = incident.Priority,
                ToPriority = incident.Priority,
                ChangedByUserId = actorUserId != Guid.Empty ? actorUserId : null,
                ChangedByName = string.IsNullOrWhiteSpace(actorName) ? "Case Manager" : actorName,
                ChangedByRole = string.IsNullOrWhiteSpace(actorRole) ? "CaseManager" : actorRole,
                Reason = $"Assigned to {assigneeName}: {assignment.Reason}"
            }, cancellationToken);

            await _incidentRepository.AddAuditLogAsync(new IncidentAuditLog
            {
                IncidentId = incident.Id,
                CaseNumber = incident.CaseNumber,
                Action = "IncidentAssigned",
                Detail = $"Assigned to {assigneeName}: {assignment.Reason}",
                ActorUserId = actorUserId != Guid.Empty ? actorUserId : null,
                ActorName = string.IsNullOrWhiteSpace(actorName) ? "Case Manager" : actorName,
                ActorRole = string.IsNullOrWhiteSpace(actorRole) ? "CaseManager" : actorRole,
                IsInternal = true
            }, cancellationToken);

            await _unitOfWork.CommitAsync(cancellationToken);
            return Result<IncidentResponseDto>.Success(IncidentMapper.ToDto(incident), $"Incident {incident.CaseNumber} assigned to {assigneeName}.");
        }
        catch (DomainException ex)
        {
            return Result<IncidentResponseDto>.Failure(ex.Message);
        }
    }

    public async Task<Result<IncidentResponseDto>> ReassignAsync(
        string idOrCaseNumber,
        ReassignIncidentDto dto,
        Guid actorUserId,
        string actorName,
        string actorRole,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.NewAssigneeName) && (!dto.NewAssigneeUserId.HasValue || dto.NewAssigneeUserId == Guid.Empty))
            return Result<IncidentResponseDto>.Failure("New assignee name or user ID is required for reassignment.");

        var incident = await _incidentRepository.GetByIdOrCaseNumberAsync(idOrCaseNumber, includeDetails: true, cancellationToken);
        if (incident == null)
            return Result<IncidentResponseDto>.Failure("Incident not found.");

        var previousAssignee = incident.AssignedStaffName ?? "Unassigned";
        var newAssigneeName = string.IsNullOrWhiteSpace(dto.NewAssigneeName) ? "Assigned Staff" : dto.NewAssigneeName.Trim();

        incident.AssignedToUserId = dto.NewAssigneeUserId;
        incident.AssignedStaffName = newAssigneeName;
        if (!string.IsNullOrWhiteSpace(dto.OperationalArea))
            incident.OperationalArea = dto.OperationalArea.Trim();

        if (incident.Status == IncidentStatus.Open)
            incident.Status = IncidentStatus.Assigned;

        incident.UpdatedAt = DateTime.UtcNow;
        incident.LastModifiedBy = actorName;

        var reason = string.IsNullOrWhiteSpace(dto.Reason)
            ? $"Reassigned from {previousAssignee} to {newAssigneeName}."
            : dto.Reason.Trim();

        var assignment = new IncidentAssignment
        {
            IncidentId = incident.Id,
            AssigneeUserId = dto.NewAssigneeUserId,
            AssigneeName = newAssigneeName,
            AssignedByUserId = actorUserId != Guid.Empty ? actorUserId : null,
            AssignedByName = string.IsNullOrWhiteSpace(actorName) ? "Case Manager" : actorName,
            OperationalArea = incident.OperationalArea,
            Reason = reason,
            AssignedAt = DateTime.UtcNow,
            IsActive = true
        };
        assignment.Validate();

        await _incidentRepository.UpdateAsync(incident, cancellationToken);
        await _incidentRepository.AddAssignmentAsync(assignment, cancellationToken);

        await _incidentRepository.AddStatusHistoryAsync(new IncidentStatusHistory
        {
            IncidentId = incident.Id,
            FromStatus = incident.Status,
            ToStatus = incident.Status,
            FromPriority = incident.Priority,
            ToPriority = incident.Priority,
            ChangedByUserId = actorUserId != Guid.Empty ? actorUserId : null,
            ChangedByName = string.IsNullOrWhiteSpace(actorName) ? "Case Manager" : actorName,
            ChangedByRole = string.IsNullOrWhiteSpace(actorRole) ? "CaseManager" : actorRole,
            Reason = $"Reassigned from {previousAssignee} to {newAssigneeName}: {reason}"
        }, cancellationToken);

        await _incidentRepository.AddAuditLogAsync(new IncidentAuditLog
        {
            IncidentId = incident.Id,
            CaseNumber = incident.CaseNumber,
            Action = "IncidentReassigned",
            Detail = $"Reassigned from {previousAssignee} to {newAssigneeName}: {reason}",
            ActorUserId = actorUserId != Guid.Empty ? actorUserId : null,
            ActorName = string.IsNullOrWhiteSpace(actorName) ? "Case Manager" : actorName,
            ActorRole = string.IsNullOrWhiteSpace(actorRole) ? "CaseManager" : actorRole,
            IsInternal = true
        }, cancellationToken);

        await _unitOfWork.CommitAsync(cancellationToken);
        return Result<IncidentResponseDto>.Success(IncidentMapper.ToDto(incident), $"Incident {incident.CaseNumber} reassigned to {newAssigneeName}.");
    }
}

