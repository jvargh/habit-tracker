# Quickstart Guide: Habit Tracker Development

**Date**: 2025-01-14 | **Feature**: habit-tracker-app | **Contracts**: [contracts/components.md](contracts/components.md)

## Prerequisites

### System Requirements

- **Node.js**: 18.0+ (LTS recommended)
- **Package Manager**: npm, yarn, or pnpm
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Editor**: VS Code with TypeScript support (recommended)

### Required VS Code Extensions

```bash
# Install recommended extensions
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension ms-playwright.playwright
```

## Project Setup

### 1. Initialize Next.js Project

```bash
# Create new Next.js project with TypeScript
npx create-next-app@latest habit-tracker --typescript --tailwind --app --src-dir=false --import-alias="@/*"

cd habit-tracker

# Install additional dependencies
npm install recharts @types/uuid uuid date-fns
npm install -D @testing-library/react @testing-library/jest-dom jest-environment-jsdom jest @playwright/test
```

### 2. Configure Next.js for Static Export

Create/update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  eslint: {
    dirs: ['app', 'components', 'lib']
  }
}

module.exports = nextConfig
```

### 3. Setup Project Structure

```bash
# Create the directory structure
mkdir -p components/{habits,charts,ui,layout}
mkdir -p lib/{storage,utils,types}
mkdir -p tests/{components,integration,e2e,fixtures}
mkdir -p public/icons

# Create essential files
touch app/globals.css
touch lib/types/index.ts
touch components/ui/Button.tsx
touch components/habits/HabitCard.tsx
```

### 4. Configure Testing Environment

Create `jest.config.js`:

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/tests/e2e/'],
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

Create `jest.setup.js`:

```javascript
import '@testing-library/jest-dom'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock ResizeObserver (for Recharts)
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))
```

### 5. Configure Playwright for E2E Tests

```bash
# Initialize Playwright
npx playwright install

# Create playwright config
```

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## Development Workflow

### 1. Core Type Definitions

Create `lib/types/index.ts`:

```typescript
export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  color: string;
  targetFrequency: Frequency;
  createdAt: Date;
  isActive: boolean;
  order: number;
}

export enum HabitCategory {
  HEALTH = 'health',
  FITNESS = 'fitness',
  PRODUCTIVITY = 'productivity',
  PERSONAL = 'personal',
  LEARNING = 'learning',
  SOCIAL = 'social',
  CUSTOM = 'custom'
}

export interface Completion {
  id: string;
  habitId: string;
  completedAt: Date;
  notes?: string;
  value?: number;
}

export interface Frequency {
  type: 'daily' | 'weekly' | 'custom';
  daysPerWeek?: number;
  customSchedule?: number[];
}
```

### 2. Storage Service Implementation

Create `lib/storage/localStorage.ts`:

```typescript
import { Habit, Completion, UserSettings } from '@/lib/types'

interface StorageSchema {
  version: number;
  lastUpdated: Date;
  habits: Habit[];
  completions: Completion[];
  settings: UserSettings;
}

export class HabitStorageService {
  private readonly STORAGE_KEY = 'habit-tracker-data'
  private readonly CURRENT_VERSION = 1

  async createHabit(habitData: Omit<Habit, 'id' | 'createdAt'>): Promise<Habit> {
    const habit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    
    const data = this.loadData()
    data.habits.push(habit)
    this.saveData(data)
    
    return habit
  }

  async getAllHabits(): Promise<Habit[]> {
    return this.loadData().habits
  }

  private loadData(): StorageSchema {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return this.getDefaultData()
      
      const data = JSON.parse(stored)
      return this.migrateData(data)
    } catch (error) {
      console.warn('Failed to load data from localStorage:', error)
      return this.getDefaultData()
    }
  }

  private saveData(data: StorageSchema): void {
    try {
      data.lastUpdated = new Date()
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save data to localStorage:', error)
      throw new Error('Storage operation failed')
    }
  }

  private getDefaultData(): StorageSchema {
    return {
      version: this.CURRENT_VERSION,
      lastUpdated: new Date(),
      habits: [],
      completions: [],
      settings: {
        theme: 'system',
        weekStartsOn: 0,
        notifications: {
          enabled: false,
          dailyReminder: '09:00',
          weeklyReview: true,
        },
        display: {
          showStreaks: true,
          showPercentages: true,
          defaultView: 'list',
        },
        data: {
          autoBackup: false,
          retentionDays: 365,
        },
      },
    }
  }

  private migrateData(data: any): StorageSchema {
    // Handle data migration between versions
    if (data.version !== this.CURRENT_VERSION) {
      // Migration logic here
      data.version = this.CURRENT_VERSION
    }
    return data
  }
}
```

### 3. Basic UI Components

Create `components/ui/Button.tsx`:

```typescript
import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus-visible:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus-visible:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500',
    ghost: 'hover:bg-gray-100 text-gray-700 focus-visible:ring-gray-500',
  }
  
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  }

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  )
}
```

### 4. Habit Components

Create `components/habits/HabitCard.tsx`:

```typescript
'use client'

import React, { useState } from 'react'
import { Habit } from '@/lib/types'
import { Button } from '@/components/ui/Button'

interface HabitCardProps {
  habit: Habit
  isCompletedToday: boolean
  currentStreak: number
  onToggleComplete: (habitId: string) => Promise<void>
  onEdit: (habit: Habit) => void
  onDelete: (habitId: string) => void
  className?: string
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  isCompletedToday,
  currentStreak,
  onToggleComplete,
  onEdit,
  onDelete,
  className,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleComplete = async () => {
    setIsLoading(true)
    try {
      await onToggleComplete(habit.id)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`p-4 border rounded-lg ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{habit.name}</h3>
          {habit.description && (
            <p className="text-sm text-gray-600 mt-1">{habit.description}</p>
          )}
          <div className="flex items-center mt-2 space-x-3">
            <span className="text-xs text-gray-500 capitalize">{habit.category}</span>
            {currentStreak > 0 && (
              <span className="text-xs text-orange-600">
                🔥 {currentStreak} day streak
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={isCompletedToday ? 'primary' : 'secondary'}
            size="sm"
            loading={isLoading}
            onClick={handleToggleComplete}
          >
            {isCompletedToday ? '✓ Done' : 'Mark Done'}
          </Button>
          
          <div className="relative">
            {/* Add dropdown menu for edit/delete */}
            <button className="p-1 text-gray-400 hover:text-gray-600">
              •••
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

## Package Scripts

Update `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "export": "next build",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

## Development Commands

### Daily Development Workflow

```bash
# Start development server
npm run dev

# Run tests in watch mode (separate terminal)
npm run test:watch

# Type checking (separate terminal)
npm run type-check --watch

# Format code before committing
npm run format

# Run all tests before push
npm test && npm run test:e2e && npm run type-check
```

### Production Build

```bash
# Build and export static site
npm run export

# Verify build output
cd out && python -m http.server 3000

# Test production build
npm run test:e2e -- --config playwright.config.prod.ts
```

## Common Development Tasks

### Adding a New Habit Category

1. Update `HabitCategory` enum in `lib/types/index.ts`
2. Update category validation in form components
3. Add category icon/color in UI components
4. Update tests for new category

### Adding Chart Type

1. Create new chart component in `components/charts/`
2. Add props interface following chart contract
3. Implement with Recharts components
4. Add unit tests for data transformation
5. Add integration test for rendering

### Modifying Data Schema

1. Update types in `lib/types/index.ts`
2. Increment version in storage service
3. Add migration logic in `migrateData` method
4. Update validation rules
5. Add tests for migration

## Troubleshooting

### Common Issues

**localStorage not available in tests**:
- Check `jest.setup.js` has localStorage mock
- Use `@testing-library/jest-dom` for DOM assertions

**Recharts not rendering in tests**:
- Mock ResizeObserver in `jest.setup.js`
- Use `@testing-library/react` for component testing

**Static export fails**:
- Check all pages use client-side rendering only
- Ensure no server-side only APIs are used
- Verify `next.config.js` export settings

**TypeScript errors**:
- Run `npm run type-check` for full error list
- Check import paths use `@/` alias correctly
- Ensure all props interfaces are exported

This quickstart guide provides everything needed to begin developing the habit tracker application following the established architecture and contracts.