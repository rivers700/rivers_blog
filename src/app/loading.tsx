export default function HomeLoading() {
  return (
    <div className="container-narrow py-16 md:py-24">
      {/* Hero Section 骨架 */}
      <section className="mb-16 md:mb-20">
        <div className="skeleton h-14 w-48 mb-6" />
        <div className="skeleton h-6 w-full max-w-xl mb-2" />
        <div className="skeleton h-6 w-3/4 max-w-xl" />
      </section>

      {/* 分类入口骨架 */}
      <section className="mb-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card h-32 p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="skeleton h-8 w-8 rounded-lg" />
                <div className="skeleton h-4 w-12" />
              </div>
              <div className="skeleton h-5 w-24 mb-2" />
              <div className="skeleton h-4 w-full" />
            </div>
          ))}
        </div>
      </section>

      {/* 最新文章骨架 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="skeleton h-4 w-20" />
          <div className="skeleton h-4 w-16" />
        </div>
        
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="py-6 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="skeleton h-4 w-24" />
                <div className="skeleton h-4 w-20" />
                <div className="skeleton h-4 w-16" />
              </div>
              <div className="skeleton h-6 w-full mb-2" />
              <div className="skeleton h-4 w-5/6" />
              <div className="flex gap-2 mt-4">
                <div className="skeleton h-6 w-16 rounded-md" />
                <div className="skeleton h-6 w-20 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
