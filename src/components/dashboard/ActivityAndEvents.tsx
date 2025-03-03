
import React from 'react';
import { RecentActivity } from './RecentActivity';
import { UpcomingEvents } from './UpcomingEvents';

export const ActivityAndEvents: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <RecentActivity />
      <UpcomingEvents />
    </div>
  );
};
