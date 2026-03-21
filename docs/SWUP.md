> 这是一些 AI 生成的文档，可能有用。

# Swup.js 文档

本文档介绍 Somnia 主题中 Swup.js 的使用方法。

## 概述

Swup.js 是一个用于创建平滑页面过渡的 JavaScript 库。Somnia 主题使用 Swup.js 实现无刷新页面切换，提升用户体验。

## 初始化

主题已自动配置 Swup，无需手动引入。默认配置如下：

```javascript
const swup = new Swup({
    containers: ['#content-wrapper'],
    plugins: [
        new SwupScrollPlugin(),
    ]
});
```

## 可用插件

### SwupScrollPlugin

处理页面切换时的滚动行为，支持：

- 页面切换自动滚动到顶部
- 锚点链接平滑滚动
- 滚动位置恢复
- 历史浏览滚动位置记忆

### SwupPreloadPlugin (可选)

预加载链接资源。在 `js.html` 中已注释，如需启用：

```html
{{ $swupPreload := resources.Get "js/swup/preload-plugin.js" }}
<script defer src="{{ $swupPreload.RelPermalink }}"></script>
```

并在初始化时添加：

```javascript
const swup = new Swup({
    containers: ['#content-wrapper'],
    plugins: [
        new SwupScrollPlugin(),
        new SwupPreloadPlugin(),
    ]
});
```

## 生命周期钩子

Swup 提供多种生命周期钩子：

### page:view

页面视图更新后触发（每次页面切换完成）：

```javascript
swup.hooks.on('page:view', () => {
    console.log('Page view updated');
});
```

### content:replace

内容替换前触发：

```javascript
swup.hooks.on('content:replace', () => {
    console.log('Content will be replaced');
});
```

### page:load

新页面加载后触发：

```javascript
swup.hooks.on('page:load', () => {
    console.log('New page loaded');
});
```

### animation:out-start / animation:out-end

退出动画开始/结束时触发：

```javascript
swup.hooks.on('animation:out-start', () => {
    // 开始退出动画
});
swup.hooks.on('animation:out-end', () => {
    // 退出动画结束
});
```

### animation:in-start / animation:in-end

进入动画开始/结束时触发：

```javascript
swup.hooks.on('animation:in-start', () => {
    // 开始进入动画
});
swup.hooks.on('animation:in-end', () => {
    // 进入动画结束
});
```

## 主题集成

### 页面切换后重新初始化功能

Somnia 主题在每次页面切换后重新初始化以下功能：

```javascript
swup.hooks.on('page:view', () => {
    swupPageInitMediumZoom();  // 图片放大功能
    swupPageInitCustom();      // 自定义初始化
});
```

### 自定义初始化函数

在 `custom.js` 中定义：

```javascript
function swupPageInitCustom() {
    console.log("[Swup] Page View");
}
```

添加自定义逻辑：

```javascript
function swupPageInitCustom() {
    // 重新初始化 TOC
    initToc();

    // 重新绑定事件
    setupEventListeners();

    // 重新渲染代码块
    highlightCode();
}
```

## 编程式导航

### 跳转页面

```javascript
swup.navigate('/new-page/');
```

### 预加载链接

```javascript
swup.preload('/about/');
```

### 手动触发滚动

```javascript
swup.scrollTo(0);  // 滚动到顶部
swup.scrollTo('#section-id');  // 滚动到锚点
```

## 配置选项

### containers

指定要更新的容器：

```javascript
const swup = new Swup({
    containers: ['#content-wrapper', '#sidebar']
});
```

### cache

启用页面缓存：

```javascript
const swup = new Swup({
    cache: true
});
```

### animateScroll

控制滚动动画：

```javascript
const swup = new Swup({
    animateScroll: {
        betweenPages: true,  // 页面间切换时动画
        samePageWithHash: true,  // 同页锚点跳转动画
        samePage: true  // 同页无锚点跳转动画
    }
});
```

### doScrollingRightAway

是否立即滚动：

```javascript
const swup = new Swup({
    doScrollingRightAway: false
});
```

## 禁用 Swup

如果需要禁用 Swup 页面过渡，可以注释掉初始化代码：

```html
<script defer>
    document.addEventListener('DOMContentLoaded', () => {
        // const swup = new Swup({...});
    })
</script>
```

或使用 `native: true` 启用原生过渡：

```javascript
const swup = new Swup({
    containers: ['#content-wrapper'],
    native: true
});
```

## 与 Alpine.js 配合

由于 Swup 会替换页面内容，使用 Alpine.js 的组件需要重新初始化：

```javascript
swup.hooks.on('page:view', () => {
    // 重新初始化 Alpine 组件
    // Alpine.js 会自动处理 x-data 指令
    // 但需要确保 DOM 元素存在
});
```

### 完整示例

```javascript
document.addEventListener('DOMContentLoaded', () => {
    const swup = new Swup({
        containers: ['#content-wrapper'],
        plugins: [
            new SwupScrollPlugin({
                doScrollingRightAway: true,
                animateScroll: {
                    betweenPages: true,
                    samePageWithHash: true
                }
            })
        ]
    });

    // 页面切换完成后
    swup.hooks.on('page:view', () => {
        // 重新初始化 Medium Zoom
        swupPageInitMediumZoom();

        // 重新初始化自定义功能
        swupPageInitCustom();

        // 重新绑定事件
        bindEvents();
    });
});
```

## 常见问题

### 页面过渡不生效

1. 检查容器 ID 是否正确
2. 确认 Swup 已正确加载
3. 检查是否有 JavaScript 错误

### 滚动位置不正确

确保使用了 SwupScrollPlugin：

```javascript
plugins: [new SwupScrollPlugin()]
```

### 锚点链接不工作

检查目标元素是否存在：

```html
<h2 id="section">Section</h2>
<a href="#section">Go to Section</a>
```

## 更多资源

- [Swup 官方文档](https://swup.js.org/)
- [Swup Scroll Plugin](https://swup.js.org/plugins/scroll-plugin/)
- [Swup Preload Plugin](https://swup.js.org/plugins/preload-plugin/)