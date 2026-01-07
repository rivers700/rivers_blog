import { getPostsByCategory, getTechSubCategories, getTechSubCategoryConfig } from '@/lib/posts';
import { categoryConfig } from '@/lib/categories';
import { PostCard } from '@/components/PostCard';
import Link from 'next/link';

export const metadata = {
  title: '技术分享 - 大江东去',
  description: '编程技巧、开发经验、技术探索',
};

// 启用动态渲染
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function TechPage() {
  const posts = getPostsByCategory('tech');
  const config = categoryConfig.tech;
  const subCategoriesConfig = getTechSubCategories();
  const techSubCategoryConfig = getTechSubCategoryConfig();

  // 按子分类分组
  const postsBySubCategory = posts.reduce((acc, post) => {
    const subCat = post.subCategory || 'other';
    if (!acc[subCat]) acc[subCat] = [];
    acc[subCat].push(post);
    return acc;
  }, {} as Record<string, typeof posts>);

  // 子分类顺序（动态获取）
  const subCategories = subCategoriesConfig.map(c => c.value);

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

      {/* 子分类导航 */}
      <section className="mb-10 animate-in stagger-1">
        <div className="flex flex-wrap gap-2">
          {subCategories.map((subCat) => {
            const subConfig = techSubCategoryConfig[subCat];
            const count = postsBySubCategory[subCat]?.length || 0;
            return (
              <Link
                key={subCat}
                href={`/tech/${subCat}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                <span>{subConfig.icon}</span>
                <span>{subConfig.name}</span>
                <span className="text-neutral-400 text-sm">({count})</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 文章列表 */}
      {posts.length === 0 ? (
        <div className="text-center py-16 animate-in stagger-2">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
            <span className="text-2xl">{config.icon}</span>
          </div>
          <p className="text-neutral-500 mb-4">暂无技术文章</p>
          <Link href="/" className="btn-secondary">
            返回首页
          </Link>
        </div>
      ) : (
        <div className="space-y-12 animate-in stagger-2">
          {subCategories.map((subCat) => {
            const subPosts = postsBySubCategory[subCat];
            if (!subPosts || subPosts.length === 0) return null;
            
            const subConfig = techSubCategoryConfig[subCat];
            return (
              <section key={subCat}>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xl">{subConfig.icon}</span>
                  <h2 className="text-lg font-display font-semibold text-neutral-900 dark:text-neutral-100">
                    {subConfig.name}
                  </h2>
                  <span className="text-sm text-neutral-400">({subPosts.length})</span>
                </div>
                <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {subPosts.map((post) => (
                    <div key={post.slug} className="py-6 first:pt-0 last:pb-0">
                      <PostCard post={post} showCategory={false} />
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
