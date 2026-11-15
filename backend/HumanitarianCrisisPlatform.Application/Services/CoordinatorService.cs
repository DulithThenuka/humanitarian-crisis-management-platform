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
    private readonly IRepository<Volunteer> _volunteerRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CoordinatorService(
        IAssistanceRequestRepository requestRepository,
        IIncidentRepository incidentRepository,
        IShelterRepository shelterRepository,
        IResourceRepository resourceRepository,
        IAIDecisionAuditRepository aiAuditRepository,
        IRepository<CrisisEvent> crisisRepository,
        IRepository<Volunteer> volunteerRepository,
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
            .Select(c =>
            {
                var isCritical = c.Severity >= 4;
                var isHigh = c.Severity == 3;
                var severityLabel = isCritical ? "Critical" : isHigh ? "High" : "Moderate";
                var severityClass = isCritical ? "pill-critical" : isHigh ? "pill-high" : "pill-moderate";

                var desc = c.Description ?? string.Empty;
                var area = "Western Province";
                var category = $"{c.DisasterType} warning";
                var message = desc;
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

                if (messageLines.Count > 0)
                {
                    message = string.Join("\n", messageLines);
                }

                if (instructions.Count == 0)
                {
                    instructions = new List<string>
                    {
                        "Follow official evacuation route signage.",
                        "Move vital medicines, dry rations and identity documents to high ground.",
                        "Do not attempt to walk or drive through flowing water."
                    };
                }

                var isDraft = !c.IsActive && c.EndDate == null;
                var isResolved = !c.IsActive && c.EndDate != null;

                return new EmergencyAlertDto
                {
                    Id = $"ALT-{c.Id.ToString()[..6].ToUpperInvariant()}",
                    SourceCrisisEventId = c.Id,
                    Title = c.Title,
                    Category = category,
                    Severity = severityLabel,
                    SeverityClass = severityClass,
                    Area = !string.IsNullOrWhiteSpace(area) ? area : (c.Latitude.HasValue ? $"Sector Lat {c.Latitude:F2}, Lon {c.Longitude:F2}" : "Western Province"),
                    Publication = isDraft ? "Draft" : (isResolved ? "Resolved" : "Published"),
                    Tab = isDraft ? "drafts" : (isResolved ? "resolved" : "active"),
                    CreatedBy = c.CreatedBy ?? "Emergency Coordinator",
                    LastUpdated = c.UpdatedAt?.ToString("g") ?? c.CreatedAt.ToString("g"),
                    StartTime = c.StartDate.ToString("g"),
                    ExpiryTime = c.EndDate?.ToString("g") ?? "Until further notice",
                    Message = message,
                    SafetyInstructions = instructions
                };
            }).ToList();

        if (!string.IsNullOrWhiteSpace(tab) && !tab.Equals("all", StringComparison.OrdinalIgnoreCase))
        {
            alerts = alerts.Where(a => a.Tab.Equals(tab, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        return Result<IReadOnlyList<EmergencyAlertDto>>.Success(alerts);
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
                          dto.Severity.Equals("High", StringComparison.OrdinalIgnoreCase) ? 3 : 2;

        List<string> safetyList = new();
        if (dto.SafetyInstructions != null)
        {
            if (dto.SafetyInstructions is System.Text.Json.JsonElement jsonElem)
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
            else if (dto.SafetyInstructions is IEnumerable<string> stringEnumerable)
            {
                safetyList.AddRange(stringEnumerable.Where(x => !string.IsNullOrWhiteSpace(x)).Select(x => x.Trim()));
            }
            else
            {
                var s = dto.SafetyInstructions.ToString();
                if (!string.IsNullOrWhiteSpace(s))
                {
                    safetyList.AddRange(s.Split('\n', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries));
                }
            }
        }

        var fullDescription = dto.Message.Trim();
        if (!string.IsNullOrWhiteSpace(dto.Area))
        {
            fullDescription = $"Area: {dto.Area.Trim()}\n{fullDescription}";
        }
        if (!string.IsNullOrWhiteSpace(dto.Category))
        {
            fullDescription = $"Category: {dto.Category.Trim()}\n{fullDescription}";
        }
        if (safetyList.Count > 0)
        {
            fullDescription += $"\n\nSafety Instructions:\n{string.Join("\n", safetyList)}";
        }

        var crisisEvent = new CrisisEvent
        {
            Title = dto.Title.Trim(),
            Description = fullDescription,
            DisasterType = DisasterType.Flood,
            Severity = severityInt,
            IsActive = !dto.IsDraft,
            StartDate = DateTime.UtcNow,
            EndDate = dto.IsDraft ? null : (DateTime?)null,
            CreatedBy = coordinatorName,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _crisisRepository.AddAsync(crisisEvent, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        var alert = new EmergencyAlertDto
        {
            Id = $"ALT-{created.Id.ToString()[..6].ToUpperInvariant()}",
            SourceCrisisEventId = created.Id,
            Title = created.Title,
            Category = dto.Category,
            Severity = dto.Severity,
            SeverityClass = dto.Severity.Equals("Critical", StringComparison.OrdinalIgnoreCase) ? "pill-critical" : "pill-high",
            Area = dto.Area,
            Publication = dto.IsDraft ? "Draft" : "Published",
            Tab = dto.IsDraft ? "drafts" : "active",
            CreatedBy = coordinatorName,
            LastUpdated = "Just now",
            StartTime = dto.StartTime ?? DateTime.UtcNow.ToString("g"),
            ExpiryTime = dto.ExpiryTime ?? "Until further notice",
            Message = dto.Message,
            SafetyInstructions = safetyList.Count > 0
                ? safetyList
                : new List<string> { "Follow instructions from authorized relief personnel." }
        };

        return Result<EmergencyAlertDto>.Success(alert, dto.IsDraft ? "Emergency alert draft saved successfully." : "Emergency alert broadcast published successfully.");
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
