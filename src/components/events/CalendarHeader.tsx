
import React from 'react';
import { format } from 'date-fns';
import { ArrowLeft, ArrowRight, Calendar, ChevronDown, Menu, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CalendarHeaderProps {
  selectedDate: Date;
  view: 'day' | 'week' | 'month';
  onViewChange: (view: 'day' | 'week' | 'month') => void;
  onNext: () => void;
  onPrev: () => void;
  onToday: () => void;
  toggleSidebar: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  selectedDate,
  view,
  onViewChange,
  onNext,
  onPrev,
  onToday,
  toggleSidebar,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        
        <h2 className="text-xl font-semibold">
          {format(selectedDate, 'MMMM yyyy')}
        </h2>
        
        <div className="flex ml-4 items-center space-x-1">
          <Button variant="ghost" size="icon" onClick={onPrev}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm" onClick={onToday}>
            Today
          </Button>
          
          <Button variant="ghost" size="icon" onClick={onNext}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search events" className="pl-8" />
        </div>
        
        <Select 
          value={view} 
          onValueChange={(value: 'day' | 'week' | 'month') => onViewChange(value)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="View" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
