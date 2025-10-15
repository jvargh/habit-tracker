import { AppError } from '@/lib/types';

/**
 * Error handling utilities and user feedback system
 */

// Error Types
export class HabitTrackerError extends Error {
  constructor(
    message: string,
    public type: 'validation' | 'storage' | 'network' | 'unknown' = 'unknown',
    public details?: any
  ) {
    super(message);
    this.name = 'HabitTrackerError';
  }
}

export class ValidationError extends Error {
  constructor(
    public field: string,
    message: string,
    public code: string = 'VALIDATION_ERROR'
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class StorageError extends Error {
  constructor(message: string, public operation: string) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * Error logging service
 */
class ErrorLogger {
  private errors: AppError[] = [];

  /**
   * Log error for debugging and analytics
   */
  logError(error: Error | AppError, context?: any): void {
    const appError: AppError = {
      type: this.getErrorType(error),
      message: error.message,
      details: {
        stack: 'stack' in error ? error.stack : undefined,
        context,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined
      },
      timestamp: new Date()
    };

    this.errors.push(appError);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Habit Tracker Error:', appError);
    }

    // In production, you might want to send to analytics service
    this.sendToAnalytics(appError);
  }

  /**
   * Get recent errors for debugging
   */
  getRecentErrors(limit: number = 10): AppError[] {
    return this.errors.slice(-limit);
  }

  /**
   * Clear error log
   */
  clearErrors(): void {
    this.errors = [];
  }

  /**
   * Determine error type from error instance
   */
  private getErrorType(error: Error | AppError): AppError['type'] {
    // If it's already an AppError, return its type
    if ('type' in error && typeof error.type === 'string') {
      return error.type as AppError['type'];
    }
    
    // If it's an Error instance, determine type
    if (error instanceof ValidationError) return 'validation';
    if (error instanceof StorageError) return 'storage';
    if (error.message.includes('fetch') || error.message.includes('network')) return 'network';
    return 'unknown';
  }

  /**
   * Send error to analytics service (placeholder)
   */
  private sendToAnalytics(error: AppError): void {
    // In a real app, send to your analytics service
    // Example: analytics.track('error', error);
  }
}

// Global error logger instance
export const errorLogger = new ErrorLogger();

/**
 * User notification system for feedback
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
  timestamp: Date;
}

class NotificationManager {
  private notifications: Notification[] = [];
  private listeners: Array<(notifications: Notification[]) => void> = [];
  private idCounter = 0;

  /**
   * Show a notification to the user
   */
  show(
    type: NotificationType,
    title: string,
    message: string,
    options: {
      duration?: number;
      persistent?: boolean;
      actions?: Array<{ label: string; action: () => void }>;
    } = {}
  ): string {
    const notification: Notification = {
      id: `notification-${++this.idCounter}`,
      type,
      title,
      message,
      duration: options.duration ?? (type === 'error' ? 5000 : 3000),
      persistent: options.persistent ?? false,
      actions: options.actions,
      timestamp: new Date()
    };

    this.notifications.push(notification);
    this.notifyListeners();

    // Auto-remove non-persistent notifications
    if (!notification.persistent && notification.duration) {
      setTimeout(() => {
        this.remove(notification.id);
      }, notification.duration);
    }

    return notification.id;
  }

  /**
   * Remove a notification
   */
  remove(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  /**
   * Clear all notifications
   */
  clear(): void {
    this.notifications = [];
    this.notifyListeners();
  }

  /**
   * Get all current notifications
   */
  getAll(): Notification[] {
    return [...this.notifications];
  }

  /**
   * Subscribe to notification changes
   */
  subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners of changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      listener([...this.notifications]);
    });
  }
}

// Global notification manager instance
export const notificationManager = new NotificationManager();

/**
 * Convenient notification methods
 */
export const notify = {
  success: (title: string, message: string, options?: any) =>
    notificationManager.show('success', title, message, options),
  
  error: (title: string, message: string, options?: any) =>
    notificationManager.show('error', title, message, options),
  
  warning: (title: string, message: string, options?: any) =>
    notificationManager.show('warning', title, message, options),
  
  info: (title: string, message: string, options?: any) =>
    notificationManager.show('info', title, message, options),
};

/**
 * Error boundary configuration for React components
 * Use with react-error-boundary library in actual components
 */
export interface ErrorBoundaryConfig {
  fallbackComponent?: string | null;
  onError?: (error: Error, errorInfo: any) => void;
  resetOnPropsChange?: boolean;
}

/**
 * Get error boundary configuration
 */
export function getErrorBoundaryConfig(
  componentName?: string
): ErrorBoundaryConfig {
  return {
    fallbackComponent: 'ErrorFallback',
    onError: (error: Error, errorInfo: any) => {
      errorLogger.logError(error, { 
        component: componentName,
        errorInfo 
      });
      notify.error(
        'Something went wrong',
        'An unexpected error occurred. Please try again.',
        { persistent: true }
      );
    },
    resetOnPropsChange: true
  };
}

/**
 * Async error handler wrapper
 */
export function handleAsyncError<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      errorLogger.logError(error as Error, { function: fn.name, args });
      
      if (error instanceof ValidationError) {
        notify.warning('Validation Error', error.message);
      } else if (error instanceof StorageError) {
        notify.error('Storage Error', 'Unable to save data. Please try again.');
      } else {
        notify.error('Error', 'An unexpected error occurred. Please try again.');
      }
      
      return null;
    }
  };
}

/**
 * Field validation utilities
 */
export class FieldValidator {
  private errors: ValidationError[] = [];

  /**
   * Validate required field
   */
  required(value: any, field: string, message?: string): this {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      this.errors.push(new ValidationError(
        field,
        message || `${field} is required`,
        'REQUIRED'
      ));
    }
    return this;
  }

  /**
   * Validate minimum length
   */
  minLength(value: string, minLength: number, field: string, message?: string): this {
    if (value && value.length < minLength) {
      this.errors.push(new ValidationError(
        field,
        message || `${field} must be at least ${minLength} characters`,
        'MIN_LENGTH'
      ));
    }
    return this;
  }

  /**
   * Validate maximum length
   */
  maxLength(value: string, maxLength: number, field: string, message?: string): this {
    if (value && value.length > maxLength) {
      this.errors.push(new ValidationError(
        field,
        message || `${field} must be no more than ${maxLength} characters`,
        'MAX_LENGTH'
      ));
    }
    return this;
  }

  /**
   * Validate minimum value
   */
  min(value: number, minValue: number, field: string, message?: string): this {
    if (typeof value === 'number' && value < minValue) {
      this.errors.push(new ValidationError(
        field,
        message || `${field} must be at least ${minValue}`,
        'MIN_VALUE'
      ));
    }
    return this;
  }

  /**
   * Validate maximum value
   */
  max(value: number, maxValue: number, field: string, message?: string): this {
    if (typeof value === 'number' && value > maxValue) {
      this.errors.push(new ValidationError(
        field,
        message || `${field} must be no more than ${maxValue}`,
        'MAX_VALUE'
      ));
    }
    return this;
  }

  /**
   * Validate custom condition
   */
  custom(condition: boolean, field: string, message: string, code: string = 'CUSTOM'): this {
    if (!condition) {
      this.errors.push(new ValidationError(field, message, code));
    }
    return this;
  }

  /**
   * Get validation errors
   */
  getErrors(): ValidationError[] {
    return [...this.errors];
  }

  /**
   * Check if validation passed
   */
  isValid(): boolean {
    return this.errors.length === 0;
  }

  /**
   * Get first error for a field
   */
  getFieldError(field: string): ValidationError | undefined {
    return this.errors.find(error => error.field === field);
  }

  /**
   * Clear all errors
   */
  clear(): this {
    this.errors = [];
    return this;
  }
}

/**
 * Create a new field validator instance
 */
export function createValidator(): FieldValidator {
  return new FieldValidator();
}

/**
 * Loading state management
 */
class LoadingManager {
  private loadingStates = new Map<string, boolean>();
  private listeners: Array<(states: Map<string, boolean>) => void> = [];

  /**
   * Set loading state for an operation
   */
  setLoading(key: string, loading: boolean): void {
    this.loadingStates.set(key, loading);
    this.notifyListeners();
  }

  /**
   * Check if operation is loading
   */
  isLoading(key: string): boolean {
    return this.loadingStates.get(key) ?? false;
  }

  /**
   * Check if any operation is loading
   */
  isAnyLoading(): boolean {
    return Array.from(this.loadingStates.values()).some(loading => loading);
  }

  /**
   * Subscribe to loading state changes
   */
  subscribe(listener: (states: Map<string, boolean>) => void): () => void {
    this.listeners.push(listener);
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Clear all loading states
   */
  clear(): void {
    this.loadingStates.clear();
    this.notifyListeners();
  }

  /**
   * Notify listeners of state changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      listener(new Map(this.loadingStates));
    });
  }
}

// Global loading manager instance
export const loadingManager = new LoadingManager();

/**
 * Async operation wrapper with loading state
 */
export function withLoading<T extends any[], R>(
  key: string,
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    loadingManager.setLoading(key, true);
    try {
      const result = await fn(...args);
      return result;
    } finally {
      loadingManager.setLoading(key, false);
    }
  };
}

/**
 * Retry mechanism for failed operations
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        break;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError!;
}