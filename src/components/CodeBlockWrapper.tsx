'use client';

import { useEffect } from 'react';

export function CodeBlockWrapper() {
  useEffect(() => {
    // 为所有代码块添加复制按钮
    const addCopyButtons = () => {
      const codeBlocks = document.querySelectorAll('.prose-custom pre');
      
      codeBlocks.forEach((pre) => {
        // 避免重复添加
        if (pre.querySelector('.copy-code-btn')) return;
        
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        
        // 创建复制按钮
        const button = document.createElement('button');
        button.className = 'copy-code-btn';
        button.innerHTML = `
          <svg class="copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <svg class="check-icon hidden" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span class="copy-text">复制</span>
        `;
        button.setAttribute('aria-label', '复制代码');
        button.setAttribute('title', '复制代码');
        
        // 点击复制
        button.addEventListener('click', async () => {
          const code = pre.querySelector('code');
          if (!code) return;
          
          try {
            await navigator.clipboard.writeText(code.textContent || '');
            
            // 显示成功状态
            button.classList.add('copied');
            const copyIcon = button.querySelector('.copy-icon');
            const checkIcon = button.querySelector('.check-icon');
            const copyText = button.querySelector('.copy-text');
            
            if (copyIcon) copyIcon.classList.add('hidden');
            if (checkIcon) checkIcon.classList.remove('hidden');
            if (copyText) copyText.textContent = '已复制';
            
            // 2秒后恢复
            setTimeout(() => {
              button.classList.remove('copied');
              if (copyIcon) copyIcon.classList.remove('hidden');
              if (checkIcon) checkIcon.classList.add('hidden');
              if (copyText) copyText.textContent = '复制';
            }, 2000);
          } catch (err) {
            console.error('复制失败:', err);
          }
        });
        
        // 包装 pre 元素
        pre.parentNode?.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
        wrapper.appendChild(button);
      });
    };

    // 延迟执行，确保内容已渲染
    const timer = setTimeout(addCopyButtons, 100);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
