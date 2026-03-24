---
title: Somnia
date: 2025-01-01T10:00:00+08:00

tag: ["Somnia"]
categories: ["技术"]

featuredImage: "/images/default.webp"
---

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
