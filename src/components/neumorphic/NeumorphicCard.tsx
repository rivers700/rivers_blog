'use client';

import { forwardRef, HTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';

export type NeumorphicVariant = 'raised' | 'inset' | 'flat';

export interface NeumorphicCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: NeumorphicVariant;
  pressable?: boolean;
  hoverable?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  lightColor?: string;
  shadowColor?: string;
  intensity?: 'soft' | 'medium' | 'strong';
}

const roundedMap = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
};

export const NeumorphicCard = forwardRef<HTMLDivElement, NeumorphicCardProps>(
  (
    {
      className,
      children,
      variant = 'raised',
      pressable = false,
      hoverable = true,
      rounded = '2xl',
      lightColor,
      shadowColor,
      intensity = 'medium',
      style,
      ...props
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = useState(false);

    // 阴影强度配置
    const intensityConfig = {
      soft: { offset: 4, blur: 8 },
      medium: { offset: 6, blur: 12 },
      strong: { offset: 10, blur: 20 },
    };

    const { offset, blur } = intensityConfig[intensity];

    // 生成新拟态阴影样式
    const getNeumorphicStyle = () => {
      const light = lightColor || 'rgba(255, 255, 255, 0.8)';
      const shadow = shadowColor || 'rgba(174, 174, 192, 0.4)';
      const darkLight = 'rgba(255, 255, 255, 0.05)';
      const darkShadow = 'rgba(0, 0, 0, 0.5)';

      const currentVariant = pressable && isPressed ? 'inset' : variant;

      if (currentVariant === 'raised') {
        return {
          boxShadow: `${offset}px ${offset}px ${blur}px var(--neu-shadow, ${shadow}), 
                      -${offset}px -${offset}px ${blur}px var(--neu-light, ${light})`,
        };
      } else if (currentVariant === 'inset') {
        return {
          boxShadow: `inset ${offset}px ${offset}px ${blur}px var(--neu-shadow, ${shadow}), 
                      inset -${offset}px -${offset}px ${blur}px var(--neu-light, ${light})`,
        };
      }
      return {};
    };

    return (
      <div
        ref={ref}
        className={cn(
          // 基础样式
          'bg-neu-base dark:bg-neu-base-dark',
          'transition-all duration-200 ease-out',
          roundedMap[rounded],
          // 可悬浮效果
          hoverable && variant === 'raised' && !isPressed && 'hover:translate-y-[-2px]',
          // 可按压样式
          pressable && 'cursor-pointer select-none active:scale-[0.98]',
          className
        )}
        style={{
          ...getNeumorphicStyle(),
          ...style,
        }}
        onMouseDown={() => pressable && setIsPressed(true)}
        onMouseUp={() => pressable && setIsPressed(false)}
        onMouseLeave={() => pressable && setIsPressed(false)}
        onTouchStart={() => pressable && setIsPressed(true)}
        onTouchEnd={() => pressable && setIsPressed(false)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NeumorphicCard.displayName = 'NeumorphicCard';
