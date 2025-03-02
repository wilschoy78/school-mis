
import React from 'react';
import { cn } from '@/lib/utils';
import { DashboardCard } from './DashboardCard';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconClassName?: string;
  className?: string;
  isGlass?: boolean;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  iconClassName,
  className,
  isGlass = false,
  onClick,
}) => {
  return (
    <DashboardCard 
      className={cn(
        "h-full transition-transform hover:translate-y-[-3px]",
        onClick && "cursor-pointer",
        className
      )}
      isGlass={isGlass}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
            {trend && (
              <span className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-green-500" : "text-red-500"
              )}>
                {trend.isPositive ? "+" : "-"}{trend.value}%
              </span>
            )}
          </div>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        <div className={cn(
          "p-2 rounded-md",
          iconClassName
        )}>
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    </DashboardCard>
  );
};
