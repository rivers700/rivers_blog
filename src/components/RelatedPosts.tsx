import Link from 'next/link';
import { PostMeta } from '@/lib/posts';
import { formatDate } from '@/lib/utils';

interface RelatedPostsProps {
  currentSlug: string;
  currentTags: string[];
  allPosts: PostMeta[];
  maxPosts?: number;
}

export function RelatedPosts({
  currentSlug,
  currentTags,
  allPosts,
  maxPosts = 3,
}: RelatedPostsProps) {
  // 计算相关度分数
  const scoredPosts = allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      let score = 0;
      // 计算标签匹配数
      const matchingTags = post.tags?.filter((tag) =>
        currentTags.includes(tag)
      ).length || 0;
      score += matchingTags * 10;
      
      return { post, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxPosts);

  if (scoredPosts.length === 0) {
    // 如果没有标签匹配，显示最新文章
    const latestPosts = allPosts
      .filter((post) => post.slug !== currentSlug)
      .slice(0, maxPosts);

    if (latestPosts.length === 0) return null;

    return (
      <section className="glass-card p-6 mt-8">
        <h3 className="text-xl font-display font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          推荐阅读
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map((post) => (
            <RelatedPostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="glass-card p-6 mt-8">
      <h3 className="text-xl font-display font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        相关文章
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scoredPosts.map(({ post }) => (
          <RelatedPostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}

function RelatedPostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block p-4 rounded-card transition-all duration-200"
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid var(--glass-border)',
      }}
    >
      <h4 className="font-display font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 mb-2">
        {post.title}
      </h4>
      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
        {post.excerpt}
      </p>
      <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
        <span>{formatDate(post.date)}</span>
        <span>·</span>
        <span>{post.readingTime} 分钟</span>
      </div>
    </Link>
  );
}
