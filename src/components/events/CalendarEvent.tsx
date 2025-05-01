
import React from 'react';
import { Event } from '@/types/event';
import { cn } from '@/lib/utils';

interface CalendarEventProps {
  event: Event;
  onClick: () => void;
  position: 'allDay' | { top: string; left: string };
}

export const CalendarEvent: React.FC<CalendarEventProps> = ({ 
  event, 
  onClick,
  position 
}) => {
  // Determine event color based on type
  const eventTypeColors: Record<string, string> = {
    meeting: 'bg-blue-100 border-blue-300 text-blue-800',
    sports: 'bg-green-100 border-green-300 text-green-800',
    academic: 'bg-amber-100 border-amber-300 text-amber-800',
    holiday: 'bg-purple-100 border-purple-300 text-purple-800',
    other: 'bg-gray-100 border-gray-300 text-gray-800'
  };
  
  const colorClass = eventTypeColors[event.type] || eventTypeColors.other;
  
  if (position === 'allDay') {
    return (
      <div 
        onClick={onClick}
        className={cn(
          "px-2 py-1 text-xs rounded border cursor-pointer truncate",
          colorClass
        )}
      >
        {event.title}
      </div>
    );
  }
  
  return (
    <div 
      onClick={onClick}
      className={cn(
        "absolute px-2 py-1 text-xs rounded border cursor-pointer w-[calc(100%-10px)]",
        colorClass
      )}
      style={{
        top: position.top,
        left: position.left,
        height: '60px', // Default height for events
        zIndex: 10,
      }}
    >
      <div className="font-medium truncate">{event.title}</div>
      {event.time && <div className="text-xs opacity-80">{event.time}</div>}
    </div>
  );
};
