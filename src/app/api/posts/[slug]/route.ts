import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getTokenFromHeader, checkRateLimit, getClientIP } from '@/lib/auth';
import { validate, updatePostSchema } from '@/lib/validation';

const contentDirectory = path.join(process.cwd(), 'content');

function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const payload = getTokenFromHeader(authHeader);
  return payload !== null && payload.role === 'admin';
}

// 查找文章文件路径
function findPostPath(slug: string): string | null {
  // 解码 URL 编码的 slug
  const decodedSlug = decodeURIComponent(slug);
  const slugsToTry = [slug, decodedSlug];
  
  const searchDirs = [
    path.join(contentDirectory, 'tech/frontend'),
    path.join(contentDirectory, 'tech/backend'),
    path.join(contentDirectory, 'tech/ai'),
    path.join(contentDirectory, 'tech/other'),
    path.join(contentDirectory, 'life'),
    path.join(contentDirectory, 'tools'),
  ];
  
  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
      if (file.isDirectory()) {
        for (const trySlug of slugsToTry) {
          const subPath = path.join(dir, file.name, `${trySlug}.md`);
          if (fs.existsSync(subPath)) return subPath;
        }
      }
    }
    for (const trySlug of slugsToTry) {
      const fullPath = path.join(dir, `${trySlug}.md`);
      if (fs.existsSync(fullPath)) return fullPath;
    }
  }
  
  return null;
}

// GET - 获取单篇文章
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const clientIP = getClientIP(request);
  
  // Rate Limiting
  const rateLimit = checkRateLimit(`post:get:${clientIP}`, { maxRequests: 60, windowMs: 60000 });
  if (!rateLimit.allowed) {
    return NextResponse.json({ success: false, error: '请求过于频繁' }, { status: 429 });
  }

  try {
    const filePath = findPostPath(params.slug);
    if (!filePath) {
      return NextResponse.json({ success: false, error: '文章不存在' }, { status: 404 });
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return NextResponse.json({
      success: true,
      post: {
        slug: params.slug,
        title: data.title,
        excerpt: data.excerpt,
        date: data.date,
        tags: data.tags || [],
        category: data.category,
        subCategory: data.subCategory,
        content,
        path: filePath,
      },
    });
  } catch (error) {
    console.error('获取文章失败:', error);
    return NextResponse.json({ success: false, error: '获取文章失败' }, { status: 500 });
  }
}

// PUT - 更新文章
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ success: false, error: '未授权访问' }, { status: 401 });
  }

  const clientIP = getClientIP(request);
  const rateLimit = checkRateLimit(`post:update:${clientIP}`, { maxRequests: 20, windowMs: 60000 });
  if (!rateLimit.allowed) {
    return NextResponse.json({ success: false, error: '请求过于频繁' }, { status: 429 });
  }

  try {
    const filePath = findPostPath(params.slug);
    if (!filePath) {
      return NextResponse.json({ success: false, error: '文章不存在' }, { status: 404 });
    }

    const body = await request.json();
    
    // 输入验证
    const validation = validate(updatePostSchema, body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    const { title, content, excerpt, tags, category, subCategory } = validation.data;

    // 读取原文件
    const originalContent = fs.readFileSync(filePath, 'utf8');
    const { data: originalData, content: originalMarkdown } = matter(originalContent);

    // 构建新的 frontmatter
    const frontmatter = {
      title: title || originalData.title,
      date: originalData.date,
      excerpt: excerpt || originalData.excerpt,
      tags: tags || originalData.tags || [],
      category: category || originalData.category,
      ...(subCategory && { subCategory }),
    };

    // 生成新文件内容
    const newFileContent = matter.stringify(content || originalMarkdown, frontmatter);
    
    // 检查是否需要移动文件
    const newCategory = category || originalData.category;
    const newSubCategory = subCategory || originalData.subCategory;
    let newPath = filePath;
    
    if (newCategory !== originalData.category || newSubCategory !== originalData.subCategory) {
      if (newCategory === 'tech') {
        newPath = path.join(contentDirectory, 'tech', newSubCategory || 'other', `${params.slug}.md`);
      } else {
        newPath = path.join(contentDirectory, newCategory, `${params.slug}.md`);
      }
      
      const newDir = path.dirname(newPath);
      if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir, { recursive: true });
      }
      
      fs.unlinkSync(filePath);
    }
    
    fs.writeFileSync(newPath, newFileContent, 'utf8');

    return NextResponse.json({
      success: true,
      message: '文章更新成功',
      slug: params.slug,
    });
  } catch (error) {
    console.error('更新文章失败:', error);
    return NextResponse.json({ success: false, error: '更新文章失败' }, { status: 500 });
  }
}

// DELETE - 删除文章
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ success: false, error: '未授权访问' }, { status: 401 });
  }

  const clientIP = getClientIP(request);
  const rateLimit = checkRateLimit(`post:delete:${clientIP}`, { maxRequests: 10, windowMs: 60000 });
  if (!rateLimit.allowed) {
    return NextResponse.json({ success: false, error: '请求过于频繁' }, { status: 429 });
  }

  try {
    const filePath = findPostPath(params.slug);
    if (!filePath) {
      return NextResponse.json({ success: false, error: '文章不存在' }, { status: 404 });
    }

    fs.unlinkSync(filePath);

    return NextResponse.json({
      success: true,
      message: '文章删除成功',
    });
  } catch (error) {
    console.error('删除文章失败:', error);
    return NextResponse.json({ success: false, error: '删除文章失败' }, { status: 500 });
  }
}
