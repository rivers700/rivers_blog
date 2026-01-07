import { getPostsByCategory, categoryConfig } from '@/lib/posts';
import { PostCard } from '@/components/PostCard';
import Link from 'next/link';

export const metadata = {
  title: '生活随笔 - 大江东去',
  description: '日常感悟、读书笔记、成长记录',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function LifePage() {
  const posts = getPostsByCategory('life');
  const config = categoryConfig.life;

  return (
    <div className="container-narrow py-16 md:py-24">
      {/* 页面头部 */}
      <header className="mb-12 animate-in">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">{config.icon}</span>
          <h1 className="text-3xl md:text-4xl font-display font-bold">
            {config.name}
          </h1>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400 text-lg">
          {config.description}
        </p>
        <p className="text-sm text-neutral-500 mt-2">
          共 {posts.length} 篇文章
        </p>
      </header>

      {/* 文章列表 */}
      {posts.length === 0 ? (
        <div className="text-center py-16 animate-in stagger-1">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
            <span className="text-2xl">{config.icon}</span>
          </div>
          <p className="text-neutral-500 mb-4">暂无生活随笔</p>
          <Link href="/" className="btn-secondary">
            返回首页
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800 animate-in stagger-1">
          {posts.map((post) => (
            <div key={post.slug} className="py-6 first:pt-0 last:pb-0">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
