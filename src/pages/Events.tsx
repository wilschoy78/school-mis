
import React, { useState } from 'react';
import { MainLayout, PageHeader } from '@/components/layout/MainLayout';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useEvents } from '@/context/EventContext';
import { Badge } from '@/components/ui/badge';
import { EventForm } from '@/components/events/EventForm';
import { Button } from '@/components/ui/button';
import { CalendarPlus, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Event } from '@/types/event';

const Events = () => {
  const { events } = useEvents();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  // Get event dates for highlighting on the calendar
  const eventDates = events.map(event => event.date);
  
  // Filter events based on selected date and type
  const filteredEvents = events.filter(event => {
    const isSameDate = selectedDate 
      ? event.date.toDateString() === selectedDate.toDateString()
      : true;
      
    const matchesType = filterType 
      ? event.type === filterType 
      : true;
      
    return isSameDate && matchesType;
  });

  // Get unique event types for filter dropdown
  const eventTypes = Array.from(new Set(events.map(event => event.type)));

  return (
    <MainLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-8">
          <PageHeader 
            title="Events Calendar" 
            description="View and manage school events" 
          />
          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogTrigger asChild>
              <Button>
                <CalendarPlus className="mr-2 h-4 w-4" /> Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <EventForm 
                onSuccess={() => setIsAddEventOpen(false)}
                initialDate={selectedDate}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-4 md:col-span-1">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Filter Events</h3>
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-4 w-4" />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={undefined}>All Events</SelectItem>
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={selectedMonth}
              onMonthChange={setSelectedMonth}
              className="rounded-md pointer-events-auto"
              modifiers={{
                highlighted: (date) => 
                  eventDates.some(eventDate => 
                    eventDate.toDateString() === date.toDateString()
                  )
              }}
              modifiersStyles={{
                highlighted: { 
                  fontWeight: 'bold', 
                  backgroundColor: 'var(--school-100)',
                  color: 'var(--school-700)'
                }
              }}
            />
          </Card>

          <Card className="md:col-span-2 p-4 overflow-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
            <h3 className="text-lg font-medium mb-4">
              {selectedDate ? (
                <>Events for {format(selectedDate, 'MMMM d, yyyy')}</>
              ) : (
                <>All Events</>
              )}
              {filterType && <> - {filterType} type</>}
            </h3>

            {filteredEvents.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No events found for the selected criteria
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvents
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

// Event Card component for displaying individual events
const EventCard = ({ event }: { event: Event }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { deleteEvent } = useEvents();
  const eventTypeColors: Record<string, string> = {
    meeting: 'bg-blue-100 text-blue-800',
    sports: 'bg-green-100 text-green-800',
    academic: 'bg-amber-100 text-amber-800',
    holiday: 'bg-purple-100 text-purple-800',
    other: 'bg-gray-100 text-gray-800'
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium">{event.title}</h3>
            <Badge className={eventTypeColors[event.type] || eventTypeColors.other}>
              {event.type}
            </Badge>
            {event.allDay && <Badge variant="outline">All Day</Badge>}
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {format(event.date, 'MMM d, yyyy')}
            {!event.allDay && event.time && <span> • {event.time}</span>}
          </p>
          {event.description && (
            <p className="text-sm mt-2">{event.description}</p>
          )}
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">Edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <EventForm 
                event={event} 
                onSuccess={() => setIsEditOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => deleteEvent(event.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Events;
