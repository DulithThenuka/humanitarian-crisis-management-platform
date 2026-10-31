import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Headphones,
  PhoneCall,
  Copy,
  Check,
  Bot,
  Send,
  Sparkles,
  FileText,
  Clock,
  MapPin,
  Building2,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Radio,
  Volume2,
  VolumeX,
  MessageSquare,
  Compass,
  UserCheck
} from 'lucide-react';
import { useAlert } from '../../context/AlertContext';
import robot3D from '../../assets/robot-3d.png';
import './CitizenSupportPage.css';

// ---------------------------------------------------------------------------
// 1. NATIONAL & REGIONAL CRISIS HOTLINES
// ---------------------------------------------------------------------------
const CRISIS_HOTLINES = [
  {
    number: '117',
    label: 'Disaster Management Center',
    purpose: '24/7 National Emergency Command & Warning System',
    category: 'Command',
    tel: 'tel:117'
  },
  {
    number: '1990',
    label: 'Suwa Seriya Ambulance',
    purpose: 'Free Pre-Hospital Medical Rescue & Critical Transport',
    category: 'Medical',
    tel: 'tel:1990'
  },
  {
    number: '119',
    label: 'Police Crisis Operations',
    purpose: 'Search & rescue, law enforcement, flood security escorts',
    category: 'Police',
    tel: 'tel:119'
  },
  {
    number: '110',
    label: 'Fire & Water Rescue Command',
    purpose: 'Inflatable boat extraction, flood diver units',
    category: 'Rescue',
    tel: 'tel:110'
  },
  {
    number: '1926',
    label: 'Mental Health & Trauma Hotline',
    purpose: 'Free psychological first aid & disaster shock support',
    category: 'Counseling',
    tel: 'tel:1926'
  },
  {
    number: '011-234-5678',
    label: 'ReliefCore Operations Desk',
    purpose: 'Direct coordinator assistance & dispatch tracking',
    category: 'ReliefCore',
    tel: 'tel:0112345678'
  }
];

// ---------------------------------------------------------------------------
// 2. GROUND RESPONSE HELP DESKS (Western Province)
// ---------------------------------------------------------------------------
const GROUND_HELP_DESKS = [
  {
    id: 'GHD-01',
    district: 'Colombo District',
    name: 'Colombo Central Command Helpdesk',
    location: 'Sugathadasa Indoor Stadium Complex, Colombo 13',
    officer: 'Insp. K. Wickramasinghe (Disaster Coordinator)',
    phone: '011-243-8891',
    hours: 'Open 24/7 (Emergency Response)',
    supplies: ['Emergency Water Purifiers', 'Baby Milk Powder', 'Ready-to-Eat Rations', 'First Aid Kits']
  },
  {
    id: 'GHD-02',
    district: 'Colombo District',
    name: 'Kolonnawa Flood Triage & Relief Desk',
    location: 'Kolonnawa Divisional Secretariat, Wellampitiya',
    officer: 'Dr. M. Jayasuriya (Medical Response Lead)',
    phone: '011-257-2204',
    hours: 'Open 24/7 (Boat Deployment Point)',
    supplies: ['Life Jackets', 'Inflatable Boat Triage', 'Water Jerrycans', 'Emergency Blankets']
  },
  {
    id: 'GHD-03',
    district: 'Colombo District',
    name: 'Kaduwela & Kelani Riverfront Desk',
    location: 'Kaduwela Divisional Secretariat, Low Level Rd',
    officer: 'Capt. S. Fernando (Navy Operations Liaison)',
    phone: '011-253-9011',
    hours: 'Open 24/7 (Active Evacuation Hub)',
    supplies: ['Dry Ration Packs', 'Medical Transport Stretcher', 'Flashlights', 'Battery Banks']
  },
  {
    id: 'GHD-04',
    district: 'Gampaha District',
    name: 'Gampaha District Emergency Center',
    location: 'Gampaha District Secretariat, Miriswatta Junction',
    officer: 'Mrs. N. Senaratne (Administrative Officer)',
    phone: '033-222-2275',
    hours: 'Open 24/7 (Ration Warehouse)',
    supplies: ['Dry Food Bags', 'Infant Care Packs', 'Water Purification Tablets', 'Sanitary Kits']
  },
  {
    id: 'GHD-05',
    district: 'Kalutara District',
    name: 'Kalutara South Relief Operations Hub',
    location: 'Kalutara Town Hall, Main Street, Kalutara',
    officer: 'Mr. R. Perera (Civil Defense Officer)',
    phone: '034-222-1088',
    hours: 'Open 24/7 (Coastal & River Monitoring)',
    supplies: ['Emergency Food Parcels', 'Drinking Water', 'Mosquito Nets', 'Tarpaulins']
  }
];

// ---------------------------------------------------------------------------
// 3. INITIAL SAMPLE TICKETS
// ---------------------------------------------------------------------------
const DEFAULT_TICKETS = [
  {
    id: 'TIC-2026-7241',
    date: 'Today, 10:15 AM',
    subject: 'Urgent dialysis patient transport request',
    category: 'Medical Urgent',
    urgency: 'Critical',
    status: 'In Progress',
    statusStep: 3,
    assignedTo: 'Capt. S. Fernando (Navy Extraction Boat Unit)',
    lastUpdate: 'Boat WP-NAVY-04 routed to Kolonnawa lowlands. ETA 20 mins.',
    district: 'Colombo'
  },
  {
    id: 'TIC-2026-6819',
    date: 'Yesterday, 04:30 PM',
    subject: 'Drinking water jerrycans for 4 isolated families',
    category: 'Water & Rations',
    urgency: 'Urgent',
    status: 'Dispatched',
    statusStep: 3,
    assignedTo: 'Colombo Disaster Logistics Team',
    lastUpdate: 'Truck #WP-KA-4102 has departed Sugathadasa hub.',
    district: 'Colombo'
  },
  {
    id: 'TIC-2026-5120',
    date: 'Oct 29, 2026',
    subject: 'Shelter wheelchair access verification for senior citizen',
    category: 'Shelter Accessibility',
    urgency: 'Normal',
    status: 'Resolved',
    statusStep: 4,
    assignedTo: 'Amara Chen (Coordinator)',
    lastUpdate: 'Confirmed St. Sebastian School has ground-floor wheelchair ramp.',
    district: 'Colombo'
  }
];

// ---------------------------------------------------------------------------
// 4. FREQUENTLY ASKED QUESTIONS
// ---------------------------------------------------------------------------
const FAQ_ITEMS = [
  {
    q: 'How fast will my assistance request be processed by ReliefCore?',
    a: 'Emergency medical and flood rescue requests are prioritized immediately by ReliefCore AI triage and routed to nearby field rescue units within 3 to 10 minutes. Food and drinking water distribution runs on automated morning and afternoon dispatch batches.',
    cat: 'Requests'
  },
  {
    q: 'Can I request assistance if my phone battery is low or signal is intermittent?',
    a: 'Yes. You can send a single SMS to 8822 with format: RELIEF [DISTRICT] [NEEDS] [FAMILY_COUNT]. Our server logs the SMS and matches it to local ground teams even when data internet is unavailable.',
    cat: 'Offline'
  },
  {
    q: 'How do I locate the nearest safe evacuation shelter with open capacity?',
    a: 'Use the "Find Shelters" tab in the citizen portal to see real-time bed availability, meal provision, and road accessibility. You can also call DMC on 117 for spoken verbal directions.',
    cat: 'Shelter'
  },
  {
    q: 'Are pets allowed in the designated evacuation centers?',
    a: 'Selected government relief shelters (such as Sugathadasa and Ananda College hall) have dedicated shaded holding areas for domestic pets and service animals. Food and water are provided by volunteer veterinary teams.',
    cat: 'Shelter'
  },
  {
    q: 'What should I do if floodwaters reach electrical sockets?',
    a: 'Immediately turn off your household Main Switch (Circuit Breaker) if safe to reach without standing in water. Do not touch wet electrical appliances or submerged wiring. Call Fire Command on 110 if sparks or smoke are observed.',
    cat: 'Safety'
  },
  {
    q: 'How do I report a missing family member or locate separated relatives?',
    a: 'Submit a ticket under the category "Missing Person Trace" with full name, approximate last seen location, and contact details. Our coordinators synchronize names hourly with the Western Province Evacuee Registry.',
    cat: 'Requests'
  }
];

// ---------------------------------------------------------------------------
// 5. SUGGESTED AI PROMPT CHIPS
// ---------------------------------------------------------------------------
const SUGGESTED_CHIPS = [
  'How do I request emergency baby food or milk in Kolonnawa?',
  'Where is the nearest shelter that has wheelchair ramps?',
  'How long does food ration delivery take to reach Kaduwela?',
  'Can I bring pets or domestic dogs to an evacuation center?',
  'What should I do if mobile signal and power go down?'
];

export const CitizenSupportPage = ({ onBack }) => {
  const navigate = useNavigate();
  const alertCtx = useAlert();
  const showAlert = alertCtx?.showAlert || ((msg) => window.alert(msg));

  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'ticket' | 'track' | 'desks' | 'faq'
  const [copiedNumber, setCopiedNumber] = useState(null);

  // Audio Whistle Beacon state
  const [isWhistlePlaying, setIsWhistlePlaying] = useState(false);
  const [audioCtx, setAudioCtx] = useState(null);

  // -------------------------------------------------------------------------
  // Chat state
  // -------------------------------------------------------------------------
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Ayubowan / Vanakkam! I am ReliefBot, ReliefCore’s 24/7 automated crisis assistant. How can I help you right now? You can ask about shelter locations, food rations, medical transport, or request human coordinator escalation.',
      time: 'Just now',
      actions: [
        { label: 'Submit Assistance Request', link: '/citizen/submit' },
        { label: 'Find Open Shelters', link: '/citizen/shelters' }
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // -------------------------------------------------------------------------
  // Ticket Submission Form state
  // -------------------------------------------------------------------------
  const [ticketForm, setTicketForm] = useState({
    name: 'Dinithi Perera',
    phone: '077 123 4567',
    district: 'Colombo',
    division: 'Kolonnawa',
    category: 'Food & Clean Water Delay',
    urgency: 'Normal', // 'Normal' | 'Urgent' | 'Critical'
    subject: '',
    message: ''
  });

  // -------------------------------------------------------------------------
  // Support Tickets list (stored in localStorage)
  // -------------------------------------------------------------------------
  const [ticketsList, setTicketsList] = useState(() => {
    try {
      const stored = localStorage.getItem('reliefcore_support_tickets');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_TICKETS;
  });

  const [searchTicketQuery, setSearchTicketQuery] = useState('');
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  // -------------------------------------------------------------------------
  // Clipboard Copy helper
  // -------------------------------------------------------------------------
  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(text);
    showAlert(`Copied ${label} (${text}) to clipboard!`, 'success');
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  // -------------------------------------------------------------------------
  // Audio SOS Whistle Generator (Web Audio API)
  // -------------------------------------------------------------------------
  const toggleWhistle = () => {
    if (isWhistlePlaying) {
      if (audioCtx) {
        audioCtx.close();
        setAudioCtx(null);
      }
      setIsWhistlePlaying(false);
      showAlert('Emergency audio whistle deactivated.', 'info');
    } else {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(2800, ctx.currentTime);

        // Modulate frequency to create oscillating rescue whistle
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(3.5, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(350, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        lfo.start();
        setAudioCtx(ctx);
        setIsWhistlePlaying(true);
        showAlert('Emergency locator whistle ACTIVE! Keep speaker volume high for rescue boats.', 'success');
      } catch (err) {
        console.error(err);
        showAlert('Audio whistle could not start on this device.', 'error');
      }
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioCtx) {
        audioCtx.close();
      }
    };
  }, [audioCtx]);

  // -------------------------------------------------------------------------
  // AI Bot Response Generator
  // -------------------------------------------------------------------------
  const generateBotReply = (userText) => {
    const text = userText.toLowerCase();

    if (text.includes('baby') || text.includes('infant') || text.includes('milk') || text.includes('formula')) {
      return {
        reply: 'Infant formula, sterile baby bottles, and electrolyte powder are stocked at the Kolonnawa Flood Relief Point (Wellampitiya) and Sugathadasa Stadium Command Hub. You can also mark your request category as "Accessibility / Infant" on the form for priority boat dispatch.',
        actions: [
          { label: 'Submit Infant Assistance Request', link: '/citizen/submit?category=Food' },
          { label: 'Call Kolonnawa Desk (011-257-2204)', href: 'tel:0112572204' }
        ]
      };
    }

    if (text.includes('wheelchair') || text.includes('disabled') || text.includes('elderly') || text.includes('ramp')) {
      return {
        reply: 'Shelters with confirmed step-free wheelchair ramps and accessible washrooms in Colombo District include: (1) Sugathadasa Stadium (Ground Floor Section C), (2) Ananda College Main Hall, and (3) St. Sebastian School. We can also dispatch specialized accessible transport.',
        actions: [
          { label: 'View Shelters Directory', link: '/citizen/shelters' },
          { label: 'Request Special Care Transport', link: '/citizen/submit?category=Transport' }
        ]
      };
    }

    if (text.includes('pet') || text.includes('dog') || text.includes('cat') || text.includes('animal')) {
      return {
        reply: 'Yes! Domestic animals and pets are allowed at Sugathadasa Shelter and Kolonnawa Community Hall in designated pet-friendly shaded zones. Veterinary volunteers provide clean water and animal food. Please keep pets on leashes or in carriers.',
        actions: [
          { label: 'Check Pet-Friendly Shelters', link: '/citizen/shelters' }
        ]
      };
    }

    if (text.includes('how long') || text.includes('delay') || text.includes('dispatch') || text.includes('ration') || text.includes('food')) {
      return {
        reply: 'Current average dispatch turnaround for food packages is 45 minutes in accessible sectors and 2.5 hours in inundated boat-access zones (Kolonnawa & Kaduwela). Trucks are monitored in real time on our dispatch hub.',
        actions: [
          { label: 'Track Existing Request', link: '/citizen/track' },
          { label: 'Submit New Ration Request', link: '/citizen/submit' }
        ]
      };
    }

    if (text.includes('signal') || text.includes('power') || text.includes('offline') || text.includes('electricity')) {
      return {
        reply: 'If you lose data connection, send an SMS to 8822 with: "RELIEF [DISTRICT] [NEEDS] [PEOPLE_COUNT]" (e.g. RELIEF COLOMBO FOOD 4). You can also dial *117# on any mobile phone to trigger our emergency callback service without internet.',
        actions: [
          { label: 'View Offline Safety Guides', link: '/citizen/safety' }
        ]
      };
    }

    if (text.includes('human') || text.includes('call') || text.includes('coordinator') || text.includes('person') || text.includes('talk')) {
      return {
        reply: 'Connecting you to ReliefCore Command Desk. Our active field coordinator is on duty at 011-234-5678. You can also dial DMC hotline 117 for national rescue operations.',
        actions: [
          { label: 'Call 011-234-5678 Now', href: 'tel:0112345678' },
          { label: 'Call DMC 117 Toll Free', href: 'tel:117' }
        ]
      };
    }

    return {
      reply: `Thank you for contacting ReliefCore Support. We have logged your inquiry regarding "${userText}". Our coordinators and AI triage systems are monitoring all channels. For urgent rescue, please call 117 or 1990 immediately.`,
      actions: [
        { label: 'Submit Full Support Ticket', tab: 'ticket' },
        { label: 'Emergency Safety Protocols', link: '/citizen/safety' }
      ]
    };
  };

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const { reply, actions } = generateBotReply(query);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: reply,
        time: 'Just now',
        actions: actions || []
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  // -------------------------------------------------------------------------
  // Handle Ticket Submission
  // -------------------------------------------------------------------------
  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) {
      showAlert('Please enter both subject and detailed description.', 'error');
      return;
    }

    const newTicketId = `TIC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket = {
      id: newTicketId,
      date: 'Just now',
      subject: ticketForm.subject,
      category: ticketForm.category,
      urgency: ticketForm.urgency,
      status: ticketForm.urgency === 'Critical' ? 'Dispatched' : 'Under Review',
      statusStep: ticketForm.urgency === 'Critical' ? 3 : 2,
      assignedTo: 'ReliefCore Triage Queue (Auto-Routed)',
      lastUpdate: 'Ticket logged in citizen helpdesk database. Coordinator notified.',
      district: ticketForm.district
    };

    const updated = [newTicket, ...ticketsList];
    setTicketsList(updated);
    try {
      localStorage.setItem('reliefcore_support_tickets', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    showAlert(`Ticket ${newTicketId} created successfully! Our dispatch team is notified.`, 'success');

    // Reset fields
    setTicketForm((prev) => ({
      ...prev,
      subject: '',
      message: '',
      urgency: 'Normal'
    }));

    // Switch to track tab
    setActiveTab('track');
  };

  // -------------------------------------------------------------------------
  // Filter tickets
  // -------------------------------------------------------------------------
  const filteredTickets = useMemo(() => {
    if (!searchTicketQuery.trim()) return ticketsList;
    const q = searchTicketQuery.toLowerCase();
    return ticketsList.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.district.toLowerCase().includes(q)
    );
  }, [ticketsList, searchTicketQuery]);

  // -------------------------------------------------------------------------
  // Filter FAQs
  // -------------------------------------------------------------------------
  const filteredFaqs = useMemo(() => {
    if (!faqSearchQuery.trim()) return FAQ_ITEMS;
    const q = faqSearchQuery.toLowerCase();
    return FAQ_ITEMS.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
  }, [faqSearchQuery]);

  return (
    <div className="support-page-container">
      {/* ===================================================================
         1. Top Navigation Bar & Live Operational Status
         =================================================================== */}
      <div className="support-top-nav-bar">
        <button
          className="support-back-btn"
          onClick={() => {
            if (onBack) onBack();
            else navigate('/citizen');
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Citizen Portal</span>
        </button>

        <div className="support-live-status-pill">
          <span className="pulsing-green-dot"></span>
          <span>Support Command Desks Active &bull; Average AI Response &lt; 2s</span>
        </div>
      </div>

      {/* ===================================================================
         2. Hero Banner & Overview
         =================================================================== */}
      <div className="support-hero-banner">
        <div className="support-hero-content">
          <div className="support-badge-pill">
            <Headphones size={13} />
            <span>24/7 Citizen Crisis Helpdesk</span>
          </div>

          <h1 className="support-hero-title">How can we assist you today?</h1>
          <p className="support-hero-subtitle">
            Connect directly with disaster coordinators, chat with our instant ReliefBot assistant, submit inquiries,
            or locate physical crisis desks across Western Province.
          </p>

          <div className="support-stats-strip">
            <div className="support-stat-chip">
              <span className="stat-chip-val">6 Hotlines</span>
              <span className="stat-chip-lbl">Toll-Free 24/7 Access</span>
            </div>
            <div className="support-stat-chip">
              <span className="stat-chip-val">5 Ground Desks</span>
              <span className="stat-chip-lbl">Field Response Hubs</span>
            </div>
            <div className="support-stat-chip">
              <span className="stat-chip-val">100% Free</span>
              <span className="stat-chip-lbl">National Public Aid</span>
            </div>
            <div className="support-stat-chip">
              <span className="stat-chip-val">SMS 8822</span>
              <span className="stat-chip-lbl">Offline Network Support</span>
            </div>
          </div>
        </div>

        <div className="support-hero-side-illustration">
          <img src={robot3D} alt="ReliefBot 3D AI Assistant" className="support-robot-img" />
        </div>
      </div>

      {/* ===================================================================
         3. Emergency Hotlines Direct Dial Bar (High Visibility)
         =================================================================== */}
      <section className="emergency-hotlines-section">
        <div className="hotlines-header">
          <div className="hotlines-title-wrap">
            <div className="sos-flashing-icon">
              <PhoneCall size={18} />
            </div>
            <div>
              <h2 className="hotlines-heading">National Crisis & Emergency Hotlines</h2>
              <p className="hotlines-subtext">Tap to dial instantly or copy the number. All calls are free of charge.</p>
            </div>
          </div>

          {/* Emergency Audio Whistle Button */}
          <button
            onClick={toggleWhistle}
            className={`support-tab-btn ${isWhistlePlaying ? 'active' : ''}`}
            style={{
              borderColor: isWhistlePlaying ? '#ef4444' : '#fca5a5',
              background: isWhistlePlaying ? '#dc2626' : '#fff1f2',
              color: isWhistlePlaying ? '#ffffff' : '#b91c1c'
            }}
          >
            {isWhistlePlaying ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <span>{isWhistlePlaying ? 'Stop SOS Audio Whistle' : 'SOS Audio Rescue Whistle'}</span>
          </button>
        </div>

        <div className="hotlines-grid">
          {CRISIS_HOTLINES.map((h, idx) => {
            const isCopied = copiedNumber === h.number;
            return (
              <div key={idx} className="hotline-card">
                <div>
                  <div className="hotline-number-row">
                    <span className="hotline-dial-number">{h.number}</span>
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: 700,
                        color: '#991b1b',
                        background: '#fecaca',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}
                    >
                      {h.category}
                    </span>
                  </div>
                  <div className="hotline-dept-label">{h.label}</div>
                  <div className="hotline-purpose">{h.purpose}</div>
                </div>

                <div className="hotline-actions">
                  <a href={h.tel} className="btn-hotline-call">
                    <PhoneCall size={13} />
                    <span>Call Now</span>
                  </a>
                  <button
                    className="btn-hotline-copy"
                    title="Copy phone number"
                    onClick={() => handleCopy(h.number, h.label)}
                  >
                    {isCopied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================================================================
         4. Subtabs Navigation Switcher
         =================================================================== */}
      <div className="support-subtabs-nav">
        <button
          className={`support-tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <Bot size={17} />
          <span>AI ReliefBot Assistant</span>
          <span className="support-tab-badge">24/7 Live</span>
        </button>

        <button
          className={`support-tab-btn ${activeTab === 'ticket' ? 'active' : ''}`}
          onClick={() => setActiveTab('ticket')}
        >
          <FileText size={17} />
          <span>Submit Inquiry / Ticket</span>
        </button>

        <button
          className={`support-tab-btn ${activeTab === 'track' ? 'active' : ''}`}
          onClick={() => setActiveTab('track')}
        >
          <Clock size={17} />
          <span>Track Support Tickets</span>
          <span className="support-tab-badge">{ticketsList.length}</span>
        </button>

        <button
          className={`support-tab-btn ${activeTab === 'desks' ? 'active' : ''}`}
          onClick={() => setActiveTab('desks')}
        >
          <Building2 size={17} />
          <span>Ground Help Desks</span>
        </button>

        <button
          className={`support-tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
          onClick={() => setActiveTab('faq')}
        >
          <HelpCircle size={17} />
          <span>Knowledge Base & FAQs</span>
        </button>
      </div>

      {/* ===================================================================
         5. TAB CONTENT
         =================================================================== */}

      {/* -------------------- A. AI RELIEFBOT CHAT -------------------- */}
      {activeTab === 'chat' && (
        <div className="reliefbot-chat-container">
          <div className="chat-main-column">
            <div className="chat-header">
              <div className="chat-assistant-meta">
                <div className="assistant-avatar-box">
                  <Bot size={22} />
                </div>
                <div>
                  <div className="assistant-name">ReliefBot AI Disaster Assistant</div>
                  <div className="assistant-status">
                    <span className="pulsing-green-dot"></span>
                    <span>Ready &bull; Synchronized with DMC Western Province</span>
                  </div>
                </div>
              </div>

              <button
                className="support-tab-btn"
                style={{ padding: '6px 12px', fontSize: '12px' }}
                onClick={() => handleSendMessage('I want to speak with a human coordinator')}
              >
                <UserCheck size={14} />
                <span>Talk to Human Coordinator</span>
              </button>
            </div>

            <div className="chat-messages-area">
              {messages.map((m) => (
                <div key={m.id} className={`chat-msg ${m.sender}`}>
                  <div className="chat-avatar-mini">{m.sender === 'bot' ? 'RB' : 'You'}</div>
                  <div>
                    <div className="chat-bubble">{m.text}</div>
                    {m.actions && m.actions.length > 0 && (
                      <div className="chat-actions-row">
                        {m.actions.map((act, aIdx) => {
                          if (act.tab) {
                            return (
                              <button
                                key={aIdx}
                                className="chat-action-btn"
                                onClick={() => setActiveTab(act.tab)}
                              >
                                <span>{act.label}</span>
                                <ExternalLink size={12} />
                              </button>
                            );
                          }
                          if (act.href) {
                            return (
                              <a key={aIdx} href={act.href} className="chat-action-btn">
                                <PhoneCall size={12} />
                                <span>{act.label}</span>
                              </a>
                            );
                          }
                          return (
                            <Link key={aIdx} to={act.link} className="chat-action-btn">
                              <span>{act.label}</span>
                              <ExternalLink size={12} />
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="chat-msg bot">
                  <div className="chat-avatar-mini">RB</div>
                  <div className="chat-bubble" style={{ color: '#64748b', fontStyle: 'italic' }}>
                    ReliefBot is researching verified protocols...
                  </div>
                </div>
              )}
            </div>

            <form
              className="chat-input-bar"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <input
                type="text"
                className="chat-input-field"
                placeholder="Ask about shelters, ration distribution, medical transport, or evacuation advice..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button type="submit" className="chat-send-btn" disabled={!inputMessage.trim()}>
                <Send size={16} />
                <span>Send</span>
              </button>
            </form>
          </div>

          <div className="chat-side-panel">
            <h3 className="side-panel-heading">
              <Sparkles size={16} color="#0e6f76" />
              <span>Suggested Inquiries</span>
            </h3>

            <div className="prompt-chips-wrap">
              {SUGGESTED_CHIPS.map((chip, idx) => (
                <button key={idx} className="prompt-chip" onClick={() => handleSendMessage(chip)}>
                  {chip} &rarr;
                </button>
              ))}
            </div>

            <div className="ai-disclaimer-box">
              <ShieldCheck size={15} style={{ marginBottom: '4px', display: 'inline', marginRight: '4px' }} />
              <strong>Official Advisory:</strong> ReliefBot provides real-time guidance aligned with the National
              Disaster Management Center. In severe life-threatening emergencies, immediately call <strong>117</strong>{' '}
              or <strong>1990</strong>.
            </div>
          </div>
        </div>
      )}

      {/* -------------------- B. SUBMIT TICKET FORM -------------------- */}
      {activeTab === 'ticket' && (
        <div className="ticket-form-card">
          <div className="ticket-form-header">
            <h2 className="ticket-form-title">Submit Citizen Inquiry or Support Ticket</h2>
            <p className="ticket-form-desc">
              For non-emergency inquiries, distribution follow-ups, special diet requirements, or shelter questions.
              Our coordinators review every ticket.
            </p>
          </div>

          <form onSubmit={handleSubmitTicket}>
            <div className="ticket-form-grid">
              <div>
                <label className="form-label">
                  Your Full Name <span className="req">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={ticketForm.name}
                  onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">
                  Mobile / WhatsApp Number <span className="req">*</span>
                </label>
                <input
                  type="tel"
                  required
                  className="form-input"
                  value={ticketForm.phone}
                  onChange={(e) => setTicketForm({ ...ticketForm, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">
                  District <span className="req">*</span>
                </label>
                <select
                  className="form-select"
                  value={ticketForm.district}
                  onChange={(e) => setTicketForm({ ...ticketForm, district: e.target.value })}
                >
                  <option value="Colombo">Colombo District</option>
                  <option value="Gampaha">Gampaha District</option>
                  <option value="Kalutara">Kalutara District</option>
                  <option value="Other">Other Region</option>
                </select>
              </div>

              <div>
                <label className="form-label">
                  Support Category <span className="req">*</span>
                </label>
                <select
                  className="form-select"
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                >
                  <option value="Food & Clean Water Delay">Food & Clean Water Delay</option>
                  <option value="Medical Supply & Prescription Need">Medical Supply & Prescription Need</option>
                  <option value="Shelter Space & Accessibility Query">Shelter Space & Accessibility Query</option>
                  <option value="Elderly / Infant Special Care">Elderly / Infant Special Care</option>
                  <option value="Missing Person Tracing Report">Missing Person Tracing Report</option>
                  <option value="Volunteer / Community Coordination">Volunteer / Community Coordination</option>
                  <option value="Platform / Login Technical Support">Platform / Login Technical Support</option>
                  <option value="General Crisis Inquiry">General Crisis Inquiry</option>
                </select>
              </div>

              <div className="ticket-form-col-full">
                <label className="form-label">Urgency Priority</label>
                <div className="urgency-radio-group">
                  <div
                    className={`urgency-radio-box ${ticketForm.urgency === 'Normal' ? 'selected-normal' : ''}`}
                    onClick={() => setTicketForm({ ...ticketForm, urgency: 'Normal' })}
                  >
                    <strong>Normal</strong>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Response within 12 hours</div>
                  </div>

                  <div
                    className={`urgency-radio-box ${ticketForm.urgency === 'Urgent' ? 'selected-urgent' : ''}`}
                    onClick={() => setTicketForm({ ...ticketForm, urgency: 'Urgent' })}
                  >
                    <strong>Urgent</strong>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Response within 2-4 hours</div>
                  </div>

                  <div
                    className={`urgency-radio-box ${ticketForm.urgency === 'Critical' ? 'selected-critical' : ''}`}
                    onClick={() => setTicketForm({ ...ticketForm, urgency: 'Critical' })}
                  >
                    <strong>Critical Emergency</strong>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Immediate Field Escalation</div>
                  </div>
                </div>
              </div>

              <div className="ticket-form-col-full">
                <label className="form-label">
                  Subject Summary <span className="req">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Clean drinking water container request for 4 families on Low Level Rd"
                  className="form-input"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                />
              </div>

              <div className="ticket-form-col-full">
                <label className="form-label">
                  Detailed Inquiry Message <span className="req">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide precise location, landmarks, specific medical or food requirements, and any alternative contact numbers..."
                  className="form-textarea"
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                className="support-tab-btn"
                onClick={() => {
                  setTicketForm((prev) => ({
                    ...prev,
                    subject: '',
                    message: '',
                    urgency: 'Normal'
                  }));
                }}
              >
                Clear Form
              </button>

              <button type="submit" className="btn-submit-ticket">
                <Send size={16} />
                <span>Submit Ticket for Review</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* -------------------- C. TRACK TICKETS -------------------- */}
      {activeTab === 'track' && (
        <div className="track-tickets-wrap">
          <div className="track-search-bar">
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              className="track-search-input"
              placeholder="Search your tickets by ID (e.g. TIC-2026-7241), keyword, or category..."
              value={searchTicketQuery}
              onChange={(e) => setSearchTicketQuery(e.target.value)}
            />
            {searchTicketQuery && (
              <button
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                onClick={() => setSearchTicketQuery('')}
              >
                &times;
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredTickets.length === 0 ? (
              <div
                style={{
                  background: '#ffffff',
                  padding: '40px 20px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: '1px solid #e2e8f0'
                }}
              >
                <FileText size={36} color="#94a3b8" style={{ marginBottom: '8px' }} />
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px' }}>No Support Tickets Found</h3>
                <p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '13px' }}>
                  No tickets match your query. You can submit a new ticket anytime.
                </p>
                <button className="btn-submit-ticket" onClick={() => setActiveTab('ticket')}>
                  Submit a Support Ticket
                </button>
              </div>
            ) : (
              filteredTickets.map((t) => (
                <div key={t.id} className="ticket-item-card">
                  <div className="ticket-top-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="ticket-id-tag">{t.id}</span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{t.date}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        className={`ticket-badge-status ${
                          t.status === 'Resolved'
                            ? 'status-resolved'
                            : t.status === 'Dispatched'
                            ? 'status-dispatched'
                            : 'status-review'
                        }`}
                      >
                        {t.status}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: t.urgency === 'Critical' ? '#fee2e2' : '#f1f5f9',
                          color: t.urgency === 'Critical' ? '#b91c1c' : '#475569'
                        }}
                      >
                        {t.urgency}
                      </span>
                    </div>
                  </div>

                  <h3 className="ticket-subject">{t.subject}</h3>
                  <p className="ticket-desc">
                    <strong>Category:</strong> {t.category} &bull; <strong>District:</strong> {t.district}
                  </p>

                  {/* 4-Step Progress Indicator */}
                  <div className="ticket-timeline">
                    <div className="timeline-step">
                      <div className="step-circle done">
                        <Check size={12} />
                      </div>
                      <span className="step-label">Submitted</span>
                    </div>
                    <div className="timeline-step">
                      <div className={`step-circle ${t.statusStep >= 2 ? 'done' : 'active'}`}>
                        {t.statusStep >= 2 ? <Check size={12} /> : '2'}
                      </div>
                      <span className="step-label">Triage Review</span>
                    </div>
                    <div className="timeline-step">
                      <div
                        className={`step-circle ${
                          t.statusStep >= 3 ? (t.statusStep === 4 ? 'done' : 'active') : ''
                        }`}
                      >
                        {t.statusStep >= 4 ? <Check size={12} /> : '3'}
                      </div>
                      <span className="step-label">Action / Dispatch</span>
                    </div>
                    <div className="timeline-step">
                      <div className={`step-circle ${t.statusStep === 4 ? 'done' : ''}`}>
                        {t.statusStep === 4 ? <Check size={12} /> : '4'}
                      </div>
                      <span className="step-label">Resolved</span>
                    </div>
                  </div>

                  <div
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #f1f5f9',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      fontSize: '12.5px',
                      color: '#334155',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}
                  >
                    <div>
                      <strong>Assigned Unit:</strong> {t.assignedTo} &bull; <em>{t.lastUpdate}</em>
                    </div>
                    <button
                      className="chat-action-btn"
                      onClick={() => showAlert(`Coordinator notified for ticket ${t.id}`, 'info')}
                    >
                      <MessageSquare size={12} />
                      <span>Ping Coordinator</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* -------------------- D. GROUND HELP DESKS -------------------- */}
      {activeTab === 'desks' && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px 0' }}>
              Western Province Active Crisis Response Hubs
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Physical relief desks operated jointly by Disaster Management Center, Tri-Forces Command, and ReliefCore
              logistics.
            </p>
          </div>

          <div className="ground-desks-grid">
            {GROUND_HELP_DESKS.map((d) => (
              <div key={d.id} className="ground-desk-card">
                <div>
                  <div className="desk-title-row">
                    <div className="desk-icon-box">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <div className="desk-district">{d.district}</div>
                      <h3 className="desk-name">{d.name}</h3>
                    </div>
                  </div>

                  <div className="desk-details-list">
                    <div className="desk-detail-item">
                      <MapPin size={15} color="#0e6f76" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{d.location}</span>
                    </div>
                    <div className="desk-detail-item">
                      <UserCheck size={15} color="#0e6f76" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{d.officer}</span>
                    </div>
                    <div className="desk-detail-item">
                      <Clock size={15} color="#0e6f76" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{d.hours}</span>
                    </div>
                  </div>

                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    Available On-Site Stock:
                  </div>
                  <div className="desk-tags-row">
                    {d.supplies.map((s, sIdx) => (
                      <span key={sIdx} className="desk-supply-tag">
                        &bull; {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <a href={`tel:${d.phone.replace(/[^0-9]/g, '')}`} className="btn-hotline-call" style={{ flex: 1 }}>
                    <PhoneCall size={13} />
                    <span>Call Desk ({d.phone})</span>
                  </a>
                  <button
                    className="btn-hotline-copy"
                    onClick={() => handleCopy(d.location, `${d.name} Location`)}
                    title="Copy Address"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------- E. FAQS & OFFLINE GUIDE -------------------- */}
      {activeTab === 'faq' && (
        <div>
          <div className="track-search-bar" style={{ marginBottom: '18px' }}>
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              className="track-search-input"
              placeholder="Search frequently asked questions (e.g. food delay, shelter rules, pet policy)..."
              value={faqSearchQuery}
              onChange={(e) => setFaqSearchQuery(e.target.value)}
            />
          </div>

          <div className="faq-accordions-wrap">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div key={idx} className="faq-card">
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  {isOpen && (
                    <div className="faq-answer-box">
                      <p style={{ margin: '0 0 10px 0' }}>{faq.a}</p>
                      <span style={{ fontSize: '11px', color: '#0e6f76', fontWeight: 700, textTransform: 'uppercase' }}>
                        Category: {faq.cat}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Offline Emergency SMS Card */}
          <div className="offline-sos-card">
            <div className="offline-text-wrap">
              <h3>Offline SMS & USSD Support (When Data / Wi-Fi is Down)</h3>
              <p>
                In case of telecommunication cell tower congestion or power loss, you can still dispatch an SOS via
                standard 2G SMS or USSD code without consuming data credits.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="offline-code-badge">SMS: RELIEF to 8822</div>
              <div className="offline-code-badge">USSD: *117#</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
