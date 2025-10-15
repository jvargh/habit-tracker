# Data Model: Habit Tracker App

**Date**: 2025-01-14 | **Feature**: habit-tracker-app | **Research**: [research.md](./research.md)

## Core Entities

### Habit Entity

```typescript
interface Habit {
  id: string;                    // UUID v4 for unique identification
  name: string;                  // Display name (e.g., "Drink 8 glasses of water")
  description?: string;          // Optional detailed description
  category: HabitCategory;       // Grouping category for organization
  color: string;                 // Hex color for UI theming (#hexcode)
  targetFrequency: Frequency;    // How often habit should be completed
  createdAt: Date;               // When habit was created
  isActive: boolean;             // Whether habit is currently tracked
  order: number;                 // Display order in lists
}

enum HabitCategory {
  HEALTH = 'health',
  FITNESS = 'fitness', 
  PRODUCTIVITY = 'productivity',
  PERSONAL = 'personal',
  LEARNING = 'learning',
  SOCIAL = 'social',
  CUSTOM = 'custom'
}

interface Frequency {
  type: 'daily' | 'weekly' | 'custom';
  daysPerWeek?: number;          // For weekly: how many days
  customSchedule?: number[];     // For custom: day indices (0=Sunday)
}
```

### Completion Entity

```typescript
interface Completion {
  id: string;                    // UUID v4 for unique identification
  habitId: string;               // Reference to parent Habit
  completedAt: Date;             // When the habit was marked complete
  notes?: string;                // Optional user notes for this completion
  value?: number;                // Optional quantifiable value (e.g., minutes exercised)
}
```

### Settings Entity

```typescript
interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  weekStartsOn: number;          // 0 = Sunday, 1 = Monday
  notifications: {
    enabled: boolean;
    dailyReminder: string;       // Time in HH:MM format
    weeklyReview: boolean;
  };
  display: {
    showStreaks: boolean;
    showPercentages: boolean;
    defaultView: 'list' | 'grid' | 'calendar';
  };
  data: {
    autoBackup: boolean;
    retentionDays: number;       // How long to keep completion history
  };
}
```

## Storage Schema

### Version 1 Schema

```typescript
interface StorageSchemaV1 {
  version: 1;
  lastUpdated: Date;
  habits: Habit[];
  completions: Completion[];
  settings: UserSettings;
}
```

### Storage Operations

```typescript
interface StorageService {
  // Core CRUD operations
  saveHabit(habit: Habit): Promise<void>;
  getHabit(id: string): Promise<Habit | null>;
  getAllHabits(): Promise<Habit[]>;
  updateHabit(id: string, updates: Partial<Habit>): Promise<void>;
  deleteHabit(id: string): Promise<void>;

  // Completion operations  
  recordCompletion(completion: Completion): Promise<void>;
  getCompletions(habitId: string, dateRange?: DateRange): Promise<Completion[]>;
  deleteCompletion(id: string): Promise<void>;

  // Bulk operations
  exportData(): Promise<string>;           // JSON export
  importData(jsonData: string): Promise<void>;
  clearAllData(): Promise<void>;

  // Settings
  updateSettings(settings: Partial<UserSettings>): Promise<void>;
  getSettings(): Promise<UserSettings>;
}
```

## Data Relationships

### Entity Relationships

```
Habit (1) ──────────── (N) Completion
  │
  └── Referenced by completion.habitId
  
UserSettings (1) ────── Global configuration
```

### Data Integrity Rules

1. **Referential Integrity**: All completions must reference valid habit IDs
2. **Temporal Integrity**: Completion dates cannot be in the future  
3. **Uniqueness**: One completion per habit per day (prevent duplicates)
4. **Validation**: Habit names must be non-empty, colors must be valid hex codes

## Query Patterns

### Common Data Access Patterns

```typescript
// Get today's habits with completion status
interface TodayHabitView {
  habit: Habit;
  isCompletedToday: boolean;
  lastCompleted?: Date;
  currentStreak: number;
}

// Get habit statistics for a date range
interface HabitStatistics {
  habitId: string;
  habitName: string;
  totalCompletions: number;
  completionRate: number;        // Percentage (0-100)
  longestStreak: number;
  currentStreak: number;
  averageGap: number;            // Days between completions
}

// Weekly progress summary
interface WeeklyProgress {
  weekStart: Date;
  habits: Array<{
    habitId: string;
    habitName: string;
    targetDays: number;
    completedDays: number;
    completionDates: Date[];
  }>;
}
```

### Performance Optimization

```typescript
// Indexed queries for fast lookups
class OptimizedQueries {
  // Build indices for common queries
  private habitsByCategory = new Map<HabitCategory, Habit[]>();
  private completionsByHabit = new Map<string, Completion[]>();
  private completionsByDate = new Map<string, Completion[]>();

  // Fast lookups
  getActiveHabits(): Habit[] {
    return this.habits.filter(h => h.isActive);
  }

  getTodayCompletions(): Completion[] {
    const today = new Date().toDateString();
    return this.completionsByDate.get(today) || [];
  }

  calculateStreak(habitId: string): number {
    const completions = this.completionsByHabit.get(habitId) || [];
    // Streak calculation logic
    return 0; // Implementation details
  }
}
```

## Migration Strategy

### Schema Evolution

```typescript
interface MigrationService {
  migrateToV2(dataV1: StorageSchemaV1): StorageSchemaV2;
  migrateToV3(dataV2: StorageSchemaV2): StorageSchemaV3;
  
  getCurrentVersion(): number;
  migrate(data: any): StorageSchema;
}

// Example migration: V1 to V2 (adding habit categories)
function migrateV1toV2(dataV1: StorageSchemaV1): StorageSchemaV2 {
  return {
    ...dataV1,
    version: 2,
    habits: dataV1.habits.map(habit => ({
      ...habit,
      category: HabitCategory.PERSONAL, // Default category for existing habits
      targetFrequency: { type: 'daily' } // Default frequency
    }))
  };
}
```

## Data Validation

### Input Validation Rules

```typescript
const ValidationRules = {
  habit: {
    name: {
      required: true,
      minLength: 1,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9\s\-_.,!?]+$/ // Alphanumeric + basic punctuation
    },
    description: {
      maxLength: 500
    },
    color: {
      pattern: /^#[0-9A-Fa-f]{6}$/ // Valid hex color
    }
  },
  completion: {
    completedAt: {
      required: true,
      maxDate: new Date(), // Cannot be in future
      minDate: new Date('2020-01-01') // Reasonable minimum date
    },
    notes: {
      maxLength: 200
    },
    value: {
      min: 0,
      max: 9999 // Reasonable upper bound
    }
  }
};

function validateHabit(habit: Partial<Habit>): ValidationResult {
  const errors: string[] = [];
  
  if (!habit.name || habit.name.trim().length === 0) {
    errors.push('Habit name is required');
  }
  
  if (habit.color && !ValidationRules.habit.color.pattern.test(habit.color)) {
    errors.push('Invalid color format - use hex colors like #ff0000');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
```

## Data Export/Import Format

### JSON Export Schema

```typescript
interface ExportFormat {
  exportedAt: Date;
  version: number;
  appVersion: string;
  data: {
    habits: Habit[];
    completions: Completion[];  
    settings: UserSettings;
  };
  metadata: {
    totalHabits: number;
    totalCompletions: number;
    dateRange: {
      earliest: Date;
      latest: Date;
    };
  };
}
```

This data model provides the foundation for all habit tracking functionality while maintaining data integrity and performance for the expected usage patterns.