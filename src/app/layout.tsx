import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BackToTop } from '@/components/BackToTop';
import { getAllPosts } from '@/lib/posts';
import '@/styles/globals.css';

// 使用 next/font 本地化字体，避免外部 CDN 加载
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const baseUrl = process.env.SITE_URL || 'https://yourdomain.com';

export const metadata: Metadata = {
  title: {
    default: '大江东去 - 个人博客',
    template: '%s - 大江东去',
  },
  description: '技术探索、生活感悟、实用工具',
  keywords: ['博客', '技术', '前端', '后端', 'AI', '编程'],
  authors: [{ name: '大江东去' }],
  creator: '大江东去',
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: baseUrl,
    siteName: '大江东去',
    title: '大江东去 - 个人博客',
    description: '技术探索、生活感悟、实用工具',
  },
  twitter: {
    card: 'summary_large_image',
    title: '大江东去 - 个人博客',
    description: '技术探索、生活感悟、实用工具',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/favicon.svg',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const posts = getAllPosts();

  return (
    <html lang="zh-CN" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* KaTeX CSS - 本地化加载 */}
        <link rel="stylesheet" href="/css/katex.min.css" />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <ThemeProvider>
          <Header posts={posts} />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
