/**
 * 将中文或其他非 ASCII 字符转换为 URL 友好的 slug
 */

// 简单的中文拼音映射（常用字）
// 实际生产环境建议使用 pinyin 库
const pinyinMap: Record<string, string> = {
  // 这里只是示例，实际使用建议安装 pinyin 库
};

/**
 * 生成 URL 友好的 slug
 * @param text 原始文本（可能包含中文）
 * @param options 配置选项
 */
export function generateSlug(text: string, options: {
  maxLength?: number;
  addTimestamp?: boolean;
} = {}): string {
  const { maxLength = 50, addTimestamp = true } = options;

  // 1. 移除 .md 后缀
  let slug = text.replace(/\.md$/i, '');

  // 2. 转换为小写
  slug = slug.toLowerCase();

  // 3. 检查是否包含中文或其他非 ASCII 字符
  const hasNonAscii = /[^\x00-\x7F]/.test(slug);

  if (hasNonAscii) {
    // 如果包含非 ASCII 字符，生成基于时间的 slug
    // 提取英文和数字部分
    const asciiPart = slug
      .replace(/[^\w\s-]/g, '') // 移除非单词字符
      .replace(/\s+/g, '-')     // 空格转连字符
      .replace(/-+/g, '-')      // 多个连字符合并
      .replace(/^-|-$/g, '')    // 移除首尾连字符
      .substring(0, 20);

    // 生成时间戳部分
    const timestamp = Date.now().toString(36);
    
    // 组合 slug
    slug = asciiPart ? `${asciiPart}-${timestamp}` : `post-${timestamp}`;
  } else {
    // 纯 ASCII 字符，正常处理
    slug = slug
      .replace(/[^\w\s-]/g, '')  // 移除特殊字符
      .replace(/\s+/g, '-')      // 空格转连字符
      .replace(/-+/g, '-')       // 多个连字符合并
      .replace(/^-|-$/g, '');    // 移除首尾连字符

    // 如果处理后为空，使用时间戳
    if (!slug) {
      slug = `post-${Date.now().toString(36)}`;
    } else if (addTimestamp) {
      // 添加短时间戳避免重复
      slug = `${slug.substring(0, maxLength)}-${Date.now().toString(36)}`;
    }
  }

  return slug.substring(0, maxLength + 10); // 留出时间戳空间
}

/**
 * 检查 slug 是否有效（URL 友好）
 */
export function isValidSlug(slug: string): boolean {
  // 只允许小写字母、数字和连字符
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * 清理 slug，移除无效字符
 */
export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
