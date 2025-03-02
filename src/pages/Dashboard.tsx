
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout, PageHeader } from '@/components/layout/MainLayout';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  GraduationCap, 
  Users, 
  DollarSign,
  Clock,
  BookOpen,
  Plus,
  ArrowUpRight,
  BarChart,
} from 'lucide-react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { BarChart as Chart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock enrollment data
const enrollmentData = [
  { month: 'Aug', count: 34 },
  { month: 'Sep', count: 78 },
  { month: 'Oct', count: 45 },
  { month: 'Nov', count: 19 },
  { month: 'Dec', count: 8 },
  { month: 'Jan', count: 56 },
];

// Mock recent students data
const recentStudents = [
  { id: 1, name: 'John Smith', grade: '12', date: '3 days ago', status: 'Enrolled', balance: 1250 },
  { id: 2, name: 'Maria Garcia', grade: '10', date: '4 days ago', status: 'Pending', balance: 750 },
  { id: 3, name: 'Robert Johnson', grade: '9', date: '5 days ago', status: 'Enrolled', balance: 850 },
  { id: 4, name: 'Lisa Wong', grade: '11', date: '1 week ago', status: 'Enrolled', balance: 0 },
  { id: 5, name: 'James Brown', grade: '10', date: '1 week ago', status: 'Pending', balance: 1500 },
];

// Mock recent payments data
const recentPayments = [
  { id: 1, student: 'Emily Davis', amount: 1200, date: '2 days ago', type: 'Tuition' },
  { id: 2, student: 'Michael Wilson', amount: 500, date: '3 days ago', type: 'Books' },
  { id: 3, student: 'Sophia Martinez', amount: 850, date: '5 days ago', type: 'Tuition' },
  { id: 4, student: 'Daniel Thompson', amount: 300, date: '1 week ago', type: 'Laboratory' },
  { id: 5, student: 'Olivia Johnson', amount: 750, date: '1 week ago', type: 'Tuition' },
];

const Dashboard = () => {
  const { user, checkPermission } = useAuth();
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  // Get stats based on user role
  const stats = useMemo(() => {
    const allStats = [
      {
        title: 'Total Students',
        value: '1,234',
        icon: GraduationCap,
        trend: { value: 12, isPositive: true },
        description: '128 new this month',
        iconClassName: 'bg-blue-50',
        link: '/students',
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.REGISTRAR, UserRole.TEACHER]
      },
      {
        title: 'Pending Enrollment',
        value: '32',
        icon: Clock,
        description: 'Awaiting approval',
        iconClassName: 'bg-amber-50',
        link: '/enrollment',
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.REGISTRAR]
      },
      {
        title: 'Total Revenue',
        value: formatCurrency(845600),
        icon: DollarSign,
        trend: { value: 8, isPositive: true },
        description: 'Academic year to date',
        iconClassName: 'bg-green-50',
        link: '/accounts',
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CASHIER]
      },
      {
        title: 'Employees',
        value: '87',
        icon: Users,
        description: 'Teachers and staff',
        iconClassName: 'bg-purple-50',
        link: '/employees',
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
      },
    ];
    
    return allStats.filter(stat => checkPermission(stat.roles));
  }, [checkPermission]);
  
  // Role specific content
  const renderRoleSpecificContent = () => {
    if (checkPermission([UserRole.REGISTRAR, UserRole.SUPER_ADMIN, UserRole.ADMIN])) {
      return (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enrollment Chart */}
          <DashboardCard 
            title="Enrollment Trends" 
            description="Monthly student enrollment statistics"
            className="col-span-1 animate-fade-in animation-delay-200"
          >
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <Chart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} students`, "Enrollment"]}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </Chart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
          
          {/* Recent students */}
          <DashboardCard 
            title="Recent Enrollments" 
            description="Latest student registrations"
            footer={
              <Button variant="ghost" asChild className="w-full text-sm">
                <Link to="/students" className="flex items-center justify-center">
                  View all students
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            }
            className="animate-fade-in animation-delay-300"
          >
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {recentStudents.map((student) => (
                  <div 
                    key={student.id} 
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-700">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">Grade {student.grade} • {student.date}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        student.status === 'Enrolled' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {student.status}
                      </span>
                      <span className="text-xs mt-1">{formatCurrency(student.balance)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DashboardCard>
        </div>
      );
    }
    
    if (checkPermission([UserRole.CASHIER])) {
      return (
        <div className="mt-8">
          <DashboardCard 
            title="Recent Payments" 
            description="Latest financial transactions"
            footer={
              <Button variant="ghost" asChild className="w-full text-sm">
                <Link to="/accounts" className="flex items-center justify-center">
                  View all transactions
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            }
            className="animate-fade-in animation-delay-200"
          >
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div 
                    key={payment.id} 
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-green-100 text-green-700">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{payment.student}</p>
                        <p className="text-xs text-muted-foreground">{payment.type} • {payment.date}</p>
                      </div>
                    </div>
                    <div className="font-medium text-green-600">
                      +{formatCurrency(payment.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DashboardCard>
        </div>
      );
    }
    
    return (
      <div className="mt-8">
        <DashboardCard className="animate-fade-in animation-delay-200">
          <div className="py-6 text-center">
            <BarChart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Welcome to your dashboard</h3>
            <p className="text-muted-foreground mt-2">
              You have access to view and manage content based on your role.
            </p>
          </div>
        </DashboardCard>
      </div>
    );
  };
  
  return (
    <MainLayout>
      <PageHeader 
        title={`Welcome, ${user?.name}`}
        description="Here's an overview of your school's current status"
      />
      
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`animate-fade-in animation-delay-${index * 100}`}>
            <StatCard
              {...stat}
              onClick={() => stat.link ? window.location.href = stat.link : null}
            />
          </div>
        ))}
      </div>
      
      {/* Quick actions */}
      <div className="mb-8 animate-fade-in animation-delay-400">
        <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          {checkPermission([UserRole.REGISTRAR, UserRole.SUPER_ADMIN, UserRole.ADMIN]) && (
            <Button asChild size="sm" className="gap-1">
              <Link to="/students">
                <Plus className="h-4 w-4" />
                New Student
              </Link>
            </Button>
          )}
          {checkPermission([UserRole.CASHIER, UserRole.SUPER_ADMIN, UserRole.ADMIN]) && (
            <Button asChild size="sm" className="gap-1" variant="outline">
              <Link to="/accounts">
                <Plus className="h-4 w-4" />
                Record Payment
              </Link>
            </Button>
          )}
          {checkPermission([UserRole.SUPER_ADMIN, UserRole.ADMIN]) && (
            <Button asChild size="sm" className="gap-1" variant="outline">
              <Link to="/employees">
                <Plus className="h-4 w-4" />
                Add Employee
              </Link>
            </Button>
          )}
          <Button asChild size="sm" className="gap-1" variant="outline">
            <Link to="/dashboard">
              <BarChart className="h-4 w-4" />
              View Reports
            </Link>
          </Button>
        </div>
      </div>
      
      <Separator className="my-8" />
      
      {/* Role-specific content */}
      {renderRoleSpecificContent()}
    </MainLayout>
  );
};

export default Dashboard;
