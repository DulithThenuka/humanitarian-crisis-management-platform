import React from 'react';
import { LiveSatelliteCrisisMap } from '../../components/maps/LiveSatelliteCrisisMap';

export const OperationalMapView = () => {
  return (
    <div style={{ height: 'calc(100vh - 120px)', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <LiveSatelliteCrisisMap />
    </div>
  );
};
