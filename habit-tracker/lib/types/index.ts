// Core Habit Types
export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  targetValue: number;
  unit: string;
  color: HabitColor;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface HabitEntry {
  id: string;
  habitId: string;
  date: Date;
  value: number;
  completed: boolean;
  rating?: number; // 1-5 scale
  notes?: string;
  createdAt: Date;
}

// Enums and Union Types
export type HabitCategory = 
  | 'health'
  | 'fitness'
  | 'productivity'
  | 'learning'
  | 'social'
  | 'mindfulness'
  | 'creative'
  | 'other';

export type HabitFrequency = 
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'custom';

export type HabitColor = 
  | 'blue'
  | 'green'
  | 'purple'
  | 'orange'
  | 'red'
  | 'pink'
  | 'yellow'
  | 'teal';

// Progress and Analytics Types
export interface StreakInfo {
  current: number;
  longest: number;
  lastCompletedDate?: Date;
}

export interface HabitStats {
  totalEntries: number;
  completedEntries: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  averageRating?: number;
  lastSevenDays: number;
  thisWeek: number;
  thisMonth: number;
  totalValue: number;
}

export interface DailyProgress {
  date: Date;
  totalHabits: number;
  completedHabits: number;
  completionRate: number;
  entries: HabitEntry[];
}

export interface WeeklyProgress {
  startDate: Date;
  endDate: Date;
  days: DailyProgress[];
  weeklyStats: {
    averageCompletionRate: number;
    totalEntries: number;
    mostActiveDay: Date;
    improvementTrend: 'up' | 'down' | 'stable';
  };
}

// Chart and Visualization Types
export interface ChartDataPoint {
  date: string;
  value: number;
  completed?: boolean;
  rating?: number;
  label?: string;
}

export interface HabitChartData {
  habitId: string;
  habitName: string;
  data: ChartDataPoint[];
  chartType: 'line' | 'bar' | 'area';
  color: string;
}

export interface DashboardData {
  overview: {
    totalHabits: number;
    activeHabits: number;
    todayCompletion: number;
    currentStreaks: number;
  };
  recentEntries: HabitEntry[];
  topHabits: Array<Habit & { stats: HabitStats }>;
  weeklyTrend: WeeklyProgress;
  achievements: Achievement[];
}

// Achievement System Types
export interface Achievement {
  id: string;
  type: AchievementType;
  title: string;
  description: string;
  icon: string;
  condition: AchievementCondition;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export type AchievementType = 
  | 'streak'
  | 'consistency'
  | 'milestone'
  | 'variety'
  | 'improvement';

export interface AchievementCondition {
  type: 'streak' | 'total_entries' | 'consecutive_days' | 'habit_count' | 'rating_average';
  threshold: number;
  habitId?: string;
  category?: HabitCategory;
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'all_time';
}

// UI and Component Types
export interface FilterOptions {
  categories: HabitCategory[];
  dateRange: DateRange;
  completionStatus: 'all' | 'completed' | 'incomplete';
  sortBy: 'name' | 'created' | 'completion_rate' | 'streak';
  sortOrder: 'asc' | 'desc';
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface ViewSettings {
  chartType: 'line' | 'bar' | 'area';
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  showRatings: boolean;
  showTargets: boolean;
  groupBy: 'day' | 'week' | 'month';
}

// Form and Input Types
export interface HabitFormData {
  name: string;
  description: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  targetValue: number;
  unit: string;
  color: HabitColor;
  icon?: string;
}

export interface EntryFormData {
  value: number;
  rating?: number;
  notes?: string;
  date?: Date;
}

// Storage and Export Types
export interface StorageData {
  habits: Habit[];
  entries: HabitEntry[];
  achievements: Achievement[];
  settings: UserSettings;
  lastBackup: Date;
  version: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  dailyReminder: boolean;
  reminderTime: string;
  weekStartsOn: 'sunday' | 'monday';
  defaultView: 'dashboard' | 'habits' | 'progress';
  chartPreferences: ViewSettings;
}

export interface ExportData {
  format: 'json' | 'csv';
  dateRange: DateRange;
  includeSettings: boolean;
  includeAchievements: boolean;
  filename?: string;
}

// API and Error Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface AppError {
  type: 'validation' | 'storage' | 'network' | 'unknown';
  message: string;
  details?: any;
  timestamp: Date;
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface HabitCardProps extends BaseComponentProps {
  habit: Habit;
  stats: HabitStats;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onComplete: (habitId: string, value: number) => void;
  showDetails?: boolean;
  isCompletedToday?: boolean;
}

export interface HabitListProps extends BaseComponentProps {
  habits: Habit[];
  habitsStats?: { [key: string]: HabitStats };
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
  onCompleteHabit: (habitId: string, value: number) => void;
  onAddHabit?: () => void;
  showInactive?: boolean;
  filterByCategory?: HabitCategory;
  filterByCompletion?: 'complete' | 'incomplete';
  sortBy?: 'name' | 'completion_rate' | 'streak' | 'created';
  sortOrder?: 'asc' | 'desc';
  layout?: 'grid' | 'list';
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  showCount?: boolean;
  searchText?: string;
  compact?: boolean;
}

export interface ChartProps extends BaseComponentProps {
  data: ChartDataPoint[];
  type: 'line' | 'bar' | 'area';
  color: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
}