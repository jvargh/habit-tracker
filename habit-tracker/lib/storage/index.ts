import { 
  Habit, 
  HabitEntry, 
  Achievement, 
  UserSettings, 
  StorageData, 
  ApiResponse 
} from '@/lib/types';

const STORAGE_KEYS = {
  HABITS: 'habit-tracker-habits',
  ENTRIES: 'habit-tracker-entries', 
  ACHIEVEMENTS: 'habit-tracker-achievements',
  SETTINGS: 'habit-tracker-settings',
  BACKUP: 'habit-tracker-backup'
} as const;

const STORAGE_VERSION = '1.0.0';

/**
 * LocalStorage-based storage service for habit tracker data
 * Provides CRUD operations and data persistence
 */
class StorageService {
  /**
   * Initialize storage with default data if empty
   */
  async initialize(): Promise<void> {
    try {
      // Check if storage has been initialized
      const habits = await this.getHabits();
      const settings = await this.getSettings();
      
      // Initialize default settings if none exist
      if (!settings) {
        const defaultSettings: UserSettings = {
          theme: 'light',
          notifications: true,
          dailyReminder: true,
          reminderTime: '09:00',
          weekStartsOn: 'monday',
          defaultView: 'dashboard',
          chartPreferences: {
            chartType: 'line',
            timeframe: 'month',
            showRatings: true,
            showTargets: true,
            groupBy: 'day'
          }
        };
        await this.saveSettings(defaultSettings);
      }

      // Create backup of current data
      await this.createBackup();
    } catch (error) {
      console.error('Failed to initialize storage:', error);
      throw new Error('Storage initialization failed');
    }
  }

  // Habit CRUD Operations
  /**
   * Get all habits
   */
  async getHabits(): Promise<Habit[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HABITS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get habits:', error);
      return [];
    }
  }

  /**
   * Get habit by ID
   */
  async getHabit(id: string): Promise<Habit | null> {
    const habits = await this.getHabits();
    return habits.find(h => h.id === id) || null;
  }

  /**
   * Save new habit
   */
  async saveHabit(habit: Habit): Promise<ApiResponse<Habit>> {
    try {
      const habits = await this.getHabits();
      const existingIndex = habits.findIndex(h => h.id === habit.id);
      
      if (existingIndex >= 0) {
        habits[existingIndex] = { ...habit, updatedAt: new Date() };
      } else {
        habits.push({ ...habit, createdAt: new Date(), updatedAt: new Date() });
      }
      
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
      
      return {
        success: true,
        data: habit,
        message: existingIndex >= 0 ? 'Habit updated' : 'Habit created'
      };
    } catch (error) {
      console.error('Failed to save habit:', error);
      return {
        success: false,
        error: 'Failed to save habit'
      };
    }
  }

  /**
   * Delete habit and all related entries
   */
  async deleteHabit(id: string): Promise<ApiResponse<void>> {
    try {
      const habits = await this.getHabits();
      const filteredHabits = habits.filter(h => h.id !== id);
      
      // Also delete all entries for this habit
      const entries = await this.getEntries();
      const filteredEntries = entries.filter(e => e.habitId !== id);
      
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(filteredHabits));
      localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(filteredEntries));
      
      return {
        success: true,
        message: 'Habit deleted successfully'
      };
    } catch (error) {
      console.error('Failed to delete habit:', error);
      return {
        success: false,
        error: 'Failed to delete habit'
      };
    }
  }

  // Entry CRUD Operations
  /**
   * Get all entries
   */
  async getEntries(): Promise<HabitEntry[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ENTRIES);
      const entries = data ? JSON.parse(data) : [];
      
      // Convert date strings back to Date objects
      return entries.map((entry: any) => ({
        ...entry,
        date: new Date(entry.date),
        createdAt: new Date(entry.createdAt)
      }));
    } catch (error) {
      console.error('Failed to get entries:', error);
      return [];
    }
  }

  /**
   * Get entries for a specific habit
   */
  async getEntriesForHabit(habitId: string): Promise<HabitEntry[]> {
    const entries = await this.getEntries();
    return entries.filter(e => e.habitId === habitId);
  }

  /**
   * Get entries for a specific date range
   */
  async getEntriesForDateRange(start: Date, end: Date): Promise<HabitEntry[]> {
    const entries = await this.getEntries();
    return entries.filter(e => e.date >= start && e.date <= end);
  }

  /**
   * Save new entry
   */
  async saveEntry(entry: HabitEntry): Promise<ApiResponse<HabitEntry>> {
    try {
      const entries = await this.getEntries();
      const existingIndex = entries.findIndex(e => e.id === entry.id);
      
      const entryWithTimestamp = {
        ...entry,
        createdAt: existingIndex >= 0 ? entries[existingIndex].createdAt : new Date()
      };
      
      if (existingIndex >= 0) {
        entries[existingIndex] = entryWithTimestamp;
      } else {
        entries.push(entryWithTimestamp);
      }
      
      localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
      
      return {
        success: true,
        data: entryWithTimestamp,
        message: existingIndex >= 0 ? 'Entry updated' : 'Entry created'
      };
    } catch (error) {
      console.error('Failed to save entry:', error);
      return {
        success: false,
        error: 'Failed to save entry'
      };
    }
  }

  /**
   * Delete entry
   */
  async deleteEntry(id: string): Promise<ApiResponse<void>> {
    try {
      const entries = await this.getEntries();
      const filteredEntries = entries.filter(e => e.id !== id);
      
      localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(filteredEntries));
      
      return {
        success: true,
        message: 'Entry deleted successfully'
      };
    } catch (error) {
      console.error('Failed to delete entry:', error);
      return {
        success: false,
        error: 'Failed to delete entry'
      };
    }
  }

  // Achievement Operations
  /**
   * Get all achievements
   */
  async getAchievements(): Promise<Achievement[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      const achievements = data ? JSON.parse(data) : [];
      
      // Convert date strings back to Date objects
      return achievements.map((achievement: any) => ({
        ...achievement,
        unlockedAt: achievement.unlockedAt ? new Date(achievement.unlockedAt) : undefined
      }));
    } catch (error) {
      console.error('Failed to get achievements:', error);
      return [];
    }
  }

  /**
   * Unlock achievement
   */
  async unlockAchievement(achievement: Achievement): Promise<ApiResponse<Achievement>> {
    try {
      const achievements = await this.getAchievements();
      const unlockedAchievement = { 
        ...achievement, 
        unlockedAt: new Date(),
        progress: achievement.maxProgress || 100
      };
      
      const existingIndex = achievements.findIndex(a => a.id === achievement.id);
      
      if (existingIndex >= 0) {
        achievements[existingIndex] = unlockedAchievement;
      } else {
        achievements.push(unlockedAchievement);
      }
      
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
      
      return {
        success: true,
        data: unlockedAchievement,
        message: 'Achievement unlocked!'
      };
    } catch (error) {
      console.error('Failed to unlock achievement:', error);
      return {
        success: false,
        error: 'Failed to unlock achievement'
      };
    }
  }

  // Settings Operations
  /**
   * Get user settings
   */
  async getSettings(): Promise<UserSettings | null> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get settings:', error);
      return null;
    }
  }

  /**
   * Save user settings
   */
  async saveSettings(settings: UserSettings): Promise<ApiResponse<UserSettings>> {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      
      return {
        success: true,
        data: settings,
        message: 'Settings saved successfully'
      };
    } catch (error) {
      console.error('Failed to save settings:', error);
      return {
        success: false,
        error: 'Failed to save settings'
      };
    }
  }

  // Backup and Export
  /**
   * Create backup of all data
   */
  async createBackup(): Promise<ApiResponse<StorageData>> {
    try {
      const [habits, entries, achievements, settings] = await Promise.all([
        this.getHabits(),
        this.getEntries(),
        this.getAchievements(),
        this.getSettings()
      ]);

      const backupData: StorageData = {
        habits,
        entries,
        achievements,
        settings: settings || {} as UserSettings,
        lastBackup: new Date(),
        version: STORAGE_VERSION
      };

      localStorage.setItem(STORAGE_KEYS.BACKUP, JSON.stringify(backupData));

      return {
        success: true,
        data: backupData,
        message: 'Backup created successfully'
      };
    } catch (error) {
      console.error('Failed to create backup:', error);
      return {
        success: false,
        error: 'Failed to create backup'
      };
    }
  }

  /**
   * Restore data from backup
   */
  async restoreFromBackup(backupData: StorageData): Promise<ApiResponse<void>> {
    try {
      // Validate backup data version
      if (backupData.version !== STORAGE_VERSION) {
        console.warn('Backup version mismatch, proceeding with caution');
      }

      // Restore all data
      if (backupData.habits) {
        localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(backupData.habits));
      }
      
      if (backupData.entries) {
        localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(backupData.entries));
      }
      
      if (backupData.achievements) {
        localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(backupData.achievements));
      }
      
      if (backupData.settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(backupData.settings));
      }

      return {
        success: true,
        message: 'Data restored successfully'
      };
    } catch (error) {
      console.error('Failed to restore backup:', error);
      return {
        success: false,
        error: 'Failed to restore backup'
      };
    }
  }

  /**
   * Export data as JSON
   */
  async exportData(): Promise<ApiResponse<StorageData>> {
    try {
      const backup = await this.createBackup();
      
      if (!backup.success || !backup.data) {
        throw new Error('Failed to create backup for export');
      }

      return {
        success: true,
        data: backup.data,
        message: 'Data exported successfully'
      };
    } catch (error) {
      console.error('Failed to export data:', error);
      return {
        success: false,
        error: 'Failed to export data'
      };
    }
  }

  /**
   * Clear all data (use with caution!)
   */
  async clearAllData(): Promise<ApiResponse<void>> {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });

      return {
        success: true,
        message: 'All data cleared successfully'
      };
    } catch (error) {
      console.error('Failed to clear data:', error);
      return {
        success: false,
        error: 'Failed to clear data'
      };
    }
  }

  /**
   * Get storage usage statistics
   */
  getStorageStats(): { used: number; total: number; percentage: number } {
    try {
      let used = 0;
      
      Object.values(STORAGE_KEYS).forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          used += new Blob([data]).size;
        }
      });

      // Most browsers limit localStorage to ~5-10MB
      const total = 5 * 1024 * 1024; // 5MB in bytes
      const percentage = (used / total) * 100;

      return { used, total, percentage };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return { used: 0, total: 0, percentage: 0 };
    }
  }
}

// Create singleton instance
const storageService = new StorageService();

export { storageService };
export default storageService;