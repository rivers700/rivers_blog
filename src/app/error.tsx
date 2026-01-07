'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 可以在这里记录错误到日志服务
    console.error('页面错误:', error);
  }, [error]);

  return (
    <div className="container-narrow py-24 text-center">
      <div className="mb-8">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-display font-semibold mb-4">
          出错了
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-2">
          抱歉，页面加载时发生了错误。
        </p>
        <p className="text-sm text-neutral-500 mb-8">
          {error.message || '未知错误'}
        </p>
      </div>
      
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={reset}
          className="btn-primary"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          重试
        </button>
        <a href="/" className="btn-secondary">
          返回首页
        </a>
      </div>
    </div>
  );
}
