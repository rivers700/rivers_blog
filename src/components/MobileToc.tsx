'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function MobileToc() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const headingElementsRef = useRef<Map<string, HTMLElement>>(new Map());
  const isClickScrolling = useRef(false);

  const scrollToHeading = useCallback((id: string) => {
    const element = headingElementsRef.current.get(id);
    if (!element) return;

    isClickScrolling.current = true;
    setIsOpen(false);

    const HEADER_HEIGHT = 64;
    const EXTRA_OFFSET = 24;
    
    const rect = element.getBoundingClientRect();
    const absoluteTop = rect.top + window.pageYOffset;
    const targetPosition = absoluteTop - HEADER_HEIGHT - EXTRA_OFFSET;

    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: 'smooth',
    });

    setActiveId(id);
    history.replaceState(null, '', `#${id}`);

    setTimeout(() => {
      isClickScrolling.current = false;
    }, 1000);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const article = document.querySelector('article');
      if (!article) return;

      const proseContent = article.querySelector('.prose-custom');
      if (!proseContent) return;

      const elements = proseContent.querySelectorAll('h2, h3');
      const elementMap = new Map<string, HTMLElement>();
      const items: TocItem[] = [];
      
      elements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        const text = htmlElement.textContent || '';
        let id = htmlElement.id;
        
        if (!id) {
          id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fa5-]/g, '');
          htmlElement.id = id;
        }
        
        if (id) {
          elementMap.set(id, htmlElement);
          items.push({ id, text, level: parseInt(htmlElement.tagName[1]) });
        }
      });
      
      headingElementsRef.current = elementMap;
      setHeadings(items);

      if (items.length > 0) {
        const hash = window.location.hash.slice(1);
        setActiveId(hash && elementMap.has(hash) ? hash : items[0].id);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      if (isClickScrolling.current) return;

      let currentId = headings[0]?.id || '';
      
      for (const heading of headings) {
        const element = headingElementsRef.current.get(heading.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 164) currentId = heading.id;
        }
      }

      setActiveId(currentId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  const activeHeading = headings.find(h => h.id === activeId);

  return (
    <div className="xl:hidden fixed bottom-20 right-4 z-40">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-full shadow-lg hover:shadow-xl transition-all"
        aria-label="文章目录"
      >
        <svg className="w-4 h-4 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 max-w-32 truncate">
          {activeHeading?.text || '目录'}
        </span>
        <svg className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-full right-0 mb-2 w-72 max-h-80 overflow-y-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-2xl z-40">
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                文章目录
              </div>
              {headings.map((heading) => (
                <button
                  key={heading.id}
                  onClick={() => scrollToHeading(heading.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeId === heading.id
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                  style={{ paddingLeft: `${(heading.level - 2) * 12 + 12}px` }}
                >
                  <span className="line-clamp-2">{heading.text}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
