'use client';

import { useState, ReactNode } from 'react';
import { BaseComponentProps } from '@/lib/types';
import Header from './Header';
import Navigation from './Navigation';

interface LayoutProps extends BaseComponentProps {
  headerTitle?: string;
  headerSubtitle?: string;
  showNavigation?: boolean;
  showHeader?: boolean;
  headerActions?: ReactNode;
  navigationItems?: Array<{
    href: string;
    label: string;
    icon: ReactNode;
    badge?: string | number;
  }>;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: (collapsed: boolean) => void;
}

const defaultNavigationItems = [
  {
    href: '/',
    label: 'Dashboard',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
      </svg>
    )
  },
  {
    href: '/habits',
    label: 'Habits',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    )
  },
  {
    href: '/progress',
    label: 'Progress',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    href: '/achievements',
    label: 'Achievements',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    )
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
];

export default function Layout({
  className = '',
  headerTitle,
  headerSubtitle,
  showNavigation = true,
  showHeader = true,
  headerActions,
  navigationItems = defaultNavigationItems,
  sidebarCollapsed: controlledCollapsed,
  onSidebarToggle,
  children
}: LayoutProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  
  // Use controlled or internal state
  const sidebarCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  
  const handleSidebarToggle = () => {
    if (onSidebarToggle) {
      onSidebarToggle(!sidebarCollapsed);
    } else {
      setInternalCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* Navigation Sidebar */}
      {showNavigation && (
        <Navigation
          items={navigationItems}
          collapsed={sidebarCollapsed}
          onToggle={handleSidebarToggle}
        />
      )}

      {/* Main Content Area */}
      <div
        className={`
          transition-all duration-300 ease-in-out
          ${showNavigation 
            ? `md:ml-${sidebarCollapsed ? '16' : '64'}` 
            : ''
          }
        `}
        style={{
          marginLeft: showNavigation 
            ? `${sidebarCollapsed ? '4rem' : '16rem'}` 
            : '0',
        }}
      >
        {/* Header */}
        {showHeader && (
          <Header
            title={headerTitle}
            subtitle={headerSubtitle}
            actions={headerActions}
          />
        )}

        {/* Page Content */}
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}