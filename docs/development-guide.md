# Somnia 主题开发文档

> 一个基于 Hugo 主题。
> 作者：恐咖兵糖（kkbt0）
> 本文由 AI 生成，仅供参考。

---

## 目录

- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [环境要求与快速启动](#环境要求与快速启动)
- [开发命令](#开发命令)
- [前端构建体系](#前端构建体系)
  - [UnoCSS](#unocss)
  - [Alpine.js 组件](#alpinejs-组件)
  - [Async Alpine 异步加载机制](#async-alpine-异步加载机制)
  - [Swup.js 插件体系](#swupjs-插件体系)
  - [核心 JS 类 Somnia](#核心-js-类-somnia)
- [Hugo 模板体系](#hugo-模板体系)
  - [基础布局（baseof）](#基础布局-baseof)
  - [页面类型与模板映射](#页面类型与模板映射)
  - [首页布局](#首页布局)
  - [文章列表](#文章列表)
  - [文章详情](#文章详情)
  - [侧边栏与目录](#侧边栏与目录)
- [主题自定义：非侵入式覆盖](#主题自定义非侵入式覆盖)
- [Partial 组件](#partial-组件)
- [短代码](#短代码)
- [组件开发指南](#组件开发指南)
- [配置参考](#配置参考)
  - [站点配置](#站点配置)
  - [主题参数](#主题参数)
- [样式系统](#样式系统)
  - [CSS 变量与主题色](#css-变量与主题色)
  - [动画系统](#动画系统)
- [Service Worker（PWA）](#service-worker-pwa)
- [插件化评论系统](#插件化评论系统)
- [搜索（Pagefind）](#搜索-pagefind)
- [数学公式（KaTeX）](#数学公式-katex)
- [代码高亮](#代码高亮)
- [已知问题与 TODO](#已知问题与-todo)

---

## 技术栈

| 层次 | 技术 | 版本要求 |
|------|------|---------|
| 静态网站生成器 | **Hugo** | `v0.158.0+` extended |
| CSS 框架 | **UnoCSS** | v66.x（`preset-wind4`、`preset-typography`、`preset-attributify`、`preset-mini`） |
| 交互框架 | **Alpine.js** | v3.14+（`async-alpine` 适配器） |
| 页面切换 | **Swup.js** | 无刷新页面导航 |
| 图片缩放 | **Medium Zoom** | 轻量级图片查看器 |
| 数学公式 | **KaTeX** | 可选，按需加载 |
| 搜索 | **Pagefind** | 可选，静态搜索索引 |
| 包管理 | **pnpm** | v10.25.0 |
| 任务执行 | **just** | 可选，便捷命令封装 |

> **CSS import 兼容性：** Hugo >= v0.158.0 开始原生支持 CSS `@import` 语法，
> 主题 CSS 文件（如 `main.css`）依赖此特性进行模块化组织。低于此版本会报错。

## 项目结构

```
Somnia/
├── archetypes/               # Hugo 内容原型模板
│   └── default.md            # 默认文章原型（含 Front Matter 示例）
├── assets/                   # Hugo Pipes 处理的资源
│   ├── css/
│   │   ├── uno.css           # UnoCSS 构建输出（自动生成）
│   │   ├── main.css          # 主样式（动画、Katex、Shiki 代码块）
│   │   ├── app.css           # 应用级全局样式
│   │   ├── components.css    # 组件专用样式
│   │   ├── custom.css        # 用户自定义样式
│   │   ├── tailwind.css      # Tailwind 兼容层
│   │   ├── tailwind-compat.css
│   │   ├── style.css
│   │   ├── medium-zoom.css   # Medium Zoom 样式覆盖
│   │   └── code/             # 代码高亮相关样式
│   └── js/
│       ├── alpinejs.min.js       # Alpine.js 框架核心（v3.14+）
│       ├── async-alpine.min.js   # Alpine.js 异步加载适配器
│       ├── main.js               # Somnia 核心类（Toast、时间格式化、资源加载、第三方库管理）
│       ├── components.js         # Alpine.js 组件定义（header、back-to-top、quote 等）
│       ├── custom.js             # 用户自定义 JS（CDN 路径配置、页面初始化钩子）
│       ├── variable.js           # 全局变量（CDN 路径等）
│       ├── medium-zoom.min.js    # Medium Zoom 库
│       ├── sw.js                 # Service Worker
│       └── swup/                 # Swup.js 无刷新导航库
├── docs/                     # 文档
│   ├── development-guide.md  # 本文档
│   └── SW.md                 # Service Worker 使用说明
├── exampleSite/              # 示例站点（用于开发测试）
│   ├── config/_default/
│   │   ├── hugo.toml         # 示例站点配置
│   │   └── markup.toml       # Markdown 渲染配置
│   ├── content/              # 示例内容
│   ├── data/                 # 示例数据
│   └── resources/            # Hugo 构建缓存
├── layouts/                  # Hugo 布局模板
│   ├── _default/
│   │   ├── baseof.html       # 基础骨架模板
│   │   ├── home.html         # 首页布局
│   │   ├── single.html       # 单页面（默认）
│   │   ├── single.md         # 单页面 Markdown 输出布局
│   │   ├── list.html         # 列表页（默认）
│   │   └── 404.html          # 404 页面
│   ├── partials/
│   │   ├── head.html         # meta 元数据、OG、图标、资源加载
│   │   ├── header.html       # 顶部导航栏（Alpine.js 驱动）
│   │   ├── footer.html       # 页脚（ICP、版权、社交链接）
│   │   ├── head/             # 头部子组件
│   │   │   ├── theme.html    # 主题初始化（内联脚本防闪烁）
│   │   │   ├── css.html      # CSS 资源加载
│   │   │   ├── js.html       # JS 资源加载
│   │   │   └── libs.html     # 外部库加载
│   │   ├── home/             # 首页子组件
│   │   │   ├── profile.html  # 头像、姓名、位置、GitHub
│   │   │   └── sections/     # 首页各区块
│   │   │       ├── about.html
│   │   │       ├── posts.html
│   │   │       ├── education.html
│   │   │       ├── website-list.html
│   │   │       ├── certifications.html
│   │   │       └── skills.html
│   │   ├── page/             # 页面级组件
│   │   │   ├── button.html
│   │   │   ├── hero.html
│   │   │   ├── blog-article-info.html
│   │   │   ├── blog-preview.html
│   │   │   ├── blog-preview-lite.html
│   │   │   ├── blog-bottom.html
│   │   │   ├── copyright.html
│   │   │   └── social-sub-status.html
│   │   ├── toc/              # 目录组件
│   │   │   ├── toc.html
│   │   │   ├── toc-extract-flat.html
│   │   │   ├── toc-build-tree.html
│   │   │   └── toc-heading-item.html
│   │   ├── comment/          # 评论系统
│   │   │   ├── comment.html  # 评论插件调度入口
│   │   │   ├── mastodon.html
│   │   │   └── artalk.html
│   │   ├── icons.html        # SVG 图标集中定义（目前未使用）
│   │   ├── card.html         # 通用卡片组件
│   │   ├── data.html         # 页面数据处理器
│   │   ├── pagination.html   # 分页器
│   │   ├── post-card.html    # 文章卡片
│   │   ├── project-card.html # 项目卡片
│   │   ├── quote.html        # 一言组件
│   │   ├── back-to-top.html  # 回到顶部（含阅读进度百分比）
│   │   └── libs/             # 外部库加载
│   ├── posts/                # 博客文章专属布局
│   │   ├── single.html       # 文章详情页
│   │   └── list.html         # 博客列表页（含分页、分类、标签侧边栏）
│   ├── docs/                 # 文档页面布局
│   │   ├── single.html
│   │   └── list.html
│   ├── categories/           # 分类页面
│   ├── tags/                 # 标签页面
│   ├── terms/                # 术语列表
│   ├── archives/             # 归档页面
│   ├── page/                 # 单页面（如关于、链接）
│   └── shortcodes/           # Hugo 短代码
│       ├── card.html         # 卡片
│       ├── card-list.html    # 卡片列表
│       ├── callout.html      # 提示框（note/tip/caution/danger）
│       ├── collapse.html     # 折叠面板
│       ├── formatted-date.html
│       ├── github-card.html  # GitHub 仓库卡片
│       ├── html.html         # 原生 HTML 嵌入
│       ├── label.html        # 标签
│       ├── link-preview.html # 链接预览
│       ├── md2html.html      # Markdown 转 HTML
│       ├── qrcode.html       # 二维码
│       ├── quote.html        # 引用块
│       ├── steps.html        # 步骤指示器
│       ├── tabs.html         # 标签页
│       ├── timeline.html     # 时间线
│       ├── toast.html        # 消息提示
│       └── bilibili.html     # B站视频嵌入
├── static/                   # 静态资源（直接复制到 public）
│   ├── fonts/
│   ├── icons/
│   │   └── main.svg          # SVG 图标精灵
│   ├── images/
│   └── logo.png
├── scripts/
│   ├── version.js            # 版本管理脚本
│   └── version.json
├── theme.toml                # Hugo 主题元数据
├── hugo.toml                 # 主题自身 Hugo 配置
├── uno.config.ts             # UnoCSS 配置
├── package.json              # Node.js 依赖
├── justfile                  # just 命令定义
└── LICENSE                   # MIT 许可证
```

## 环境要求与快速启动

### 前置条件

```bash
# Hugo（extended 版本，要求 v0.158.0+）
hugo version

# pnpm（v10+）
pnpm --version

# just（可选，用于便捷命令）
just --version

# pagefind（可选，搜索索引构建）
pagefind --version
```

### 快速启动（主题开发模式）

```bash
# 1. 进入主题目录
cd themes/Somnia

# 2. 安装 JS 依赖
pnpm install

# 3. 启动 Hugo 开发服务器 + UnoCSS 监听（分别开两个终端）
# 终端 1：
just dev       # 或：hugo server -s exampleSite/ --disableFastRender
# 终端 2：
just css       # 或：pnpm dev（监听 layouts/ 变化，自动生成 uno.css）

# 4. 浏览器访问 http://localhost:1313
```

## 开发命令

通过 `justfile` 定义，也可直接使用底层命令：

| 命令 | 用途 | 等价命令 |
|------|------|---------|
| `just dev` | 启动 Hugo 开发服务器 | `hugo server -s exampleSite/ --disableFastRender` |
| `just build` | 构建生产版本 | `hugo --minify -s exampleSite/` |
| `just pf` | 构建 Pagefind 搜索索引 | `pagefind_extended --site exampleSite/public` |
| `just css` | UnoCSS 开发模式（监听） | `pnpm dev` |
| `just css-build` | UnoCSS 生产构建 | `pnpm build` |
| `just update` | 版本更新 | `llrt scripts/version.js` |

## 前端构建体系

### UnoCSS

主题使用 **UnoCSS** 作为样式引擎，采用原子化 CSS 策略。开发时需同时运行 UnoCSS 监听进程。

**配置入口：** `uno.config.ts`

```typescript
presets: [
  presetMini(),         // 基础预设（必需）
  presetAttributify(),  // 属性化模式：<div p-4>
  presetTypography(typographyConfig),  // 排版预设
]
```

**关键配置点：**
- `typographyConfig`：自定义 `prose` 排版样式（标题锚点、内联代码、引用块、表格、列表等）
- `themeColors`：CSS 变量驱动的颜色主题系统（详见下文）
- `rules`：自定义工具类（`sr-only`、`object-cover`、`line-clamp-*`）
- `safelist`：保证动态类名不被 UnoCSS 清除

**构建命令：**

```bash
# 开发（监听 layouts/ 变化）
pnpm unocss "layouts/**/*.html" -o ./assets/css/uno.css --watch

# 生产构建
pnpm unocss "layouts/**/*.html" -o ./assets/css/uno.css
```

### Alpine.js 组件

主题使用 Alpine.js 管理客户端交互，所有组件定义在 `assets/js/components.js` 中。

**注册方式：** 通过 `alpine:init` 事件注册全局 Alpine store 和组件函数。

**全局 Store：** `Alpine.store('somnia')`

| 字段 | 类型 | 说明 |
|------|------|------|
| `theme` | `'system' \| 'dark' \| 'light'` | 当前主题 |
| `isDark` | `boolean` | 是否为暗色模式 |

**组件清单：**

| 组件函数 | 绑定模板 | 功能 |
|---------|---------|------|
| `component.header()` | `partials/header.html` | 导航栏滚动隐藏/显示、移动端菜单、主题切换 |
| `component.main()` | `_default/single.html`、`posts/single.html` | 侧边栏切换 |
| `component.content()` | `_default/baseof.html` | 内容容器初始化 |
| `component.backToTop()` | `partials/back-to-top.html` | 回到顶部 + 阅读进度百分比 |
| `component.quote()` | `partials/quote.html` | 一言 API 加载 |
| `component.hero()` | `partials/page/hero.html` | 文章 Banner 模糊视差效果 |
| `component.toc()` | `partials/toc/toc.html` | 目录高亮 |
| `somniaData()` | 数据属性 | 按需加载第三方库（KaTeX 等） |

### Async Alpine 异步加载机制

**Async Alpine**（`assets/js/async-alpine.min.js`）是为 Alpine.js 提供代码分割和懒加载能力的适配器。

> 文档：https://async-alpine.dev/docs/

核心作用：

| 特性 | 说明 |
|------|------|
| 按需加载组件 | 仅在组件进入视口或满足条件时加载对应 JS |
| 切分 JS 文件 | 将大型、独立、低频的组件（如评论系统）分离为独立文件 |
| 简化 Shortcode 开发 | shortcode 可以通过 `x-load` 指令延迟初始化，避免 Swup 切换后丢失状态 |

使用方式：

```html
<!-- 视口内加载 -->
<div x-data="commentComponent()" x-load></div>

<!-- 空闲时加载 -->
<div x-data="heavyComponent()" x-load="idle"></div>

<!-- 事件触发后加载 -->
<div x-data="customComponent()" x-load="event (somnia:moved)"></div>
```

### Swup.js 插件体系

`assets/js/swup/` 目录中包含以下插件：

| 文件 | 插件 | 作用 |
|------|------|------|
| `Swup.umd.js` | Swup 核心 | 无刷新页面过渡，拦截链接点击，通过 AJAX 加载新页面内容并替换容器 |
| `scroll-plugin.js` | Scroll Plugin | 页面切换时保存/恢复滚动位置，支持自定义平滑滚动行为 |
| `preload-plugin.js` | Preload Plugin | 鼠标悬停链接时预加载下一页资源，减少等待时间 |

Swup 初始化逻辑在 `head/js.html` 中：绑定 `#content-wrapper` 为切换容器，设置过渡动画类 `transition-fade`，注册各插件。切换完成时触发 `swupPageInitCustom()` 等钩子，重新初始化 Alpine.js 组件和 Medium Zoom。

### 核心 JS 类 Somnia

定义在 `assets/js/main.js` 中，提供全局工具方法和第三方库管理。

```javascript
const somnia = new Somnia();
```

**核心 API：**

| 方法 | 说明 |
|------|------|
| `showToast(message, time?)` | 显示 Toast 消息（自动消失） |
| `timestampToShichen(ts13)` | 十三位时间戳转中文友好时间（含十二时辰） |
| `loadResource({href, rel?, type?, ...})` | 动态加载 CSS/JS 资源 |
| `scanLine({act?, time?})` | 扫描线加载动画 |
| `swupPageInitMediumZoom()` | Swup 页面切换后重新初始化 Medium Zoom |
| `PageInitCustom()` | 用户自定义初始化钩子（可覆盖） |
| `swupPageInitCustom()` | Swup 页面切换后自定义钩子（可覆盖） |

**第三方库管理系统（`Somnia.libs`）：**

每个库实现四个方法：

| 方法 | 说明 |
|------|------|
| `loaded()` | 检查资源 DOM 元素是否存在 |
| `ok()` | 检查库是否全局可用 |
| `load()` | 加载资源 |
| `run(...)` | 执行库功能 |

当前管理的库：
- `mediumZoom`：始终可用，直接运行
- `pagefind`：按需加载 CSS + JS，初始化搜索 UI
- `katex`：按需加载 CSS + JS，渲染页面中的 KaTeX 公式

## Hugo 模板体系

### 基础布局（baseof）

`layouts/_default/baseof.html` 是所有页面的骨架模板：

- 定义 `--highlightColor` CSS 变量控制主题高亮色
- 容器 `#main-container` 最大宽度 `70rem`
- `#content-wrapper` 使用 Swup.js 的 `transition-fade` 类实现无刷新过渡
- `head/theme.html` 内联脚本防止主题闪烁
- 渐变背景层使用 `--highlightColor` 渲染

### 页面类型与模板映射

| 内容类型 | 模板 | 说明 |
|---------|------|------|
| 首页 | `_default/home.html` | 个人主页门户风格 |
| 单页 | `_default/single.html` | 通用单页 |
| 博客文章 | `posts/single.html` | 文章详情（hero + 目录 + 版权 + 推荐 + 评论） |
| 博客列表 | `posts/list.html` | 分页列表 + 分类/标签侧边栏 |
| 文档 | `docs/single.html` | 文档页 |
| 文档列表 | `docs/list.html` | 文档目录 |
| 分类/标签 | `categories/...`、`tags/...` | 聚合页 |
| 404 | `_default/404.html` | 404 页面 |

### 首页布局

`_default/home.html` 分区块渲染：
1. `profile.html` — 头像、名称、位置、GitHub
2. `sections/about.html` — 关于我
3. `sections/posts.html` — 最新文章列表（`params.homepage.posts` 控制数量）
4. `sections/education.html` — 教育经历
5. `sections/website-list.html` — 友情网站
6. `sections/certifications.html` — 证书
7. `sections/skills.html` — 技能标签
8. `quote.html`（可选）— 一言

### 文章列表

`posts/list.html` 采用两列布局：
- 左侧：文章列表（分页，`params.limit.blogPosts` 控制每页数量）
- 右侧：Categories + Tags 侧边栏

### 文章详情

`posts/single.html` 采用文章 + 侧边栏布局：
- 左侧：Back 按钮、Hero 图片（模糊预览效果）、文章元信息（日期/阅读时间/语言/分类/标签）、Markdown 内容、版权声明、推荐文章、评论系统
- 右侧：嵌套目录（TOC）

### 侧边栏与目录

TOC 通过三级 partial 实现：
1. `toc-extract-flat.html` — 从 `.Content` 提取所有标题扁平列表
2. `toc-build-tree` — 构建嵌套树
3. `toc-heading-item.html` — 递归渲染
移动端通过 `component.main().toggleSidebar()` 弹出遮罩层。

## 主题自定义：非侵入式覆盖

Somnia 充分利用 Hugo 的主题查找优先级机制，允许在不修改主题源码的情况下，从站点项目覆盖主题的任意文件。

### 查找优先级

```
website/                                   ← 最高优先级
├── assets/js/custom.js                    ← 覆盖主题的 custom.js
├── assets/css/custom.css                  ← 覆盖主题的 custom.css
├── layouts/partials/header.html           ← 覆盖主题的导航栏
├── layouts/partials/footer.html           ← 覆盖主题的页脚
└── ...
  vs.
themes/Somnia/                              ← 默认加载（低优先级）
  ├── assets/js/custom.js
  ├── layouts/partials/header.html
  └── ...
```

**规则：** 站点项目 `website/` 下同路径文件 > 主题 `themes/Somnia/` 下同名文件。
前者存在时，Hugo 优先使用，完全不触及主题目录。

### 常见覆盖场景

| 场景 | 站点新建文件 | 说明 |
|------|------------|------|
| 自定义 JS 逻辑 | `assets/js/custom.js` | 覆盖主题的 custom.js，可修改 CDN 路径、重写初始化钩子 |
| 自定义 CSS | `assets/css/custom.css` | 追加样式覆盖 |
| 修改导航栏 | `layouts/partials/header.html` | 复制主题的 header.html 后再修改 |
| 修改页脚 | `layouts/partials/footer.html` | 复制主题的 footer.html 后再修改 |
| 修改首页区块 | `layouts/partials/home/sections/about.html` | 覆盖特定首页区块 |
| 添加新短代码 | `layouts/shortcodes/my-component.html` | 直接在站点新增 |

### 最佳实践

1. **优先覆盖 partials 而非重写整个布局** — 只改需要改的部分
2. **升级主题时 diff 检查** — 覆盖的文件不会随主题更新，需手动合并改进
3. **UnoCSS 注意** — 如果覆盖的布局使用了原子类，确保 UnoCSS 能扫描到新文件
4. **自定义 JS 钩子** — 利用 `Somnia.PageInitCustom` 和 `swupPageInitCustom()` 添加逻辑，而非替换整个 `main.js`

## Partial 组件

### head/ 系列

| 组件 | 说明 |
|------|------|
| `head.html` | 综合 head：meta、OG、图标、资源加载 |
| `head/theme.html` | 主题初始化内联脚本，防闪烁 |
| `head/css.html` | Hugo Pipes CSS 加载 |
| `head/js.html` | Hugo Pipes JS 加载 |
| `head/libs.html` | 外部库加载 |

### 导航与页脚

| 组件 | 说明 |
|------|------|
| `header.html` | 粘性导航栏，支持滚动隐藏、移动端菜单、主题切换、搜索入口 |
| `footer.html` | 页脚：ICP 备案、版权信息、GitHub/RSS 图标 |

### page/ 系列

| 组件 | 说明 |
|------|------|
| `button.html` | 通用按钮（back / ahead 变体） |
| `hero.html` | 文章 Banner：主图加模糊预览叠加层，滚动时透明度变化 |
| `blog-article-info.html` | 文章信息栏：日期、更新日、阅读时间、语言、分类、标签、浏览量 |
| `blog-preview.html` / `blog-preview-lite.html` | 文章预览卡片（完整/精简版） |
| `blog-bottom.html` | 相关文章推荐 |
| `copyright.html` | 版权声明 |

### 首页与工具组件

| 组件 | 说明 |
|------|------|
| `home/profile.html` | 头像、名称、位置、GitHub |
| `back-to-top.html` | 回到顶部：Alpine.js 驱动，含阅读进度百分比、IntersectionObserver、ResizeObserver |
| `quote.html` | 一言 API 调用 |
| `data.html` | 页面数据属性处理器，触发第三方库按需加载 |
| `card.html` / `post-card.html` / `project-card.html` | 各类型卡片 |

## 短代码

### 基础组件

| 短代码 | 参数 | 说明 |
|--------|------|------|
| `{{< card >}}` | `as`, `href`, `heading`, `subheading`, `date` | 卡片容器 |
| `{{< callout >}}` | `title`, `type`（note/tip/caution/danger） | 四种风格提示框 |
| `{{< label >}}` | — | 标签 |
| `{{< quote >}}` | — | 引用块 |
| `{{< toast >}}` | — | 消息提示 |

### 布局组件

| 短代码 | 参数 | 说明 |
|--------|------|------|
| `{{< tabs >}}` | `active` | 标签页（`---` 分隔） |
| `{{< collapse >}}` | `title` | 折叠面板 |
| `{{< timeline >}}` | `Inner` | 时间线（`---` 分隔事件） |
| `{{< steps >}}` | — | 步骤指示器 |

### 内容增强

| 短代码 | 说明 |
|--------|------|
| `{{< qrcode >}}` | 二维码 |
| `{{< link-preview >}}` | 链接预览卡片 |
| `{{< github-card >}}` | GitHub 仓库卡片 |
| `{{< bilibili >}}` | B站视频嵌入 |
| `{{< formatted-date >}}` | 格式化日期 |

### 工具短代码

| 短代码 | 说明 |
|--------|------|
| `{{< card-list >}}` | 卡片列表容器 |
| `{{< md2html >}}` | Markdown 转 HTML |
| `{{< script >}}` | 脚本嵌入 |
| `{{< date >}}` | 日期显示 |

## 组件开发指南

Somnia 使用 Swup.js 实现无刷新页面切换，这给短代码（shortcode）中的 Alpine.js 组件带来了一个核心挑战：
**Swup 切换页面时不会自动执行 `<script>` 标签，导致 Alpine.js 组件初始化失败。**

以下 5 种方法逐步递进，按场景选择。

### 问题演示

```html
<!-- Swup 切换到此页面时，以下代码中的 test() 函数不会执行 -->
<div x-data="test()" x-text="some"></div>
<script>
    function test() {
        return { some: "test" }
    }
</script>
```

### 方法 1：内联到 x-data（最简单）

适合极简逻辑。将函数体和返回值直接写在 `x-data` 中。

```html
<div x-data="{ some: 'test' }" x-text="some"></div>
```

**优点：** 零额外代码，Swup 完全兼容。
**缺点：** 逻辑复杂时不可维护。

### 方法 2：函数移至 custom.js（推荐）

将组件函数定义迁移到 `assets/js/custom.js`，该文件在所有页面加载时已执行。

```html
<div x-data="test()" x-text="some"></div>
```

```javascript
// assets/js/custom.js
function test() {
    return { some: "test" }
}
```

**优点：** 干净分离，Swup 兼容。
**缺点：** 每加一个 shortcode 都要编辑 custom.js，组件多了难管理。

### 方法 3：事件触发 + 脚本重定位（中等复杂度）

利用 `x-load="event (somnia:moved)"` 延迟 Alpine 初始化，然后在 Swup 切换后将 `<script>` 移到 `<head>` 并触发自定义事件。

```html
<div x-data="test()" x-text="some" x-load="event (somnia:moved)"></div>
<script>
    console.log("test loaded")
    function test() {
        return { some: "test" }
    }
</script>
```

在 `custom.js` 的 `Somnia.swupPageInitCustom` 中添加：

```javascript
// 将 #content-wrapper 内的脚本移到 head，防止 Swup 丢弃
document.querySelectorAll('#content-wrapper script').forEach(script => {
    const newScript = document.createElement('script');
    newScript.innerHTML = script.innerHTML;
    document.head.appendChild(newScript);
});
document.dispatchEvent(new CustomEvent('somnia:moved', { bubbles: true }));
```

**优点：** shortcode 自包含，无需额外文件。
**缺点：** 页面切换会堆积重复脚本；`somnia:moved` 事件触发后的初始化可能导致闪烁。

### 方法 4：x-ignore + 相邻脚本替换（推荐）

在 shortcode 中使用 `x-ignore` 阻止 Alpine 自动解析，然后通过相邻的 `<script>` 内容动态设置 `x-data` 属性并触发 Alpine 重新解析。

```html
<div x-data="test()" x-text="some" x-ignore></div>
<script>
    // 这里可以是函数定义：
    function test() {
        return { some: "test" }
    }
    // 也可以直接是对象：{ some: "test" }
</script>
```

在 `custom.js` 的 `Somnia.swupPageInitCustom` 中添加：

```javascript
document.querySelectorAll('div[x-ignore]').forEach(div => {
    const nextElement = div.nextElementSibling;
    if (nextElement && nextElement.tagName.toLowerCase() === 'script') {
        div.setAttribute('x-data', nextElement.innerText);
        nextElement.remove();
        div.removeAttribute('x-ignore');
        div.parentNode.replaceChild(div, div); // 触发 Alpine 重新解析
    }
});
```

**优点：** shortcode 几乎自包含，脚本保留为独立函数或对象均可，无重复堆积问题。
**缺点：** 需要全局注入一次脚本处理逻辑。

### 方法 5：Async Alpine 异步加载（高级）

将组件函数迁移到独立的 `.mjs` 文件，通过 Async Alpine 在需要时异步加载。

1. 创建独立文件，如 `static/js/comment.mjs`
2. 在 shortcode 中使用 `x-load` 指定加载方式和来源

```html
<div x-data="commentComponent()" x-load x-data="commentComponent()"
     x-init="console.log('评论组件已加载')"></div>
```

> 文档：https://async-alpine.dev/docs/

**优点：** 真正的代码分割，按需加载，性能最佳。
**缺点：** 需要额外的构建或配置，适合大型独立组件（如评论系统）。

### 方法选择速查

| 场景 | 推荐方法 |
|------|---------|
| 一两行逻辑，无外部依赖 | 方法 1：内联 x-data |
| 简单组件，项目维护期 | 方法 2：custom.js |
| shortcode 高度自包含，不愿开额外文件 | 方法 3：事件触发 |
| shortcode 自包含，频率高 | 方法 4：x-ignore 替换 |
| 大型独立组件（评论、图库等） | 方法 5：Async Alpine |

## 配置参考

### 站点配置

`config/_default/markup.toml`：

```toml
[goldmark.renderer]
  hardWraps = true
  unsafe = true

[highlight]
  noClasses = false
  guessSyntax = true

[goldmark.extensions.passthrough]
  enable = true
  [goldmark.extensions.passthrough.delimiters]
    block = [['\[', '\]'], ['$$', '$$']]
    inline = [['\(', '\)']]
```

### 主题参数

以下参数在站点 `hugo.toml` 的 `[params]` 中配置：

```toml
# 基础
[params]
description = ''

# 分页限制
[params.limit]
blogPosts = 5
blogCategories = 10
blogTags = 50
categoriesPosts = 5
tagsPosts = 5
archivesPosts = 50

# 作者
[params.author]
name = "恐咖兵糖"
email = "0@ftls.xyz"
avatar = "..."
location = 'China'
github = 'https://github.com/kkbt0'
bio = '浮生若梦 为欢几何'

# 首页
[params.homepage]
posts = 5
quote = true

[params.education]
heading = '...'
subheading = '...'
date = '...'
url = '#'

[[params.websites]]
name = '...'
description = '...'
url = 'https://...'
image = '/Somnia/images/default.webp'

[[params.skills]]
title = 'Languages'
items = ['HTML5', 'CSS3', '...']

# 导航菜单
[[params.header.menu]]
title = 'Blog'
link = 'posts'

# 页脚
[params.footer]
powered = true
[params.footer.icp]
title = 'Moe ICP 114514'
link = 'https://icp.gov.moe/'

# 功能开关
[params.features]
search = true

# 评论系统（可选）
[params.comment]
enable = true
provider = "Artalk"  # 或 "Mastodon"
```

## 样式系统

### CSS 变量与主题色

| CSS 变量 | 用途 | UnoCSS 类 |
|---------|------|-----------|
| `--primary` | 主色调 | `text-primary`、`bg-primary` |
| `--foreground` | 文字色 | `text-foreground` |
| `--background` | 背景色 | `bg-background` |
| `--muted` | 柔和背景 | `bg-muted` |
| `--muted-foreground` | 柔和文字 | `text-muted-foreground` |
| `--card` | 卡片背景 | `bg-card` |
| `--border` | 边框色 | `border-border` |
| `--input` | 输入框边框 | `border-input` |
| `--ring` | 焦点环 | `ring-ring` |
| `--radius` | 圆角 | `rounded-*` |
| `--highlightColor` | 渐变高亮色 | 内联样式 |

### 动画系统

定义在 `main.css`：

- `fade-in-up`：300ms，元素从下方淡入
- 扫描线动画：900ms，通过 `somnia-loading` 类触发
- 延迟链：`content-header` 50ms → `content` 100ms → `sidebar` 150ms
- 支持 `prefers-reduced-motion`

## Service Worker（PWA）

`assets/js/sw.js` 提供离线缓存：

| 资源类型 | 策略 | 缓存桶 |
|---------|------|--------|
| 带 Hash 的 CSS/JS/字体 | Cache First | `somnia-static-v*` |
| 图片/字体/媒体 | Cache First | `somnia-static-v*` |
| HTML 页面 | Network First，离线回退 | `somnia-pages-v*` |
| 其他 | Network First | `somnia-pages-v*` |

**部署步骤：** 复制 `sw.js` 到站点 `static/` → 注册 SW → 创建 `offline.md` → 更新版本号。

## 插件化评论系统

`partials/comment/comment.html` 根据 `params.comment.provider` 调度：

- `Artalk` → `comment/artalk.html`
- `Mastodon` → `comment/mastodon.html`

文章 `comments: true` 开启评论。

## 搜索（Pagefind）

1. 构建后运行 `just pf`
2. 搜索页通过 `searchComponent()` 动态加载 Pagefind UI
3. 文章 categories 和 tags 添加了 `data-pagefind-filter` 属性

## 数学公式（KaTeX）

文章 Front Matter 设置 `math: true`，`data.html` 自动检测并加载 KaTeX。

## 代码高亮

Goldmark `[highlight]` 配置 + Shiki 样式：
- `.astro-code`：圆角、行号、语言标签、复制按钮
- 内联代码：`modern` 风格（边框 + 底色）
- 标题支持、空行自动隐藏

## 已知问题与 TODO

| 位置 | TODO |
|------|------|
| `home.html` | 封装 Section 组件 |
| `posts/single.html` | Markdown 渲染槽位 |
| `component.header()` | 滚动性能优化 |
| `main.js` | 扫描线超时提示优化 |
| 整体 | HTML/CSS/JS 分离（类似 Vue SFC → 独立文件） |
| 整体 | 字体预加载 |

---

*本文档对应 Somnia 主题 v1.0.0，Hugo v0.158.0+。*
