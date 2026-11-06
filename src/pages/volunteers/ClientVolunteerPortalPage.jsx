import React, { useState } from 'react';

export const ClientVolunteerPortalPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    skills: [],
    maxTravelDistance: 25,
    availability: 'AVAILABLE',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const skillOptions = [
    'First Aid / Medical',
    'Search & Rescue',
    'Food & Water Distribution',
    'Logistics & Transport',
    'Driver (Heavy Vehicles)',
    'Child Care & Psychosocial Support',
    'Shelter Management',
    'Technical / IT Support'
  ];

  const handleSkillToggle = (skill) => {
    setFormData(prev => {
      const exists = prev.skills.includes(skill);
      if (exists) {
        return { ...prev, skills: prev.skills.filter(s => s !== skill) };
      } else {
        return { ...prev, skills: [...prev.skills, skill] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      alert('Please fill in all required fields.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div style={{ backgroundColor: '#0b0f19', minHeight: '100vh', color: '#f8fafc', padding: '40px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px' }}>
            RELIEFCORE VOLUNTEER NETWORK
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginTop: '12px', marginBottom: '8px', color: '#ffffff' }}>
            Join as a Field Volunteer
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
            Register your skills and availability to support disaster management operations and help communities in need.
          </p>
        </div>

        {submitted ? (
          <div style={{ backgroundColor: '#131c2e', border: '1px solid #10b981', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ color: '#34d399', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Registration Successful!</h2>
            <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
              Thank you for joining the RELIEFCORE volunteer network. <br/>
              Our coordinator will reach out to you via phone or email shortly.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              style={{ marginTop: '24px', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
            >
              Register Another Volunteer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ backgroundColor: '#131c2e', border: '1px solid #1e293b', borderRadius: '16px', padding: '32px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}>
            
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#38bdf8', marginBottom: '20px', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
              1. Personal Information
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#0b0f19', border: '1px solid #334155', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>Email Address *</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#0b0f19', border: '1px solid #334155', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>Phone Number *</label>
                <input
                  type="tel"
                  placeholder="+94 77 123 4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#0b0f19', border: '1px solid #334155', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>Location / Address</label>
                <input
                  type="text"
                  placeholder="Colombo / Gampaha"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#0b0f19', border: '1px solid #334155', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
              </div>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#38bdf8', marginBottom: '16px', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
              2. Skills & Capabilities
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '14px' }}>Select areas where you can provide assistance:</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
              {skillOptions.map((skill) => {
                const isSelected = formData.skills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSkillToggle(skill)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '20px',
                      border: isSelected ? '1px solid #3b82f6' : '1px solid #334155',
                      backgroundColor: isSelected ? '#1e40af' : '#0b0f19',
                      color: isSelected ? '#ffffff' : '#94a3b8',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isSelected ? '✓ ' : '+ '} {skill}
                  </button>
                );
              })}
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#38bdf8', marginBottom: '16px', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
              3. Availability & Travel Radius
            </h3>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>
                Maximum Travel Distance: <strong style={{ color: '#38bdf8' }}>{formData.maxTravelDistance} km</strong>
              </label>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={formData.maxTravelDistance}
                onChange={(e) => setFormData({ ...formData, maxTravelDistance: e.target.value })}
                style={{ width: '100%', accentColor: '#3b82f6', cursor: 'pointer' }}
              />
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>Additional Notes / Special Capabilities</label>
              <textarea
                rows="3"
                placeholder="e.g., Heavy vehicle license available, First aid certified..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                style={{ width: '100%', padding: '12px', backgroundColor: '#0b0f19', border: '1px solid #334155', borderRadius: '8px', color: '#fff', outline: 'none', resize: 'none' }}
              ></textarea>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '14px',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
              }}
            >
              Register as Volunteer
            </button>

          </form>
        )}
      </div>
    </div>
  );
};