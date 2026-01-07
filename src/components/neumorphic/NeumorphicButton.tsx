'use client';

import { forwardRef, ButtonHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
export type ButtonVariant = 'default' | 'primary' | 'success' | 'danger' | 'warning';

export interface NeumorphicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-2.5',
  xl: 'px-8 py-4 text-xl gap-3',
};

const roundedMap = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};

const variantStyles = {
  default: 'text-gray-700 dark:text-gray-200',
  primary: 'text-primary-600 dark:text-primary-400',
  success: 'text-green-600 dark:text-green-400',
  danger: 'text-red-600 dark:text-red-400',
  warning: 'text-amber-600 dark:text-amber-400',
};

export const NeumorphicButton = forwardRef<HTMLButtonElement, NeumorphicButtonProps>(
  (
    {
      className,
      children,
      size = 'md',
      variant = 'default',
      rounded = 'xl',
      fullWidth = false,
      loading = false,
      disabled = false,
      icon,
      iconPosition = 'left',
      ...props
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = useState(false);

    const isDisabled = disabled || loading;

    // 凸起阴影
    const raisedShadow = `
      6px 6px 12px var(--neu-shadow, rgba(174, 174, 192, 0.4)),
      -6px -6px 12px var(--neu-light, rgba(255, 255, 255, 0.8))
    `;

    // 凹陷阴影
    const insetShadow = `
      inset 4px 4px 8px var(--neu-shadow, rgba(174, 174, 192, 0.4)),
      inset -4px -4px 8px var(--neu-light, rgba(255, 255, 255, 0.8))
    `;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // 基础样式
          'relative inline-flex items-center justify-center font-medium',
          'bg-neu-base dark:bg-neu-base-dark',
          'transition-all duration-150 ease-out',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          // 尺寸
          sizeStyles[size],
          roundedMap[rounded],
          // 变体颜色
          variantStyles[variant],
          // 宽度
          fullWidth && 'w-full',
          // 禁用状态
          isDisabled && 'opacity-50 cursor-not-allowed',
          !isDisabled && 'cursor-pointer active:scale-[0.98]',
          className
        )}
        style={{
          boxShadow: isPressed && !isDisabled ? insetShadow : raisedShadow,
        }}
        onMouseDown={() => !isDisabled && setIsPressed(true)}
        onMouseUp={() => !isDisabled && setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => !isDisabled && setIsPressed(true)}
        onTouchEnd={() => !isDisabled && setIsPressed(false)}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <svg
            className="animate-spin h-4 w-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {/* Icon left */}
        {icon && iconPosition === 'left' && !loading && (
          <span className="flex-shrink-0">{icon}</span>
        )}

        {/* Content */}
        <span>{children}</span>

        {/* Icon right */}
        {icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

NeumorphicButton.displayName = 'NeumorphicButton';
