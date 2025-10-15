import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth,
  isToday,
  isSameDay,
  differenceInDays,
  addDays,
  subDays,
  parseISO,
  isValid
} from 'date-fns';
import { 
  Habit, 
  HabitEntry, 
  HabitStats, 
  StreakInfo, 
  DailyProgress,
  WeeklyProgress,
  HabitCategory,
  HabitColor 
} from '@/lib/types';

/**
 * Date utility functions
 */
export const dateUtils = {
  /**
   * Format date for display
   */
  formatDate(date: Date, formatStr: string = 'yyyy-MM-dd'): string {
    try {
      return format(date, formatStr);
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  },

  /**
   * Format date for display in UI
   */
  formatDisplayDate(date: Date): string {
    if (isToday(date)) {
      return 'Today';
    }
    return format(date, 'MMM d');
  },

  /**
   * Get start and end of current week
   */
  getCurrentWeek(weekStartsOn: 'sunday' | 'monday' = 'monday'): { start: Date; end: Date } {
    const options = { weekStartsOn: weekStartsOn === 'monday' ? 1 : 0 } as const;
    const now = new Date();
    return {
      start: startOfWeek(now, options),
      end: endOfWeek(now, options)
    };
  },

  /**
   * Get start and end of current month
   */
  getCurrentMonth(): { start: Date; end: Date } {
    const now = new Date();
    return {
      start: startOfMonth(now),
      end: endOfMonth(now)
    };
  },

  /**
   * Generate date range array
   */
  getDateRange(start: Date, end: Date): Date[] {
    const dates: Date[] = [];
    let current = new Date(start);
    
    while (current <= end) {
      dates.push(new Date(current));
      current = addDays(current, 1);
    }
    
    return dates;
  },

  /**
   * Get days ago from today
   */
  getDaysAgo(days: number): Date {
    return subDays(new Date(), days);
  },

  /**
   * Check if date is in range
   */
  isInRange(date: Date, start: Date, end: Date): boolean {
    return date >= start && date <= end;
  },

  /**
   * Parse date string safely
   */
  parseDate(dateStr: string): Date | null {
    try {
      const parsed = parseISO(dateStr);
      return isValid(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }
};

/**
 * Habit calculation utilities
 */
export const habitUtils = {
  /**
   * Calculate habit statistics
   */
  calculateHabitStats(habit: Habit, entries: HabitEntry[]): HabitStats {
    const habitEntries = entries.filter(e => e.habitId === habit.id);
    const completedEntries = habitEntries.filter(e => e.completed);
    const totalEntries = habitEntries.length;
    const completionRate = totalEntries > 0 ? (completedEntries.length / totalEntries) * 100 : 0;

    // Calculate streaks
    const streakInfo = this.calculateStreak(habitEntries);
    
    // Calculate time-based stats
    const now = new Date();
    const lastSevenDays = this.getEntriesInRange(habitEntries, dateUtils.getDaysAgo(7), now);
    const currentWeek = dateUtils.getCurrentWeek();
    const thisWeek = this.getEntriesInRange(habitEntries, currentWeek.start, currentWeek.end);
    const currentMonth = dateUtils.getCurrentMonth();
    const thisMonth = this.getEntriesInRange(habitEntries, currentMonth.start, currentMonth.end);

    // Calculate averages
    const ratingsWithValues = habitEntries.filter(e => e.rating !== undefined);
    const averageRating = ratingsWithValues.length > 0 
      ? ratingsWithValues.reduce((sum, e) => sum + (e.rating || 0), 0) / ratingsWithValues.length
      : undefined;

    const totalValue = habitEntries.reduce((sum, e) => sum + e.value, 0);

    return {
      totalEntries,
      completedEntries: completedEntries.length,
      completionRate: Math.round(completionRate * 100) / 100,
      currentStreak: streakInfo.current,
      longestStreak: streakInfo.longest,
      averageRating,
      lastSevenDays: lastSevenDays.filter(e => e.completed).length,
      thisWeek: thisWeek.filter(e => e.completed).length,
      thisMonth: thisMonth.filter(e => e.completed).length,
      totalValue
    };
  },

  /**
   * Calculate streak information
   */
  calculateStreak(entries: HabitEntry[]): StreakInfo {
    if (entries.length === 0) {
      return { current: 0, longest: 0 };
    }

    // Sort entries by date (newest first)
    const sortedEntries = entries
      .filter(e => e.completed)
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    if (sortedEntries.length === 0) {
      return { current: 0, longest: 0 };
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;
    let lastDate = sortedEntries[0].date;

    // Calculate current streak (from today backwards)
    const today = new Date();
    if (isToday(lastDate) || isSameDay(lastDate, subDays(today, 1))) {
      currentStreak = 1;
      
      for (let i = 1; i < sortedEntries.length; i++) {
        const entry = sortedEntries[i];
        const expectedDate = subDays(lastDate, i);
        
        if (isSameDay(entry.date, expectedDate)) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    for (let i = 1; i < sortedEntries.length; i++) {
      const currentEntry = sortedEntries[i];
      const previousEntry = sortedEntries[i - 1];
      
      const daysDiff = differenceInDays(previousEntry.date, currentEntry.date);
      
      if (daysDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

    return {
      current: currentStreak,
      longest: longestStreak,
      lastCompletedDate: sortedEntries[0]?.date
    };
  },

  /**
   * Get entries within date range
   */
  getEntriesInRange(entries: HabitEntry[], start: Date, end: Date): HabitEntry[] {
    return entries.filter(e => dateUtils.isInRange(e.date, start, end));
  },

  /**
   * Check if habit is completed today
   */
  isCompletedToday(habit: Habit, entries: HabitEntry[]): boolean {
    const today = new Date();
    const todayEntries = entries.filter(e => 
      e.habitId === habit.id && 
      isToday(e.date) && 
      e.completed
    );
    return todayEntries.length > 0;
  },

  /**
   * Get today's entry for habit
   */
  getTodayEntry(habit: Habit, entries: HabitEntry[]): HabitEntry | null {
    const today = new Date();
    const todayEntry = entries.find(e => 
      e.habitId === habit.id && 
      isToday(e.date)
    );
    return todayEntry || null;
  },

  /**
   * Calculate daily progress
   */
  calculateDailyProgress(date: Date, habits: Habit[], entries: HabitEntry[]): DailyProgress {
    const dayEntries = entries.filter(e => isSameDay(e.date, date));
    const activeHabits = habits.filter(h => h.isActive);
    const completedHabits = dayEntries.filter(e => e.completed).length;
    
    return {
      date,
      totalHabits: activeHabits.length,
      completedHabits,
      completionRate: activeHabits.length > 0 ? (completedHabits / activeHabits.length) * 100 : 0,
      entries: dayEntries
    };
  },

  /**
   * Calculate weekly progress
   */
  calculateWeeklyProgress(
    startDate: Date, 
    endDate: Date, 
    habits: Habit[], 
    entries: HabitEntry[]
  ): WeeklyProgress {
    const dateRange = dateUtils.getDateRange(startDate, endDate);
    const days = dateRange.map(date => this.calculateDailyProgress(date, habits, entries));
    
    const totalCompletionRates = days.map(d => d.completionRate);
    const averageCompletionRate = totalCompletionRates.length > 0
      ? totalCompletionRates.reduce((sum, rate) => sum + rate, 0) / totalCompletionRates.length
      : 0;

    const totalEntries = days.reduce((sum, day) => sum + day.entries.length, 0);
    
    // Find most active day
    const mostActiveDay = days.reduce((max, day) => 
      day.completedHabits > max.completedHabits ? day : max
    , days[0] || { completedHabits: 0, date: startDate });

    // Calculate improvement trend (compare first half vs second half)
    const midPoint = Math.floor(days.length / 2);
    const firstHalf = days.slice(0, midPoint);
    const secondHalf = days.slice(midPoint);
    
    const firstHalfAvg = firstHalf.length > 0 
      ? firstHalf.reduce((sum, day) => sum + day.completionRate, 0) / firstHalf.length
      : 0;
    const secondHalfAvg = secondHalf.length > 0
      ? secondHalf.reduce((sum, day) => sum + day.completionRate, 0) / secondHalf.length
      : 0;

    let improvementTrend: 'up' | 'down' | 'stable' = 'stable';
    const difference = secondHalfAvg - firstHalfAvg;
    if (Math.abs(difference) > 5) { // 5% threshold
      improvementTrend = difference > 0 ? 'up' : 'down';
    }

    return {
      startDate,
      endDate,
      days,
      weeklyStats: {
        averageCompletionRate: Math.round(averageCompletionRate * 100) / 100,
        totalEntries,
        mostActiveDay: mostActiveDay.date,
        improvementTrend
      }
    };
  }
};

/**
 * Color and theming utilities
 */
export const colorUtils = {
  /**
   * Get color palette for habit colors
   */
  getColorPalette(): Record<HabitColor, { primary: string; light: string; dark: string }> {
    return {
      blue: { primary: '#3b82f6', light: '#dbeafe', dark: '#1e40af' },
      green: { primary: '#10b981', light: '#d1fae5', dark: '#047857' },
      purple: { primary: '#8b5cf6', light: '#ede9fe', dark: '#5b21b6' },
      orange: { primary: '#f59e0b', light: '#fef3c7', dark: '#d97706' },
      red: { primary: '#ef4444', light: '#fee2e2', dark: '#dc2626' },
      pink: { primary: '#ec4899', light: '#fce7f3', dark: '#be185d' },
      yellow: { primary: '#eab308', light: '#fefce8', dark: '#a16207' },
      teal: { primary: '#14b8a6', light: '#ccfbf1', dark: '#0f766e' }
    };
  },

  /**
   * Get CSS color value for habit color
   */
  getHabitColor(color: HabitColor, variant: 'primary' | 'light' | 'dark' = 'primary'): string {
    return this.getColorPalette()[color][variant];
  },

  /**
   * Get category icon
   */
  getCategoryIcon(category: HabitCategory): string {
    const icons: Record<HabitCategory, string> = {
      health: '🏥',
      fitness: '💪',
      productivity: '⚡',
      learning: '📚',
      social: '👥',
      mindfulness: '🧘',
      creative: '🎨',
      other: '📝'
    };
    return icons[category];
  }
};

/**
 * Validation utilities
 */
export const validationUtils = {
  /**
   * Validate habit data
   */
  validateHabit(habit: Partial<Habit>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!habit.name || habit.name.trim().length === 0) {
      errors.push('Habit name is required');
    } else if (habit.name.length > 100) {
      errors.push('Habit name must be less than 100 characters');
    }

    if (habit.targetValue !== undefined && habit.targetValue < 0) {
      errors.push('Target value must be positive');
    }

    if (habit.description && habit.description.length > 500) {
      errors.push('Description must be less than 500 characters');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  /**
   * Validate entry data
   */
  validateEntry(entry: Partial<HabitEntry>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!entry.habitId) {
      errors.push('Habit ID is required');
    }

    if (entry.value !== undefined && entry.value < 0) {
      errors.push('Entry value must be positive');
    }

    if (entry.rating !== undefined && (entry.rating < 1 || entry.rating > 5)) {
      errors.push('Rating must be between 1 and 5');
    }

    if (entry.notes && entry.notes.length > 1000) {
      errors.push('Notes must be less than 1000 characters');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
};

/**
 * Array and data manipulation utilities
 */
export const dataUtils = {
  /**
   * Sort habits by different criteria
   */
  sortHabits(
    habits: Habit[], 
    sortBy: 'name' | 'created' | 'updated' | 'category' = 'name', 
    order: 'asc' | 'desc' = 'asc'
  ): Habit[] {
    const sorted = [...habits].sort((a, b) => {
      let aVal: any, bVal: any;

      switch (sortBy) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'created':
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        case 'updated':
          aVal = new Date(a.updatedAt).getTime();
          bVal = new Date(b.updatedAt).getTime();
          break;
        case 'category':
          aVal = a.category;
          bVal = b.category;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  },

  /**
   * Group habits by category
   */
  groupHabitsByCategory(habits: Habit[]): Record<HabitCategory, Habit[]> {
    return habits.reduce((acc, habit) => {
      if (!acc[habit.category]) {
        acc[habit.category] = [];
      }
      acc[habit.category].push(habit);
      return acc;
    }, {} as Record<HabitCategory, Habit[]>);
  },

  /**
   * Filter habits by completion status
   */
  filterHabitsByCompletion(
    habits: Habit[], 
    entries: HabitEntry[], 
    status: 'completed' | 'incomplete' | 'all' = 'all',
    date: Date = new Date()
  ): Habit[] {
    if (status === 'all') return habits;

    return habits.filter(habit => {
      const isCompleted = habitUtils.isCompletedToday(habit, entries);
      return status === 'completed' ? isCompleted : !isCompleted;
    });
  },

  /**
   * Chunk array into smaller arrays
   */
  chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
};

/**
 * Format utilities
 */
export const formatUtils = {
  /**
   * Format number with appropriate suffix
   */
  formatNumber(num: number, decimals: number = 0): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(decimals) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(decimals) + 'K';
    }
    return num.toFixed(decimals);
  },

  /**
   * Format percentage
   */
  formatPercentage(value: number, total: number): string {
    if (total === 0) return '0%';
    const percentage = (value / total) * 100;
    return `${Math.round(percentage)}%`;
  },

  /**
   * Format streak text
   */
  formatStreak(streak: number): string {
    if (streak === 0) return 'No streak';
    if (streak === 1) return '1 day streak';
    return `${streak} day streak`;
  },

  /**
   * Format file size
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  }
};

/**
 * Local storage utilities
 */
export const storageUtils = {
  /**
   * Check if localStorage is available
   */
  isStorageAvailable(): boolean {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Get storage quota usage
   */
  getStorageQuota(): { used: number; total: number; available: number } {
    try {
      let used = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length;
        }
      }

      // Rough estimate - browsers typically allow 5-10MB
      const total = 5 * 1024 * 1024; // 5MB
      const available = total - used;

      return { used, total, available };
    } catch (error) {
      return { used: 0, total: 0, available: 0 };
    }
  }
};

// Re-export commonly used utilities
export {
  format as formatDate,
  isToday,
  isSameDay,
  differenceInDays,
  addDays,
  subDays
} from 'date-fns';