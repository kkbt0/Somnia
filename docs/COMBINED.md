> 这是一些 AI 生成的文档，可能有用。

# Alpine.js + Swup.js 组合使用文档

本文档介绍如何在 Somnia 主题中结合使用 Alpine.js 和 Swup.js。

## 概述

Alpine.js 和 Swup.js 是两个互补的库：

- **Alpine.js**: 轻量级响应式 JavaScript 框架，处理组件逻辑和交互
- **Swup.js**: 页面过渡库，实现无刷新页面切换

两者结合可以实现：交互式组件 + 平滑页面过渡。

## 初始化顺序

在 Somnia 主题中，初始化顺序如下：

```html
<script defer>
    document.addEventListener('DOMContentLoaded', () => {
        // 1. 初始化静态功能
        swupPageInitMediumZoom();
        swupPageInitCustom();

        // 2. 初始化 Swup
        const swup = new Swup({
            containers: ['#content-wrapper'],
            plugins: [new SwupScrollPlugin()]
        });

        // 3. 设置页面切换后的回调
        swup.hooks.on('page:view', () => {
            swupPageInitMediumZoom();
            swupPageInitCustom();
        });
    });
</script>
```

Alpine.js 通过 `<script src="alpinejs.min.js">` 自动启动。

## 核心概念

### 页面切换时的生命周期

1. 用户点击链接
2. Swup 捕获点击事件
3. Swup 请求新页面内容
4. 退出动画（如有）
5. 内容替换
6. **page:view 钩子触发**
7. 进入动画（如有）
8. Alpine.js 自动重新初始化 `x-data` 指令

### Alpine.js 组件的重新初始化

Alpine.js 会自动处理 DOM 中新创建的 `x-data` 指令，但某些组件可能需要手动干预。

```javascript
// Swup 页面切换后
swup.hooks.on('page:view', () => {
    // Alpine.js 会自动重新初始化 x-data
    // 无需手动调用 Alpine.init()
});
```

## 实际案例

### 案例 1：带过渡的折叠面板

```html
<!-- components/collapse.html -->
<div x-data="{ expanded: false }" class="collapse">
    <button @click="expanded = !expanded" class="collapse-header">
        <span>点击展开</span>
        <svg :class="{ 'rotate-180': expanded }" class="transition-transform">
            <icon/icon name="chevron-down" />
        </svg>
    </button>
    <div x-show="expanded" x-collapse class="collapse-content">
        折叠内容...
    </div>
</div>
```

### 案例 2：目录导航 + 页面切换

```javascript
// assets/js/components.js
function tocComponent() {
    return {
        headings: [],
        currentSection: '',

        init() {
            this.collectHeadings();
            this.setupScrollSpy();
        },

        collectHeadings() {
            this.headings = Array.from(
                document.querySelectorAll('article h1, article h2, article h3')
            );
        },

        setupScrollSpy() {
            window.addEventListener('scroll', () => {
                this.updateActiveHeading();
            });
        },

        updateActiveHeading() {
            // 计算当前可见的 heading
        },

        scrollToHeading(id) {
            const heading = document.getElementById(id);
            if (heading) {
                heading.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
}
```

使用：

```html
<nav x-data="tocComponent()" x-init="init()">
    <ul>
        <template x-for="heading in headings" :key="heading.id">
            <li>
                <a :href="'#' + heading.id"
                   @click.prevent="scrollToHeading(heading.id)"
                   x-text="heading.text"></a>
            </li>
        </template>
    </ul>
</nav>
```

### 案例 3：搜索功能 + 页面缓存

```javascript
function searchComponent() {
    return {
        isOpen: false,
        query: '',
        results: [],

        init() {
            // 只在首次打开时加载资源
        },

        async search() {
            if (!this.query) return;

            // 使用 Pagefind 搜索
            const search = await import('/pagefind/pagefind-ui.js');
            // ... 搜索逻辑
        },

        open() {
            this.isOpen = true;
            // 确保搜索框获得焦点
            this.$nextTick(() => {
                this.$refs.searchInput.focus();
            });
        }
    }
}
```

### 案例 4：页面切换时保存状态

有时需要保留组件状态：

```javascript
function persistentComponent() {
    return {
        // 使用 sessionStorage 持久化状态
        init() {
            const saved = sessionStorage.getItem('myState');
            if (saved) {
                this.state = JSON.parse(saved);
            }
        },

        saveState() {
            sessionStorage.setItem('myState', JSON.stringify(this.state));
        },

        // Swup 页面切换前保存状态
        beforeLeave() {
            this.saveState();
        }
    }
}
```

### 案例 5：基于页面的条件渲染

```html
<div x-data="{ currentPage: '' }" x-init="currentPage = window.location.pathname">
    <template x-if="currentPage.includes('/posts/')">
        <div class="post-specific-component">
            <!-- 仅在文章页面显示 -->
        </div>
    </template>

    <template x-if="currentPage.includes('/docs/')">
        <div class="docs-specific-component">
            <!-- 仅在文档页面显示 -->
        </div>
    </template>
</div>
```

## 事件通信

### 通过 window 事件通信

```javascript
// 组件 A 发布事件
function componentA() {
    return {
        notify() {
            window.dispatchEvent(new CustomEvent('my-event', {
                detail: { data: 'some value' }
            }));
        }
    }
}

// 组件 B 订阅事件
function componentB() {
    return {
        init() {
            window.addEventListener('my-event', (e) => {
                console.log(e.detail.data);
            });
        }
    }
}
```

### 通过 Swup 钩子通信

```javascript
swup.hooks.on('page:view', () => {
    // 通知 Alpine 组件页面已切换
    window.dispatchEvent(new CustomEvent('swup:pageview'));
});

function myComponent() {
    return {
        init() {
            window.addEventListener('swup:pageview', () => {
                // 响应页面切换
                this.onPageChange();
            });
        },
        onPageChange() {
            console.log('Page changed');
        }
    }
}
```

## 性能优化

### 避免重复初始化

```javascript
// 组件添加唯一标识，避免重复绑定
function smartComponent() {
    return {
        initialized: false,
        init() {
            if (this.initialized) return;
            this.initialized = true;
            // 初始化逻辑
        }
    }
}
```

### 使用 x-trace 调试

```html
<div x-data="{ value: 'test' }" x-trace>
    <!-- 调试信息 -->
</div>
```

### 懒加载资源

```javascript
function lazyComponent() {
    return {
        loaded: false,
        load() {
            if (this.loaded) return;
            loadResource({
                href: 'https://example.com/script.js',
                type: 'module'
            }).then(() => {
                this.loaded = true;
            });
        }
    }
}
```

## 常见问题

### 问题 1：页面切换后事件不工作

**原因**：Swup 替换内容后，旧的事件监听器失效。

**解决**：在 `page:view` 钩子中重新绑定：

```javascript
swup.hooks.on('page:view', () => {
    // 重新绑定事件
    attachEventListeners();
});
```

### 问题 2：Alpine 组件状态丢失

**原因**：每次页面切换 DOM 被完全替换。

**解决**：使用外部存储：

```javascript
function persistentComponent() {
    return {
        value: localStorage.getItem('value') || '',
        updateValue(newValue) {
            this.value = newValue;
            localStorage.setItem('value', newValue);
        }
    }
}
```

### 问题 3：动画冲突

**原因**：Swup 过渡动画与 Alpine 动画同时运行。

**解决**：使用 Swup 钩子控制 Alpine 动画：

```javascript
swup.hooks.on('animation:out-start', () => {
    // 暂停 Alpine 动画
});

swup.hooks.on('animation:in-end', () => {
    // 恢复 Alpine 动画
});
```

### 问题 4：滚动位置不正确

**原因**：Alpine 滚动组件与 SwupScrollPlugin 冲突。

**解决**：使用 Swup 提供的滚动方法：

```javascript
// 不要使用 window.scrollTo
// 使用 Swup 的滚动方法
swup.scrollTo(0);  // 顶部
swup.scrollTo('#anchor');  // 锚点
```

## 最佳实践

### 1. 保持组件简洁

```javascript
// 好：单一职责
function simpleComponent() {
    return {
        isOpen: false,
        toggle() {
            this.isOpen = !this.isOpen;
        }
    }
}

// 不好：职责过多
function complexComponent() {
    return {
        // 50+ 行代码
    }
}
```

### 2. 使用语义化命名

```javascript
// 好
function navigationComponent() { }

// 不好
function nav() { }
```

### 3. 正确处理清理

```javascript
function cleanupComponent() {
    return {
        observer: null,
        init() {
            this.observer = new IntersectionObserver(...);
        },
        destroy() {
            if (this.observer) {
                this.observer.disconnect();
            }
        }
    }
}
```

### 4. 避免全局状态

```javascript
// 好：组件本地状态
function localComponent() {
    return {
        count: 0
    }
}

// 不好：全局状态
window.globalCount = 0;
```

## 完整示例

### 带搜索和过渡的博客

```html
<!-- 搜索组件 -->
<div x-data="searchComponent()" x-init="init()">
    <button @click="open()">
        <icon/icon name="search" />
    </button>

    <div x-show="isOpen" class="search-modal" @click.outside="isOpen = false">
        <input x-model="query" @input.debounce.300ms="search()" />
        <template x-if="results.length">
            <ul>
                <template x-for="result in results">
                    <li>
                        <a :href="result.url" x-text="result.title"></a>
                    </li>
                </template>
            </ul>
        </template>
    </div>
</div>

<script>
// 组件定义
function searchComponent() {
    return {
        isOpen: false,
        query: '',
        results: [],
        init() {
            // 只在首次打开时加载
        },
        async search() {
            if (this.query.length < 2) return;
            // 搜索逻辑
        },
        open() {
            this.isOpen = true;
        }
    }
}
</script>
```

## 相关文档

- [Alpine.js 文档](./ALPINEJS.md)
- [Swup.js 文档](./SWUP.md)
- [Alpine.js 官方文档](https://alpinejs.dev/)
- [Swup 官方文档](https://swup.js.org/)