import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  Package,
  CheckCircle,
  Truck,
  HeartHandshake,
  ArrowRight,
  CornerDownLeft,
  Layers
} from 'lucide-react';

export const CommandPaletteModal = ({
  isOpen,
  onClose,
  onSelectTab,
  items = [],
  allocations = [],
  dispatches = [],
  suppliers = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Focus input on open and reset state
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setCategoryFilter('all');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Aggregate searchable entities across modules
  const allRecords = useMemo(() => {
    const list = [];

    // 1. Inventory Items
    (items || []).forEach((item) => {
      list.push({
        id: `inv-${item.id || item.rawId}`,
        code: item.id || `RES-${(item.name || '').substring(0, 3).toUpperCase()}`,
        title: item.name || 'Unnamed Item',
        subtitle: `${item.quantity ?? 0} ${item.unit || 'units'} available · ${item.storageLocation || 'Central Depot'}`,
        category: 'inventory',
        categoryLabel: 'Inventory',
        tag: item.category || 'Supplies',
        status: item.stockStatus || 'In Stock',
        tab: 'inventory',
        icon: Package,
        iconBg: '#ecfdf5',
        iconColor: '#047857'
      });
    });

    // 2. Allocation Requests
    (allocations || []).forEach((alloc) => {
      list.push({
        id: `alloc-${alloc.id || alloc.rawId}`,
        code: alloc.id || 'RAR-REQ',
        title: `${alloc.item || alloc.itemName || 'Relief Goods'} (${alloc.requestedQty || alloc.requestedQuantity || 0} units)`,
        subtitle: `Destination: ${alloc.destination || 'Kelani East'} · Assigned: ${alloc.coordinator || alloc.requestedBy || 'Field Lead'}`,
        category: 'allocations',
        categoryLabel: 'Allocation',
        tag: alloc.priority || 'Critical',
        status: alloc.priorityTag || 'Priority',
        tab: 'allocations',
        icon: CheckCircle,
        iconBg: '#eff6ff',
        iconColor: '#1d4ed8'
      });
    });

    // 3. Dispatches
    (dispatches || []).forEach((dsp) => {
      list.push({
        id: `dsp-${dsp.id}`,
        code: dsp.id || 'DSP-000',
        title: dsp.title || `${dsp.itemName || 'Consignment'} · ${dsp.destination || 'Field'}`,
        subtitle: `Destination: ${dsp.destination || 'Field Camp'} · Team: ${dsp.team || 'Logistics Team'}`,
        category: 'tracking',
        categoryLabel: 'Dispatch',
        tag: dsp.status || 'In Transit',
        status: dsp.statusBadge || 'Dispatched',
        tab: 'tracking',
        icon: Truck,
        iconBg: '#fffbeb',
        iconColor: '#b45309'
      });
    });

    // 4. Suppliers
    (suppliers || []).forEach((sup) => {
      list.push({
        id: `sup-${sup.id}`,
        code: sup.id || 'SUP-000',
        title: sup.name || 'Approved Supplier',
        subtitle: `Categories: ${sup.categories || 'Emergency Relief Goods'} · ${sup.contactRef || 'Verified'}`,
        category: 'suppliers',
        categoryLabel: 'Supplier',
        tag: sup.status || 'Approved',
        status: sup.lastDelivery ? `Last: ${sup.lastDelivery}` : 'Active Network',
        tab: 'suppliers',
        icon: HeartHandshake,
        iconBg: '#f5f3ff',
        iconColor: '#7c3aed'
      });
    });

    return list;
  }, [items, allocations, dispatches, suppliers]);

  // Filter records based on active query & category filter
  const filteredRecords = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return allRecords.filter((rec) => {
      const matchesCategory = categoryFilter === 'all' || rec.category === categoryFilter;
      if (!matchesCategory) return false;
      if (!q) return true;

      return (
        rec.code.toLowerCase().includes(q) ||
        rec.title.toLowerCase().includes(q) ||
        rec.subtitle.toLowerCase().includes(q) ||
        rec.categoryLabel.toLowerCase().includes(q) ||
        rec.tag.toLowerCase().includes(q)
      );
    });
  }, [allRecords, searchTerm, categoryFilter]);

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredRecords.length, categoryFilter]);

  if (!isOpen) return null;

  const handleSelect = (record) => {
    if (!record) return;
    onSelectTab(record.tab, `${record.code} · ${record.title}`);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredRecords.length ? (prev + 1) % filteredRecords.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredRecords.length ? (prev - 1 + filteredRecords.length) % filteredRecords.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredRecords[selectedIndex]) {
        handleSelect(filteredRecords[selectedIndex]);
      }
    }
  };

  return (
    <div className="rm-cmd-backdrop" onClick={onClose} onKeyDown={handleKeyDown}>
      <div className="rm-cmd-card" onClick={(e) => e.stopPropagation()}>
        {/* Top Input Header */}
        <div className="rm-cmd-header">
          <Search size={18} style={{ color: '#1e3d2c', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            className="rm-cmd-input"
            placeholder="Search inventory (RES-021), allocations (RAR-204), dispatches (DSP-041), suppliers (SUP-014)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#738075' }}
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
          <kbd
            style={{
              fontSize: '11px',
              color: '#738075',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid #d4ded3',
              background: '#f8faf7',
              cursor: 'pointer'
            }}
            onClick={onClose}
          >
            ESC
          </kbd>
        </div>

        {/* Quick Category Filter Pills */}
        <div className="rm-cmd-pills">
          {[
            { id: 'all', label: 'All Records', count: allRecords.length },
            { id: 'inventory', label: 'Inventory Items', count: items.length },
            { id: 'allocations', label: 'Allocation Requests', count: allocations.length },
            { id: 'tracking', label: 'Dispatches', count: dispatches.length },
            { id: 'suppliers', label: 'Suppliers', count: suppliers.length }
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              className={`rm-cmd-pill ${categoryFilter === pill.id ? 'active' : ''}`}
              onClick={() => setCategoryFilter(pill.id)}
            >
              {pill.label} ({pill.count})
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="rm-cmd-list" ref={listRef}>
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record, idx) => {
              const Icon = record.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={record.id}
                  className={`rm-cmd-item ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelect(record)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className="rm-cmd-item-left">
                    <div
                      className="rm-cmd-icon-box"
                      style={{ backgroundColor: record.iconBg, color: record.iconColor }}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="rm-cmd-item-content">
                      <div className="rm-cmd-item-title-row">
                        <span className="rm-cmd-code">{record.code}</span>
                        <span className="rm-cmd-title">{record.title}</span>
                      </div>
                      <span className="rm-cmd-sub">{record.subtitle}</span>
                    </div>
                  </div>

                  <div className="rm-cmd-item-right">
                    <span className="rm-cmd-tag">{record.categoryLabel}</span>
                    <span className="rm-cmd-jump">
                      <span>Jump</span>
                      <CornerDownLeft size={12} />
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rm-cmd-empty">
              <Layers size={32} style={{ color: '#b5c2b2', strokeWidth: 1.5 }} />
              <div style={{ fontWeight: 600, color: '#162e20', fontSize: '13.5px' }}>
                No records found matching "{searchTerm}"
              </div>
              <p style={{ margin: 0, fontSize: '11.5px', color: '#738075' }}>
                Try searching by resource code (e.g., RES-021), allocation (RAR-204), dispatch (DSP-041), or supplier (SUP-014).
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="rm-cmd-footer">
          <div className="rm-cmd-shortcuts">
            <span>
              <kbd className="rm-cmd-kbd">↑</kbd> <kbd className="rm-cmd-kbd">↓</kbd> Navigate
            </span>
            <span>
              <kbd className="rm-cmd-kbd">↵</kbd> Select &amp; View
            </span>
            <span>
              <kbd className="rm-cmd-kbd">ESC</kbd> Close
            </span>
          </div>
          <div>
            Showing <strong>{filteredRecords.length}</strong> of <strong>{allRecords.length}</strong> entries
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPaletteModal;
