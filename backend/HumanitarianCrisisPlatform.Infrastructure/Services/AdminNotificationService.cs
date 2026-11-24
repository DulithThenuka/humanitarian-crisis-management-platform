using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using HumanitarianCrisisPlatform.Application.DTOs.Admin;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;
using HumanitarianCrisisPlatform.Domain.Entities;
using HumanitarianCrisisPlatform.Domain.Enums;
using HumanitarianCrisisPlatform.Infrastructure.Data.Context;

namespace HumanitarianCrisisPlatform.Infrastructure.Services;

public class AdminNotificationService : IAdminNotificationService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<AdminNotificationService> _logger;
    private readonly string _storageFilePath;
    private readonly SemaphoreSlim _lock = new(1, 1);
    private List<AdminNotificationDto>? _cache;

    public AdminNotificationService(IServiceScopeFactory scopeFactory, ILogger<AdminNotificationService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
        
        var baseDir = AppDomain.CurrentDomain.BaseDirectory;
        var dataDir = Path.Combine(baseDir, "Data");
        if (!Directory.Exists(dataDir))
        {
            try { Directory.CreateDirectory(dataDir); } catch { /* ignore */ }
        }
        _storageFilePath = Path.Combine(Directory.Exists(dataDir) ? dataDir : baseDir, "admin_notifications.json");
    }

    private async Task EnsureLoadedAsync(CancellationToken cancellationToken)
    {
        if (_cache != null) return;

        await _lock.WaitAsync(cancellationToken);
        try
        {
            if (_cache != null) return;

            if (File.Exists(_storageFilePath))
            {
                try
                {
                    var json = await File.ReadAllTextAsync(_storageFilePath, cancellationToken);
                    _cache = JsonSerializer.Deserialize<List<AdminNotificationDto>>(json, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    }) ?? new List<AdminNotificationDto>();
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to deserialize admin notifications file, recreating cache.");
                    _cache = new List<AdminNotificationDto>();
                }
            }
            else
            {
                _cache = new List<AdminNotificationDto>();

                // Seed initial notifications from existing Citizen / Volunteer users in the database
                try
                {
                    using var scope = _scopeFactory.CreateScope();
                    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                    var recentUsers = await db.Users
                        .AsNoTracking()
                        .Where(u => u.Role == UserRole.Citizen || u.Role == UserRole.Volunteer)
                        .OrderByDescending(u => u.CreatedAt)
                        .Take(10)
                        .ToListAsync(cancellationToken);

                    foreach (var u in recentUsers)
                    {
                        var isVol = u.Role == UserRole.Volunteer;
                        _cache.Add(new AdminNotificationDto
                        {
                            Id = Guid.NewGuid(),
                            Title = isVol ? $"New Volunteer Registration – {u.FullName}" : $"New Citizen Registration – {u.FullName}",
                            Message = isVol
                                ? $"Field volunteer {u.FullName} ({u.Email}) registered on the crisis portal."
                                : $"Displaced citizen {u.FullName} ({u.Email}) registered for emergency assistance.",
                            Type = isVol ? "VolunteerRegistration" : "CitizenRegistration",
                            UserId = u.Id,
                            UserName = u.FullName,
                            UserEmail = u.Email,
                            PhoneNumber = u.PhoneNumber,
                            Role = u.Role.ToString(),
                            CreatedAt = u.CreatedAt,
                            IsRead = false,
                            Priority = isVol ? "High" : "Normal"
                        });
                    }

                    await SaveToFileUnsafeAsync(cancellationToken);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Could not initialize notifications from database users.");
                }
            }
        }
        finally
        {
            _lock.Release();
        }
    }

    private async Task SaveToFileUnsafeAsync(CancellationToken cancellationToken)
    {
        if (_cache == null) return;
        try
        {
            var json = JsonSerializer.Serialize(_cache, new JsonSerializerOptions { WriteIndented = true });
            await File.WriteAllTextAsync(_storageFilePath, json, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to persist admin notifications to file: {Path}", _storageFilePath);
        }
    }

    public async Task<IReadOnlyList<AdminNotificationDto>> GetNotificationsAsync(CancellationToken cancellationToken = default)
    {
        await EnsureLoadedAsync(cancellationToken);
        await _lock.WaitAsync(cancellationToken);
        try
        {
            return _cache!.OrderByDescending(n => n.CreatedAt).ToList();
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<int> GetUnreadCountAsync(CancellationToken cancellationToken = default)
    {
        await EnsureLoadedAsync(cancellationToken);
        await _lock.WaitAsync(cancellationToken);
        try
        {
            return _cache!.Count(n => !n.IsRead);
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<AdminNotificationDto> AddRegistrationNotificationAsync(User user, CancellationToken cancellationToken = default)
    {
        await EnsureLoadedAsync(cancellationToken);
        await _lock.WaitAsync(cancellationToken);
        try
        {
            var isVolunteer = user.Role == UserRole.Volunteer;
            var notification = new AdminNotificationDto
            {
                Id = Guid.NewGuid(),
                Title = isVolunteer ? $"New Volunteer Registration – {user.FullName}" : $"New Citizen Registration – {user.FullName}",
                Message = isVolunteer 
                    ? $"Field volunteer {user.FullName} ({user.Email}) registered. Awaiting operational verification."
                    : $"Displaced citizen {user.FullName} ({user.Email}) registered on the emergency intake portal.",
                Type = isVolunteer ? "VolunteerRegistration" : "CitizenRegistration",
                UserId = user.Id,
                UserName = user.FullName,
                UserEmail = user.Email,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role.ToString(),
                CreatedAt = DateTime.UtcNow,
                IsRead = false,
                Priority = isVolunteer ? "High" : "Normal"
            };

            // Prevent duplicate notification for identical User and Type
            var existing = _cache!.FirstOrDefault(n => n.UserId == user.Id && n.Type == notification.Type);
            if (existing != null)
            {
                existing.CreatedAt = DateTime.UtcNow;
                existing.IsRead = false;
                await SaveToFileUnsafeAsync(cancellationToken);
                return existing;
            }

            _cache!.Insert(0, notification);
            await SaveToFileUnsafeAsync(cancellationToken);
            return notification;
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<bool> MarkAsReadAsync(Guid notificationId, CancellationToken cancellationToken = default)
    {
        await EnsureLoadedAsync(cancellationToken);
        await _lock.WaitAsync(cancellationToken);
        try
        {
            var notification = _cache!.FirstOrDefault(n => n.Id == notificationId);
            if (notification != null)
            {
                notification.IsRead = true;
                await SaveToFileUnsafeAsync(cancellationToken);
                return true;
            }
            return false;
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<bool> MarkAllAsReadAsync(CancellationToken cancellationToken = default)
    {
        await EnsureLoadedAsync(cancellationToken);
        await _lock.WaitAsync(cancellationToken);
        try
        {
            foreach (var n in _cache!)
            {
                n.IsRead = true;
            }
            await SaveToFileUnsafeAsync(cancellationToken);
            return true;
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<AdminRegistrationDetailsDto?> GetRegistrationDetailsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        using var scope = _scopeFactory.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        var user = await context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        if (user == null) return null;

        var isVol = user.Role == UserRole.Volunteer;
        Volunteer? volProfile = null;
        if (isVol)
        {
            volProfile = await context.Volunteers
                .AsNoTracking()
                .FirstOrDefaultAsync(v => v.UserId == userId, cancellationToken);
        }

        return new AdminRegistrationDetailsDto
        {
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Role = user.Role.ToString(),
            RegistrationDate = user.CreatedAt,
            AccountStatus = user.IsActive ? "Active" : "Deactivated",
            VerificationStatus = isVol 
                ? (volProfile != null && volProfile.IsAvailable ? "Verified & Ready" : "Pending Verification") 
                : "Active Citizen",
            Location = user.AssignedDistrict ?? "Western Province",
            IsVolunteer = isVol,
            VolunteerId = volProfile?.Id,
            Skills = volProfile?.Skills ?? (isVol ? "First Aid, Logistics, Search & Rescue" : null),
            Availability = volProfile?.Availability ?? (isVol ? "Immediate / On-Call" : null),
            MaxTravelDistance = volProfile?.MaxTravelDistance ?? (isVol ? 25 : null)
        };
    }

    public async Task<bool> VerifyVolunteerAsync(Guid userId, string verifiedBy, string? notes, CancellationToken cancellationToken = default)
    {
        using var scope = _scopeFactory.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        var volunteer = await context.Volunteers
            .FirstOrDefaultAsync(v => v.UserId == userId, cancellationToken);

        if (volunteer == null)
        {
            // If volunteer entity wasn't created yet, create it
            var user = await context.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
            if (user == null || user.Role != UserRole.Volunteer) return false;

            volunteer = new Volunteer
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Skills = "First Aid, Community Logistics, Emergency Search",
                Availability = "Immediate",
                IsAvailable = true,
                MaxTravelDistance = 25
            };
            context.Volunteers.Add(volunteer);
        }
        else
        {
            volunteer.IsAvailable = true;
            volunteer.UpdatedAt = DateTime.UtcNow;
            volunteer.LastModifiedBy = verifiedBy;
        }

        await context.SaveChangesAsync(cancellationToken);

        // Also mark any notification for this volunteer as read
        await EnsureLoadedAsync(cancellationToken);
        await _lock.WaitAsync(cancellationToken);
        try
        {
            var notif = _cache!.FirstOrDefault(n => n.UserId == userId);
            if (notif != null)
            {
                notif.IsRead = true;
                await SaveToFileUnsafeAsync(cancellationToken);
            }
        }
        finally
        {
            _lock.Release();
        }

        return true;
    }
}
