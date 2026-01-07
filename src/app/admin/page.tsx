'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';

type Category = 'tech' | 'life' | 'tools';
type Tab = 'posts' | 'upload' | 'write' | 'categories';

interface SubCategory {
  value: string;
  label: string;
  icon: string;
  children?: SubCategory[];
}

interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  subCategory?: string;
  excerpt?: string;
  tags?: string[];
  content?: string;
}

const categories = [
  { value: 'tech', label: '技术分享', icon: '💻' },
  { value: 'life', label: '生活随笔', icon: '🌱' },
  { value: 'tools', label: '实用工具', icon: '🛠️' },
];

const defaultSubCategories: SubCategory[] = [
  { value: 'frontend', label: '前端开发', icon: '🎨', children: [] },
  { value: 'backend', label: '后端开发', icon: '⚙️', children: [] },
  { value: 'ai', label: 'AI / 机器学习', icon: '🤖', children: [] },
  { value: 'other', label: '其他技术', icon: '📚', children: [] },
];

// 常用标签
const commonTags = ['React', 'Vue', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'CSS', 'Git', 'Docker', 'API', 'AI', '教程', '实战'];

// 可选图标列表
const iconOptions = [
  // 技术相关
  '💻', '🖥️', '⌨️', '🖱️', '📱', '🔧', '⚙️', '🛠️', '🔩', '🔨',
  // 编程语言/框架
  '🎨', '🎯', '🚀', '⚡', '🔥', '💡', '🌟', '✨', '💎', '🎪',
  // 数据/AI
  '🤖', '🧠', '📊', '📈', '📉', '🔬', '🧪', '🔮', '🎲', '🧮',
  // 网络/云
  '☁️', '🌐', '🔗', '📡', '🛰️', '🌍', '🌏', '🌎', '📶', '🔌',
  // 安全/数据库
  '🔐', '🔒', '🔑', '🛡️', '💾', '💿', '📀', '🗄️', '📁', '📂',
  // 文档/学习
  '📚', '📖', '📝', '✏️', '📋', '📑', '🗒️', '📓', '📔', '📒',
  // 其他
  '🎮', '🎬', '🎵', '🎧', '📷', '🔍', '💬', '💭', '🏷️', '🎁',
];

// Token 存储 key
const TOKEN_KEY = 'admin_token';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const [subCategories, setSubCategories] = useState<SubCategory[]>(defaultSubCategories);
  const [showIconPicker, setShowIconPicker] = useState(false);
  // 文章列表
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  
  // 上传表单状态
  const [uploadCategory, setUploadCategory] = useState<Category>('tech');
  const [uploadSubCategory, setUploadSubCategory] = useState('frontend');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTags, setUploadTags] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  // 写作表单状态
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [writeCategory, setWriteCategory] = useState<Category>('tech');
  const [writeSubCategory, setWriteSubCategory] = useState('frontend');
  
  // 新分类表单
  const [newCatValue, setNewCatValue] = useState('');
  const [newCatLabel, setNewCatLabel] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📁');
  const [newCatParent, setNewCatParent] = useState<string>('');
  
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 检查本地存储的 Token
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedToken) {
      // 验证 Token 是否有效
      fetch('/api/auth', {
        headers: { 'Authorization': `Bearer ${storedToken}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.valid) {
            setAuthToken(storedToken);
            setIsLoggedIn(true);
          } else {
            localStorage.removeItem(TOKEN_KEY);
          }
        })
        .catch(() => {
          localStorage.removeItem(TOKEN_KEY);
        });
    }
  }, []);

  // 登录验证
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setLoginError('请输入密码');
      return;
    }
    
    setLoginLoading(true);
    setLoginError('');
    
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      
      if (data.success && data.token) {
        setAuthToken(data.token);
        localStorage.setItem(TOKEN_KEY, data.token);
        setIsLoggedIn(true);
        setLoginError('');
        setPassword(''); // 清除密码
      } else {
        setLoginError(data.error || '密码错误');
        setPassword('');
      }
    } catch {
      setLoginError('网络错误，请重试');
    } finally {
      setLoginLoading(false);
    }
  };

  // 退出登录
  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem(TOKEN_KEY);
    setIsLoggedIn(false);
    setPassword('');
  };

  // 加载分类配置
  const loadCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success && data.techSubCategories) {
        setSubCategories(data.techSubCategories);
      }
    } catch { /* 使用默认分类 */ }
  }, []);

  // 加载文章列表
  const loadPosts = useCallback(async () => {
    setPostsLoading(true);
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch {
      setMessage({ type: 'error', text: '加载文章列表失败' });
    } finally {
      setPostsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadCategories();
      loadPosts();
    }
  }, [isLoggedIn, loadCategories, loadPosts]);

  // 过滤和分页文章
  const filteredPosts = posts.filter(post => {
    const matchSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory === 'all' || post.category === filterCategory;
    return matchSearch && matchCategory;
  });
  
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  // 删除文章
  const handleDeletePost = async (slug: string) => {
    if (!authToken) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: '文章删除成功' });
        setPosts(posts.filter(p => p.slug !== slug));
        setDeleteConfirm(null);
      } else {
        setMessage({ type: 'error', text: data.error || '删除失败' });
      }
    } catch {
      setMessage({ type: 'error', text: '网络错误' });
    } finally {
      setLoading(false);
    }
  };

  // 加载文章详情进行编辑
  const handleEditPost = async (slug: string) => {
    try {
      const res = await fetch(`/api/posts/${slug}`);
      const data = await res.json();
      if (data.success) {
        setEditingPost(data.post);
        setTitle(data.post.title);
        setExcerpt(data.post.excerpt || '');
        setContent(data.post.content);
        setTags(data.post.tags?.join(', ') || '');
        setWriteCategory(data.post.category);
        setWriteSubCategory(data.post.subCategory || 'other');
        setActiveTab('write');
      }
    } catch {
      setMessage({ type: 'error', text: '加载文章失败' });
    }
  };

  // 保存编辑
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !title || !content || !authToken) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${editingPost.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title, content,
          excerpt: excerpt || title,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          category: writeCategory,
          subCategory: writeCategory === 'tech' ? writeSubCategory : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: '文章更新成功' });
        setEditingPost(null);
        resetForm();
        loadPosts();
        setActiveTab('posts');
      } else {
        setMessage({ type: 'error', text: data.error || '更新失败' });
      }
    } catch {
      setMessage({ type: 'error', text: '网络错误' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle(''); setExcerpt(''); setContent(''); setTags(''); setEditingPost(null);
  };

  // 添加子分类
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatValue || !newCatLabel || !authToken) {
      setMessage({ type: 'error', text: '请填写分类标识和名称' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({
          value: newCatValue, label: newCatLabel, icon: newCatIcon,
          parentCategory: 'tech',
          parentSubCategory: newCatParent || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: '分类添加成功' });
        setSubCategories(data.config.techSubCategories);
        setNewCatValue(''); setNewCatLabel(''); setNewCatIcon('📁'); setNewCatParent('');
      } else {
        setMessage({ type: 'error', text: data.error || '添加失败' });
      }
    } catch {
      setMessage({ type: 'error', text: '网络错误' });
    } finally {
      setLoading(false);
    }
  };

  // 删除子分类
  const handleDeleteCategory = async (value: string, parentValue?: string) => {
    if (!authToken) return;
    setLoading(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ value, parentCategory: 'tech', parentSubCategory: parentValue }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: '分类删除成功' });
        setSubCategories(data.config.techSubCategories);
      } else {
        setMessage({ type: 'error', text: data.error || '删除失败' });
      }
    } catch {
      setMessage({ type: 'error', text: '网络错误' });
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.md')) setUploadFile(file);
    else setMessage({ type: 'error', text: '只支持 .md 文件' });
  };

  const toggleUploadTag = (tag: string) => {
    setUploadTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) { setMessage({ type: 'error', text: '请选择文件' }); return; }

    setLoading(true); setMessage(null);
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('category', uploadCategory);
    if (uploadCategory === 'tech') formData.append('subCategory', uploadSubCategory);
    if (uploadTags.length > 0) formData.append('tags', uploadTags.join(','));

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: `上传成功！自动生成标签: ${data.tags?.join(', ') || '无'}` });
        setUploadFile(null); setUploadTags([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
        loadPosts();
      } else {
        setMessage({ type: 'error', text: data.error || '上传失败' });
      }
    } catch {
      setMessage({ type: 'error', text: '网络错误' });
    } finally {
      setLoading(false);
    }
  };

  const handleWrite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) return handleSaveEdit(e);
    if (!title || !content) { setMessage({ type: 'error', text: '标题和内容为必填项' }); return; }

    setLoading(true); setMessage(null);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({
          title, content, excerpt: excerpt || title,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          category: writeCategory,
          subCategory: writeCategory === 'tech' ? writeSubCategory : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: `发布成功！文章地址: /posts/${data.slug}` });
        resetForm(); loadPosts();
      } else {
        setMessage({ type: 'error', text: data.error || '发布失败' });
      }
    } catch {
      setMessage({ type: 'error', text: '网络错误' });
    } finally {
      setLoading(false);
    }
  };

  const getSubCategoryLabel = (value: string) => {
    const cat = subCategories.find(c => c.value === value);
    return cat ? `${cat.icon} ${cat.label}` : value;
  };

  // 登录页面
  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary-500/25">江</div>
            <h1 className="text-2xl font-display font-bold">管理后台</h1>
            <p className="text-sm text-neutral-500 mt-1">请输入密码登录</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="relative">
                <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
                  className={`w-full px-4 py-3 pl-11 rounded-xl border bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 transition-all ${
                    loginError ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-neutral-200 dark:border-neutral-800 focus:ring-primary-500/20 focus:border-primary-500'
                  }`}
                  placeholder="管理密码" />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              {loginError && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {loginError}
                </p>
              )}
            </div>
            <button type="submit" disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2">
              {loginLoading ? (
                <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>验证中...</>
              ) : '登录'}
            </button>
          </form>
          <p className="text-center text-sm text-neutral-400 mt-6">
            <Link href="/" className="hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">← 返回首页</Link>
          </p>
        </div>
      </div>
    );
  }

  // 管理面板
  return (
    <div className="container-wide py-8 md:py-12">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-bold">江</div>
          <div>
            <h1 className="text-xl font-display font-bold">文章管理</h1>
            <p className="text-xs text-neutral-500">创建和管理博客内容</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            退出
          </button>
          <Link href="/" className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            首页
          </Link>
        </div>
      </div>

      {/* 消息提示 */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'}`}>
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {message.type === 'success' ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
          </svg>
          <span className="text-sm flex-1">{message.text}</span>
          <button onClick={() => setMessage(null)} className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
      )}

      {/* Tab 切换 */}
      <div className="flex gap-1 p-1 mb-6 bg-neutral-100 dark:bg-neutral-800/50 rounded-xl overflow-x-auto">
        {[
          { key: 'posts', label: '文章列表', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
          { key: 'upload', label: '上传文件', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
          { key: 'write', label: editingPost ? '编辑文章' : '写文章', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
          { key: 'categories', label: '分类管理', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
        ].map((tab) => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key as Tab); if (tab.key !== 'write') resetForm(); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.key ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 文章列表 - 优化布局 */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {/* 搜索和筛选 */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
                placeholder="搜索文章标题..." />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
              className="px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm">
              <option value="all">全部分类</option>
              {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>)}
            </select>
            <button onClick={loadPosts} className="px-4 py-2.5 text-sm text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl flex items-center gap-2 border border-primary-200 dark:border-primary-800">
              <svg className={`w-4 h-4 ${postsLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              刷新
            </button>
          </div>

          {/* 统计信息 */}
          <div className="flex items-center justify-between text-sm text-neutral-500">
            <span>共 {filteredPosts.length} 篇文章 {searchQuery && `(搜索: "${searchQuery}")`}</span>
            {totalPages > 1 && <span>第 {currentPage} / {totalPages} 页</span>}
          </div>

          {postsLoading ? (
            <div className="text-center py-12"><svg className="w-8 h-8 mx-auto animate-spin text-neutral-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg><p className="text-neutral-500 mt-2">加载中...</p></div>
          ) : paginatedPosts.length === 0 ? (
            <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
              <svg className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <p className="text-neutral-500 mt-3">{searchQuery ? '未找到匹配的文章' : '暂无文章'}</p>
              {!searchQuery && <button onClick={() => setActiveTab('write')} className="mt-4 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg text-sm font-medium">写第一篇文章</button>}
            </div>
          ) : (
            <>
              <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">标题</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase hidden lg:table-cell">分类</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase hidden md:table-cell">日期</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase w-32">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                      {paginatedPosts.map((post) => (
                        <tr key={post.slug} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                          <td className="px-4 py-3">
                            <Link href={`/posts/${post.slug}`} target="_blank" className="font-medium text-neutral-900 dark:text-neutral-100 hover:text-primary-600 dark:hover:text-primary-400 line-clamp-1">{post.title}</Link>
                            <p className="text-xs text-neutral-400 mt-0.5 lg:hidden">{categories.find(c => c.value === post.category)?.label} · {post.date}</p>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-neutral-100 dark:bg-neutral-800">
                              {categories.find(c => c.value === post.category)?.icon} {categories.find(c => c.value === post.category)?.label}
                              {post.subCategory && <span className="text-neutral-400">/ {getSubCategoryLabel(post.subCategory)}</span>}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-500 hidden md:table-cell whitespace-nowrap">{post.date}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => handleEditPost(post.slug)} className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" title="编辑"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                              {deleteConfirm === post.slug ? (
                                <div className="flex items-center gap-1">
                                  <button onClick={() => handleDeletePost(post.slug)} className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">确认</button>
                                  <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 text-xs bg-neutral-200 dark:bg-neutral-700 rounded">取消</button>
                                </div>
                              ) : (
                                <button onClick={() => setDeleteConfirm(post.slug)} className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="删除"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* 分页 */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-800 disabled:opacity-50 hover:bg-neutral-100 dark:hover:bg-neutral-800">上一页</button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page = i + 1;
                    if (totalPages > 5) {
                      if (currentPage > 3) page = currentPage - 2 + i;
                      if (currentPage > totalPages - 2) page = totalPages - 4 + i;
                    }
                    return (
                      <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 text-sm rounded-lg ${currentPage === page ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>{page}</button>
                    );
                  })}
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-800 disabled:opacity-50 hover:bg-neutral-100 dark:hover:bg-neutral-800">下一页</button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* 上传表单 - 添加标签选择 */}
      {activeTab === 'upload' && (
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-3">选择分类</label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button key={cat.value} type="button" onClick={() => setUploadCategory(cat.value as Category)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${uploadCategory === cat.value ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'}`}>
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-xs font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
            {uploadCategory === 'tech' && (
              <div>
                <label className="block text-sm font-medium mb-3">技术子分类</label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {subCategories.map((cat) => (
                    <button key={cat.value} type="button" onClick={() => setUploadSubCategory(cat.value)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all ${uploadSubCategory === cat.value ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'}`}>
                      <span>{cat.icon}</span>
                      <span className="text-sm font-medium truncate">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 标签选择 */}
          <div>
            <label className="block text-sm font-medium mb-3">选择标签 <span className="text-neutral-400 font-normal">(可选，不选则自动生成)</span></label>
            <div className="flex flex-wrap gap-2">
              {commonTags.map(tag => (
                <button key={tag} type="button" onClick={() => toggleUploadTag(tag)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${uploadTags.includes(tag) ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'}`}>
                  {tag}
                </button>
              ))}
            </div>
            {uploadTags.length > 0 && <p className="text-xs text-neutral-500 mt-2">已选: {uploadTags.join(', ')}</p>}
          </div>

          {/* 文件上传区域 */}
          <div>
            <label className="block text-sm font-medium mb-3">上传 Markdown 文件</label>
            <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${isDragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : uploadFile ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400'}`}>
              <input ref={fileInputRef} type="file" accept=".md" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} className="hidden" />
              {uploadFile ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"><svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                  <div><p className="font-medium text-emerald-700 dark:text-emerald-300">{uploadFile.name}</p><p className="text-sm text-neutral-500 mt-1">{(uploadFile.size / 1024).toFixed(1)} KB</p></div>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setUploadFile(null); }} className="text-sm text-neutral-500 hover:text-red-500">移除文件</button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center"><svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg></div>
                  <div><p className="font-medium">拖拽文件到这里，或点击选择</p><p className="text-sm text-neutral-500 mt-1">支持 .md 格式，会自动解析 frontmatter</p></div>
                </div>
              )}
            </div>
          </div>

          <button type="submit" disabled={loading || !uploadFile} className="w-full py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2">
            {loading ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>上传中...</> : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>上传文件</>}
          </button>
        </form>
      )}

      {/* 写作/编辑表单 */}
      {activeTab === 'write' && (
        <form onSubmit={handleWrite} className="space-y-6">
          {editingPost && (
            <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                <span className="text-sm font-medium">正在编辑: {editingPost.title}</span>
              </div>
              <button type="button" onClick={() => { resetForm(); setActiveTab('posts'); }} className="text-sm text-amber-600 hover:text-amber-700">取消编辑</button>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-3">选择分类</label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button key={cat.value} type="button" onClick={() => setWriteCategory(cat.value as Category)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${writeCategory === cat.value ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'}`}>
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-xs font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
            {writeCategory === 'tech' && (
              <div>
                <label className="block text-sm font-medium mb-3">技术子分类</label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {subCategories.map((cat) => (
                    <button key={cat.value} type="button" onClick={() => setWriteSubCategory(cat.value)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all ${writeSubCategory === cat.value ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'}`}>
                      <span>{cat.icon}</span>
                      <span className="text-sm font-medium truncate">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">文章标题 <span className="text-red-500">*</span></label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-lg" placeholder="输入一个吸引人的标题" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">文章摘要</label>
              <input type="text" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" placeholder="简短描述（可选）" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">标签 <span className="text-neutral-400 font-normal text-xs">逗号分隔</span></label>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" placeholder="React, Next.js, 教程" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">文章内容 <span className="text-red-500">*</span> <span className="text-neutral-400 font-normal ml-2">支持 Markdown</span></label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-4 py-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-mono text-sm leading-relaxed resize-none" style={{ minHeight: '320px' }} placeholder="# 文章标题&#10;&#10;在这里开始写作..." />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <p className="text-sm text-neutral-500">{content.length} 字符</p>
            <button type="submit" disabled={loading || !title || !content} className="px-8 py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              {loading ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>{editingPost ? '保存中...' : '发布中...'}</> : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>{editingPost ? '保存修改' : '发布文章'}</>}
            </button>
          </div>
        </form>
      )}

      {/* 分类管理 - 支持嵌套子分类 */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          {/* 添加新分类 */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              添加技术子分类
            </h3>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">父分类 (可选)</label>
                  <select value={newCatParent} onChange={(e) => setNewCatParent(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm">
                    <option value="">顶级分类</option>
                    {subCategories.map(cat => <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">分类标识 (英文小写)</label>
                  <input type="text" value={newCatValue} onChange={(e) => setNewCatValue(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm" placeholder="如: frontend-roadmap" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">显示名称</label>
                  <input type="text" value={newCatLabel} onChange={(e) => setNewCatLabel(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm" placeholder="如: 前端技术路线" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">选择图标</label>
                  <div className="relative">
                    <button type="button" onClick={() => setShowIconPicker(!showIconPicker)} className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm flex items-center justify-between">
                      <span className="flex items-center gap-2"><span className="text-xl">{newCatIcon}</span><span className="text-neutral-500">点击选择图标</span></span>
                      <svg className={`w-4 h-4 text-neutral-400 transition-transform ${showIconPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {showIconPicker && (
                      <div className="absolute z-10 top-full left-0 right-0 mt-1 p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                        <div className="grid grid-cols-10 gap-1">
                          {iconOptions.map((icon, i) => (
                            <button key={i} type="button" onClick={() => { setNewCatIcon(icon); setShowIconPicker(false); }}
                              className={`w-8 h-8 flex items-center justify-center text-lg rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${newCatIcon === icon ? 'bg-primary-100 dark:bg-primary-900/30' : ''}`}>
                              {icon}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {newCatParent && <p className="text-xs text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-3 py-2 rounded-lg">📁 将在「{subCategories.find(c => c.value === newCatParent)?.label}」下创建子分类文件夹</p>}
              <button type="submit" disabled={loading || !newCatValue || !newCatLabel} className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 disabled:opacity-50 text-sm flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                添加分类
              </button>
            </form>
          </div>

          {/* 现有分类列表 */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
            <h3 className="text-lg font-semibold mb-4">技术子分类列表</h3>
            <div className="space-y-4">
              {subCategories.map((cat) => {
                const isProtected = ['frontend', 'backend', 'ai', 'other'].includes(cat.value);
                return (
                  <div key={cat.value} className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                    <div className={`flex items-center justify-between p-4 ${isProtected ? 'bg-neutral-50 dark:bg-neutral-800/50' : ''}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{cat.icon}</span>
                        <div>
                          <p className="font-medium">{cat.label}</p>
                          <p className="text-xs text-neutral-500">{cat.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {cat.children && cat.children.length > 0 && <span className="text-xs text-neutral-400 px-2 py-1 bg-neutral-100 dark:bg-neutral-700 rounded">{cat.children.length} 个子分类</span>}
                        {isProtected ? <span className="text-xs text-neutral-400 px-2 py-1 bg-neutral-100 dark:bg-neutral-700 rounded">默认</span> : (
                          <button onClick={() => handleDeleteCategory(cat.value)} disabled={loading} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" title="删除">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        )}
                      </div>
                    </div>
                    {/* 嵌套子分类 */}
                    {cat.children && cat.children.length > 0 && (
                      <div className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 p-3">
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {cat.children.map(child => (
                            <div key={child.value} className="flex items-center justify-between p-3 bg-white dark:bg-neutral-800 rounded-lg">
                              <div className="flex items-center gap-2">
                                <span>{child.icon}</span>
                                <div>
                                  <p className="text-sm font-medium">{child.label}</p>
                                  <p className="text-xs text-neutral-400">{child.value}</p>
                                </div>
                              </div>
                              <button onClick={() => handleDeleteCategory(child.value, cat.value)} disabled={loading} className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded" title="删除">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-neutral-500 mt-4">💡 提示：默认分类不可删除。删除分类前需先移除该分类下的所有文章。可以在父分类下创建子分类（如在「前端开发」下创建「前端技术路线」）。</p>
          </div>
        </div>
      )}
    </div>
  );
}
