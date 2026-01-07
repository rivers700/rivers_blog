import { z } from 'zod';

// 登录验证
export const loginSchema = z.object({
  password: z.string().min(1, '请输入密码'),
});

// 文章创建验证
export const createPostSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(200, '标题过长'),
  content: z.string().min(1, '内容不能为空'),
  excerpt: z.string().max(500, '摘要过长').optional(),
  tags: z.array(z.string()).max(10, '标签数量不能超过10个').optional(),
  category: z.enum(['tech', 'life', 'tools']),
  subCategory: z.string().optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'slug 只能包含小写字母、数字和连字符').optional(),
});

// 文章更新验证
export const updatePostSchema = createPostSchema.partial().extend({
  title: z.string().min(1, '标题不能为空').max(200, '标题过长').optional(),
  content: z.string().min(1, '内容不能为空').optional(),
});

// 分类验证
export const categorySchema = z.object({
  value: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/, '标识只能包含小写字母、数字和连字符'),
  label: z.string().min(1).max(50),
  icon: z.string().min(1).max(10),
  parentCategory: z.enum(['tech']).optional(),
  parentSubCategory: z.string().optional(),
});

// 验证函数
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errorMessage = result.error.issues.map(e => e.message).join(', ');
  return { success: false, error: errorMessage };
}
