'use client';

import React, { useState, useEffect } from 'react';
import { Habit, HabitFrequency, HabitCategory } from '@/lib/types';
import Button from '@/components/ui/Button';

interface EditHabitModalProps {
  habit: Habit | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedHabit: Habit) => void;
}

const CATEGORIES: HabitCategory[] = ['health', 'fitness', 'productivity', 'learning', 'social', 'mindfulness', 'creative', 'other'];
const FREQUENCIES: HabitFrequency[] = ['daily', 'weekly', 'monthly', 'custom'];

const categoryEmojis: Record<HabitCategory, string> = {
  health: '🏥',
  fitness: '💪',
  productivity: '📈',
  learning: '📚',
  social: '👥',
  mindfulness: '🧘',
  creative: '�',
  other: '⚡'
};

const frequencyLabels: Record<HabitFrequency, string> = {
  daily: 'Daily',
  weekly: 'Weekly', 
  monthly: 'Monthly',
  custom: 'Custom'
};

export function EditHabitModal({ habit, isOpen, onClose, onSave }: EditHabitModalProps) {
  const [formData, setFormData] = useState<Partial<Habit>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (habit) {
      setFormData({
        name: habit.name,
        description: habit.description,
        category: habit.category,
        frequency: habit.frequency,
        targetValue: habit.targetValue,
        unit: habit.unit,
        isActive: habit.isActive
      });
      setErrors({});
    }
  }, [habit]);

  if (!isOpen || !habit) return null;

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Habit name is required';
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    if (!formData.frequency) {
      newErrors.frequency = 'Please select a frequency';
    }
    if (!formData.targetValue || formData.targetValue <= 0) {
      newErrors.targetValue = 'Target value must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const updatedHabit: Habit = {
      ...habit,
      name: formData.name!.trim(),
      description: formData.description?.trim() || '',
      category: formData.category!,
      frequency: formData.frequency!,
      targetValue: formData.targetValue!,
      unit: formData.unit?.trim() || '',
      isActive: formData.isActive ?? true,
      updatedAt: new Date()
    };

    onSave(updatedHabit);
    onClose();
  };

  const handleChange = (field: keyof Habit, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        role="button"
        tabIndex={0}
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit Habit
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Habit Name */}
            <div>
              <label htmlFor="habit-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Habit Name *
              </label>
              <input
                id="habit-name"
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter habit name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="habit-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="habit-description"
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Describe your habit (optional)"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="habit-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                id="habit-category"
                value={formData.category || ''}
                onChange={(e) => handleChange('category', e.target.value as HabitCategory)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {categoryEmojis[category]} {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {/* Frequency */}
            <div>
              <label htmlFor="habit-frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Frequency *
              </label>
              <select
                id="habit-frequency"
                value={formData.frequency || ''}
                onChange={(e) => handleChange('frequency', e.target.value as HabitFrequency)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.frequency ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select frequency</option>
                {FREQUENCIES.map(frequency => (
                  <option key={frequency} value={frequency}>
                    {frequencyLabels[frequency]}
                  </option>
                ))}
              </select>
              {errors.frequency && (
                <p className="mt-1 text-sm text-red-600">{errors.frequency}</p>
              )}
            </div>

            {/* Target Value and Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="habit-target" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Value *
                </label>
                <input
                  id="habit-target"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={formData.targetValue || ''}
                  onChange={(e) => handleChange('targetValue', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.targetValue ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.targetValue && (
                  <p className="mt-1 text-sm text-red-600">{errors.targetValue}</p>
                )}
              </div>
              <div>
                <label htmlFor="habit-unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Unit
                </label>
                <input
                  id="habit-unit"
                  type="text"
                  value={formData.unit || ''}
                  onChange={(e) => handleChange('unit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g. minutes, glasses"
                />
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive ?? true}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Habit is active
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}