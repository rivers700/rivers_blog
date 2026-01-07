---
title: 01-HTML基础
date: '2026-01-06'
excerpt: "\U0001F4C4 HTML基础\r \r > HTML（HyperText Markup Language）是构建网页的基础语言。本章将从零开始，带你理解HTML的核心概念，并通过实际案例帮助你掌握这门技术。"
tags:
  - TypeScript
  - JavaScript
  - Node.js
  - Python
  - CSS
category: tech
subCategory: frontend
---
# 📄 HTML基础

> HTML（HyperText Markup Language）是构建网页的基础语言。本章将从零开始，带你理解HTML的核心概念，并通过实际案例帮助你掌握这门技术。

## 🎯 本章学习目标

学完本章，你将能够：
- 理解HTML的基本概念和作用
- 掌握常用HTML标签的使用
- 理解HTML5语义化的重要性
- 能够独立编写规范的HTML页面
- 应对HTML相关的面试题

---

## 一、HTML是什么？

### 1.1 通俗理解

想象你要盖一栋房子：
- **HTML** = 房子的骨架结构（墙壁、门窗的位置）
- **CSS** = 房子的装修（颜色、样式）
- **JavaScript** = 房子的智能系统（开关灯、自动门）

HTML就是告诉浏览器"这里是标题"、"这里是段落"、"这里是图片"的语言。

### 1.2 HTML文档的基本结构

每个HTML文件都有固定的结构，就像写信有固定格式一样：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的第一个网页</title>
</head>
<body>
    <h1>欢迎来到我的网站</h1>
    <p>这是我的第一个网页，很高兴见到你！</p>
</body>
</html>
```

**逐行解释：**

| 代码 | 作用 | 通俗解释 |
|------|------|---------|
| `<!DOCTYPE html>` | 文档类型声明 | 告诉浏览器"这是HTML5文档" |
| `<html lang="zh-CN">` | 根元素 | 整个网页的"外壳"，lang表示语言是中文 |
| `<head>` | 头部信息 | 存放网页的"身份证信息"，用户看不到 |
| `<meta charset="UTF-8">` | 字符编码 | 让网页能正确显示中文 |
| `<meta name="viewport">` | 视口设置 | 让网页在手机上也能正常显示 |
| `<title>` | 网页标题 | 显示在浏览器标签页上的文字 |
| `<body>` | 主体内容 | 用户能看到的所有内容都放这里 |



---

## 二、HTML5语义化标签

### 2.1 什么是语义化？

**语义化**就是使用"有意义"的标签来描述内容。

**不好的写法（全是div）：**
```html
<div class="header">网站头部</div>
<div class="nav">导航栏</div>
<div class="main">主要内容</div>
<div class="footer">网站底部</div>
```

**好的写法（语义化标签）：**
```html
<header>网站头部</header>
<nav>导航栏</nav>
<main>主要内容</main>
<footer>网站底部</footer>
```

### 2.2 为什么要语义化？（面试常问）

| 好处 | 解释 |
|------|------|
| **对开发者友好** | 一看标签就知道是什么内容，代码更易读 |
| **对搜索引擎友好** | 搜索引擎能更好理解页面结构，有利于SEO |
| **对无障碍访问友好** | 屏幕阅读器能正确朗读内容，帮助视障用户 |
| **便于维护** | 结构清晰，后期修改更方便 |

### 2.3 常用语义化标签详解

```html
<!-- 页面级语义标签 -->
<header>    <!-- 页面或区块的头部，通常包含logo、导航 -->
<nav>       <!-- 导航链接区域 -->
<main>      <!-- 页面主要内容，每个页面只能有一个 -->
<aside>     <!-- 侧边栏，与主内容相关但独立的内容 -->
<footer>    <!-- 页面或区块的底部，通常包含版权、联系方式 -->

<!-- 内容级语义标签 -->
<article>   <!-- 独立的文章内容，可以单独拿出来阅读 -->
<section>   <!-- 文档中的一个区块，通常有标题 -->
<figure>    <!-- 图片、图表等独立内容 -->
<figcaption><!-- figure的标题说明 -->
<time>      <!-- 时间日期 -->
<mark>      <!-- 高亮/标记文本 -->
```

### 2.4 实战案例：博客文章页面

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的博客 - 前端学习心得</title>
</head>
<body>
    <!-- 页面头部 -->
    <header>
        <h1>小明的技术博客</h1>
        <nav>
            <ul>
                <li><a href="/">首页</a></li>
                <li><a href="/articles">文章</a></li>
                <li><a href="/about">关于我</a></li>
            </ul>
        </nav>
    </header>
    
    <!-- 主要内容区 -->
    <main>
        <!-- 文章内容 -->
        <article>
            <header>
                <h2>前端学习心得分享</h2>
                <p>
                    <time datetime="2026-01-04">2026年1月4日</time>
                    · 作者：小明
                </p>
            </header>
            
            <section>
                <h3>为什么选择前端？</h3>
                <p>前端开发是最容易看到成果的编程领域...</p>
            </section>
            
            <section>
                <h3>学习路线推荐</h3>
                <p>建议从HTML和CSS开始学起...</p>
                
                <figure>
                    <img src="learning-path.png" alt="前端学习路线图">
                    <figcaption>图1：前端学习路线图</figcaption>
                </figure>
            </section>
            
            <footer>
                <p>标签：<a href="/tag/frontend">前端</a>、<a href="/tag/learning">学习</a></p>
            </footer>
        </article>
        
        <!-- 侧边栏 -->
        <aside>
            <h3>热门文章</h3>
            <ul>
                <li><a href="#">JavaScript入门指南</a></li>
                <li><a href="#">CSS布局技巧</a></li>
            </ul>
        </aside>
    </main>
    
    <!-- 页面底部 -->
    <footer>
        <p>© 2026 小明的博客. 保留所有权利.</p>
    </footer>
</body>
</html>
```


---

## 三、常用HTML标签详解

### 3.1 文本标签

```html
<!-- 标题标签：h1最重要，h6最不重要 -->
<h1>一级标题（页面只应有一个h1）</h1>
<h2>二级标题</h2>
<h3>三级标题</h3>
<h4>四级标题</h4>
<h5>五级标题</h5>
<h6>六级标题</h6>

<!-- 段落和文本 -->
<p>这是一个段落，段落之间会自动换行并有间距。</p>
<span>行内文本，不会换行</span>
<strong>重要文本（加粗，有语义）</strong>
<b>加粗文本（纯样式，无语义）</b>
<em>强调文本（斜体，有语义）</em>
<i>斜体文本（纯样式，无语义）</i>
<mark>高亮标记文本</mark>
<del>删除线文本</del>
<ins>下划线文本（表示新增）</ins>
<small>小号文本</small>
<sub>下标文本 H<sub>2</sub>O</sub>
<sup>上标文本 x<sup>2</sup></sup>

<!-- 换行和分割 -->
<br>  <!-- 换行 -->
<hr>  <!-- 水平分割线 -->
```

### 3.2 链接和图片

```html
<!-- 超链接 -->
<a href="https://www.example.com">普通链接</a>
<a href="https://www.example.com" target="_blank">新标签页打开</a>
<a href="mailto:test@example.com">发送邮件</a>
<a href="tel:13800138000">拨打电话</a>
<a href="#section1">页内锚点跳转</a>
<a href="document.pdf" download>下载文件</a>

<!-- 图片 -->
<img 
    src="photo.jpg" 
    alt="这是图片的描述文字，图片加载失败时显示"
    width="300"
    height="200"
    loading="lazy"  <!-- 懒加载，提升性能 -->
>

<!-- 响应式图片 -->
<picture>
    <source media="(min-width: 800px)" srcset="large.jpg">
    <source media="(min-width: 400px)" srcset="medium.jpg">
    <img src="small.jpg" alt="响应式图片">
</picture>
```

**重要提示：**
- `alt`属性必须填写，这是无障碍访问的要求，也有利于SEO
- 使用`loading="lazy"`可以实现图片懒加载，提升页面性能

### 3.3 列表

```html
<!-- 无序列表：用于没有顺序的项目 -->
<ul>
    <li>苹果</li>
    <li>香蕉</li>
    <li>橙子</li>
</ul>

<!-- 有序列表：用于有顺序的步骤 -->
<ol>
    <li>打开冰箱门</li>
    <li>把大象放进去</li>
    <li>关上冰箱门</li>
</ol>

<!-- 定义列表：用于术语解释 -->
<dl>
    <dt>HTML</dt>
    <dd>超文本标记语言，用于构建网页结构</dd>
    
    <dt>CSS</dt>
    <dd>层叠样式表，用于美化网页</dd>
</dl>

<!-- 嵌套列表 -->
<ul>
    <li>前端技术
        <ul>
            <li>HTML</li>
            <li>CSS</li>
            <li>JavaScript</li>
        </ul>
    </li>
    <li>后端技术
        <ul>
            <li>Node.js</li>
            <li>Python</li>
        </ul>
    </li>
</ul>
```

### 3.4 表格

```html
<table>
    <!-- 表格标题 -->
    <caption>学生成绩表</caption>
    
    <!-- 表头 -->
    <thead>
        <tr>
            <th>姓名</th>
            <th>语文</th>
            <th>数学</th>
            <th>英语</th>
        </tr>
    </thead>
    
    <!-- 表格主体 -->
    <tbody>
        <tr>
            <td>张三</td>
            <td>90</td>
            <td>85</td>
            <td>92</td>
        </tr>
        <tr>
            <td>李四</td>
            <td>88</td>
            <td>95</td>
            <td>87</td>
        </tr>
    </tbody>
    
    <!-- 表格底部 -->
    <tfoot>
        <tr>
            <td>平均分</td>
            <td>89</td>
            <td>90</td>
            <td>89.5</td>
        </tr>
    </tfoot>
</table>

<!-- 合并单元格 -->
<table>
    <tr>
        <td rowspan="2">跨2行</td>  <!-- 纵向合并 -->
        <td>A</td>
        <td>B</td>
    </tr>
    <tr>
        <td colspan="2">跨2列</td>  <!-- 横向合并 -->
    </tr>
</table>
```


---

## 四、HTML5表单（重点）

表单是用户与网页交互的重要方式，也是面试常考内容。

### 4.1 基本表单结构

```html
<form action="/api/submit" method="POST">
    <!-- 文本输入 -->
    <div>
        <label for="username">用户名：</label>
        <input 
            type="text" 
            id="username" 
            name="username" 
            placeholder="请输入用户名"
            required
            minlength="3"
            maxlength="20"
        >
    </div>
    
    <!-- 密码输入 -->
    <div>
        <label for="password">密码：</label>
        <input 
            type="password" 
            id="password" 
            name="password"
            required
            minlength="6"
        >
    </div>
    
    <!-- 提交按钮 -->
    <button type="submit">登录</button>
    <button type="reset">重置</button>
</form>
```

**重要属性说明：**
- `action`：表单提交的目标地址
- `method`：提交方式，GET（数据在URL中）或POST（数据在请求体中）
- `for`和`id`：label的for要和input的id对应，点击label可以聚焦input
- `name`：提交时的字段名
- `required`：必填项
- `placeholder`：输入提示

### 4.2 HTML5新增输入类型

```html
<!-- 邮箱：自动验证邮箱格式 -->
<input type="email" placeholder="请输入邮箱">

<!-- 电话：移动端会弹出数字键盘 -->
<input type="tel" placeholder="请输入手机号">

<!-- 网址：自动验证URL格式 -->
<input type="url" placeholder="请输入网址">

<!-- 数字：只能输入数字 -->
<input type="number" min="0" max="100" step="1">

<!-- 范围滑块 -->
<input type="range" min="0" max="100" value="50">

<!-- 日期选择器 -->
<input type="date">
<input type="time">
<input type="datetime-local">
<input type="month">
<input type="week">

<!-- 颜色选择器 -->
<input type="color" value="#ff0000">

<!-- 搜索框：有清除按钮 -->
<input type="search" placeholder="搜索...">

<!-- 文件上传 -->
<input type="file" accept="image/*" multiple>
<!-- accept限制文件类型，multiple允许多选 -->
```

### 4.3 其他表单元素

```html
<!-- 多行文本 -->
<textarea 
    name="content" 
    rows="5" 
    cols="30"
    placeholder="请输入内容..."
></textarea>

<!-- 下拉选择 -->
<select name="city">
    <option value="">请选择城市</option>
    <optgroup label="直辖市">
        <option value="beijing">北京</option>
        <option value="shanghai">上海</option>
    </optgroup>
    <optgroup label="省会">
        <option value="guangzhou">广州</option>
        <option value="hangzhou">杭州</option>
    </optgroup>
</select>

<!-- 单选按钮：同一组name相同 -->
<div>
    <input type="radio" id="male" name="gender" value="male">
    <label for="male">男</label>
    
    <input type="radio" id="female" name="gender" value="female">
    <label for="female">女</label>
</div>

<!-- 复选框 -->
<div>
    <input type="checkbox" id="agree" name="agree" value="yes">
    <label for="agree">我同意用户协议</label>
</div>

<!-- 数据列表（输入建议） -->
<input list="browsers" placeholder="选择浏览器">
<datalist id="browsers">
    <option value="Chrome">
    <option value="Firefox">
    <option value="Safari">
    <option value="Edge">
</datalist>
```

### 4.4 表单验证属性

```html
<input required>                      <!-- 必填 -->
<input minlength="6" maxlength="20">  <!-- 长度限制 -->
<input min="0" max="100">             <!-- 数值范围 -->
<input pattern="[0-9]{11}">           <!-- 正则验证（11位数字） -->
<input disabled>                      <!-- 禁用 -->
<input readonly>                      <!-- 只读 -->
<input autofocus>                     <!-- 自动聚焦 -->
<input autocomplete="off">            <!-- 关闭自动完成 -->
```

### 4.5 实战案例：用户注册表单

```html
<form action="/api/register" method="POST">
    <h2>用户注册</h2>
    
    <div class="form-group">
        <label for="email">邮箱：</label>
        <input 
            type="email" 
            id="email" 
            name="email" 
            required
            placeholder="请输入邮箱"
        >
    </div>
    
    <div class="form-group">
        <label for="phone">手机号：</label>
        <input 
            type="tel" 
            id="phone" 
            name="phone" 
            required
            pattern="1[3-9][0-9]{9}"
            placeholder="请输入11位手机号"
        >
    </div>
    
    <div class="form-group">
        <label for="password">密码：</label>
        <input 
            type="password" 
            id="password" 
            name="password" 
            required
            minlength="8"
            placeholder="至少8位，包含字母和数字"
        >
    </div>
    
    <div class="form-group">
        <label for="birthday">生日：</label>
        <input type="date" id="birthday" name="birthday">
    </div>
    
    <div class="form-group">
        <label>性别：</label>
        <input type="radio" id="male" name="gender" value="male">
        <label for="male">男</label>
        <input type="radio" id="female" name="gender" value="female">
        <label for="female">女</label>
    </div>
    
    <div class="form-group">
        <label for="avatar">头像：</label>
        <input type="file" id="avatar" name="avatar" accept="image/*">
    </div>
    
    <div class="form-group">
        <input type="checkbox" id="agree" name="agree" required>
        <label for="agree">我已阅读并同意<a href="/terms">用户协议</a></label>
    </div>
    
    <button type="submit">注册</button>
</form>
```


---

## 五、HTML5多媒体

### 5.1 音频

```html
<audio controls>
    <source src="music.mp3" type="audio/mpeg">
    <source src="music.ogg" type="audio/ogg">
    您的浏览器不支持音频播放
</audio>

<!-- 常用属性 -->
<audio 
    controls      <!-- 显示控制条 -->
    autoplay      <!-- 自动播放（大多数浏览器会阻止） -->
    loop          <!-- 循环播放 -->
    muted         <!-- 静音 -->
    preload="auto"  <!-- 预加载：auto/metadata/none -->
>
```

### 5.2 视频

```html
<video controls width="640" height="360" poster="cover.jpg">
    <source src="video.mp4" type="video/mp4">
    <source src="video.webm" type="video/webm">
    您的浏览器不支持视频播放
</video>

<!-- 常用属性 -->
<video
    controls      <!-- 显示控制条 -->
    autoplay      <!-- 自动播放（需配合muted） -->
    muted         <!-- 静音 -->
    loop          <!-- 循环播放 -->
    poster="cover.jpg"  <!-- 封面图 -->
    playsinline   <!-- iOS内联播放 -->
>
```

### 5.3 嵌入内容

```html
<!-- 嵌入网页 -->
<iframe 
    src="https://www.example.com" 
    width="600" 
    height="400"
    frameborder="0"
    allowfullscreen
></iframe>

<!-- 嵌入视频（如B站、YouTube） -->
<iframe 
    src="//player.bilibili.com/player.html?bvid=BV1xx411c7mD"
    width="800" 
    height="450"
    allowfullscreen
></iframe>
```

---

## 六、其他重要知识点

### 6.1 块级元素 vs 行内元素

| 类型 | 特点 | 常见标签 |
|------|------|---------|
| **块级元素** | 独占一行，可设置宽高 | div, p, h1-h6, ul, li, header, footer, section, article |
| **行内元素** | 不独占一行，宽高由内容决定 | span, a, strong, em, img, input, button |
| **行内块元素** | 不独占一行，但可设置宽高 | img, input, button |

```html
<!-- 块级元素示例 -->
<div>我独占一行</div>
<div>我也独占一行</div>

<!-- 行内元素示例 -->
<span>我不独占一行</span>
<span>我们在同一行</span>
```

### 6.2 HTML实体字符

当需要在页面显示特殊字符时使用：

| 显示 | 代码 | 说明 |
|------|------|------|
| `<` | `&lt;` | 小于号 |
| `>` | `&gt;` | 大于号 |
| `&` | `&amp;` | 和号 |
| `"` | `&quot;` | 双引号 |
| `'` | `&#39;` | 单引号 |
| ` ` | `&nbsp;` | 空格 |
| `©` | `&copy;` | 版权符号 |
| `®` | `&reg;` | 注册商标 |
| `™` | `&trade;` | 商标 |

### 6.3 meta标签详解

```html
<!-- 基础设置 -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- SEO相关 -->
<meta name="description" content="网页描述，显示在搜索结果中">
<meta name="keywords" content="关键词1,关键词2,关键词3">
<meta name="author" content="作者名">

<!-- 社交媒体分享（Open Graph） -->
<meta property="og:title" content="分享标题">
<meta property="og:description" content="分享描述">
<meta property="og:image" content="分享图片URL">

<!-- 浏览器行为 -->
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="robots" content="index,follow">  <!-- 允许搜索引擎索引 -->
<meta http-equiv="refresh" content="5;url=https://example.com">  <!-- 5秒后跳转 -->
```

### 6.4 Web无障碍访问（Accessibility）

无障碍访问是指让所有人（包括残障人士）都能使用网站。

```html
<!-- 1. 为图片添加alt属性 -->
<img src="logo.png" alt="公司Logo">

<!-- 2. 使用label关联表单 -->
<label for="name">姓名：</label>
<input type="text" id="name">

<!-- 3. 使用ARIA属性增强语义 -->
<button aria-label="关闭弹窗">×</button>
<div role="alert">操作成功！</div>
<nav aria-label="主导航">...</nav>

<!-- 4. 确保键盘可访问 -->
<div tabindex="0">可以用Tab键聚焦的元素</div>

<!-- 5. 使用语义化标签 -->
<main>主要内容</main>
<nav>导航</nav>
```


---

## 📝 面试题精选（附详细答案）

### 1. DOCTYPE的作用是什么？不写会怎样？

**答案：**

DOCTYPE（文档类型声明）告诉浏览器使用哪种HTML版本来解析文档。

```html
<!DOCTYPE html>  <!-- HTML5的声明方式 -->
```

**不写DOCTYPE会怎样？**
- 浏览器会进入**怪异模式（Quirks Mode）**
- 在怪异模式下，浏览器会模拟老版本浏览器的行为
- 可能导致CSS盒模型计算方式不同，页面显示异常

**写了DOCTYPE：**
- 浏览器进入**标准模式（Standards Mode）**
- 按照W3C标准渲染页面

**面试加分回答：** 可以通过`document.compatMode`查看当前模式，返回`CSS1Compat`是标准模式，返回`BackCompat`是怪异模式。

---

### 2. 什么是HTML语义化？为什么重要？

**答案：**

**语义化**是指使用恰当的HTML标签来表达内容的含义，而不是只用div和span。

**为什么重要（4个方面）：**

1. **对开发者友好**
   - 代码可读性更好，一看标签就知道内容是什么
   - 便于团队协作和后期维护

2. **对搜索引擎友好（SEO）**
   - 搜索引擎爬虫能更好地理解页面结构
   - 有助于提高搜索排名

3. **对无障碍访问友好**
   - 屏幕阅读器能正确解读页面结构
   - 帮助视障用户理解内容

4. **对浏览器友好**
   - 在没有CSS的情况下也能呈现良好的结构
   - 有利于不同设备的渲染

**示例对比：**
```html
<!-- 不好 -->
<div class="header">
    <div class="nav">导航</div>
</div>

<!-- 好 -->
<header>
    <nav>导航</nav>
</header>
```

---

### 3. src和href的区别？

**答案：**

| 属性 | 全称 | 用途 | 特点 |
|------|------|------|------|
| `src` | source | 引入资源 | **替换**当前元素，会阻塞页面加载 |
| `href` | hypertext reference | 建立链接 | **关联**外部资源，不阻塞页面加载 |

**src的使用场景：**
```html
<img src="image.jpg">        <!-- 引入图片 -->
<script src="app.js"></script>  <!-- 引入JS，会阻塞 -->
<iframe src="page.html"></iframe>  <!-- 引入页面 -->
<video src="video.mp4"></video>  <!-- 引入视频 -->
```

**href的使用场景：**
```html
<a href="page.html">链接</a>  <!-- 超链接 -->
<link href="style.css" rel="stylesheet">  <!-- 引入CSS，不阻塞 -->
```

**关键区别：**
- `src`会暂停其他资源的下载，直到该资源加载完成（阻塞）
- `href`不会阻塞其他资源的加载（并行下载）

---

### 4. script标签的async和defer属性有什么区别？

**答案：**

```html
<script src="app.js"></script>           <!-- 默认：阻塞HTML解析 -->
<script src="app.js" async></script>     <!-- 异步加载，加载完立即执行 -->
<script src="app.js" defer></script>     <!-- 异步加载，HTML解析完再执行 -->
```

**图解执行顺序：**

```
默认（无属性）：
HTML解析 ──暂停──> 下载JS ──> 执行JS ──> 继续HTML解析

async：
HTML解析 ─────────────────────────────> 
         └─ 下载JS ─> 执行JS（可能在任何时候）

defer：
HTML解析 ─────────────────────────────> 执行JS
         └─ 下载JS ─────────────────┘
```

| 属性 | 加载方式 | 执行时机 | 执行顺序 | 适用场景 |
|------|----------|----------|----------|----------|
| 无 | 同步 | 立即执行 | 按顺序 | 需要立即执行的脚本 |
| async | 异步 | 加载完立即执行 | 不保证顺序 | 独立脚本（如统计代码） |
| defer | 异步 | DOM解析完后执行 | 按顺序 | 依赖DOM的脚本 |

**使用建议：**
- 如果脚本之间有依赖关系，用`defer`
- 如果脚本独立，不依赖DOM，用`async`
- 如果脚本很小且需要立即执行，放在`</body>`前

---

### 5. 行内元素和块级元素的区别？如何转换？

**答案：**

| 特性 | 块级元素 | 行内元素 |
|------|----------|----------|
| 是否独占一行 | 是 | 否 |
| 能否设置宽高 | 能 | 不能（img除外） |
| 默认宽度 | 父元素的100% | 内容的宽度 |
| 能否包含其他元素 | 可以包含块级和行内 | 只能包含行内元素 |
| margin/padding | 四个方向都有效 | 只有左右有效 |

**常见块级元素：** div, p, h1-h6, ul, ol, li, header, footer, section, article

**常见行内元素：** span, a, strong, em, img, input, button

**转换方式：**
```css
/* 行内变块级 */
span { display: block; }

/* 块级变行内 */
div { display: inline; }

/* 行内块：不独占一行，但可设置宽高 */
span { display: inline-block; }
```

---

### 6. HTML5有哪些新特性？

**答案：**

1. **语义化标签**
   - header, footer, nav, article, section, aside, main
   - figure, figcaption, time, mark

2. **表单增强**
   - 新的input类型：email, tel, url, number, date, color, range
   - 新的属性：placeholder, required, pattern, autofocus

3. **多媒体支持**
   - audio和video标签，无需Flash
   - 支持多种格式：mp4, webm, ogg

4. **Canvas绘图**
   - 通过JavaScript进行2D绑定绑定绑定绘图
   - 可以绑定绘制图形、动画、游戏

5. **本地存储**
   - localStorage：永久存储
   - sessionStorage：会话存储

6. **其他API**
   - Geolocation：地理定位
   - Web Workers：后台运行JavaScript
   - WebSocket：全双工通信
   - Drag and Drop：拖放API

---

### 7. 如何实现图片懒加载？

**答案：**

**方法一：使用原生loading属性（最简单，推荐）**
```html
<img src="image.jpg" loading="lazy" alt="图片">
```
- 优点：简单，浏览器原生支持
- 缺点：老浏览器不支持

**方法二：使用Intersection Observer API**
```html
<img data-src="image.jpg" class="lazy" alt="图片">

<script>
// 创建观察器
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // 当图片进入视口
        if (entry.isIntersecting) {
            const img = entry.target;
            // 将data-src的值赋给src
            img.src = img.dataset.src;
            // 停止观察这个图片
            observer.unobserve(img);
        }
    });
});

// 观察所有懒加载图片
document.querySelectorAll('.lazy').forEach(img => {
    observer.observe(img);
});
</script>
```

**方法三：监听scroll事件（老方法，不推荐）**
```javascript
function lazyLoad() {
    const images = document.querySelectorAll('.lazy');
    images.forEach(img => {
        if (img.getBoundingClientRect().top < window.innerHeight) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        }
    });
}

window.addEventListener('scroll', lazyLoad);
```

---

### 8. 什么是Web无障碍（Accessibility）？如何实现？

**答案：**

Web无障碍是指让所有人（包括残障人士）都能使用网站。

**实现方法：**

1. **使用语义化标签**
```html
<header>头部</header>
<nav>导航</nav>
<main>主要内容</main>
```

2. **为图片添加alt属性**
```html
<img src="chart.png" alt="2025年销售数据柱状图，显示Q1销售额最高">
```

3. **使用label关联表单**
```html
<label for="email">邮箱：</label>
<input type="email" id="email">
```

4. **确保足够的颜色对比度**
- 文字和背景的对比度至少4.5:1

5. **支持键盘导航**
```html
<button>可以用Tab聚焦</button>
<div tabindex="0">也可以用Tab聚焦</div>
```

6. **使用ARIA属性**
```html
<button aria-label="关闭弹窗">×</button>
<div role="alert">操作成功！</div>
<div aria-hidden="true">屏幕阅读器会忽略这个</div>
```

---

## 💡 学习建议

1. **多动手写HTML**：不要只看不练，每学一个标签就写代码验证
2. **使用开发者工具**：按F12查看网页结构，学习优秀网站的HTML写法
3. **养成语义化习惯**：从一开始就使用语义化标签，不要全用div
4. **注意无障碍访问**：为图片添加alt，使用label关联表单
5. **验证HTML**：使用W3C验证器检查HTML是否规范

---

## 🎯 本章小结

学完本章，你应该掌握了：
- [x] HTML文档的基本结构
- [x] 常用HTML标签的使用
- [x] HTML5语义化标签
- [x] 表单的创建和验证
- [x] 多媒体标签的使用
- [x] 块级元素和行内元素的区别
- [x] Web无障碍访问的基本概念

---

*下一章：[CSS基础与进阶](./02-CSS基础与进阶.md)*
