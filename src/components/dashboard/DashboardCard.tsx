
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  isGlass?: boolean;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  className,
  title,
  description,
  children,
  footer,
  isGlass = false,
}) => {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 border",
      isGlass && "glassmorphism",
      className
    )}>
      {(title || description) && (
        <CardHeader className="p-5">
          {title && <CardTitle className="text-xl">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={cn("p-5 pt-0", !title && !description && "pt-5")}>
        {children}
      </CardContent>
      {footer && <CardFooter className="p-5 pt-0">{footer}</CardFooter>}
    </Card>
  );
};
