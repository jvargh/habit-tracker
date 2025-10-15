# Component Contracts

**Date**: 2025-01-14 | **Feature**: habit-tracker-app | **Data Model**: [../data-model.md](../data-model.md)

## Core Component Interfaces

### Habit Components

#### HabitCard Component

```typescript
interface HabitCardProps {
  habit: Habit;
  isCompletedToday: boolean;
  currentStreak: number;
  onToggleComplete: (habitId: string) => Promise<void>;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  className?: string;
}

interface HabitCardState {
  isLoading: boolean;
  showMenu: boolean;
}
```

**Contract Requirements**:
- Must display habit name, category, and current streak
- Must show completion status for today with visual indicator
- Must handle completion toggle with loading state
- Must provide edit/delete actions in dropdown menu
- Must be keyboard accessible (Enter to toggle, Space for menu)

#### HabitForm Component

```typescript
interface HabitFormProps {
  habit?: Habit;              // Undefined for create, populated for edit
  onSave: (habit: Omit<Habit, 'id' | 'createdAt'>) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
}

interface HabitFormData {
  name: string;
  description: string;
  category: HabitCategory;
  color: string;
  targetFrequency: Frequency;
}

interface HabitFormValidation {
  name: string[];             // Array of validation errors
  color: string[];
  general: string[];
}
```

**Contract Requirements**:
- Must validate all inputs according to data model rules
- Must handle both create and edit modes
- Must show validation errors inline
- Must prevent submission with invalid data
- Must reset form state when closed

#### HabitList Component

```typescript
interface HabitListProps {
  habits: Habit[];
  completions: Completion[];
  onToggleComplete: (habitId: string) => Promise<void>;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
  filter: HabitFilter;
  sortBy: HabitSortBy;
}

interface HabitFilter {
  category?: HabitCategory;
  isActive?: boolean;
  searchTerm?: string;
}

enum HabitSortBy {
  NAME = 'name',
  CATEGORY = 'category', 
  STREAK = 'streak',
  CREATED = 'created',
  CUSTOM = 'custom'
}
```

**Contract Requirements**:
- Must render habits using HabitCard components
- Must apply filtering and sorting efficiently
- Must handle empty states with helpful messaging
- Must support drag-and-drop reordering (future enhancement)

### Chart Components

#### ProgressChart Component

```typescript
interface ProgressChartProps {
  habitId: string;
  completions: Completion[];
  dateRange: DateRange;
  chartType: 'bar' | 'line' | 'area';
  height?: number;
  className?: string;
}

interface ChartDataPoint {
  date: string;              // YYYY-MM-DD format
  completed: number;         // 1 if completed, 0 if not
  streak: number;            // Current streak at that date
}
```

**Contract Requirements**:
- Must transform completion data into chart-ready format
- Must handle different chart types with consistent interface
- Must be responsive and accessible
- Must show loading state while data loads
- Must handle empty data gracefully

#### WeeklyChart Component

```typescript
interface WeeklyChartProps {
  habits: Habit[];
  completions: Completion[];
  weekStart: Date;
  onWeekChange: (weekStart: Date) => void;
}

interface WeeklyData {
  habit: Habit;
  days: Array<{
    date: Date;
    completed: boolean;
  }>;
  completionRate: number;
}
```

**Contract Requirements**:
- Must display 7-day grid for all active habits
- Must navigate between weeks
- Must show completion rates per habit
- Must handle different week start days (Monday vs Sunday)

### UI Components

#### Button Component

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}
```

**Contract Requirements**:
- Must show loading spinner when loading=true
- Must be keyboard accessible
- Must have consistent focus styles
- Must handle disabled state appropriately

#### Modal Component

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  className?: string;
}
```

**Contract Requirements**:
- Must trap focus within modal when open
- Must restore focus to trigger element on close
- Must close on Escape key press
- Must prevent body scroll when open
- Must provide ARIA labeling for accessibility

## Service Interfaces

### Storage Service Contract

```typescript
interface IHabitStorageService {
  // Habit operations
  createHabit(data: CreateHabitData): Promise<Habit>;
  getHabit(id: string): Promise<Habit | null>;
  getAllHabits(): Promise<Habit[]>;
  updateHabit(id: string, updates: Partial<Habit>): Promise<Habit>;
  deleteHabit(id: string): Promise<void>;

  // Completion operations
  recordCompletion(habitId: string, date?: Date, notes?: string): Promise<Completion>;
  removeCompletion(habitId: string, date: Date): Promise<void>;
  getCompletions(habitId: string, dateRange?: DateRange): Promise<Completion[]>;
  getAllCompletions(): Promise<Completion[]>;

  // Analytics queries
  getHabitStats(habitId: string, dateRange: DateRange): Promise<HabitStatistics>;
  getTodayProgress(): Promise<TodayHabitView[]>;
  getWeeklyProgress(weekStart: Date): Promise<WeeklyProgress>;

  // Data management
  exportData(): Promise<string>;
  importData(jsonData: string): Promise<void>;
  clearAllData(): Promise<void>;

  // Settings
  getSettings(): Promise<UserSettings>;
  updateSettings(updates: Partial<UserSettings>): Promise<UserSettings>;
}
```

### Analytics Service Contract

```typescript
interface IAnalyticsService {
  calculateStreak(completions: Completion[]): StreakInfo;
  calculateCompletionRate(completions: Completion[], totalDays: number): number;
  findLongestStreak(completions: Completion[]): StreakInfo;
  getCompletionTrend(completions: Completion[], days: number): TrendDirection;
  generateInsights(habitStats: HabitStatistics[]): Insight[];
}

interface StreakInfo {
  current: number;
  longest: number;
  startDate?: Date;
  endDate?: Date;
}

interface Insight {
  type: 'streak' | 'completion_rate' | 'consistency' | 'improvement';
  message: string;
  severity: 'info' | 'warning' | 'success';
  habitId?: string;
}
```

## API Response Formats

### Success Response Pattern

```typescript
interface ApiResponse<T> {
  success: true;
  data: T;
  timestamp: Date;
}

interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: Date;
}

type ApiResult<T> = ApiResponse<T> | ApiError;
```

### Error Handling Contract

```typescript
enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE_ERROR = 'DUPLICATE_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR'
}

interface ErrorHandler {
  handleError(error: Error, context?: string): void;
  showUserMessage(message: string, type: 'error' | 'warning' | 'info'): void;
  logError(error: Error, metadata?: Record<string, any>): void;
}
```

## Testing Contracts

### Component Test Requirements

```typescript
interface ComponentTestSuite<T> {
  // Rendering tests
  'renders without crashing'(): void;
  'renders with required props'(): void;
  'handles missing optional props'(): void;

  // Interaction tests  
  'handles user interactions correctly'(): void;
  'calls callbacks with expected parameters'(): void;
  'updates state appropriately'(): void;

  // Accessibility tests
  'meets accessibility standards'(): void;
  'supports keyboard navigation'(): void;
  'provides proper ARIA labels'(): void;

  // Edge cases
  'handles loading states'(): void;
  'handles error states'(): void;
  'handles empty data'(): void;
}
```

### Integration Test Scenarios

```typescript
interface IntegrationTestScenarios {
  'User creates a new habit'(): void;
  'User marks habit as complete'(): void;
  'User views habit statistics'(): void;
  'User edits existing habit'(): void;
  'User deletes habit with confirmations'(): void;
  'Data persists across browser sessions'(): void;
  'App works offline'(): void;
  'Export/import functionality works'(): void;
}
```

## Performance Requirements

### Component Performance Contracts

```typescript
interface PerformanceRequirements {
  HabitList: {
    maxRenderTime: '< 100ms for 50 habits';
    scrollPerformance: '60fps smooth scrolling';
    memoryUsage: '< 10MB for full habit list';
  };
  
  Charts: {
    loadTime: '< 500ms for 1 year of data';
    interactionResponse: '< 16ms for hover/tooltip';
    dataProcessing: '< 200ms for statistics calculation';
  };

  Storage: {
    saveOperation: '< 50ms for habit CRUD';
    loadOperation: '< 100ms for initial app load';
    exportOperation: '< 1s for 1 year of data';
  };
}
```

These contracts define the expected behavior and interfaces for all major components and services in the habit tracker application.