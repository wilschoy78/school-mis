
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Info } from 'lucide-react';

export const UpcomingEvents: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-100 text-blue-700 rounded p-2 mr-4">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Staff Meeting</p>
                <p className="text-sm text-gray-500">Oct 10, 2023 • 10:00 AM</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Info className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-green-100 text-green-700 rounded p-2 mr-4">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Annual Sports Day</p>
                <p className="text-sm text-gray-500">Oct 15, 2023 • All Day</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Info className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-purple-100 text-purple-700 rounded p-2 mr-4">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Parent-Teacher Meeting</p>
                <p className="text-sm text-gray-500">Oct 20, 2023 • 2:00 PM</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Info className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-yellow-100 text-yellow-700 rounded p-2 mr-4">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Mid-Term Exams Begin</p>
                <p className="text-sm text-gray-500">Oct 25, 2023</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
