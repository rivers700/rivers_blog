'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type ToggleSize = 'sm' | 'md' | 'lg';

export interface NeumorphicToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: ToggleSize;
  label?: string;
  labelPosition?: 'left' | 'right';
  onColor?: string;
  offColor?: string;
}

const sizeConfig = {
  sm: {
    track: 'w-10 h-5',
    thumb: 'w-4 h-4',
    translate: 'translate-x-5',
    padding: 'p-0.5',
  },
  md: {
    track: 'w-12 h-6',
    thumb: 'w-5 h-5',
    translate: 'translate-x-6',
    padding: 'p-0.5',
  },
  lg: {
    track: 'w-14 h-7',
    thumb: 'w-6 h-6',
    translate: 'translate-x-7',
    padding: 'p-0.5',
  },
};

export const NeumorphicToggle = forwardRef<HTMLInputElement, NeumorphicToggleProps>(
  (
    {
      className,
      size = 'md',
      label,
      labelPosition = 'right',
      disabled,
      checked,
      defaultChecked,
      onChange,
      onColor,
      offColor,
      ...props
    },
    ref
  ) => {
    const config = sizeConfig[size];

    // 轨道凹陷阴影
    const trackShadow = `
      inset 3px 3px 6px var(--neu-shadow, rgba(174, 174, 192, 0.5)),
      inset -3px -3px 6px var(--neu-light, rgba(255, 255, 255, 0.9))
    `;

    // 滑块凸起阴影
    const thumbShadow = `
      3px 3px 6px var(--neu-shadow, rgba(174, 174, 192, 0.5)),
      -3px -3px 6px var(--neu-light, rgba(255, 255, 255, 0.9))
    `;

    const toggleElement = (
      <label
        className={cn(
          'relative inline-flex items-center',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          className
        )}
      >
        {/* Hidden checkbox */}
        <input
          ref={ref}
          type="checkbox"
          className="sr-only peer"
          disabled={disabled}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          {...props}
        />

        {/* Track */}
        <div
          className={cn(
            'relative rounded-full bg-neu-base dark:bg-neu-base-dark',
            'transition-colors duration-200',
            config.track,
            config.padding,
            // 开启状态背景色
            'peer-checked:bg-primary-100 dark:peer-checked:bg-primary-900/30',
            onColor && `peer-checked:${onColor}`,
            offColor
          )}
          style={{ boxShadow: trackShadow }}
        >
          {/* Thumb */}
          <div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 left-0.5 rounded-full',
              'bg-neu-base dark:bg-neu-base-dark',
              'transition-all duration-200 ease-out',
              config.thumb,
              // 开启状态移动和颜色
              `peer-checked:${config.translate}`,
              'peer-checked:bg-primary-500 dark:peer-checked:bg-primary-400'
            )}
            style={{ boxShadow: thumbShadow }}
          />
        </div>

        {/* Focus ring */}
        <div className="absolute inset-0 rounded-full peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2" />
      </label>
    );

    if (!label) return toggleElement;

    return (
      <div className={cn('flex items-center gap-3', labelPosition === 'left' && 'flex-row-reverse')}>
        {toggleElement}
        <span
          className={cn(
            'text-sm font-medium text-gray-700 dark:text-gray-300',
            disabled && 'opacity-50'
          )}
        >
          {label}
        </span>
      </div>
    );
  }
);

NeumorphicToggle.displayName = 'NeumorphicToggle';
