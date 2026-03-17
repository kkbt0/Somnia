# Somnia

一个现代化、优雅的 Hugo 主题，基于 Astro Theme Pure 移植而来。

> [!WARNING]  
> 这并不是一个开箱即用的主题。如果你喜欢这个样式，可以使用 Astro 和原始主题：[Astro Theme Pure](https://github.com/cworld1/astro-theme-pure) by [cworld1](https://github.com/cworld1)
> 如果想在 Hugo 中使用 Somnia，目前需要修改很多主题代码来自定义。代码仅供个人记录和感兴趣者参考。

## 特性

使用了 Alpinejs + UnoCSS 构建。

- 🎉 **轻量框架** - 由 Alpinejs 驱动
- 🚀 **快速生成** - 1k+ markdown 仅个位数时间
- 🌙 **深色模式** - 支持浅色/深色/系统三种主题自动切换
- 📱 **响应式设计** - 完美适配各种设备尺寸
- 🔍 **内置搜索** - 快速找到你需要的内容
- 📑 **目录导航** - 文章内容自动生成侧边目录
- 🎨 **现代化 UI** - 使用 UnoCSS 原子化 CSS 框架
- ⚡ **极速加载** - 优化的性能表现
- 🔧 **丰富的短代码** - 卡片、标签页、时间线等多种组件
- 🖼️ **图片缩放** - Medium Zoom 图片查看体验

## 未完善说明

这是一个正在开发中的主题，目前存在以下限制和待完善的地方：

### 🚧 核心限制

- **非开箱即用** - 主题中包含大量硬编码的内容和配置，需要直接修改主题代码才能正常使用
- **配置不完整** - 很多功能无法通过配置文件自定义，必须编辑 HTML 模板
- **缺少主题选项** - 配色、布局、功能开关等都没有提供配置项

### 📝 内容相关

- **首页组件硬编码** - `layouts/partials/home/` 下的组件包含大量示例内容，需要手动替换
- **个人信息硬编码** - 作者信息、社交链接等可能需要直接修改模板

### 🔧 技术债务

- **TODO 标记** - 部分代码中还有待实现的功能标记 搜索 `[TODO]` 以查看

### 📚 文档和示例

- **短代码文档不完整** - 很多短代码缺少使用说明和参数文档
- **缺少教程** - 没有详细的自定义和开发教程

### 🎨 样式和定制

- **UnoCSS 编译** - 修改模板需要同时运行 UnoCSS 构建流程
- **主题色定制** - 高亮色等配色需要修改 CSS 变量

### 📑 未来计划

- 目前结构类似 Vue 组件，HTML CSS JS 混合。后续会将 HTML CSS JS 分离。（ shortcode 不会）
- 分离 JS 后，计划引入 Swupjs 以实现无刷新翻页，并且 Alpinejs 可以正常工作
- css 合并压缩
- 无封面图文章相关

## 快速开始

查看 justfile 可以执行的命令。

### 前置要求

- Hugo 0.116.0 或更高版本（开发环境 hugo v0.157.0+extended+withdeploy linux/amd64 BuildDate=unknown）
- pnpm (用于开发时构建 UnoCSS)

### 配置

参考 `exampleSite/config/_default/hugo.toml` 和 `exampleSite/hugo.toml` 进行配置

## 项目结构

```
Somnia/
├── archetypes/          # 内容原型模板
├── assets/              # 静态资源
│   ├── css/            # 样式文件
│   └── js/             # JavaScript 文件
├── exampleSite/         # 示例站点
├── layouts/             # 布局模板
│   ├── _default/       # 默认布局
│   ├── partials/       # 可复用组件
│   ├── posts/          # 文章相关布局
│   └── shortcodes/     # 短代码组件
├── hugo.toml           # Hugo 主题配置
├── theme.toml          # 主题元数据
├── package.json         # Node.js 依赖
├── pnpm-lock.yaml       # pnpm 锁文件
└── uno.config.ts        # UnoCSS 配置
```

## 短代码

Somnia 提供了丰富的短代码，让你可以轻松创建丰富的内容：

### 基础组件

- `{{< card >}}` - 卡片组件
- `{{< callout >}}` - 提示框
- `{{< label >}}` - 标签
- `{{< button >}}` - 按钮
- `{{< quote >}}` - 引用

### 布局组件

- `{{< tabs >}}` + `{{< tab >}}` - 标签页
- `{{< collapse >}}` - 折叠面板
- `{{< timeline >}}` - 时间线
- `{{< steps >}}` - 步骤指示器

### 内容增强

- `{{< toc >}}` - 目录
- `{{< qrcode >}}` - 二维码
- `{{< link-preview >}}` - 链接预览
- `{{< github-card >}}` - GitHub 卡片

### 页面组件

- `{{< projects-cards-group >}}` - 项目卡片组
- `{{< friend-cards-group >}}` - 友链卡片组
- `{{< tool-section >}}` - 工具展示区
- `{{< sponsorship >}}` - 赞助模块

## 开发

如果你想参与主题开发或自定义：

```bash
# 克隆仓库
git clone https://github.com/kkbt0/Somnia.git
cd Somnia

# 安装依赖
pnpm install

# 开发模式（监听文件变化并构建 UnoCSS）
pnpm dev

# 构建生产版本
pnpm build
```

### UnoCSS 开发

主题使用 UnoCSS 进行样式管理，修改模板时需要同时运行 UnoCSS 构建：

```bash
pnpm dev
```

这会监听 `layouts/**/*.html` 的变化并自动生成 `assets/css/uno.css`。

## 技术栈

- **Hugo** - 静态站点生成器
- **UnoCSS** - 原子化 CSS 引擎
  - `@unocss/preset-wind4` - Tailwind CSS v4 风格预设
  - `@unocss/preset-typography` - 排版预设
  - `@unocss/preset-icons` - 图标预设
  - `@unocss/preset-attributify` - 属性化模式
- **Alpine.js** - 轻量级交互框架（内联使用）

## 作者

- **恐咖兵糖** - [GitHub](https://github.com/kkbt0)

## 致谢

- 原始主题：[Astro Theme Pure](https://github.com/cworld1/astro-theme-pure) by [cworld1](https://github.com/cworld1)

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

**享受使用 Somnia！** 🎉
