import { notFound } from 'next/navigation';
import { getPostsBySubCategory, getTechSubCategories, getTechSubCategoryConfig } from '@/lib/posts';
import { PostCard } from '@/components/PostCard';
import Link from 'next/link';
import { Metadata } from 'next';

// 启用动态渲染
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface SubCategoryPageProps {
  params: {
    subCategory: string;
  };
}

export async function generateMetadata({ params }: SubCategoryPageProps): Promise<Metadata> {
  const techSubCategoryConfig = getTechSubCategoryConfig();
  const config = techSubCategoryConfig[params.subCategory];
  
  if (!config) {
    return { title: '页面未找到' };
  }

  return {
    title: `${config.name} - 技术分享 - 大江东去`,
    description: `${config.name}相关的技术文章`,
  };
}

export default function SubCategoryPage({ params }: SubCategoryPageProps) {
  const subCategoriesConfig = getTechSubCategories();
  const techSubCategoryConfig = getTechSubCategoryConfig();
  const validSubCategories = subCategoriesConfig.map(c => c.value);
  
  if (!validSubCategories.includes(params.subCategory)) {
    notFound();
  }

  const posts = getPostsBySubCategory(params.subCategory);
  const config = techSubCategoryConfig[params.subCategory];

  return (
    <div className="container-narrow py-16 md:py-24">
      {/* 返回链接 */}
      <Link 
        href="/tech"
        className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mb-8"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回技术分享
      </Link>

      {/* 页面头部 */}
      <header className="mb-12 animate-in">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">{config?.icon || '📁'}</span>
          <h1 className="text-3xl md:text-4xl font-display font-bold">
            {config?.name || params.subCategory}
          </h1>
        </div>
        <p className="text-sm text-neutral-500">
          共 {posts.length} 篇文章
        </p>
      </header>

      {/* 其他子分类导航 */}
      <section className="mb-10 animate-in stagger-1">
        <div className="flex flex-wrap gap-2">
          {subCategoriesConfig.map((subCat) => {
            const isActive = subCat.value === params.subCategory;
            return (
              <Link
                key={subCat.value}
                href={`/tech/${subCat.value}`}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                <span>{subCat.icon}</span>
                <span>{subCat.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 文章列表 */}
      {posts.length === 0 ? (
        <div className="text-center py-16 animate-in stagger-2">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
            <span className="text-2xl">{config?.icon || '📁'}</span>
          </div>
          <p className="text-neutral-500 mb-4">暂无{config?.name || '该分类'}文章</p>
          <Link href="/tech" className="btn-secondary">
            返回技术分享
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800 animate-in stagger-2">
          {posts.map((post) => (
            <div key={post.slug} className="py-6 first:pt-0 last:pb-0">
              <PostCard post={post} showCategory={false} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
