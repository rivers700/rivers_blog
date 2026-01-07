import Link from 'next/link';
import { getAllPosts, categoryConfig, PostCategory } from '@/lib/posts';
import { PostCard } from '@/components/PostCard';

// 使用 ISR（增量静态再生成），每 60 秒重新验证
export const revalidate = 60;

export default function HomePage() {
  const posts = getAllPosts();
  const recentPosts = posts.slice(0, 5);

  // 统计各分类文章数量
  const categoryCounts = posts.reduce((acc, post) => {
    const cat = post.category || 'tech';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<PostCategory, number>);

  const categories: { key: PostCategory; href: string }[] = [
    { key: 'tech', href: '/tech' },
    { key: 'life', href: '/life' },
    { key: 'tools', href: '/tools' },
  ];

  return (
    <div className="container-narrow py-16 md:py-24">
      {/* Hero Section */}
      <section className="mb-16 md:mb-20 animate-in">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6">
          <span className="gradient-text">大江东去</span>
        </h1>
        <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
          浪淘尽，千古风流人物。
          <br />
          技术探索、生活感悟、实用工具，皆在此处。
        </p>
      </section>

      {/* 分类入口 */}
      <section className="mb-16 animate-in stagger-1">
        <div className="grid gap-4 sm:grid-cols-3">
          {categories.map(({ key, href }) => {
            const config = categoryConfig[key];
            const count = categoryCounts[key] || 0;
            return (
              <Link
                key={key}
                href={href}
                className="card-hover p-5 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{config.icon}</span>
                  <span className="text-sm text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                    {count} 篇
                  </span>
                </div>
                <h3 className="font-display font-semibold text-neutral-900 dark:text-neutral-100 mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {config.name}
                </h3>
                <p className="text-sm text-neutral-500">
                  {config.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 最新文章 */}
      {recentPosts.length > 0 && (
        <section className="animate-in stagger-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
              最新文章
            </h2>
            <Link
              href="/posts"
              className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors flex items-center gap-1"
            >
              查看全部
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {recentPosts.map((post) => (
              <div key={post.slug} className="py-6 first:pt-0 last:pb-0">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {posts.length === 0 && (
        <section className="text-center py-16 animate-in stagger-2">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-neutral-500">暂无文章，敬请期待...</p>
        </section>
      )}
    </div>
  );
}
