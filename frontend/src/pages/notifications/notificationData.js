// Centralized Mock Data & State for Notification Centre

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'COM-2281',
    name: 'HMR-1042 status update',
    subtitle: 'Priority operational record',
    category: 'SMS + Push',
    channelType: 'sms-push',
    channels: ['SMS', 'Push'],
    status: 'Delivered',
    statusType: 'delivered',
    updated: '09:58',
    date: '2026-10-30',
    owner: 'Amara Jayasinghe',
    role: 'System Administrator',
    operationalArea: 'Kelani East - Zone 03',
    organisation: 'National Relief Unit',
    recipientsCount: 142,
    deliveredCount: 140,
    failedCount: 2,
    priority: 'High',
    description: 'Critical evacuation status update for residents in Kelani River Sector 3. Flood barriers holding at 84% capacity. Transport units pre-positioned at Cambridge intersection.',
    translations: {
      en: 'Critical evacuation status update for residents in Kelani River Sector 3. Transport units pre-positioned at Cambridge intersection.',
      si: 'කැලණි ගඟ කලාප 3 හි පදිංචිකරුවන් සඳහා හදිසි ඉවත් කිරීමේ තොරතුරු. කේම්බ්‍රිජ් මංසන්ධියේ ප්‍රවාහන ඒකක ස්ථානගත කර ඇත.',
      ta: 'களனி நதி வலயம் 3 குடியிருப்பாளர்களுக்கான அவசர வெளியேற்ற நிலை அறிக்கை. கேம்பிரிட்ஜ் சந்திப்பில் போக்குவரத்து வாகனங்கள் நிலைநிறுத்தப்பட்டுள்ளன.'
    },
    sha256: '0x9d4a881b4c73d9890e1fa67290bc91823746a598c39de1a88b2094892c90e',
    deliveryTimeMs: 1200
  },
  {
    id: 'COM-2279',
    name: 'Flood safety announcement',
    subtitle: 'Demonstration record',
    category: 'Email + Push',
    channelType: 'email-push',
    channels: ['Email', 'Push'],
    status: 'Sent',
    statusType: 'sent',
    updated: '09:42',
    date: '2026-10-30',
    owner: 'Dr. Nimal Fernando',
    role: 'District Medical Director',
    operationalArea: 'All affected areas',
    organisation: 'Disaster Management Centre',
    recipientsCount: 520,
    deliveredCount: 512,
    failedCount: 8,
    priority: 'High',
    description: 'Advisory on boiling tap water and avoiding direct skin contact with flood run-off water to prevent leptospirosis and waterborne contamination.',
    translations: {
      en: 'Advisory on boiling tap water and avoiding direct skin contact with flood run-off water.',
      si: 'පානීය ජලය උණුකර නිවා පානය කරන ලෙසත්, ගංවතුර ජලය සමග සෘජුව ගැටීමෙන් වළකින ලෙසත් උපදෙස් දෙනු ලැබේ.',
      ta: 'குடிநீரைக் கொதிக்க வைத்துப் பருகுமாறும், வெள்ள நீருடன் நேரடி தொடர்பைத் தவிர்க்குமாறும் அறிவுறுத்தப்படுகிறார்கள்.'
    },
    sha256: '0x3f1c778a2e55d6190a4bb67290fa81823746a598c39de1a88b2094892c90e',
    deliveryTimeMs: 840
  },
  {
    id: 'COM-2274',
    name: 'Shelter assignment',
    subtitle: 'Demonstration record',
    category: 'SMS',
    channelType: 'sms',
    channels: ['SMS'],
    status: 'Failed',
    statusType: 'failed',
    updated: '09:17',
    date: '2026-10-30',
    owner: 'Amara Perera',
    role: 'Field Coordinator',
    operationalArea: 'Colombo 07 - Cinnamon Gardens',
    organisation: 'National Relief Unit',
    recipientsCount: 45,
    deliveredCount: 38,
    failedCount: 7,
    priority: 'High',
    description: 'Assignment notification to family groups for transfer to St. Thomas College Community Relief Camp. Unit transport delayed due to waterlogged approach.',
    translations: {
      en: 'Assignment notification to family groups for transfer to St. Thomas College Community Relief Camp.',
      si: 'ශාන්ත තෝමස් විද්‍යාලීය ප්‍රජා සහන කඳවුර වෙත පවුල් යොමුකිරීමේ දැනුම්දීම.',
      ta: 'புனித தோமையர் கல்லூரி நிவாரண முகாமுக்கு குடும்பங்களை மாற்றுவதற்கான ஒதுக்கீட்டு அறிவிப்பு.'
    },
    sha256: '0x8b2d119c3e44d7890b2aa67290bc91823746a598c39de1a88b2094892c90e',
    deliveryTimeMs: 3400
  },
  {
    id: 'COM-2268',
    name: 'Medical evacuation dispatch alert',
    subtitle: 'Priority operational record',
    category: 'SMS + Voice',
    channelType: 'sms-voice',
    channels: ['SMS', 'Voice'],
    status: 'Delivered',
    statusType: 'delivered',
    updated: '08:50',
    date: '2026-10-30',
    owner: 'Amara Perera',
    role: 'Field Coordinator',
    operationalArea: 'Ward Place / Cambridge',
    organisation: 'Red Cross Sri Lanka',
    recipientsCount: 12,
    deliveredCount: 12,
    failedCount: 0,
    priority: 'Critical',
    description: 'High-axle 4WD medical ambulance MMU-02 and rescue boat BR-05 dispatched with oxygen reserves for trapped elderly home residents.',
    translations: {
      en: 'High-axle 4WD medical ambulance MMU-02 and rescue boat BR-05 dispatched with oxygen reserves.',
      si: 'ඔක්සිජන් සහිත MMU-02 ගිලන් රථය සහ BR-05 මුදාගැනීමේ බෝට්ටුව පිටත් කර යවා ඇත.',
      ta: 'ஒக்சிஜன் விநியோகத்துடன் கூடிய MMU-02 அம்புலன்ஸ் மற்றும் BR-05 படகு அனுப்பப்பட்டுள்ளது.'
    },
    sha256: '0x5e8b221d4c73d9890e1fa67290bc91823746a598c39de1a88b2094892c90e',
    deliveryTimeMs: 950
  },
  {
    id: 'COM-2261',
    name: 'Dry ration distribution scheduled',
    subtitle: 'Priority operational record',
    category: 'Email + SMS',
    channelType: 'email-sms',
    channels: ['Email', 'SMS'],
    status: 'Sent',
    statusType: 'sent',
    updated: '08:30',
    date: '2026-10-30',
    owner: 'Kasun Bandara',
    role: 'Logistics Officer',
    operationalArea: 'Gampaha - Ja-Ela Division',
    organisation: 'National Relief Unit',
    recipientsCount: 180,
    deliveredCount: 176,
    failedCount: 4,
    priority: 'Normal',
    description: 'Scheduled arrival of emergency dry rations (flour, lentils, infant milk powder) at Ja-Ela Central Community distribution point at 11:00 AM.',
    translations: {
      en: 'Scheduled arrival of emergency dry rations at Ja-Ela Central Community distribution point at 11:00 AM.',
      si: 'පෙරවරු 11:00 ට ජා-ඇල මධ්‍යම ප්‍රජා මධ්‍යස්ථානයට හදිසි වියළි සලාක පැමිණීම.',
      ta: 'முற்பகல் 11:00 மணிக்கு ஜா-எல விநியோக மையத்திற்கு அவசர உலர் உணவுப் பொருட்கள் வரவுள்ளன.'
    },
    sha256: '0x1a7f443b2c99d7890e1fa67290bc91823746a598c39de1a88b2094892c90e',
    deliveryTimeMs: 1450
  },
  {
    id: 'COM-2255',
    name: 'Basement water rise critical warning',
    subtitle: 'Priority operational record',
    category: 'Push + SMS',
    channelType: 'push-sms',
    channels: ['Push', 'SMS'],
    status: 'Delivered',
    statusType: 'delivered',
    updated: '08:05',
    date: '2026-10-30',
    owner: 'Amara Jayasinghe',
    role: 'System Administrator',
    operationalArea: 'Kelani River Basin',
    organisation: 'Disaster Management Centre',
    recipientsCount: 320,
    deliveredCount: 318,
    failedCount: 2,
    priority: 'Critical',
    description: 'Telemetry sensor 9 detected 1.4m surge in Kelani river basin. Basement transformers and backup generators must be shut down immediately.',
    translations: {
      en: 'Telemetry sensor 9 detected 1.4m surge in Kelani river basin. Immediate power cut required.',
      si: 'කැලණි ගඟ ද්‍රෝණියේ ජල මට්ටම මීටර් 1.4 කින් ඉහළ ගොස් ඇත. පහළ මාලයේ විදුලි ජනක යන්ත්‍ර වහාම ක්‍රියා විරහිත කරන්න.',
      ta: 'களனி நதிப் படுகையில் 1.4 மீ நீர்மட்டம் உயர்ந்துள்ளது. அடித்தள மின்சார உபகரணங்களை உடனடியாக அணைக்கவும்.'
    },
    sha256: '0x4c2a991b5c43d7890e1fa67290bc91823746a598c39de1a88b2094892c90e',
    deliveryTimeMs: 820
  },
  {
    id: 'COM-2248',
    name: 'Volunteer task rota check-in',
    subtitle: 'Demonstration record',
    category: 'SMS',
    channelType: 'sms',
    channels: ['SMS'],
    status: 'Failed',
    statusType: 'failed',
    updated: '07:45',
    date: '2026-10-30',
    owner: 'Thilini De Silva',
    role: 'Volunteer Coordinator',
    operationalArea: 'Negombo Logistics Base',
    organisation: 'Red Cross Sri Lanka',
    recipientsCount: 25,
    deliveredCount: 20,
    failedCount: 5,
    priority: 'Normal',
    description: 'Shift confirmation ping for volunteer team Alpha 2 scheduled for 09:00 AM tent construction rota in Kochchikade South.',
    translations: {
      en: 'Shift confirmation ping for volunteer team Alpha 2 scheduled for 09:00 AM tent construction.',
      si: 'කොච්චිකඩේ දකුණේ කූඩාරම් ඉදිකිරීමේ ස්වේච්ඡා කණ්ඩායම සඳහා සේවා මුරය තහවුරු කිරීමේ පණිවිඩය.',
      ta: 'கொச்சிக்கடை தெற்கில் கூடாரங்கள் அமைக்கும் தன்னார்வலர் குழுவுக்கான பணி உறுதிப்படுத்தல் தகவல்.'
    },
    sha256: '0x7e2d991b5c43d7890e1fa67290bc91823746a598c39de1a88b2094892c90e',
    deliveryTimeMs: 4200
  }
];

export const RECIPIENTS_DATA = [
  {
    id: 'REC-081',
    name: 'Dr. Priyantha Silva',
    role: 'Senior Medical Officer · Ward Place Care Facility',
    category: 'First Responder',
    phone: '+94 77 123 4567',
    carrier: 'Dialog Axiata (Verified 4G/VoLTE)',
    email: 'priyantha.silva@healthgov.lk',
    location: 'Colombo 07 - Cinnamon Gardens',
    coordinates: '6.9147° N, 79.8732° E',
    deliveryChannels: {
      sms: { active: true, number: '+94 77 123 4567', status: 'Online' },
      email: { active: true, address: 'priyantha.silva@healthgov.lk', status: 'Verified' },
      push: { active: true, device: 'Samsung S23 Ultra · Token Registered', status: 'Active' }
    },
    stats: {
      totalReceived: 42,
      deliverySuccessRate: '98.5%',
      avgLatency: '1.2s'
    },
    recentAlerts: [
      { id: 'COM-2281', title: 'HMR-1042 status update', time: '09:58 AM', channel: 'SMS + Push', status: 'Delivered', latency: '1.1s' },
      { id: 'COM-2268', title: 'Medical evacuation dispatch alert', time: '08:50 AM', channel: 'SMS + Voice', status: 'Delivered', latency: '0.9s' },
      { id: 'COM-2255', title: 'Basement water rise critical warning', time: '08:05 AM', channel: 'Push Notification', status: 'Delivered', latency: '0.8s' }
    ]
  },
  {
    id: 'REC-082',
    name: 'Amara Perera',
    role: 'Field Coordinator · Colombo District',
    category: 'Incident Commander',
    phone: '+94 71 889 0012',
    carrier: 'Mobitel (Verified 4G)',
    email: 'amara.perera@humanitarian.lk',
    location: 'Colombo District EOC Hub',
    coordinates: '6.9271° N, 79.8612° E',
    deliveryChannels: {
      sms: { active: true, number: '+94 71 889 0012', status: 'Online' },
      email: { active: true, address: 'amara.perera@humanitarian.lk', status: 'Verified' },
      push: { active: true, device: 'iPhone 15 Pro · APNs Token', status: 'Active' }
    },
    stats: {
      totalReceived: 88,
      deliverySuccessRate: '100%',
      avgLatency: '0.9s'
    },
    recentAlerts: [
      { id: 'COM-2281', title: 'HMR-1042 status update', time: '09:58 AM', channel: 'Push', status: 'Delivered', latency: '0.8s' },
      { id: 'COM-2274', title: 'Shelter assignment', time: '09:17 AM', channel: 'SMS', status: 'Delivered', latency: '1.2s' }
    ]
  },
  {
    id: 'REC-083',
    name: 'Nimali Senanayake',
    role: 'Shelter Manager · St. Thomas Relief Camp',
    category: 'Shelter Lead',
    phone: '+94 76 543 2109',
    carrier: 'Airtel Sri Lanka',
    email: 'nimali.s@redcross.lk',
    location: 'Mount Lavinia / Colombo South',
    coordinates: '6.8420° N, 79.8650° E',
    deliveryChannels: {
      sms: { active: true, number: '+94 76 543 2109', status: 'Online' },
      email: { active: true, address: 'nimali.s@redcross.lk', status: 'Verified' },
      push: { active: false, device: 'Not Installed', status: 'Disabled' }
    },
    stats: {
      totalReceived: 35,
      deliverySuccessRate: '94.2%',
      avgLatency: '1.8s'
    },
    recentAlerts: [
      { id: 'COM-2279', title: 'Flood safety announcement', time: '09:42 AM', channel: 'Email', status: 'Delivered', latency: '1.4s' },
      { id: 'COM-2274', title: 'Shelter assignment', time: '09:17 AM', channel: 'SMS', status: 'Failed', latency: '3.4s' }
    ]
  }
];

export const TELEMETRY_DELIVERY_DATA = {
  summary: {
    totalSent: 1842,
    smsRate: '98.4%',
    emailRate: '96.8%',
    pushRate: '99.2%',
    failedRate: '1.6%',
    avgLatencyMs: 24
  },
  gateways: [
    { name: 'Mobitel / Dialog SMS Gateway API', status: 'ONLINE', latency: '22ms', uptime: '99.98%', protocol: 'SMPP / HTTP v2' },
    { name: 'Twilio Multi-Carrier Telephony Relay', status: 'ONLINE', latency: '35ms', uptime: '99.95%', protocol: 'REST v2026' },
    { name: 'AWS SES / SendGrid Secure Relay', status: 'ONLINE', latency: '48ms', uptime: '100%', protocol: 'TLS 1.3 / DKIM' },
    { name: 'Firebase Cloud Messaging (FCM/APNs)', status: 'ONLINE', latency: '18ms', uptime: '99.99%', protocol: 'HTTP/2 Push' }
  ],
  pipelineRecords: [
    { id: 'PIPELINE-901', ref: 'COM-2281', recipient: '+94 77 123 4567', channel: 'SMS', carrier: 'Dialog Axiata', dispatchTime: '09:58:12', deliverTime: '09:58:13', latency: '1.1s', status: 'Delivered', error: 'None' },
    { id: 'PIPELINE-902', ref: 'COM-2281', recipient: 'priyantha.silva@healthgov.lk', channel: 'Email', carrier: 'AWS SES', dispatchTime: '09:58:12', deliverTime: '09:58:14', latency: '1.8s', status: 'Delivered', error: 'None' },
    { id: 'PIPELINE-903', ref: 'COM-2279', recipient: '+94 71 889 0012', channel: 'Push', carrier: 'FCM Android', dispatchTime: '09:42:04', deliverTime: '09:42:05', latency: '0.8s', status: 'Delivered', error: 'None' },
    { id: 'PIPELINE-904', ref: 'COM-2274', recipient: '+94 76 543 2109', channel: 'SMS', carrier: 'Airtel Tower BTS-04', dispatchTime: '09:17:02', deliverTime: '—', latency: 'Timeout (30s)', status: 'Failed', error: 'Tower Submerged / BTS Offline' },
    { id: 'PIPELINE-905', ref: 'COM-2268', recipient: '+94 77 990 1122', channel: 'SMS', carrier: 'Mobitel GSM', dispatchTime: '08:50:33', deliverTime: '08:50:34', latency: '1.0s', status: 'Delivered', error: 'None' },
    { id: 'PIPELINE-906', ref: 'COM-2261', recipient: 'depot.gampaha@humanitarian.lk', channel: 'Email', carrier: 'SendGrid Relay', dispatchTime: '08:30:10', deliverTime: '08:30:12', latency: '2.1s', status: 'Delivered', error: 'None' },
    { id: 'PIPELINE-907', ref: 'COM-2248', recipient: '+94 72 334 5566', channel: 'SMS', carrier: 'Hutch Telecom', dispatchTime: '07:45:00', deliverTime: '—', latency: 'Handshake Error', status: 'Failed', error: 'Handset Power Off > 12h' }
  ]
};

export const FAILED_EXCEPTIONS_DATA = [
  {
    id: 'FAIL-01',
    ref: 'COM-2274',
    recipient: 'K. G. Perera (Family Rep)',
    phone: '+94 76 543 2109',
    channel: 'SMS',
    failureReason: 'Tower Submerged / BTS Offline (Kelani Basin Tower 04)',
    failureCode: 'ERR_TELCO_CARRIER_TIMEOUT',
    timestamp: '09:17 AM',
    attemptCount: 3,
    suggestedAction: 'Reroute via VHF Police Radio or Amateur Ham Net 144.2 MHz',
    status: 'Action Required',
    severity: 'High'
  },
  {
    id: 'FAIL-02',
    ref: 'COM-2248',
    recipient: 'S. Dharmadasa (Volunteer Lead)',
    phone: '+94 72 334 5566',
    channel: 'SMS',
    failureReason: 'Handset Switched Off or Out of Service (>12 hours)',
    failureCode: 'ERR_SUBSCRIBER_ABSENT',
    timestamp: '07:45 AM',
    attemptCount: 2,
    suggestedAction: 'Send automated voice call alert or notify team leader via Push',
    status: 'Action Required',
    severity: 'Medium'
  }
];

export const NOTIFICATION_CATEGORIES = [
  'Emergency Alert',
  'Evacuation Warning',
  'Medical Dispatch',
  'Shelter Assignment',
  'Food & Ration Distribution',
  'Flood Advisory',
  'Infrastructure Outage',
  'Volunteer Mobilisation'
];

export const OPERATIONAL_AREAS = [
  'All affected areas',
  'Kelani East - Zone 03',
  'Colombo 07 - Cinnamon Gardens',
  'Gampaha - Ja-Ela Division',
  'Kalutara North Sports Complex',
  'Ratnapura Primary College Zone',
  'Negombo Logistics Base'
];

export const ORGANISATIONS = [
  'National Relief Unit',
  'Disaster Management Centre',
  'Sri Lanka Red Cross',
  'UN-OCHA Sri Lanka',
  'Ministry of Health EOC'
];
