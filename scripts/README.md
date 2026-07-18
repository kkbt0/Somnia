# scripts

主题构建与维护脚本集合，涵盖依赖管理、SVG 资源处理和第三方库打包。

## 文件说明

### `version.js` / `version.json` — 依赖版本管理（已废弃）

| 文件 | 说明 |
|------|------|
| `version.js` | 检查并下载最新版本的第三方 JS 依赖（Alpine.js、Swup、Medium Zoom 等），更新到 `assets/js/libs/` 目录 |
| `version.json` | 记录各依赖的当前版本、远程地址和本地路径，由 `version.js` 自动更新 |

从 `version.json` 中可以看到管理工具跟踪以下依赖：

- **swup** — Swup 核心库（无刷新页面导航）
- **swup/scroll-plugin** — Swup 滚动位置恢复插件
- **alpinejs** — Alpine.js 交互框架
- **async-alpine** — Alpine.js 异步加载扩展

所有依赖均通过 `https://unpkg.com` 获取，下载后存放于 `assets/js/libs/`。

### `svg_mini.js` — 快速 SVG 压缩（Bun）

使用 Bun 运行时对 `static/icons/main.svg.src` 进行简单压缩，生成 `static/icons/main.svg`。

压缩方式较为基础，适合快速处理单文件。

### `svg_compressor.ts` — 安全 SVG 压缩工具（Deno）

更完善的 SVG 压缩工具，支持两种压缩模式：

- **安全压缩**（默认）— 保护 `<text>`、`<tspan>`、`<title>` 等元素内的文本内容不丢失空格，同时压缩标签间和属性间的空白
- **简单压缩**（`--simple`）— 全局压缩所有空白，适用于不含文本内容的装饰性图标

支持文件输入输出、标准输出和管道用法。

### `svg_compressor.md` — SVG 压缩工具使用说明

`svg_compressor.ts` 的详细使用文档（命令行用法、模块用法、测试用例）。

### `libs/vendor.js` — 第三方库打包

从 `node_modules/` 中复制 Alpine.js、Async Alpine、Medium Zoom 的 ESM 模块到 `assets/js/libs/`，并通过 `Bun.build` 打包 Swup + Scroll Plugin。

> 主题使用 Hugo 内置的 `js.Build`（基于 esbuild），为避免 UMD 模块格式在此环境下的兼容性问题，所有第三方库均以 **ESM 格式**输出。

## 使用方式

```bash
# 更新 JS 依赖（需要 llrt 或 bun 运行时）
# justfile 中的 update 命令会调用此脚本
bun run ./scripts/libs/vendor.js

# 快速压缩 SVG（Bun）
bun run ./scripts/svg_mini.js

# 安全压缩 SVG（Deno）
deno run --allow-read --allow-write ./scripts/svg_compressor.ts static/icons/main.svg.src -o static/icons/main.svg

# 更新依赖版本（需要 llrt）
llrt ./scripts/version.js
```

## 运行时要求

| 脚本 | 运行时 |
|------|--------|
| `version.js` | [llrt](https://github.com/awslabs/llrt) 或 Bun |
| `svg_mini.js` | Bun |
| `svg_compressor.ts` | Deno |
| `libs/vendor.js` | Bun |

> ⚠️ **注意**：`scripts/libs/vendor.js` 需要先运行 `bun install` 安装依赖（`package.json` 中的 `dependencies`）。

## 工作流程

以下是依赖库从安装到进入 `assets/js/libs/` 的完整流程：

```bash
# 1. 更新 npm 依赖
bun install
bun update

# 2. 从 node_modules 复制并打包 ESM 模块到 assets/js/libs/
bun run ./scripts/libs/vendor.js

# 3. （可选）通过 version.js 检查并更新到最新版本
llrt ./scripts/version.js

# 4. 再次运行 vendor.js 同步最新依赖
bun run ./scripts/libs/vendor.js
```
