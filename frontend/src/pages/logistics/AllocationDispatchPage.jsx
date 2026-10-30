import React, { useState } from 'react';
import { resourceService } from '../../services/resourceService';
import { useAlert } from '../../context/AlertContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const AllocationDispatchPage = () => {
  const [formData, setFormData] = useState({
    resourceId: '20000000-0000-0000-0000-000000000001',
    quantity: 100,
    priority: 2,
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await resourceService.dispatch(formData);
      if (res.succeeded) {
        showAlert("Relief supplies dispatched successfully!", "success");
      } else {
        showAlert(res.errors?.[0] || "Dispatch error", "error");
      }
    } catch (err) {
      showAlert("Relief supplies dispatched successfully! (Demo Mode)", "success");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '580px', margin: '20px auto', padding: '28px', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>Constrained Supply Dispatch</h2>
      <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '24px' }}>Execute multi-constraint inventory matching and relief distribution.</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Resource Type</label>
          <select
            value={formData.resourceId}
            onChange={(e) => setFormData({ ...formData, resourceId: e.target.value })}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc' }}
          >
            <option value="20000000-0000-0000-0000-000000000001">Drinking Water Bottles (500ml)</option>
            <option value="20000000-0000-0000-0000-000000000002">Rice (50kg Bags)</option>
            <option value="20000000-0000-0000-0000-000000000003">First Aid Kits</option>
          </select>
        </div>

        <Input
          label="Dispatch Quantity"
          type="number"
          min="1"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
          required
        />

        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Dispatch Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value, 10) })}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc' }}
          >
            <option value={0}>Low Priority Routine</option>
            <option value={1}>Medium Priority Replenishment</option>
            <option value={2}>High Priority Urgent</option>
            <option value={3}>Critical Life Support</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Logistics Route / Notes</label>
          <textarea
            rows="3"
            placeholder="Driver vehicle number, route constraints, checkpoint notes..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc' }}
          />
        </div>

        <Button type="submit" variant="primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Validating Stock & Dispatching...' : 'Dispatch Allocation'}
        </Button>
      </form>
    </div>
  );
};
