import Link from 'next/link';
import { PostMeta, categoryConfig, techSubCategoryConfig } from '@/lib/posts';
import { formatDate } from '@/lib/utils';

interface PostCardProps {
  post: PostMeta;
  featured?: boolean;
  showCategory?: boolean;
}

export function PostCard({ post, featured = false, showCategory = true }: PostCardProps) {
  const category = post.category ? categoryConfig[post.category] : null;
  const subCategory = post.subCategory ? techSubCategoryConfig[post.subCategory] : null;

  return (
    <article className={`group ${featured ? 'card-hover p-6' : ''}`}>
      <Link href={`/posts/${post.slug}`} className="block">
        {/* 日期、分类和阅读时间 */}
        <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-500 mb-3 flex-wrap">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {showCategory && category && (
            <>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </span>
            </>
          )}
          {showCategory && subCategory && (
            <>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <span>{subCategory.icon}</span>
                <span>{subCategory.name}</span>
              </span>
            </>
          )}
          <span>·</span>
          <span>{post.readingTime} 分钟阅读</span>
        </div>

        {/* 标题 */}
        <h2 className={`font-display font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors ${
          featured ? 'text-2xl mb-3' : 'text-xl mb-2'
        }`}>
          {post.title}
        </h2>
        
        {/* 摘要 */}
        <p className={`text-neutral-600 dark:text-neutral-400 leading-relaxed ${
          featured ? 'text-base line-clamp-3' : 'text-sm line-clamp-2'
        }`}>
          {post.excerpt}
        </p>

        {/* 标签 */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </article>
  );
}

// 简洁版文章卡片
export function PostCardCompact({ post }: { post: PostMeta }) {
  const category = post.category ? categoryConfig[post.category] : null;
  const subCategory = post.subCategory ? techSubCategoryConfig[post.subCategory] : null;

  return (
    <article className="group">
      <Link href={`/posts/${post.slug}`} className="block py-3">
        <h3 className="font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 mb-1">
          {post.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-neutral-500 flex-wrap">
          <span>{formatDate(post.date)}</span>
          {category && (
            <>
              <span>·</span>
              <span>{category.icon} {category.name}</span>
            </>
          )}
          {subCategory && (
            <>
              <span>·</span>
              <span>{subCategory.icon} {subCategory.name}</span>
            </>
          )}
        </div>
      </Link>
    </article>
  );
}
