import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const MyAssignmentsView = ({
  assignments,
  onActionClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.coordinator.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' || item.status === statusFilter;

      const matchesPriority =
        priorityFilter === 'All' || item.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [assignments, searchTerm, statusFilter, priorityFilter]);

  return (
    <div>
      {/* Header */}
      <div className="vol-page-header">
        <div>
          <div className="vol-page-eyebrow">Private assignment workspace</div>
          <h1 className="vol-page-title">My Assignments</h1>
          <p className="vol-page-desc">
            Only assignments associated with your volunteer account are displayed.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
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
            placeholder="Search task ID or title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="vol-filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All statuses</option>
          <option value="Offered">Offered</option>
          <option value="Accepted">Accepted</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          className="vol-filter-select"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="All">Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select className="vol-filter-select">
          <option value="All">Date</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Past 7 days">Past 7 days</option>
          <option value="Past 30 days">Past 30 days</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="vol-table-container">
        <table className="vol-data-table">
          <thead>
            <tr>
              <th>Task ID</th>
              <th>Task Title</th>
              <th>Assigned</th>
              <th>Deadline</th>
              <th>General Location</th>
              <th>Coordinator</th>
              <th>Priority</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Next Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssignments.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  No assignments found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredAssignments.map((row) => (
                <tr key={row.id}>
                  <td className="vol-task-id-mono">{row.id}</td>
                  <td style={{ fontWeight: 600 }}>{row.taskTitle}</td>
                  <td style={{ color: '#64748b' }}>{row.assigned}</td>
                  <td style={{ color: '#475569', fontWeight: 500 }}>{row.deadline}</td>
                  <td>{row.location}</td>
                  <td>{row.coordinator}</td>
                  <td>
                    <span
                      className={`vol-opp-priority-pill ${
                        row.priority === 'High'
                          ? 'orange'
                          : row.priority === 'Medium'
                          ? 'blue'
                          : 'gray'
                      }`}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor:
                            row.priority === 'High'
                              ? '#ea580c'
                              : row.priority === 'Medium'
                              ? '#0284c7'
                              : '#64748b',
                          display: 'inline-block'
                        }}
                      />
                      {row.priority}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`vol-status-badge ${
                        row.status === 'Offered'
                          ? 'warning'
                          : row.status === 'Accepted'
                          ? 'info'
                          : 'success'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="vol-action-link-btn"
                      onClick={() => onActionClick(row)}
                    >
                      {row.nextAction}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Footer Pagination */}
        <div className="vol-table-footer">
          <div>
            Showing 1-{filteredAssignments.length} of {assignments.length} assignments
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button className="vol-pagination-btn active">1</button>
          </div>
        </div>
      </div>
    </div>
  );
};

