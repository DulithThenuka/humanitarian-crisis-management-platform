import React, { useState } from 'react';

export const DataTable = ({ columns, data = [], emptyMessage = "No records found" }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    return Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
        <input
          type="text"
          placeholder="Filter table records..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '8px 14px',
            borderRadius: '6px',
            border: '1px solid #2a4a35',
            backgroundColor: '#1e3328',
            color: '#f4f6f2',
            fontSize: '13px'
          }}
        />
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #2a4a35', backgroundColor: '#14291e' }}>
            {columns.map((col, idx) => (
              <th key={idx} style={{ padding: '12px 16px', fontWeight: 600, color: '#8a9480' }}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((row, rIdx) => (
              <tr key={rIdx} style={{ borderBottom: '1px solid #2a4a35', transition: 'background-color 0.15s' }}>
                {columns.map((col, cIdx) => (
                  <td key={cIdx} style={{ padding: '12px 16px' }}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ padding: '32px', textAlign: 'center', color: '#657367' }}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
