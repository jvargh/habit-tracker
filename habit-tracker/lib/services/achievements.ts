import { 
  Achievement, 
  AchievementType, 
  AchievementCondition,
  Habit, 
  HabitEntry, 
  HabitStats,
  HabitCategory 
} from '@/lib/types';
import { habitUtils, dateUtils, isToday, isSameDay } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

/**
 * Achievement definitions and management service
 */
class AchievementService {
  private achievements: Achievement[] = [];

  constructor() {
    this.initializeAchievements();
  }

  /**
   * Initialize default achievements
   */
  private initializeAchievements() {
    this.achievements = [
      // Streak Achievements
      {
        id: 'streak-3',
        type: 'streak',
        title: 'Getting Started',
        description: 'Complete a habit for 3 days in a row',
        icon: '🔥',
        condition: {
          type: 'streak',
          threshold: 3
        }
      },
      {
        id: 'streak-7',
        type: 'streak',
        title: 'Week Warrior',
        description: 'Complete a habit for 7 days in a row',
        icon: '💪',
        condition: {
          type: 'streak',
          threshold: 7
        }
      },
      {
        id: 'streak-30',
        type: 'streak',
        title: 'Month Master',
        description: 'Complete a habit for 30 days in a row',
        icon: '👑',
        condition: {
          type: 'streak',
          threshold: 30
        }
      },
      {
        id: 'streak-100',
        type: 'streak',
        title: 'Century Champion',
        description: 'Complete a habit for 100 days in a row',
        icon: '🏆',
        condition: {
          type: 'streak',
          threshold: 100
        }
      },
      
      // Consistency Achievements
      {
        id: 'consistent-week',
        type: 'consistency',
        title: 'Consistency King',
        description: 'Complete all habits for 7 consecutive days',
        icon: '⭐',
        condition: {
          type: 'consecutive_days',
          threshold: 7
        }
      },
      {
        id: 'consistent-month',
        type: 'consistency',
        title: 'Reliability Rock',
        description: 'Complete all habits for 30 consecutive days',
        icon: '🌟',
        condition: {
          type: 'consecutive_days',
          threshold: 30
        }
      },

      // Milestone Achievements
      {
        id: 'milestone-10',
        type: 'milestone',
        title: 'Double Digits',
        description: 'Complete 10 habit entries',
        icon: '🔟',
        condition: {
          type: 'total_entries',
          threshold: 10
        }
      },
      {
        id: 'milestone-50',
        type: 'milestone',
        title: 'Half Century',
        description: 'Complete 50 habit entries',
        icon: '⚡',
        condition: {
          type: 'total_entries',
          threshold: 50
        }
      },
      {
        id: 'milestone-100',
        type: 'milestone',
        title: 'Century Club',
        description: 'Complete 100 habit entries',
        icon: '💯',
        condition: {
          type: 'total_entries',
          threshold: 100
        }
      },
      {
        id: 'milestone-365',
        type: 'milestone',
        title: 'Year of Habits',
        description: 'Complete 365 habit entries',
        icon: '📅',
        condition: {
          type: 'total_entries',
          threshold: 365
        }
      },

      // Variety Achievements
      {
        id: 'variety-5',
        type: 'variety',
        title: 'Habit Explorer',
        description: 'Create 5 different habits',
        icon: '🚀',
        condition: {
          type: 'habit_count',
          threshold: 5
        }
      },
      {
        id: 'variety-10',
        type: 'variety',
        title: 'Habit Collector',
        icon: '📚',
        description: 'Create 10 different habits',
        condition: {
          type: 'habit_count',
          threshold: 10
        }
      },
      {
        id: 'variety-categories',
        type: 'variety',
        title: 'Well Rounded',
        description: 'Create habits in 5 different categories',
        icon: '🎯',
        condition: {
          type: 'habit_count',
          threshold: 5,
          category: 'health' // Special condition to check multiple categories
        }
      },

      // Improvement Achievements
      {
        id: 'perfect-rating',
        type: 'improvement',
        title: 'Perfectionist',
        description: 'Maintain a 5-star average rating for a week',
        icon: '⭐⭐⭐⭐⭐',
        condition: {
          type: 'rating_average',
          threshold: 5,
          timeframe: 'weekly'
        }
      },
      {
        id: 'high-performer',
        type: 'improvement',
        title: 'High Performer',
        description: 'Maintain above 4-star average for a month',
        icon: '🎖️',
        condition: {
          type: 'rating_average',
          threshold: 4,
          timeframe: 'monthly'
        }
      },

      // Special Category Achievements
      {
        id: 'health-warrior',
        type: 'variety',
        title: 'Health Warrior',
        description: 'Complete 50 health-related habit entries',
        icon: '🏥',
        condition: {
          type: 'total_entries',
          threshold: 50,
          category: 'health'
        }
      },
      {
        id: 'fitness-fanatic',
        type: 'variety',
        title: 'Fitness Fanatic',
        description: 'Complete 50 fitness-related habit entries',
        icon: '💪',
        condition: {
          type: 'total_entries',
          threshold: 50,
          category: 'fitness'
        }
      },
      {
        id: 'learning-lover',
        type: 'variety',
        title: 'Learning Lover',
        description: 'Complete 50 learning-related habit entries',
        icon: '📚',
        condition: {
          type: 'total_entries',
          threshold: 50,
          category: 'learning'
        }
      },
      {
        id: 'mindful-master',
        type: 'variety',
        title: 'Mindful Master',
        description: 'Complete 50 mindfulness-related habit entries',
        icon: '🧘',
        condition: {
          type: 'total_entries',
          threshold: 50,
          category: 'mindfulness'
        }
      }
    ];
  }

  /**
   * Get all available achievements
   */
  getAllAchievements(): Achievement[] {
    return [...this.achievements];
  }

  /**
   * Get achievements by type
   */
  getAchievementsByType(type: AchievementType): Achievement[] {
    return this.achievements.filter(a => a.type === type);
  }

  /**
   * Check which achievements should be unlocked based on current data
   */
  checkAchievements(
    habits: Habit[], 
    entries: HabitEntry[], 
    currentAchievements: Achievement[]
  ): Achievement[] {
    const unlockedIds = new Set(currentAchievements.map(a => a.id));
    const newAchievements: Achievement[] = [];

    for (const achievement of this.achievements) {
      // Skip if already unlocked
      if (unlockedIds.has(achievement.id)) {
        continue;
      }

      if (this.checkAchievementCondition(achievement, habits, entries)) {
        newAchievements.push({
          ...achievement,
          unlockedAt: new Date(),
          progress: achievement.maxProgress || 100
        });
      }
    }

    return newAchievements;
  }

  /**
   * Calculate progress for a specific achievement
   */
  calculateAchievementProgress(
    achievement: Achievement,
    habits: Habit[],
    entries: HabitEntry[]
  ): number {
    const condition = achievement.condition;
    let current = 0;
    const target = condition.threshold;

    switch (condition.type) {
      case 'streak':
        // Calculate maximum streak across all habits
        if (condition.habitId) {
          const habit = habits.find(h => h.id === condition.habitId);
          if (habit) {
            const habitEntries = entries.filter(e => e.habitId === habit.id);
            const streakInfo = habitUtils.calculateStreak(habitEntries);
            current = streakInfo.current;
          }
        } else {
          // Get maximum streak from any habit
          current = Math.max(...habits.map(habit => {
            const habitEntries = entries.filter(e => e.habitId === habit.id);
            const streakInfo = habitUtils.calculateStreak(habitEntries);
            return streakInfo.current;
          }), 0);
        }
        break;

      case 'total_entries':
        if (condition.category) {
          // Count entries for specific category
          const categoryHabits = habits.filter(h => h.category === condition.category);
          current = entries.filter(e => 
            categoryHabits.some(h => h.id === e.habitId) && e.completed
          ).length;
        } else if (condition.habitId) {
          // Count entries for specific habit
          current = entries.filter(e => e.habitId === condition.habitId && e.completed).length;
        } else {
          // Count all completed entries
          current = entries.filter(e => e.completed).length;
        }
        break;

      case 'consecutive_days':
        current = this.calculateConsecutiveDays(habits, entries);
        break;

      case 'habit_count':
        if (achievement.id === 'variety-categories') {
          // Special case: count unique categories
          const categories = new Set(habits.map(h => h.category));
          current = categories.size;
        } else if (condition.category) {
          current = habits.filter(h => h.category === condition.category).length;
        } else {
          current = habits.length;
        }
        break;

      case 'rating_average':
        current = this.calculateRatingAverage(habits, entries, condition.timeframe || 'all_time');
        break;

      default:
        current = 0;
    }

    // Return progress as percentage (0-100)
    return Math.min((current / target) * 100, 100);
  }

  /**
   * Check if a specific achievement condition is met
   */
  private checkAchievementCondition(
    achievement: Achievement,
    habits: Habit[],
    entries: HabitEntry[]
  ): boolean {
    const progress = this.calculateAchievementProgress(achievement, habits, entries);
    return progress >= 100;
  }

  /**
   * Calculate consecutive days of completing all active habits
   */
  private calculateConsecutiveDays(habits: Habit[], entries: HabitEntry[]): number {
    const activeHabits = habits.filter(h => h.isActive);
    if (activeHabits.length === 0) return 0;

    let consecutiveDays = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) { // Check up to a year back
      const checkDate = dateUtils.getDaysAgo(i);
      const dayEntries = entries.filter(e => 
        isSameDay(e.date, checkDate) &&
        e.completed
      );
      
      // Check if all active habits were completed on this day
      const completedHabits = new Set(dayEntries.map(e => e.habitId));
      const allCompleted = activeHabits.every(h => completedHabits.has(h.id));
      
      if (allCompleted) {
        consecutiveDays++;
      } else if (i > 0) { // Don't break on the first day (today) if not completed
        break;
      }
    }
    
    return consecutiveDays;
  }

  /**
   * Calculate average rating for given timeframe
   */
  private calculateRatingAverage(
    habits: Habit[],
    entries: HabitEntry[],
    timeframe: string
  ): number {
    let filteredEntries = entries.filter(e => e.rating !== undefined && e.completed);
    
    const now = new Date();
    
    switch (timeframe) {
      case 'daily':
        filteredEntries = filteredEntries.filter(e => isToday(e.date));
        break;
      case 'weekly':
        const weekRange = dateUtils.getCurrentWeek();
        filteredEntries = filteredEntries.filter(e => 
          dateUtils.isInRange(e.date, weekRange.start, weekRange.end)
        );
        break;
      case 'monthly':
        const monthRange = dateUtils.getCurrentMonth();
        filteredEntries = filteredEntries.filter(e =>
          dateUtils.isInRange(e.date, monthRange.start, monthRange.end)
        );
        break;
      // 'all_time' - no filtering
    }
    
    if (filteredEntries.length === 0) return 0;
    
    const sum = filteredEntries.reduce((total, entry) => total + (entry.rating || 0), 0);
    return sum / filteredEntries.length;
  }

  /**
   * Get achievement progress for all achievements
   */
  getAchievementProgress(
    habits: Habit[],
    entries: HabitEntry[],
    currentAchievements: Achievement[]
  ): Array<Achievement & { progress: number }> {
    const unlockedIds = new Set(currentAchievements.map(a => a.id));
    
    return this.achievements.map(achievement => {
      const isUnlocked = unlockedIds.has(achievement.id);
      const progress = isUnlocked ? 100 : this.calculateAchievementProgress(achievement, habits, entries);
      
      return {
        ...achievement,
        progress,
        unlockedAt: isUnlocked ? currentAchievements.find(a => a.id === achievement.id)?.unlockedAt : undefined
      };
    });
  }

  /**
   * Get achievements close to being unlocked (80%+ progress)
   */
  getNearbyAchievements(
    habits: Habit[],
    entries: HabitEntry[],
    currentAchievements: Achievement[]
  ): Array<Achievement & { progress: number }> {
    const progress = this.getAchievementProgress(habits, entries, currentAchievements);
    
    return progress.filter(a => !a.unlockedAt && a.progress >= 80);
  }

  /**
   * Create custom achievement
   */
  createCustomAchievement(
    title: string,
    description: string,
    condition: AchievementCondition,
    icon: string = '🎯'
  ): Achievement {
    return {
      id: uuidv4(),
      type: 'milestone',
      title,
      description,
      icon,
      condition
    };
  }
}

// Create singleton instance
const achievementService = new AchievementService();

export { achievementService };
export default achievementService;