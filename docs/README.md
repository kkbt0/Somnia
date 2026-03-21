> 这是一些 AI 生成的文档，可能有用。

# Hugo Theme Somnia 文档

Somnia 是一个基于 Hugo 的静态网站主题，源自 [astro-theme-pure](https://github.com/cworld1/astro-theme-pure)。主题采用现代化的设计，支持暗色模式、响应式布局、搜索功能和目录导航等特性。

## 快速开始

### 安装主题

首先确保已安装 Hugo 扩展版本（0.158.0 及以上）：

```bash
hugo version
```

创建新站点或进入现有站点目录：

```bash
hugo new site my-site
cd my-site
```

克隆主题到 themes 目录：

```bash
git clone https://github.com/kkbt0/Somnia themes/Somnia
```

或使用 Hugo 模块方式：

```bash
hugo mod init github.com/kkbt0/Somnia
```

在 `hugo.toml` 中添加主题配置：

```toml
theme = ['Somnia']
```

### 运行开发服务器

```bash
hugo server -s exampleSite/ --disableFastRender
```

### 构建站点

```bash
hugo --minify -s exampleSite/
```

## 配置指南

### 基本配置

编辑 `hugo.toml` 文件：

```toml
baseURL = 'https://your-site.com/'
languageCode = 'zh-cn'
title = 'My Site'
theme = ['Somnia']

# 网站基本信息
[params]
description = '网站描述'
favicon = '/favicon/favicon.ico'
socialCard = '/images/social-card.png'

# 作者信息
[params.author]
name = "作者名称"
email = "email@example.com"
link = "https://your-site.com"
avatar = "/images/avatar.webp"
location = '所在地'
github = 'https://github.com/username'
bio = '个人简介'

# 本地化设置
[params.locale]
lang = 'zh-CN'
dateFormat = '2006年01月02日'
```

### 导航菜单配置

```toml
[params.header]
[[params.header.menu]]
title = '博客'
link = 'posts'
[[params.header.menu]]
title = '文档'
link = 'docs'
[[params.header.menu]]
title = '项目'
link = 'projects'
[[params.header.menu]]
title = '链接'
link = 'links'
[[params.header.menu]]
title = '关于'
link = 'about'
```

### 页脚配置

```toml
[params.footer]
powered = true  # 显示 "Powered by Hugo"

[params.footer.icp]
title = 'ICP备案号'
link = 'https://icp.gov.moe/?keyword=xxxx'
```

### 首页配置

```toml
[params.homepage]
posts = 5           # 首页显示的文章数量
quote = true        # 是否显示一言
```

### 内容页面配置

```toml
[params.content]
blogPageSize = 8    # 博客列表每页显示数量
```

### 功能开关

```toml
[params.features]
search = true       # 启用搜索功能
```

### 社交链接

```toml
[params.social]
github = 'https://github.com/'
```

### 技能展示配置

```toml
[[params.skills]]
title = '编程语言'
items = ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'Python']

[[params.skills]]
title = '前端框架'
items = ['React', 'Vue', 'Alpine.js', 'UnoCSS']

[[params.skills]]
title = '后端技术'
items = ['Go', 'Rust', 'Python', 'Node.js']
```

### 网站收藏配置

```toml
[[params.websites]]
name = '网站名称'
description = '网站描述'
url = 'https://example.com'
image = '/images/website-preview.webp'
```

### 认证信息配置

```toml
[params.education]
heading = '学历标题'
subheading = '学历副标题'
date = '2021年9月 - 2025年7月'
url = '#'

[params.certifications]
heading = '证书标题'
subheading = '证书副标题'
date = '2021年9月 - 2025年7月'
url = '#'
```

### 永久链接配置

```toml
[Permalinks]
posts = "/posts/:slug"  # 文章 URL 格式
```

### 网站地图配置

```toml
enableRobotsTXT = true

[sitemap]
changefreq = "weekly"
filename = "sitemap.xml"
priority = 0.5
```

## 内容创作

### 创建博客文章

在 `content/posts/` 目录下创建 Markdown 文件：

```markdown
---
title: '文章标题'
date: 2025-01-01T10:00:00+08:00
draft: false
tags: ['标签1', '标签2']
categories: ['分类']
---

文章内容...
```

### 创建文档页面

在 `content/docs/` 目录下创建文档，支持多级目录结构：

```markdown
---
title: '文档标题'
date: 2025-01-01T10:00:00+08:00
weight: 1  # 排序权重
---

文档内容...
```

### 创建关于页面

```markdown
---
title: '关于'
date: 2025-01-01T10:00:00+08:00
---

关于页面内容...
```

### 创建友链页面

创建 `content/links.md`：

```markdown
---
title: '友链'
date: 2025-01-01T10:00:00+08:00
---

{{< page/friend-cards-group >}}
```

### 创建项目页面

创建 `content/projects/index.md`：

```markdown
---
title: '项目'
date: 2025-01-01T10:00:00+08:00
---

## 项目展示

{{< page/projects-cards-group >}}
```

## 组件使用

### 卡片 (Card)

```markdown
{{< card href="链接" heading="标题" subheading="副标题" date="日期" >}}
额外内容
{{< /card >}}
```

### 折叠面板 (Collapse)

```markdown
{{< page/collapse title="点击展开" >}}
折叠内容
{{< /page/collapse >}}
```

### 提示框 (Callout)

```markdown
{{< callout title="提示标题" type="note" >}}
提示内容
{{< /callout >}}

{{< callout title="技巧标题" type="tip" >}}
技巧内容
{{< /callout >}}

{{< callout title="警告标题" type="caution" >}}
警告内容
{{< /callout >}}

{{< callout title="危险标题" type="danger" >}}
危险内容
{{< /callout >}}
```

支持的类型：`note`、`tip`、`caution`、`danger`

### 标签页 (Tabs)

```markdown
{{< tabs/tabs >}}

{{< tabs/tab "标签1" >}}
内容1
{{< /tabs/tab >}}

{{< tabs/tab "标签2" >}}
内容2
{{< /tabs/tab >}}

{{< /tabs/tabs >}}
```

### 时间线 (Timeline)

```markdown
{{< page/timeline >}}
2025-01-01 事件1
2025-01-02 事件2
2025-01-03 事件3
{{< /page/timeline >}}
```

### 步骤列表 (Steps)

```markdown
{{< steps >}}
1. 第一步
2. 第二步
3. 第三步
{{< /steps >}}
```

### 按钮 (Button)

```markdown
{{< page/button title="按钮文字" href="链接" variant="button" >}}
```

### 标签 (Label)

```markdown
{{< label title="标签文字" >}}
{{< label title="可点击标签" href="链接" >}}
```

### 剧透文本 (Spoiler)

```markdown
{{< page/spoiler >}}这是隐藏内容{{< /page/spoiler >}}
```

### 图标 (Icon)

```markdown
{{< icon/icon name="star" size="md" >}}
{{< icon/icon name="github" size="lg" >}}
```

支持通过 [Iconify](https://icon-sets.iconify.design/) 或 [MingCute](https://www.mingcute.com/) 扩展图标。

### GitHub 卡片

```markdown
{{< github-card repo="用户名/仓库名" >}}
```

### 链接预览

```markdown
{{< link-preview href="https://example.com" >}}
```

### 二维码

```markdown
{{< qrcode text="https://example.com" class="样式类" >}}
```

### B站视频嵌入

```markdown
{{< bilibili BV号 >}}
例如：
{{< bilibili BV15t4y1C75u >}}
```

### 日期格式化

```markdown
{{< formatted-date "时间戳" >}}
例如：
{{< formatted-date "1735660800000" >}}
```

### 引用块

```markdown
{{< quote >}}
引用内容
{{< /quote >}}
```

### 卡片列表

```markdown
{{< card-list title="列表标题" >}}
- 列表项1
- 列表项2
- 列表项3
{{< /card-list >}}
```

### Toast 提示

需要在页面中引入 JavaScript：

```markdown
{{< script >}}
<script>
    showToast("提示内容", 3000);
</script>
{{< /script >}}
```

### 图片缩放 (Medium Zoom)

主题已内置 Medium Zoom 支持，直接在 Markdown 中使用图片即可自动启用点击放大功能：

```markdown
![图片描述](图片链接 "图片标题")
```

## 自定义样式

###UnoCSS 配置

主题使用 UnoCSS 进行样式管理。配置文件位于 `uno.config.ts`。

运行 UnoCSS 开发模式：

```bash
pnpm run dev
```

构建 UnoCSS：

```bash
pnpm run build
```

### 代码高亮主题

主题支持多种代码高亮样式，位于 `assets/css/code/` 目录：

- monokai.css
- onedark.css
- github.css
- vs.css

## 搜索功能

主题使用 Pagefind 实现静态搜索。构建搜索索引：

```bash
pagefind_extended --site exampleSite/public
```

或使用 Just 任务：

```bash
just pf
```

## 主题命令

主题提供以下 Just 任务：

```bash
just dev          # 启动开发服务器
just build        # 构建站点
just pf           # 构建搜索索引
just css          # 开发 UnoCSS
just css-build    # 构建 UnoCSS
```

## 注意事项

1. Hugo 版本要求 0.158.0 及以上（需扩展版本）
2. 标签页组件中使用 `|markdownify` 可能会导致部分短代码字符转义问题
3. 某些组件需要在 Markdown 中直接使用 HTML 标签以确保正确渲染