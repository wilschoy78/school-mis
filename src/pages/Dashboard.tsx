
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { MainLayout, PageHeader } from '@/components/layout/MainLayout';
import { 
  WelcomeCard,
  QuickStats,
  QuickAccess,
  ActivityAndEvents
} from '@/components/dashboard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for dashboard charts
const enrollmentData = [
  { grade: 'Grade 1', count: 45 },
  { grade: 'Grade 2', count: 52 },
  { grade: 'Grade 3', count: 48 },
  { grade: 'Grade 4', count: 56 },
  { grade: 'Grade 5', count: 42 },
  { grade: 'Grade 6', count: 38 },
];

const attendanceData = [
  { month: 'Jan', rate: 92 },
  { month: 'Feb', rate: 94 },
  { month: 'Mar', rate: 91 },
  { month: 'Apr', rate: 95 },
  { month: 'May', rate: 93 },
  { month: 'Jun', rate: 96 },
];

const genderDistribution = [
  { name: 'Male', value: 210 },
  { name: 'Female', value: 230 },
  { name: 'Other', value: 15 },
];

const COLORS = ['#4CAF50', '#2196F3', '#FF5722'];

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <MainLayout>
      <div className="py-6">
        <PageHeader 
          title="Dashboard" 
          description="Welcome to your school management dashboard"
        />
        
        <WelcomeCard user={user} />
        <QuickStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Enrollment by Grade</CardTitle>
              <CardDescription>Number of students in each grade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={enrollmentData}>
                    <XAxis dataKey="grade" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value} students`, 'Enrolled']}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Bar dataKey="count" name="Students" fill="#2196F3" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Student Gender Distribution</CardTitle>
              <CardDescription>Breakdown of students by gender</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {genderDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} students`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Monthly Attendance Rate</CardTitle>
              <CardDescription>Average attendance percentage by month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={attendanceData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="month" />
                    <YAxis domain={[80, 100]} />
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Attendance Rate']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Bar dataKey="rate" name="Attendance Rate" fill="#4CAF50" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <QuickAccess />
        <ActivityAndEvents />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
