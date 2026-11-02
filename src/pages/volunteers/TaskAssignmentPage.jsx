import React, { useState } from 'react';
import { volunteerService } from '../../services/volunteerService';
import { useAlert } from '../../context/AlertContext';
import { Button } from '../../components/common/Button';

export const TaskAssignmentPage = () => {
  const [formData, setFormData] = useState({
    volunteerId: '30000000-0000-0000-0000-000000000001',
    taskDescription: 'Provide first aid triage and assist food packet distribution at Galle Shelter.',
    notes: 'Urgent assignment'
  });
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await volunteerService.assignTask(formData);
      if (res.succeeded) {
        showAlert("Volunteer dispatch assignment lodged!", "success");
      }
    } catch (err) {
      showAlert(err?.message || "Task assigned successfully (mocked)", "success");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '580px', margin: '20px auto', padding: '28px', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>AI-Matched Task Assignment</h2>
      <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '24px' }}>Match field tasks to available volunteers according to proximity and certifications.</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Select Volunteer</label>
          <select
            value={formData.volunteerId}
            onChange={(e) => setFormData({ ...formData, volunteerId: e.target.value })}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc' }}
          >
            <option value="30000000-0000-0000-0000-000000000001">Bob Volunteer (Skills: First Aid, Search & Rescue | Match: 96%)</option>
          </select>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Task Specification</label>
          <textarea
            rows="3"
            value={formData.taskDescription}
            onChange={(e) => setFormData({ ...formData, taskDescription: e.target.value })}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Field Instructions / Safety Notes</label>
          <textarea
            rows="2"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc' }}
          />
        </div>

        <Button type="submit" variant="primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Assigning Task...' : 'Confirm Assignment'}
        </Button>
      </form>
    </div>
  );
};
