
import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  status: 'active' | 'inactive' | 'warning';
  label?: string;
  className?: string;
}

const StatusIndicator = ({ status, label, className }: StatusIndicatorProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("status-indicator", {
        'status-active': status === 'active',
        'status-inactive': status === 'inactive',
        'status-warning': status === 'warning',
      })}></span>
      {label && <span className="text-xs">{label}</span>}
    </div>
  );
};

export default StatusIndicator;
