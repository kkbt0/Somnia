---
title: Alpine.js 从入门到精通 3 全局与其他
date: 2025-01-01T09:00:00+08:00

tags: ["Alpine.js", "前端", "JavaScript"]
categories: ["技术"]
---


## 三、全局 Globals

Alpine.js 提供了一些全局方法和对象，可以在任何地方使用。

### 1. Alpine.data() 可复用数据逻辑

**解读**：`Alpine.data()` 用于定义可复用的数据逻辑，类似于 Vue 的 `setup()` 或 React 的自定义 Hook。

**示例代码**：

```html
<script>
// 定义可复用的倒计时逻辑
Alpine.data('countdown', (initialSeconds = 60) => ({
    seconds: initialSeconds,
    timer: null,
    get isRunning() {
        return this.timer !== null;
    },
    get isExpired() {
        return this.seconds <= 0;
    },
    start() {
        if (this.timer) return;
        this.timer = setInterval(() => {
            this.seconds--;
            if (this.seconds <= 0) {
                this.stop();
            }
        }, 1000);
    },
    stop() {
        clearInterval(this.timer);
        this.timer = null;
    },
    reset(newSeconds = initialSeconds) {
        this.stop();
        this.seconds = newSeconds;
    }
}));

// 定义可复用的模态框逻辑
Alpine.data('modal', (initialOpen = false) => ({
    open: initialOpen,
    init() {
        // 监听 ESC 键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.open) {
                this.close();
            }
        });
    },
    toggle() {
        this.open = !this.open;
        if (this.open) {
            this.$nextTick(() => {
                this.$refs.focusEl?.focus();
            });
        }
    },
    close() {
        this.open = false;
    }
}));
</script>

<!-- 使用倒计时组件 -->
<div x-data="countdown(120)">
    <h3>验证码倒计时</h3>
    <p>剩余时间: <span x-text="seconds"></span> 秒</p>
    <button @click="start()" :disabled="isRunning || isExpired" x-text="isExpired ? '已过期' : (isRunning ? '倒计时中...' : '开始倒计时')">
    </button>
    <button @click="reset()">重置</button>
</div>

<!-- 使用模态框组件 -->
<div x-data="modal(false)">
    <button @click="toggle()">打开模态框</button>

    <div x-show="open" x-transition.opacity class="fixed inset-0 bg-black bg-opacity-50 z-40" @click="close()">
    </div>

    <div x-show="open"
         x-transition:enter="transition ease-out duration-300"
         x-transition:enter-start="opacity-0 transform scale-95"
         x-transition:enter-end="opacity-100 transform scale-100"
         x-transition:leave="transition ease-in duration-200"
         x-transition:leave-start="opacity-100 transform scale-100"
         x-transition:leave-end="opacity-0 transform scale-95"
         class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
         @click.outside="close()">
        <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full pointer-events-auto" @click.stop>
            <h2 class="text-xl font-bold mb-4">模态框标题</h2>
            <p class="mb-4">这是一个可复用的模态框组件。</p>
            <input x-ref="focusEl" type="text" placeholder="自动聚焦" class="w-full p-2 border rounded mb-4">
            <div class="flex justify-end gap-2">
                <button @click="close()" class="px-4 py-2 border rounded">取消</button>
                <button @click="close()" class="px-4 py-2 bg-blue-500 text-white rounded">确认</button>
            </div>
        </div>
    </div>
</div>
```

**适用范围**：
- 需要在多个组件中复用的相同逻辑
- 创建可复用的 UI 组件（如模态框、轮播、倒计时）
- 将复杂的组件逻辑拆分到单独文件中

**注意事项**：
1. `Alpine.data()` 必须在 Alpine 初始化之前定义（通常在 `<head>` 或页面顶部）
2. 数据函数应该返回一个对象，该对象将成为组件的 `x-data`
3. 可以接收参数来创建可配置的复用逻辑
4. 数据函数中的 `this` 在组件初始化后才绑定，避免在返回的对象中直接使用 `this`

---

### 2. Alpine.store() 全局状态

详见魔法属性 `$store` 部分。

---

### 3. Alpine.bind() 批量属性绑定

**解读**：`Alpine.bind()` 用于创建可复用的属性绑定集合，类似于创建可复用的 "props"。

**示例代码**：

```html
<script>
// 定义可复用的按钮绑定
Alpine.bind('button', () => ({
    type: 'button',
    class: 'px-4 py-2 rounded font-medium transition-colors',
    ':class'() {
        return {
            'bg-blue-500 text-white hover:bg-blue-600': this.variant === 'primary',
            'bg-gray-200 text-gray-800 hover:bg-gray-300': this.variant === 'secondary',
            'bg-red-500 text-white hover:bg-red-600': this.variant === 'danger'
        };
    }
}));

// 定义输入框绑定
Alpine.bind('input', () => ({
    class: 'w-full px-3 py-2 border rounded focus:outline-none focus:ring-2',
    ':class'() {
        return {
            'border-gray-300 focus:ring-blue-500': !this.error,
            'border-red-500 focus:ring-red-500': this.error
        };
    }
}));
</script>

<!-- 使用绑定的按钮 -->
<div x-data="{ variant: 'primary' }">
    <h3>按钮样式</h3>
    <div class="flex gap-2 mb-4">
        <button @click="variant = 'primary'">主要</button>
        <button @click="variant = 'secondary'">次要</button>
        <button @click="variant = 'danger'">危险</button>
    </div>

    <button x-bind="Alpine.bind('button')" x-data="{ variant: variant }">
        示例按钮
    </button>
</div>

<!-- 使用绑定的输入框 -->
<div x-data="{ value: '', error: false, errorMessage: '' }">
    <h3>输入框验证</h3>
    <input
        x-bind="Alpine.bind('input')"
        x-model="value"
        @blur="error = value.length < 3; errorMessage = error ? '至少需要3个字符' : ''"
        placeholder="输入至少3个字符">
    <p x-show="error" x-text="errorMessage" class="text-red-500 text-sm mt-1"></p>
    <p class="text-gray-500 text-sm mt-1">当前长度: <span x-text="value.length"></span></p>
</div>
```

**适用范围**：
- 创建可复用的组件属性配置
- 统一管理设计系统中的样式变体
- 封装复杂的属性绑定逻辑

**注意事项**：
1. `Alpine.bind()` 返回的对象可以包含任何 Alpine 指令绑定
2. 绑定函数中的 `this` 指向使用绑定的组件
3. 可以嵌套使用多个 bind 或与普通属性结合
4. 绑定优先级：显式属性 > bind 属性

---

### 4. Alpine.directive() 自定义指令

**解读**：`Alpine.directive()` 允许你创建自定义指令，扩展 Alpine 的功能。这是 Alpine 最强大的扩展机制之一。

**示例代码**：

```html
<script>
// 自定义 v-uppercase 指令：自动将输入转为大写
document.addEventListener('alpine:init', () => {
    Alpine.directive('uppercase', (el, { expression }, { evaluate, effect, cleanup }) => {
        // 获取绑定的表达式值（如果需要）
        const getValue = () => evaluate(expression);

        // 监听输入事件，转换为大写
        const handler = () => {
            el.value = el.value.toUpperCase();
            // 触发 input 事件以更新 x-model
            el.dispatchEvent(new Event('input', { bubbles: true }));
        };

        el.addEventListener('input', handler);

        // 清理函数：组件卸载时移除事件监听
        cleanup(() => {
            el.removeEventListener('input', handler);
        });
    });
});

// 自定义 v-tooltip 指令：简单的工具提示
document.addEventListener('alpine:init', () => {
    Alpine.directive('tooltip', (el, { expression }, { evaluate, effect, cleanup }) => {
        const text = evaluate(expression);

        // 创建 tooltip 元素
        const tooltip = document.createElement('div');
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: #333;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.2s;
            pointer-events: none;
        `;

        // 显示/隐藏函数
        const show = () => {
            document.body.appendChild(tooltip);
            const rect = el.getBoundingClientRect();
            tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 4 + 'px';
            tooltip.style.opacity = '1';
        };

        const hide = () => {
            tooltip.style.opacity = '0';
            setTimeout(() => tooltip.remove(), 200);
        };

        // 绑定事件
        el.addEventListener('mouseenter', show);
        el.addEventListener('mouseleave', hide);

        // 清理
        cleanup(() => {
            el.removeEventListener('mouseenter', show);
            el.removeEventListener('mouseleave', hide);
            tooltip.remove();
        });
    });
});
</script>

<!-- 使用自定义 v-uppercase 指令 -->
<div x-data="{ text: '' }">
    <h3>大写输入框</h3>
    <input v-uppercase x-model="text" placeholder="输入自动转为大写">
    <p>结果: <span x-text="text"></span></p>
</div>

<!-- 使用自定义 v-tooltip 指令 -->
<div x-data="{}">
    <h3>工具提示</h3>
    <button v-tooltip="'点击提交表单'">提交</button>
    <a href="#" v-tooltip="'返回首页'">首页</a>
    <span v-tooltip="'需要填写的信息'">?</span>
</div>
```

**指令参数解析**：

```javascript
Alpine.directive('my-directive', (el, directive, utilities) => {
    // el: 指令绑定的 DOM 元素
    // directive: { value, expression, modifiers }
    //   - value: 指令的值（如 v-my-directive:value）
    //   - expression: 绑定的表达式字符串
    //   - modifiers: 指令修饰符数组（如 v-my-directive.mod1.mod2）
    // utilities: { effect, cleanup, evaluate }
    //   - effect: 创建响应式副作用
    //   - cleanup: 注册清理函数
    //   - evaluate: 计算表达式值
});
```

**适用范围**：
- 创建可复用的自定义行为
- 封装与第三方库的集成
- 添加特殊的表单处理逻辑
- 创建声明式的 DOM 操作

**注意事项**：
1. 指令名称建议使用 `v-` 前缀以区分 Alpine 原生指令
2. 始终提供 `cleanup` 函数以避免内存泄漏
3. 在 `alpine:init` 事件中注册指令，确保 Alpine 已准备好
4. 复杂的指令应该拆分为多个小指令，保持单一职责

---

## 四、插件 Plugins

Alpine.js 拥有一个丰富的插件生态系统，可以扩展其核心功能。

### 1. Collapse（折叠）

**功能**：为 `x-show` 添加高度平滑过渡效果，而不是简单的显示/隐藏。

**安装**：
```html
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/collapse@3.x.x/dist/cdn.min.js"></script>
```

**示例代码**：

```html
<div x-data="{ open: false }">
    <button @click="open = !open">
        <span x-text="open ? '收起' : '展开'"></span>
    </button>

    <!-- 使用 x-collapse 实现高度动画 -->
    <div x-show="open" x-collapse class="overflow-hidden">
        <div class="p-4 bg-gray-100">
            <p>这里是折叠内容...</p>
            <p>可以是任意长度的内容</p>
            <p>高度会自动适应</p>
        </div>
    </div>
</div>
```

---

### 2. Focus（焦点管理）

**功能**：管理焦点，常用于模态框、下拉菜单等需要控制焦点流动的组件。

**安装**：
```html
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/focus@3.x.x/dist/cdn.min.js"></script>
```

**示例代码**：

```html
<div x-data="{ open: false }">
    <button @click="open = true" x-ref="trigger">打开模态框</button>

    <div x-show="open"
         x-trap.noscroll="open"
         @keydown.escape.window="open = false"
         class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">

        <div class="bg-white p-6 rounded-lg max-w-md w-full" @click.outside="open = false">
            <h2 class="text-xl font-bold mb-4">模态框标题</h2>
            <p class="mb-4">焦点会被限制在这个模态框内，按 Tab 键会在内部循环。</p>

            <input type="text" placeholder="输入 1" class="w-full mb-2 p-2 border rounded">
            <input type="text" placeholder="输入 2" class="w-full mb-4 p-2 border rounded">

            <div class="flex justify-end gap-2">
                <button @click="open = false" class="px-4 py-2 border rounded">取消</button>
                <button @click="open = false" class="px-4 py-2 bg-blue-500 text-white rounded">确认</button>
            </div>
        </div>
    </div>
</div>
```

---

### 3. Persist（持久化）

**功能**：自动将组件数据持久化到 localStorage，页面刷新后数据不丢失。

**安装**：
```html
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/persist@3.x.x/dist/cdn.min.js"></script>
```

**示例代码**：

```html
<div x-data="{
    // 使用 $persist 持久化数据
    darkMode: $persist(false),
    todos: $persist([]),
    user: $persist({ name: '', email: '' }),

    addTodo(text) {
        this.todos.push({ id: Date.now(), text, done: false });
    },
    removeTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
    }
}" x-init="console.log('数据已持久化，刷新页面不会丢失')">

    <!-- 暗黑模式切换 -->
    <div :class="darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'" class="p-4 transition-colors">
        <label class="flex items-center gap-2">
            <input type="checkbox" x-model="darkMode">
            <span>暗黑模式 (刷新后保持)</span>
        </label>
    </div>

    <!-- 待办列表 -->
    <div class="mt-4">
        <h3 class="font-bold">待办事项 (已保存 <span x-text="todos.length"></span> 项)</h3>
        <form @submit.prevent="addTodo($refs.input.value); $refs.input.value = ''" class="flex gap-2 mt-2">
            <input x-ref="input" type="text" placeholder="新任务..." class="flex-1 p-2 border rounded">
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">添加</button>
        </form>
        <ul class="mt-2 space-y-1">
            <template x-for="todo in todos" :key="todo.id">
                <li class="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <input type="checkbox" x-model="todo.done">
                    <span :class="{ 'line-through text-gray-400': todo.done }" x-text="todo.text" class="flex-1"></span>
                    <button @click="removeTodo(todo.id)" class="text-red-500 hover:text-red-700">删除</button>
                </li>
            </template>
        </ul>
    </div>

    <!-- 用户信息 -->
    <div class="mt-4 p-4 bg-gray-50 rounded">
        <h3 class="font-bold">用户信息</h3>
        <div class="grid gap-2 mt-2">
            <input x-model="user.name" type="text" placeholder="姓名" class="p-2 border rounded">
            <input x-model="user.email" type="email" placeholder="邮箱" class="p-2 border rounded">
        </div>
        <p class="mt-2 text-sm text-gray-600">
            当前用户: <span x-text="user.name || '未填写'"></span> /
            <span x-text="user.email || '未填写'"></span>
        </p>
    </div>

    <p class="mt-4 text-sm text-gray-500">
        💡 提示：刷新页面，所有数据都会保持！
    </p>
</div>
```

**自定义存储键名**：

```html
<div x-data="{
    // 使用 as 指定存储键名
    preferences: $persist({ theme: 'light', lang: 'zh' }).as('user-prefs'),

    // 使用不同的 storage 类型（默认 localStorage）
    sessionData: $persist({}).using(sessionStorage)
}">
    <!-- 内容 -->
</div>
```

**适用范围**：
- 用户偏好设置（主题、语言等）
- 表单草稿自动保存
- 购物车数据持久化
- 用户登录状态

**注意事项**：
1. `$persist` 只能包装对象或数组，原始类型需要包装在对象中
2. 存储数据有大小限制（localStorage 通常 5-10MB）
3. 敏感数据不应使用 `$persist`，因为 localStorage 可以被轻易访问
4. 跨标签页数据不会自动同步，需要手动监听 `storage` 事件

---

## 五、高级 Advanced

### 1. 深入响应式系统

Alpine.js 使用 Proxy 实现响应式系统。了解其工作原理有助于写出更高效的代码。

**示例代码**：

```html
<div x-data="{
    // 响应式数据
    count: 0,
    user: { name: '张三', age: 25 },
    items: ['a', 'b', 'c'],

    // 计算属性（使用 getter）
    get doubleCount() {
        return this.count * 2;
    },
    get isAdult() {
        return this.user.age >= 18;
    },
    get itemCount() {
        return this.items.length;
    },

    // 响应式注意事项演示
    wrongUpdate() {
        // ❌ 错误：直接替换整个对象，不会触发响应式更新
        // this.user = { name: '李四' };

        // ❌ 错误：直接通过索引修改数组元素
        // this.items[0] = 'x';

        // ❌ 错误：直接修改数组长度
        // this.items.length = 2;
    },

    correctUpdate() {
        // ✅ 正确：修改对象属性
        this.user.name = '李四';

        // ✅ 正确：使用 Vue 风格的数组方法
        this.items.push('d');           // 添加
        this.items.pop();               // 移除最后一个
        this.items.shift();             // 移除第一个
        this.items.unshift('z');        // 添加到开头
        this.items.splice(1, 1);        // 删除指定位置
        this.items.sort();              // 排序
        this.items.reverse();           // 反转

        // ✅ 正确：替换整个数组（新数组）
        this.items = [...this.items, 'new'];

        // ✅ 正确：使用 $set 风格（Alpine 3.13+）
        // Alpine.set(this.items, 0, 'new value');
    }
}">
    <h3>响应式系统示例</h3>

    <div class="space-y-4">
        <!-- 计数器 -->
        <div>
            <p>计数: <span x-text="count"></span></p>
            <p>双倍: <span x-text="doubleCount"></span> (计算属性)</p>
            <button @click="count++" class="px-2 py-1 bg-blue-500 text-white rounded">+1</button>
        </div>

        <!-- 用户信息 -->
        <div>
            <p>姓名: <span x-text="user.name"></span>, 年龄: <span x-text="user.age"></span></p>
            <p>是否成年: <span x-text="isAdult ? '是' : '否'"></span> (计算属性)</p>
            <button @click="user.name = user.name === '张三' ? '李四' : '张三'" class="px-2 py-1 bg-green-500 text-white rounded">
                切换姓名
            </button>
        </div>

        <!-- 数组操作 -->
        <div>
            <p>项目数量: <span x-text="itemCount"></span> (计算属性)</p>
            <p>项目: <span x-text="JSON.stringify(items)"></span></p>
            <div class="flex gap-2">
                <button @click="items.push(String.fromCharCode(97 + items.length))" class="px-2 py-1 bg-purple-500 text-white rounded">添加</button>
                <button @click="items.pop()" class="px-2 py-1 bg-red-500 text-white rounded">移除</button>
                <button @click="items.reverse()" class="px-2 py-1 bg-yellow-500 text-white rounded">反转</button>
            </div>
        </div>
    </div>
</div>
```

---

### 2. 异步操作与加载状态

在实际应用中，经常需要处理异步操作和加载状态。

**示例代码**：

```html
<div x-data="{
    // 状态
    isLoading: false,
    error: null,
    data: null,

    // 搜索相关
    searchQuery: '',
    searchResults: [],
    isSearching: false,

    // 加载数据
    async loadData() {
        this.isLoading = true;
        this.error = null;

        try {
            // 模拟 API 调用
            await new Promise(resolve => setTimeout(resolve, 1500));

            // 模拟随机错误
            if (Math.random() > 0.7) {
                throw new Error('加载失败，请重试');
            }

            this.data = {
                title: '示例数据',
                items: ['项目 1', '项目 2', '项目 3']
            };
        } catch (err) {
            this.error = err.message;
        } finally {
            this.isLoading = false;
        }
    },

    // 搜索（防抖）
    async search() {
        if (this.searchQuery.length < 2) {
            this.searchResults = [];
            return;
        }

        this.isSearching = true;

        try {
            // 模拟搜索 API
            await new Promise(resolve => setTimeout(resolve, 500));

            this.searchResults = [
                { id: 1, title: `搜索结果: ${this.searchQuery} 1` },
                { id: 2, title: `搜索结果: ${this.searchQuery} 2` },
                { id: 3, title: `搜索结果: ${this.searchQuery} 3` }
            ];
        } finally {
            this.isSearching = false;
        }
    }
}" x-init="loadData()">
    <h2>异步操作示例</h2>

    <!-- 加载状态 -->
    <div x-show="isLoading" class="text-center py-8">
        <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <p class="mt-2 text-gray-600">加载中...</p>
    </div>

    <!-- 错误状态 -->
    <div x-show="error && !isLoading" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p x-text="error"></p>
        <button @click="loadData()" class="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            重试
        </button>
    </div>

    <!-- 数据展示 -->
    <div x-show="data && !isLoading && !error">
        <h3 x-text="data.title" class="text-xl font-bold mb-4"></h3>
        <ul class="space-y-2">
            <template x-for="item in data.items" :key="item">
                <li x-text="item" class="p-2 bg-gray-100 rounded"></li>
            </template>
        </ul>
        <button @click="loadData()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            重新加载
        </button>
    </div>

    <!-- 搜索示例 -->
    <div class="mt-8 pt-8 border-t">
        <h3 class="font-bold mb-4">搜索示例（防抖）</h3>
        <div class="relative">
            <input
                x-model="searchQuery"
                @input.debounce.300ms="search()"
                type="text"
                placeholder="输入搜索关键词..."
                class="w-full p-3 border rounded pr-10"
            >
            <span x-show="isSearching" class="absolute right-3 top-1/2 -translate-y-1/2">
                <span class="animate-spin inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></span>
            </span>
        </div>

        <!-- 搜索结果 -->
        <div x-show="searchResults.length > 0" class="mt-4 space-y-2">
            <template x-for="result in searchResults" :key="result.id">
                <div x-text="result.title" class="p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"></div>
            </template>
        </div>

        <p x-show="searchQuery.length >= 2 && searchResults.length === 0 && !isSearching" class="mt-4 text-gray-500">
            没有找到相关结果
        </p>
    </div>
</div>
```

---

### 3. 最佳实践与性能优化

**示例代码**：

```html
<div x-data="{
    // 1. 使用计算属性缓存复杂计算
    items: [],
    filter: '',

    get filteredItems() {
        console.log('计算过滤结果...');
        return this.items.filter(item =>
            item.name.toLowerCase().includes(this.filter.toLowerCase())
        );
    },

    get totalPrice() {
        return this.items.reduce((sum, item) => sum + item.price, 0);
    },

    // 2. 使用防抖优化频繁操作
    searchQuery: '',
    searchResults: [],
    performSearch: Alpine.debounce(async function() {
        if (this.searchQuery.length < 2) {
            this.searchResults = [];
            return;
        }
        // 执行搜索...
        this.searchResults = await fetchSearchResults(this.searchQuery);
    }, 300),

    // 3. 虚拟列表优化大量数据渲染
    allItems: Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        name: `项目 ${i}`,
        description: `这是项目 ${i} 的描述`
    })),
    itemHeight: 40,
    containerHeight: 400,
    scrollTop: 0,

    get visibleItems() {
        const startIndex = Math.floor(this.scrollTop / this.itemHeight);
        const visibleCount = Math.ceil(this.containerHeight / this.itemHeight);
        const endIndex = Math.min(startIndex + visibleCount + 1, this.allItems.length);

        return this.allItems.slice(startIndex, endIndex).map((item, index) => ({
            ...item,
            index: startIndex + index
        }));
    },

    get totalHeight() {
        return this.allItems.length * this.itemHeight;
    },

    get offsetY() {
        return Math.floor(this.scrollTop / this.itemHeight) * this.itemHeight;
    }
}">
    <h2>最佳实践示例</h2>

    <!-- 1. 计算属性示例 -->
    <div class="mb-8 p-4 border rounded">
        <h3 class="font-bold mb-2">1. 计算属性缓存</h3>
        <input x-model="filter" placeholder="过滤项目..." class="p-2 border rounded mb-2">
        <p class="text-sm text-gray-600 mb-2">总价: ¥<span x-text="totalPrice"></span></p>
        <ul>
            <template x-for="item in filteredItems" :key="item.id">
                <li x-text="item.name"></li>
            </template>
        </ul>
    </div>

    <!-- 2. 防抖搜索 -->
    <div class="mb-8 p-4 border rounded">
        <h3 class="font-bold mb-2">2. 防抖优化</h3>
        <input x-model="searchQuery"
               @input="performSearch()"
               placeholder="输入搜索关键词..."
               class="p-2 border rounded w-full">
        <p class="text-sm text-gray-600 mt-1">
            输入停止 300ms 后才执行搜索
        </p>
    </div>

    <!-- 3. 虚拟列表 -->
    <div class="mb-8 p-4 border rounded">
        <h3 class="font-bold mb-2">3. 虚拟列表 (10000 条数据)</h3>
        <p class="text-sm text-gray-600 mb-2">
            只渲染可见区域的数据，滚动位置: <span x-text="scrollTop"></span>
        </p>
        <div x-ref="container"
             @scroll="scrollTop = $refs.container.scrollTop"
             :style="`height: ${containerHeight}px; overflow-y: auto;`"
             class="border rounded">
            <div :style="`height: ${totalHeight}px; position: relative;`">
                <div :style="`transform: translateY(${offsetY}px);`">
                    <template x-for="item in visibleItems" :key="item.id">
                        <div :style="`height: ${itemHeight}px;`"
                             class="flex items-center px-4 border-b hover:bg-gray-50">
                            <span class="text-gray-400 w-16" x-text="item.id"></span>
                            <span x-text="item.name"></span>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>

    <!-- 其他最佳实践提示 -->
    <div class="p-4 bg-blue-50 rounded">
        <h3 class="font-bold mb-2">更多最佳实践</h3>
        <ul class="list-disc list-inside space-y-1 text-sm">
            <li>使用 <code>get</code> 定义计算属性，避免重复计算</li>
            <li>使用 <code>Alpine.debounce</code> 或 <code>.debounce</code> 修饰符优化频繁操作</li>
            <li>大量数据使用虚拟列表，只渲染可见区域</li>
            <li>使用 <code>x-show</code> 而非 <code>x-if</code> 进行频繁切换</li>
            <li>合理使用 <code>$watch</code> 执行副作用，避免不必要的重渲染</li>
            <li>复杂组件拆分为可复用的 <code>Alpine.data()</code></li>
            <li>使用 <code>$persist</code> 保存需要持久化的状态</li>
        </ul>
    </div>
</div>
```

---

## 总结

Alpine.js 是一个轻量但功能强大的框架，它通过声明式指令将行为直接绑定到 HTML，使前端开发变得简单直观。

### 核心优势

1. **轻量级**：体积小巧 (~15KB gzipped)，无依赖
2. **声明式**：直接在 HTML 中使用指令，无需构建步骤
3. **响应式**：自动追踪依赖，数据变化自动更新视图
4. **可扩展**：丰富的插件生态，易于自定义指令
5. **渐进式**：可以逐步引入到现有项目，无需重写

### 适用场景

- 需要轻量交互的静态网站
- 服务器渲染页面的增强
- 渐进式 Web 应用
- 原型开发和快速验证
- 与 Laravel、Django 等后端框架配合

### 学习路径

1. 掌握基础指令：`x-data`, `x-text`, `x-show`, `x-on`, `x-model`
2. 学习列表渲染和条件渲染：`x-for`, `x-if`
3. 理解组件通信：事件派发、全局 Store
4. 探索高级特性：自定义指令、插件系统
5. 实践性能优化：计算属性、虚拟列表、防抖节流

---

**参考资料**：
- [Alpine.js 官方文档](https://alpinejs.dev/)
- [Alpine.js GitHub](https://github.com/alpinejs/alpine)
- [Alpine.js 插件列表](https://alpinejs.dev/plugins)

---

*本文档持续更新中，如有错误或建议，欢迎反馈。*
