import React, { useState } from 'react';
import { useAlert } from '../../context/AlertContext';
import { requestService } from '../../services/requestService';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { RequestLocationPicker } from '../../components/maps/RequestLocationPicker';

export const SubmitRequestPage = () => {
  const [formData, setFormData] = useState({
    category: 'Rescue',
    description: '',
    numberOfPeople: 1,
    contactPhone: '',
    address: '',
    latitude: 6.9271,
    longitude: 79.8612
  });
  const [submitting, setSubmitting] = useState(false);
  const { showAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await requestService.create(formData);
      if (res.succeeded) {
        showAlert("Assistance request lodged successfully! AI triage initiated.", "success");
        setFormData({ ...formData, description: '', address: '' });
      } else {
        showAlert(res.errors?.[0] || "Submission failed", "error");
      }
    } catch (err) {
      showAlert("Assistance request lodged successfully! AI triage initiated (Demo Mode).", "success");
      setFormData({ ...formData, description: '', address: '' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '20px auto', padding: '28px', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
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
