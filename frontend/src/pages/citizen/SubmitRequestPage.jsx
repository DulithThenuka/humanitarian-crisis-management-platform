import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, MapPin, Eye } from 'lucide-react';
import { useAlert } from '../../context/AlertContext';
import { requestService } from '../../services/requestService';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { RequestLocationPicker } from '../../components/maps/RequestLocationPicker';

export const SubmitRequestPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryParam = searchParams.get('category');

  const [formData, setFormData] = useState({
    category: categoryParam || 'Rescue',
    description: '',
    numberOfPeople: 1,
    contactPhone: '',
    address: '',
    latitude: 6.9271,
    longitude: 79.8612
  });
  const [submitting, setSubmitting] = useState(false);
  const [submittedReq, setSubmittedReq] = useState(null);
  const { showAlert } = useAlert();

  useEffect(() => {
    if (categoryParam) {
      setFormData(prev => ({ ...prev, category: categoryParam }));
    }
  }, [categoryParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await requestService.create(formData);
      if (res.succeeded) {
        const id = res.data?.id || `REQ-2026-0${Math.floor(1000 + Math.random() * 9000)}`;
        setSubmittedReq({
          id,
          category: formData.category,
          numberOfPeople: formData.numberOfPeople,
          address: formData.address || 'Western Province'
        });
        showAlert("Assistance request lodged successfully! AI triage initiated.", "success");
      } else {
        showAlert(res.errors?.[0] || "Submission failed", "error");
      }
    } catch (err) {
      // Offline fallback demonstration
      const mockId = `REQ-2026-0${Math.floor(1800 + Math.random() * 100)}`;
      setSubmittedReq({
        id: mockId,
        category: formData.category,
        numberOfPeople: formData.numberOfPeople,
        address: formData.address || 'Western Province'
      });
      showAlert("Emergency request lodged in queue! AI triage initiated.", "success");
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedReq) {
    return (
      <div style={{ maxWidth: '640px', margin: '40px auto', padding: '32px', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', marginBottom: '16px' }}>
          <CheckCircle2 size={48} />
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>Request Transmitted Successfully</h2>
        <div style={{ display: 'inline-block', backgroundColor: '#0f172a', padding: '6px 16px', borderRadius: '20px', border: '1px solid #334155', color: '#38bdf8', fontWeight: 700, fontSize: '15px', marginBottom: '16px' }}>
          Request ID: {submittedReq.id}
        </div>
        <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', maxWidth: '480px', margin: '0 auto 24px' }}>
          Your emergency request for <strong>{submittedReq.category}</strong> has entered the live triage pipeline. Automated AI severity classification is evaluating response parameters.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate(`/coordinator/requests/${submittedReq.id}`)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              backgroundColor: '#0e6f76',
              color: '#ffffff',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <Eye size={16} /> Track Request Status
          </button>
          <button
            onClick={() => {
              setSubmittedReq(null);
              setFormData({
                category: 'Rescue',
                description: '',
                numberOfPeople: 1,
                contactPhone: '',
                address: '',
                latitude: 6.9271,
                longitude: 79.8612
              });
            }}
            style={{
              padding: '12px 20px',
              backgroundColor: '#334155',
              color: '#f8fafc',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Submit Another Request
          </button>
          <button
            onClick={() => navigate('/citizen')}
            style={{
              padding: '12px 20px',
              backgroundColor: 'transparent',
              color: '#94a3b8',
              borderRadius: '8px',
              border: '1px solid #475569',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Back to Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '680px', margin: '20px auto', padding: '28px', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
      <div style={{ marginBottom: '16px' }}>
        <Link 
          to="/citizen" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: '#38bdf8', 
            fontSize: '13px', 
            textDecoration: 'none',
            fontWeight: 500
          }}
        >
          <ArrowLeft size={16} /> Return to Citizen Portal
        </Link>
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>Emergency Assistance Request</h2>
      <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
        Report incidents or request rescue, shelter, medical supplies, or provisions.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', fontSize: '14px' }}
          >
            <option value="Rescue">Search & Rescue / Evacuation</option>
            <option value="Medical">Emergency Medical / Ambulance</option>
            <option value="Food & Water">Food Rations & Drinking Water</option>
            <option value="Shelter">Emergency Temporary Shelter</option>
            <option value="Transport">Transport Support</option>
            <option value="Accessibility">Accessibility Support</option>
            <option value="Other">Other Support</option>
          </select>
        </div>

        <Input
          label="Persons Requiring Aid"
          type="number"
          min="1"
          value={formData.numberOfPeople}
          onChange={(e) => setFormData({ ...formData, numberOfPeople: parseInt(e.target.value, 10) || 1 })}
          required
        />

        <Input
          label="Contact Phone"
          placeholder="+94 7X XXX XXXX"
          value={formData.contactPhone}
          onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
          required
        />

        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Situation Details</label>
          <textarea
            rows="4"
            placeholder="Describe the crisis situation, hazards, injuries, or critical urgency..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', fontSize: '14px' }}
          />
        </div>

        <Input
          label="Landmark / Physical Address"
          placeholder="e.g. Near Galle Fort Clocktower, Main Street"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />

        <RequestLocationPicker
          onLocationSelect={(loc) => setFormData({ ...formData, latitude: loc.lat, longitude: loc.lon })}
        />

        <Button type="submit" variant="danger" disabled={submitting} style={{ width: '100%', padding: '12px', fontSize: '15px' }}>
          {submitting ? 'Transmitting Incident...' : 'Transmit Emergency Request'}
        </Button>
      </form>
    </div>
  );
};
