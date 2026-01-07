import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { PostCategory, TechSubCategory } from '@/lib/posts';
import { getTokenFromHeader, checkRateLimit, getClientIP } from '@/lib/auth';
import { validate, createPostSchema } from '@/lib/validation';
import { generateSlug } from '@/lib/slug';

const contentDirectory = path.join(process.cwd(), 'content');

function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const payload = getTokenFromHeader(authHeader);
  return payload !== null && payload.role === 'admin';
}

// GET - 获取所有文章列表
export async function GET(request: NextRequest) {
  const clientIP = getClientIP(request);
  
  // Rate Limiting: 每分钟最多 60 次请求
  const rateLimit = checkRateLimit(`posts:get:${clientIP}`, { maxRequests: 60, windowMs: 60000 });
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: '请求过于频繁' },
      { status: 429 }
    );
  }

  try {
    const posts = getAllPostsFromDisk();
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error('获取文章列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取文章列表失败' },
      { status: 500 }
    );
  }
}

// POST - 创建新文章
export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json(
      { success: false, error: '未授权访问' },
      { status: 401 }
    );
  }

  const clientIP = getClientIP(request);
  
  // Rate Limiting: 每分钟最多 10 次创建请求
  const rateLimit = checkRateLimit(`posts:create:${clientIP}`, { maxRequests: 10, windowMs: 60000 });
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: '请求过于频繁，请稍后重试' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    
    // 输入验证
    const validation = validate(createPostSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const { title, content, excerpt, tags, category, subCategory, slug: customSlug } = validation.data;

    // 生成文件名（优先使用自定义 slug，否则根据标题生成）
    const fileName = customSlug || generateSlug(title);
    
    // 确定保存路径
    const savePath = getFilePath(category, subCategory, fileName);
    
    // 确保目录存在
    const dir = path.dirname(savePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // 检查文件是否已存在
    if (fs.existsSync(savePath)) {
      return NextResponse.json(
        { success: false, error: '文章已存在，请使用不同的标题或 slug' },
        { status: 400 }
      );
    }

    // 构建 frontmatter
    const frontmatter = {
      title,
      date: new Date().toISOString().split('T')[0],
      excerpt: excerpt || title,
      tags: tags || [],
      category,
      ...(subCategory && { subCategory }),
    };

    // 生成 Markdown 文件内容
    const fileContent = matter.stringify(content, frontmatter);
    
    // 写入文件
    fs.writeFileSync(savePath, fileContent, 'utf8');

    return NextResponse.json({
      success: true,
      message: '文章创建成功',
      slug: fileName,
      path: savePath,
    });
  } catch (error) {
    console.error('创建文章失败:', error);
    return NextResponse.json(
      { success: false, error: '创建文章失败' },
      { status: 500 }
    );
  }
}

// 辅助函数
function getFilePath(category: PostCategory, subCategory?: TechSubCategory, fileName?: string): string {
  let dir = contentDirectory;
  
  if (category === 'tech') {
    dir = path.join(dir, 'tech', subCategory || 'other');
  } else {
    dir = path.join(dir, category);
  }
  
  return path.join(dir, `${fileName}.md`);
}

function getAllPostsFromDisk() {
  const posts: Array<{
    slug: string;
    title: string;
    date: string;
    category: string;
    subCategory?: string;
    path: string;
  }> = [];

  const scanDir = (dir: string, category: PostCategory, subCategory?: TechSubCategory) => {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isFile() && file.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(content);
        posts.push({
          slug: file.replace('.md', ''),
          title: data.title || file,
          date: data.date || '',
          category,
          subCategory,
          path: fullPath,
        });
      }
    }
  };

  // 扫描所有目录
  scanDir(path.join(contentDirectory, 'life'), 'life');
  scanDir(path.join(contentDirectory, 'tools'), 'tools');
  scanDir(path.join(contentDirectory, 'tech', 'frontend'), 'tech', 'frontend');
  scanDir(path.join(contentDirectory, 'tech', 'backend'), 'tech', 'backend');
  scanDir(path.join(contentDirectory, 'tech', 'ai'), 'tech', 'ai');
  scanDir(path.join(contentDirectory, 'tech', 'other'), 'tech', 'other');

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}
