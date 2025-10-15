'use client';

import React from 'react';
import { Habit, HabitStats, HabitCardProps } from '@/lib/types';
import Button from '@/components/ui/Button';
import { habitUtils, dateUtils } from '@/lib/utils';

/**
 * HabitCard component displays individual habit information with statistics and actions
 */
export function HabitCard({
  habit,
  stats,
  onEdit,
  onDelete,
  onComplete,
  showDetails = false,
  className = '',
  isCompletedToday = false
}: HabitCardProps) {
  
  // Calculate display values  
  const completionRate = Number(stats.completionRate.toFixed(1));
  const currentStreak = stats.currentStreak;
  const targetDisplay = `${habit.targetValue} ${habit.unit}`;
  
  // Determine if completed today based on current streak or prop
  const completedToday = isCompletedToday || (currentStreak > 0);
  
  // Format category for display
  const categoryDisplay = habit.category.charAt(0).toUpperCase() + habit.category.slice(1);
  
  // Format frequency for display
  const frequencyDisplay = habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1);

  const handleComplete = () => {
    onComplete(habit.id, habit.targetValue);
  };

  const handleEdit = () => {
    onEdit(habit);
  };

  const handleDelete = () => {
    onDelete(habit.id);
  };

  return (
    <div 
      data-testid="habit-card"
      className={`
        habit-card 
        habit-color-${habit.color}
        ${completedToday ? 'habit-completed' : ''}
        ${!habit.isActive ? 'habit-inactive' : ''}
        ${className}
        bg-white rounded-lg shadow-md p-4 border border-gray-200
        hover:shadow-lg transition-shadow duration-200
      `}
    >
      {/* Header with title and actions */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-sm text-gray-600 mb-2">
              {habit.description}
            </p>
          )}
        </div>
        
        {/* Completion indicator */}
        <div 
          data-testid="completion-indicator"
          className={`
            w-4 h-4 rounded-full ml-3 flex-shrink-0
            ${completedToday ? 'bg-green-500 habit-completed' : 'bg-gray-200'}
          `}
        />
      </div>

      {/* Category and frequency */}
      <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <span 
            data-testid="category-icon" 
            className={`category-icon ${habit.category}-icon w-4 h-4`}
          >
            📱 {/* Placeholder icon */}
          </span>
          <span>{categoryDisplay}</span>
        </div>
        <div>{frequencyDisplay}</div>
        <div>{targetDisplay}</div>
      </div>

      {/* Statistics */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4 text-sm">
          {/* Completion rate */}
          <div>
            <span className="text-gray-500">Rate: </span>
            <span className="font-medium text-gray-900">
              {completionRate}%
            </span>
          </div>
          
          {/* Current streak */}
          <div>
            <span className="text-gray-500">Streak: </span>
            <span className="font-medium text-gray-900">
              {currentStreak}
            </span>
          </div>
        </div>

        {/* Achievement count */}
        {showDetails && (
          <div className="text-xs text-gray-500">
            {stats.totalEntries} total entries
          </div>
        )}
      </div>

      {/* Today's status and actions */}
      {showDetails && (
        <div data-testid="today-status" className="mb-3 p-2 bg-gray-50 rounded text-sm">
          <span className="text-gray-600">Today: </span>
          <span className={completedToday ? 'text-green-600 font-medium' : 'text-gray-500'}>
            {completedToday ? 'Completed' : 'Not completed'}
          </span>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="text-xs"
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-xs text-red-600 hover:text-red-700"
          >
            Delete
          </Button>
        </div>

        {/* Complete/Undo button */}
        <div>
          {!completedToday ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleComplete}
              className="text-xs"
            >
              Complete
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {/* TODO: Implement undo */}}
              className="text-xs"
            >
              Undo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}