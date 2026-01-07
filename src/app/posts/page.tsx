import { getAllPosts, categoryConfig, PostCategory } from '@/lib/posts';
import { PostCard } from '@/components/PostCard';
import Link from 'next/link';

export const metadata = {
  title: '所有文章 - 大江东去',
  description: '浏览所有博客文章',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function PostsPage() {
  const posts = getAllPosts();
  
  // 按年份分组
  const postsByYear = posts.reduce((acc, post) => {
    const year = new Date(post.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {} as Record<number, typeof posts>);

  const years = Object.keys(postsByYear).map(Number).sort((a, b) => b - a);

  // 统计各分类
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
      {/* 页面头部 */}
      <header className="mb-12 animate-in">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
          所有文章
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          共 {posts.length} 篇文章
        </p>
      </header>

      {/* 分类快捷入口 */}
      <section className="mb-12 animate-in stagger-1">
        <div className="flex flex-wrap gap-2">
          {categories.map(({ key, href }) => {
            const config = categoryConfig[key];
            const count = categoryCounts[key] || 0;
            return (
              <Link
                key={key}
                href={href}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                <span>{config.icon}</span>
                <span>{config.name}</span>
                <span className="text-neutral-400 text-sm">({count})</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 文章列表（按年份分组） */}
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-neutral-500">暂无文章</p>
        </div>
      ) : (
        <div className="space-y-12 animate-in stagger-2">
          {years.map((year) => (
            <section key={year}>
              <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-6">
                {year}
              </h2>
              <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {postsByYear[year].map((post) => (
                  <div key={post.slug} className="py-6 first:pt-0 last:pb-0">
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
