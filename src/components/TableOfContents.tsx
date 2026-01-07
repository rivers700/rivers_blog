'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const headingElementsRef = useRef<Map<string, HTMLElement>>(new Map());
  const isClickScrolling = useRef(false);

  // 滚动到指定标题
  const scrollToHeading = useCallback((id: string) => {
    const element = headingElementsRef.current.get(id);
    if (!element) return;

    // 标记正在点击滚动，避免滚动监听干扰
    isClickScrolling.current = true;

    // 固定 header 高度 + 额外间距
    const HEADER_HEIGHT = 64;
    const EXTRA_OFFSET = 24;
    
    // 使用 getBoundingClientRect 获取元素相对于视口的位置
    const rect = element.getBoundingClientRect();
    const absoluteTop = rect.top + window.pageYOffset;
    const targetPosition = absoluteTop - HEADER_HEIGHT - EXTRA_OFFSET;

    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: 'smooth',
    });

    // 立即更新激活状态
    setActiveId(id);

    // 更新 URL hash（不触发滚动）
    history.replaceState(null, '', `#${id}`);

    // 滚动完成后重置标记
    setTimeout(() => {
      isClickScrolling.current = false;
    }, 1000);
  }, []);

  // 初始化：获取所有标题（使用服务端生成的 ID）
  useEffect(() => {
    const timer = setTimeout(() => {
      const article = document.querySelector('article');
      if (!article) return;

      const proseContent = article.querySelector('.prose-custom');
      if (!proseContent) return;

      const elements = proseContent.querySelectorAll('h2, h3, h4');
      const elementMap = new Map<string, HTMLElement>();
      
      const items: TocItem[] = [];
      
      elements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        const text = htmlElement.textContent || '';
        
        // 使用服务端生成的 ID（由 rehype-slug 生成）
        let id = htmlElement.id;
        
        // 如果没有 ID，生成一个基于文本内容的 ID
        if (!id) {
          id = text
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\u4e00-\u9fa5-]/g, '')  // 保留中文、字母、数字、连字符
            .replace(/^-+|-+$/g, '');
          
          // 确保 ID 唯一
          let uniqueId = id;
          let counter = 1;
          while (elementMap.has(uniqueId)) {
            uniqueId = `${id}-${counter}`;
            counter++;
          }
          id = uniqueId;
          htmlElement.id = id;
        }
        
        if (id) {
          elementMap.set(id, htmlElement);
          items.push({
            id,
            text,
            level: parseInt(htmlElement.tagName[1]),
          });
        }
      });
      
      headingElementsRef.current = elementMap;
      setHeadings(items);
      setIsVisible(items.length > 0);

      // 设置初始激活状态
      if (items.length > 0) {
        // 检查 URL 中是否有 hash
        const hash = window.location.hash.slice(1);
        if (hash && elementMap.has(hash)) {
          setActiveId(hash);
        } else {
          setActiveId(items[0].id);
        }
      }
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  // 监听滚动，更新当前激活的标题
  useEffect(() => {
    if (headings.length === 0) return;

    const HEADER_HEIGHT = 64;
    const TRIGGER_OFFSET = 100;

    const handleScroll = () => {
      if (isClickScrolling.current) return;

      let currentId = headings[0]?.id || '';
      
      for (const heading of headings) {
        const element = headingElementsRef.current.get(heading.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= HEADER_HEIGHT + TRIGGER_OFFSET) {
            currentId = heading.id;
          }
        }
      }

      setActiveId(currentId);
    };

    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollListener, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', scrollListener);
  }, [headings]);

  if (!isVisible || headings.length === 0) return null;

  return (
    <nav 
      className="hidden xl:block fixed right-[max(2rem,calc((100vw-80rem)/2+1rem))] top-32 w-64 max-h-[calc(100vh-10rem)] overflow-y-auto"
      aria-label="文章目录"
    >
      <div className="pl-4 border-l-2 border-neutral-200 dark:border-neutral-700">
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          目录
        </h4>
        <ul className="space-y-1 text-sm">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: `${(heading.level - 2) * 0.75}rem` }}
            >
              <button
                onClick={() => scrollToHeading(heading.id)}
                className={`block w-full text-left py-1.5 pr-2 rounded transition-colors duration-200 hover:text-primary-600 dark:hover:text-primary-400 ${
                  activeId === heading.id
                    ? 'text-primary-600 dark:text-primary-400 font-medium bg-primary-50 dark:bg-primary-900/20'
                    : 'text-neutral-500 dark:text-neutral-400'
                }`}
                title={heading.text}
              >
                <span className="line-clamp-2">{heading.text}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
