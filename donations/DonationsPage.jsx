import React, { useState } from 'react';

export default function DonationsPage() {
  const [formData, setFormData] = useState({
    category: 'Food & Water',
    itemName: '',
    quantity: '',
    unit: 'Units',
    donorName: ''
  });

  const donationsList = [
    { id: 'DON-2026-0084', donor: 'Help Sri Lanka Foundation', category: 'Food & Water', amount: '500 Food Packs', value: 'Rs. 500,000', status: 'Allocated', date: '15 Jun 2026' },
    { id: 'DON-2026-0083', donor: 'Red Cross Sri Lanka', category: 'Medical Supplies', amount: '200 Medical Kits', value: 'Rs. 750,000', status: 'In Transit', date: '14 Jun 2026' },
    { id: 'DON-2026-0082', donor: 'Community Group', category: 'Hygiene Kits', amount: '300 Hygiene Kits', value: 'Rs. 180,000', status: 'Pending', date: '13 Jun 2026' },
    { id: 'DON-2026-0081', donor: 'ABC Clothing Ltd', category: 'Clothing', amount: '1,000 Clothing Items', value: 'Rs. 250,000', status: 'Allocated', date: '12 Jun 2026' },
  ];

  return (
    <div style={{ padding: '28px', maxWidth: '1350px', margin: '0 auto', color: '#f8fafc' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>Donations Management</h1>
        <p style={{ fontSize: '13px', color: '#94a3b8' }}>Track donations, manage donors and allocate resources to those in need</p>
      </div>

      {/* Metrics Cards Grid (Fixed 5 Columns in one row) */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'nowrap', overflowX: 'auto' }}>
        <div style={{ flex: '1', minWidth: '170px', backgroundColor: '#1e293b', padding: '16px', borderRadius: '10px', border: '1px solid #334155' }}>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Total Donations</p>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2dd4bf' }}>Rs. 2,450,000</h3>
          <span style={{ fontSize: '10px', color: '#34d399' }}>↑ 28% This month</span>
        </div>
        <div style={{ flex: '1', minWidth: '170px', backgroundColor: '#1e293b', padding: '16px', borderRadius: '10px', border: '1px solid #334155' }}>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Items Received</p>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>8,420</h3>
          <span style={{ fontSize: '10px', color: '#34d399' }}>↑ 15% Total items</span>
        </div>
        <div style={{ flex: '1', minWidth: '170px', backgroundColor: '#1e293b', padding: '16px', borderRadius: '10px', border: '1px solid #334155' }}>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Active Donors</p>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fb7185' }}>156</h3>
          <span style={{ fontSize: '10px', color: '#34d399' }}>↑ 22% Individuals</span>
        </div>
        <div style={{ flex: '1', minWidth: '170px', backgroundColor: '#1e293b', padding: '16px', borderRadius: '10px', border: '1px solid #334155' }}>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Items Distributed</p>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#60a5fa' }}>6,280</h3>
          <span style={{ fontSize: '10px', color: '#34d399' }}>↑ 18% To affected</span>
        </div>
        <div style={{ flex: '1', minWidth: '170px', backgroundColor: '#1e293b', padding: '16px', borderRadius: '10px', border: '1px solid #334155' }}>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Pending Allocation</p>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fbbf24' }}>2,140</h3>
          <span style={{ fontSize: '10px', color: '#f87171' }}>↓ 8% Awaiting</span>
        </div>
      </div>

      {/* Content Grid: Table + Form */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* Table Section */}
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '10px', border: '1px solid #334155' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#f8fafc', marginBottom: '16px' }}>Recent Donations</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8', fontSize: '12px' }}>
                  <th style={{ paddingBottom: '10px' }}>Donation ID</th>
                  <th style={{ paddingBottom: '10px' }}>Donor Name</th>
                  <th style={{ paddingBottom: '10px' }}>Category</th>
                  <th style={{ paddingBottom: '10px' }}>Value</th>
                  <th style={{ paddingBottom: '10px' }}>Status</th>
                  <th style={{ paddingBottom: '10px' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {donationsList.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.4)' }}>
                    <td style={{ padding: '12px 0', color: '#2dd4bf', fontWeight: 500 }}>{item.id}</td>
                    <td style={{ padding: '12px 0', color: '#cbd5e1' }}>{item.donor}</td>
                    <td style={{ padding: '12px 0', color: '#94a3b8' }}>{item.category}</td>
                    <td style={{ padding: '12px 0', color: '#cbd5e1', fontWeight: 500 }}>{item.value}</td>
                    <td style={{ padding: '12px 0' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 500,
                        backgroundColor: item.status === 'Allocated' ? 'rgba(16, 185, 129, 0.1)' : item.status === 'In Transit' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: item.status === 'Allocated' ? '#34d399' : item.status === 'In Transit' ? '#60a5fa' : '#fbbf24',
                        border: `1px solid ${item.status === 'Allocated' ? 'rgba(16, 185, 129, 0.2)' : item.status === 'In Transit' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                      }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 0', color: '#94a3b8', fontSize: '12px' }}>{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form Section */}
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '10px', border: '1px solid #334155' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#f8fafc', marginBottom: '16px' }}>Record New Donation</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Donation Category</label>
              <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', fontSize: '13px' }}>
                <option>Food & Water</option>
                <option>Medical Supplies</option>
                <option>Shelter Materials</option>
                <option>Hygiene Kits</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Item Name</label>
              <input type="text" placeholder="e.g. Bottled Water, Rice" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', fontSize: '13px' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Quantity</label>
                <input type="number" placeholder="Enter qty" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', fontSize: '13px' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Unit</label>
                <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', fontSize: '13px' }}>
                  <option>Units</option>
                  <option>Packs</option>
                  <option>Kg</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Donor Information</label>
              <input type="text" placeholder="Donor name or organization" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', fontSize: '13px' }} />
            </div>

            <button style={{ width: '100%', padding: '12px', backgroundColor: '#0d9488', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', marginTop: '6px' }}>
              Record Donation
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}