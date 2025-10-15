import { test, expect, Page } from '@playwright/test';

test.describe('Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test.describe('Dashboard Loading and Display', () => {
    test('should load dashboard and display habits', async ({ page }) => {
      // Check that the main dashboard elements are present
      await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
      
      // Should show either habits or empty state
      const habitsExist = await page.locator('[data-testid="habit-list"]').isVisible();
      const emptyState = await page.locator('[data-testid="empty-dashboard"]').isVisible();
      
      expect(habitsExist || emptyState).toBeTruthy();
    });

    test('should display dashboard statistics section', async ({ page }) => {
      await expect(page.locator('[data-testid="dashboard-stats"]')).toBeVisible();
      
      // Check for key stat elements
      await expect(page.locator('text=Total Habits')).toBeVisible();
      await expect(page.locator('text=Completion Rate')).toBeVisible();
      await expect(page.locator('text=Current Streaks')).toBeVisible();
    });

    test('should show loading state initially', async ({ page }) => {
      // Reload page to catch loading state
      await page.reload();
      
      // Should briefly show loading indicator
      const loadingIndicator = page.locator('[data-testid="dashboard-loading"]');
      
      // Loading state should appear and then disappear
      await expect(loadingIndicator).toBeVisible();
      await expect(loadingIndicator).toBeHidden({ timeout: 5000 });
    });
  });

  test.describe('Empty State', () => {
    test('should display empty state when no habits exist', async ({ page }) => {
      // Clear localStorage to ensure no habits exist
      await page.evaluate(() => {
        localStorage.clear();
      });
      
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Should show empty state
      await expect(page.locator('[data-testid="empty-dashboard"]')).toBeVisible();
      await expect(page.locator('text=No habits yet')).toBeVisible();
      await expect(page.locator('button:has-text("Create Your First Habit")')).toBeVisible();
    });

    test('should navigate to habit creation from empty state', async ({ page }) => {
      // Clear localStorage
      await page.evaluate(() => {
        localStorage.clear();
      });
      
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Click create habit button
      await page.locator('button:has-text("Create Your First Habit")').click();
      
      // Should navigate to habit creation (or open modal)
      const createHabitModal = page.locator('[data-testid="create-habit-modal"]');
      const createHabitPage = page.locator('[data-testid="create-habit-page"]');
      
      const modalVisible = await createHabitModal.isVisible();
      const pageVisible = await createHabitPage.isVisible();
      
      expect(modalVisible || pageVisible).toBeTruthy();
    });
  });

  test.describe('Habit Display', () => {
    test.beforeEach(async ({ page }) => {
      // Setup sample data
      await setupSampleHabits(page);
    });

    test('should display all active habits', async ({ page }) => {
      await expect(page.locator('[data-testid="habit-list"]')).toBeVisible();
      
      // Should show habit cards
      const habitCards = page.locator('[data-testid="habit-card"]');
      await expect(habitCards).toHaveCount(3); // Assuming 3 sample habits
      
      // Check that habit names are displayed
      await expect(page.locator('text=Drink Water')).toBeVisible();
      await expect(page.locator('text=Morning Exercise')).toBeVisible();
      await expect(page.locator('text=Read Daily')).toBeVisible();
    });

    test('should show habit completion status', async ({ page }) => {
      const habitCards = page.locator('[data-testid="habit-card"]');
      
      // Each habit card should show completion status
      for (let i = 0; i < await habitCards.count(); i++) {
        const card = habitCards.nth(i);
        
        // Should show either complete button or completion indicator
        const completeButton = card.locator('button:has-text("Complete")');
        const completionIndicator = card.locator('[data-testid="completion-indicator"]');
        
        const hasCompleteButton = await completeButton.isVisible();
        const hasCompletionIndicator = await completionIndicator.isVisible();
        
        expect(hasCompleteButton || hasCompletionIndicator).toBeTruthy();
      }
    });

    test('should display habit statistics', async ({ page }) => {
      const habitCards = page.locator('[data-testid="habit-card"]');
      const firstCard = habitCards.first();
      
      // Each habit should show statistics
      await expect(firstCard.locator('text=/\\d+%/')).toBeVisible(); // Completion percentage
      await expect(firstCard.locator('text=/\\d+ day streak/')).toBeVisible(); // Streak info
    });
  });

  test.describe('Habit Interactions', () => {
    test.beforeEach(async ({ page }) => {
      await setupSampleHabits(page);
    });

    test('should complete a habit when complete button is clicked', async ({ page }) => {
      const habitCard = page.locator('[data-testid="habit-card"]').first();
      const completeButton = habitCard.locator('button:has-text("Complete")');
      
      // Skip if habit is already completed
      if (await completeButton.isVisible()) {
        await completeButton.click();
        
        // Should show success feedback
        await expect(page.locator('text=Habit completed')).toBeVisible({ timeout: 3000 });
        
        // Complete button should change to completion indicator
        await expect(completeButton).toBeHidden();
        await expect(habitCard.locator('[data-testid="completion-indicator"]')).toBeVisible();
      }
    });

    test('should open habit edit dialog when edit is clicked', async ({ page }) => {
      const habitCard = page.locator('[data-testid="habit-card"]').first();
      
      // Click edit button (might be in dropdown or directly visible)
      await habitCard.hover();
      const editButton = habitCard.locator('button:has-text("Edit")');
      
      if (await editButton.isVisible()) {
        await editButton.click();
        
        // Should open edit dialog
        await expect(page.locator('[data-testid="edit-habit-modal"]')).toBeVisible();
      }
    });

    test('should navigate between different sections', async ({ page }) => {
      // Test navigation if there are different dashboard sections
      const navigationItems = page.locator('[data-testid="dashboard-nav"] a');
      
      if (await navigationItems.count() > 0) {
        // Click on different sections
        await navigationItems.first().click();
        await page.waitForLoadState('networkidle');
        
        // Should update the displayed content
        await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible();
      }
    });
  });

  test.describe('Charts and Analytics', () => {
    test.beforeEach(async ({ page }) => {
      await setupSampleHabits(page);
      await setupSampleEntries(page);
    });

    test('should display weekly progress chart', async ({ page }) => {
      await expect(page.locator('[data-testid="weekly-chart"]')).toBeVisible();
      
      // Chart should have data points
      const chartContainer = page.locator('[data-testid="weekly-chart"]');
      await expect(chartContainer.locator('svg, canvas')).toBeVisible(); // Recharts uses SVG
    });

    test('should display progress trends', async ({ page }) => {
      await expect(page.locator('[data-testid="progress-chart"]')).toBeVisible();
      
      // Should show trend data
      const trendChart = page.locator('[data-testid="progress-chart"]');
      await expect(trendChart).toBeVisible();
    });

    test('should handle empty chart data gracefully', async ({ page }) => {
      // Clear all entries
      await page.evaluate(() => {
        const data = JSON.parse(localStorage.getItem('habit-tracker-data') || '{}');
        data.entries = [];
        localStorage.setItem('habit-tracker-data', JSON.stringify(data));
      });
      
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Charts should still render but show empty state
      await expect(page.locator('[data-testid="weekly-chart"]')).toBeVisible();
      await expect(page.locator('text=No data available')).toBeVisible();
    });
  });

  test.describe('Achievements', () => {
    test.beforeEach(async ({ page }) => {
      await setupSampleHabits(page);
      await setupAchievements(page);
    });

    test('should display achievements section', async ({ page }) => {
      await expect(page.locator('[data-testid="achievements-section"]')).toBeVisible();
      
      // Should show achievement badges
      const achievementBadges = page.locator('[data-testid="achievement-badge"]');
      const badgeCount = await achievementBadges.count();
      expect(badgeCount).toBeGreaterThan(0);
    });

    test('should show achievement details on hover/click', async ({ page }) => {
      const achievementBadge = page.locator('[data-testid="achievement-badge"]').first();
      
      if (await achievementBadge.isVisible()) {
        await achievementBadge.hover();
        
        // Should show achievement tooltip or details
        await expect(page.locator('[data-testid="achievement-tooltip"]')).toBeVisible();
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
      
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Dashboard should still be functional
      await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
      
      // Navigation should be mobile-friendly
      const mobileNav = page.locator('[data-testid="mobile-navigation"]');
      if (await mobileNav.isVisible()) {
        await expect(mobileNav).toBeVisible();
      }
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad size
      
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Should adapt layout for tablet
      await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
      
      // Habit cards should be arranged appropriately
      const habitList = page.locator('[data-testid="habit-list"]');
      if (await habitList.isVisible()) {
        await expect(habitList).toBeVisible();
      }
    });
  });

  test.describe('Performance', () => {
    test('should load dashboard within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should handle scrolling with many habits smoothly', async ({ page }) => {
      // Setup many habits
      await setupManyHabits(page, 50);
      
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Scroll through the list
      const habitList = page.locator('[data-testid="habit-list"]');
      
      if (await habitList.isVisible()) {
        // Perform smooth scrolling
        await habitList.hover();
        
        for (let i = 0; i < 5; i++) {
          await page.mouse.wheel(0, 200);
          await page.waitForTimeout(100);
        }
        
        // Page should remain responsive
        await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
      }
    });
  });
});

// Helper functions for test setup
async function setupSampleHabits(page: Page) {
  await page.evaluate(() => {
    const sampleHabits = [
      {
        id: 'habit-1',
        name: 'Drink Water',
        description: 'Drink 8 glasses of water daily',
        category: 'health',
        frequency: 'daily',
        targetValue: 8,
        unit: 'glasses',
        color: 'blue',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'habit-2',
        name: 'Morning Exercise',
        description: '30 minutes of morning workout',
        category: 'fitness',
        frequency: 'daily',
        targetValue: 30,
        unit: 'minutes',
        color: 'green',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'habit-3',
        name: 'Read Daily',
        description: 'Read for personal development',
        category: 'learning',
        frequency: 'daily',
        targetValue: 20,
        unit: 'minutes',
        color: 'purple',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    const data = {
      habits: sampleHabits,
      entries: [],
      achievements: []
    };

    localStorage.setItem('habit-tracker-data', JSON.stringify(data));
  });
}

async function setupSampleEntries(page: Page) {
  await page.evaluate(() => {
    const data = JSON.parse(localStorage.getItem('habit-tracker-data') || '{}');
    const today = new Date();
    
    // Create entries for the last 7 days
    const entries: any[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      data.habits.forEach((habit: any, habitIndex: number) => {
        entries.push({
          id: `entry-${habit.id}-${i}`,
          habitId: habit.id,
          date: date.toISOString(),
          value: habit.targetValue,
          completed: Math.random() > 0.3, // 70% completion rate
          createdAt: date.toISOString()
        });
      });
    }
    
    data.entries = entries;
    localStorage.setItem('habit-tracker-data', JSON.stringify(data));
  });
}

async function setupAchievements(page: Page) {
  await page.evaluate(() => {
    const data = JSON.parse(localStorage.getItem('habit-tracker-data') || '{}');
    
    data.achievements = [
      {
        id: 'achievement-1',
        type: 'streak',
        title: '7-Day Streak',
        description: 'Complete a habit for 7 days in a row',
        unlockedAt: new Date().toISOString(),
        habitId: 'habit-1'
      }
    ];
    
    localStorage.setItem('habit-tracker-data', JSON.stringify(data));
  });
}

async function setupManyHabits(page: Page, count: number) {
  await page.evaluate((habitCount) => {
    const habits = [];
    
    for (let i = 0; i < habitCount; i++) {
      habits.push({
        id: `habit-${i}`,
        name: `Habit ${i + 1}`,
        description: `Description for habit ${i + 1}`,
        category: ['health', 'fitness', 'learning', 'productivity'][i % 4],
        frequency: 'daily',
        targetValue: 1,
        unit: 'time',
        color: ['blue', 'green', 'purple', 'orange', 'red'][i % 5],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    const data = {
      habits,
      entries: [],
      achievements: []
    };

    localStorage.setItem('habit-tracker-data', JSON.stringify(data));
  }, count);
}