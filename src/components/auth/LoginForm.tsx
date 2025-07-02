
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, BookOpen } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { LoginFormData } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSystemSettings } from '@/pages/Settings';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();
  const { systemName, logo } = useSystemSettings();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormData) => {
    await login(values);
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleDemoLogin = async (role: string) => {
    let email, password;
    
    switch (role) {
      case 'admin':
        email = 'admin@school.edu';
        password = 'admin123';
        break;
      case 'registrar':
        email = 'registrar@school.edu';
        password = 'registrar123';
        break;
      case 'cashier':
        email = 'cashier@school.edu';
        password = 'cashier123';
        break;
      case 'teacher':
        email = 'teacher@school.edu';
        password = 'teacher123';
        break;
      case 'librarian':
        email = 'librarian@school.edu';
        password = 'librarian123';
        break;
      default:
        email = 'admin@school.edu';
        password = 'admin123';
    }
    
    if (email && password) {
      const credentials: LoginFormData = { email, password };
      await login(credentials);
    }
  };
  
  return (
    <Card className="w-[400px] shadow-lg animate-fade-in border border-gray-100">
      <CardHeader className="space-y-2 text-center">
        <div className="flex justify-center mb-2">
          <div className="p-2 rounded-full bg-primary/10">
            {logo ? (
              <img src={logo} alt={systemName} className="h-6 w-6 object-contain" />
            ) : (
              <BookOpen className="h-6 w-6 text-primary" />
            )}
          </div>
        </div>
        <CardTitle className="text-2xl">Sign in to {systemName}</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@school.edu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-8 w-8"
                        onClick={toggleShowPassword}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">
                          {showPassword ? 'Hide password' : 'Show password'}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-muted-foreground">
          Demo accounts for testing:
        </div>
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button variant="outline" size="sm" onClick={() => handleDemoLogin('admin')}>
            Admin Demo
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDemoLogin('registrar')}>
            Registrar Demo
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDemoLogin('cashier')}>
            Cashier Demo
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDemoLogin('teacher')}>
            Teacher Demo
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDemoLogin('librarian')}>
            Librarian Demo
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
