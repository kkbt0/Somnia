---
title: Somnia
date: 2025-01-01T03:00:00+08:00

tag: ["Somnia"]
categories: ["技术"]

featuredImage: "/images/default.webp"
---

## 简介

一个现代化、优雅的 Hugo 主题，基于 Astro Theme Pure 移植而来。使用了 Alpine.js + UnoCSS 构建，支持现代化的网站开发体验。[缘起](https://www.ftls.xyz/posts/2026-03-22-hugo-theme-somnia/)

## 快速体验

```bash
git clone https://github.com/kkbt0/Somnia
cd Somnia
just
```
参考 justfile 文件。如果你没有安装 just，也可以直接复制命令到命令行执行。
```bash
git clone https://github.com/kkbt0/Somnia
cd Somnia
hugo server -s exampleSite/ --disableFastRender
```

- 需要注意，本项目需要 Hugo >= v0.158.0 环境。
- 如果需要使用 UnoCSS ，需要 pnpm install 安装依赖。
- 如果需要使用 Pagefind 提供的搜索，需要安装 pagefind_extended。

配置参考 `Somnia/exampleSite/config/_default` 下文件，以及 `Somnia/exampleSite/hugo.toml` 文件。

## 自定义 CSS/JS

编写自定义的 CSS/JS 可以参考`your_website/themes/Somnia/assets/js/custom.js` 和 `your_website/themes/Somnia/assets/css/custom.css`，在 `your_website/assets/css/custom.css` 和 `your_website/assets/js/custom.js` 中编写代码。以覆盖原有的 custom 样式/脚本。

这在你需要不修改 Somnia 主题的情况下定制你的主题，或编写 shortcode 的时候会用到。

## 评论系统

### Mastodon

实现了一个基于 Mastodon 嘟嘟的展示当做 Somnia 的评论系统。

配置文件中添加
```toml
[params.comment]
enable = true
provider = "Mastodon"
```

然后在 markdown 中添加

```yaml
---
title: Title
comments: true
fediverse: "https://mastodon.social/@name/xxxxxxxxx"
---
```

## 注意事项

- Suwp.js 访问同源网页，需要链接指向的网页/xml等资源包含容器。或 `_blank` 。如 `index.xml` 页面直接跳转控制台会报错，并且回退后 Swup.js 无法正常运行。