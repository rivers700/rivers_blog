// 纯客户端安全的分类配置（不包含任何 fs 操作）

// 主分类
export type PostCategory = 'tech' | 'life' | 'tools';

// 技术子分类
export type TechSubCategory = string;

// 分类配置
export const categoryConfig: Record<PostCategory, { name: string; description: string; icon: string }> = {
  tech: {
    name: '技术分享',
    description: '编程技巧、开发经验、技术探索',
    icon: '💻',
  },
  life: {
    name: '生活随笔',
    description: '日常感悟、读书笔记、成长记录',
    icon: '🌱',
  },
  tools: {
    name: '实用工具',
    description: '效率工具、开发资源、实用技巧',
    icon: '🛠️',
  },
};

// 默认技术子分类配置（静态，客户端安全）
export const techSubCategoryConfig: Record<string, { name: string; icon: string }> = {
  frontend: { name: '前端开发', icon: '🎨' },
  backend: { name: '后端开发', icon: '⚙️' },
  ai: { name: 'AI / 机器学习', icon: '🤖' },
  other: { name: '其他技术', icon: '📚' },
};

// 默认技术子分类列表
export const defaultTechSubCategories = [
  { value: 'frontend', label: '前端开发', icon: '🎨' },
  { value: 'backend', label: '后端开发', icon: '⚙️' },
  { value: 'ai', label: 'AI / 机器学习', icon: '🤖' },
  { value: 'other', label: '其他技术', icon: '📚' },
];
