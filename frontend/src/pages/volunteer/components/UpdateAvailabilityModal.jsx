import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Check } from 'lucide-react';
import { SERVICE_AREAS } from '../data/volunteerData';

export const UpdateAvailabilityModal = ({ user, onClose, onSave }) => {
  const [dutyStatus, setDutyStatus] = useState(user.dutyStatus);
  const [loggedTime, setLoggedTime] = useState(user.dutyLoggedTime);
  const [serviceArea, setServiceArea] = useState(user.serviceArea);

  const handleConfirm = () => {
    onSave({
      dutyStatus,
      dutyLoggedTime: loggedTime,
      serviceArea
    });
    onClose();
  };

  return (
    <div className="vol-modal-backdrop" onClick={onClose}>
      <div className="vol-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="vol-modal-header">
          <h3 className="vol-modal-title">Update Volunteer Availability</h3>
          <button className="vol-modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="vol-modal-body">
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#f8fafc', border: '1px solid #e2e8e0', borderRadius: '8px', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#183526' }}>
                  Available for Field Deployments
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                  Coordinators can allocate urgent tasks to your roster
                </div>
              </div>
              <input
                type="checkbox"
                checked={dutyStatus}
                onChange={(e) => setDutyStatus(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#183526' }}
              />
            </label>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
              Availability Notes / Shift Preference
            </label>
            <input
              type="text"
              className="vol-select-field"
              value={loggedTime}
              onChange={(e) => setLoggedTime(e.target.value)}
              placeholder="e.g. Logged 18:00 - Logistics, First Aid and Shelter shifts"
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
              Active Service Area
            </label>
            <select
              className="vol-select-field"
              value={serviceArea}
              onChange={(e) => setServiceArea(e.target.value)}
            >
              {SERVICE_AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="vol-modal-footer">
          <button className="vol-btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="vol-btn-primary" onClick={handleConfirm}>
            <Check size={15} />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};

