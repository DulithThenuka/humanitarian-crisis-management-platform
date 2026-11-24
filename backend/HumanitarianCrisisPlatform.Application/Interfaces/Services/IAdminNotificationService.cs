using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using HumanitarianCrisisPlatform.Application.DTOs.Admin;
using HumanitarianCrisisPlatform.Domain.Entities;

namespace HumanitarianCrisisPlatform.Application.Interfaces.Services;

public interface IAdminNotificationService
{
    Task<IReadOnlyList<AdminNotificationDto>> GetNotificationsAsync(CancellationToken cancellationToken = default);
    Task<int> GetUnreadCountAsync(CancellationToken cancellationToken = default);
    Task<AdminNotificationDto> AddRegistrationNotificationAsync(User user, CancellationToken cancellationToken = default);
    Task<bool> MarkAsReadAsync(Guid notificationId, CancellationToken cancellationToken = default);
    Task<bool> MarkAllAsReadAsync(CancellationToken cancellationToken = default);
    Task<AdminRegistrationDetailsDto?> GetRegistrationDetailsAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<bool> VerifyVolunteerAsync(Guid userId, string verifiedBy, string? notes, CancellationToken cancellationToken = default);
}
