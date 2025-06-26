import React from 'react';
import { cn, getStatusColor } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'status';
  status?: string;
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', status, children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
    
    const variantClasses = variant === 'status' && status 
      ? getStatusColor(status)
      : 'bg-gray-100 text-gray-800';

    return (
      <span
        ref={ref}
        className={cn(baseClasses, variantClasses, className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
