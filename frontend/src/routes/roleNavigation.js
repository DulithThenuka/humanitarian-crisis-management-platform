// ============================================================================
// RELIEFCORE / HumanAid - Role-Based Access Control & Navigation State Utilities
// ============================================================================

export const ROLE_CONFIG = {
  Citizen: {
    title: 'Citizen / Affected Person',
    badge: 'CITIZEN PORTAL',
    defaultEmail: 'citizen@humanaid.org',
    targetRoute: '/citizen',
    aliases: ['citizen', '0']
  },
  Coordinator: {
    title: 'Emergency Coordinator',
    badge: 'COMMAND CENTER',
    defaultEmail: 'coordinator@reliefcore.lk',
    targetRoute: '/coordinator',
    aliases: ['coordinator', '1']
  },
  CaseManager: {
    title: 'Incident / Case Manager',
    badge: 'CASE MANAGEMENT',
    defaultEmail: 'incident@reliefcore.lk',
    targetRoute: '/incident-manager',
    aliases: ['casemanager', 'incidentmanager', 'incident-manager', 'case manager', 'incident', '5']
  },
  LogisticsManager: {
    title: 'Resource & Logistics Manager',
    badge: 'SUPPLY CHAIN',
    defaultEmail: 'resource@reliefcore.lk',
    targetRoute: '/logistics/overview',
    aliases: ['logisticsmanager', 'resourcemanager', 'logistics', 'resource', '2']
  },
  ShelterManager: {
    title: 'Shelter Administrator',
    badge: 'SHELTER NETWORK',
    defaultEmail: 'shelter@reliefcore.lk',
    targetRoute: '/shelter',
    aliases: ['sheltermanager', 'shelteradmin', 'shelteradministrator', 'shelter', '6']
  },
  Volunteer: {
    title: 'Field Volunteer',
    badge: 'VOLUNTEER CORPS',
    defaultEmail: 'volunteer@reliefcore.org',
    targetRoute: '/volunteer',
    aliases: ['volunteer', '3']
  },
  VolunteerCoordinator: {
    title: 'Volunteer Coordinator',
    badge: 'WORKFORCE OPS',
    defaultEmail: 'volunteermanager@reliefcore.lk',
    targetRoute: '/volunteer-coordinator',
    aliases: ['volunteercoordinator', 'volunteermanager', 'volunteer coordinator', 'volunteer manager', '7']
  },
  DonorOfficer: {
    title: 'Donor / Funding Officer',
    badge: 'CAPITAL & GRANTS',
    defaultEmail: 'donations@reliefcore.lk',
    targetRoute: '/donor',
    aliases: ['donorofficer', 'donor', 'funding', '8']
  },
  PartnerOfficer: {
    title: 'Partner Organisation Officer',
    badge: 'NGO & AGENCY ALLIANCE',
    defaultEmail: 'partners@reliefcore.lk',
    targetRoute: '/partner-organisation-officer',
    aliases: ['partnerofficer', 'partner', '9']
  },
  Admin: {
    title: 'System Administrator',
    badge: 'GLOBAL GOVERNANCE',
    defaultEmail: 'admin@reliefcore.lk',
    targetRoute: '/admin',
    aliases: ['admin', 'administrator', '4']
  }
};

export const getCanonicalRole = (raw) => {
  if (!raw && raw !== 0) return null;
  const str = String(raw).trim().toLowerCase();
  for (const [key, cfg] of Object.entries(ROLE_CONFIG)) {
    if (key.toLowerCase() === str) return key;
    if (cfg.aliases.some((a) => a.toLowerCase() === str)) return key;
  }
  return null;
};

export const getRoleDisplayTitle = (raw) => {
  const canon = getCanonicalRole(raw);
  if (canon && ROLE_CONFIG[canon]) return ROLE_CONFIG[canon].title;
  return typeof raw === 'string' ? raw : null;
};

export const resolveAuthorizedRoute = (role) => {
  const canon = getCanonicalRole(role);
  if (canon && ROLE_CONFIG[canon]?.targetRoute) {
    return ROLE_CONFIG[canon].targetRoute;
  }

  const normalizedRole = (role || '').toString().trim().toLowerCase();
  if (normalizedRole === 'admin' || normalizedRole === 'administrator' || normalizedRole === '4' || normalizedRole.includes('admin')) {
    return '/admin';
  }
  if (normalizedRole === 'coordinator' || normalizedRole === '1' || (normalizedRole.includes('coordinator') && !normalizedRole.includes('volunteer'))) {
    return '/coordinator';
  }
  if (normalizedRole === 'casemanager' || normalizedRole === 'incidentmanager' || normalizedRole === '5' || normalizedRole.includes('case') || normalizedRole.includes('incident')) {
    return '/incident-manager';
  }
  if (normalizedRole === 'logisticsmanager' || normalizedRole === 'resourcemanager' || normalizedRole === '2' || normalizedRole.includes('logistics') || normalizedRole.includes('resource')) {
    return '/logistics/overview';
  }
  if (normalizedRole === 'sheltermanager' || normalizedRole === 'shelteradministrator' || normalizedRole === 'shelteradmin' || normalizedRole === '6' || normalizedRole.includes('shelter')) {
    return '/shelter';
  }
  if (normalizedRole === 'volunteercoordinator' || normalizedRole === 'volunteermanager' || normalizedRole === '7' || normalizedRole.includes('volunteer coordinator') || normalizedRole.includes('volunteer manager')) {
    return '/volunteer-coordinator';
  }
  if (normalizedRole === 'donorofficer' || normalizedRole === 'donor' || normalizedRole === '8' || normalizedRole.includes('donor') || normalizedRole.includes('funding')) {
    return '/donor';
  }
  if (normalizedRole === 'partnerofficer' || normalizedRole === 'partner' || normalizedRole === '9' || normalizedRole.includes('partner')) {
    return '/partner-organisation-officer';
  }
  if (normalizedRole === 'volunteer' || normalizedRole === '3') {
    return '/volunteer';
  }
  if (normalizedRole === 'citizen' || normalizedRole === '0') {
    return '/citizen';
  }
  return '/coordinator';
};

export const isRoleAllowed = (userRole, allowedRoles) => {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  if (!userRole && userRole !== 0) return false;

  const userRoleStr = String(userRole || '').toLowerCase();
  const userRoleNormalized = userRoleStr.replace(/[\s_\/-]/g, '');

  return allowedRoles.some((role) => {
    const allowedStr = String(role || '').toLowerCase();
    const allowedNormalized = allowedStr.replace(/[\s_\/-]/g, '');

    return (
      allowedStr === userRoleStr ||
      allowedNormalized === userRoleNormalized ||
      (allowedNormalized === 'admin' && (userRoleNormalized === '4' || userRole === 4 || userRoleNormalized.includes('admin'))) ||
      (allowedNormalized === 'coordinator' && (userRoleNormalized === '1' || userRole === 1 || (userRoleNormalized.includes('coordinator') && !userRoleNormalized.includes('volunteer')))) ||
      ((allowedNormalized === 'logisticsmanager' || allowedNormalized === 'resourcemanager') &&
        (userRoleNormalized === '2' || userRole === 2 || userRoleNormalized.includes('logistics') || userRoleNormalized.includes('resource'))) ||
      (allowedNormalized === 'volunteer' && (userRoleNormalized === '3' || userRole === 3)) ||
      (allowedNormalized === 'citizen' && (userRoleNormalized === '0' || userRole === 0)) ||
      ((allowedNormalized === 'casemanager' || allowedNormalized === 'incidentmanager') &&
        (userRoleNormalized === '5' || userRole === 5 || userRoleNormalized.includes('case') || userRoleNormalized.includes('incident'))) ||
      ((allowedNormalized === 'sheltermanager' || allowedNormalized === 'shelteradmin') &&
        (userRoleNormalized === '6' || userRole === 6 || userRoleNormalized.includes('shelter'))) ||
      ((allowedNormalized === 'volunteercoordinator' || allowedNormalized === 'volunteermanager') &&
        (userRoleNormalized === '7' || userRole === 7 || userRoleNormalized.includes('volunteercoordinator') || userRoleNormalized.includes('volunteermanager'))) ||
      ((allowedNormalized === 'donorofficer' || allowedNormalized === 'donor') &&
        (userRoleNormalized === '8' || userRole === 8 || userRoleNormalized.includes('donor') || userRoleNormalized.includes('funding'))) ||
      ((allowedNormalized === 'partnerofficer' || allowedNormalized === 'partner') &&
        (userRoleNormalized === '9' || userRole === 9 || userRoleNormalized.includes('partner')))
    );
  });
};

export const ROUTE_PERMISSIONS = [
  // Admin module
  { prefix: '/admin', allowedRoles: ['Admin'] },
  { prefix: '/administration', allowedRoles: ['Admin'] },

  // Coordinator module
  { prefix: '/coordinator', allowedRoles: ['Coordinator', 'Admin'] },
  { prefix: '/emergency-coordinator', allowedRoles: ['Coordinator', 'Admin'] },
  { prefix: '/ai-operations', allowedRoles: ['Coordinator', 'Admin'] },
  { prefix: '/ai-ops', allowedRoles: ['Coordinator', 'Admin'] },
  { prefix: '/audit', allowedRoles: ['Coordinator', 'Admin'] },
  { prefix: '/reports', allowedRoles: ['Coordinator', 'Admin'] },

  // Case Manager module
  { prefix: '/incident-manager', allowedRoles: ['CaseManager', 'IncidentManager', 'Coordinator', 'Admin'] },
  { prefix: '/case-manager', allowedRoles: ['CaseManager', 'IncidentManager', 'Coordinator', 'Admin'] },
  { prefix: '/cases', allowedRoles: ['CaseManager', 'IncidentManager', 'Coordinator', 'Admin'] },

  // Logistics module
  { prefix: '/logistics', allowedRoles: ['LogisticsManager', 'ResourceManager', 'Coordinator', 'Admin'] },
  { prefix: '/resource-manager', allowedRoles: ['LogisticsManager', 'ResourceManager', 'Coordinator', 'Admin'] },
  { prefix: '/resource-portal', allowedRoles: ['LogisticsManager', 'ResourceManager', 'Coordinator', 'Admin'] },
  { prefix: '/resources', allowedRoles: ['LogisticsManager', 'ResourceManager', 'Coordinator', 'Admin'] },

  // Shelter module
  { prefix: '/shelter', allowedRoles: ['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin'] },
  { prefix: '/shelters/admin', allowedRoles: ['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin'] },
  { prefix: '/shelter-admin', allowedRoles: ['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin'] },
  { prefix: '/shelter-manager', allowedRoles: ['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin'] },

  // Volunteer Coordinator module
  { prefix: '/volunteer-coordinator', allowedRoles: ['VolunteerCoordinator', 'VolunteerManager', 'Coordinator', 'Admin'] },
  { prefix: '/volunteer-admin', allowedRoles: ['VolunteerCoordinator', 'VolunteerManager', 'Coordinator', 'Admin'] },
  { prefix: '/volunteer-manager', allowedRoles: ['VolunteerCoordinator', 'VolunteerManager', 'Coordinator', 'Admin'] },
  { prefix: '/volunteers/manager', allowedRoles: ['VolunteerCoordinator', 'VolunteerManager', 'Coordinator', 'Admin'] },

  // Volunteer module
  { prefix: '/volunteer', allowedRoles: ['Volunteer', 'VolunteerCoordinator', 'Coordinator', 'Admin'] },
  { prefix: '/volunteers', allowedRoles: ['Volunteer', 'VolunteerCoordinator', 'Coordinator', 'Admin'] },

  // Donor module
  { prefix: '/donor', allowedRoles: ['DonorOfficer', 'Donor', 'Coordinator', 'Admin'] },
  { prefix: '/donor-funding-officer', allowedRoles: ['DonorOfficer', 'Donor', 'Coordinator', 'Admin'] },
  { prefix: '/funding-officer', allowedRoles: ['DonorOfficer', 'Donor', 'Coordinator', 'Admin'] },
  { prefix: '/donations', allowedRoles: ['DonorOfficer', 'Donor', 'Coordinator', 'Admin'] },

  // Partner module
  { prefix: '/partner', allowedRoles: ['PartnerOfficer', 'Partner', 'Coordinator', 'Admin'] },
  { prefix: '/partner-organisation-officer', allowedRoles: ['PartnerOfficer', 'Partner', 'Coordinator', 'Admin'] },
  { prefix: '/partner-officer', allowedRoles: ['PartnerOfficer', 'Partner', 'Coordinator', 'Admin'] },
  { prefix: '/partners', allowedRoles: ['PartnerOfficer', 'Partner', 'Coordinator', 'Admin'] },

  // Citizen module
  { prefix: '/citizen', allowedRoles: ['Citizen', 'Admin'] },
  { prefix: '/assistance-request', allowedRoles: ['Citizen', 'Admin'] },
  { prefix: '/track', allowedRoles: ['Citizen', 'Admin'] },
  { prefix: '/my-requests', allowedRoles: ['Citizen', 'Admin'] },
  { prefix: '/alerts', allowedRoles: ['Citizen', 'Admin'] },
  { prefix: '/safety', allowedRoles: ['Citizen', 'Admin'] },
  { prefix: '/support', allowedRoles: ['Citizen', 'Admin'] },
  { prefix: '/help', allowedRoles: ['Citizen', 'Admin'] }
];

export const isRouteAllowedForRole = (userRole, rawPathname) => {
  if (!rawPathname || typeof rawPathname !== 'string') return true;
  const path = rawPathname.split('?')[0].split('#')[0].toLowerCase();

  // Public routes always allowed
  if (
    path === '/' ||
    path === '/home' ||
    path === '/landing' ||
    path === '/login' ||
    path === '/register' ||
    path === '/signup' ||
    path === '/sign-up' ||
    path === '/unauthorized' ||
    path === '/services' ||
    path === '/relief-services' ||
    path === '/assistance-services' ||
    path === '/capabilities' ||
    path === '/operations-architecture' ||
    path === '/emergency-directory' ||
    path === '/safety-protocols' ||
    path === '/map' ||
    path === '/satellite-map' ||
    path === '/bloom'
  ) {
    return true;
  }

  // Find matching protected rule (match longest prefix first)
  const matchedRule = ROUTE_PERMISSIONS
    .filter((r) => path === r.prefix || path.startsWith(r.prefix + '/'))
    .sort((a, b) => b.prefix.length - a.prefix.length)[0];

  if (!matchedRule) {
    return true;
  }

  return isRoleAllowed(userRole, matchedRule.allowedRoles);
};

// In-app session navigation counter to distinguish initial direct loads from client-side history pops
let inAppNavigationCount = 0;

export const markInAppNavigation = () => {
  inAppNavigationCount++;
};

export const hasNavigatedInSession = () => {
  return inAppNavigationCount > 0;
};
