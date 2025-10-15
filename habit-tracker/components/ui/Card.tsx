import { HTMLAttributes, forwardRef } from 'react';
import { BaseComponentProps } from '@/lib/types';

interface CardProps extends BaseComponentProps, HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className = '', 
    variant = 'default', 
    padding = 'md',
    hover = false,
    children,
    ...props 
  }, ref) => {
    const baseClasses = 'rounded-lg';
    
    const variants = {
      default: 'bg-card text-card-foreground shadow-sm border border-border',
      outline: 'border-2 border-border bg-background',
      elevated: 'bg-card text-card-foreground shadow-md border border-border'
    };

    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6'
    };

    const hoverClasses = hover ? 'transition-shadow hover:shadow-md' : '';

    const classes = [
      baseClasses,
      variants[variant],
      paddings[padding],
      hoverClasses,
      className
    ].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card sub-components
interface CardHeaderProps extends BaseComponentProps, HTMLAttributes<HTMLDivElement> {}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={`flex flex-col space-y-1.5 pb-3 ${className}`} 
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends BaseComponentProps, HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className = '', as: Comp = 'h3', children, ...props }, ref) => {
    return (
      <Comp 
        ref={ref} 
        className={`text-lg font-semibold leading-none tracking-tight ${className}`} 
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

CardTitle.displayName = 'CardTitle';

interface CardDescriptionProps extends BaseComponentProps, HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <p 
        ref={ref} 
        className={`text-sm text-muted-foreground ${className}`} 
        {...props}
      >
        {children}
      </p>
    );
  }
);

CardDescription.displayName = 'CardDescription';

interface CardContentProps extends BaseComponentProps, HTMLAttributes<HTMLDivElement> {}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`${className}`} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

interface CardFooterProps extends BaseComponentProps, HTMLAttributes<HTMLDivElement> {}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={`flex items-center pt-3 ${className}`} 
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export default Card;