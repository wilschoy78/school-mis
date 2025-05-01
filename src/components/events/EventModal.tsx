
import React from 'react';
import { format } from 'date-fns';
import { Event } from '@/types/event';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Type } from 'lucide-react';
import { EventForm } from '@/components/events/EventForm';

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onEventUpdated: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  event,
  isOpen,
  onClose,
  onEventUpdated
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
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

  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        {isEditing ? (
          <EventForm 
            event={event} 
            onSuccess={() => {
              setIsEditing(false);
              onEventUpdated();
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <DialogHeader>
              <div className="flex justify-between items-start">
                <DialogTitle className="text-xl">{event.title}</DialogTitle>
                <div className="flex gap-2">
                  <Badge variant="outline">{event.type}</Badge>
                  {event.allDay && <Badge variant="secondary">All Day</Badge>}
                </div>
              </div>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</span>
              </div>
              
              {!event.allDay && event.time && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{event.time}</span>
                </div>
              )}
              
              {event.description && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-sm font-medium mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
              )}
              
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                >
                  Close
                </Button>
                
                {!isEventPast(event) && (
                  <Button
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Event
                  </Button>
                )}
                
                {isEventPast(event) && (
                  <Button disabled variant="outline">
                    Event Completed
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
