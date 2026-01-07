'use client';

import { useState } from 'react';
import {
  NeumorphicCard,
  NeumorphicButton,
  NeumorphicInput,
  NeumorphicSlider,
  NeumorphicToggle,
} from '@/components/neumorphic';

export default function NeumorphicShowcase() {
  const [sliderValue, setSliderValue] = useState(50);
  const [toggleValue, setToggleValue] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="min-h-screen bg-neu-base dark:bg-neu-base-dark py-12 px-4 transition-colors">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Neumorphic UI
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            新拟态设计组件库 - 柔和的阴影、凸起与凹陷的视觉效果
          </p>
        </div>

        {/* Cards Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            卡片组件 (NeumorphicCard)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Raised Card */}
            <NeumorphicCard variant="raised" className="p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
                凸起卡片
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                默认的凸起效果，产生浮起的视觉感受
              </p>
            </NeumorphicCard>

            {/* Inset Card */}
            <NeumorphicCard variant="inset" className="p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
                凹陷卡片
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                内凹效果，适合展示输入区域
              </p>
            </NeumorphicCard>

            {/* Pressable Card */}
            <NeumorphicCard variant="raised" pressable className="p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
                可按压卡片
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                点击试试！按下时会凹陷
              </p>
            </NeumorphicCard>
          </div>

          {/* Different Intensities */}
          <h3 className="text-lg font-semibold mt-8 mb-4 text-gray-700 dark:text-gray-300">
            不同强度
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <NeumorphicCard intensity="soft" className="p-6 text-center">
              <span className="text-gray-600 dark:text-gray-400">Soft</span>
            </NeumorphicCard>
            <NeumorphicCard intensity="medium" className="p-6 text-center">
              <span className="text-gray-600 dark:text-gray-400">Medium</span>
            </NeumorphicCard>
            <NeumorphicCard intensity="strong" className="p-6 text-center">
              <span className="text-gray-600 dark:text-gray-400">Strong</span>
            </NeumorphicCard>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            按钮组件 (NeumorphicButton)
          </h2>
          
          {/* Variants */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
              变体
            </h3>
            <div className="flex flex-wrap gap-4">
              <NeumorphicButton variant="default">Default</NeumorphicButton>
              <NeumorphicButton variant="primary">Primary</NeumorphicButton>
              <NeumorphicButton variant="success">Success</NeumorphicButton>
              <NeumorphicButton variant="danger">Danger</NeumorphicButton>
              <NeumorphicButton variant="warning">Warning</NeumorphicButton>
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
              尺寸
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <NeumorphicButton size="sm">Small</NeumorphicButton>
              <NeumorphicButton size="md">Medium</NeumorphicButton>
              <NeumorphicButton size="lg">Large</NeumorphicButton>
              <NeumorphicButton size="xl">Extra Large</NeumorphicButton>
            </div>
          </div>

          {/* Rounded */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
              圆角
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <NeumorphicButton rounded="sm">Rounded SM</NeumorphicButton>
              <NeumorphicButton rounded="lg">Rounded LG</NeumorphicButton>
              <NeumorphicButton rounded="full">Rounded Full</NeumorphicButton>
            </div>
          </div>

          {/* States */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
              状态
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <NeumorphicButton loading>Loading</NeumorphicButton>
              <NeumorphicButton disabled>Disabled</NeumorphicButton>
              <NeumorphicButton
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              >
                With Icon
              </NeumorphicButton>
            </div>
          </div>
        </section>

        {/* Input Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            输入框组件 (NeumorphicInput)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Input */}
            <NeumorphicInput
              label="基础输入框"
              placeholder="请输入内容..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />

            {/* With Icons */}
            <NeumorphicInput
              label="带图标输入框"
              placeholder="搜索..."
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />

            {/* With Helper Text */}
            <NeumorphicInput
              label="帮助文本"
              placeholder="输入邮箱"
              helperText="我们不会分享您的邮箱地址"
            />

            {/* With Error */}
            <NeumorphicInput
              label="错误状态"
              placeholder="输入密码"
              error="密码长度至少8位"
              type="password"
            />

            {/* Different Sizes */}
            <NeumorphicInput
              size="sm"
              placeholder="Small 尺寸"
            />
            <NeumorphicInput
              size="lg"
              placeholder="Large 尺寸"
            />
          </div>
        </section>

        {/* Slider Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            滑块组件 (NeumorphicSlider)
          </h2>
          
          <div className="space-y-8">
            {/* Basic Slider */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                基础滑块
              </h3>
              <NeumorphicSlider
                value={sliderValue}
                onChange={setSliderValue}
                showValue
              />
            </div>

            {/* Different Sizes */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                不同尺寸
              </h3>
              <div className="space-y-6">
                <NeumorphicSlider size="sm" defaultValue={30} showValue />
                <NeumorphicSlider size="md" defaultValue={50} showValue />
                <NeumorphicSlider size="lg" defaultValue={70} showValue />
              </div>
            </div>

            {/* Custom Range */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                自定义范围 (0-10, step: 1)
              </h3>
              <NeumorphicSlider
                min={0}
                max={10}
                step={1}
                defaultValue={5}
                showValue
              />
            </div>
          </div>
        </section>

        {/* Toggle Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            开关组件 (NeumorphicToggle)
          </h2>
          
          <div className="space-y-6">
            {/* Basic Toggle */}
            <div className="flex items-center gap-8">
              <NeumorphicToggle
                label="基础开关"
                checked={toggleValue}
                onChange={(e) => setToggleValue(e.target.checked)}
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                当前状态: {toggleValue ? '开' : '关'}
              </span>
            </div>

            {/* Different Sizes */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                不同尺寸
              </h3>
              <div className="flex flex-wrap items-center gap-8">
                <NeumorphicToggle size="sm" label="Small" />
                <NeumorphicToggle size="md" label="Medium" />
                <NeumorphicToggle size="lg" label="Large" />
              </div>
            </div>

            {/* Label Position */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                标签位置
              </h3>
              <div className="flex flex-wrap items-center gap-8">
                <NeumorphicToggle label="标签在右" labelPosition="right" />
                <NeumorphicToggle label="标签在左" labelPosition="left" />
              </div>
            </div>

            {/* Disabled State */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                禁用状态
              </h3>
              <div className="flex flex-wrap items-center gap-8">
                <NeumorphicToggle label="禁用 (关)" disabled />
                <NeumorphicToggle label="禁用 (开)" disabled defaultChecked />
              </div>
            </div>
          </div>
        </section>

        {/* Example Card */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            组合示例
          </h2>
          
          <NeumorphicCard className="p-8 max-w-md mx-auto">
            <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">
              用户设置
            </h3>
            
            <div className="space-y-6">
              <NeumorphicInput
                label="用户名"
                placeholder="请输入用户名"
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
                fullWidth
              />
              
              <NeumorphicInput
                label="邮箱"
                type="email"
                placeholder="请输入邮箱"
                fullWidth
              />
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  音量
                </label>
                <NeumorphicSlider defaultValue={75} showValue />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  接收通知
                </span>
                <NeumorphicToggle defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  深色模式
                </span>
                <NeumorphicToggle />
              </div>
              
              <NeumorphicButton variant="primary" fullWidth>
                保存设置
              </NeumorphicButton>
            </div>
          </NeumorphicCard>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Neumorphic UI Components for Next.js</p>
          <p className="mt-1">使用 TypeScript + Tailwind CSS 构建</p>
        </footer>
      </div>
    </div>
  );
}
