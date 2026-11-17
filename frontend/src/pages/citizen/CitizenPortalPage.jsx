import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CitizenSidebar } from './components/CitizenSidebar';
import { CitizenHeader } from './components/CitizenHeader';
import { CitizenDashboardView } from './views/CitizenDashboardView';
import { SubmitAssistanceView } from './views/SubmitAssistanceView';
import { MyRequestsView } from './views/MyRequestsView';
import { EmergencyAlertsView } from './views/EmergencyAlertsView';
import { FindSheltersView } from './views/FindSheltersView';
import { NotificationsView } from './views/NotificationsView';
import { AIAssistanceView } from './views/AIAssistanceView';
import { CitizenProfileView } from './views/CitizenProfileView';
import { HelpSupportView } from './views/HelpSupportView';
import { CheckCircle2 } from 'lucide-react';
import './CitizenPortalStyles.css';

export const CitizenPortalPage = ({ initialTab = 'dashboard' }) => {
  const location = useLocation();

  const getMappedTab = (tabOrPath) => {
    const p = (tabOrPath || '').toLowerCase();
    if (p.includes('submit') || p.includes('request') && !p.includes('requests')) return 'submit';
    if (p.includes('my-request') || p.includes('track') || p.includes('requests')) return 'requests';
    if (p.includes('alert')) return 'alerts';
    if (p.includes('shelter')) return 'shelters';
    if (p.includes('notif')) return 'notifications';
    if (p.includes('ai') || p.includes('assistant')) return 'ai-assistance';
    if (p.includes('profile')) return 'profile';
    if (p.includes('support') || p.includes('help')) return 'support';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(() => getMappedTab(initialTab || location.pathname));
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (initialTab && initialTab !== 'home' && initialTab !== 'dashboard') {
      setActiveTab(getMappedTab(initialTab));
    } else if (location.pathname) {
      setActiveTab(getMappedTab(location.pathname));
    }
  }, [initialTab, location.pathname]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((cur) => (cur === message ? null : cur));
    }, 3500);
  };

  return (
    <div className="cp-portal-container">
      {/* Deep Pine Green Citizen Sidebar */}
      <CitizenSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Content Area */}
      <div className="cp-main-content">
        {/* Header */}
        <CitizenHeader
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          showToast={showToast}
        />

        {/* View Workspace Canvas */}
        <main className="cp-workspace">
          {activeTab === 'dashboard' && (
            <CitizenDashboardView
              onSelectTab={setActiveTab}
              showToast={showToast}
            />
          )}

          {activeTab === 'submit' && (
            <SubmitAssistanceView
              onSelectTab={setActiveTab}
              showToast={showToast}
            />
          )}

          {activeTab === 'requests' && (
            <MyRequestsView
              onSelectTab={setActiveTab}
              showToast={showToast}
            />
          )}

          {activeTab === 'alerts' && (
            <EmergencyAlertsView
              showToast={showToast}
            />
          )}

          {activeTab === 'shelters' && (
            <FindSheltersView
              showToast={showToast}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsView
              onSelectTab={setActiveTab}
              showToast={showToast}
            />
          )}

          {activeTab === 'ai-assistance' && (
            <AIAssistanceView
              onSelectTab={setActiveTab}
              showToast={showToast}
            />
          )}

          {activeTab === 'profile' && (
            <CitizenProfileView
              showToast={showToast}
            />
          )}

          {activeTab === 'support' && (
            <HelpSupportView
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="cp-toast">
          <CheckCircle2 size={18} style={{ color: '#059669' }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default CitizenPortalPage;
