## 使用方法

### 1. 放置文件

将 `sw.js` 放到 Hugo 项目的 `static/` 目录下：

```
your-hugo-site/
└── static/
    └── sw.js       ← 放这里
```

Hugo 构建后会自动复制到网站根目录，Service Worker 必须位于根路径才能控制整个站点。

---

### 2. 注册 Service Worker

在 Hugo 的 `layouts/partials/` 下创建或编辑 `footer.html`（或 `head.html`），添加注册脚本：

```html
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('[Somnia] [SW] 注册成功，scope:', reg.scope))
        .catch(err => console.error('[Somnia] [SW] 注册失败:', err));
    });
  }
</script>
```

---

### 3. 按需修改配置

打开 `sw.js` 顶部的**配置区**，根据实际情况调整：

| 配置项 | 说明 |
|---|---|
| `CACHE_VERSION` | 发布重大更新时手动改版本号（如 `v2`），强制清除旧缓存 |
| `PRE_CACHE_URLS` | 安装时预缓存的页面，去掉不存在的路径（如 `/index.json`）|

---

### 4. 创建离线页（可选但推荐）

创建 `content/offline.md`：

```markdown
---
title: "离线"
url: "/offline/"
---
您当前处于离线状态，请检查网络后刷新。
```

---

### 5. Hugo Pipes 带 Hash 文件的兼容说明

Hugo Pipes 生成的指纹文件形如 `/css/main.abc12345.css`，sw.js 通过正则自动识别并使用**缓存优先策略**，无需任何额外配置。只要你的模板使用了标准的 `fingerprint` pipe：

```go-html-template
{{ $css := resources.Get "css/main.css" | fingerprint }}
<link rel="stylesheet" href="{{ $css.RelPermalink }}">
```

就会被正确处理。

---

### 调试技巧

- Chrome DevTools → Application → Service Workers 查看运行状态
- 勾选 **Update on reload** 在开发时禁用缓存
- 手动清缓存：在控制台执行 `navigator.serviceWorker.controller?.postMessage({ type: 'CLEAR_CACHE' })`