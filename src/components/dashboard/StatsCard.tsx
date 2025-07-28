import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'primary';
}

export const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  variant = 'default' 
}: StatsCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-status-active/20 bg-gradient-to-br from-status-active/5 to-status-active/10';
      case 'warning':
        return 'border-status-paused/20 bg-gradient-to-br from-status-paused/5 to-status-paused/10';
      case 'primary':
        return 'border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10';
      default:
        return 'border-border';
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case 'success':
        return 'text-status-active bg-status-active/10';
      case 'warning':
        return 'text-status-paused bg-status-paused/10';
      case 'primary':
        return 'text-primary bg-primary/10';
      default:
        return 'text-muted-foreground bg-muted/50';
    }
  };

  return (
    <Card className={`${getVariantStyles()} shadow-card transition-all duration-200 hover:shadow-elevated`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${getIconStyles()}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <span className={`text-xs font-medium ${
              trend.isPositive ? 'text-status-active' : 'text-destructive'
            }`}>
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              desde o último mês
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};