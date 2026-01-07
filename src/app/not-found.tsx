import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-narrow py-24 text-center">
      <div className="mb-8">
        <span className="text-8xl font-display font-bold text-neutral-200 dark:text-neutral-800">
          404
        </span>
      </div>
      <h1 className="text-2xl font-display font-semibold mb-4">
        页面未找到
      </h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8">
        抱歉，您访问的页面不存在或已被移除。
      </p>
      <Link href="/" className="btn-primary">
        返回首页
      </Link>
    </div>
  );
}
