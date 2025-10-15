import { render, screen } from '@testing-library/react';
import { HabitCard } from '@/components/habits/HabitCard';
import { Habit, HabitStats, HabitCategory, HabitFrequency } from '@/lib/types';

// Mock data for testing
const mockHabit: Habit = {
  id: 'test-habit-1',
  name: 'Drink Water',
  description: 'Drink 8 glasses of water daily',
  category: 'health' as HabitCategory,
  frequency: 'daily' as HabitFrequency,
  targetValue: 8,
  unit: 'glasses',
  color: 'blue',
  isActive: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
};

const mockHabitStats: HabitStats = {
  totalEntries: 30,
  completedEntries: 25,
  completionRate: 83.3,
  currentStreak: 7,
  longestStreak: 12,
  averageRating: 4.2,
  lastSevenDays: 6,
  thisWeek: 5,
  thisMonth: 25,
  totalValue: 200
};

const mockHabitIncomplete: Habit = {
  id: 'test-habit-2',
  name: 'Exercise',
  description: 'Do 30 minutes of exercise',
  category: 'fitness' as HabitCategory,
  frequency: 'daily' as HabitFrequency,
  targetValue: 30,
  unit: 'minutes',
  color: 'green',
  isActive: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
};

const mockHabitStatsIncomplete: HabitStats = {
  totalEntries: 15,
  completedEntries: 7,
  completionRate: 46.7,
  currentStreak: 0,
  longestStreak: 3,
  lastSevenDays: 2,
  thisWeek: 1,
  thisMonth: 7,
  totalValue: 210
};

describe('HabitCard', () => {
  const mockProps = {
    habit: mockHabit,
    stats: mockHabitStats,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onComplete: jest.fn()
  };

  const mockPropsIncomplete = {
    habit: mockHabitIncomplete,
    stats: mockHabitStatsIncomplete,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onComplete: jest.fn()
  };

  it('renders habit name and description', () => {
    render(<HabitCard {...mockProps} />);
    
    expect(screen.getByText('Drink Water')).toBeInTheDocument();
    expect(screen.getByText('Drink 8 glasses of water daily')).toBeInTheDocument();
  });

  it('displays habit category and frequency', () => {
    render(<HabitCard {...mockProps} />);
    
    expect(screen.getByText('Health')).toBeInTheDocument();
    expect(screen.getByText('Daily')).toBeInTheDocument();
  });

  it('shows target value and unit', () => {
    render(<HabitCard {...mockProps} />);
    
    expect(screen.getByText('8 glasses')).toBeInTheDocument();
  });

  it('displays current streak', () => {
    render(<HabitCard {...mockProps} />);
    
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText(/streak/i)).toBeInTheDocument();
  });

  it('shows completion rate as percentage', () => {
    render(<HabitCard {...mockProps} />);
    
    expect(screen.getByText('83.3%')).toBeInTheDocument();
  });

  it('indicates when habit is completed today', () => {
    render(<HabitCard {...mockProps} />);
    
    const completionIndicator = screen.getByTestId('completion-indicator');
    expect(completionIndicator).toHaveClass('habit-completed');
  });

  it('indicates when habit is not completed today', () => {
    render(<HabitCard {...mockPropsIncomplete} />);
    
    const completionIndicator = screen.getByTestId('completion-indicator');
    expect(completionIndicator).not.toHaveClass('habit-completed');
  });

  it('applies correct color theme', () => {
    render(<HabitCard {...mockProps} />);
    
    const card = screen.getByTestId('habit-card');
    expect(card).toHaveClass('habit-color-blue');
  });

  it('shows zero streak when habit has no streak', () => {
    render(<HabitCard {...mockPropsIncomplete} />);
    
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('calls onComplete when complete button is clicked', () => {
    const onComplete = jest.fn();
    const props = { ...mockPropsIncomplete, onComplete };
    render(<HabitCard {...props} />);
    
    const completeButton = screen.getByRole('button', { name: /complete/i });
    completeButton.click();
    
    expect(onComplete).toHaveBeenCalledWith(mockHabitIncomplete.id, mockHabitIncomplete.targetValue);
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    const props = { ...mockProps, onEdit };
    render(<HabitCard {...props} />);
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    editButton.click();
    
    expect(onEdit).toHaveBeenCalledWith(mockHabit);
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = jest.fn();
    const props = { ...mockProps, onDelete };
    render(<HabitCard {...props} />);
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    deleteButton.click();
    
    expect(onDelete).toHaveBeenCalledWith(mockHabit.id);
  });

  it('renders with minimal required props', () => {
    const minimalStats: HabitStats = {
      totalEntries: 0,
      completedEntries: 0,
      completionRate: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastSevenDays: 0,
      thisWeek: 0,
      thisMonth: 0,
      totalValue: 0
    };

    const minimalProps = {
      habit: mockHabit,
      stats: minimalStats,
      onEdit: jest.fn(),
      onDelete: jest.fn(),
      onComplete: jest.fn()
    };

    render(<HabitCard {...minimalProps} />);
    
    expect(screen.getByText('Drink Water')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('handles long habit names gracefully', () => {
    const longNameHabit: Habit = {
      ...mockHabit,
      name: 'This is a very long habit name that should be handled gracefully by the component'
    };

    const props = { ...mockProps, habit: longNameHabit };
    render(<HabitCard {...props} />);
    
    expect(screen.getByText(longNameHabit.name)).toBeInTheDocument();
  });

  it('displays correct icon for habit category', () => {
    render(<HabitCard {...mockProps} />);
    
    const categoryIcon = screen.getByTestId('category-icon');
    expect(categoryIcon).toHaveClass('health-icon');
  });

  it('applies disabled state when habit is not active', () => {
    const inactiveHabit: Habit = {
      ...mockHabit,
      isActive: false
    };

    const props = { ...mockProps, habit: inactiveHabit };
    render(<HabitCard {...props} />);
    
    const card = screen.getByTestId('habit-card');
    expect(card).toHaveClass('habit-inactive');
  });

  it('formats completion rate to one decimal place', () => {
    const preciseStats: HabitStats = {
      ...mockHabitStats,
      completionRate: 66.66666
    };

    const props = { ...mockProps, stats: preciseStats };
    render(<HabitCard {...props} />);
    
    expect(screen.getByText('66.7%')).toBeInTheDocument();
  });

  it('shows today completion status correctly', () => {
    render(<HabitCard {...mockProps} showDetails={true} />);
    
    // Should show some indication of today's status
    const todayIndicator = screen.getByTestId('today-status');
    expect(todayIndicator).toBeInTheDocument();
  });
});