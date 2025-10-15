import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { BaseComponentProps } from '@/lib/types';

interface InputProps extends BaseComponentProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className = '', 
    label,
    error,
    helperText,
    size = 'md', 
    fullWidth = false,
    startIcon,
    endIcon,
    type = 'text',
    id,
    disabled,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    
    const baseClasses = 'flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
    
    const sizes = {
      sm: 'h-8 text-xs',
      md: 'h-10',
      lg: 'h-12 text-base'
    };

    const errorClasses = error ? 'border-destructive focus-within:ring-destructive' : '';
    const widthClasses = fullWidth ? 'w-full' : '';
    
    const containerClasses = [
      baseClasses,
      sizes[size],
      errorClasses,
      widthClasses,
      disabled ? 'opacity-50' : '',
      className
    ].filter(Boolean).join(' ');

    const inputClasses = 'flex-1 bg-transparent outline-none placeholder:text-muted-foreground';
    
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const actualType = type === 'password' && showPassword ? 'text' : type;

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground mb-2"
          >
            {label}
          </label>
        )}
        
        <div className={containerClasses}>
          {startIcon && (
            <div className="flex items-center pr-2 text-muted-foreground">
              {startIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            type={actualType}
            className={inputClasses}
            disabled={disabled}
            {...props}
          />
          
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex items-center pl-2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          )}
          
          {endIcon && type !== 'password' && (
            <div className="flex items-center pl-2 text-muted-foreground">
              {endIcon}
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <p className={`mt-2 text-sm ${error ? 'text-destructive' : 'text-muted-foreground'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;