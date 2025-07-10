import React from 'react';
import { cn, getStatusColor } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'status' | 'outline';
  status?: string;
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', status, children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
    
    let variantClasses = 'bg-gray-100 text-gray-800';
    
    if (variant === 'status' && status) {
      variantClasses = getStatusColor(status);
    } else if (variant === 'outline') {
      variantClasses = 'border border-gray-300 text-gray-700 bg-transparent';
    }

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
