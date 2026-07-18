# Somnia

一个现代化、优雅的 Hugo 主题，基于 Astro Theme Pure 移植而来。

> [!WARNING]  
> 这是一个未经广泛使用和严格测试的项目。如果你喜欢这个样式，或者希望使用 npm 生态，可以使用 Astro 原始主题：[Astro Theme Pure](https://github.com/cworld1/astro-theme-pure) by [cworld1](https://github.com/cworld1)

文档可见 docs 目录和 [https://www.ftls.xyz/docs/somnia/somnia/](https://www.ftls.xyz/docs/somnia/somnia/)

## 特性

使用了 Alpine.js + UnoCSS 构建，支持现代化的网站开发体验。

- 🎉 **轻量框架** - 由 Alpine.js 驱动
- 🔄 **无刷新导航** - 使用 Swup.js 实现平滑页面过渡
- 🚀 **快速生成** - 1k+ markdown 仅个位数时间
- 🌙 **深色模式** - 支持浅色/深色/系统三种主题切换
- 📱 **响应式设计** - 适配各种设备尺寸
- 🔍 **内置搜索** - 快速找到你需要的内容
- 📑 **目录导航** - 文章内容自动生成侧边目录
- 🎨 **现代化 UI** - 使用 UnoCSS 原子化 CSS 框架
- ⚡ **极速加载** - 优化的性能表现
- 🔧 **丰富的短代码** - 卡片、标签页、时间线等多种组件
- 🖼️ **图片缩放** - Medium Zoom 图片查看体验

## 未完善说明

### 🔧 技术债务

- **TODO 标记** - 部分代码中还有待实现的功能标记 搜索 `[TODO]` 以查看

### 🎨 样式和定制

- **UnoCSS 编译** - 修改模板需要同时运行 UnoCSS 构建流程
- **主题色定制** - 高亮色等配色需要修改 CSS 变量

### 📑 已实现功能

- ✅ Swup.js 已引入，实现了无刷新翻页
- ✅ Alpine.js 已集成并正常工作
- ✅ CSS 合并压缩（生产环境自动处理）

### 📋 未来计划

- 目前结构类似 Vue 组件，HTML CSS JS 混合。后续会将 HTML CSS JS 分离。

## 快速开始

查看 justfile 可以执行的命令。

### 前置要求

- Hugo 0.158.0 或更高版本（开发环境 hugo v0.158.0-f41be7959a44108641f1e081adf5c4be7fc1bb63+extended linux/amd64 BuildDate=2026-03-16T17:42:04Z VendorInfo=gohugoio）
- bun (用于开发时构建 UnoCSS)
- just (可选，用于便捷命令执行)
- pagefind (可选，用于构建搜索索引)

### 可用命令

项目提供了 justfile 来简化命令输入流程：

- `just dev` - 启动 Hugo 开发服务器
- `just build` - 构建生产版本
- `just pf` - 使用 Pagefind 构建搜索索引
- `just css` - 启动 UnoCSS 开发模式（监听文件变化）
- `just css-build` - 构建 UnoCSS 生产版本

### 配置

参考 `exampleSite/config/_default/hugo.toml` 和 `exampleSite/hugo.toml` 进行配置

## 项目结构

```
Somnia/
├── .github/
│   └── workflows/          # GitHub Actions 工作流
├── archetypes/
│   └── default.md          # 内容原型模板
├── assets/
│   ├── css/                # 样式文件
│   │   ├── app.css         # 应用样式
│   │   ├── code/           # 代码高亮样式（github, monokai, onedark, vs）
│   │   ├── components.css  # 组件样式
│   │   ├── custom.css      # 自定义样式
│   │   ├── main.css        # 主样式文件
│   │   ├── medium-zoom.css # 图片缩放样式
│   │   ├── moons.css       # 月亮/背景样式
│   │   ├── style.css       # 样式入口
│   │   ├── tailwind.css    # Tailwind 兼容样式
│   │   ├── tailwind-compat.css # Tailwind 兼容层
│   │   └── uno.css         # UnoCSS 生成的样式文件
│   └── js/                 # JavaScript 文件
│       ├── Somnia.js       # 主题主入口
│       ├── components.js   # 组件脚本
│       ├── custom.js       # 自定义脚本
│       ├── libs/           # 第三方库（ESM 模块）
│       │   ├── alpinejs.esm.js
│       │   ├── async-alpine.esm.js
│       │   ├── medium-zoom.esm.js
│       │   └── swup.esm.js
│       ├── main.js         # 主脚本
│       ├── sw.js           # PWA Service Worker
│       └── variable.js     # 全局变量
├── docs/                   # 项目文档
│   ├── development-guide.md
│   ├── SW.md
│   └── Website Spec.md
├── exampleSite/            # 示例站点
│   ├── config/
│   │   └── _default/       # 默认站点配置
│   │       ├── hugo.toml
│   │       └── markup.toml
│   ├── content/            # 示例内容
│   │   ├── _index.md
│   │   ├── about.md
│   │   ├── archives/
│   │   ├── docs/
│   │   ├── links.md
│   │   ├── posts/
│   │   ├── projects/
│   │   ├── search.md
│   │   └── terms/
│   └── data/
│       └── docs.json
├── layouts/                # Hugo 布局模板
│   ├── _default/           # 默认布局
│   │   ├── 404.html
│   │   ├── baseof.html
│   │   ├── home.html
│   │   ├── list.html
│   │   ├── single.html
│   │   ├── _markup/        # 渲染钩子（代码块、图片、链接）
│   │   ├── info/
│   │   ├── jsonfeed.json
│   │   └── single.md
│   ├── archives/           # 归档布局
│   ├── categories/         # 分类布局
│   ├── docs/               # 文档布局
│   ├── page/               # 特殊页面（control-center, search, offline 等）
│   ├── partials/           # 可复用部分模板
│   │   ├── back-to-top.html
│   │   ├── bg.html
│   │   ├── card.html
│   │   ├── comment/        # 评论系统（artalk, mastodon）
│   │   ├── data.html
│   │   ├── docs/           # 文档相关部分
│   │   ├── footer.html
│   │   ├── head.html
│   │   ├── head/           # <head> 区域（css, js, json-ld, theme 等）
│   │   ├── header/         # 顶部导航栏
│   │   ├── home/           # 首页组件
│   │   │   ├── components/  # 可复用组件（button, github, skills 等）
│   │   │   ├── profile.html
│   │   │   └── sections/    # 分区（about, posts, skills, education 等）
│   │   ├── icons.html
│   │   ├── libs/           # 库相关（数学公式 KaTeX）
│   │   ├── page/           # 页面部分（badge, hero, nav, copyright 等）
│   │   ├── pagination.html
│   │   ├── post-card.html
│   │   ├── project-card.html
│   │   ├── quote.html
│   │   └── toc/            # 目录相关
│   ├── posts/              # 文章布局
│   ├── robots.txt
│   ├── shortcodes/         # 短代码组件
│   │   ├── badge.html
│   │   ├── bilibili.html
│   │   ├── callout.html
│   │   ├── card.html
│   │   ├── card-list.html
│   │   ├── collapse.html
│   │   ├── formatted-date.html
│   │   ├── github-card.html
│   │   ├── html.html
│   │   ├── icon/           # 图标短代码
│   │   ├── label.html
│   │   ├── link-preview.html
│   │   ├── md2html.html
│   │   ├── page/           # 页面相关短代码（button, friend-card, sponsors 等）
│   │   ├── qrcode.html
│   │   ├── quote.html
│   │   ├── steps.html
│   │   ├── tabs/           # 标签页短代码
│   │   ├── timeline.html
│   │   ├── toast.html
│   │   └── uno/            # UnoCSS 短代码
│   ├── tags/               # 标签布局
│   └── terms/              # 术语布局
├── scripts/                # 构建脚本
│   ├── libs/               # 第三方库源文件
│   ├── version.js
│   ├── version.json
│   ├── svg_compressor.md
│   ├── svg_compressor.ts
│   ├── svg_mini.js
│   └── README.md
├── static/                 # 静态文件
│   ├── fonts/              # 字体文件
│   ├── icons/              # 图标文件
│   ├── images/             # 图片文件
│   ├── js/                 # 静态 JS 文件
│   │   └── comment.mjs
│   └── logo.png            # Logo
├── .gitignore
├── .hugo_build.lock
├── LICENSE
├── README.md
├── bun.lock                # bun 锁文件
├── hugo.toml               # Hugo 主题配置
├── justfile                # just 命令配置
├── package.json            # Node.js 依赖
├── theme.toml              # 主题元数据
└── uno.config.ts           # UnoCSS 配置
```

## 短代码

Somnia 提供了丰富的短代码，让你可以轻松创建丰富的内容：

### 基础组件

- `{{< card >}}` - 卡片组件
- `{{< callout >}}` - 提示框
- `{{< label >}}` - 标签
- `{{< quote >}}` - 引用
- `{{< toast >}}` - 提示消息

### 布局组件

- `{{< tabs >}}` + `{{< tab >}}` - 标签页
- `{{< collapse >}}` - 折叠面板
- `{{< timeline >}}` - 时间线
- `{{< steps >}}` - 步骤指示器

### 内容增强

- `{{< qrcode >}}` - 二维码
- `{{< link-preview >}}` - 链接预览
- `{{< github-card >}}` - GitHub 卡片
- `{{< bilibili >}}` - B站视频嵌入
- `{{< formatted-date >}}` - 格式化日期

### 工具短代码

- `{{< card-list >}}` - 卡片列表
- `{{< date >}}` - 日期显示
- `{{< md2html >}}` - Markdown 转 HTML
- `{{< script >}}` - 脚本嵌入

### 其他组件

- `{{< page/social-sub-status >}}` - 社交订阅状态
- `{{< page/sponsors >}}` - 赞助商模块

> 注：目录 (TOC) 功能已内置在文章页面中，无需额外短代码。

## 开发

如果你想参与主题开发或自定义：

```bash
# 克隆仓库
git clone https://github.com/kkbt0/Somnia.git
cd Somnia

# 安装依赖
bun install
# 开发模式（监听文件变化并构建 UnoCSS）
bun dev
# 构建生产版本
bun build
bun build2
```

由于期望使用 Hugo 二进制文件就可以构建网站并简化自定义，主题包含了依赖库，位于 `assets/js/libs`

```bash
bun update
# 将 js 库打包复制到 assets 目录
# 由于 UMD 在 Hugo 的 js.Build 下会出一点问题，所以重新导出 ems
bun run ./scripts/libs/vendor.js
```

### UnoCSS 开发

主题使用 UnoCSS 进行样式管理，修改模板时需要同时运行 UnoCSS 构建：

```bash
bun dev
```

这会监听 `layouts/**/*.html` 的变化并自动生成 `assets/css/uno.css`。

## 技术栈

- **Hugo** - 静态站点生成器（v0.158.0+）
- **UnoCSS** - 原子化 CSS 引擎
  - `@unocss/preset-wind4` - Tailwind CSS v4 风格预设
  - `@unocss/preset-typography` - 排版预设
  - `@unocss/preset-attributify` - 属性化模式
  - `@unocss/preset-mini` - 基础预设
- **Alpine.js** - 轻量级交互框架（v3.14+）
- **Swup.js** - 无刷新页面过渡库
- **Medium Zoom** - 图片缩放库
- **KaTeX** - 数学公式渲染引擎（可选）

## 作者

- **恐咖兵糖** - [GitHub](https://github.com/kkbt0)

## 致谢

- 原始主题：[Astro Theme Pure](https://github.com/cworld1/astro-theme-pure) by [cworld1](https://github.com/cworld1)

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

**享受使用 Somnia！** 🎉
