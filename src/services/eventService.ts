
import { Event } from '@/types/event';
import { useApiService } from '@/utils/apiUtils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock events data (similar to what's in EventContext.tsx)
const mockEvents: Event[] = [
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

export const useEventService = () => {
  const api = useApiService();
  const queryClient = useQueryClient();
  
  // Get all events
  const useEvents = () => {
    return useQuery({
      queryKey: ['events'],
      queryFn: async () => {
        const response = await api.get<Event[]>('/events', {
          mockData: mockEvents,
          requireAuth: true
        });
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        // Convert date strings to Date objects
        const events = response.data?.map(event => ({
          ...event,
          date: new Date(event.date)
        })) || [];
        
        return events;
      }
    });
  };
  
  // Get a single event by ID
  const useEvent = (id: string) => {
    return useQuery({
      queryKey: ['events', id],
      queryFn: async () => {
        const response = await api.get<Event>(`/events/${id}`, {
          mockData: mockEvents.find(e => e.id === id),
          requireAuth: true
        });
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        if (!response.data) {
          throw new Error('Event not found');
        }
        
        // Convert date strings to Date objects
        const event = {
          ...response.data,
          date: new Date(response.data.date)
        };
        
        return event;
      },
      enabled: !!id
    });
  };
  
  // Create a new event
  const useCreateEvent = () => {
    return useMutation({
      mutationFn: async (eventData: Omit<Event, 'id'>) => {
        // Generate an ID for mock mode
        const newId = String(Math.floor(Math.random() * 10000));
        
        const response = await api.post<Event>('/events', eventData, {
          mockData: { id: newId, ...eventData },
          requireAuth: true
        });
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        return response.data;
      },
      onSuccess: () => {
        // Invalidate the events query to refetch the updated list
        queryClient.invalidateQueries({ queryKey: ['events'] });
      }
    });
  };
  
  // Update an existing event
  const useUpdateEvent = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: string, data: Omit<Event, 'id'> }) => {
        const response = await api.put<Event>(`/events/${id}`, data, {
          mockData: { id, ...data },
          requireAuth: true
        });
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        return response.data;
      },
      onSuccess: (_, variables) => {
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ['events'] });
        queryClient.invalidateQueries({ queryKey: ['events', variables.id] });
      }
    });
  };
  
  // Delete an event
  const useDeleteEvent = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        const response = await api.remove<{ success: boolean }>(`/events/${id}`, {
          mockData: { success: true },
          requireAuth: true
        });
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        return response.data;
      },
      onSuccess: (_, id) => {
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ['events'] });
        queryClient.invalidateQueries({ queryKey: ['events', id] });
      }
    });
  };
  
  // Get upcoming events with optional limit
  const useUpcomingEvents = (limit = 5) => {
    return useQuery({
      queryKey: ['events', 'upcoming', limit],
      queryFn: async () => {
        const response = await api.get<Event[]>('/events/upcoming', {
          mockData: mockEvents
            .filter(event => event.date >= new Date())
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(0, limit),
          requireAuth: true
        });
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        // Convert date strings to Date objects
        const events = response.data?.map(event => ({
          ...event,
          date: new Date(event.date)
        })) || [];
        
        return events;
      }
    });
  };
  
  return {
    useEvents,
    useEvent,
    useCreateEvent,
    useUpdateEvent,
    useDeleteEvent,
    useUpcomingEvents
  };
};
