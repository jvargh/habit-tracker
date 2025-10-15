'use client';

import { useState, useEffect, useMemo } from 'react';
import { HabitList } from '@/components/habits/HabitList';
import { EditHabitModal } from '@/components/habits/EditHabitModal';
import Button from '@/components/ui/Button';
import { Habit, HabitEntry, HabitStats } from '@/lib/types';
import { getSampleData, loadSampleData } from '@/lib/data/sample-data';
import { storageService } from '@/lib/storage';
import { habitUtils } from '@/lib/utils';

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [entries, setEntries] = useState<HabitEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Calculate habit statistics
  const habitsStats = useMemo(() => {
    const stats: { [key: string]: HabitStats } = {};
    habits.forEach(habit => {
      stats[habit.id] = habitUtils.calculateHabitStats(habit, entries);
    });
    return stats;
  }, [habits, entries]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Try to load existing data
      const existingHabits = await storageService.getHabits();
      const existingEntries = await storageService.getEntries();

      if (existingHabits.length === 0) {
        // No existing data, load sample data
        const sampleData = getSampleData();
        await loadSampleData();
        setHabits(sampleData.habits);
        setEntries(sampleData.entries);
      } else {
        // Use existing data
        setHabits(existingHabits);
        setEntries(existingEntries);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to sample data
      const sampleData = getSampleData();
      setHabits(sampleData.habits);
      setEntries(sampleData.entries);
    } finally {
      setLoading(false);
    }
  };

  const loadSampleDataHandler = async () => {
    setLoading(true);
    try {
      const sampleData = await loadSampleData();
      if (sampleData) {
        setHabits(sampleData.habits);
        setEntries(sampleData.entries);
      }
    } catch (error) {
      console.error('Error loading sample data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🎯 Habit Tracker
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Build better habits, one day at a time
          </p>
          
          {habits.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Welcome to Habit Tracker! 🎉
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Get started by loading some sample habits to see how the app works.
              </p>
              <Button onClick={loadSampleDataHandler}>
                Load Sample Habits
              </Button>
            </div>
          )}
        </div>

        {/* Main Content */}
        {habits.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Your Habits ({habits.filter(h => h.isActive).length} active)
              </h2>
              <Button 
                variant="outline"
                onClick={loadSampleDataHandler}
                className="text-sm"
              >
                Reset to Sample Data
              </Button>
            </div>
            
            <HabitList
              habits={habits}
              habitsStats={habitsStats}
              onEditHabit={async (habitToEdit: Habit) => {
                console.log('Edit habit clicked:', habitToEdit.name);
                setEditingHabit(habitToEdit);
                setIsEditModalOpen(true);
              }}
              onDeleteHabit={async (habitId: string) => {
                const habitToDelete = habits.find(h => h.id === habitId);
                console.log('Delete habit clicked:', habitToDelete?.name);
                
                if (confirm(`Are you sure you want to delete "${habitToDelete?.name}"?`)) {
                  const newHabits = habits.filter(h => h.id !== habitId);
                  setHabits(newHabits);
                  await storageService.deleteHabit(habitId);
                  console.log('Habit deleted successfully');
                }
              }}
              onCompleteHabit={async (habitId: string, value: number) => {
                const habitToComplete = habits.find(h => h.id === habitId);
                console.log('Complete habit clicked:', habitToComplete?.name, 'with value:', value);
                
                // Create a new entry for this completion
                const newEntry: HabitEntry = {
                  id: `entry-${habitId}-${Date.now()}`,
                  habitId: habitId,
                  date: new Date(),
                  value: value,
                  completed: true,
                  createdAt: new Date()
                };
                const newEntries = [...entries, newEntry];
                setEntries(newEntries);
                await storageService.saveEntry(newEntry);
                
                // Show success feedback
                alert(`✅ Completed: ${habitToComplete?.name}\nValue: ${value} ${habitToComplete?.unit || ''}`);
                console.log('Habit completed successfully', newEntry);
              }}
            />
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 dark:text-gray-400">
          <p className="text-sm">
            SpecKit Habit Tracker - Built with Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>

      {/* Edit Habit Modal */}
      <EditHabitModal
        habit={editingHabit}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingHabit(null);
        }}
        onSave={async (updatedHabit: Habit) => {
          try {
            // Update habits state
            const newHabits = habits.map(h => 
              h.id === updatedHabit.id ? updatedHabit : h
            );
            setHabits(newHabits);
            
            // Save to storage
            await storageService.saveHabit(updatedHabit);
            
            console.log('Habit updated successfully:', updatedHabit.name);
            
            // Show success feedback
            alert(`✅ Updated: ${updatedHabit.name}`);
          } catch (error) {
            console.error('Error updating habit:', error);
            alert('❌ Failed to update habit. Please try again.');
          }
        }}
      />
    </div>
  );
}
