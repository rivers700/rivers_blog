'use client';

import { forwardRef, useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface NeumorphicSliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  className?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  trackColor?: string;
  thumbColor?: string;
}

const sizeConfig = {
  sm: { track: 'h-2', thumb: 'w-4 h-4' },
  md: { track: 'h-3', thumb: 'w-5 h-5' },
  lg: { track: 'h-4', thumb: 'w-6 h-6' },
};

export const NeumorphicSlider = forwardRef<HTMLDivElement, NeumorphicSliderProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      min = 0,
      max = 100,
      step = 1,
      disabled = false,
      onChange,
      onChangeEnd,
      className,
      showValue = false,
      size = 'md',
      trackColor,
      thumbColor,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [isDragging, setIsDragging] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);

    const value = controlledValue ?? internalValue;
    const percentage = ((value - min) / (max - min)) * 100;

    const { track: trackSize, thumb: thumbSize } = sizeConfig[size];

    // 凹陷轨道阴影
    const trackShadow = `
      inset 3px 3px 6px var(--neu-shadow, rgba(174, 174, 192, 0.5)),
      inset -3px -3px 6px var(--neu-light, rgba(255, 255, 255, 0.9))
    `;

    // 凸起滑块阴影
    const thumbShadow = `
      4px 4px 8px var(--neu-shadow, rgba(174, 174, 192, 0.5)),
      -4px -4px 8px var(--neu-light, rgba(255, 255, 255, 0.9))
    `;

    // 按下时滑块阴影
    const thumbPressedShadow = `
      2px 2px 4px var(--neu-shadow, rgba(174, 174, 192, 0.5)),
      -2px -2px 4px var(--neu-light, rgba(255, 255, 255, 0.9))
    `;

    const updateValue = useCallback(
      (clientX: number) => {
        if (!trackRef.current || disabled) return;

        const rect = trackRef.current.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const rawValue = min + percent * (max - min);
        const steppedValue = Math.round(rawValue / step) * step;
        const clampedValue = Math.max(min, Math.min(max, steppedValue));

        setInternalValue(clampedValue);
        onChange?.(clampedValue);
      },
      [min, max, step, disabled, onChange]
    );

    const handleMouseDown = (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      setIsDragging(true);
      updateValue(e.clientX);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
      if (disabled) return;
      setIsDragging(true);
      updateValue(e.touches[0].clientX);
    };

    useEffect(() => {
      if (!isDragging) return;

      const handleMouseMove = (e: MouseEvent) => {
        updateValue(e.clientX);
      };

      const handleTouchMove = (e: TouchEvent) => {
        updateValue(e.touches[0].clientX);
      };

      const handleEnd = () => {
        setIsDragging(false);
        onChangeEnd?.(value);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleEnd);
      };
    }, [isDragging, updateValue, onChangeEnd, value]);

    return (
      <div ref={ref} className={cn('flex items-center gap-4', className)}>
        {/* Track */}
        <div
          ref={trackRef}
          className={cn(
            'relative flex-1 rounded-full bg-neu-base dark:bg-neu-base-dark',
            trackSize,
            disabled && 'opacity-50 cursor-not-allowed',
            !disabled && 'cursor-pointer'
          )}
          style={{ boxShadow: trackShadow }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Fill */}
          <div
            className={cn(
              'absolute top-0 left-0 h-full rounded-full transition-all duration-75',
              trackColor || 'bg-primary-400 dark:bg-primary-500'
            )}
            style={{ width: `${percentage}%` }}
          />

          {/* Thumb */}
          <div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full',
              'bg-neu-base dark:bg-neu-base-dark',
              'transition-shadow duration-150',
              thumbSize,
              thumbColor,
              !disabled && 'hover:scale-110'
            )}
            style={{
              left: `${percentage}%`,
              boxShadow: isDragging ? thumbPressedShadow : thumbShadow,
            }}
          />
        </div>

        {/* Value display */}
        {showValue && (
          <span className="min-w-[3ch] text-sm font-medium text-gray-600 dark:text-gray-400 tabular-nums">
            {value}
          </span>
        )}
      </div>
    );
  }
);

NeumorphicSlider.displayName = 'NeumorphicSlider';
