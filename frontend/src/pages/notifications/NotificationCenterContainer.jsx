import React, { useState } from 'react';
import { NotificationCenterHub } from './NotificationCenterHub';
import { NotificationInboxView } from './NotificationInboxView';
import { ComposeNotificationView } from './ComposeNotificationView';
import { RecipientDetailDrawerView } from './RecipientDetailDrawerView';
import { DeliveryStatusView } from './DeliveryStatusView';
import { FailedNotificationHandlingView } from './FailedNotificationHandlingView';
import { NotificationDetailView } from './NotificationDetailView';
import { INITIAL_NOTIFICATIONS } from './notificationData';
import './NotificationCenter.css';

export const NotificationCenterContainer = ({ initialScreen = 'hub' }) => {
  const [currentScreen, setCurrentScreen] = useState(initialScreen);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [selectedNotification, setSelectedNotification] = useState(INITIAL_NOTIFICATIONS[0]);
  const [areaFilter, setAreaFilter] = useState('All affected areas');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const handleCreateNotification = (newNotif) => {
    setNotifications(prev => [newNotif, ...prev]);
    setSelectedNotification(newNotif);
  };

  const handleExport = () => {
    const exportData = {
      exportTimestamp: new Date().toISOString(),
      operation: 'Western Province Flood Response',
      area: areaFilter,
      totalRecords: notifications.length,
      records: notifications
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reliefcore_notifications_manifest_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Notification records exported successfully to JSON manifest', 'success');
  };

  return (
    <div className="notif-wrapper" style={{ width: '100%', minHeight: '100%' }}>
      {/* Toast Alert HUD */}
      {toast && (
        <div className={`notif-toast-hud ${toast.type}`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Screen 0: Hub Screen (Image 1) */}
      {currentScreen === 'hub' && (
        <NotificationCenterHub
          onSelectScreen={(screenId) => setCurrentScreen(screenId)}
          onExport={handleExport}
          showToast={showToast}
          areaFilter={areaFilter}
          setAreaFilter={setAreaFilter}
          operationalSummary={{
            openRecords: notifications.length,
            pendingReview: 7,
            completedToday: 14
          }}
        />
      )}

      {/* Screen 1: Notification Inbox (Image 2) */}
      {currentScreen === 'inbox' && (
        <NotificationInboxView
          notifications={notifications}
          onBackToHub={() => setCurrentScreen('hub')}
          onSelectScreen={(screenId) => setCurrentScreen(screenId)}
          onSelectNotification={(notif) => setSelectedNotification(notif)}
          onExport={handleExport}
          showToast={showToast}
        />
      )}

      {/* Screen 2: Compose Notification (Images 3 & 4) */}
      {currentScreen === 'compose' && (
        <ComposeNotificationView
          onBackToHub={() => setCurrentScreen('hub')}
          onSelectScreen={(screenId) => setCurrentScreen(screenId)}
          onCreateNotification={handleCreateNotification}
          onExport={handleExport}
          showToast={showToast}
        />
      )}

      {/* Screen 3: Recipient Detail Drawer (Image 5) */}
      {currentScreen === 'recipient-drawer' && (
        <RecipientDetailDrawerView
          notifications={notifications}
          onBackToHub={() => setCurrentScreen('hub')}
          onSelectScreen={(screenId) => setCurrentScreen(screenId)}
          onExport={handleExport}
          showToast={showToast}
        />
      )}

      {/* Screen 4: Email & SMS Delivery Status */}
      {currentScreen === 'delivery-status' && (
        <DeliveryStatusView
          onBackToHub={() => setCurrentScreen('hub')}
          onSelectScreen={(screenId) => setCurrentScreen(screenId)}
          onExport={handleExport}
          showToast={showToast}
        />
      )}

      {/* Screen 5: Failed Notification Handling */}
      {currentScreen === 'failed-handling' && (
        <FailedNotificationHandlingView
          onBackToHub={() => setCurrentScreen('hub')}
          onSelectScreen={(screenId) => setCurrentScreen(screenId)}
          onExport={handleExport}
          showToast={showToast}
        />
      )}

      {/* Screen 6: Notification Detail */}
      {currentScreen === 'detail' && (
        <NotificationDetailView
          notification={selectedNotification}
          onBackToHub={() => setCurrentScreen('hub')}
          onSelectScreen={(screenId) => setCurrentScreen(screenId)}
          onExport={handleExport}
          showToast={showToast}
        />
      )}
    </div>
  );
};
