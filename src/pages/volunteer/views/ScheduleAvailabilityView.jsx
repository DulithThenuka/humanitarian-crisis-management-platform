import React, { useState } from 'react';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  CheckCircle2,
  Check
} from 'lucide-react';
import { SERVICE_AREAS } from '../data/volunteerData';

export const ScheduleAvailabilityView = ({
  scheduleDays,
  availabilityDays,
  preferredCategories,
  onSaveAvailability
}) => {
  const [daysState, setDaysState] = useState(availabilityDays);
  const [categoriesState, setCategoriesState] = useState(preferredCategories);
  const [selectedArea, setSelectedArea] = useState(SERVICE_AREAS[0]);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

  const handleDayToggle = (index) => {
    const updated = [...daysState];
    updated[index] = {
      ...updated[index],
      active: !updated[index].active
    };
    setDaysState(updated);
  };

  const handleTimeChange = (index, field, value) => {
    const updated = [...daysState];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setDaysState(updated);
  };

  const handleCategoryToggle = (index) => {
    const updated = [...categoriesState];
    updated[index] = {
      ...updated[index],
      checked: !updated[index].checked
    };
    setCategoriesState(updated);
  };

  const handleSave = () => {
    if (onSaveAvailability) {
      onSaveAvailability({
        days: daysState,
        categories: categoriesState,
        serviceArea: selectedArea
      });
    }
  };

  return (
    <div>
      {/* Header with Save Button */}
      <div className="vol-page-header">
        <div>
          <div className="vol-page-eyebrow">Personal schedule and preferences</div>
          <h1 className="vol-page-title">Schedule & Availability</h1>
          <p className="vol-page-desc">
            Manage when, where and what types of eligible tasks you can support.
          </p>
        </div>
        <button
          className="vol-btn-primary"
          onClick={handleSave}
        >
          Save availability
        </button>
      </div>

      {/* Two-Column Layout */}
      <div className="vol-schedule-grid-layout">
        {/* Left Column: Weekly Schedule Calendar */}
        <div className="vol-card">
          <div className="vol-calendar-header">
            <h3 className="vol-calendar-month-title">February 2026</h3>
            <div className="vol-calendar-nav-buttons">
              <button
                className="vol-card-link"
                onClick={() => setCurrentWeekIndex((prev) => Math.max(0, prev - 1))}
              >
                Previous
              </button>
              <button
                className="vol-card-link"
                onClick={() => setCurrentWeekIndex((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>

          <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '12px' }}>
            Your assignments and availability
          </div>

          {/* 7-Day Columns Grid */}
          <div className="vol-week-grid">
            {scheduleDays.map((col, idx) => (
              <div
                key={idx}
                className={`vol-day-col ${col.isToday ? 'active-day' : ''}`}
              >
                <div className="vol-day-header">
                  <div className="vol-day-name">{col.day}</div>
                  <div className="vol-day-number">{col.date}</div>
                </div>

                {col.hasTask && (
                  <div
                    className={`vol-day-event-card ${col.isToday ? 'today' : ''}`}
                  >
                    <div className="vol-day-event-title">{col.taskTitle}</div>
                    <div className="vol-day-event-sub">{col.taskSub}</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Schedule Conflict Warning */}
          <div className="vol-schedule-conflict-banner">
            <AlertTriangle size={17} className="vol-conflict-icon" />
            <div>
              <div className="vol-conflict-title">Potential schedule conflict</div>
              <div>
                Travel time between Kelani East and Niyagama may overlap with your stated availability on 21 Feb.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Availability Settings Panel */}
        <div className="vol-avail-settings-card">
          <h3 className="vol-card-title" style={{ marginBottom: '14px' }}>
            Availability settings
          </h3>

          {/* Day rows with time pickers */}
          <div className="vol-avail-days-list">
            {daysState.map((d, index) => (
              <div key={d.day} className="vol-avail-day-row">
                <label className="vol-avail-day-check">
                  <input
                    type="checkbox"
                    checked={d.active}
                    onChange={() => handleDayToggle(index)}
                    style={{ accentColor: '#183526', cursor: 'pointer' }}
                  />
                  <span>{d.day}</span>
                </label>

                <div className="vol-time-inputs">
                  <input
                    type="text"
                    className="vol-time-input"
                    value={d.start}
                    disabled={!d.active}
                    onChange={(e) => handleTimeChange(index, 'start', e.target.value)}
                  />
                  <span style={{ fontSize: '11px', color: '#64748b' }}>to</span>
                  <input
                    type="text"
                    className="vol-time-input"
                    value={d.end}
                    disabled={!d.active}
                    onChange={(e) => handleTimeChange(index, 'end', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Preferred Task Categories */}
          <div className="vol-avail-section-title">Preferred task categories</div>
          <div className="vol-checkbox-grid">
            {categoriesState.map((cat, idx) => (
              <label key={cat.name} className="vol-checkbox-label">
                <input
                  type="checkbox"
                  checked={cat.checked}
                  onChange={() => handleCategoryToggle(idx)}
                  style={{ accentColor: '#183526', cursor: 'pointer' }}
                />
                <span>{cat.name}</span>
              </label>
            ))}
          </div>

          {/* General Service Areas */}
          <div className="vol-avail-section-title">General service areas</div>
          <select
            className="vol-select-field"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
          >
            {SERVICE_AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

