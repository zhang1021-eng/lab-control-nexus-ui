
import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  description?: string;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}

const DashboardCard = ({ 
  title, 
  description, 
  className, 
  contentClassName,
  children 
}: DashboardCardProps) => {
  return (
    <Card className={cn("shadow-md h-full", className)}>
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className={cn("p-4 pt-0", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
