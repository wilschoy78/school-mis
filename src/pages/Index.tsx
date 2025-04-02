
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, GraduationCap, DollarSign, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useSystemSettings } from './Settings';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { systemName } = useSystemSettings();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-school-500" />
            <span className="text-xl font-semibold">{systemName}</span>
          </div>
          <div className="space-x-2">
            {isAuthenticated ? (
              <Button asChild>
                <Link to="/dashboard">
                  Dashboard
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link to="/login">
                  Sign In
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-gray-100">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                School Management System
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A comprehensive solution for managing student enrollment, account balances, and employee records.
              </p>
              <div className="pt-4">
                <Button asChild size="lg" className="animate-fade-in animation-delay-200">
                  <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                    {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Student Enrollment",
                  description: "Streamline the enrollment process for new and returning students with digital record keeping.",
                  icon: <GraduationCap className="h-8 w-8 text-school-500" />,
                  delay: "animation-delay-100"
                },
                {
                  title: "Financial Management",
                  description: "Track student account balances, process payments, and generate detailed financial reports.",
                  icon: <DollarSign className="h-8 w-8 text-school-500" />,
                  delay: "animation-delay-200"
                },
                {
                  title: "Employee Management",
                  description: "Manage staff records, roles, and permissions with an intuitive administrative interface.",
                  icon: <Users className="h-8 w-8 text-school-500" />,
                  delay: "animation-delay-300"
                },
              ].map((feature, index) => (
                <div key={index} className={`p-6 rounded-lg border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all animate-fade-in ${feature.delay}`}>
                  <div className="p-3 bg-gray-50 rounded-lg inline-block mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA section */}
        <section className="py-20 px-4 bg-school-500">
          <div className="container mx-auto max-w-4xl text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to transform your school management?</h2>
            <p className="text-lg mb-8 opacity-90">
              Our platform provides all the tools you need to streamline administrative processes
              and focus on what matters most: education.
            </p>
            <Button asChild size="lg" variant="secondary" className="animate-fade-in">
              <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                {isAuthenticated ? "Go to Dashboard" : "Get Started Today"}
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <BookOpen className="h-6 w-6 text-white" />
              <span className="text-xl font-semibold text-white">{systemName}</span>
            </div>
            <div className="text-sm">
              &copy; {new Date().getFullYear()} {systemName}. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
