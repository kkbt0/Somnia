import Alpine from './libs/alpinejs.esm.js';
import AsyncAlpine from './libs/async-alpine.esm.js';
import { Swup, SwupScrollPlugin } from './libs/swup.esm.js';
import mediumZoom from './libs/medium-zoom.esm.js';

import { SOMNIA_LIBS, NOW, VERSION, BASE_URL } from './variable.js'
import Somnia from './Somnia.js';
import { component, somniaData } from './components.js';

// 全局挂载
Object.assign(window, {
  Alpine,
  Swup,
  mediumZoom,
  SOMNIA_LIBS,
  NOW,
  VERSION,
  BASE_URL,
  Somnia, // 主程序
  component, // 组件
  somniaData // 处理动态加载 js 库等
});

window.page = {}; // 全局可用页面数据 切换页面后清空

Alpine.plugin(AsyncAlpine);
Alpine.plugin(Somnia.plugin.JSLoad);
Alpine.store('somnia', { // 全局状态
    theme: localStorage.getItem('theme') || 'system',
    isDark: document.documentElement.classList.contains('dark'),
    init() {
        // 存储构建信息
        fetch(BASE_URL + 'info?v=' + NOW).then(res => res.text()).then(info => localStorage.setItem('info', info));
        // console.log("[Somnia] [Init]",this.theme, this.isDark);
        // 统一调用接口，方便未来改为全局事件总线 由 Somnia 负责
    },
});

Somnia.start = function () {
    Somnia.PageInitCustom?.();
    Somnia.swupPageInitMediumZoom?.();
    Somnia.swupPageInitCustom?.();
    const swup = new Swup({
        containers: ['#content-wrapper'],
        // native: true,
        plugins: [
            // component.toc 依赖 scroll-plugin
            new SwupScrollPlugin(),
        ]
    });
    swup.hooks.on('page:load', () => {
      window.page = {}; // 清空页面数据
    });
    swup.hooks.on('page:view', () => {
        Somnia.swupPageInitMediumZoom?.();
        Somnia.swupPageInitCustom?.();
    });
    Alpine.start();
}
