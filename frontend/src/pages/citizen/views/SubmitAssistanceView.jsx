import React, { useState } from 'react';
import {
  Utensils,
  Droplet,
  Heart,
  Home,
  Bus,
  HeartPulse,
  Accessibility,
  Plus,
  Sparkles,
  HelpCircle,
  Check,
  ChevronRight
} from 'lucide-react';
import { ASSISTANCE_CATEGORIES } from '../data/citizenPortalData';

export const SubmitAssistanceView = ({ onSelectTab, showToast }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCats, setSelectedCats] = useState(['shelter']);
  const [title, setTitle] = useState('Shelter needed after home flooding');
  const [peopleCount, setPeopleCount] = useState('6');
  const [description, setDescription] = useState(
    'Flood water entered our home overnight. We moved to a safer roadside location.'
  );
  const [specificNeeds, setSpecificNeeds] = useState(
    'Dry emergency accommodation for 6 people including 2 children and 1 elderly relative.'
  );

  const toggleCategory = (id) => {
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const getIcon = (type) => {
    switch (type) {
      case 'utensils':
        return <Utensils size={18} />;
      case 'droplet':
        return <Droplet size={18} />;
      case 'pill':
        return <Heart size={18} />;
      case 'home':
        return <Home size={18} />;
      case 'bus':
        return <Bus size={18} />;
      case 'pulse':
        return <HeartPulse size={18} />;
      case 'accessibility':
        return <Accessibility size={18} />;
      default:
        return <Plus size={18} />;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showToast) {
      showToast('Assistance request HMR-1043 submitted for priority coordinator review');
    }
    onSelectTab('requests');
  };

  return (
    <div className="cp-view-container">
      {/* Header */}
      <div className="cp-view-header">
        <div>
          <span className="cp-view-pretitle">ASSISTANCE REQUEST · STEP {currentStep} OF 3</span>
          <h1 className="cp-view-title">What help do you need?</h1>
          <p className="cp-view-subtitle">
            Tell us what happened. You can select more than one type of help.
          </p>
        </div>
      </div>

      {/* Stepper Progress */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '560px',
          margin: '0 auto 28px auto',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: '#1e3d2c',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700
            }}
          >
            1
          </div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#162e20' }}>Your Needs</span>
        </div>

        <div style={{ flex: 1, height: '2px', backgroundColor: '#d4ded3', margin: '0 16px' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: currentStep >= 2 ? '#1e3d2c' : '#edf1eb',
              color: currentStep >= 2 ? '#ffffff' : '#738075',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700
            }}
          >
            2
          </div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#657367' }}>Location & Details</span>
        </div>

        <div style={{ flex: 1, height: '2px', backgroundColor: '#d4ded3', margin: '0 16px' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: currentStep >= 3 ? '#1e3d2c' : '#edf1eb',
              color: currentStep >= 3 ? '#ffffff' : '#738075',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700
            }}
          >
            3
          </div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#657367' }}>Review & Submit</span>
        </div>
      </div>

      {/* Split Form & Helper Card */}
      <div className="cp-grid-split">
        {/* Left Form (2/3 width) */}
        <div className="cp-card">
          <form onSubmit={handleSubmit}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#162e20' }}>
                Assistance categories *
              </div>
              <div style={{ fontSize: '11px', color: '#657367', marginTop: '2px' }}>
                Choose every type of help that currently applies.
              </div>

              {/* 8 Category Cards */}
              <div className="cp-categories-grid">
                {ASSISTANCE_CATEGORIES.map((cat) => {
                  const isChecked = selectedCats.includes(cat.id);
                  return (
                    <div
                      key={cat.id}
                      className={`cp-cat-card ${isChecked ? 'selected' : ''}`}
                      onClick={() => toggleCategory(cat.id)}
                    >
                      <div className="cp-cat-check">
                        {isChecked && <Check size={12} strokeWidth={3} />}
                      </div>
                      <div style={{ color: isChecked ? '#1e3d2c' : '#405044' }}>
                        {getIcon(cat.icon)}
                      </div>
                      <span className="cp-cat-label">{cat.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="cp-form-label">Brief title *</label>
                <input
                  type="text"
                  required
                  className="cp-form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="cp-form-label">Number of people affected *</label>
                <input
                  type="number"
                  min="1"
                  required
                  className="cp-form-input"
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="cp-form-label">Describe what happened *</label>
              <textarea
                rows={3}
                required
                className="cp-form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label className="cp-form-label">What help do you need? *</label>
              <textarea
                rows={3}
                required
                className="cp-form-textarea"
                placeholder="Mention urgent dietary, baby items, medical equipment or shelter considerations..."
                value={specificNeeds}
                onChange={(e) => setSpecificNeeds(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={() => onSelectTab('dashboard')}
                className="cp-btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="cp-btn-primary">
                Submit Assistance Request
              </button>
            </div>
          </form>
        </div>

        {/* Right Helper Card (1/3 width) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="cp-card">
            <h3 className="cp-card-title" style={{ marginBottom: '16px' }}>
              Need help?
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{ display: 'flex', gap: '12px', cursor: 'pointer' }}
                onClick={() => onSelectTab('ai-assistance')}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#edf4ec',
                    color: '#1e3d2c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Sparkles size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#162e20' }}>
                    Ask HumanAid Assistant
                  </div>
                  <div style={{ fontSize: '11px', color: '#657367', marginTop: '2px' }}>
                    Get guidance about categories and form fields.
                  </div>
                </div>
              </div>

              <div
                style={{ display: 'flex', gap: '12px', cursor: 'pointer' }}
                onClick={() => onSelectTab('support')}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#edf4ec',
                    color: '#1e3d2c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <HelpCircle size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#162e20' }}>
                    Contact platform support
                  </div>
                  <div style={{ fontSize: '11px', color: '#657367', marginTop: '2px' }}>
                    For help using this form, not emergency rescue.
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #edf1eb' }}>
              <button
                onClick={() => onSelectTab('support')}
                style={{ background: 'none', border: 'none', color: '#1e3d2c', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
              >
                Open help centre &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitAssistanceView;
