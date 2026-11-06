import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Plus, 
  PieChart, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Layers
} from 'lucide-react';

export const AllocationExpenditureView = ({
  allocations,
  selectedAllocationId,
  setSelectedAllocationId,
  onOpenCreateRecordModal,
  onOpenApprovalModal,
  onExportReport,
  onSaveNote,
  onClarifyRecord,
  onEscalateRecord
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clusterFilter, setClusterFilter] = useState('All');
  const [activeNoteText, setActiveNoteText] = useState('');

  const selectedAllocation = allocations.find(a => a.id === selectedAllocationId) || allocations[0];

  React.useEffect(() => {
    if (selectedAllocation) {
      setActiveNoteText(`Dual signatory state: ${selectedAllocation.approvalStatus}. Destination facility: ${selectedAllocation.destinationFacility}. Beneficiary impact: ${selectedAllocation.beneficiaries}.`);
    }
  }, [selectedAllocationId]);

  const filteredAllocations = allocations.filter(a => {
    const matchesSearch = 
      a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.voucherCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.cluster.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCluster = clusterFilter === 'All' || a.cluster.includes(clusterFilter);

    return matchesSearch && matchesCluster;
  });

  return (
    <div className="fo-workspace">
      {/* Title & Action Block */}
      <div className="fo-title-block">
        <div>
          <div className="fo-eyebrow">
            <Layers size={13} />
            <span>FUNDING OFFICER · CONTROLLED WORKSPACE</span>
          </div>
          <h1 className="fo-title">Allocation & Expenditure</h1>
          <p className="fo-subtitle">
            Search, filter and review fictional records within this role's authorised scope.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="fo-btn fo-btn-secondary"
            onClick={onExportReport}
          >
            <Download size={14} />
            <span>Export demo report</span>
          </button>
          <button 
            className="fo-btn fo-btn-primary"
            onClick={onOpenCreateRecordModal}
          >
            <Plus size={14} />
            <span>+ Create prototype record</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="fo-filter-bar">
        <div className="fo-filter-search">
          <Search size={14} className="fo-search-icon" />
          <input
            type="text"
            placeholder="Search allocation & expenditure..."
            className="fo-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="fo-filter-inputs">
          <select 
            className="fo-select"
            value={clusterFilter}
            onChange={(e) => setClusterFilter(e.target.value)}
          >
            <option value="All">All clusters</option>
            <option value="Food">Food & Nutrition</option>
            <option value="Healthcare">Healthcare & Medical SAR</option>
            <option value="WASH">WASH (Water & Sanitation)</option>
            <option value="Fleet">Search & Rescue Fleet</option>
            <option value="Shelter">Shelter Management</option>
          </select>
        </div>
      </div>

      {/* Split Layout */}
      <div className="fo-split-layout">
        {/* Table Section */}
        <div className="fo-table-container">
          <table className="fo-data-table">
            <thead>
              <tr>
                <th>Voucher</th>
                <th>Title / Cluster</th>
                <th>Source Donation</th>
                <th>Committed</th>
                <th>Disbursed</th>
                <th>Approval</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAllocations.map((item) => {
                const isSelected = item.id === selectedAllocation?.id;
                return (
                  <tr 
                    key={item.id} 
                    className={isSelected ? 'selected' : ''}
                    onClick={() => setSelectedAllocationId(item.id)}
                  >
                    <td>
                      <span className="fo-record-id">{item.voucherCode}</span>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>{item.id}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.title}</div>
                      <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 600 }}>{item.cluster}</div>
                    </td>
                    <td style={{ fontSize: '12px', color: '#334155' }}>
                      {item.sourceDonation}
                    </td>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>
                      {item.allocatedAmount}
                    </td>
                    <td style={{ color: '#64748b' }}>
                      {item.disbursedAmount}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '2px 7px',
                        borderRadius: '6px',
                        backgroundColor: item.approvalStatus === 'Dual Approved' ? '#ecfdf5' : '#fffbeb',
                        color: item.approvalStatus === 'Dual Approved' ? '#059669' : '#b45309',
                        border: `1px solid ${item.approvalStatus === 'Dual Approved' ? '#a7f3d0' : '#fde68a'}`
                      }}>
                        {item.approvalStatus === 'Dual Approved' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                        {item.approvalStatus}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="fo-badge"
                        style={{
                          backgroundColor: item.approvalStatus === 'Dual Approved' ? '#ecfdf5' : '#fffbeb',
                          color: item.statusColor,
                          border: `1px solid ${item.approvalStatus === 'Dual Approved' ? '#a7f3d0' : '#fde68a'}`
                        }}
                      >
                        ● {item.approvalStatus === 'Dual Approved' ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Allocation Detail Panel */}
        {selectedAllocation && (
          <div className="fo-detail-card">
            <div className="fo-detail-header-row">
              <span className="fo-detail-id">{selectedAllocation.voucherCode}</span>
              <span 
                className="fo-badge"
                style={{
                  backgroundColor: selectedAllocation.approvalStatus === 'Dual Approved' ? '#ecfdf5' : '#fffbeb',
                  color: selectedAllocation.statusColor,
                  border: `1px solid ${selectedAllocation.approvalStatus === 'Dual Approved' ? '#a7f3d0' : '#fde68a'}`
                }}
              >
                ● {selectedAllocation.approvalStatus}
              </span>
            </div>

            <div className="fo-detail-source">{selectedAllocation.title}</div>
            <div className="fo-detail-subtag">Selected fictional record · role scoped</div>

            <div className="fo-detail-fields-grid">
              <div className="fo-field-group">
                <span className="fo-field-label">Cluster</span>
                <span className="fo-field-value">{selectedAllocation.cluster}</span>
              </div>
              <div className="fo-field-group">
                <span className="fo-field-label">Committed Value</span>
                <span className="fo-field-value" style={{ color: '#0284c7' }}>
                  {selectedAllocation.allocatedAmount}
                </span>
              </div>
              <div className="fo-field-group">
                <span className="fo-field-label">Disbursed</span>
                <span className="fo-field-value" style={{ color: '#059669' }}>
                  {selectedAllocation.disbursedAmount}
                </span>
              </div>
              <div className="fo-field-group">
                <span className="fo-field-label">Beneficiaries</span>
                <span className="fo-field-value" style={{ fontSize: '11.5px' }}>{selectedAllocation.beneficiaries}</span>
              </div>
            </div>

            <div className="fo-note-section">
              <label className="fo-note-label">AUTHORISED NOTE / DECISION REASON</label>
              <textarea
                className="fo-note-textarea"
                placeholder="Enter allocation audit notes or co-signer instructions..."
                value={activeNoteText}
                onChange={(e) => setActiveNoteText(e.target.value)}
              ></textarea>
              <button 
                type="button"
                style={{
                  alignSelf: 'flex-end',
                  marginTop: '4px',
                  background: 'none',
                  border: 'none',
                  color: '#0284c7',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                onClick={() => onSaveNote(selectedAllocation.id, activeNoteText)}
              >
                Save Memo
              </button>
            </div>

            <div className="fo-detail-actions">
              <button 
                className="fo-action-btn-primary"
                onClick={() => onOpenApprovalModal({
                  id: selectedAllocation.voucherCode,
                  title: selectedAllocation.title,
                  allocatedAmount: selectedAllocation.allocatedAmount,
                  cluster: selectedAllocation.cluster
                })}
              >
                Submit for approval
              </button>

              <button 
                className="fo-action-btn-secondary"
                onClick={() => onClarifyRecord({ id: selectedAllocation.voucherCode, source: selectedAllocation.title })}
              >
                Request clarification
              </button>

              <button 
                className="fo-action-btn-danger"
                onClick={() => onEscalateRecord({ id: selectedAllocation.voucherCode, source: selectedAllocation.title })}
              >
                Escalate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
