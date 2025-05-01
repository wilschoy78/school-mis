
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
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Events = () => {
  const { events } = useEvents();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isViewEventOpen, setIsViewEventOpen] = useState(false);

  // Get event dates for highlighting on the calendar
  const eventDates = events.map(event => event.date);
  
  // Filter events based on selected date only
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

  // Function to handle day click on calendar
  const handleDayClick = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  // Function to handle event click
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsViewEventOpen(true);
  };

  // Check if event is in the past
  const isEventPast = (event: Event) => {
    const now = new Date();
    const eventDate = new Date(event.date);
    
    if (eventDate < now) {
      // If it's an all-day event, check if the day has passed
      if (event.allDay) {
        return eventDate.setHours(23, 59, 59, 999) < now.getTime();
      }
      
      // If it has a specific time, check if that time has passed
      if (event.time) {
        const [hours, minutes] = event.time.split(':').map(Number);
        eventDate.setHours(hours, minutes);
        return eventDate < now;
      }
      
      return true;
    }
    
    return false;
  };

  return (
    <MainLayout>
      <div className="py-4">
        <div className="flex justify-between items-center mb-4">
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

        <div className="grid grid-cols-1 gap-6">
          <div className="flex gap-4 items-center mb-2">
            <Filter className="h-4 w-4" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[200px]">
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
          
          <Card className="p-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDayClick}
              month={selectedMonth}
              onMonthChange={setSelectedMonth}
              className="w-full rounded-md pointer-events-auto"
              modifiers={{
                highlighted: (date) => 
                  eventDates.some(eventDate => 
                    eventDate.toDateString() === date.toDateString()
                  ),
                hasEvents: (date) => 
                  events.filter(event => event.date.toDateString() === date.toDateString()).length > 0
              }}
              modifiersStyles={{
                highlighted: { 
                  fontWeight: 'bold', 
                  backgroundColor: 'var(--school-100)',
                  color: 'var(--school-700)'
                },
                hasEvents: {
                  position: 'relative'
                }
              }}
              footer={
                selectedDate && filteredEvents.length > 0 ? (
                  <div className="mt-4 p-2 border rounded-md bg-muted/50">
                    <h3 className="text-sm font-medium mb-2">
                      Events on {format(selectedDate, 'MMMM d, yyyy')}:
                    </h3>
                    <div className="space-y-1">
                      {filteredEvents.map((event) => (
                        <EventPreview 
                          key={event.id} 
                          event={event} 
                          onClick={() => handleEventClick(event)}
                        />
                      ))}
                    </div>
                  </div>
                ) : selectedDate ? (
                  <div className="mt-4 p-2 text-center text-sm text-muted-foreground">
                    No events on {format(selectedDate, 'MMMM d, yyyy')}
                  </div>
                ) : null
              }
            />
          </Card>
        </div>
      </div>
      
      {/* Event view dialog */}
      <Dialog open={isViewEventOpen && !!selectedEvent} onOpenChange={setIsViewEventOpen}>
        <DialogContent className="sm:max-w-[550px]">
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{selectedEvent.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge>
                      {selectedEvent.type}
                    </Badge>
                    {selectedEvent.allDay && <Badge variant="outline">All Day</Badge>}
                  </div>
                </div>
              </div>
              
              <div className="py-2">
                <p className="text-sm text-muted-foreground">
                  {format(selectedEvent.date, 'MMMM d, yyyy')}
                  {!selectedEvent.allDay && selectedEvent.time && <span> • {selectedEvent.time}</span>}
                </p>
                
                {selectedEvent.description && (
                  <p className="mt-4">{selectedEvent.description}</p>
                )}
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsViewEventOpen(false)}
                >
                  Close
                </Button>
                
                {!isEventPast(selectedEvent) && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Edit Event</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px]">
                      <EventForm 
                        event={selectedEvent}
                        onSuccess={() => {
                          setIsViewEventOpen(false);
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                )}
                
                {isEventPast(selectedEvent) && (
                  <Button disabled variant="outline">
                    Event Completed
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

// Event Preview component for displaying events in the calendar footer
const EventPreview = ({ event, onClick }: { event: Event, onClick: () => void }) => {
  const eventTypeColors: Record<string, string> = {
    meeting: 'bg-blue-100 text-blue-800 border-blue-200',
    sports: 'bg-green-100 text-green-800 border-green-200',
    academic: 'bg-amber-100 text-amber-800 border-amber-200',
    holiday: 'bg-purple-100 text-purple-800 border-purple-200',
    other: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return (
    <div 
      className={`px-2 py-1 rounded border cursor-pointer transition-colors hover:opacity-80 ${eventTypeColors[event.type] || eventTypeColors.other}`}
      onClick={onClick}
    >
      <div className="flex justify-between">
        <span className="font-medium truncate">{event.title}</span>
        {!event.allDay && event.time && (
          <span className="text-xs">{event.time}</span>
        )}
      </div>
    </div>
  );
};

export default Events;
