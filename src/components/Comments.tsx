'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

interface CommentsProps {
  repo?: string;
  repoId?: string;
  category?: string;
  categoryId?: string;
}

const GISCUS_CONFIG = {
  repo: 'rivers700/rivers_blog',
  repoId: 'R_kgDOQuKvJA',
  category: 'Announcements',
  categoryId: 'DIC_kwDOQuKvJM4C0q_R',
};

export function Comments({
  repo = GISCUS_CONFIG.repo,
  repoId = GISCUS_CONFIG.repoId,
  category = GISCUS_CONFIG.category,
  categoryId = GISCUS_CONFIG.categoryId,
}: CommentsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!ref.current) return;

    // 清除现有的评论
    const existingScript = ref.current.querySelector('script');
    if (existingScript) {
      existingScript.remove();
    }
    const existingWidget = ref.current.querySelector('.giscus');
    if (existingWidget) {
      existingWidget.remove();
    }

    // 创建新的giscus脚本
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', resolvedTheme === 'dark' ? 'dark' : 'light');
    script.setAttribute('data-lang', 'zh-CN');
    script.setAttribute('data-loading', 'lazy');
    script.crossOrigin = 'anonymous';
    script.async = true;

    ref.current.appendChild(script);
  }, [repo, repoId, category, categoryId, resolvedTheme]);

  return (
    <section className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        评论
      </h3>
      <div ref={ref} className="giscus-container" />
    </section>
  );
}
