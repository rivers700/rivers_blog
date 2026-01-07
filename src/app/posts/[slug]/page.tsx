import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { categoryConfig, techSubCategoryConfig } from '@/lib/categories';
import { formatDate } from '@/lib/utils';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ReadingProgress } from '@/components/ReadingProgress';
import { TableOfContents } from '@/components/TableOfContents';
import { MobileToc } from '@/components/MobileToc';
import { ShareButtons } from '@/components/ShareButtons';
import { PostCardCompact } from '@/components/PostCard';
import { CodeBlockWrapper } from '@/components/CodeBlockWrapper';
import { Comments } from '@/components/Comments';

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// 使用 ISR，每 60 秒重新验证
export const revalidate = 60;

const baseUrl = process.env.SITE_URL || 'https://yourdomain.com';

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    return { title: '文章未找到' };
  }

  const postUrl = `${baseUrl}/posts/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.date,
      url: postUrl,
      siteName: '大江东去',
      locale: 'zh_CN',
      authors: ['大江东去'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
    alternates: {
      canonical: postUrl,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug);
  const allPosts = getAllPosts();

  if (!post) {
    notFound();
  }

  const category = post.category ? categoryConfig[post.category] : null;
  const subCategory = post.subCategory ? techSubCategoryConfig[post.subCategory] : null;
  
  // 确定返回链接
  let backHref = '/posts';
  let backLabel = '返回文章列表';
  
  if (post.category === 'tech' && post.subCategory) {
    backHref = `/tech/${post.subCategory}`;
    backLabel = `返回${subCategory?.name || '技术分享'}`;
  } else if (post.category) {
    backHref = `/${post.category}`;
    backLabel = `返回${category?.name || '文章列表'}`;
  }

  // 获取相关文章（同分类/子分类或同标签）
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .filter((p) => 
      (post.subCategory && p.subCategory === post.subCategory) ||
      (p.category === post.category) || 
      p.tags?.some((tag) => post.tags?.includes(tag))
    )
    .slice(0, 3);

  const recommendedPosts = relatedPosts.length > 0 
    ? relatedPosts 
    : allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <ReadingProgress />
      <TableOfContents />
      <MobileToc />

      <article className="container-narrow py-16 md:py-24">
        {/* 返回链接 */}
        <Link 
          href={backHref}
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {backLabel}
        </Link>

        {/* 封面图 */}
        {post.coverImage && (
          <div className="relative w-full aspect-video mb-8 rounded-xl overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* 文章头部 */}
        <header className="mb-12 animate-in">
          {/* 分类和标签 */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {category && (
              <Link 
                href={`/${post.category}`}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors category-tag-${post.category}`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </Link>
            )}
            {subCategory && (
              <Link 
                href={`/tech/${post.subCategory}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
              >
                <span>{subCategory.icon}</span>
                <span>{subCategory.name}</span>
              </Link>
            )}
            {post.tags && post.tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>

          {/* 标题 */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight mb-6">
            {post.title}
          </h1>

          {/* 元信息 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>·</span>
            <span>{post.readingTime} 分钟阅读</span>
          </div>
        </header>

        {/* 文章内容 */}
        <div
          className="prose-custom animate-in stagger-1"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* 分享和导航 */}
        <footer className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800 animate-in stagger-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <ShareButtons title={post.title} url={`/posts/${post.slug}`} />
            
            <Link href={backHref} className="btn-secondary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {backLabel}
            </Link>
          </div>
        </footer>

        {/* 推荐文章 */}
        {recommendedPosts.length > 0 && (
          <section className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800 animate-in stagger-3">
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-6">
              {relatedPosts.length > 0 ? '相关文章' : '推荐阅读'}
            </h2>
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {recommendedPosts.map((p) => (
                <PostCardCompact key={p.slug} post={p} />
              ))}
            </div>
          </section>
        )}

        {/* 评论系统 */}
        <Comments />
      </article>

      {/* 代码块复制功能 */}
      <CodeBlockWrapper />
    </>
  );
}
