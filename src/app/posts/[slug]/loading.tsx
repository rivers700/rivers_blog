export default function PostLoading() {
  return (
    <article className="container-narrow py-16 md:py-24">
      {/* 返回链接骨架 */}
      <div className="skeleton h-5 w-32 mb-8" />

      {/* 文章头部骨架 */}
      <header className="mb-12">
        {/* 分类标签 */}
        <div className="flex gap-2 mb-4">
          <div className="skeleton h-8 w-24 rounded-lg" />
          <div className="skeleton h-8 w-20 rounded-lg" />
        </div>

        {/* 标题 */}
        <div className="skeleton h-12 w-full mb-3" />
        <div className="skeleton h-12 w-3/4 mb-6" />

        {/* 元信息 */}
        <div className="flex gap-4">
          <div className="skeleton h-5 w-28" />
          <div className="skeleton h-5 w-24" />
        </div>
      </header>

      {/* 文章内容骨架 */}
      <div className="space-y-4">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-4/5" />
        
        {/* 代码块骨架 */}
        <div className="skeleton h-48 w-full rounded-xl my-6" />
        
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-3/4" />
        
        {/* 图片骨架 */}
        <div className="skeleton h-64 w-full rounded-xl my-6" />
        
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
        <div className="skeleton h-4 w-full" />
      </div>
    </article>
  );
}
