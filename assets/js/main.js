import Alpine from './libs/alpinejs.esm.js';
import AsyncAlpine from './libs/async-alpine.esm.js';
import { Swup, SwupScrollPlugin } from './libs/swup.esm.js';
import mediumZoom from './libs/medium-zoom.esm.js';

import { SOMNIA_LIBS, NOW, VERSION } from './variable.js'
import Somnia from './Somnia.js';
import { component, somniaData } from './components.js';
import * as params from '@params'; // Hugo 变量

window.Alpine = Alpine;
window.mediumZoom = mediumZoom;

window.SOMNIA_LIBS = SOMNIA_LIBS;
window.NOW = NOW;
window.VERSION = VERSION;
window.BASE_URL = params.BASE_URL;

window.Somnia = Somnia; // 主程序
window.component = component; // 组件
window.somniaData = somniaData; // 处理动态加载 js 库等

window.page = {}; // 全局可用页面数据 切换页面后清空

Alpine.plugin(AsyncAlpine);
Alpine.plugin(Somnia.SomniaPlugin);
Alpine.store('somnia', {
    theme: localStorage.getItem('theme') || 'system',
    isDark: document.documentElement.classList.contains('dark'),
    init() {
        // 存储构建信息
        fetch(BASE_URL + 'info?v=' + NOW).then(res => res.text()).then(info => localStorage.setItem('info', info));
        // console.log("[Somnia] [Init]",this.theme, this.isDark);
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
