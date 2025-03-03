
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, DollarSign, Calendar, FileText } from 'lucide-react';

export const RecentActivity: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="mr-4 mt-0.5">
              <BookOpen className="h-5 w-5 text-school-500" />
            </div>
            <div>
              <p className="font-medium">New Student Enrolled</p>
              <p className="text-sm text-gray-500">Emily Johnson enrolled in Grade 10</p>
              <p className="text-xs text-gray-400">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="mr-4 mt-0.5">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="font-medium">Fee Payment Received</p>
              <p className="text-sm text-gray-500">Michael Smith paid $500 for Tuition Fee</p>
              <p className="text-xs text-gray-400">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="mr-4 mt-0.5">
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="font-medium">Event Scheduled</p>
              <p className="text-sm text-gray-500">Annual Sports Day scheduled for Oct 15</p>
              <p className="text-xs text-gray-400">Yesterday</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="mr-4 mt-0.5">
              <FileText className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="font-medium">Report Generated</p>
              <p className="text-sm text-gray-500">Monthly attendance report generated</p>
              <p className="text-xs text-gray-400">2 days ago</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
