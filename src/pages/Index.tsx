
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Calendar, DollarSign, FileText, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Student Management",
      description: "Comprehensive student records, enrollment, and academic tracking system."
    },
    {
      icon: <UserCheck className="h-8 w-8 text-primary" />,
      title: "Staff Management",
      description: "Employee records, role management, and organizational structure."
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary" />,
      title: "Events & Calendar",
      description: "School events, academic calendar, and important date management."
    },
    {
      icon: <DollarSign className="h-8 w-8 text-primary" />,
      title: "Financial Management",
      description: "Tuition tracking, payment processing, and financial reporting."
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Document Management",
      description: "Digital storage and organization of important school documents."
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Library System",
      description: "Book inventory, borrowing system, and library resource management."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">EduAdmin Pro</h1>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Button asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-50 mb-6">
            Complete School
            <span className="text-primary"> Management System</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Streamline your educational institution with our comprehensive management platform. 
            Handle students, staff, finances, and operations all in one place.
          </p>
          <div className="flex justify-center space-x-4">
            {!isAuthenticated && (
              <Button size="lg" asChild>
                <Link to="/auth">Start Free Trial</Link>
              </Button>
            )}
            <Button variant="outline" size="lg" asChild>
              <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
                {isAuthenticated ? "Go to Dashboard" : "View Demo"}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-50 mb-12">
            Everything You Need to Manage Your School
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-6">
            Ready to Transform Your School Management?
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join hundreds of educational institutions already using EduAdmin Pro.
          </p>
          {!isAuthenticated && (
            <Button size="lg" asChild>
              <Link to="/auth">Get Started Today</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 EduAdmin Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
