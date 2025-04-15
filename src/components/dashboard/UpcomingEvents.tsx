
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Info, Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEvents } from '@/context/EventContext';
import { EventForm } from '@/components/events/EventForm';
import { Event } from '@/types/event';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const UpcomingEvents: React.FC = () => {
  const { getUpcomingEvents, addEvent, updateEvent, deleteEvent } = useEvents();
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const upcomingEvents = getUpcomingEvents(4);

  const handleAddEvent = (data: Omit<Event, 'id'>) => {
    addEvent(data);
    setIsAddOpen(false);
    toast({
      title: "Event Added",
      description: "The event has been successfully added to your calendar.",
    });
  };

  const handleUpdateEvent = (data: Omit<Event, 'id'>) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, data);
      setEditingEvent(null);
      toast({
        title: "Event Updated",
        description: "The event has been successfully updated.",
      });
    }
  };

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
    toast({
      title: "Event Deleted",
      description: "The event has been removed from your calendar.",
      variant: "destructive",
    });
  };

  const getEventColor = (type: Event['type']) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-700';
      case 'sports':
        return 'bg-green-100 text-green-700';
      case 'academic':
        return 'bg-purple-100 text-purple-700';
      case 'holiday':
        return 'bg-yellow-100 text-yellow-700';
      case 'other':
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Upcoming Events</CardTitle>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <EventForm 
              onSubmit={handleAddEvent} 
              onCancel={() => setIsAddOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {upcomingEvents.length > 0 ? (
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`${getEventColor(event.type)} rounded p-2 mr-4`}>
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-500">
                      {format(event.date, 'MMM d, yyyy')}
                      {!event.allDay && event.time && ` • ${event.time}`}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Info className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsDetailsOpen(true);
                      }}
                    >
                      <Info className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setEditingEvent(event)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Event
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Event
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No upcoming events</p>
            <Button
              variant="link"
              onClick={() => setIsAddOpen(true)}
              className="mt-2"
            >
              Add your first event
            </Button>
          </div>
        )}

        {/* Event Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Event Details</DialogTitle>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>
                      {format(selectedEvent.date, 'PPPP')}
                      {!selectedEvent.allDay && selectedEvent.time && ` at ${selectedEvent.time}`}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className={`${getEventColor(selectedEvent.type)} rounded-full px-3 py-1 text-xs`}>
                    {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                  </div>
                  {selectedEvent.allDay && (
                    <div className="ml-2 bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs">
                      All day
                    </div>
                  )}
                </div>
                
                {selectedEvent.description && (
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm">{selectedEvent.description}</p>
                  </div>
                )}
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingEvent(selectedEvent);
                      setIsDetailsOpen(false);
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleDeleteEvent(selectedEvent.id);
                      setIsDetailsOpen(false);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Event Dialog */}
        <Dialog 
          open={!!editingEvent} 
          onOpenChange={(open) => !open && setEditingEvent(null)}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
            </DialogHeader>
            {editingEvent && (
              <EventForm 
                onSubmit={handleUpdateEvent}
                defaultValues={editingEvent}
                onCancel={() => setEditingEvent(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
