'use client';

import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';

export type InputSize = 'sm' | 'md' | 'lg';

export interface NeumorphicInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-5 py-3.5 text-lg',
};

const roundedMap = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};

export const NeumorphicInput = forwardRef<HTMLInputElement, NeumorphicInputProps>(
  (
    {
      className,
      size = 'md',
      rounded = 'xl',
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    // 凹陷阴影
    const insetShadow = `
      inset 4px 4px 8px var(--neu-shadow, rgba(174, 174, 192, 0.4)),
      inset -4px -4px 8px var(--neu-light, rgba(255, 255, 255, 0.8))
    `;

    // 聚焦时的光晕效果
    const focusGlow = `
      inset 4px 4px 8px var(--neu-shadow, rgba(174, 174, 192, 0.4)),
      inset -4px -4px 8px var(--neu-light, rgba(255, 255, 255, 0.8)),
      0 0 0 3px rgba(59, 130, 246, 0.3)
    `;

    // 错误状态光晕
    const errorGlow = `
      inset 4px 4px 8px var(--neu-shadow, rgba(174, 174, 192, 0.4)),
      inset -4px -4px 8px var(--neu-light, rgba(255, 255, 255, 0.8)),
      0 0 0 3px rgba(239, 68, 68, 0.3)
    `;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
            {label}
          </label>
        )}

        {/* Input container */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              // 基础样式
              'w-full bg-neu-base dark:bg-neu-base-dark',
              'text-gray-800 dark:text-gray-200',
              'placeholder:text-gray-400 dark:placeholder:text-gray-500',
              'transition-all duration-200 ease-out',
              'focus:outline-none',
              // 尺寸
              sizeStyles[size],
              roundedMap[rounded],
              // 图标padding
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              // 禁用状态
              disabled && 'opacity-50 cursor-not-allowed',
              // 错误状态
              error && 'text-red-600 dark:text-red-400',
              className
            )}
            style={{
              boxShadow: error ? errorGlow : isFocused ? focusGlow : insetShadow,
            }}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <span className="text-xs text-red-500 dark:text-red-400 ml-1">{error}</span>
        )}

        {/* Helper text */}
        {helperText && !error && (
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{helperText}</span>
        )}
      </div>
    );
  }
);

NeumorphicInput.displayName = 'NeumorphicInput';
