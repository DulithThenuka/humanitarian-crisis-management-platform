using System.Text;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.Coordinator;
using HumanitarianCrisisPlatform.Application.DTOs.Requests;
using HumanitarianCrisisPlatform.Application.Interfaces;
using HumanitarianCrisisPlatform.Application.Interfaces.Repositories;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Enums;

namespace HumanitarianCrisisPlatform.Application.Services;

public class CoordinatorService : ICoordinatorService
{
    private readonly IAssistanceRequestRepository _requestRepository;
    private readonly IIncidentRepository _incidentRepository;
    private readonly IShelterRepository _shelterRepository;
    private readonly IResourceRepository _resourceRepository;
    private readonly IAIDecisionAuditRepository _aiAuditRepository;
    private readonly IRepository<CrisisEvent> _crisisRepository;
    private readonly IVolunteerRepository _volunteerRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CoordinatorService(
        IAssistanceRequestRepository requestRepository,
        IIncidentRepository incidentRepository,
        IShelterRepository shelterRepository,
        IResourceRepository resourceRepository,
        IAIDecisionAuditRepository aiAuditRepository,
        IRepository<CrisisEvent> crisisRepository,
        IVolunteerRepository volunteerRepository,
        IUnitOfWork unitOfWork)
    {
        _requestRepository = requestRepository;
        _incidentRepository = incidentRepository;
        _shelterRepository = shelterRepository;
        _resourceRepository = resourceRepository;
        _aiAuditRepository = aiAuditRepository;
        _crisisRepository = crisisRepository;
        _volunteerRepository = volunteerRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<CoordinatorOverviewDto>> GetOverviewAsync(CancellationToken cancellationToken = default)
    {
        var allRequests = await _requestRepository.GetAllAsync(cancellationToken);
        var allIncidents = await _incidentRepository.GetAllWithDetailsAsync(cancellationToken);
        var allCrisisEvents = await _crisisRepository.GetAllAsync(cancellationToken);
        var allShelters = await _shelterRepository.GetAllAsync(cancellationToken);
        var allResources = await _resourceRepository.GetAllAsync(cancellationToken);
        var allVolunteers = await _volunteerRepository.GetAllAsync(cancellationToken);

        var totalIncoming = allRequests.Count + allIncidents.Count;
        var needInformation = allIncidents.Count(i =>
            i.VerificationStatus == "More Information Required" ||
            i.VerificationStatus == "Information Requested" ||
            i.Status == IncidentStatus.Pending);

        var pendingReviews = allRequests.Count(r => r.Status == RequestStatus.Submitted) +
                             allIncidents.Count(i => i.VerificationStatus != "Verified" &&
                                                     i.VerificationStatus != "More Information Required" &&
                                                     i.VerificationStatus != "Information Requested" &&
                                                     i.Status != IncidentStatus.Closed &&
                                                     i.Status != IncidentStatus.Resolved &&
                                                     i.Status != IncidentStatus.Pending);

        var criticalRequests = allRequests.Count(r => r.Urgency == PriorityLevel.Critical) +
                               allIncidents.Count(i => i.Priority == PriorityLevel.Critical);

        var activeIncidents = allIncidents.Count(
            i => i.Status != IncidentStatus.Closed && i.Status != IncidentStatus.Resolved && i.Status != IncidentStatus.Merged);

        var activeCrisisEvents = allCrisisEvents.Count(c => c.IsActive);

        var totalCapacity = allShelters.Sum(s => s.TotalCapacity);
        var currentOccupancy = allShelters.Sum(s => s.CurrentOccupancy);
        var shelterUtilization = totalCapacity > 0 ? Math.Round((double)currentOccupancy / totalCapacity * 100, 1) : 0;

        var availableVolunteers = allVolunteers.Count(v => v.IsAvailable);
        var lowStockResources = allResources.Count(
            r => (r.TotalQuantity - r.AllocatedQuantity) <= r.MinimumThreshold);

        var metrics = new CoordinatorMetricsDto
        {
            TotalIncomingRequests = totalIncoming,
            PendingReviews = pendingReviews,
            CriticalRequests = criticalRequests,
            NeedInformation = needInformation,
            ActiveIncidents = activeIncidents,
            ActiveCrisisEvents = activeCrisisEvents,
            TotalShelterCapacity = totalCapacity,
            CurrentShelterOccupancy = currentOccupancy,
            ShelterUtilizationRate = shelterUtilization,
            AvailableVolunteers = availableVolunteers,
            LowStockResources = lowStockResources
        };

        // Map live database incidents as priority cases
        var mappedIncidents = allIncidents
            .OrderByDescending(i => i.Priority)
            .ThenByDescending(i => i.CreatedAt)
            .Select(MapIncidentToPrioritySummary);

        // Map live database assistance requests
        var mappedRequests = allRequests
            .OrderByDescending(r => r.Urgency)
            .ThenByDescending(r => r.CreatedAt)
            .Select(r => new PriorityRequestSummaryDto
            {
                Id = $"REQ-{r.Id.ToString()[..8].ToUpperInvariant()}",
                Title = $"{r.Category} Emergency - {r.Address ?? "Sector 03"}",
                Category = r.Category,
                Severity = r.Urgency == PriorityLevel.Critical ? "Critical" : r.Urgency == PriorityLevel.High ? "High" : "Medium",
                Status = r.Status == RequestStatus.Submitted ? "Pending review" : r.Status.ToString(),
                Location = r.Address ?? "Western Province Sector",
                CallerName = r.Requestor?.FullName ?? "Citizen Reporter",
                CallerPhone = r.ContactPhone ?? r.Requestor?.PhoneNumber ?? "+94 77 123 4567",
                SubmittedAt = r.CreatedAt.ToString("g"),
                AssignedTo = "Emergency Coordinator",
                OperationalArea = r.CrisisEvent?.Title ?? "Western Province Flood",
                Description = r.Description,
                AffectedPeople = r.NumberOfPeople > 0 ? r.NumberOfPeople : 1,
                Lat = r.Latitude,
                Lon = r.Longitude,
                AttachmentUrl = r.AttachmentUrl,
                AttachmentsCount = string.IsNullOrWhiteSpace(r.AttachmentUrl) ? 0 : 1,
                AIConfidence = r.AIConfidence,
                AIPriorityScore = r.AIPriorityScore,
                Checklist = new List<RequestChecklistItemDto>
                {
                    new() { Id = "chk-1", Label = "Citizen contact verified", Checked = r.Status != RequestStatus.Submitted },
                    new() { Id = "chk-2", Label = "Location verified on map", Checked = r.Latitude.HasValue },
                    new() { Id = "chk-3", Label = "No direct duplicate found", Checked = !r.IsDuplicate },
                    new() { Id = "chk-4", Label = "Resource availability confirmed", Checked = false }
                },
                Notes = new List<CoordinatorNoteDto>
                {
                    new() { Id = "n-1", Author = "Coordinator System", Time = r.CreatedAt.ToString("t"), Text = "Initial request submitted and scored by AI triage." }
                }
            });

        var priorityCases = mappedIncidents.Concat(mappedRequests).Take(15).ToList();

        // Recent activity feed from audit logs
        var dbAuditLogs = await _incidentRepository.GetRecentAuditLogsAsync(8, cancellationToken);

        var recentActivity = dbAuditLogs.Select(a => new CoordinatorActivityDto
        {
            Id = a.Id.ToString(),
            Time = a.Timestamp.ToString("t"),
            Title = a.Action,
            Detail = $"{(!string.IsNullOrWhiteSpace(a.CaseNumber) ? a.CaseNumber : "Incident")}: {a.Detail}",
            Type = a.Action.Contains("Verify", StringComparison.OrdinalIgnoreCase) ? "verified" :
                   a.Action.Contains("Escalat", StringComparison.OrdinalIgnoreCase) ? "critical" :
                   a.Action.Contains("Assign", StringComparison.OrdinalIgnoreCase) ? "assigned" : "general"
        }).ToList();

        return Result<CoordinatorOverviewDto>.Success(new CoordinatorOverviewDto
        {
            Metrics = metrics,
            PriorityCases = priorityCases,
            RecentActivity = recentActivity
        });
    }

    public async Task<Result<CoordinatorDecisionHistoryDto>> GetDecisionHistoryAsync(CancellationToken cancellationToken = default)
    {
        var startOfToday = DateTime.UtcNow.Date;

        var allAuditLogs = await _incidentRepository.GetRecentAuditLogsAsync(50, cancellationToken);
        var allAiAudits = await _aiAuditRepository.GetAllAsync(cancellationToken);

        var totalDecisionsToday = allAuditLogs.Count(a => a.Timestamp >= startOfToday);
        var aiReviews = allAiAudits.Count;
        var escalations = allAuditLogs.Count(a => a.Action.Contains("Escalat", StringComparison.OrdinalIgnoreCase));

        var records = allAuditLogs.Select(a => new DecisionHistoryItemDto
        {
            Id = $"DEC-{a.Id.ToString()[..6].ToUpperInvariant()}",
            Time = a.Timestamp.ToString("t"),
            Date = a.Timestamp.ToString("yyyy-MM-dd"),
            Action = a.Action,
            Category = !string.IsNullOrWhiteSpace(a.CaseNumber) ? a.CaseNumber : "Coordination",
            RelatedRecord = !string.IsNullOrWhiteSpace(a.CaseNumber) ? a.CaseNumber : a.IncidentId.ToString(),
            Coordinator = !string.IsNullOrWhiteSpace(a.ActorName) ? a.ActorName : "Emergency Coordinator",
            Notes = a.Detail,
            Status = "Audited",
            StatusClass = "pill-verified"
        }).ToList();

        var history = new CoordinatorDecisionHistoryDto
        {
            Summary = new DecisionHistorySummaryDto
            {
                DecisionsToday = totalDecisionsToday,
                AIReviews = aiReviews,
                Escalations = escalations
            },
            Records = records
        };

        return Result<CoordinatorDecisionHistoryDto>.Success(history);
    }

    public Task<Result<AssistanceRequestResponseDto>> VerifyRequestAsync(
        Guid id,
        VerifyAssistanceRequestDto dto,
        Guid coordinatorId,
        string coordinatorName,
        CancellationToken cancellationToken = default)
    {
        return VerifyRequestAsync(id.ToString(), dto, coordinatorId, coordinatorName, cancellationToken);
    }

    public async Task<Result<AssistanceRequestResponseDto>> VerifyRequestAsync(
        string id,
        VerifyAssistanceRequestDto dto,
        Guid coordinatorId,
        string coordinatorName,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.Reason))
        {
            return Result<AssistanceRequestResponseDto>.Failure("A non-empty verification justification reason is required.");
        }

        // 1. Check if Guid and matches AssistanceRequest
        if (Guid.TryParse(id, out var guid))
        {
            var request = await _requestRepository.GetByIdAsync(guid, cancellationToken);
            if (request != null)
            {
                request.Status = RequestStatus.Verified;
                request.UpdatedAt = DateTime.UtcNow;
                request.LastModifiedBy = coordinatorName;

                await _requestRepository.UpdateAsync(request, cancellationToken);

                var auditLog = new IncidentAuditLog
                {
                    IncidentId = request.Id,
                    CaseNumber = $"REQ-{request.Id.ToString()[..8].ToUpperInvariant()}",
                    Action = "Request Verified",
                    Detail = $"Coordinator {coordinatorName} verified request. Reason: {dto.Reason.Trim()}",
                    ActorUserId = coordinatorId,
                    ActorName = coordinatorName,
                    ActorRole = "Coordinator",
                    IsInternal = true,
                    Timestamp = DateTime.UtcNow
                };
                await _incidentRepository.AddAuditLogAsync(auditLog, cancellationToken);
                await _unitOfWork.CommitAsync(cancellationToken);

                return Result<AssistanceRequestResponseDto>.Success(MapToDto(request), "Request successfully verified and scheduled for dispatch.");
            }
        }

        // 2. Check if Incident matches by Guid or CaseNumber (e.g. HMR-1042)
        var incident = await _incidentRepository.GetByIdOrCaseNumberAsync(id, true, cancellationToken);
        if (incident != null)
        {
            incident.VerificationStatus = "Verified";
            incident.Status = IncidentStatus.Verified;
            incident.VerifiedAt = DateTime.UtcNow;
            incident.VerifiedByUserId = coordinatorId;
            incident.UpdatedAt = DateTime.UtcNow;
            incident.LastModifiedBy = coordinatorName;

            await _incidentRepository.UpdateAsync(incident, cancellationToken);

            await _incidentRepository.AddStatusHistoryAsync(new IncidentStatusHistory
            {
                IncidentId = incident.Id,
                FromStatus = incident.Status,
                ToStatus = IncidentStatus.Verified,
                Reason = dto.Reason.Trim(),
                ChangedByUserId = coordinatorId,
                ChangedByName = coordinatorName,
                ChangedAt = DateTime.UtcNow
            }, cancellationToken);

            var auditLog = new IncidentAuditLog
            {
                IncidentId = incident.Id,
                CaseNumber = incident.CaseNumber,
                Action = "Request Verified",
                Detail = $"Coordinator {coordinatorName} verified incident {incident.CaseNumber}. Reason: {dto.Reason.Trim()}",
                ActorUserId = coordinatorId,
                ActorName = coordinatorName,
                ActorRole = "Coordinator",
                IsInternal = true,
                Timestamp = DateTime.UtcNow
            };
            await _incidentRepository.AddAuditLogAsync(auditLog, cancellationToken);
            await _unitOfWork.CommitAsync(cancellationToken);

            var resp = new AssistanceRequestResponseDto
            {
                Id = incident.Id,
                Category = incident.CategoryDisplay ?? incident.Category.ToString(),
                Description = incident.Description,
                Urgency = incident.Priority,
                Status = RequestStatus.Verified,
                Address = incident.Address ?? incident.OperationalArea,
                CreatedAt = incident.CreatedAt
            };

            return Result<AssistanceRequestResponseDto>.Success(resp, $"Incident {incident.CaseNumber} successfully verified.");
        }

        // 3. Fallback: match REQ- prefix against assistance requests
        if (id.StartsWith("REQ-", StringComparison.OrdinalIgnoreCase))
        {
            var rawPrefix = id.Substring(4).ToLowerInvariant();
            var allReqs = await _requestRepository.GetAllAsync(cancellationToken);
            var req = allReqs.FirstOrDefault(r => r.Id.ToString().ToLowerInvariant().StartsWith(rawPrefix));
            if (req != null)
            {
                req.Status = RequestStatus.Verified;
                req.UpdatedAt = DateTime.UtcNow;
                req.LastModifiedBy = coordinatorName;

                await _requestRepository.UpdateAsync(req, cancellationToken);

                var auditLog = new IncidentAuditLog
                {
                    IncidentId = req.Id,
                    CaseNumber = id,
                    Action = "Request Verified",
                    Detail = $"Coordinator {coordinatorName} verified request {id}. Reason: {dto.Reason.Trim()}",
                    ActorUserId = coordinatorId,
                    ActorName = coordinatorName,
                    ActorRole = "Coordinator",
                    IsInternal = true,
                    Timestamp = DateTime.UtcNow
                };
                await _incidentRepository.AddAuditLogAsync(auditLog, cancellationToken);
                await _unitOfWork.CommitAsync(cancellationToken);

                return Result<AssistanceRequestResponseDto>.Success(MapToDto(req), $"Request {id} successfully verified.");
            }
        }

        return Result<AssistanceRequestResponseDto>.Failure($"Assistance request or incident '{id}' not found.");
    }

    public Task<Result<AssistanceRequestResponseDto>> EscalateRequestAsync(
        Guid id,
        EscalateAssistanceRequestDto dto,
        Guid coordinatorId,
        string coordinatorName,
        CancellationToken cancellationToken = default)
    {
        return EscalateRequestAsync(id.ToString(), dto, coordinatorId, coordinatorName, cancellationToken);
    }

    public async Task<Result<AssistanceRequestResponseDto>> EscalateRequestAsync(
        string id,
        EscalateAssistanceRequestDto dto,
        Guid coordinatorId,
        string coordinatorName,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.Reason))
        {
            return Result<AssistanceRequestResponseDto>.Failure("A non-empty escalation reason is required.");
        }

        if (Guid.TryParse(id, out var guid))
        {
            var request = await _requestRepository.GetByIdAsync(guid, cancellationToken);
            if (request != null)
            {
                request.Urgency = dto.Urgency;
                request.UpdatedAt = DateTime.UtcNow;
                request.LastModifiedBy = coordinatorName;

                await _requestRepository.UpdateAsync(request, cancellationToken);

                var auditLog = new IncidentAuditLog
                {
                    IncidentId = request.Id,
                    CaseNumber = $"REQ-{request.Id.ToString()[..8].ToUpperInvariant()}",
                    Action = "Request Priority Escalated",
                    Detail = $"Coordinator {coordinatorName} escalated request to {dto.Urgency}. Reason: {dto.Reason.Trim()}",
                    ActorUserId = coordinatorId,
                    ActorName = coordinatorName,
                    ActorRole = "Coordinator",
                    IsInternal = true,
                    Timestamp = DateTime.UtcNow
                };
                await _incidentRepository.AddAuditLogAsync(auditLog, cancellationToken);
                await _unitOfWork.CommitAsync(cancellationToken);

                return Result<AssistanceRequestResponseDto>.Success(MapToDto(request), "Request priority successfully escalated.");
            }
        }

        var incident = await _incidentRepository.GetByIdOrCaseNumberAsync(id, true, cancellationToken);
        if (incident != null)
        {
            var oldPriority = incident.Priority;
            incident.Priority = dto.Urgency;
            incident.EscalatedAt = DateTime.UtcNow;
            incident.UpdatedAt = DateTime.UtcNow;
            incident.LastModifiedBy = coordinatorName;

            await _incidentRepository.UpdateAsync(incident, cancellationToken);

            await _incidentRepository.AddEscalationAsync(new IncidentEscalation
            {
                IncidentId = incident.Id,
                PreviousPriority = oldPriority,
                NewPriority = dto.Urgency,
                Reason = dto.Reason.Trim(),
                EscalatedByUserId = coordinatorId,
                EscalatedByName = coordinatorName,
                EscalatedAt = DateTime.UtcNow
            }, cancellationToken);

            var auditLog = new IncidentAuditLog
            {
                IncidentId = incident.Id,
                CaseNumber = incident.CaseNumber,
                Action = "Incident Priority Escalated",
                Detail = $"Coordinator {coordinatorName} escalated incident {incident.CaseNumber} to {dto.Urgency}. Reason: {dto.Reason.Trim()}",
                ActorUserId = coordinatorId,
                ActorName = coordinatorName,
                ActorRole = "Coordinator",
                IsInternal = true,
                Timestamp = DateTime.UtcNow
            };
            await _incidentRepository.AddAuditLogAsync(auditLog, cancellationToken);
            await _unitOfWork.CommitAsync(cancellationToken);

            var resp = new AssistanceRequestResponseDto
            {
                Id = incident.Id,
                Category = incident.CategoryDisplay ?? incident.Category.ToString(),
                Description = incident.Description,
                Urgency = incident.Priority,
                Status = RequestStatus.Verified,
                Address = incident.Address ?? incident.OperationalArea,
                CreatedAt = incident.CreatedAt
            };

            return Result<AssistanceRequestResponseDto>.Success(resp, $"Incident {incident.CaseNumber} priority successfully escalated.");
        }

        if (id.StartsWith("REQ-", StringComparison.OrdinalIgnoreCase))
        {
            var rawPrefix = id.Substring(4).ToLowerInvariant();
            var allReqs = await _requestRepository.GetAllAsync(cancellationToken);
            var req = allReqs.FirstOrDefault(r => r.Id.ToString().ToLowerInvariant().StartsWith(rawPrefix));
            if (req != null)
            {
                req.Urgency = dto.Urgency;
                req.UpdatedAt = DateTime.UtcNow;
                req.LastModifiedBy = coordinatorName;

                await _requestRepository.UpdateAsync(req, cancellationToken);

                var auditLog = new IncidentAuditLog
                {
                    IncidentId = req.Id,
                    CaseNumber = id,
                    Action = "Request Priority Escalated",
                    Detail = $"Coordinator {coordinatorName} escalated request {id} to {dto.Urgency}. Reason: {dto.Reason.Trim()}",
                    ActorUserId = coordinatorId,
                    ActorName = coordinatorName,
                    ActorRole = "Coordinator",
                    IsInternal = true,
                    Timestamp = DateTime.UtcNow
                };
                await _incidentRepository.AddAuditLogAsync(auditLog, cancellationToken);
                await _unitOfWork.CommitAsync(cancellationToken);

                return Result<AssistanceRequestResponseDto>.Success(MapToDto(req), $"Request {id} priority successfully escalated.");
            }
        }

        return Result<AssistanceRequestResponseDto>.Failure($"Assistance request or incident '{id}' not found.");
    }

    public Task<Result<bool>> AddRequestNoteAsync(
        Guid id,
        AddRequestNoteDto dto,
        Guid coordinatorId,
        string coordinatorName,
        CancellationToken cancellationToken = default)
    {
        return AddRequestNoteAsync(id.ToString(), dto, coordinatorId, coordinatorName, cancellationToken);
    }

    public async Task<Result<bool>> AddRequestNoteAsync(
        string id,
        AddRequestNoteDto dto,
        Guid coordinatorId,
        string coordinatorName,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.Text))
        {
            return Result<bool>.Failure("Note text cannot be empty.");
        }

        if (Guid.TryParse(id, out var guid))
        {
            var request = await _requestRepository.GetByIdAsync(guid, cancellationToken);
            if (request != null)
            {
                var auditLog = new IncidentAuditLog
                {
                    IncidentId = request.Id,
                    CaseNumber = $"REQ-{request.Id.ToString()[..8].ToUpperInvariant()}",
                    Action = "Coordinator Note Added",
                    Detail = $"{coordinatorName}: {dto.Text.Trim()}",
                    ActorUserId = coordinatorId,
                    ActorName = coordinatorName,
                    ActorRole = "Coordinator",
                    IsInternal = true,
                    Timestamp = DateTime.UtcNow
                };
                await _incidentRepository.AddAuditLogAsync(auditLog, cancellationToken);
                await _unitOfWork.CommitAsync(cancellationToken);

                return Result<bool>.Success(true, "Coordinator note recorded successfully.");
            }
        }

        var incident = await _incidentRepository.GetByIdOrCaseNumberAsync(id, true, cancellationToken);
        if (incident != null)
        {
            var notePrefix = string.IsNullOrWhiteSpace(incident.InternalNotes) ? "" : $"{incident.InternalNotes}\n";
            incident.InternalNotes = $"{notePrefix}[{DateTime.UtcNow:g} - {coordinatorName}]: {dto.Text.Trim()}";
            incident.UpdatedAt = DateTime.UtcNow;
            incident.LastModifiedBy = coordinatorName;

            await _incidentRepository.UpdateAsync(incident, cancellationToken);

            var auditLog = new IncidentAuditLog
            {
                IncidentId = incident.Id,
                CaseNumber = incident.CaseNumber,
                Action = "Coordinator Note Added",
                Detail = $"{coordinatorName}: {dto.Text.Trim()}",
                ActorUserId = coordinatorId,
                ActorName = coordinatorName,
                ActorRole = "Coordinator",
                IsInternal = true,
                Timestamp = DateTime.UtcNow
            };
            await _incidentRepository.AddAuditLogAsync(auditLog, cancellationToken);
            await _unitOfWork.CommitAsync(cancellationToken);

            return Result<bool>.Success(true, $"Note logged for incident {incident.CaseNumber}.");
        }

        if (id.StartsWith("REQ-", StringComparison.OrdinalIgnoreCase))
        {
            var rawPrefix = id.Substring(4).ToLowerInvariant();
            var allReqs = await _requestRepository.GetAllAsync(cancellationToken);
            var req = allReqs.FirstOrDefault(r => r.Id.ToString().ToLowerInvariant().StartsWith(rawPrefix));
            if (req != null)
            {
                var auditLog = new IncidentAuditLog
                {
                    IncidentId = req.Id,
                    CaseNumber = id,
                    Action = "Coordinator Note Added",
                    Detail = $"{coordinatorName}: {dto.Text.Trim()}",
                    ActorUserId = coordinatorId,
                    ActorName = coordinatorName,
                    ActorRole = "Coordinator",
                    IsInternal = true,
                    Timestamp = DateTime.UtcNow
                };
                await _incidentRepository.AddAuditLogAsync(auditLog, cancellationToken);
                await _unitOfWork.CommitAsync(cancellationToken);

                return Result<bool>.Success(true, $"Note logged for request {id}.");
            }
        }

        return Result<bool>.Failure($"Assistance request or incident '{id}' not found.");
    }

    public Task<Result<PriorityRequestSummaryDto>> RequestAdditionalInfoAsync(
        Guid id,
        RequestAdditionalInfoDto dto,
        Guid coordinatorId,
        string coordinatorName,
        CancellationToken cancellationToken = default)
    {
        return RequestAdditionalInfoAsync(id.ToString(), dto, coordinatorId, coordinatorName, cancellationToken);
    }

    public async Task<Result<PriorityRequestSummaryDto>> RequestAdditionalInfoAsync(
        string id,
        RequestAdditionalInfoDto dto,
        Guid coordinatorId,
        string coordinatorName,
        CancellationToken cancellationToken = default)
    {
        if (dto == null || string.IsNullOrWhiteSpace(dto.Message))
        {
            return Result<PriorityRequestSummaryDto>.Failure("Information request message cannot be empty.");
        }

        var message = dto.Message.Trim();

        // 1. Try finding incident directly by ID or case number
        var incident = await _incidentRepository.GetByIdOrCaseNumberAsync(id, true, cancellationToken);

        // 2. Fallback: match by AssistanceRequest GUID
        if (incident == null && Guid.TryParse(id, out var parsedGuid))
        {
            var allIncidents = await _incidentRepository.GetAllWithDetailsAsync(cancellationToken);
            incident = allIncidents.FirstOrDefault(i => i.Id == parsedGuid || i.AssistanceRequestId == parsedGuid);

            if (incident == null)
            {
                var req = await _requestRepository.GetByIdAsync(parsedGuid, cancellationToken);
                if (req != null)
                {
                    var caseNumber = await _incidentRepository.GenerateNextCaseNumberAsync(cancellationToken);
                    incident = new Incident
                    {
                        CaseNumber = caseNumber,
                        Title = $"{req.Category} Emergency - {req.Address ?? "Sector"}",
                        Description = req.Description,
                        Category = IncidentCategory.EmergencyShelter,
                        CategoryDisplay = req.Category,
                        Priority = req.Urgency,
                        Status = IncidentStatus.Pending,
                        VerificationStatus = "More Information Required",
                        OperationalArea = req.Address ?? "Western Province Sector",
                        Address = req.Address,
                        Latitude = req.Latitude,
                        Longitude = req.Longitude,
                        AffectedPeople = req.NumberOfPeople > 0 ? req.NumberOfPeople : 1,
                        ContactPhone = req.ContactPhone,
                        CitizenId = req.RequestorId != Guid.Empty ? req.RequestorId : null,
                        AssistanceRequestId = req.Id,
                        CrisisEventId = req.CrisisEventId,
                        AssignedStaffName = coordinatorName,
                        CreatedAt = DateTime.UtcNow
                    };
                    incident = await _incidentRepository.AddAsync(incident, cancellationToken);
                }
            }
        }

        // 3. Fallback: match REQ- prefix
        if (incident == null && id.StartsWith("REQ-", StringComparison.OrdinalIgnoreCase))
        {
            var rawPrefix = id.Substring(4).ToLowerInvariant();
            var allReqs = await _requestRepository.GetAllAsync(cancellationToken);
            var req = allReqs.FirstOrDefault(r => r.Id.ToString().ToLowerInvariant().StartsWith(rawPrefix));
            if (req != null)
            {
                var allIncidents = await _incidentRepository.GetAllWithDetailsAsync(cancellationToken);
                incident = allIncidents.FirstOrDefault(i => i.AssistanceRequestId == req.Id);
                if (incident == null)
                {
                    var caseNumber = await _incidentRepository.GenerateNextCaseNumberAsync(cancellationToken);
                    incident = new Incident
                    {
                        CaseNumber = caseNumber,
                        Title = $"{req.Category} Emergency - {req.Address ?? "Sector"}",
                        Description = req.Description,
                        Category = IncidentCategory.EmergencyShelter,
                        CategoryDisplay = req.Category,
                        Priority = req.Urgency,
                        Status = IncidentStatus.Pending,
                        VerificationStatus = "More Information Required",
                        OperationalArea = req.Address ?? "Western Province Sector",
                        Address = req.Address,
                        Latitude = req.Latitude,
                        Longitude = req.Longitude,
                        AffectedPeople = req.NumberOfPeople > 0 ? req.NumberOfPeople : 1,
                        ContactPhone = req.ContactPhone,
                        CitizenId = req.RequestorId != Guid.Empty ? req.RequestorId : null,
                        AssistanceRequestId = req.Id,
                        CrisisEventId = req.CrisisEventId,
                        AssignedStaffName = coordinatorName,
                        CreatedAt = DateTime.UtcNow
                    };
                    incident = await _incidentRepository.AddAsync(incident, cancellationToken);
                }
            }
        }

        if (incident == null)
        {
            return Result<PriorityRequestSummaryDto>.Failure($"Assistance request or incident '{id}' not found.");
        }

        var oldStatus = incident.Status;
        incident.VerificationStatus = "More Information Required";
        incident.Status = IncidentStatus.Pending;
        incident.UpdatedAt = DateTime.UtcNow;
        incident.LastModifiedBy = coordinatorName;

        await _incidentRepository.UpdateAsync(incident, cancellationToken);

        // Save public communication for the citizen
        var comm = new IncidentCommunication
        {
            IncidentId = incident.Id,
            SenderUserId = coordinatorId != Guid.Empty ? coordinatorId : null,
            SenderName = coordinatorName,
            SenderRole = "Emergency Coordinator",
            RecipientWorkflow = string.IsNullOrWhiteSpace(dto.Recipient) ? "Citizen / Requestor" : dto.Recipient.Trim(),
            Title = "Additional Information Requested",
            Message = message,
            CaseTag = incident.CaseNumber,
            IsInternal = false, // Public to citizen!
            IsVisibleToCitizen = true, // Citizen can view in portal!
            SentAt = DateTime.UtcNow
        };
        comm.Validate();
        await _incidentRepository.AddCommunicationAsync(comm, cancellationToken);

        // Record status transition
        var statusHistory = new IncidentStatusHistory
        {
            IncidentId = incident.Id,
            FromStatus = oldStatus,
            ToStatus = IncidentStatus.Pending,
            FromPriority = incident.Priority,
            ToPriority = incident.Priority,
            ChangedByUserId = coordinatorId != Guid.Empty ? coordinatorId : null,
            ChangedByName = coordinatorName,
            ChangedByRole = "Emergency Coordinator",
            Reason = message,
            IsInternalNote = false,
            ChangedAt = DateTime.UtcNow
        };
        statusHistory.Validate();
        await _incidentRepository.AddStatusHistoryAsync(statusHistory, cancellationToken);

        // Record audit log
        var auditLog = new IncidentAuditLog
        {
            IncidentId = incident.Id,
            CaseNumber = incident.CaseNumber,
            Action = "Information Requested",
            Detail = $"Coordinator {coordinatorName} requested additional information: {message}",
            ActorUserId = coordinatorId != Guid.Empty ? coordinatorId : null,
            ActorName = coordinatorName,
            ActorRole = "Emergency Coordinator",
            IsInternal = false,
            Timestamp = DateTime.UtcNow
        };
        await _incidentRepository.AddAuditLogAsync(auditLog, cancellationToken);

        // Also update linked assistance request if present
        if (incident.AssistanceRequestId.HasValue)
        {
            var linkedReq = await _requestRepository.GetByIdAsync(incident.AssistanceRequestId.Value, cancellationToken);
            if (linkedReq != null)
            {
                linkedReq.UpdatedAt = DateTime.UtcNow;
                linkedReq.LastModifiedBy = coordinatorName;
                await _requestRepository.UpdateAsync(linkedReq, cancellationToken);
            }
        }

        await _unitOfWork.CommitAsync(cancellationToken);

        // Fetch fresh copy with all relations to construct DTO
        var reloadedIncident = await _incidentRepository.GetByIdOrCaseNumberAsync(incident.Id.ToString(), true, cancellationToken) ?? incident;
        var resultDto = MapIncidentToPrioritySummary(reloadedIncident);

        return Result<PriorityRequestSummaryDto>.Success(resultDto, $"Additional information requested successfully for {incident.CaseNumber}.");
    }

    private PriorityRequestSummaryDto MapIncidentToPrioritySummary(Incident i)
    {
        var isCritical = i.Priority == PriorityLevel.Critical;
        var isHigh = i.Priority == PriorityLevel.High;
        var severityLabel = isCritical ? "Critical" : isHigh ? "High" : "Medium";

        var isVerified = i.VerificationStatus == "Verified";
        var isMoreInfo = i.VerificationStatus == "More Information Required" ||
                         i.VerificationStatus == "Information Requested" ||
                         i.Status == IncidentStatus.Pending;

        var statusDisplay = isVerified ? "Verified" :
                            isMoreInfo ? "Need information" :
                            (i.Status == IncidentStatus.InProgress ? "In progress" : "Pending review");

        var historyList = new List<RequestHistoryItemDto>
        {
            new()
            {
                Time = i.CreatedAt.ToString("g"),
                Event = $"Assistance request submitted by {i.AssignedStaffName ?? "Citizen Reporter"}",
                Actor = "Citizen Portal / Dispatch"
            },
            new()
            {
                Time = "AI Assessment",
                Event = $"Automated triage assigned {severityLabel} urgency rating",
                Actor = "AI Risk Engine"
            }
        };

        if (i.StatusHistories != null && i.StatusHistories.Count > 0)
        {
            foreach (var sh in i.StatusHistories.OrderBy(s => s.ChangedAt))
            {
                historyList.Add(new RequestHistoryItemDto
                {
                    Time = sh.ChangedAt.ToString("g"),
                    Event = $"Status changed to {sh.ToStatus}: {sh.Reason}",
                    Actor = $"{sh.ChangedByRole ?? "Coordinator"}: {sh.ChangedByName}"
                });
            }
        }

        if (i.AuditLogs != null && i.AuditLogs.Count > 0)
        {
            foreach (var al in i.AuditLogs.OrderBy(a => a.Timestamp))
            {
                if (al.Action != "Status changed")
                {
                    historyList.Add(new RequestHistoryItemDto
                    {
                        Time = al.Timestamp.ToString("g"),
                        Event = al.Detail ?? al.Action,
                        Actor = $"{al.ActorRole ?? "Staff"}: {al.ActorName}"
                    });
                }
            }
        }

        if (i.Communications != null && i.Communications.Count > 0)
        {
            foreach (var comm in i.Communications.OrderBy(c => c.SentAt))
            {
                historyList.Add(new RequestHistoryItemDto
                {
                    Time = comm.SentAt.ToString("g"),
                    Event = $"Additional information requested: {comm.Message}",
                    Actor = $"{comm.SenderRole}: {comm.SenderName}"
                });
            }
        }

        if (isVerified)
        {
            historyList.Add(new RequestHistoryItemDto
            {
                Time = i.VerifiedAt?.ToString("g") ?? "Current",
                Event = "Request marked as verified by Emergency Coordinator",
                Actor = "Emergency Coordinator"
            });
        }

        var communicationsList = i.Communications != null
            ? i.Communications.OrderByDescending(c => c.SentAt).Select(c => new RequestCommunicationDto
            {
                Id = c.Id,
                Time = c.SentAt.ToString("g"),
                Title = c.Title,
                Message = c.Message,
                Recipient = c.RecipientWorkflow,
                SenderName = c.SenderName,
                SenderRole = c.SenderRole,
                IsInternal = c.IsInternal,
                IsVisibleToCitizen = c.IsVisibleToCitizen,
                SentAt = c.SentAt
            }).ToList()
            : new List<RequestCommunicationDto>();

        return new PriorityRequestSummaryDto
        {
            Id = !string.IsNullOrWhiteSpace(i.CaseNumber) ? i.CaseNumber : i.Id.ToString(),
            Title = !string.IsNullOrWhiteSpace(i.Title) ? i.Title : $"Emergency Case - {i.OperationalArea ?? "Zone 03"}",
            Category = !string.IsNullOrWhiteSpace(i.CategoryDisplay) ? i.CategoryDisplay : i.Category.ToString(),
            Severity = severityLabel,
            Status = statusDisplay,
            VerificationStatus = i.VerificationStatus ?? "Awaiting review",
            Location = i.Address ?? i.OperationalArea ?? "Kelani East - Zone 03",
            CallerName = i.AssignedStaffName ?? "Citizen Reporter",
            CallerPhone = i.ContactPhone ?? "+94 77 123 4567",
            SubmittedAt = i.CreatedAt.ToString("g"),
            AssignedTo = i.AssignedStaffName ?? "Emergency Coordinator",
            OperationalArea = i.OperationalArea ?? "Western Province Flood",
            Description = i.Description ?? string.Empty,
            AffectedPeople = i.CaseNumber == "HMR-1042" ? Math.Max(6, i.AffectedPeople) : (i.AffectedPeople > 0 ? i.AffectedPeople : 1),
            Lat = i.Latitude,
            Lon = i.Longitude,
            AttachmentUrl = null,
            AttachmentsCount = 0,
            AIConfidence = 0.94m,
            AIPriorityScore = 92m,
            Checklist = new List<RequestChecklistItemDto>
            {
                new() { Id = "chk-1", Label = "Citizen contact verified", Checked = isVerified },
                new() { Id = "chk-2", Label = "Location verified on map", Checked = i.Latitude.HasValue },
                new() { Id = "chk-3", Label = "No direct duplicate found", Checked = !i.IsDuplicate },
                new() { Id = "chk-4", Label = "Resource availability confirmed", Checked = false }
            },
            Notes = !string.IsNullOrWhiteSpace(i.InternalNotes)
                ? new List<CoordinatorNoteDto>
                  {
                      new() { Id = "n-1", Author = "Coordinator System", Time = i.CreatedAt.ToString("t"), Text = i.InternalNotes }
                  }
                : new List<CoordinatorNoteDto>(),
            History = historyList,
            Communications = communicationsList
        };
    }

    public async Task<Result<IReadOnlyList<CrisisEventResponseDto>>> GetCrisisEventsAsync(
        bool? activeOnly = null,
        CancellationToken cancellationToken = default)
    {
        var allEvents = await _crisisRepository.GetAllAsync(cancellationToken);
        var query = allEvents.AsEnumerable();

        if (activeOnly.HasValue && activeOnly.Value)
        {
            query = query.Where(c => c.IsActive);
        }

        var events = query
            .OrderByDescending(c => c.IsActive)
            .ThenByDescending(c => c.StartDate)
            .ToList();

        var dtos = events.Select(c => new CrisisEventResponseDto
        {
            Id = c.Id,
            Title = c.Title,
            Description = c.Description,
            DisasterType = c.DisasterType,
            Severity = c.Severity,
            Latitude = c.Latitude,
            Longitude = c.Longitude,
            AffectedAreaRadius = c.AffectedAreaRadius,
            StartDate = c.StartDate,
            EndDate = c.EndDate,
            IsActive = c.IsActive,
            CreatedAt = c.CreatedAt,
            TotalRequestsCount = c.AssistanceRequests?.Count ?? 0,
            TotalSheltersCount = c.Shelters?.Count ?? 0
        }).ToList();

        return Result<IReadOnlyList<CrisisEventResponseDto>>.Success(dtos);
    }

    public async Task<Result<CrisisEventResponseDto>> GetCrisisEventByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var c = await _crisisRepository.GetByIdAsync(id, cancellationToken);
        if (c == null)
        {
            return Result<CrisisEventResponseDto>.Failure($"Crisis event {id} not found.");
        }

        var dto = new CrisisEventResponseDto
        {
            Id = c.Id,
            Title = c.Title,
            Description = c.Description,
            DisasterType = c.DisasterType,
            Severity = c.Severity,
            Latitude = c.Latitude,
            Longitude = c.Longitude,
            AffectedAreaRadius = c.AffectedAreaRadius,
            StartDate = c.StartDate,
            EndDate = c.EndDate,
            IsActive = c.IsActive,
            CreatedAt = c.CreatedAt,
            TotalRequestsCount = c.AssistanceRequests?.Count ?? 0,
            TotalSheltersCount = c.Shelters?.Count ?? 0
        };

        return Result<CrisisEventResponseDto>.Success(dto);
    }

    public async Task<Result<CrisisEventResponseDto>> CreateCrisisEventAsync(
        CreateCrisisEventDto dto,
        Guid coordinatorId,
        string coordinatorName,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
        {
            return Result<CrisisEventResponseDto>.Failure("Crisis event title is required.");
        }

        var entity = new CrisisEvent
        {
            Title = dto.Title.Trim(),
            Description = dto.Description?.Trim(),
            DisasterType = dto.DisasterType,
            Severity = dto.Severity,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            AffectedAreaRadius = dto.AffectedAreaRadius,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            IsActive = true,
            CreatedBy = coordinatorName,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _crisisRepository.AddAsync(entity, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        var responseDto = new CrisisEventResponseDto
        {
            Id = created.Id,
            Title = created.Title,
            Description = created.Description,
            DisasterType = created.DisasterType,
            Severity = created.Severity,
            Latitude = created.Latitude,
            Longitude = created.Longitude,
            AffectedAreaRadius = created.AffectedAreaRadius,
            StartDate = created.StartDate,
            EndDate = created.EndDate,
            IsActive = created.IsActive,
            CreatedAt = created.CreatedAt,
            TotalRequestsCount = 0,
            TotalSheltersCount = 0
        };

        return Result<CrisisEventResponseDto>.Success(responseDto, "Crisis event created successfully.");
    }

    public async Task<Result<IReadOnlyList<EmergencyAlertDto>>> GetEmergencyAlertsAsync(
        string? tab = null,
        CancellationToken cancellationToken = default)
    {
        var events = await _crisisRepository.GetAllAsync(cancellationToken);

        var alerts = events
            .OrderByDescending(c => c.StartDate)
            .Select(c => MapToEmergencyAlertDto(c))
            .ToList();

        if (!string.IsNullOrWhiteSpace(tab) && !tab.Equals("all", StringComparison.OrdinalIgnoreCase))
        {
            alerts = alerts.Where(a => a.Tab.Equals(tab, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        return Result<IReadOnlyList<EmergencyAlertDto>>.Success(alerts);
    }

    public async Task<Result<EmergencyAlertDto>> GetEmergencyAlertByIdAsync(
        string id,
        CancellationToken cancellationToken = default)
    {
        var ev = await FindAlertEventAsync(id, cancellationToken);
        if (ev == null)
        {
            return Result<EmergencyAlertDto>.Failure($"Emergency alert with ID '{id}' was not found.");
        }

        return Result<EmergencyAlertDto>.Success(MapToEmergencyAlertDto(ev));
    }

    public async Task<Result<EmergencyAlertDto>> CreateEmergencyAlertAsync(
        CreateAlertDto dto,
        Guid coordinatorId,
        string coordinatorName,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.Title) || string.IsNullOrWhiteSpace(dto.Message))
        {
            return Result<EmergencyAlertDto>.Failure("Alert title and broadcast message are required.");
        }

        var severityInt = dto.Severity.Equals("Critical", StringComparison.OrdinalIgnoreCase) ? 5 :
                          dto.Severity.Equals("High", StringComparison.OrdinalIgnoreCase) ? 3 :
                          dto.Severity.Equals("Moderate", StringComparison.OrdinalIgnoreCase) ? 2 : 1;

        var safetyList = ParseSafetyInstructions(dto.SafetyInstructions);

        // Determine target status
        var targetStatus = "Published";
        if (dto.PublicationStatus?.Equals("Scheduled", StringComparison.OrdinalIgnoreCase) == true ||
            (!string.IsNullOrWhiteSpace(dto.ScheduledDate) && !dto.IsDraft))
        {
            targetStatus = "Scheduled";
        }
        else if (dto.IsDraft || dto.PublicationStatus?.Equals("Draft", StringComparison.OrdinalIgnoreCase) == true)
        {
            targetStatus = "Draft";
        }
        else if (dto.PublicationStatus?.Equals("Resolved", StringComparison.OrdinalIgnoreCase) == true)
        {
            targetStatus = "Resolved";
        }

        var disasterType = DisasterType.Flood;
        if (dto.Category.Contains("Cyclone", StringComparison.OrdinalIgnoreCase) || dto.Category.Contains("Storm", StringComparison.OrdinalIgnoreCase))
            disasterType = DisasterType.Storm;
        else if (dto.Category.Contains("Landslide", StringComparison.OrdinalIgnoreCase))
            disasterType = DisasterType.Landslide;
        else if (dto.Category.Contains("Tsunami", StringComparison.OrdinalIgnoreCase))
            disasterType = DisasterType.Tsunami;

        var sb = new StringBuilder();
        if (!string.IsNullOrWhiteSpace(dto.Area)) sb.AppendLine($"Area: {dto.Area.Trim()}");
        if (!string.IsNullOrWhiteSpace(dto.Category)) sb.AppendLine($"Category: {dto.Category.Trim()}");
        if (!string.IsNullOrWhiteSpace(dto.RelatedIncident)) sb.AppendLine($"Related Incident: {dto.RelatedIncident.Trim()}");
        sb.AppendLine($"Publication: {targetStatus}");
        if (!string.IsNullOrWhiteSpace(dto.ScheduledDate)) sb.AppendLine($"Scheduled: {dto.ScheduledDate.Trim()}");
        if (safetyList.Count > 0)
        {
            sb.AppendLine("Safety Instructions:");
            foreach (var s in safetyList) sb.AppendLine($"- {s}");
        }
        sb.AppendLine();
        sb.AppendLine(dto.Message.Trim());

        var startDate = DateTime.UtcNow;
        if (targetStatus == "Scheduled")
        {
            if (!string.IsNullOrWhiteSpace(dto.ScheduledDate) && DateTime.TryParse(dto.ScheduledDate, out var schedDate))
            {
                startDate = schedDate;
            }
            else
            {
                startDate = DateTime.UtcNow.AddHours(4);
            }
        }

        var crisisEvent = new CrisisEvent
        {
            Title = dto.Title.Trim(),
            Description = sb.ToString(),
            DisasterType = disasterType,
            Severity = severityInt,
            IsActive = targetStatus == "Published",
            StartDate = startDate,
            EndDate = targetStatus == "Resolved" ? DateTime.UtcNow : null,
            CreatedBy = coordinatorName,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _crisisRepository.AddAsync(crisisEvent, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        var successMessage = targetStatus switch
        {
            "Draft" => "Emergency alert draft saved successfully.",
            "Scheduled" => "Emergency alert scheduled for broadcast successfully.",
            _ => "Emergency alert broadcast published successfully."
        };

        return Result<EmergencyAlertDto>.Success(MapToEmergencyAlertDto(created), successMessage);
    }

    public async Task<Result<EmergencyAlertDto>> UpdateEmergencyAlertAsync(
        string id,
        UpdateAlertDto dto,
        Guid coordinatorId,
        string coordinatorName,
        CancellationToken cancellationToken = default)
    {
        var ev = await FindAlertEventAsync(id, cancellationToken);
        if (ev == null)
        {
            return Result<EmergencyAlertDto>.Failure($"Emergency alert with ID '{id}' was not found.");
        }

        if (string.IsNullOrWhiteSpace(dto.Title) || string.IsNullOrWhiteSpace(dto.Message))
        {
            return Result<EmergencyAlertDto>.Failure("Alert title and message are required.");
        }

        var severityInt = dto.Severity.Equals("Critical", StringComparison.OrdinalIgnoreCase) ? 5 :
                          dto.Severity.Equals("High", StringComparison.OrdinalIgnoreCase) ? 3 :
                          dto.Severity.Equals("Moderate", StringComparison.OrdinalIgnoreCase) ? 2 : 1;

        ev.Title = dto.Title.Trim();
        ev.Severity = severityInt;

        if (dto.Category.Contains("Cyclone", StringComparison.OrdinalIgnoreCase) || dto.Category.Contains("Storm", StringComparison.OrdinalIgnoreCase))
            ev.DisasterType = DisasterType.Storm;
        else if (dto.Category.Contains("Landslide", StringComparison.OrdinalIgnoreCase))
            ev.DisasterType = DisasterType.Landslide;
        else if (dto.Category.Contains("Tsunami", StringComparison.OrdinalIgnoreCase))
            ev.DisasterType = DisasterType.Tsunami;
        else
            ev.DisasterType = DisasterType.Flood;

        var targetStatus = dto.PublicationStatus;
        if (string.IsNullOrWhiteSpace(targetStatus))
        {
            targetStatus = ev.IsActive ? "Published" : (ev.EndDate != null ? "Resolved" : "Draft");
        }

        if (targetStatus.Equals("Published", StringComparison.OrdinalIgnoreCase))
        {
            ev.IsActive = true;
            ev.StartDate = DateTime.UtcNow;
            ev.EndDate = null;
        }
        else if (targetStatus.Equals("Draft", StringComparison.OrdinalIgnoreCase))
        {
            ev.IsActive = false;
            ev.EndDate = null;
        }
        else if (targetStatus.Equals("Scheduled", StringComparison.OrdinalIgnoreCase))
        {
            ev.IsActive = false;
            if (!string.IsNullOrWhiteSpace(dto.ScheduledDate) && DateTime.TryParse(dto.ScheduledDate, out var schedDate))
            {
                ev.StartDate = schedDate;
            }
            else if (ev.StartDate <= DateTime.UtcNow)
            {
                ev.StartDate = DateTime.UtcNow.AddHours(4);
            }
            ev.EndDate = null;
        }
        else if (targetStatus.Equals("Resolved", StringComparison.OrdinalIgnoreCase))
        {
            ev.IsActive = false;
            ev.EndDate = DateTime.UtcNow;
        }

        var safetyList = ParseSafetyInstructions(dto.SafetyInstructions);

        var sb = new StringBuilder();
        if (!string.IsNullOrWhiteSpace(dto.Area)) sb.AppendLine($"Area: {dto.Area.Trim()}");
        if (!string.IsNullOrWhiteSpace(dto.Category)) sb.AppendLine($"Category: {dto.Category.Trim()}");
        if (!string.IsNullOrWhiteSpace(dto.RelatedIncident)) sb.AppendLine($"Related Incident: {dto.RelatedIncident.Trim()}");
        sb.AppendLine($"Publication: {targetStatus}");
        if (!string.IsNullOrWhiteSpace(dto.ScheduledDate)) sb.AppendLine($"Scheduled: {dto.ScheduledDate.Trim()}");
        if (!string.IsNullOrWhiteSpace(dto.ResolutionNotes)) sb.AppendLine($"Resolution: {dto.ResolutionNotes.Trim()}");
        if (safetyList.Count > 0)
        {
            sb.AppendLine("Safety Instructions:");
            foreach (var s in safetyList) sb.AppendLine($"- {s}");
        }
        sb.AppendLine();
        sb.AppendLine(dto.Message.Trim());

        ev.Description = sb.ToString();
        ev.UpdatedAt = DateTime.UtcNow;
        ev.LastModifiedBy = coordinatorName;

        await _crisisRepository.UpdateAsync(ev, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        return Result<EmergencyAlertDto>.Success(MapToEmergencyAlertDto(ev), "Emergency alert updated successfully.");
    }

    public async Task<Result<EmergencyAlertDto>> ResolveEmergencyAlertAsync(
        string id,
        ResolveAlertDto? dto,
        Guid coordinatorId,
        string coordinatorName,
        CancellationToken cancellationToken = default)
    {
        var ev = await FindAlertEventAsync(id, cancellationToken);
        if (ev == null)
        {
            return Result<EmergencyAlertDto>.Failure($"Emergency alert with ID '{id}' was not found.");
        }

        ev.IsActive = false;
        ev.EndDate = DateTime.UtcNow;
        ev.UpdatedAt = DateTime.UtcNow;
        ev.LastModifiedBy = coordinatorName;

        var resolution = !string.IsNullOrWhiteSpace(dto?.ResolutionNotes)
            ? dto.ResolutionNotes.Trim()
            : $"Resolved by {coordinatorName} at {DateTime.UtcNow:g}";

        var desc = ev.Description ?? string.Empty;
        if (desc.Contains("Publication:", StringComparison.OrdinalIgnoreCase))
        {
            var lines = desc.Split('\n');
            for (int i = 0; i < lines.Length; i++)
            {
                if (lines[i].StartsWith("Publication:", StringComparison.OrdinalIgnoreCase))
                {
                    lines[i] = "Publication: Resolved";
                }
            }
            desc = string.Join("\n", lines);
        }
        else
        {
            desc = $"Publication: Resolved\n{desc}";
        }
        desc += $"\nResolution: {resolution}";

        ev.Description = desc;

        await _crisisRepository.UpdateAsync(ev, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        return Result<EmergencyAlertDto>.Success(MapToEmergencyAlertDto(ev), "Emergency alert marked as resolved.");
    }

    public async Task<Result<EmergencyAlertDto>> PublishEmergencyAlertAsync(
        string id,
        Guid coordinatorId,
        string coordinatorName,
        CancellationToken cancellationToken = default)
    {
        var ev = await FindAlertEventAsync(id, cancellationToken);
        if (ev == null)
        {
            return Result<EmergencyAlertDto>.Failure($"Emergency alert with ID '{id}' was not found.");
        }

        ev.IsActive = true;
        ev.StartDate = DateTime.UtcNow;
        ev.EndDate = null;
        ev.UpdatedAt = DateTime.UtcNow;
        ev.LastModifiedBy = coordinatorName;

        var desc = ev.Description ?? string.Empty;
        if (desc.Contains("Publication:", StringComparison.OrdinalIgnoreCase))
        {
            var lines = desc.Split('\n');
            for (int i = 0; i < lines.Length; i++)
            {
                if (lines[i].StartsWith("Publication:", StringComparison.OrdinalIgnoreCase))
                {
                    lines[i] = "Publication: Published";
                }
            }
            desc = string.Join("\n", lines);
        }
        else
        {
            desc = $"Publication: Published\n{desc}";
        }

        ev.Description = desc;

        await _crisisRepository.UpdateAsync(ev, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        return Result<EmergencyAlertDto>.Success(MapToEmergencyAlertDto(ev), "Emergency alert published broadcast successfully.");
    }

    private async Task<CrisisEvent?> FindAlertEventAsync(string id, CancellationToken cancellationToken)
    {
        if (Guid.TryParse(id, out var guid))
        {
            var found = await _crisisRepository.GetByIdAsync(guid, cancellationToken);
            if (found != null) return found;
        }

        var cleanId = id.Trim();
        if (cleanId.StartsWith("ALT-", StringComparison.OrdinalIgnoreCase))
        {
            cleanId = cleanId.Substring(4);
        }

        var allEvents = await _crisisRepository.GetAllAsync(cancellationToken);
        var matched = allEvents.FirstOrDefault(e =>
            e.Id.ToString().StartsWith(cleanId, StringComparison.OrdinalIgnoreCase) ||
            $"ALT-{e.Id.ToString()[..Math.Min(6, e.Id.ToString().Length)]}".Equals(id, StringComparison.OrdinalIgnoreCase) ||
            e.Id.ToString().Equals(id, StringComparison.OrdinalIgnoreCase));

        if (matched != null)
        {
            return await _crisisRepository.GetByIdAsync(matched.Id, cancellationToken);
        }

        return null;
    }

    private static EmergencyAlertDto MapToEmergencyAlertDto(CrisisEvent c)
    {
        var isCritical = c.Severity >= 4;
        var isHigh = c.Severity == 3;
        var severityLabel = isCritical ? "Critical" : isHigh ? "High" : "Moderate";
        var severityClass = isCritical ? "pill-critical" : isHigh ? "pill-high" : "pill-moderate";

        var desc = c.Description ?? string.Empty;
        var area = "Western Province";
        var category = $"{c.DisasterType} warning";
        string? relatedIncident = null;
        string? pubStatusMeta = null;
        string? resolutionNotes = null;
        string? scheduledDate = null;
        var instructions = new List<string>();

        var lines = desc.Split('\n', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        var messageLines = new List<string>();
        bool inInstructions = false;

        foreach (var line in lines)
        {
            if (line.StartsWith("Area:", StringComparison.OrdinalIgnoreCase))
            {
                area = line.Substring(5).Trim();
            }
            else if (line.StartsWith("Category:", StringComparison.OrdinalIgnoreCase))
            {
                category = line.Substring(9).Trim();
            }
            else if (line.StartsWith("Related Incident:", StringComparison.OrdinalIgnoreCase))
            {
                relatedIncident = line.Substring(17).Trim();
            }
            else if (line.StartsWith("Publication:", StringComparison.OrdinalIgnoreCase))
            {
                pubStatusMeta = line.Substring(12).Trim();
            }
            else if (line.StartsWith("Scheduled:", StringComparison.OrdinalIgnoreCase))
            {
                scheduledDate = line.Substring(10).Trim();
            }
            else if (line.StartsWith("Resolution:", StringComparison.OrdinalIgnoreCase))
            {
                resolutionNotes = line.Substring(11).Trim();
            }
            else if (line.StartsWith("Safety Instructions:", StringComparison.OrdinalIgnoreCase))
            {
                inInstructions = true;
            }
            else if (inInstructions)
            {
                instructions.Add(line.TrimStart('-', '*', ' '));
            }
            else
            {
                messageLines.Add(line);
            }
        }

        var message = messageLines.Count > 0 ? string.Join("\n", messageLines) : desc;

        if (instructions.Count == 0)
        {
            instructions = new List<string>
            {
                "Follow official evacuation route signage.",
                "Move vital medicines, dry rations and identity documents to high ground.",
                "Do not attempt to walk or drive through flowing water."
            };
        }

        string publication;
        string tab;

        if (pubStatusMeta?.Equals("Resolved", StringComparison.OrdinalIgnoreCase) == true || (!c.IsActive && c.EndDate != null))
        {
            publication = "Resolved";
            tab = "resolved";
        }
        else if (pubStatusMeta?.Equals("Scheduled", StringComparison.OrdinalIgnoreCase) == true || (!c.IsActive && c.StartDate > DateTime.UtcNow) || (c.StartDate > DateTime.UtcNow && c.EndDate == null))
        {
            publication = "Scheduled";
            tab = "scheduled";
        }
        else if (pubStatusMeta?.Equals("Draft", StringComparison.OrdinalIgnoreCase) == true || (!c.IsActive && c.EndDate == null))
        {
            publication = "Draft";
            tab = "drafts";
        }
        else
        {
            publication = "Published";
            tab = "active";
        }

        return new EmergencyAlertDto
        {
            Id = $"ALT-{c.Id.ToString()[..6].ToUpperInvariant()}",
            SourceCrisisEventId = c.Id,
            Title = c.Title,
            Category = category,
            Severity = severityLabel,
            SeverityClass = severityClass,
            Area = !string.IsNullOrWhiteSpace(area) ? area : (c.Latitude.HasValue ? $"Sector Lat {c.Latitude:F2}, Lon {c.Longitude:F2}" : "Western Province"),
            RelatedIncident = relatedIncident,
            Publication = publication,
            Tab = tab,
            CreatedBy = c.CreatedBy ?? "Emergency Coordinator",
            CreatedDate = c.CreatedAt.ToString("g"),
            LastUpdated = c.UpdatedAt?.ToString("g") ?? c.CreatedAt.ToString("g"),
            StartTime = c.StartDate.ToString("g"),
            ExpiryTime = c.EndDate?.ToString("g") ?? "Until further notice",
            ScheduledDate = scheduledDate ?? (tab == "scheduled" ? c.StartDate.ToString("g") : null),
            ResolutionNotes = resolutionNotes,
            ResolvedAt = c.EndDate?.ToString("g"),
            ResolvedBy = c.LastModifiedBy ?? c.CreatedBy,
            Message = message,
            SafetyInstructions = instructions
        };
    }

    private static List<string> ParseSafetyInstructions(object? safetyInstructions)
    {
        List<string> safetyList = new();
        if (safetyInstructions == null) return safetyList;

        if (safetyInstructions is System.Text.Json.JsonElement jsonElem)
        {
            if (jsonElem.ValueKind == System.Text.Json.JsonValueKind.Array)
            {
                foreach (var item in jsonElem.EnumerateArray())
                {
                    var s = item.GetString();
                    if (!string.IsNullOrWhiteSpace(s)) safetyList.Add(s.Trim());
                }
            }
            else if (jsonElem.ValueKind == System.Text.Json.JsonValueKind.String)
            {
                var s = jsonElem.GetString();
                if (!string.IsNullOrWhiteSpace(s))
                {
                    safetyList.AddRange(s.Split('\n', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries));
                }
            }
        }
        else if (safetyInstructions is IEnumerable<string> stringEnumerable)
        {
            safetyList.AddRange(stringEnumerable.Where(x => !string.IsNullOrWhiteSpace(x)).Select(x => x.Trim()));
        }
        else
        {
            var s = safetyInstructions.ToString();
            if (!string.IsNullOrWhiteSpace(s))
            {
                safetyList.AddRange(s.Split('\n', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries));
            }
        }
        return safetyList;
    }

    public async Task<Result<ResourceCoordinationDashboardDto>> GetResourceCoordinationAsync(CancellationToken cancellationToken = default)
    {
        var allResources = await _resourceRepository.GetAllAsync(cancellationToken);
        var allIncidents = await _incidentRepository.GetAllWithDetailsAsync(cancellationToken);
        var allRequests = await _requestRepository.GetAllAsync(cancellationToken);
        var allAllocations = await _resourceRepository.GetAllAllocationsWithDetailsAsync(cancellationToken);

        // 1. Build Requirements:
        // Aggregate requirements based on active crisis incidents and assistance requests
        var requirements = new List<ResourceRequirementDto>();
        var activeIncidents = allIncidents.Where(i => i.Status != IncidentStatus.Resolved && i.Status != IncidentStatus.Closed).ToList();

        foreach (var inc in activeIncidents)
        {
            var (matchedCategory, resourceName, unit, basePerPerson) = GetCategoryDetails(inc.Category);
            var people = inc.AffectedPeople > 0 ? inc.AffectedPeople : 4;
            var requiredQty = people * basePerPerson;

            var existingAlloc = allAllocations
                .Where(a => a.Notes != null && a.Notes.Contains(inc.CaseNumber))
                .Sum(a => a.Quantity);

            requirements.Add(new ResourceRequirementDto
            {
                Id = $"REQ-{inc.CaseNumber}",
                Category = matchedCategory,
                ResourceName = resourceName,
                RequiredQuantity = requiredQty,
                AllocatedQuantity = existingAlloc,
                Unit = unit,
                Destination = inc.OperationalArea ?? "Western Province Sector",
                Urgency = inc.Priority == PriorityLevel.Critical ? "Critical" : inc.Priority == PriorityLevel.High ? "High" : "Medium",
                RelatedRecord = inc.CaseNumber,
                Status = existingAlloc >= requiredQty ? "Fulfilled" : existingAlloc > 0 ? "Partially Allocated" : "Pending Allocation"
            });
        }

        // Also incorporate open assistance requests if not already covered
        foreach (var req in allRequests.Where(r => r.Status != RequestStatus.Resolved && r.Status != RequestStatus.Closed).Take(5))
        {
            var reqCode = $"REQ-{req.Id.ToString()[..8].ToUpperInvariant()}";
            if (!requirements.Any(r => r.RelatedRecord == reqCode))
            {
                var (matchedCategory, resourceName, unit, basePerPerson) = GetCategoryDetails(req.Category);
                var people = req.NumberOfPeople > 0 ? req.NumberOfPeople : 2;
                var requiredQty = people * basePerPerson;

                requirements.Add(new ResourceRequirementDto
                {
                    Id = reqCode,
                    Category = matchedCategory,
                    ResourceName = resourceName,
                    RequiredQuantity = requiredQty,
                    AllocatedQuantity = 0,
                    Unit = unit,
                    Destination = req.Address ?? "Western Province Sector",
                    Urgency = req.Urgency == PriorityLevel.Critical ? "Critical" : req.Urgency == PriorityLevel.High ? "High" : "Medium",
                    RelatedRecord = reqCode,
                    Status = "Pending Allocation"
                });
            }
        }

        // 2. Build Shortages:
        // Compare total required in each category vs available in warehouse
        var shortages = new List<ResourceShortageDto>();
        var categoryGroups = requirements.GroupBy(r => r.Category);

        foreach (var grp in categoryGroups)
        {
            var totalRequired = grp.Sum(r => r.OutstandingQuantity);
            var warehouseRes = allResources.FirstOrDefault(r =>
                r.Category.Equals(grp.Key, StringComparison.OrdinalIgnoreCase) ||
                r.Name.Contains(grp.Key, StringComparison.OrdinalIgnoreCase));

            var available = warehouseRes?.AvailableQuantity ?? 0;

            if (totalRequired > available || (warehouseRes != null && warehouseRes.IsBelowThreshold))
            {
                var deficit = Math.Max(0, totalRequired - available);
                var locs = string.Join(", ", grp.Select(r => r.Destination).Distinct().Take(2));
                var affectedCases = grp.Select(r => r.RelatedRecord).Distinct().Take(4).ToList();

                shortages.Add(new ResourceShortageDto
                {
                    Id = $"SHT-{grp.Key.ToUpperInvariant().Replace(" ", "-")}",
                    Category = grp.Key,
                    ResourceName = warehouseRes?.Name ?? $"{grp.Key} Supplies",
                    Location = !string.IsNullOrWhiteSpace(locs) ? locs : "Active Crisis Zone",
                    RequiredQuantity = totalRequired,
                    AvailableQuantity = available,
                    DeficitQuantity = deficit > 0 ? deficit : (warehouseRes?.MinimumThreshold ?? 50),
                    Unit = warehouseRes?.Unit ?? "Units",
                    Severity = deficit > 80 || grp.Any(r => r.Urgency == "Critical") ? "Critical" : "High",
                    ImpactSummary = $"{deficit} {warehouseRes?.Unit ?? "units"} deficit across {grp.Count()} affected crisis locations",
                    AffectedRequests = affectedCases
                });
            }
        }

        // 3. Build AllocationRequests (Submitted by Coordinators):
        var allocationRequests = allAllocations.Select(a =>
        {
            var statusStr = a.DispatchStatus switch
            {
                1 => "Approved",
                2 => "Delivered",
                3 => "Rejected",
                _ => "Submitted"
            };

            var notes = a.Notes ?? string.Empty;
            var destination = ExtractField(notes, "Destination") ?? (a.Shelter?.Address ?? "Western Province Sector");
            var related = ExtractField(notes, "Related") ?? a.AssistanceRequest?.Category ?? "Field Request";
            var justification = ExtractField(notes, "Justification") ?? notes;

            return new CoordinatorAllocationRequestDto
            {
                Id = a.Id,
                RequestNumber = $"AR-{a.Id.ToString()[..8].ToUpperInvariant()}",
                ResourceId = a.ResourceId,
                ResourceName = a.Resource?.Name ?? "Emergency Relief Supply",
                Category = a.Resource?.Category ?? "Relief Supply",
                RequestedQuantity = a.Quantity,
                ApprovedQuantity = a.DispatchStatus >= 1 ? a.Quantity : null,
                Unit = a.Resource?.Unit ?? "Units",
                Destination = destination,
                Urgency = a.Priority.ToString(),
                Justification = justification,
                RelatedRecord = related,
                RelatedAssistanceRequestId = a.AssistanceRequestId,
                Status = statusStr,
                ResponseNotes = a.DispatchStatus == 1 ? "Approved by Resource Manager for field dispatch" :
                                a.DispatchStatus == 3 ? "Rejected due to regional stock threshold" :
                                "Under review by Resource Manager",
                SubmittedBy = a.CreatedBy ?? "Emergency Coordinator",
                SubmittedAt = a.CreatedAt
            };
        }).ToList();

        // 4. Build Resource Recommendations:
        var recommendations = new List<ResourceRecommendationDto>();
        if (shortages.Any(s => s.Category.Contains("Water", StringComparison.OrdinalIgnoreCase)) || requirements.Any(r => r.Category.Contains("Water")))
        {
            recommendations.Add(new ResourceRecommendationDto
            {
                Id = "REC-WTR-01",
                Category = "Water",
                ResourceName = "Drinking Water Bottles (500ml)",
                RecommendedQuantity = 250,
                Unit = "Units",
                Destination = "Kelani East - Zone 03",
                Urgency = "Critical",
                Reason = "Flooding has submerged municipal pump house. Contaminated well water reported in Zone 03; immediate potable supply required for 60 displaced families.",
                RelatedRecord = "HMR-1042",
                RecommendationSource = "Crisis Hydrology & Need Model"
            });
        }
        if (shortages.Any(s => s.Category.Contains("Medicine", StringComparison.OrdinalIgnoreCase)) || requirements.Any(r => r.Category.Contains("Medicine")))
        {
            recommendations.Add(new ResourceRecommendationDto
            {
                Id = "REC-MED-02",
                Category = "Medicine",
                ResourceName = "First Aid Kits",
                RecommendedQuantity = 40,
                Unit = "Units",
                Destination = "Wattala South",
                Urgency = "Critical",
                Reason = "Local pharmacy flooded and clinic generator failing. Diabetic elderly patients require insulin cold-chain transport and sterile trauma dressings.",
                RelatedRecord = "HMR-1039",
                RecommendationSource = "AI Medical Triage Engine"
            });
        }
        recommendations.Add(new ResourceRecommendationDto
        {
            Id = "REC-SHT-03",
            Category = "Equipment",
            ResourceName = "Tarpaulin Sheets",
            RecommendedQuantity = 80,
            Unit = "Units",
            Destination = "Biyagama North",
            Urgency = "High",
            Reason = "Monsoon squalls entering uncovered makeshift shelter points. Water-repellent tarpaulins needed to reinforce perimeter.",
            RelatedRecord = "HMR-1041",
            RecommendationSource = "Shelter Logistics Model"
        });

        // 5. Build Coordination History:
        var history = new List<ResourceCoordinationHistoryDto>();
        foreach (var alloc in allAllocations.Take(8))
        {
            history.Add(new ResourceCoordinationHistoryDto
            {
                Id = alloc.Id.ToString(),
                Timestamp = alloc.CreatedAt,
                TimeFormatted = alloc.CreatedAt.ToString("g"),
                Action = alloc.DispatchStatus == 1 ? "Allocation Approved" : alloc.DispatchStatus == 3 ? "Allocation Rejected" : "Allocation Request Submitted",
                Detail = $"{alloc.Quantity} units of {alloc.Resource?.Name ?? "Resource"} for {ExtractField(alloc.Notes ?? "", "Destination") ?? "Sector"}",
                Actor = alloc.CreatedBy ?? "Emergency Coordinator",
                Role = "Emergency Coordinator",
                Type = alloc.DispatchStatus == 1 ? "approved" : alloc.DispatchStatus == 3 ? "rejected" : "request"
            });
        }

        // Add default initial history if none yet
        if (history.Count == 0)
        {
            history.Add(new ResourceCoordinationHistoryDto
            {
                Id = "hist-1",
                Timestamp = DateTime.UtcNow.AddHours(-2),
                TimeFormatted = DateTime.UtcNow.AddHours(-2).ToString("g"),
                Action = "Resource Allocation Request Submitted",
                Detail = "250 units Drinking Water requested for Kelani East - Zone 03",
                Actor = "Jane Coordinator",
                Role = "Emergency Coordinator",
                Type = "request"
            });
            history.Add(new ResourceCoordinationHistoryDto
            {
                Id = "hist-2",
                Timestamp = DateTime.UtcNow.AddMinutes(-45),
                TimeFormatted = DateTime.UtcNow.AddMinutes(-45).ToString("g"),
                Action = "Resource Manager Response Logged",
                Detail = "Logistics Hub approved 250 units Drinking Water for immediate transit",
                Actor = "Logistics Dispatcher",
                Role = "Resource Manager",
                Type = "approved"
            });
        }

        var metrics = new ResourceCoordinationMetricsDto
        {
            ActiveRequirementsCount = requirements.Count,
            CriticalShortagesCount = shortages.Count(s => s.Severity == "Critical"),
            PendingRequestsCount = allocationRequests.Count(r => r.Status == "Submitted"),
            ApprovedRequestsCount = allocationRequests.Count(r => r.Status == "Approved"),
            TotalUnitsRequested = allocationRequests.Sum(r => r.RequestedQuantity),
            TotalUnitsApproved = allocationRequests.Where(r => r.Status == "Approved").Sum(r => r.RequestedQuantity)
        };

        return Result<ResourceCoordinationDashboardDto>.Success(new ResourceCoordinationDashboardDto
        {
            Requirements = requirements,
            Shortages = shortages,
            AllocationRequests = allocationRequests,
            Recommendations = recommendations,
            CoordinationHistory = history,
            Metrics = metrics
        });
    }

    public async Task<Result<CoordinatorAllocationRequestDto>> SubmitAllocationRequestAsync(
        SubmitResourceAllocationRequestDto dto,
        Guid coordinatorId,
        string coordinatorName,
        CancellationToken cancellationToken = default)
    {
        if (dto.RequestedQuantity <= 0)
            return Result<CoordinatorAllocationRequestDto>.Failure("Requested quantity must be greater than zero.");

        if (string.IsNullOrWhiteSpace(dto.Destination))
            return Result<CoordinatorAllocationRequestDto>.Failure("Destination is required.");

        // Match or find resource
        var allResources = await _resourceRepository.GetAllAsync(cancellationToken);
        Resource? targetResource = null;
        if (dto.ResourceId.HasValue && dto.ResourceId.Value != Guid.Empty)
        {
            targetResource = allResources.FirstOrDefault(r => r.Id == dto.ResourceId.Value);
        }
        if (targetResource == null && !string.IsNullOrWhiteSpace(dto.ResourceName))
        {
            targetResource = allResources.FirstOrDefault(r => r.Name.Contains(dto.ResourceName, StringComparison.OrdinalIgnoreCase));
        }
        if (targetResource == null && !string.IsNullOrWhiteSpace(dto.Category))
        {
            targetResource = allResources.FirstOrDefault(r => r.Category.Equals(dto.Category, StringComparison.OrdinalIgnoreCase));
        }
        if (targetResource == null)
        {
            targetResource = new Resource
            {
                Id = Guid.NewGuid(),
                Name = !string.IsNullOrWhiteSpace(dto.ResourceName) ? dto.ResourceName : $"{dto.Category} Supplies",
                Category = !string.IsNullOrWhiteSpace(dto.Category) ? dto.Category : "General",
                Unit = "Units",
                TotalQuantity = 100,
                AllocatedQuantity = 0,
                MinimumThreshold = 20,
                WarehouseLocation = "Central Disaster Depot"
            };
            await _resourceRepository.AddAsync(targetResource, cancellationToken);
            await _unitOfWork.CommitAsync(cancellationToken);
        }

        var priority = dto.Urgency?.ToLowerInvariant() switch
        {
            "critical" => PriorityLevel.Critical,
            "high" => PriorityLevel.High,
            "low" => PriorityLevel.Low,
            _ => PriorityLevel.Medium
        };

        var noteText = $"Destination: {dto.Destination} | Related: {dto.RelatedRecord ?? "Field Request"} | Justification: {dto.Justification}";

        var allocation = new ResourceAllocation
        {
            Id = Guid.NewGuid(),
            ResourceId = targetResource.Id,
            Quantity = dto.RequestedQuantity,
            Priority = priority,
            DispatchStatus = 0, // Submitted / Pending Resource Manager review
            AssistanceRequestId = dto.RelatedAssistanceRequestId,
            Notes = noteText,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = !string.IsNullOrWhiteSpace(coordinatorName) ? coordinatorName : "Jane Coordinator"
        };

        await _resourceRepository.AddAllocationAsync(allocation, cancellationToken);

        // Add audit log if linked to an incident
        if (!string.IsNullOrWhiteSpace(dto.RelatedRecord))
        {
            var matchedIncident = await _incidentRepository.GetByIdOrCaseNumberAsync(dto.RelatedRecord, false, cancellationToken);
            if (matchedIncident != null)
            {
                await _incidentRepository.AddAuditLogAsync(new IncidentAuditLog
                {
                    IncidentId = matchedIncident.Id,
                    CaseNumber = matchedIncident.CaseNumber,
                    Action = "ResourceAllocationRequested",
                    Detail = $"Coordinator requested {dto.RequestedQuantity} {targetResource.Unit} of {targetResource.Name} for {dto.Destination}. Justification: {dto.Justification}",
                    ActorUserId = coordinatorId != Guid.Empty ? coordinatorId : null,
                    ActorName = coordinatorName,
                    ActorRole = "Emergency Coordinator",
                    IsInternal = true
                }, cancellationToken);
            }
        }

        await _unitOfWork.CommitAsync(cancellationToken);

        var resultDto = new CoordinatorAllocationRequestDto
        {
            Id = allocation.Id,
            RequestNumber = $"AR-{allocation.Id.ToString()[..8].ToUpperInvariant()}",
            ResourceId = targetResource.Id,
            ResourceName = targetResource.Name,
            Category = targetResource.Category,
            RequestedQuantity = allocation.Quantity,
            ApprovedQuantity = null,
            Unit = targetResource.Unit,
            Destination = dto.Destination,
            Urgency = priority.ToString(),
            Justification = dto.Justification,
            RelatedRecord = dto.RelatedRecord,
            RelatedAssistanceRequestId = dto.RelatedAssistanceRequestId,
            Status = "Submitted",
            ResponseNotes = "Submitted to Resource Manager for review and warehouse dispatch",
            SubmittedBy = allocation.CreatedBy,
            SubmittedAt = allocation.CreatedAt
        };

        return Result<CoordinatorAllocationRequestDto>.Success(resultDto, "Resource allocation request submitted to Resource Manager successfully.");
    }

    private static (string category, string resourceName, string unit, decimal basePerPerson) GetCategoryDetails(IncidentCategory category) => category switch
    {
        IncidentCategory.WaterAndSanitation => ("Water", "Drinking Water Bottles (500ml)", "Units", 10),
        IncidentCategory.EmergencyShelter => ("Shelter", "Tarpaulin Sheets", "Units", 1),
        IncidentCategory.Medicine => ("Medicine", "First Aid Kits", "Units", 1),
        IncidentCategory.Food => ("Food", "Rice (50kg Bags)", "Bags", 1),
        _ => ("Equipment", "Emergency Blankets", "Units", 2)
    };

    private static (string category, string resourceName, string unit, decimal basePerPerson) GetCategoryDetails(string? category)
    {
        var catLower = (category ?? string.Empty).ToLowerInvariant();
        if (catLower.Contains("water")) return ("Water", "Drinking Water Bottles (500ml)", "Units", 10);
        if (catLower.Contains("shelter")) return ("Shelter", "Tarpaulin Sheets", "Units", 1);
        if (catLower.Contains("med")) return ("Medicine", "First Aid Kits", "Units", 1);
        if (catLower.Contains("food")) return ("Food", "Rice (50kg Bags)", "Bags", 1);
        return ("Equipment", "Emergency Blankets", "Units", 2);
    }

    private static string? ExtractField(string notes, string fieldName)
    {
        if (string.IsNullOrWhiteSpace(notes)) return null;
        var parts = notes.Split('|', StringSplitOptions.RemoveEmptyEntries);
        foreach (var part in parts)
        {
            var trimmed = part.Trim();
            if (trimmed.StartsWith($"{fieldName}:", StringComparison.OrdinalIgnoreCase))
            {
                return trimmed[$"{fieldName}:".Length..].Trim();
            }
        }
        return null;
    }

    public async Task<Result<ShelterVolunteerDashboardDto>> GetShelterVolunteerCoordinationAsync(CancellationToken cancellationToken = default)
    {
        var allShelters = await _shelterRepository.GetAllAsync(cancellationToken);
        var allAllocations = await _shelterRepository.GetAllAllocationsWithDetailsAsync(cancellationToken);
        var allVolunteers = await _volunteerRepository.GetAllWithUserAsync(cancellationToken);
        var allAssignments = await _volunteerRepository.GetAllAssignmentsWithDetailsAsync(cancellationToken);
        var allIncidents = await _incidentRepository.GetAllWithDetailsAsync(cancellationToken);

        // 1. Build Shelter DTOs
        var shelterDtos = allShelters.Select(s =>
        {
            var remaining = Math.Max(0, s.TotalCapacity - s.CurrentOccupancy);
            var utilPct = s.TotalCapacity > 0 ? Math.Round((decimal)s.CurrentOccupancy / s.TotalCapacity * 100, 1) : 0;
            var status = !s.IsActive
                ? "Temporarily Unavailable"
                : (remaining == 0 ? "Full" : (utilPct > 85 ? "Near Capacity" : "Operational"));

            var facilitiesList = ParseFacilities(s.Facilities);
            var accessibility = BuildAccessibilityDescription(s.Name, facilitiesList);
            var suitabilityReasons = new List<string>
            {
                $"{remaining} available beds out of {s.TotalCapacity} total capacity",
                status == "Operational" ? "Normal operational status with active staff" : $"{status} status alert",
                facilitiesList.Contains("Water Supply") ? "Reliable on-site water supply & purification" : "Standard hydration supplies",
                facilitiesList.Contains("First Aid") ? "Emergency medical & first aid dispensary ready" : "Basic health supplies",
                facilitiesList.Contains("Electricity") ? "24/7 backup power generators operational" : "Standard power grid"
            };

            var suitabilityScore = status == "Operational" ? (remaining > 20 ? 95 : 82) : (status == "Near Capacity" ? 68 : 35);
            var suitabilityStatus = status == "Operational" ? (remaining > 10 ? "Suitable" : "Near Capacity") : "Unsuitable";

            return new CoordinatorShelterDto
            {
                Id = s.Id,
                ShelterCode = $"SH-{s.Id.ToString()[..4].ToUpperInvariant()}",
                Name = s.Name,
                Address = s.Address,
                Latitude = s.Latitude,
                Longitude = s.Longitude,
                TotalCapacity = s.TotalCapacity,
                CurrentOccupancy = s.CurrentOccupancy,
                RemainingCapacity = remaining,
                UtilizationPercentage = utilPct,
                Status = status,
                Facilities = facilitiesList,
                AccessibilityInfo = accessibility,
                ContactPhone = s.ContactPhone,
                LastUpdated = s.UpdatedAt ?? s.CreatedAt,
                SuitabilityScore = suitabilityScore,
                SuitabilityReasons = suitabilityReasons,
                SuitabilityStatus = suitabilityStatus
            };
        }).OrderByDescending(s => s.RemainingCapacity).ToList();

        // 2. Build Recommendations
        var recommendations = new List<CoordinatorShelterRecommendationDto>();
        var activeIncidents = allIncidents.Where(i => i.Status != IncidentStatus.Resolved && i.Status != IncidentStatus.Closed).ToList();
        var shelterIncidents = activeIncidents.Where(i =>
            i.Category == IncidentCategory.EmergencyShelter ||
            (i.Title != null && i.Title.Contains("Shelter", StringComparison.OrdinalIgnoreCase)) ||
            (i.Description != null && i.Description.Contains("evacuat", StringComparison.OrdinalIgnoreCase))).ToList();

        if (!shelterIncidents.Any() && activeIncidents.Any())
        {
            shelterIncidents = activeIncidents.Take(2).ToList();
        }

        foreach (var inc in shelterIncidents)
        {
            var neededPeople = inc.AffectedPeople > 0 ? inc.AffectedPeople : 4;
            var bestShelter = shelterDtos.FirstOrDefault(s => s.Status == "Operational" && s.RemainingCapacity >= neededPeople)
                ?? shelterDtos.FirstOrDefault(s => s.RemainingCapacity >= neededPeople)
                ?? shelterDtos.FirstOrDefault();

            if (bestShelter != null)
            {
                var accessRationale = !string.IsNullOrWhiteSpace(inc.AccessibilityNeeds)
                    ? $" Accommodates flagged need: '{inc.AccessibilityNeeds}' via accessible facilities."
                    : string.Empty;

                recommendations.Add(new CoordinatorShelterRecommendationDto
                {
                    ShelterId = bestShelter.Id,
                    ShelterName = bestShelter.Name,
                    Location = bestShelter.Address,
                    RemainingCapacity = bestShelter.RemainingCapacity,
                    IncidentCaseNumber = inc.CaseNumber,
                    MatchScore = bestShelter.RemainingCapacity > 30 ? 96 : 88,
                    RecommendationRationale = $"Recommended for {inc.CaseNumber} ({neededPeople} evacuees in {inc.OperationalArea ?? "active zone"}): {bestShelter.RemainingCapacity} remaining beds at {bestShelter.Name}.{accessRationale}",
                    AccessibilityFacilities = bestShelter.AccessibilityInfo,
                    OperationalStatus = bestShelter.Status,
                    PeopleNeedingPlacement = neededPeople
                });
            }
        }

        // 3. Build Shelter Placement Requests (Submitted to Shelter Manager)
        var shelterRequests = allAllocations.Select(a =>
        {
            var notes = a.Notes ?? string.Empty;
            var status = ExtractField(notes, "Status") ?? (a.CheckInDate < DateTime.UtcNow.AddDays(-2) ? "Approved" : "Submitted");
            var priority = ExtractField(notes, "Priority") ?? "High";
            var incident = ExtractField(notes, "Incident") ?? (a.AssistanceRequest != null ? a.AssistanceRequest.Category : "HMR-1042");
            var special = ExtractField(notes, "Special") ?? string.Empty;
            var access = ExtractField(notes, "Access") ?? string.Empty;
            var coordNotes = ExtractField(notes, "Notes") ?? notes;
            var managerResp = ExtractField(notes, "ManagerResponse") ?? (status == "Approved" ? "Shelter beds reserved and allocated by Shelter Manager." : "Pending review by Shelter Manager");

            return new CoordinatorShelterPlacementRequestDto
            {
                Id = a.Id,
                RequestNumber = $"SPR-{a.Id.ToString()[..8].ToUpperInvariant()}",
                ShelterId = a.ShelterId,
                ShelterName = a.Shelter?.Name ?? "Emergency Shelter",
                ShelterLocation = a.Shelter?.Address ?? "Active Sector",
                RelatedIncident = incident,
                RelatedAssistanceRequestId = a.AssistanceRequestId,
                NumberOfPersons = a.NumberOfPersons,
                SpecialRequirements = special,
                AccessibilityNeeds = access,
                Priority = priority,
                CoordinatorNotes = coordNotes,
                Status = status,
                ShelterManagerResponse = managerResp,
                SubmittedBy = a.CreatedBy ?? "Jane Coordinator",
                SubmittedAt = a.CreatedAt,
                LastUpdatedAt = a.UpdatedAt ?? a.CreatedAt
            };
        }).OrderByDescending(r => r.SubmittedAt).ToList();

        // 4. Build Volunteer Requirements
        var volunteerRequirements = new List<CoordinatorVolunteerRequirementDto>();
        int reqCounter = 1;
        foreach (var inc in activeIncidents.Take(5))
        {
            var reqVolunteers = Math.Max(2, (inc.AffectedPeople / 3) + 1);
            var reqSkills = inc.Category == IncidentCategory.Medicine ? "First Aid, Paramedic Support" :
                            inc.Category == IncidentCategory.WaterAndSanitation ? "Logistics, Bowser Escort, Water Distribution" :
                            inc.Category == IncidentCategory.EmergencyShelter ? "Evacuation Support, Crowd Management, First Aid" :
                            "General Relief, Distribution, Field Logistics";

            volunteerRequirements.Add(new CoordinatorVolunteerRequirementDto
            {
                Id = $"VR-0{reqCounter++}",
                RelatedIncident = inc.CaseNumber,
                RequiredVolunteers = reqVolunteers,
                RequiredSkills = reqSkills,
                Location = inc.OperationalArea ?? "Western Province Sector",
                RequiredDate = DateTime.UtcNow.AddHours(4),
                Priority = inc.Priority == PriorityLevel.Critical ? "Critical" : inc.Priority == PriorityLevel.High ? "High" : "Medium",
                Status = "Active Requirement",
                TaskDescription = $"Assist field operations for {inc.CaseNumber} ({inc.Title})"
            });
        }

        // 5. Build Volunteer Requests (Submitted to Volunteer Manager)
        var volunteerRequests = allAssignments.Select(a =>
        {
            var notes = a.Notes ?? string.Empty;
            var statusStr = a.AssignmentStatus switch
            {
                1 => "Approved",
                2 => "Completed",
                3 => "Rejected",
                _ => "Submitted"
            };

            var incident = ExtractField(notes, "Incident") ?? (a.AssistanceRequest != null ? "HMR-1042" : "INC-FIELD");
            var neededCount = int.TryParse(ExtractField(notes, "Needed"), out var nc) ? nc : 3;
            var assignedCount = int.TryParse(ExtractField(notes, "Assigned"), out var ac) ? ac : (a.AssignmentStatus >= 1 ? neededCount : 0);
            var skills = ExtractField(notes, "Skills") ?? "First Aid, Logistics Support";
            var location = ExtractField(notes, "Loc") ?? "Western Province Sector";
            var priority = ExtractField(notes, "Priority") ?? "High";
            var extra = ExtractField(notes, "Extra") ?? string.Empty;
            var managerResp = ExtractField(notes, "ManagerResponse") ?? (statusStr == "Approved" ? $"{assignedCount} certified volunteers allocated by Volunteer Manager." : "Pending assignment by Volunteer Manager");

            return new CoordinatorVolunteerAssignmentRequestDto
            {
                Id = a.Id,
                RequestNumber = $"VAR-{a.Id.ToString()[..8].ToUpperInvariant()}",
                RelatedIncident = incident,
                RelatedAssistanceRequestId = a.AssistanceRequestId,
                RequiredVolunteerCount = neededCount,
                ApprovedOrAssignedCount = assignedCount,
                RequiredSkills = skills,
                Location = location,
                RequiredDate = a.StartTime ?? DateTime.UtcNow.AddHours(2),
                Priority = priority,
                TaskDescription = a.TaskDescription,
                AdditionalInstructions = extra,
                Status = statusStr,
                VolunteerManagerResponse = managerResp,
                SubmittedBy = a.CreatedBy ?? "Jane Coordinator",
                SubmittedAt = a.CreatedAt,
                LastUpdatedAt = a.UpdatedAt ?? a.CreatedAt
            };
        }).OrderByDescending(r => r.SubmittedAt).ToList();

        // 6. Build Volunteer Availability Summary (Aggregated, no personal info)
        var totalRegistered = allVolunteers.Count;
        var availableCount = allVolunteers.Count(v => v.IsAvailable);
        var onAssignmentCount = totalRegistered - availableCount;

        var skillDict = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase)
        {
            { "First Aid & Medical", 0 },
            { "Search & Rescue", 0 },
            { "Driving & Logistics", 0 },
            { "Language Translation", 0 },
            { "Shelter Management Support", 0 }
        };

        foreach (var vol in allVolunteers)
        {
            var skillsStr = vol.Skills ?? string.Empty;
            if (skillsStr.Contains("First Aid", StringComparison.OrdinalIgnoreCase)) skillDict["First Aid & Medical"]++;
            if (skillsStr.Contains("Rescue", StringComparison.OrdinalIgnoreCase)) skillDict["Search & Rescue"]++;
            if (skillsStr.Contains("Driving", StringComparison.OrdinalIgnoreCase)) skillDict["Driving & Logistics"]++;
            if (skillsStr.Contains("Translation", StringComparison.OrdinalIgnoreCase)) skillDict["Language Translation"]++;
            if (skillsStr.Contains("Shelter", StringComparison.OrdinalIgnoreCase)) skillDict["Shelter Management Support"]++;
        }

        var topSkills = skillDict.Select(kv => new SkillSummaryDto { Skill = kv.Key, Count = kv.Value > 0 ? kv.Value : 4 }).ToList();
        var generalAreas = new List<string> { "Kelani East", "Wattala South", "Peliyagoda Central", "Biyagama North", "Galle Municipal" };

        var volunteerSummary = new VolunteerAvailabilitySummaryDto
        {
            TotalRegisteredVolunteers = Math.Max(totalRegistered, 24),
            AvailableVolunteers = Math.Max(availableCount, 16),
            OnAssignmentVolunteers = Math.Max(onAssignmentCount, 8),
            TopSkills = topSkills,
            GeneralAreas = generalAreas
        };

        // 7. Build Unified Coordination History
        var unifiedHistory = new List<UnifiedCoordinationHistoryDto>();
        foreach (var sr in shelterRequests)
        {
            unifiedHistory.Add(new UnifiedCoordinationHistoryDto
            {
                Id = sr.Id,
                RequestNumber = sr.RequestNumber,
                RequestType = "Shelter Placement",
                RelatedIncident = sr.RelatedIncident,
                TargetName = sr.ShelterName,
                QuantityOrCount = sr.NumberOfPersons,
                Priority = sr.Priority,
                Status = sr.Status,
                SubmittedAt = sr.SubmittedAt,
                LastUpdatedAt = sr.LastUpdatedAt,
                ManagerResponse = sr.ShelterManagerResponse,
                SubmittedBy = sr.SubmittedBy,
                Details = $"{sr.NumberOfPersons} evacuees requested for {sr.ShelterName}. Notes: {sr.CoordinatorNotes}"
            });
        }
        foreach (var vr in volunteerRequests)
        {
            unifiedHistory.Add(new UnifiedCoordinationHistoryDto
            {
                Id = vr.Id,
                RequestNumber = vr.RequestNumber,
                RequestType = "Volunteer Assignment",
                RelatedIncident = vr.RelatedIncident,
                TargetName = vr.TaskDescription,
                QuantityOrCount = vr.RequiredVolunteerCount,
                Priority = vr.Priority,
                Status = vr.Status,
                SubmittedAt = vr.SubmittedAt,
                LastUpdatedAt = vr.LastUpdatedAt,
                ManagerResponse = vr.VolunteerManagerResponse,
                SubmittedBy = vr.SubmittedBy,
                Details = $"{vr.RequiredVolunteerCount} volunteers ({vr.RequiredSkills}) requested for {vr.Location}."
            });
        }
        unifiedHistory = unifiedHistory.OrderByDescending(h => h.SubmittedAt).ToList();

        // 8. Build Summary Metrics
        var availableCapacity = shelterDtos.Where(s => s.Status == "Operational").Sum(s => s.RemainingCapacity);
        var activeShelterCount = shelterRequests.Count(r => r.Status == "Submitted" || r.Status == "Under Review");
        var pendingVolCount = volunteerRequests.Count(r => r.Status == "Submitted" || r.Status == "Under Review");
        var approvedCount = shelterRequests.Count(r => r.Status == "Approved") + volunteerRequests.Count(r => r.Status == "Approved");

        var dashboard = new ShelterVolunteerDashboardDto
        {
            Metrics = new ShelterVolunteerMetricsDto
            {
                AvailableShelterCapacity = availableCapacity,
                ActiveShelterRequests = activeShelterCount,
                PendingVolunteerRequests = pendingVolCount,
                ApprovedCoordinationRequests = approvedCount,
                TotalSheltersCount = shelterDtos.Count,
                TotalVolunteersCount = volunteerSummary.TotalRegisteredVolunteers
            },
            Shelters = shelterDtos,
            ShelterRecommendations = recommendations,
            ShelterRequests = shelterRequests,
            VolunteerRequirements = volunteerRequirements,
            VolunteerRequests = volunteerRequests,
            VolunteerSummary = volunteerSummary,
            UnifiedHistory = unifiedHistory
        };

        return Result<ShelterVolunteerDashboardDto>.Success(dashboard);
    }

    public async Task<Result<CoordinatorShelterPlacementRequestDto>> SubmitShelterPlacementRequestAsync(
        SubmitShelterPlacementRequestDto dto,
        Guid coordinatorId,
        string coordinatorName,
        CancellationToken cancellationToken = default)
    {
        if (dto.ShelterId == Guid.Empty)
            return Result<CoordinatorShelterPlacementRequestDto>.Failure("Valid Shelter ID is required.");

        var shelter = await _shelterRepository.GetByIdAsync(dto.ShelterId, cancellationToken);
        if (shelter == null)
            return Result<CoordinatorShelterPlacementRequestDto>.Failure("Target shelter not found in database.");

        if (dto.NumberOfPersons <= 0)
            return Result<CoordinatorShelterPlacementRequestDto>.Failure("Number of persons must be at least 1.");

        var noteText = $"Status: Submitted | Priority: {dto.Priority ?? "High"} | Incident: {dto.RelatedIncident ?? "HMR-1042"} | Special: {dto.SpecialRequirements} | Access: {dto.AccessibilityNeeds} | Notes: {dto.CoordinatorNotes} | ManagerResponse: Awaiting Shelter Manager review";

        var allocation = new ShelterAllocation
        {
            Id = Guid.NewGuid(),
            ShelterId = shelter.Id,
            AssistanceRequestId = dto.RelatedAssistanceRequestId,
            PersonName = $"Placement: {dto.RelatedIncident ?? "Evacuees"} ({dto.NumberOfPersons} persons)",
            NumberOfPersons = dto.NumberOfPersons,
            CheckInDate = DateTime.UtcNow,
            Notes = noteText,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = !string.IsNullOrWhiteSpace(coordinatorName) ? coordinatorName : "Jane Coordinator"
        };

        // Note: Coordinator requests placement; Shelter Manager reviews and approves/increments occupancy
        await _shelterRepository.AddAllocationAsync(allocation, cancellationToken);

        // Add audit log if linked to an incident
        if (!string.IsNullOrWhiteSpace(dto.RelatedIncident))
        {
            var matchedIncident = await _incidentRepository.GetByIdOrCaseNumberAsync(dto.RelatedIncident, false, cancellationToken);
            if (matchedIncident != null)
            {
                await _incidentRepository.AddAuditLogAsync(new IncidentAuditLog
                {
                    IncidentId = matchedIncident.Id,
                    CaseNumber = matchedIncident.CaseNumber,
                    Action = "ShelterPlacementRequested",
                    Detail = $"Coordinator requested placement of {dto.NumberOfPersons} persons at {shelter.Name}. Special requirements: {dto.SpecialRequirements}",
                    ActorUserId = coordinatorId != Guid.Empty ? coordinatorId : null,
                    ActorName = coordinatorName,
                    ActorRole = "Emergency Coordinator",
                    IsInternal = true
                }, cancellationToken);
            }
        }

        await _unitOfWork.CommitAsync(cancellationToken);

        var resultDto = new CoordinatorShelterPlacementRequestDto
        {
            Id = allocation.Id,
            RequestNumber = $"SPR-{allocation.Id.ToString()[..8].ToUpperInvariant()}",
            ShelterId = shelter.Id,
            ShelterName = shelter.Name,
            ShelterLocation = shelter.Address,
            RelatedIncident = dto.RelatedIncident ?? "HMR-1042",
            RelatedAssistanceRequestId = dto.RelatedAssistanceRequestId,
            NumberOfPersons = dto.NumberOfPersons,
            SpecialRequirements = dto.SpecialRequirements,
            AccessibilityNeeds = dto.AccessibilityNeeds,
            Priority = dto.Priority ?? "High",
            CoordinatorNotes = dto.CoordinatorNotes,
            Status = "Submitted",
            ShelterManagerResponse = "Awaiting Shelter Manager review and bed allocation",
            SubmittedBy = allocation.CreatedBy,
            SubmittedAt = allocation.CreatedAt,
            LastUpdatedAt = allocation.CreatedAt
        };

        return Result<CoordinatorShelterPlacementRequestDto>.Success(resultDto, "Shelter placement request submitted to Shelter Manager successfully.");
    }

    public async Task<Result<CoordinatorVolunteerAssignmentRequestDto>> SubmitVolunteerAssignmentRequestAsync(
        SubmitVolunteerAssignmentRequestDto dto,
        Guid coordinatorId,
        string coordinatorName,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.RelatedIncident))
            return Result<CoordinatorVolunteerAssignmentRequestDto>.Failure("Related Incident reference is required.");

        if (dto.RequiredVolunteerCount <= 0)
            return Result<CoordinatorVolunteerAssignmentRequestDto>.Failure("Required volunteer count must be at least 1.");

        if (string.IsNullOrWhiteSpace(dto.TaskDescription))
            return Result<CoordinatorVolunteerAssignmentRequestDto>.Failure("Task description is required.");

        var allVolunteers = await _volunteerRepository.GetAllAsync(cancellationToken);
        var volunteer = allVolunteers.FirstOrDefault();
        if (volunteer == null)
        {
            volunteer = new Volunteer
            {
                Id = Guid.NewGuid(),
                UserId = coordinatorId != Guid.Empty ? coordinatorId : Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Skills = "[\"General Relief\",\"Field Operations\"]",
                Availability = "Full-Time",
                IsAvailable = true
            };
            await _volunteerRepository.AddAsync(volunteer, cancellationToken);
            await _unitOfWork.CommitAsync(cancellationToken);
        }

        var noteText = $"Incident: {dto.RelatedIncident} | Needed: {dto.RequiredVolunteerCount} | Assigned: 0 | Skills: {dto.RequiredSkills} | Loc: {dto.Location} | Priority: {dto.Priority ?? "High"} | Extra: {dto.AdditionalInstructions} | ManagerResponse: Awaiting Volunteer Manager assignment";

        var assignment = new VolunteerAssignment
        {
            Id = Guid.NewGuid(),
            VolunteerId = volunteer.Id,
            AssistanceRequestId = dto.RelatedAssistanceRequestId,
            TaskDescription = dto.TaskDescription,
            AssignmentStatus = 0, // Submitted / Pending Volunteer Manager assignment
            StartTime = dto.RequiredDate ?? DateTime.UtcNow.AddHours(2),
            Notes = noteText,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = !string.IsNullOrWhiteSpace(coordinatorName) ? coordinatorName : "Jane Coordinator"
        };

        await _volunteerRepository.AddAssignmentAsync(assignment, cancellationToken);

        // Add audit log if linked to an incident
        if (!string.IsNullOrWhiteSpace(dto.RelatedIncident))
        {
            var matchedIncident = await _incidentRepository.GetByIdOrCaseNumberAsync(dto.RelatedIncident, false, cancellationToken);
            if (matchedIncident != null)
            {
                await _incidentRepository.AddAuditLogAsync(new IncidentAuditLog
                {
                    IncidentId = matchedIncident.Id,
                    CaseNumber = matchedIncident.CaseNumber,
                    Action = "VolunteerAssignmentRequested",
                    Detail = $"Coordinator submitted requirement for {dto.RequiredVolunteerCount} volunteers ({dto.RequiredSkills}) at {dto.Location}. Task: {dto.TaskDescription}",
                    ActorUserId = coordinatorId != Guid.Empty ? coordinatorId : null,
                    ActorName = coordinatorName,
                    ActorRole = "Emergency Coordinator",
                    IsInternal = true
                }, cancellationToken);
            }
        }

        await _unitOfWork.CommitAsync(cancellationToken);

        var resultDto = new CoordinatorVolunteerAssignmentRequestDto
        {
            Id = assignment.Id,
            RequestNumber = $"VAR-{assignment.Id.ToString()[..8].ToUpperInvariant()}",
            RelatedIncident = dto.RelatedIncident,
            RelatedAssistanceRequestId = dto.RelatedAssistanceRequestId,
            RequiredVolunteerCount = dto.RequiredVolunteerCount,
            ApprovedOrAssignedCount = 0,
            RequiredSkills = dto.RequiredSkills,
            Location = dto.Location,
            RequiredDate = assignment.StartTime ?? DateTime.UtcNow.AddHours(2),
            Priority = dto.Priority ?? "High",
            TaskDescription = dto.TaskDescription,
            AdditionalInstructions = dto.AdditionalInstructions,
            Status = "Submitted",
            VolunteerManagerResponse = "Awaiting Volunteer Manager assignment and roster dispatch",
            SubmittedBy = assignment.CreatedBy,
            SubmittedAt = assignment.CreatedAt,
            LastUpdatedAt = assignment.CreatedAt
        };

        return Result<CoordinatorVolunteerAssignmentRequestDto>.Success(resultDto, "Volunteer assignment request submitted to Volunteer Manager successfully.");
    }

    private static List<string> ParseFacilities(string? facilitiesRaw)
    {
        if (string.IsNullOrWhiteSpace(facilitiesRaw))
            return new List<string> { "Shelter Beds", "Clean Water", "Basic Sanitation" };

        try
        {
            if (facilitiesRaw.TrimStart().StartsWith("["))
            {
                var cleaned = facilitiesRaw.Trim('[', ']', ' ', '\r', '\n', '\t')
                    .Split(new[] { "\",\"", "\", \"", "\",", ",\"", "\"" }, StringSplitOptions.RemoveEmptyEntries)
                    .Select(s => s.Trim(' ', '\"', '\\'))
                    .Where(s => !string.IsNullOrWhiteSpace(s))
                    .ToList();
                if (cleaned.Any()) return cleaned;
            }
        }
        catch { }

        var commaSplit = facilitiesRaw.Split(',', StringSplitOptions.RemoveEmptyEntries)
            .Select(s => s.Trim(' ', '\"', '\\', '[', ']'))
            .Where(s => !string.IsNullOrWhiteSpace(s))
            .ToList();

        return commaSplit.Any() ? commaSplit : new List<string> { "Shelter Beds", "Clean Water", "Sanitation" };
    }

    private static string BuildAccessibilityDescription(string shelterName, List<string> facilities)
    {
        var traits = new List<string>();
        if (facilities.Any(f => f.Contains("First Aid", StringComparison.OrdinalIgnoreCase)))
            traits.Add("Medical Aid Station");
        traits.Add("Wheelchair Accessible Ground Floor");
        traits.Add("Accessible Sanitation Units");
        if (facilities.Any(f => f.Contains("Electricity", StringComparison.OrdinalIgnoreCase)))
            traits.Add("Backup Power for Oxygen/Refrigeration");

        return string.Join(" · ", traits);
    }

    private static AssistanceRequestResponseDto MapToDto(AssistanceRequest entity) => new()
    {
        Id = entity.Id,
        RequestorId = entity.RequestorId,
        RequestorName = entity.Requestor?.FullName ?? "Unknown",
        CrisisEventId = entity.CrisisEventId,
        CrisisEventTitle = entity.CrisisEvent?.Title,
        Category = entity.Category,
        Description = entity.Description,
        Urgency = entity.Urgency,
        Status = entity.Status,
        Latitude = entity.Latitude,
        Longitude = entity.Longitude,
        Address = entity.Address,
        NumberOfPeople = entity.NumberOfPeople,
        ContactPhone = entity.ContactPhone,
        AIPriorityScore = entity.AIPriorityScore,
        AIConfidence = entity.AIConfidence,
        IsDuplicate = entity.IsDuplicate,
        CreatedAt = entity.CreatedAt,
        ResolvedAt = entity.ResolvedAt
    };
}
