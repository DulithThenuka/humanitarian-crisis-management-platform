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
  ChevronRight,
  ChevronLeft,
  Loader2,
  AlertTriangle,
  MapPin,
  Phone,
  Users,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { ASSISTANCE_CATEGORIES } from '../data/citizenPortalData';
import { requestService } from '../../../services/requestService';
import { useAuth } from '../../../context/AuthContext';

export const SubmitAssistanceView = ({ onSelectTab, showToast }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Needs
  const [selectedCats, setSelectedCats] = useState(['shelter']);
  const [title, setTitle] = useState('Urgent Shelter & Clean Drinking Water Needed');
  const [peopleCount, setPeopleCount] = useState('4');
  const [description, setDescription] = useState(
    'Flood water entered ground level of residential home. Family evacuated to safe elevated roadside.'
  );
  const [specificNeeds, setSpecificNeeds] = useState(
    'Temporary dry accommodation for 4 people including 1 elderly family member. Need drinking water rations.'
  );

  // Step 2: Location & Contact
  const [address, setAddress] = useState(user?.location || user?.assignedDistrict || 'Kelani East Main Road, Kelaniya');
  const [district, setDistrict] = useState(user?.assignedDistrict || 'Gampaha');
  const [contactPhone, setContactPhone] = useState(user?.phoneNumber || user?.phone || '+94 77 123 4567');
  const [contactMethod, setContactMethod] = useState('Phone Call & SMS');
  const [vulnerabilities, setVulnerabilities] = useState('Elderly parent with limited mobility');

  // Step 3: Review & Submit
  const [consentConfirmed, setConsentConfirmed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const toggleCategory = (id) => {
    setErrorMessage(null);
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

  const validateStep1 = () => {
    if (!selectedCats || selectedCats.length === 0) {
      setErrorMessage('Please select at least one assistance category.');
      return false;
    }
    if (!title.trim()) {
      setErrorMessage('Please enter a brief title for your request.');
      return false;
    }
    const countNum = parseInt(peopleCount, 10);
    if (isNaN(countNum) || countNum < 1) {
      setErrorMessage('Number of people affected must be at least 1.');
      return false;
    }
    if (!description.trim()) {
      setErrorMessage('Please describe the crisis situation.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const validateStep2 = () => {
    if (!address.trim()) {
      setErrorMessage('Please specify your current location or street address.');
      return false;
    }
    if (!contactPhone.trim()) {
      setErrorMessage('Please provide a contact telephone number for verification.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!consentConfirmed) {
      setErrorMessage('Please confirm your consent for emergency relief coordination.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const categoryLabels = selectedCats
        .map((catId) => ASSISTANCE_CATEGORIES.find((c) => c.id === catId)?.label)
        .filter(Boolean);
      const category = categoryLabels.length > 0 ? categoryLabels.join(', ') : 'Emergency Assistance';

      const narrativeParts = [];
      if (title.trim()) narrativeParts.push(`[${title.trim()}]`);
      if (description.trim()) narrativeParts.push(description.trim());
      if (specificNeeds.trim()) narrativeParts.push(`Specific needs: ${specificNeeds.trim()}`);
      if (vulnerabilities.trim()) narrativeParts.push(`Vulnerabilities / Medical considerations: ${vulnerabilities.trim()}`);
      if (contactMethod) narrativeParts.push(`Preferred contact: ${contactMethod}`);
      const fullDescription = narrativeParts.join('\n\n');

      const fullAddress = district ? `${address.trim()}, ${district}` : address.trim();

      const payload = {
        category,
        description: fullDescription,
        numberOfPeople: parseInt(peopleCount, 10) || 1,
        urgency: 1, // Medium baseline - backend AI re-evaluates
        address: fullAddress,
        contactPhone: contactPhone.trim()
      };

      const response = await requestService.create(payload);

      if (response && (response.succeeded || response.data || response.id)) {
        const created = response.data || response;
        const refId = created?.id ? `REQ-${created.id.toString().substring(0, 8).toUpperCase()}` : 'REQ';
        if (showToast) {
          showToast(`Assistance request ${refId} submitted successfully for coordinator review`);
        }
        onSelectTab('requests');
      } else {
        const errDetail =
          response?.errors?.[0] || response?.message || 'Failed to submit assistance request.';
        setErrorMessage(errDetail);
      }
    } catch (err) {
      const status = err.response?.status;
      let errorText;
      if (status === 401) {
        errorText = 'Your session has expired. Please sign in again to submit your request.';
      } else if (status === 403) {
        errorText = 'Access forbidden. Your account does not have permission to submit assistance requests.';
      } else {
        errorText =
          err.response?.data?.errors?.[0] ||
          err.response?.data?.message ||
          err.message ||
          'Unable to submit your assistance request. Please try again.';
      }
      setErrorMessage(errorText);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'What help do you need?';
      case 2:
        return 'Where can relief teams reach you?';
      case 3:
        return 'Review & Confirm Your Request';
      default:
        return 'Assistance Request';
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1:
        return 'Select required aid categories and tell us what happened.';
      case 2:
        return 'Provide accurate location coordinates and reachable contact numbers.';
      case 3:
        return 'Verify the details before submitting to emergency response dispatch.';
      default:
        return '';
    }
  };

  return (
    <div className="cp-view-container">
      {/* Header */}
      <div className="cp-view-header">
        <div>
          <span className="cp-view-pretitle">ASSISTANCE REQUEST · STEP {currentStep} OF 3</span>
          <h1 className="cp-view-title">{getStepTitle()}</h1>
          <p className="cp-view-subtitle">{getStepSubtitle()}</p>
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
        {/* Step 1 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => currentStep > 1 && setCurrentStep(1)}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: currentStep >= 1 ? '#1e3d2c' : '#edf1eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700
            }}
          >
            {currentStep > 1 ? '✓' : '1'}
          </div>
          <span style={{ fontSize: '12px', fontWeight: currentStep === 1 ? 700 : 500, color: currentStep === 1 ? '#162e20' : '#657367' }}>
            Your Needs
          </span>
        </div>

        <div style={{ flex: 1, height: '2px', backgroundColor: currentStep >= 2 ? '#1e3d2c' : '#d4ded3', margin: '0 16px' }} />

        {/* Step 2 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: currentStep > 2 ? 'pointer' : 'default' }} onClick={() => currentStep > 2 && setCurrentStep(2)}>
          <div
            style={{
              width: '28px',
              height: '28px',
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
            {currentStep > 2 ? '✓' : '2'}
          </div>
          <span style={{ fontSize: '12px', fontWeight: currentStep === 2 ? 700 : 500, color: currentStep === 2 ? '#162e20' : '#657367' }}>
            Location & Contact
          </span>
        </div>

        <div style={{ flex: 1, height: '2px', backgroundColor: currentStep >= 3 ? '#1e3d2c' : '#d4ded3', margin: '0 16px' }} />

        {/* Step 3 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
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
          <span style={{ fontSize: '12px', fontWeight: currentStep === 3 ? 700 : 500, color: currentStep === 3 ? '#162e20' : '#657367' }}>
            Review & Submit
          </span>
        </div>
      </div>

      {/* Split Form & Helper Card */}
      <div className="cp-grid-split">
        {/* Left Form (2/3 width) */}
        <div className="cp-card">
          <form onSubmit={currentStep === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            {errorMessage && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#991b1b',
                  marginBottom: '18px'
                }}
              >
                <AlertTriangle size={18} style={{ color: '#dc2626', flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: YOUR NEEDS */}
            {currentStep === 1 && (
              <div>
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#162e20' }}>
                    Assistance categories *
                  </div>
                  <div style={{ fontSize: '11px', color: '#657367', marginTop: '2px' }}>
                    Choose every type of help that currently applies.
                  </div>

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

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label className="cp-form-label">Brief title *</label>
                    <input
                      type="text"
                      required
                      className="cp-form-input"
                      value={title}
                      placeholder="e.g. Urgent Shelter & Water Needed"
                      onChange={(e) => {
                        setErrorMessage(null);
                        setTitle(e.target.value);
                      }}
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
                      onChange={(e) => {
                        setErrorMessage(null);
                        setPeopleCount(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label className="cp-form-label">Describe what happened *</label>
                  <textarea
                    rows={3}
                    required
                    className="cp-form-textarea"
                    placeholder="Provide details about the crisis event and immediate situation..."
                    value={description}
                    onChange={(e) => {
                      setErrorMessage(null);
                      setDescription(e.target.value);
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label className="cp-form-label">What specific assistance do you need?</label>
                  <textarea
                    rows={2}
                    className="cp-form-textarea"
                    placeholder="Mention specific dietary, baby items, medical equipment, or accommodation needs..."
                    value={specificNeeds}
                    onChange={(e) => {
                      setErrorMessage(null);
                      setSpecificNeeds(e.target.value);
                    }}
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
                  <button
                    type="button"
                    onClick={handleNext}
                    className="cp-btn-primary"
                  >
                    Next: Location & Contact
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: LOCATION & CONTACT */}
            {currentStep === 2 && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label className="cp-form-label">Current Address / Safe Location *</label>
                    <input
                      type="text"
                      required
                      className="cp-form-input"
                      placeholder="Street, landmark, or temporary evacuation spot"
                      value={address}
                      onChange={(e) => {
                        setErrorMessage(null);
                        setAddress(e.target.value);
                      }}
                    />
                  </div>

                  <div>
                    <label className="cp-form-label">Administrative District *</label>
                    <select
                      className="cp-form-select"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                    >
                      <option value="Colombo">Colombo</option>
                      <option value="Gampaha">Gampaha</option>
                      <option value="Kalutara">Kalutara</option>
                      <option value="Kandy">Kandy</option>
                      <option value="Galle">Galle</option>
                      <option value="Matara">Matara</option>
                      <option value="Ratnapura">Ratnapura</option>
                      <option value="Kegalle">Kegalle</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label className="cp-form-label">Reachable Phone Number *</label>
                    <input
                      type="text"
                      required
                      className="cp-form-input"
                      placeholder="+94 77 123 4567"
                      value={contactPhone}
                      onChange={(e) => {
                        setErrorMessage(null);
                        setContactPhone(e.target.value);
                      }}
                    />
                  </div>

                  <div>
                    <label className="cp-form-label">Preferred Contact Method</label>
                    <select
                      className="cp-form-select"
                      value={contactMethod}
                      onChange={(e) => setContactMethod(e.target.value)}
                    >
                      <option value="Phone Call & SMS">Phone Call & SMS</option>
                      <option value="Phone Call Only">Phone Call Only</option>
                      <option value="SMS Only">SMS Only</option>
                      <option value="WhatsApp">WhatsApp</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label className="cp-form-label">Accessibility & Vulnerabilities (Optional)</label>
                  <input
                    type="text"
                    className="cp-form-input"
                    placeholder="e.g., Infant in household, wheelchair user, chronic medication needed"
                    value={vulnerabilities}
                    onChange={(e) => setVulnerabilities(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="cp-btn-secondary"
                  >
                    <ChevronLeft size={16} />
                    Back: Your Needs
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="cp-btn-primary"
                  >
                    Next: Review & Submit
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW & SUBMIT */}
            {currentStep === 3 && (
              <div>
                <div style={{ marginBottom: '18px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#162e20', marginBottom: '8px' }}>
                    Request Summary
                  </h3>
                  <p style={{ fontSize: '12px', color: '#657367', margin: 0 }}>
                    Please verify your crisis assistance details before final dispatch.
                  </p>
                </div>

                {/* Summary Table */}
                <div
                  style={{
                    backgroundColor: '#f8faf7',
                    border: '1px solid #d4ded3',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    marginBottom: '20px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #edf1eb', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#738075', fontWeight: 600 }}>Categories</span>
                    <span style={{ fontSize: '12px', color: '#162e20', fontWeight: 700 }}>
                      {selectedCats
                        .map((c) => ASSISTANCE_CATEGORIES.find((cat) => cat.id === c)?.label)
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #edf1eb', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#738075', fontWeight: 600 }}>Title</span>
                    <span style={{ fontSize: '12px', color: '#162e20', fontWeight: 700 }}>{title}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #edf1eb', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#738075', fontWeight: 600 }}>People Affected</span>
                    <span style={{ fontSize: '12px', color: '#162e20', fontWeight: 700 }}>{peopleCount} individuals</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #edf1eb', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#738075', fontWeight: 600 }}>Location</span>
                    <span style={{ fontSize: '12px', color: '#162e20', fontWeight: 700 }}>{address}, {district}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #edf1eb', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#738075', fontWeight: 600 }}>Contact Phone</span>
                    <span style={{ fontSize: '12px', color: '#162e20', fontWeight: 700 }}>{contactPhone} ({contactMethod})</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#738075', fontWeight: 600 }}>Situation Description</span>
                    <span style={{ fontSize: '12px', color: '#243328', lineHeight: 1.4 }}>{description}</span>
                  </div>

                  {specificNeeds && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid #edf1eb', paddingTop: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#738075', fontWeight: 600 }}>Specific Needs & Vulnerabilities</span>
                      <span style={{ fontSize: '12px', color: '#243328', lineHeight: 1.4 }}>{specificNeeds} · {vulnerabilities}</span>
                    </div>
                  )}
                </div>

                {/* Consent Checkbox */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    marginBottom: '24px',
                    padding: '12px',
                    backgroundColor: '#edf4ec',
                    borderRadius: '8px',
                    border: '1px solid #dbe4c6'
                  }}
                >
                  <input
                    type="checkbox"
                    id="consent"
                    checked={consentConfirmed}
                    onChange={(e) => setConsentConfirmed(e.target.checked)}
                    style={{ marginTop: '3px', cursor: 'pointer' }}
                  />
                  <label htmlFor="consent" style={{ fontSize: '12px', color: '#243328', cursor: 'pointer', lineHeight: 1.45 }}>
                    <strong>Consent Declaration:</strong> I confirm that this assistance request is accurate and grant permission for emergency response coordinators, logistics personnel, and registered volunteers to process my location and contact details for relief delivery.
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="cp-btn-secondary"
                    disabled={isSubmitting}
                  >
                    <ChevronLeft size={16} />
                    Back: Location & Contact
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="cp-btn-primary"
                    disabled={isSubmitting || !consentConfirmed}
                    style={isSubmitting ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
                  >
                    {isSubmitting ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <Loader2 size={16} className="animate-spin" />
                        Submitting to Crisis Dispatch...
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle2 size={16} />
                        Submit Assistance Request
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Right Helper Card (1/3 width) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="cp-card">
            <h3 className="cp-card-title" style={{ marginBottom: '16px' }}>
              Need immediate guidance?
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
                    Get guidance about categories, prioritization, and relief shelters.
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
                    Platform Support
                  </div>
                  <div style={{ fontSize: '11px', color: '#657367', marginTop: '2px' }}>
                    For technical assistance with submitting this application.
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '20px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#fffbeb',
                border: '1px solid #fde68a',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start'
              }}
            >
              <ShieldCheck size={16} style={{ color: '#b45309', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '11px', color: '#92400e', lineHeight: 1.45 }}>
                Your request will be triaged by automated urgency scoring and reviewed by certified disaster coordinators.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitAssistanceView;
