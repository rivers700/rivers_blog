import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '关于我 - 大江东去',
  description: '了解博主和这个博客',
};

export default function AboutPage() {
  return (
    <div className="container-narrow py-16 md:py-24">
      {/* 个人介绍 */}
      <section className="mb-16 animate-in">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* 头像 */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-4xl md:text-5xl font-display font-bold shrink-0">
            江
          </div>
          
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              关于我
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
              欢迎来到<strong className="text-neutral-900 dark:text-neutral-100">大江东去</strong>！
              这是我的个人空间，在这里分享技术探索、生活感悟，以及一些实用的小工具。
            </p>
          </div>
        </div>
      </section>

      {/* 博客内容 */}
      <section className="mb-12 animate-in stagger-1">
        <h2 className="text-xl font-display font-semibold mb-4">这里有什么</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { 
              icon: '💻', 
              title: '技术分享', 
              desc: '编程技巧、开发经验、技术探索' 
            },
            { 
              icon: '🌱', 
              title: '生活随笔', 
              desc: '日常感悟、读书笔记、成长记录' 
            },
            { 
              icon: '🛠️', 
              title: '实用工具', 
              desc: '效率工具、开发资源、实用技巧' 
            },
          ].map((item) => (
            <div key={item.title} className="card p-5">
              <div className="text-2xl mb-3">{item.icon}</div>
              <div className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                {item.title}
              </div>
              <div className="text-sm text-neutral-500">
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 关于博客 */}
      <section className="mb-12 animate-in stagger-2">
        <h2 className="text-xl font-display font-semibold mb-4">关于博客</h2>
        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
          这个博客使用 Next.js 构建，支持 Markdown 写作、代码高亮、数学公式渲染等功能。
          采用静态生成方式，追求简洁、快速、优雅的阅读体验。
        </p>
      </section>

      {/* 技术栈 */}
      <section className="mb-12 animate-in stagger-3">
        <h2 className="text-xl font-display font-semibold mb-4">技术栈</h2>
        <div className="flex flex-wrap gap-2">
          {[
            'Next.js 14',
            'TypeScript',
            'Tailwind CSS',
            'Markdown',
            'highlight.js',
            'KaTeX',
          ].map((tech) => (
            <span key={tech} className="tag">
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* 联系方式 */}
      <section className="animate-in stagger-4">
        <h2 className="text-xl font-display font-semibold mb-4">找到我</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          如果你有任何问题或建议，欢迎通过以下方式联系我：
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="https://github.com/rivers700"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            GitHub
          </Link>
          <Link
            href="https://blog.csdn.net/qq_65210904?type=blog"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="20" height="20" rx="4" fill="currentColor" fillOpacity="0.1"/>
              <path d="M5 8h14M5 12h10M5 16h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            CSDN
          </Link>
        </div>
      </section>
    </div>
  );
}
