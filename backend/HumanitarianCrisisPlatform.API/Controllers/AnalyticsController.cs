using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Domain.Enums;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;

namespace HumanitarianCrisisPlatform.API.Controllers;

[Authorize(Roles = "Coordinator,LogisticsManager,Admin")]
public class AnalyticsController : BaseApiController
{
    private readonly ApplicationDbContext _context;

    public AnalyticsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("operational-kpis")]
    public async Task<ActionResult<Result<object>>> GetOperationalKpis()
    {
        var totalRequests = await _context.AssistanceRequests.CountAsync();
        var pendingRequests = await _context.AssistanceRequests.CountAsync(r => r.Status == RequestStatus.Submitted);
        var inProgressRequests = await _context.AssistanceRequests.CountAsync(r => r.Status == RequestStatus.InProgress);
        var resolvedRequests = await _context.AssistanceRequests.CountAsync(r => r.Status == RequestStatus.Resolved);

        var totalShelters = await _context.Shelters.CountAsync();
        var totalCapacity = await _context.Shelters.SumAsync(s => s.TotalCapacity);
        var currentOccupancy = await _context.Shelters.SumAsync(s => s.CurrentOccupancy);

        var lowStockCount = await _context.Resources.CountAsync(r => (r.TotalQuantity - r.AllocatedQuantity) <= r.MinimumThreshold);
        var availableVolunteers = await _context.Volunteers.CountAsync(v => v.IsAvailable);

        var kpis = new
        {
            TotalRequests = totalRequests,
            PendingRequests = pendingRequests,
            InProgressRequests = inProgressRequests,
            ResolvedRequests = resolvedRequests,
            ShelterUtilizationRate = totalCapacity > 0 ? (double)currentOccupancy / totalCapacity * 100 : 0,
            TotalShelterCapacity = totalCapacity,
            CurrentShelterOccupancy = currentOccupancy,
            LowStockResources = lowStockCount,
            AvailableVolunteers = availableVolunteers
        };

        return Ok(Result<object>.Success(kpis));
    }
}
