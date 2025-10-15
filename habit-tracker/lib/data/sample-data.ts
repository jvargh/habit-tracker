import { Habit, HabitEntry, Achievement } from '@/lib/types';
import { addDays, subDays } from 'date-fns';

/**
 * Sample habit data for testing and demonstration
 */
export const sampleHabits: Habit[] = [
  {
    id: 'habit-1',
    name: 'Drink 8 Glasses of Water',
    description: 'Stay hydrated by drinking at least 8 glasses of water throughout the day',
    category: 'health',
    frequency: 'daily',
    targetValue: 8,
    unit: 'glasses',
    color: 'blue',
    icon: '💧',
    createdAt: subDays(new Date(), 30),
    updatedAt: subDays(new Date(), 1),
    isActive: true
  },
  {
    id: 'habit-2',
    name: 'Morning Workout',
    description: '30 minutes of exercise to start the day with energy',
    category: 'fitness',
    frequency: 'daily',
    targetValue: 30,
    unit: 'minutes',
    color: 'orange',
    icon: '🏋️‍♀️',
    createdAt: subDays(new Date(), 25),
    updatedAt: subDays(new Date(), 2),
    isActive: true
  },
  {
    id: 'habit-3',
    name: 'Read for Learning',
    description: 'Read educational books or articles for personal growth',
    category: 'learning',
    frequency: 'daily',
    targetValue: 20,
    unit: 'pages',
    color: 'green',
    icon: '📚',
    createdAt: subDays(new Date(), 20),
    updatedAt: new Date(),
    isActive: true
  },
  {
    id: 'habit-4',
    name: 'Meditation Practice',
    description: 'Daily mindfulness meditation to reduce stress and improve focus',
    category: 'mindfulness',
    frequency: 'daily',
    targetValue: 10,
    unit: 'minutes',
    color: 'purple',
    icon: '🧘‍♂️',
    createdAt: subDays(new Date(), 15),
    updatedAt: subDays(new Date(), 3),
    isActive: true
  },
  {
    id: 'habit-5',
    name: 'Write in Journal',
    description: 'Reflect on the day and write down thoughts and experiences',
    category: 'creative',
    frequency: 'daily',
    targetValue: 1,
    unit: 'entry',
    color: 'yellow',
    icon: '📝',
    createdAt: subDays(new Date(), 12),
    updatedAt: subDays(new Date(), 1),
    isActive: true
  },
  {
    id: 'habit-6',
    name: 'Connect with Family',
    description: 'Call or spend quality time with family members',
    category: 'social',
    frequency: 'daily',
    targetValue: 15,
    unit: 'minutes',
    color: 'pink',
    icon: '👨‍👩‍👧‍👦',
    createdAt: subDays(new Date(), 18),
    updatedAt: subDays(new Date(), 4),
    isActive: true
  },
  {
    id: 'habit-7',
    name: 'Complete Work Tasks',
    description: 'Focus on completing important work tasks without procrastination',
    category: 'productivity',
    frequency: 'daily',
    targetValue: 3,
    unit: 'tasks',
    color: 'red',
    icon: '✅',
    createdAt: subDays(new Date(), 22),
    updatedAt: subDays(new Date(), 1),
    isActive: true
  },
  {
    id: 'habit-8',
    name: 'Take Vitamins',
    description: 'Remember to take daily vitamin supplements',
    category: 'health',
    frequency: 'daily',
    targetValue: 1,
    unit: 'dose',
    color: 'teal',
    icon: '💊',
    createdAt: subDays(new Date(), 14),
    updatedAt: subDays(new Date(), 2),
    isActive: false // Inactive habit for testing
  }
];

/**
 * Generate sample habit entries for the last 30 days
 */
export const generateSampleEntries = (): HabitEntry[] => {
  const entries: HabitEntry[] = [];
  const today = new Date();

  // Generate entries for each habit over the last 30 days
  sampleHabits.forEach(habit => {
    for (let i = 0; i < 30; i++) {
      const date = subDays(today, i);
      
      // Skip inactive habits for recent dates
      if (!habit.isActive && i < 7) continue;

      // Create realistic completion patterns
      let shouldComplete = false;
      let completionRate = 0.7; // Base 70% completion rate

      // Adjust completion rate based on habit type
      switch (habit.category) {
        case 'health':
          completionRate = 0.8; // Health habits tend to be more consistent
          break;
        case 'fitness':
          completionRate = 0.6; // Fitness can be challenging
          break;
        case 'learning':
          completionRate = 0.75;
          break;
        case 'mindfulness':
          completionRate = 0.65;
          break;
        case 'creative':
          completionRate = 0.55; // More variable
          break;
        case 'social':
          completionRate = 0.85; // Usually easier to maintain
          break;
        case 'productivity':
          completionRate = 0.7;
          break;
      }

      // Add some randomness and patterns
      const randomFactor = Math.random();
      const weekendBonus = date.getDay() === 0 || date.getDay() === 6 ? 0.1 : 0;
      const recentBonus = i < 7 ? 0.15 : 0; // More likely to complete recent habits
      const streakBonus = i < 3 ? 0.2 : 0; // Maintain recent streaks

      shouldComplete = randomFactor < (completionRate + weekendBonus + recentBonus + streakBonus);

      if (shouldComplete) {
        const value = habit.targetValue + Math.floor(Math.random() * (habit.targetValue * 0.2)); // Some variation
        const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars for completed entries
        
        entries.push({
          id: `entry-${habit.id}-${i}`,
          habitId: habit.id,
          date: date,
          value: value,
          completed: true,
          rating: Math.random() > 0.3 ? rating : undefined, // 70% chance of rating
          notes: Math.random() > 0.8 ? getSampleNote() : undefined, // 20% chance of notes
          createdAt: date
        });
      } else if (Math.random() > 0.7) {
        // 30% chance of incomplete entry (attempted but not completed)
        const value = Math.floor(habit.targetValue * (0.3 + Math.random() * 0.4)); // 30-70% of target
        const rating = Math.floor(Math.random() * 2) + 2; // 2-3 stars for incomplete entries
        
        entries.push({
          id: `entry-${habit.id}-${i}-incomplete`,
          habitId: habit.id,
          date: date,
          value: value,
          completed: false,
          rating: Math.random() > 0.5 ? rating : undefined,
          notes: Math.random() > 0.6 ? 'Tried but couldn\'t complete fully today' : undefined,
          createdAt: date
        });
      }
    }
  });

  return entries.sort((a, b) => b.date.getTime() - a.date.getTime());
};

/**
 * Sample notes for habit entries
 */
const sampleNotes = [
  'Feeling great today!',
  'Had to push myself but got it done',
  'Really enjoyed this session',
  'Struggled a bit but persevered',
  'Perfect start to the day',
  'Feeling more energetic lately',
  'This is becoming a good routine',
  'Had some challenges but made progress',
  'Really proud of staying consistent',
  'Noticed improvements in my focus',
  'Getting easier each day',
  'Had support from family today',
  'Used a new approach and it worked well',
  'Weather was perfect for this',
  'Feeling motivated to continue',
  'Best session in a while!',
  'Had to adapt but still completed it',
  'Celebrating small wins',
  'Building momentum',
  'Grateful for this healthy habit'
];

function getSampleNote(): string {
  return sampleNotes[Math.floor(Math.random() * sampleNotes.length)];
}

/**
 * Sample achievements for demonstration
 */
export const sampleAchievements: Achievement[] = [
  {
    id: 'achievement-1',
    type: 'streak',
    title: 'Getting Started',
    description: 'Complete a habit for 3 days in a row',
    icon: '🔥',
    condition: {
      type: 'streak',
      threshold: 3
    },
    unlockedAt: subDays(new Date(), 20),
    progress: 100,
    maxProgress: 100
  },
  {
    id: 'achievement-2',
    type: 'streak',
    title: 'Week Warrior',
    description: 'Complete a habit for 7 days in a row',
    icon: '💪',
    condition: {
      type: 'streak',
      threshold: 7
    },
    unlockedAt: subDays(new Date(), 15),
    progress: 100,
    maxProgress: 100
  },
  {
    id: 'achievement-3',
    type: 'milestone',
    title: 'Double Digits',
    description: 'Complete 10 habit entries',
    icon: '🔟',
    condition: {
      type: 'total_entries',
      threshold: 10
    },
    unlockedAt: subDays(new Date(), 25),
    progress: 100,
    maxProgress: 100
  },
  {
    id: 'achievement-4',
    type: 'variety',
    title: 'Habit Explorer',
    description: 'Create 5 different habits',
    icon: '🚀',
    condition: {
      type: 'habit_count',
      threshold: 5
    },
    unlockedAt: subDays(new Date(), 10),
    progress: 100,
    maxProgress: 100
  }
];

/**
 * Get sample data for initial app state
 */
export function getSampleData() {
  return {
    habits: sampleHabits,
    entries: generateSampleEntries(),
    achievements: sampleAchievements
  };
}

/**
 * Helper to create a new sample habit
 */
export function createSampleHabit(overrides: Partial<Habit> = {}): Habit {
  const baseHabit: Habit = {
    id: `habit-${Date.now()}`,
    name: 'New Habit',
    description: 'A new habit to build',
    category: 'other',
    frequency: 'daily',
    targetValue: 1,
    unit: 'time',
    color: 'blue',
    icon: '⭐',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  };

  return { ...baseHabit, ...overrides };
}

/**
 * Helper to create a sample habit entry
 */
export function createSampleEntry(habitId: string, overrides: Partial<HabitEntry> = {}): HabitEntry {
  const baseEntry: HabitEntry = {
    id: `entry-${Date.now()}`,
    habitId: habitId,
    date: new Date(),
    value: 1,
    completed: true,
    rating: 5,
    notes: undefined,
    createdAt: new Date()
  };

  return { ...baseEntry, ...overrides };
}

/**
 * Reset data to sample state (useful for testing)
 */
export async function loadSampleData() {
  if (typeof window !== 'undefined' && window.localStorage) {
    const sampleData = getSampleData();
    
    localStorage.setItem('habit-tracker-habits', JSON.stringify(sampleData.habits));
    localStorage.setItem('habit-tracker-entries', JSON.stringify(sampleData.entries));
    localStorage.setItem('habit-tracker-achievements', JSON.stringify(sampleData.achievements));
    
    console.log('Sample data loaded successfully');
    return sampleData;
  }
}

/**
 * Clear all data (useful for testing fresh state)
 */
export async function clearAllData() {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('habit-tracker-habits');
    localStorage.removeItem('habit-tracker-entries');
    localStorage.removeItem('habit-tracker-achievements');
    localStorage.removeItem('habit-tracker-settings');
    localStorage.removeItem('habit-tracker-backup');
    
    console.log('All data cleared');
  }
}