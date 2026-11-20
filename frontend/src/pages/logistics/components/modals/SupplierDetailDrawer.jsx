import React, { useEffect } from 'react';
import { 
  X, 
  Building2, 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  Truck, 
  Calendar, 
  Tag, 
  Award,
  ArrowRight,
  Boxes
} from 'lucide-react';

const SUPPLIER_DETAILS_LOOKUP = {
  'SUP-014': {
    contactPerson: 'Saman Jayawardena (Procurement Director)',
    phone: '+94 11 284 9021',
    email: 'saman.j@aquarelief.lk',
    warehouseLocation: 'Kelaniya Industrial Zone, Western Province',
    leadTime: '24–48 hours',
    rating: '4.9 / 5.0 · Top Tier Partner',
    recentDeliveries: [
      { id: 'DEL-2026-104', date: '18 Feb 2026', items: '1,200 Liters Purified Water', destination: 'Central Depot', status: 'Delivered', batch: 'BAT-041-W' },
      { id: 'DEL-2026-089', date: '12 Feb 2026', items: '800 Emergency Water Cans (10L)', destination: 'Wattala Depot', status: 'Delivered', batch: 'BAT-038-W' },
      { id: 'DEL-2026-062', date: '04 Feb 2026', items: '400 Family Water Kits', destination: 'Central Depot', status: 'Delivered', batch: 'BAT-032-K' }
    ]
  },
  'SUP-009': {
    contactPerson: 'Dr. Nilmini Fernando (Medical Logistics Head)',
    phone: '+94 11 492 3310',
    email: 'supply@healthlinedist.lk',
    warehouseLocation: 'Biyagama Free Trade Zone, Sector B',
    leadTime: '12–24 hours (Expedited)',
    rating: '4.8 / 5.0 · Certified Vendor',
    recentDeliveries: [
      { id: 'DEL-2026-098', date: '17 Feb 2026', items: '250 Trauma & First Aid Kits', destination: 'Medical Store', status: 'Delivered', batch: 'BAT-092-M' },
      { id: 'DEL-2026-081', date: '09 Feb 2026', items: '500 Hygiene & Sanitation Packs', destination: 'Central Depot', status: 'Delivered', batch: 'BAT-079-H' },
      { id: 'DEL-2026-055', date: '28 Jan 2026', items: '150 Antiseptic & Bandage Packs', destination: 'Medical Store', status: 'Delivered', batch: 'BAT-051-M' }
    ]
  },
  'SUP-021': {
    contactPerson: 'Kavinda Perera (Operations Manager)',
    phone: '+94 77 312 8845',
    email: 'kavinda@communitytextiles.org',
    warehouseLocation: 'Maharagama Industrial Park, Colombo District',
    leadTime: '48–72 hours',
    rating: 'Under Assessment · Background Cleared',
    recentDeliveries: [
      { id: 'DEL-2026-077', date: '12 Feb 2026', items: '150 Wool Fleece Thermal Blankets', destination: 'Central Depot', status: 'Delivered · Inspected', batch: 'BAT-065-T' },
      { id: 'DEL-2026-041', date: '25 Jan 2026', items: '80 Tarpaulin Emergency Sheets', destination: 'Western Province Hub', status: 'Delivered', batch: 'BAT-039-S' }
    ]
  }
};

export const SupplierDetailDrawer = ({ 
  isOpen, 
  supplier, 
  onClose, 
  onApproveSupplier,
  showToast 
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !supplier) return null;

  // Retrieve mock details or fallback to dynamic values
  const extraDetails = SUPPLIER_DETAILS_LOOKUP[supplier.id] || {
    contactPerson: supplier.contactRef && supplier.contactRef !== 'Approved contact' && supplier.contactRef !== 'Pending verification'
      ? supplier.contactRef 
      : 'Rohan Senanayake (Account Lead)',
    phone: '+94 11 744 1200',
    email: `procurement@${supplier.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'relief'}.lk`,
    warehouseLocation: 'Peliyagoda Logistics Hub, Colombo District',
    leadTime: '24–48 hours',
    rating: supplier.status === 'Verified' ? '4.8 / 5.0 · Approved Network' : 'Pending Verification',
    recentDeliveries: [
      { 
        id: `DEL-2026-${(supplier.id || '99').replace(/[^0-9]/g, '') || '88'}`, 
        date: supplier.lastDelivery || 'Recently', 
        items: `${supplier.categories || 'Relief Supplies'} batch shipment`, 
        destination: 'Central Depot', 
        status: 'Delivered', 
        batch: `BAT-2026-${(supplier.id || '01').replace(/[^0-9]/g, '')}` 
      }
    ]
  };

  const isReviewStatus = supplier.status?.toLowerCase() === 'review' || supplier.status?.toLowerCase() === 'pending';

  const handleApprove = () => {
    if (onApproveSupplier) {
      onApproveSupplier(supplier.id);
    }
    if (showToast) {
      showToast(`Supplier ${supplier.id} (${supplier.name}) has been approved and verified!`);
    }
  };

  // Parse categories into distinct items
  const categoryList = Array.isArray(supplier.categories)
    ? supplier.categories
    : String(supplier.categories || '').split(',').map(c => c.trim()).filter(Boolean);

  return (
    <div className="rm-drawer-overlay" onClick={onClose}>
      <div className="rm-drawer" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', width: '100%' }}>
        {/* Drawer Header */}
        <div className="rm-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div 
              className="rm-drawer-icon-wrap" 
              style={{ 
                backgroundColor: isReviewStatus ? '#fffbeb' : '#ecfdf5', 
                color: isReviewStatus ? '#b45309' : '#047857',
                border: isReviewStatus ? '1px solid #fde68a' : '1px solid #bbf7d0'
              }}
            >
              <Building2 size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="rm-drawer-code">{supplier.id}</span>
                <span className={`rm-status-badge ${supplier.statusBadge || supplier.status.toLowerCase()}`}>
                  ● {supplier.status}
                </span>
              </div>
              <h2 className="rm-drawer-title" style={{ fontSize: '17px', margin: '2px 0 0 0' }}>
                {supplier.name}
              </h2>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="rm-btn-ghost"
            style={{ padding: '6px', borderRadius: '6px' }}
            title="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="rm-drawer-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Action Banner for "Review" Status (e.g. SUP-021) */}
          {isReviewStatus ? (
            <div style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '10px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <AlertTriangle size={18} style={{ color: '#b45309', marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#92400e' }}>
                    Supplier Awaiting Verification
                  </div>
                  <div style={{ fontSize: '12px', color: '#78350f', marginTop: '3px', lineHeight: 1.45 }}>
                    This vendor has completed trial intake and background screening. Authorize to upgrade them to an approved network supplier.
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="rm-btn rm-btn-primary"
                style={{ 
                  width: '100%', 
                  justifyContent: 'center', 
                  gap: '8px', 
                  padding: '10px 14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: '#1e3d2c',
                  color: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
                onClick={handleApprove}
              >
                <ShieldCheck size={16} />
                <span>Approve &amp; Verify Supplier</span>
              </button>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#ecfdf5',
              border: '1px solid #bbf7d0',
              borderRadius: '10px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} style={{ color: '#047857' }} />
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#065f46' }}>
                  Verified Active Partner
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#047857', fontWeight: 500 }}>
                {extraDetails.rating}
              </span>
            </div>
          )}

          {/* Supplier Supply Overview Card */}
          <div className="rm-drawer-card" style={{ padding: '16px' }}>
            <span style={{ 
              fontSize: '11px', 
              fontWeight: 700, 
              color: '#657367', 
              textTransform: 'uppercase', 
              letterSpacing: '0.04em',
              display: 'block',
              marginBottom: '12px'
            }}>
              Supply Profile &amp; Logistics SLA
            </span>

            {/* Supplied Categories */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11.5px', color: '#738075', marginBottom: '6px' }}>
                Supplied Categories:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {categoryList.map((cat, idx) => (
                  <span 
                    key={idx}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: '#f0f4ee',
                      border: '1px solid #dce4d9',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      color: '#162e20'
                    }}
                  >
                    <Tag size={10} color="#1e3d2c" />
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Lead Time & Last Delivery Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '12px', 
              paddingTop: '12px', 
              borderTop: '1px solid #edf1eb' 
            }}>
              <div>
                <div style={{ fontSize: '11px', color: '#738075', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={11} />
                  <span>Avg. Delivery Lead Time</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#162e20', marginTop: '3px' }}>
                  {extraDetails.leadTime}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#738075', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={11} />
                  <span>Last Delivery Recorded</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#162e20', marginTop: '3px' }}>
                  {supplier.lastDelivery || '18 Feb 2026'}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details Card */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#162e20', margin: '0 0 10px 0' }}>
              Contact &amp; Operational Coordinates
            </h4>
            <div style={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid #e2e8dd', 
              borderRadius: '10px', 
              overflow: 'hidden' 
            }}>
              {/* Contact Person */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '11px 14px', 
                borderBottom: '1px solid #edf1eb', 
                fontSize: '12px' 
              }}>
                <span style={{ color: '#657367' }}>Contact Person</span>
                <span style={{ fontWeight: 600, color: '#162e20' }}>
                  {extraDetails.contactPerson}
                </span>
              </div>

              {/* Phone */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '11px 14px', 
                borderBottom: '1px solid #edf1eb', 
                fontSize: '12px' 
              }}>
                <span style={{ color: '#657367', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Phone size={12} color="#1e3d2c" /> Phone
                </span>
                <a 
                  href={`tel:${extraDetails.phone}`} 
                  style={{ fontWeight: 600, color: '#1e3d2c', textDecoration: 'none' }}
                >
                  {extraDetails.phone}
                </a>
              </div>

              {/* Email */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '11px 14px', 
                borderBottom: '1px solid #edf1eb', 
                fontSize: '12px' 
              }}>
                <span style={{ color: '#657367', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Mail size={12} color="#1e3d2c" /> Email
                </span>
                <a 
                  href={`mailto:${extraDetails.email}`} 
                  style={{ fontWeight: 600, color: '#1e3d2c', textDecoration: 'none' }}
                >
                  {extraDetails.email}
                </a>
              </div>

              {/* Warehouse Location */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                padding: '11px 14px', 
                fontSize: '12px' 
              }}>
                <span style={{ color: '#657367', display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                  <MapPin size={12} color="#1e3d2c" /> Warehouse Location
                </span>
                <span style={{ fontWeight: 600, color: '#162e20', textAlign: 'right', marginLeft: '12px' }}>
                  {extraDetails.warehouseLocation}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Deliveries List */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#162e20', margin: 0 }}>
                Recent Deliveries
              </h4>
              <span style={{ fontSize: '11px', color: '#738075' }}>
                {extraDetails.recentDeliveries.length} records logged
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {extraDetails.recentDeliveries.map((del) => (
                <div 
                  key={del.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8dd',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '12px', color: '#162e20' }}>
                        {del.id}
                      </span>
                      <span style={{ fontSize: '10.5px', color: '#738075' }}>· {del.date}</span>
                    </div>
                    <span 
                      style={{
                        fontSize: '10.5px',
                        fontWeight: 600,
                        backgroundColor: '#ecfdf5',
                        color: '#065f46',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: '1px solid #bbf7d0'
                      }}
                    >
                      ● {del.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#29382d' }}>
                    {del.items}
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    fontSize: '11px', 
                    color: '#657367', 
                    marginTop: '2px' 
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={10} /> Destination: {del.destination}
                    </span>
                    {del.batch && (
                      <span style={{ fontFamily: 'monospace', color: '#738075' }}>
                        {del.batch}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Close Button */}
          <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
            <button
              type="button"
              className="rm-btn rm-btn-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={onClose}
            >
              Close Details
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SupplierDetailDrawer;
