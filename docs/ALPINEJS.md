> 这是一些 AI 生成的文档，可能有用。

# Alpine.js 文档

本文档介绍 Somnia 主题中 Alpine.js 的使用方法。

## 概述

Alpine.js 是一个轻量级的 JavaScript 框架，提供了响应式数据绑定、事件处理等特性。Somnia 主题使用 Alpine.js 实现多种交互功能。

## 初始化

主题已自动加载 Alpine.js，无需手动引入。在模板中直接使用 `x-data` 指令即可：

```html
<div x-data="{ open: false }">
    <button @click="open = !open">切换</button>
    <div x-show="open">内容</div>
</div>
```

## 主题内置组件

### 侧边栏切换

```javascript
function mainComponent() {
    return {
        sidebarShow: false,
        toggleSidebar() {
            this.sidebarShow = !this.sidebarShow;
        }
    }
}
```

使用：

```html
<div x-data="mainComponent()">
    <button @click="toggleSidebar()">Toggle Sidebar</button>
    <aside x-show="sidebarShow">侧边栏内容</aside>
</div>
```

### Back to Top 组件

返回顶部按钮，支持滚动百分比显示：

```javascript
function backToTopComponent() {
    return {
        needPercent: true,      // 是否需要百分比功能
        actionBtnsShow: false,  // 按钮是否可见
        scrollPercent: 0,        // 当前滚动百分比
        init() { /* 初始化 */ },
        calculateScrollPercent() { /* 计算百分比 */ },
        scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }
}
```

使用：

```html
<div x-data="backToTopComponent()" x-show="actionBtnsShow">
    <button @click="scrollToTop()">
        <span x-text="scrollPercent + '%'"></span>
    </button>
</div>
```

### 折叠面板

```javascript
function collapseComponent() {
    return {
        contentExpanded: false,
        headerClick() {
            this.contentExpanded = !this.contentExpanded;
        }
    }
}
```

### 时间线

```javascript
function timeComponent() {
    return {
        shichen(ts13) {
            // 十三位时间戳转中文时间
            // 返回格式：X 天前 • HH:MM • 辰时 食时 (早上)
        }
    }
}
```

### GitHub 卡片

```javascript
function githubCardComponent() {
    return {
        loading: true,
        repo: '',
        stargazers_count: null,
        forks_count: null,
        language: null,
        owner: { avatar_url: null },
        fetchGithub() {
            fetch(`https://api.github.com/repos/${this.repo}`)
                .then(res => res.json())
                .then(json => {
                    this.stargazers_count = json.stargazers_count;
                    this.forks_count = json.forks_count;
                    this.language = json.language;
                    this.owner = json.owner;
                    this.loading = false;
                });
        }
    }
}
```

使用：

```html
<div x-data="githubCardComponent()" x-init="initGithubCardComponent('用户名/仓库名')">
    <span x-show="loading">Loading...</span>
    <div x-show="!loading">
        <img :src="owner.avatar_url" />
        <span x-text="stargazers_count"></span>
        <span x-text="forks_count"></span>
    </div>
</div>
```

### 目录导航 (TOC)

```javascript
function tocComponent() {
    return {
        headings: [],
        tocLinks: [],
        headingProgress: {},
        init() {
            // 收集所有 heading 元素
            this.headings = Array.from(
                document.querySelectorAll('article h1, article h2...')
            );
            // 更新位置和样式
            this.updatePositionAndStyle();
        }
    }
}
```

使用：

```html
<nav x-data="tocComponent()" x-init="init()">
    <template x-for="link in tocLinks">
        <a :href="'#' + link.slug" x-text="link.text"></a>
    </template>
</nav>
```

### 一言引用

```javascript
function quoteComponent() {
    return {
        quote: '默认文本',
        init() {
            this.getData();
        },
        getData() {
            fetch('https://v1.hitokoto.cn/')
                .then(response => response.json())
                .then(data => this.quote = data.hitokoto)
        },
    }
}
```

### 英雄区域

```javascript
function heroComponent() {
    return {
        viewportHeight: window.innerHeight,
        imageOpacity: 0.45,
        onScroll() {
            // 根据滚动距离调整透明度
        }
    }
}
```

### 博客预览

```javascript
function blogPreviewComponent() {
    return {
        heroColor: '#9698C1',
        init() {
            // 随机生成颜色
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            this.heroColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        }
    }
}
```

### 版权信息

```javascript
function copyrightComponent() {
    return {
        qrcodeShow: false,
        qrcodeInit: false,
        copyLinkClick() {
            navigator.clipboard.writeText(window.location.href);
            somnia.showToast('Link copied!');
        },
        getQRCodeClick() {
            this.qrcodeShow = !this.qrcodeShow;
            if (!this.qrcodeInit) {
                this.newQRCode();
                this.qrcodeInit = true;
            }
        }
    }
}
```

### 搜索组件

```javascript
function pfSearchComponent() {
    return {
        init() {
            this.loadPFResource();
        },
        async loadPFResource() {
            // 动态加载 Pagefind 搜索资源
        }
    }
}
```

### 折叠面板

```javascript
function collapseComponent() {
    return {
        contentExpanded: false,
        headerClick() {
            this.contentExpanded = !this.contentExpanded;
        }
    }
}
```

## 工具函数

### 显示 Toast

主题提供了 `showToast` 函数：

```javascript
somnia.showToast("提示内容", 3000);  // 3秒后自动消失
```

### 加载外部资源

```javascript
somnia.loadResource({
    element: document.head,
    rel: 'stylesheet',
    href: 'https://example.com/style.css',
    type: 'module',
    defer: true
});
```

### 加载 KaTeX

```javascript
somnia.loadKaTeXResource(element);
// element 为要渲染数学公式的 DOM 元素
```

## 事件监听

### 滚动事件

```html
<div x-data="{ scrollPercent: 0 }" @scroll.window="onScroll">
    <!-- 内容 -->
</div>
```

### 窗口大小变化

```html
<div x-data="{ width: window.innerWidth }" @resize.window="width = window.innerWidth">
    <!-- 内容 -->
</div>
```

## Swup 配合使用

Swup 页面切换后，Alpine.js 组件需要重新初始化：

```javascript
swup.hooks.on('page:view', () => {
    // 重新初始化 Alpine 组件
    initYourComponent();
});
```

详细说明请参考 [SWUP.md](./SWUP.md)。

## 更多资源

- [Alpine.js 官方文档](https://alpinejs.dev/)
- [Alpine.js 中文文档](https://www.alpinejs.cn/)