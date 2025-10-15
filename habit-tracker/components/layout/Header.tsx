'use client';

import { BaseComponentProps } from '@/lib/types';
import Button from '@/components/ui/Button';

interface HeaderProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export default function Header({
  className = '',
  title = 'Habit Tracker',
  subtitle,
  showBackButton = false,
  onBack,
  actions,
  children
}: HeaderProps) {
  return (
    <header className={`bg-background border-b border-border ${className}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Back button and titles */}
          <div className="flex items-center space-x-4">
            {showBackButton && onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-2"
                aria-label="Go back"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Button>
            )}
            
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-2">
            {actions}
            {children}
          </div>
        </div>
      </div>
    </header>
  );
}