
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';

import { Event } from '@/types/event';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useEvents } from '@/context/EventContext';

const FormSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
  date: z.date({ required_error: 'Event date is required' }),
  time: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(['meeting', 'sports', 'academic', 'holiday', 'other']),
  allDay: z.boolean().default(false),
});

type EventFormValues = z.infer<typeof FormSchema>;

interface EventFormProps {
  event?: Event;
  initialDate?: Date;
  onSuccess?: () => void;
  onCancel?: () => void;
  // For backward compatibility with UpcomingEvents component
  onSubmit?: (data: Omit<Event, 'id'>) => void;
  defaultValues?: Event;
}

export const EventForm: React.FC<EventFormProps> = ({
  event,
  initialDate,
  onSuccess,
  onCancel,
  onSubmit, // For backward compatibility
  defaultValues, // For backward compatibility
}) => {
  const { addEvent, updateEvent } = useEvents();
  
  // Use event first, then fallback to defaultValues (for backward compatibility)
  const eventToUse = event || defaultValues;
  
  const form = useForm<EventFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: eventToUse?.title || '',
      date: eventToUse?.date || initialDate || new Date(),
      time: eventToUse?.time || '',
      description: eventToUse?.description || '',
      type: eventToUse?.type || 'meeting',
      allDay: eventToUse?.allDay || false,
    },
  });

  const watchAllDay = form.watch('allDay');

  const handleSubmit = (data: EventFormValues) => {
    // Ensure required fields are present before passing to context functions
    const eventData: Omit<Event, 'id'> = {
      title: data.title,
      date: data.date,
      time: data.time || '',
      description: data.description || '',
      type: data.type,
      allDay: data.allDay
    };

    if (onSubmit) {
      // For backward compatibility with UpcomingEvents component
      onSubmit(eventData);
    } else {
      // Use the context functions
      if (eventToUse) {
        updateEvent(eventToUse.id, eventData);
      } else {
        addEvent(eventData);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Form title */}
        <h2 className="text-lg font-semibold">
          {eventToUse ? 'Edit Event' : 'Add New Event'}
        </h2>
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter event title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Event Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {!watchAllDay && (
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="time" 
                      className="pl-8" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="holiday">Holiday</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add more details about the event"
                  className="resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allDay"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>All Day Event</FormLabel>
                <FormDescription>
                  Toggle if this event lasts the entire day
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">Save Event</Button>
        </div>
      </form>
    </Form>
  );
};
