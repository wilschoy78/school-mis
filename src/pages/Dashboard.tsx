
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { MainLayout, PageHeader } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Users, GraduationCap, BookOpen, DollarSign, 
  Calendar, FileText, Info, ChevronRight 
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <MainLayout>
      <PageHeader 
        title="Dashboard" 
        description="Welcome to your school management dashboard"
      />
      
      {user && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Welcome, {user.name}!</h2>
          <p className="text-gray-600">You're logged in as: <span className="font-medium capitalize">{user.role.toLowerCase().replace('_', ' ')}</span></p>
        </div>
      )}
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-gray-500">+4.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">New Enrollments</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Teachers</CardTitle>
            <GraduationCap className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-gray-500">Across 12 departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,432</div>
            <p className="text-xs text-gray-500">Current academic year</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Module Quick Access */}
      <h3 className="font-medium text-lg mb-4">Quick Access</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-school-500" />
              Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Manage student records, view profiles, and track academic progress.</p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/students">
                <span>Access Students</span>
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-school-500" />
              Enrollment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Process new admissions, manage registrations, and track enrollment status.</p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/enrollment">
                <span>Access Enrollment</span>
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-school-500" />
              Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Manage fee collection, track payments, and generate financial reports.</p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/accounts">
                <span>Access Accounts</span>
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
      </div>
    </MainLayout>
  );
};

export default Dashboard;
