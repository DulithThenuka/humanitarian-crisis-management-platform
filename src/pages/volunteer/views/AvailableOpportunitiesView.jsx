import React, { useState, useMemo } from 'react';
import {
  Clock,
  Calendar,
  Users,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Check
} from 'lucide-react';

export const AvailableOpportunitiesView = ({
  opportunities,
  onViewDetails,
  onAcceptTask
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDate, setSelectedDate] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      // Search term
      const matchesSearch =
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.id.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === 'All' || opp.category === selectedCategory;

      // Location filter
      const matchesLocation =
        selectedLocation === 'All' || opp.location === selectedLocation;

      // Skill filter
      const matchesSkill =
        selectedSkill === 'All' || opp.skills.includes(selectedSkill);

      return matchesSearch && matchesCategory && matchesLocation && matchesSkill;
    });
  }, [opportunities, searchTerm, selectedCategory, selectedLocation, selectedSkill]);

  return (
    <div>
      {/* Header */}
      <div className="vol-page-header">
        <div>
          <div className="vol-page-eyebrow">Eligible opportunities in your service scope</div>
          <h1 className="vol-page-title">Available Opportunities</h1>
          <p className="vol-page-desc">
            Only tasks matching your approved service areas and eligibility are shown.
          </p>
        </div>
      </div>

      {/* Filter Bar matching Figma */}
      <div className="vol-filter-bar">
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search
            size={15}
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8'
            }}
          />
          <input
            type="text"
            className="vol-filter-input"
            style={{ paddingLeft: '32px', width: '100%', boxSizing: 'border-box' }}
            placeholder="Search opportunity, category or location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="vol-filter-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">Task category</option>
          <option value="Logistics">Logistics</option>
          <option value="Shelter Support">Shelter Support</option>
          <option value="Community Support">Community Support</option>
        </select>

        <select
          className="vol-filter-select"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          <option value="All">Date</option>
          <option value="Today">Today</option>
          <option value="This Week">This Week</option>
          <option value="Next Week">Next Week</option>
        </select>

        <select
          className="vol-filter-select"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="All">Location</option>
          <option value="Kelani East">Kelani East</option>
          <option value="Niyagama North">Niyagama North</option>
          <option value="Central Depot">Central Depot</option>
        </select>

        <select
          className="vol-filter-select"
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
        >
          <option value="All">Required skills</option>
          <option value="Logistics">Logistics</option>
          <option value="First Aid">First Aid</option>
          <option value="Communication">Communication</option>
          <option value="Registration">Registration</option>
          <option value="Sinhala">Sinhala</option>
          <option value="Tamil">Tamil</option>
          <option value="Packing">Packing</option>
        </select>

        <select
          className="vol-filter-select"
          value={selectedAvailability}
          onChange={(e) => setSelectedAvailability(e.target.value)}
        >
          <option value="All">Availability</option>
          <option value="Open Slots">Open Slots</option>
          <option value="Immediate">Immediate</option>
        </select>
      </div>

      {/* Opportunities 2x2 Grid */}
      <div className="vol-opportunities-grid">
        {filteredOpportunities.length === 0 ? (
          <div
            style={{
              gridColumn: '1 / -1',
              padding: '48px 24px',
              textAlign: 'center',
              background: '#ffffff',
              borderRadius: '10px',
              border: '1px solid #e2e8e0'
            }}
          >
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              No available opportunities match the selected criteria. Try adjusting your filters.
            </p>
          </div>
        ) : (
          filteredOpportunities.map((opp) => (
            <div key={opp.id} className="vol-opportunity-card">
              <div>
                {/* Top Code & Priority */}
                <div className="vol-opp-top">
                  <span className="vol-opp-code">{opp.categoryCode}</span>
                  <span className={`vol-opp-priority-pill ${opp.priorityColor}`}>
                    {opp.priority}
                  </span>
                </div>

                {/* Title & Desc */}
                <h3 className="vol-opp-title">{opp.title}</h3>
                <p className="vol-opp-desc">{opp.description}</p>

                {/* Meta details grid */}
                <div className="vol-opp-meta-grid">
                  <div className="vol-meta-item">
                    <Clock size={14} style={{ color: '#64748b' }} />
                    <span>{opp.duration}</span>
                  </div>
                  <div className="vol-meta-item">
                    <Calendar size={14} style={{ color: '#64748b' }} />
                    <span>{opp.date}</span>
                  </div>
                  <div className="vol-meta-item">
                    <Users size={14} style={{ color: '#64748b' }} />
                    <span>{opp.volunteersNeeded}</span>
                  </div>
                  <div className="vol-meta-item">
                    <MapPin size={14} style={{ color: '#64748b' }} />
                    <span>{opp.location}</span>
                  </div>
                </div>

                {/* Required Skills */}
                <div className="vol-opp-skills-section">
                  <div className="vol-opp-skills-label">Required skills</div>
                  <div className="vol-pill-group">
                    {opp.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="vol-pill tag-neutral">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Eligibility banner */}
                {opp.eligibilityType === 'eligible' ? (
                  <div className="vol-opp-eligibility-banner eligible">
                    <CheckCircle2 size={15} />
                    <span>{opp.eligibilityText}</span>
                  </div>
                ) : (
                  <div className="vol-opp-eligibility-banner attention">
                    <AlertTriangle size={15} />
                    <span>{opp.eligibilityText}</span>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="vol-opp-footer">
                <button
                  className="vol-btn-outline"
                  onClick={() => onViewDetails(opp)}
                >
                  View Details
                </button>
                <button
                  className="vol-btn-primary"
                  onClick={() => onAcceptTask(opp)}
                >
                  Accept Task
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

