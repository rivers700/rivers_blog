import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { PostCategory } from '@/lib/posts';
import { getTokenFromHeader, checkRateLimit, getClientIP } from '@/lib/auth';
import { generateSlug } from '@/lib/slug';

const contentDirectory = path.join(process.cwd(), 'content');

function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const payload = getTokenFromHeader(authHeader);
  return payload !== null && payload.role === 'admin';
}

// 自动生成标签
function generateTags(content: string, title: string): string[] {
  const tags: Set<string> = new Set();
  const text = `${title} ${content}`.toLowerCase();
  
  const techKeywords: Record<string, string[]> = {
    'React': ['react', 'jsx', 'hooks', 'usestate', 'useeffect'],
    'Vue': ['vue', 'vuex', 'pinia', 'composition api'],
    'Next.js': ['next.js', 'nextjs', 'next', 'getserversideprops', 'getstaticprops'],
    'TypeScript': ['typescript', 'ts', 'interface', 'type '],
    'JavaScript': ['javascript', 'js', 'es6', 'promise', 'async'],
    'Node.js': ['node.js', 'nodejs', 'express', 'koa', 'npm'],
    'Python': ['python', 'django', 'flask', 'pip'],
    'CSS': ['css', 'tailwind', 'sass', 'scss', 'styled'],
    'HTML': ['html', 'dom', 'html5'],
    'Git': ['git', 'github', 'gitlab', 'commit'],
    'Docker': ['docker', 'container', 'dockerfile'],
    '数据库': ['mysql', 'mongodb', 'redis', 'postgresql', 'sql'],
    'API': ['api', 'rest', 'graphql', 'fetch'],
    'AI': ['ai', 'gpt', 'chatgpt', 'openai', '机器学习', '深度学习'],
    '前端': ['前端', 'frontend', '组件', '页面'],
    '后端': ['后端', 'backend', '服务器', 'server'],
    '教程': ['教程', 'tutorial', '入门', '学习'],
    '实战': ['实战', '项目', 'project', '案例'],
  };
  
  for (const [tag, keywords] of Object.entries(techKeywords)) {
    if (keywords.some(kw => text.includes(kw))) {
      tags.add(tag);
    }
  }
  
  return Array.from(tags).slice(0, 5);
}

// POST - 上传 MD 文件
export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ success: false, error: '未授权访问' }, { status: 401 });
  }

  const clientIP = getClientIP(request);
  const rateLimit = checkRateLimit(`upload:${clientIP}`, { maxRequests: 10, windowMs: 60000 });
  if (!rateLimit.allowed) {
    return NextResponse.json({ success: false, error: '请求过于频繁' }, { status: 429 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as PostCategory;
    const subCategory = formData.get('subCategory') as string | null;
    const customTags = formData.get('tags') as string | null;

    if (!file) {
      return NextResponse.json({ success: false, error: '请选择文件' }, { status: 400 });
    }

    if (!file.name.endsWith('.md')) {
      return NextResponse.json({ success: false, error: '只支持 .md 文件' }, { status: 400 });
    }

    // 文件大小限制 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: '文件大小不能超过 5MB' }, { status: 400 });
    }

    if (!category || !['tech', 'life', 'tools'].includes(category)) {
      return NextResponse.json({ success: false, error: '请选择有效分类' }, { status: 400 });
    }

    const content = await file.text();
    const { data, content: markdownContent } = matter(content);
    
    let tags: string[] = [];
    if (customTags) {
      tags = customTags.split(',').map(t => t.trim()).filter(Boolean);
    } else if (data.tags && Array.isArray(data.tags)) {
      tags = data.tags;
    } else {
      const title = data.title || file.name.replace('.md', '');
      tags = generateTags(markdownContent, title);
    }
    
    const title = data.title || file.name.replace('.md', '');
    const frontmatter = {
      title,
      date: data.date || new Date().toISOString().split('T')[0],
      excerpt: data.excerpt || markdownContent.substring(0, 100).replace(/[#\n]/g, ' ').trim(),
      tags,
      category,
      ...(subCategory && { subCategory }),
    };
    
    const finalContent = matter.stringify(markdownContent, frontmatter);

    // 生成 URL 友好的 slug（处理中文文件名）
    const originalFileName = file.name.replace('.md', '');
    const slug = generateSlug(originalFileName);
    
    let savePath: string;
    
    if (category === 'tech') {
      savePath = path.join(contentDirectory, 'tech', subCategory || 'other', `${slug}.md`);
    } else {
      savePath = path.join(contentDirectory, category, `${slug}.md`);
    }

    const dir = path.dirname(savePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(savePath, finalContent, 'utf8');

    return NextResponse.json({
      success: true,
      message: '文件上传成功',
      slug,
      originalFileName,
      category,
      subCategory,
      tags,
    });
  } catch (error) {
    console.error('上传失败:', error);
    return NextResponse.json({ success: false, error: '上传失败' }, { status: 500 });
  }
}
