
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event } from '@/types/event';

// Sample initial events
const initialEvents: Event[] = [
  {
    id: '1',
    title: 'Staff Meeting',
    date: new Date(2025, 3, 20, 10, 0),
    time: '10:00 AM',
    type: 'meeting',
    allDay: false,
  },
  {
    id: '2',
    title: 'Annual Sports Day',
    date: new Date(2025, 3, 25),
    type: 'sports',
    allDay: true,
  },
  {
    id: '3',
    title: 'Parent-Teacher Meeting',
    date: new Date(2025, 3, 28, 14, 0),
    time: '2:00 PM',
    type: 'meeting',
    allDay: false,
  },
  {
    id: '4',
    title: 'Mid-Term Exams Begin',
    date: new Date(2025, 4, 5),
    type: 'academic',
    allDay: true,
  }
];

interface EventContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  getUpcomingEvents: (limit?: number) => Event[];
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);

  // Load events from localStorage on mount
  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      try {
        // Parse dates which are stored as strings
        const parsedEvents = JSON.parse(storedEvents, (key, value) => {
          if (key === 'date') return new Date(value);
          return value;
        });
        setEvents(parsedEvents);
      } catch (error) {
        console.error('Failed to parse stored events:', error);
        setEvents(initialEvents);
      }
    } else {
      setEvents(initialEvents);
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const addEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: string, eventData: Partial<Event>) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === id ? { ...event, ...eventData } : event
      )
    );
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const getUpcomingEvents = (limit = 5): Event[] => {
    const now = new Date();
    return events
      .filter(event => event.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, limit);
  };

  return (
    <EventContext.Provider value={{ events, addEvent, updateEvent, deleteEvent, getUpcomingEvents }}>
      {children}
    </EventContext.Provider>
  );
};
