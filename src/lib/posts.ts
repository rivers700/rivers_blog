import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import { getReadingTime } from './utils';
import { 
  categoryConfig, 
  techSubCategoryConfig, 
  defaultTechSubCategories,
  type PostCategory,
  type TechSubCategory 
} from './categories';

// 重新导出类型和配置，保持向后兼容
export { categoryConfig, techSubCategoryConfig };
export type { PostCategory, TechSubCategory };

const contentDirectory = path.join(process.cwd(), 'content');
const configPath = path.join(contentDirectory, 'categories.json');

// 获取动态分类配置（仅服务端使用）
export function getTechSubCategories(): Array<{ value: string; label: string; icon: string }> {
  try {
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(content);
      return config.techSubCategories || defaultTechSubCategories;
    }
  } catch {
    // 忽略错误，使用默认配置
  }
  return defaultTechSubCategories;
}

// 技术子分类配置（仅服务端使用）
export function getTechSubCategoryConfig(): Record<string, { name: string; icon: string }> {
  const categories = getTechSubCategories();
  return categories.reduce((acc, cat) => {
    acc[cat.value] = { name: cat.label, icon: cat.icon };
    return acc;
  }, {} as Record<string, { name: string; icon: string }>);
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  category: PostCategory;
  subCategory?: TechSubCategory;
  coverImage?: string;
  contentHtml: string;
  readingTime: number;
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  category: PostCategory;
  subCategory?: TechSubCategory;
  coverImage?: string;
  readingTime: number;
}

// 确保目录存在
function ensureDirectories(): void {
  const dirs = [
    path.join(contentDirectory, 'tech/frontend'),
    path.join(contentDirectory, 'tech/backend'),
    path.join(contentDirectory, 'tech/ai'),
    path.join(contentDirectory, 'tech/other'),
    path.join(contentDirectory, 'life'),
    path.join(contentDirectory, 'tools'),
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// 递归获取目录下所有 md 文件
function getMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  
  const files: string[] = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...getMarkdownFiles(fullPath));
    } else if (item.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// 从文件路径解析分类信息
function parseCategoryFromPath(filePath: string): { category: PostCategory; subCategory?: TechSubCategory } {
  const relativePath = path.relative(contentDirectory, filePath);
  const parts = relativePath.split(path.sep);
  
  if (parts[0] === 'tech' && parts.length >= 2) {
    const subCat = parts[1] as TechSubCategory;
    if (['frontend', 'backend', 'ai', 'other'].includes(subCat)) {
      return { category: 'tech', subCategory: subCat };
    }
    return { category: 'tech' };
  }
  
  if (parts[0] === 'life') {
    return { category: 'life' };
  }
  
  if (parts[0] === 'tools') {
    return { category: 'tools' };
  }
  
  // 兼容旧的 posts 目录
  if (parts[0] === 'posts') {
    return { category: 'tech' };
  }
  
  return { category: 'tech' };
}

// 生成 slug
function generateSlug(filePath: string): string {
  const fileName = path.basename(filePath, '.md');
  return fileName;
}

export function getAllPosts(): PostMeta[] {
  ensureDirectories();
  
  const allFiles: string[] = [];
  
  // 从新目录结构获取文件
  allFiles.push(...getMarkdownFiles(path.join(contentDirectory, 'tech')));
  allFiles.push(...getMarkdownFiles(path.join(contentDirectory, 'life')));
  allFiles.push(...getMarkdownFiles(path.join(contentDirectory, 'tools')));
  
  // 兼容旧的 posts 目录
  const oldPostsDir = path.join(contentDirectory, 'posts');
  if (fs.existsSync(oldPostsDir)) {
    allFiles.push(...getMarkdownFiles(oldPostsDir));
  }
  
  const allPosts = allFiles.map((filePath) => {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    const { category, subCategory } = parseCategoryFromPath(filePath);
    const slug = generateSlug(filePath);

    return {
      slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt || '',
      tags: data.tags || [],
      category: (data.category as PostCategory) || category,
      subCategory: (data.subCategory as TechSubCategory) || subCategory,
      coverImage: data.coverImage || data.cover || undefined,
      readingTime: getReadingTime(fileContents),
    };
  });

  // 去重（以 slug 为准）
  const uniquePosts = allPosts.reduce((acc, post) => {
    if (!acc.find(p => p.slug === post.slug)) {
      acc.push(post);
    }
    return acc;
  }, [] as PostMeta[]);

  return uniquePosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostsByCategory(category: PostCategory): PostMeta[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getPostsBySubCategory(subCategory: TechSubCategory): PostMeta[] {
  return getAllPosts().filter((post) => post.subCategory === subCategory);
}

export function getPostBySlug(slug: string): Post | null {
  ensureDirectories();
  
  // 解码 URL 编码的 slug（处理中文等特殊字符）
  const decodedSlug = decodeURIComponent(slug);
  
  // 搜索所有可能的位置
  const searchDirs = [
    path.join(contentDirectory, 'tech/frontend'),
    path.join(contentDirectory, 'tech/backend'),
    path.join(contentDirectory, 'tech/ai'),
    path.join(contentDirectory, 'tech/other'),
    path.join(contentDirectory, 'life'),
    path.join(contentDirectory, 'tools'),
    path.join(contentDirectory, 'posts'), // 兼容旧目录
  ];
  
  // 尝试原始 slug 和解码后的 slug
  const slugsToTry = [slug, decodedSlug];
  
  for (const dir of searchDirs) {
    for (const trySlug of slugsToTry) {
      const fullPath = path.join(dir, `${trySlug}.md`);
      if (fs.existsSync(fullPath)) {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        const { category, subCategory } = parseCategoryFromPath(fullPath);
        const processedContent = processMarkdown(content);

        return {
          slug: trySlug,
          title: data.title || trySlug,
          date: data.date || new Date().toISOString(),
          excerpt: data.excerpt || '',
          tags: data.tags || [],
          category: (data.category as PostCategory) || category,
          subCategory: (data.subCategory as TechSubCategory) || subCategory,
          coverImage: data.coverImage || data.cover || undefined,
          contentHtml: processedContent,
          readingTime: getReadingTime(content),
        };
      }
    }
  }
  
  return null;
}

function processMarkdown(content: string): string {
  const result = unified()
    .use(remarkParse as never)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeSlug)  // 为标题自动生成 ID
    .use(rehypeKatex)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .processSync(content);

  return result.toString();
}
