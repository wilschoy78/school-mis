
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, BookOpen, DollarSign, ChevronRight, Library as LibraryIcon } from 'lucide-react';

export const QuickAccess: React.FC = () => {
  return (
    <>
      <h3 className="font-medium text-lg mb-4">Quick Access</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <LibraryIcon className="mr-2 h-5 w-5 text-school-500" />
              Library
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Manage book inventory, track borrowing, and view library reports.</p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/library">
                <span>Access Library</span>
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
