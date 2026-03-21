> 这是一些 AI 生成的文档，可能有用。

# Hugo Theme Somnia 开发文档

本文档面向希望修改、扩展或贡献于 Hugo Theme Somnia 的开发者。

## 项目结构

```
Somnia/
├── assets/                 # 静态资源
│   ├── css/               # 样式文件
│   │   ├── code/          # 代码高亮主题
│   │   ├── main.css       # 主样式
│   │   ├── tailwind.css   # Tailwind 兼容样式
│   │   ├── uno.css        # UnoCSS 生成样式
│   │   └── ...
│   └── js/                # JavaScript 文件
│       ├── main.js        # 主脚本
│       ├── components.js  # 组件脚本
│       └── swup/          # 页面过渡动画
├── layouts/               # Hugo 模板
│   ├── _default/          # 默认模板
│   │   ├── home.html      # 首页
│   │   ├── single.html    # 单页模板
│   │   ├── list.html      # 列表模板
│   │   └── 404.html       # 404 页面
│   ├── partials/          # 部分模板
│   │   ├── head/          # Head 相关
│   │   ├── home/          # 首页组件
│   │   ├── page/          # 页面组件
│   │   └── toc/           # 目录组件
│   ├── shortcodes/        # 短代码
│   │   ├── callout.html   # 提示框
│   │   ├── card.html      # 卡片
│   │   ├── tabs.html      # 标签页
│   │   └── ...
│   ├── docs/              # 文档模板
│   ├── posts/             # 文章模板
│   └── tags/              # 标签模板
├── static/                # 静态文件
│   ├── logo.png
│   └── icons/
├── exampleSite/           # 示例站点
│   ├── content/           # 示例内容
│   ├── config/            # 示例配置
│   └── public/            # 构建输出
├── package.json           # Node 依赖
├── uno.config.ts          # UnoCSS 配置
├── hugo.toml              # 默认配置
└── theme.toml             # 主题信息
```

## 技术栈

- **Hugo**: 静态网站生成器
- **UnoCSS**: 原子化 CSS 引擎
- **Tailwind CSS**: 样式兼容性
- **Alpine.js**: 轻量级 JavaScript 框架
- **Swup**: 页面过渡动画
- **Medium Zoom**: 图片放大效果
- **Pagefind**: 静态搜索

## 开发环境

### 安装依赖

```bash
pnpm install
```

### UnoCSS 开发

UnoCSS 配置位于 `uno.config.ts`，使用以下预设：

- `presetMini`: 核心功能
- `presetAttributify`: 属性化模式
- `presetTypography`: 排版预设

开发模式（监视变化）：

```bash
pnpm run dev
# 或
just css
```

构建生产版本：

```bash
pnpm run build
# 或
just css-build
```

### Hugo 开发

```bash
hugo server -s exampleSite/ --disableFastRender
# 或
just dev
```

### 构建搜索索引

```bash
pagefind_extended --site exampleSite/public
# 或
just pf
```

## 模板开发

### 部分模板 (Partials)

| 路径 | 说明 |
|------|------|
| `partials/head.html` | HTML head 区域 |
| `partials/head/css.html` | 样式表引入 |
| `partials/head/js.html` | 脚本引入 |
| `partials/header.html` | 页面头部/导航 |
| `partials/footer.html` | 页脚 |
| `partials/home/profile.html` | 首页个人简介 |
| `partials/home/sections/*.html` | 首页各区块 |
| `partials/post-card.html` | 文章卡片 |
| `partials/toc/toc.html` | 目录 |

### 短代码开发

短代码位于 `layouts/shortcodes/` 目录。命名规范：

- 简单短代码: `name.html` (如 `callout.html`)
- 命名空间短代码: `namespace/name.html` (如 `tabs/tabs.html`)

#### 基本短代码结构

```html
{{/* 获取参数 */}}
{{ $title := .Get "title" | default "默认标题" }}
{{ $type := .Get "type" | default "note" }}
{{ $content := .Inner }}

{{/* 渲染内容 */}}
<div class="custom-component">
    <h3>{{ $title }}</h3>
    <div>{{ $content | markdownify }}</div>
</div>
```

#### 参数说明

- `.Get "name"`: 获取命名参数
- `.Get 0`: 获取位置参数
- `.Inner`: 获取内部内容
- `.Params`: 所有参数

### 首页组件

首页由多个可组合的 section 组成：

- `sections/about.html`: 关于区域
- `sections/skills.html`: 技能展示
- `sections/posts.html`: 最新文章
- `sections/education.html`: 教育背景
- `sections/certifications.html`: 证书展示
- `sections/website-list.html`: 网站收藏

## 样式开发

### CSS 架构

1. `tailwind-compat.css`: Tailwind 兼容性层
2. `main.css`: 主样式入口
3. `app.css`: 应用样式
4. `style.css`: 自定义样式
5. `uno.css`: UnoCSS 生成（自动）

### 添加新样式

1. 在 `uno.config.ts` 的 safelist 中添加需要的类名
2. 或在对应模板中直接使用 UnoCSS 类
3. 复杂样式可添加到 `assets/css/style.css`

### 代码高亮

主题使用 Hugo 内置的 Chroma 代码高亮，支持多种主题：

- `monokai.css`
- `onedark.css`
- `github.css`
- `vs.css`

在配置中指定主题：

```toml
[markup]
  [markup.highlight]
    style = "monokai"
```

## JavaScript 开发

### 主题脚本

| 文件 | 说明 |
|------|------|
| `main.js` | 主入口，初始化功能 |
| `components.js` | 组件功能 |
| `custom.js` | 自定义脚本 |
| `swup/` | 页面过渡相关 |

### 添加新功能

1. 在 `main.js` 中添加初始化代码
2. 或创建新的模块文件
3. 在 `head/js.html` 中引入

### 使用 Alpine.js

主题集成了 Alpine.js，可直接在模板中使用：

```html
<div x-data="{ open: false }">
    <button @click="open = !open">切换</button>
    <div x-show="open">内容</div>
</div>
```

## 配置扩展

### 添加新参数

在 `hugo.toml` 的 `[params]` 下添加配置：

```toml
[params.custom]
  option1 = "value1"
  option2 = true
```

在模板中访问：

```go
{{ .Site.Params.custom.option1 }}
{{ .Site.Params.custom.option2 }}
```

### 添加新功能开关

在 `hugo.toml` 中：

```toml
[params.features]
  search = true
  newFeature = true
```

在模板中条件渲染：

```go
{{ if .Site.Params.features.newFeature }}
    <!-- 新功能内容 -->
{{ end }}
```

## 测试

### 本地测试

```bash
# 开发模式
just dev

# 构建测试
just build

# 搜索测试
just pf
```

### 示例内容

`exampleSite/` 目录包含完整的示例：

- 多种内容类型（博客、文档、项目）
- 各种组件使用示例
- 配置示例

## 构建发布

### 构建生产版本

```bash
just build
```

### 生成搜索索引

```bash
just pf
```

### 完整构建流程

```bash
just build && just pf
```

## 常见问题

### UnoCSS 类未生效

1. 确认类名在 safelist 中
2. 运行 `pnpm run build` 重新生成
3. 检查 `uno.config.ts` 配置

### 页面过渡动画不工作

确保在 `head/js.html` 中正确引入了 Swup，并检查 `sw.js` 配置。

### 搜索功能异常

1. 确认已运行 `pagefind_extended`
2. 检查 `public/pagefind/` 目录是否存在
3. 查看浏览器控制台错误信息

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 进行开发并测试
4. 提交 Pull Request

### 代码规范

- 使用清晰的命名
- 添加必要的注释
- 保持模板简洁
- 测试各种场景