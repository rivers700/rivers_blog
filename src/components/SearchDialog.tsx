'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { PostMeta } from '@/lib/posts';

interface SearchDialogProps {
  posts: PostMeta[];
}

export function SearchDialog({ posts }: SearchDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PostMeta[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const search = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const filtered = posts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(lowerQuery);
      const excerptMatch = post.excerpt.toLowerCase().includes(lowerQuery);
      const tagsMatch = post.tags?.some(tag => tag.toLowerCase().includes(lowerQuery));
      return titleMatch || excerptMatch || tagsMatch;
    });

    setResults(filtered);
    setSelectedIndex(0);
  }, [posts]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    search(query);
  }, [query, search]);

  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      window.location.href = `/posts/${results[selectedIndex].slug}`;
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
        aria-label="搜索"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline">搜索</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700">
          <span>⌘</span>K
        </kbd>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="fixed inset-0 bg-neutral-950/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-x-4 top-[15vh] mx-auto max-w-xl">
            <div className="card overflow-hidden shadow-2xl">
              <div className="flex items-center gap-3 px-4 border-b border-neutral-200 dark:border-neutral-800">
                <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyNavigation}
                  placeholder="搜索文章..."
                  className="flex-1 py-4 bg-transparent text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none"
                />
                <kbd className="px-2 py-1 text-xs text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded">
                  ESC
                </kbd>
              </div>

              <div className="max-h-[50vh] overflow-y-auto">
                {query && results.length === 0 ? (
                  <div className="px-4 py-12 text-center text-neutral-500">
                    <p>未找到相关文章</p>
                  </div>
                ) : results.length > 0 ? (
                  <ul className="py-2">
                    {results.map((post, index) => (
                      <li key={post.slug}>
                        <Link
                          href={`/posts/${post.slug}`}
                          onClick={() => setIsOpen(false)}
                          className={`flex flex-col gap-1 px-4 py-3 mx-2 rounded-lg transition-colors ${
                            index === selectedIndex
                              ? 'bg-neutral-100 dark:bg-neutral-800'
                              : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                          }`}
                        >
                          <span className="font-medium text-neutral-900 dark:text-neutral-100">
                            {post.title}
                          </span>
                          <span className="text-sm text-neutral-500 line-clamp-1">
                            {post.excerpt}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-8 text-center text-neutral-500">
                    <p className="text-sm">输入关键词搜索文章</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
