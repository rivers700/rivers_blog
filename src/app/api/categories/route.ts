import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getTokenFromHeader, checkRateLimit, getClientIP } from '@/lib/auth';
import { validate, categorySchema } from '@/lib/validation';

const configPath = path.join(process.cwd(), 'content', 'categories.json');
const contentDirectory = path.join(process.cwd(), 'content');

function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const payload = getTokenFromHeader(authHeader);
  return payload !== null && payload.role === 'admin';
}

interface SubCategory {
  value: string;
  label: string;
  icon: string;
  children?: SubCategory[];
}

interface Config {
  techSubCategories: SubCategory[];
}

const defaultConfig: Config = {
  techSubCategories: [
    { value: 'frontend', label: '前端开发', icon: '🎨', children: [] },
    { value: 'backend', label: '后端开发', icon: '⚙️', children: [] },
    { value: 'ai', label: 'AI / 机器学习', icon: '🤖', children: [] },
    { value: 'other', label: '其他技术', icon: '📚', children: [] },
  ],
};

function getConfig(): Config {
  if (fs.existsSync(configPath)) {
    const content = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(content);
  }
  return defaultConfig;
}

function saveConfig(config: Config) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
}

// GET - 获取分类配置
export async function GET(request: NextRequest) {
  const clientIP = getClientIP(request);
  const rateLimit = checkRateLimit(`categories:get:${clientIP}`, { maxRequests: 60, windowMs: 60000 });
  
  if (!rateLimit.allowed) {
    return NextResponse.json({ success: false, error: '请求过于频繁' }, { status: 429 });
  }

  try {
    const config = getConfig();
    return NextResponse.json({ success: true, ...config });
  } catch (error) {
    console.error('获取分类失败:', error);
    return NextResponse.json({ success: false, error: '获取分类失败' }, { status: 500 });
  }
}

// POST - 添加子分类
export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ success: false, error: '未授权访问' }, { status: 401 });
  }

  const clientIP = getClientIP(request);
  const rateLimit = checkRateLimit(`categories:create:${clientIP}`, { maxRequests: 10, windowMs: 60000 });
  
  if (!rateLimit.allowed) {
    return NextResponse.json({ success: false, error: '请求过于频繁' }, { status: 429 });
  }

  try {
    const body = await request.json();
    
    // 输入验证
    const validation = validate(categorySchema, body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    const { value, label, icon, parentCategory, parentSubCategory } = validation.data;
    const config = getConfig();

    if (parentCategory === 'tech') {
      if (parentSubCategory) {
        const parentCat = config.techSubCategories.find(c => c.value === parentSubCategory);
        if (!parentCat) {
          return NextResponse.json({ success: false, error: '父分类不存在' }, { status: 400 });
        }
        
        if (!parentCat.children) parentCat.children = [];
        
        if (parentCat.children.some(c => c.value === value)) {
          return NextResponse.json({ success: false, error: '该子分类已存在' }, { status: 400 });
        }
        
        parentCat.children.push({ value, label, icon: icon || '📁' });
        
        const dirPath = path.join(contentDirectory, 'tech', parentSubCategory, value);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
      } else {
        if (config.techSubCategories.some(c => c.value === value)) {
          return NextResponse.json({ success: false, error: '该分类已存在' }, { status: 400 });
        }

        config.techSubCategories.push({
          value,
          label,
          icon: icon || '📁',
          children: [],
        });

        const dirPath = path.join(contentDirectory, 'tech', value);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
      }
    }

    saveConfig(config);

    return NextResponse.json({
      success: true,
      message: '分类添加成功',
      config,
    });
  } catch (error) {
    console.error('添加分类失败:', error);
    return NextResponse.json({ success: false, error: '添加分类失败' }, { status: 500 });
  }
}

// DELETE - 删除子分类
export async function DELETE(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ success: false, error: '未授权访问' }, { status: 401 });
  }

  const clientIP = getClientIP(request);
  const rateLimit = checkRateLimit(`categories:delete:${clientIP}`, { maxRequests: 10, windowMs: 60000 });
  
  if (!rateLimit.allowed) {
    return NextResponse.json({ success: false, error: '请求过于频繁' }, { status: 429 });
  }

  try {
    const { value, parentCategory, parentSubCategory } = await request.json();

    if (!value || typeof value !== 'string') {
      return NextResponse.json({ success: false, error: '分类标识为必填项' }, { status: 400 });
    }

    const protectedCategories = ['frontend', 'backend', 'ai', 'other'];
    const config = getConfig();

    if (parentCategory === 'tech') {
      if (parentSubCategory) {
        const parentCat = config.techSubCategories.find(c => c.value === parentSubCategory);
        if (parentCat && parentCat.children) {
          const dirPath = path.join(contentDirectory, 'tech', parentSubCategory, value);
          if (fs.existsSync(dirPath)) {
            const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
            if (files.length > 0) {
              return NextResponse.json({ 
                success: false, 
                error: `该分类下还有 ${files.length} 篇文章，请先移动或删除这些文章` 
              }, { status: 400 });
            }
            fs.rmdirSync(dirPath);
          }
          parentCat.children = parentCat.children.filter(c => c.value !== value);
        }
      } else {
        if (protectedCategories.includes(value)) {
          return NextResponse.json({ success: false, error: '不能删除默认分类' }, { status: 400 });
        }

        const dirPath = path.join(contentDirectory, 'tech', value);
        if (fs.existsSync(dirPath)) {
          const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
          if (files.length > 0) {
            return NextResponse.json({ 
              success: false, 
              error: `该分类下还有 ${files.length} 篇文章，请先移动或删除这些文章` 
            }, { status: 400 });
          }
          fs.rmdirSync(dirPath, { recursive: true });
        }

        config.techSubCategories = config.techSubCategories.filter(c => c.value !== value);
      }
    }

    saveConfig(config);

    return NextResponse.json({
      success: true,
      message: '分类删除成功',
      config,
    });
  } catch (error) {
    console.error('删除分类失败:', error);
    return NextResponse.json({ success: false, error: '删除分类失败' }, { status: 500 });
  }
}
