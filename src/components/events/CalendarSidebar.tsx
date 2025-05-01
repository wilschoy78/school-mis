
import React, { useState } from 'react';
import { format, setDate } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface CalendarSidebarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const CalendarSidebar: React.FC<CalendarSidebarProps> = ({ 
  selectedDate, 
  onDateSelect 
}) => {
  const [isCalendarsOpen, setIsCalendarsOpen] = useState(true);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  
  // Sample calendars and categories for the UI
  const calendars = [
    { id: 'daily', name: 'Daily Sync', checked: true },
    { id: 'birthdays', name: 'Birthdays', checked: true },
    { id: 'tasks', name: 'Tasks', checked: false },
  ];
  
  const categories = [
    { id: 'work', name: 'Work', color: 'bg-blue-500', checked: true },
    { id: 'personal', name: 'Personal', color: 'bg-green-500', checked: true },
    { id: 'education', name: 'Education', color: 'bg-purple-500', checked: true },
  ];

  return (
    <div className="w-64 border-r bg-background flex flex-col overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Calendar</h2>
            <p className="text-xs text-muted-foreground">School Workspace</p>
          </div>
          <div className="w-10 h-10 rounded bg-red-100 flex items-center justify-center">
            <span className="text-red-600 font-semibold">
              {format(selectedDate, 'd')}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-6">
        <Card className="shadow-none border">
          <Calendar 
            mode="single" 
            selected={selectedDate} 
            onSelect={(date) => date && onDateSelect(date)} 
            className="rounded-md" 
          />
        </Card>
        
        <Collapsible open={isCalendarsOpen} onOpenChange={setIsCalendarsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex w-full justify-between p-2 h-auto">
              <span className="font-medium">My Calendars</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-2 ml-2 mt-2">
              {calendars.map(calendar => (
                <div key={calendar.id} className="flex items-center space-x-2">
                  <Checkbox id={calendar.id} defaultChecked={calendar.checked} />
                  <label htmlFor={calendar.id} className="text-sm">
                    {calendar.name}
                  </label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <Collapsible open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex w-full justify-between p-2 h-auto">
              <span className="font-medium">Categories</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-2 ml-2 mt-2">
              {categories.map(category => (
                <div key={category.id} className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${category.color}`}></span>
                  <Checkbox id={category.id} defaultChecked={category.checked} />
                  <label htmlFor={category.id} className="text-sm">
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
