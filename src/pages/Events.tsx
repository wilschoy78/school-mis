
import React, { useState, useEffect } from 'react';
import { MainLayout, PageHeader } from '@/components/layout/MainLayout';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, subDays, addWeeks, subWeeks, isSameDay, parseISO, isToday } from 'date-fns';
import { useEvents } from '@/context/EventContext';
import { Event } from '@/types/event';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { EventForm } from '@/components/events/EventForm';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  ArrowRight, 
  CalendarPlus, 
  ChevronDown, 
  Search,
  Settings, 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CalendarHeader } from '@/components/events/CalendarHeader';
import { EventModal } from '@/components/events/EventModal';
import { CalendarSidebar } from '@/components/events/CalendarSidebar';
import { Input } from '@/components/ui/input';
import { CalendarEvent } from '@/components/events/CalendarEvent';

const Events = () => {
  const { events } = useEvents();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isViewEventOpen, setIsViewEventOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // Initialize the week days
  useEffect(() => {
    const daysInWeek = getWeekDays(selectedDate);
    setCurrentWeek(daysInWeek);
  }, [selectedDate]);

  // Get array of days for the week containing the date
  const getWeekDays = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Start week on Monday
    const end = endOfWeek(date, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  };

  // Navigate to previous week
  const prevWeek = () => {
    const newDate = subWeeks(selectedDate, 1);
    setSelectedDate(newDate);
  };

  // Navigate to next week
  const nextWeek = () => {
    const newDate = addWeeks(selectedDate, 1);
    setSelectedDate(newDate);
  };

  // Go to today
  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.date), date)
    );
  };

  // Handle event click
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsViewEventOpen(true);
  };

  // Check if an event overlaps with any others on the same day
  const getEventPosition = (event: Event, dayEvents: Event[]) => {
    if (event.allDay) return 0;
    
    // Sort events by start time
    const sortedEvents = [...dayEvents]
      .filter(e => !e.allDay)
      .sort((a, b) => {
        const timeA = a.time ? new Date(`1970-01-01T${a.time}`).getTime() : 0;
        const timeB = b.time ? new Date(`1970-01-01T${b.time}`).getTime() : 0;
        return timeA - timeB;
      });
    
    return sortedEvents.findIndex(e => e.id === event.id) * 5;
  };

  // Format hour labels for the time grid
  const hourLabels = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8; // Starting from 8 AM
    return `${hour % 12 === 0 ? 12 : hour % 12} ${hour >= 12 ? 'PM' : 'AM'}`;
  });

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Calendar Sidebar */}
        {showSidebar && (
          <CalendarSidebar 
            selectedDate={selectedDate}
            onDateSelect={(date) => setSelectedDate(date)}
          />
        )}

        {/* Main Calendar Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Calendar Header */}
          <CalendarHeader 
            selectedDate={selectedDate}
            view={view}
            onViewChange={setView}
            onNext={nextWeek}
            onPrev={prevWeek}
            onToday={goToToday}
            toggleSidebar={() => setShowSidebar(!showSidebar)}
          />

          {/* Week View */}
          <div className="flex-1 overflow-auto">
            <div className="relative min-h-full">
              {/* Day headers */}
              <div className="sticky top-0 z-10 flex border-b bg-background">
                {/* Time gutter */}
                <div className="w-16 flex-shrink-0"></div>
                
                {/* Day columns */}
                {currentWeek.map((day) => (
                  <div 
                    key={day.toISOString()} 
                    className={cn(
                      "flex-1 text-center py-2 border-l font-medium",
                      isToday(day) && "bg-blue-50 dark:bg-blue-900/20"
                    )}
                  >
                    <div className={cn(
                      "text-xs uppercase", 
                      isToday(day) && "text-blue-600 dark:text-blue-400"
                    )}>
                      {format(day, 'EEE')}
                    </div>
                    <div className={cn(
                      "w-8 h-8 mx-auto rounded-full flex items-center justify-center mt-1",
                      isToday(day) && "bg-blue-600 text-white"
                    )}>
                      {format(day, 'd')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time grid */}
              <div className="flex flex-1 min-h-[800px]">
                {/* Time labels */}
                <div className="w-16 flex-shrink-0 border-r">
                  {hourLabels.map((hour, index) => (
                    <div key={index} className="h-20 border-t relative">
                      <span className="text-xs text-muted-foreground absolute -top-2.5 left-2">
                        {hour}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Day columns with events */}
                {currentWeek.map((day) => {
                  const dayEvents = getEventsForDay(day);
                  return (
                    <div 
                      key={day.toISOString()} 
                      className={cn(
                        "flex-1 border-l relative",
                        isToday(day) && "bg-blue-50/50 dark:bg-blue-900/10"
                      )}
                    >
                      {/* Hour cells */}
                      {hourLabels.map((_, index) => (
                        <div 
                          key={index} 
                          className="h-20 border-t"
                        ></div>
                      ))}
                      
                      {/* All-day events at the top */}
                      <div className="absolute top-0 left-0 right-0 flex flex-col gap-1 p-1">
                        {dayEvents
                          .filter(event => event.allDay)
                          .map(event => (
                            <CalendarEvent 
                              key={event.id}
                              event={event}
                              onClick={() => handleEventClick(event)}
                              position="allDay"
                            />
                          ))}
                      </div>
                      
                      {/* Timed events */}
                      {dayEvents
                        .filter(event => !event.allDay && event.time)
                        .map(event => {
                          // Convert time to hours to position the event
                          const timeString = event.time || '00:00';
                          const [hours, minutes] = timeString.split(':').map(Number);
                          // Position from top based on time (8AM - 8PM time range)
                          const topPosition = ((hours - 8) + minutes / 60) * 80; // 80px per hour
                          const leftOffset = getEventPosition(event, dayEvents);
                          
                          return (
                            <CalendarEvent
                              key={event.id}
                              event={event}
                              onClick={() => handleEventClick(event)}
                              position={{
                                top: `${topPosition}px`,
                                left: `${leftOffset}px`,
                              }}
                            />
                          );
                        })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Add Event Button (Floating) */}
          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <Button 
              onClick={() => setIsAddEventOpen(true)}
              className="absolute bottom-6 right-6 rounded-full w-14 h-14 shadow-lg"
              size="icon"
            >
              <CalendarPlus />
            </Button>
            <DialogContent className="sm:max-w-[550px]">
              <EventForm 
                onSuccess={() => setIsAddEventOpen(false)}
                initialDate={selectedDate}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Event view/edit modal */}
      <EventModal 
        event={selectedEvent} 
        isOpen={isViewEventOpen} 
        onClose={() => setIsViewEventOpen(false)}
        onEventUpdated={() => setIsViewEventOpen(false)}
      />
    </MainLayout>
  );
};

export default Events;
