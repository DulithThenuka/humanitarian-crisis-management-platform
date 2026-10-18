import React, { useState } from 'react';
import { aiGovernanceService } from '../../services/aiGovernanceService';
import { useAlert } from '../../context/AlertContext';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const AIDecisionReviewPage = () => {
  const [decisions, setDecisions] = useState([
    {
      id: 'd1',
      requestId: 'req-001',
      category: 'Rescue',
      description: 'Water rising up to ceiling, elderly person with mobility issues.',
      aiSuggestedPriority: 'Critical',
      confidence: 0.94,
      reasoning: 'Extracted keywords: rising water, mobility issues, ceiling threat'
    },
    {
      id: 'd2',
      requestId: 'req-002',
      category: 'Food Rations',
      description: 'Family ran out of drinking water bottles yesterday.',
      aiSuggestedPriority: 'Medium',
      confidence: 0.82,
      reasoning: 'Standard supply request; no life-threatening injury identified'
    }
  ]);
  const [activeDecision, setActiveDecision] = useState(null);
  const [overrideReason, setOverrideReason] = useState('');
  const [newPriority, setNewPriority] = useState(3);
  const { showAlert } = useAlert();

  const handleApprove = async (id) => {
    try {
      await aiGovernanceService.approveDecision({ decisionAuditId: id, action: 'Approve' });
      showAlert("AI recommendation approved and logged into governance audit", "success");
      setDecisions(decisions.filter(d => d.id !== id));
    } catch {
      showAlert("Decision approved (simulated)", "success");
      setDecisions(decisions.filter(d => d.id !== id));
    }
  };

  const handleOverrideSubmit = async () => {
    if (!overrideReason) {
      showAlert("A governance justification reason is mandatory.", "error");
      return;
    }
    try {
      await aiGovernanceService.overrideDecision({
        decisionAuditId: activeDecision.id,
        overriddenPriority: newPriority,
        reason: overrideReason
      });
      showAlert("AI decision successfully overridden and audited", "success");
      setDecisions(decisions.filter(d => d.id !== activeDecision.id));
      setActiveDecision(null);
      setOverrideReason('');
    } catch {
      showAlert("Override logged (simulated)", "success");
      setDecisions(decisions.filter(d => d.id !== activeDecision.id));
      setActiveDecision(null);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>AI Decision Governance & Review</h2>
      <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '24px' }}>
        Human-in-the-loop review board to audit and override automated AI prioritizations.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {decisions.map(d => (
          <div key={d.id} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 700, color: '#38bdf8' }}>{d.category}</span>
              <span style={{ fontSize: '12px', backgroundColor: '#0f172a', padding: '4px 10px', borderRadius: '4px', color: '#94a3b8' }}>
                Confidence: {(d.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <p style={{ fontSize: '14px', color: '#f8fafc', marginBottom: '12px' }}>{d.description}</p>
            <div style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '16px' }}>
              <strong>AI Suggested Priority:</strong> <span style={{ color: '#ef4444', fontWeight: 700 }}>{d.aiSuggestedPriority}</span>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{d.reasoning}</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="success" onClick={() => handleApprove(d.id)} style={{ padding: '8px 16px', fontSize: '13px' }}>Approve AI Suggestion</Button>
              <Button variant="danger" onClick={() => setActiveDecision(d)} style={{ padding: '8px 16px', fontSize: '13px' }}>Human Override</Button>
            </div>
          </div>
        ))}
        {decisions.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>All pending AI decisions have been reviewed and audited.</div>
        )}
      </div>

      <Modal isOpen={!!activeDecision} onClose={() => setActiveDecision(null)} title="Override AI Classification">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '13px', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Adjusted Priority Level</label>
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(parseInt(e.target.value, 10))}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc' }}
            >
              <option value={0}>Low</option>
              <option value={1}>Medium</option>
              <option value={2}>High</option>
              <option value={3}>Critical</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '13px', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Override Reason (Mandatory Audit Log)</label>
            <textarea
              rows="3"
              placeholder="Provide field context justifying the decision change..."
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc' }}
            />
          </div>
          <Button variant="danger" onClick={handleOverrideSubmit} style={{ marginTop: '10px' }}>Commit Override Audit</Button>
        </div>
      </Modal>
    </div>
  );
};
