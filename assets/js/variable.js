import * as params from '@params'; // Hugo 变量

// for cdn or local libs url
const SOMNIA_LIBS = {
    pagefind: {
        css: '/pagefind/pagefind-ui.css',
        js: '/pagefind/pagefind-ui.js'
    },
    katex: {
        css: { href: 'https://cdn.jsdelivr.net/npm/katex@0.16.38/dist/katex.min.css', integrity: 'sha384-/L6i+LN3dyoaK2jYG5ZLh5u13cjdsPDcFOSNJeFBFa/KgVXR5kOfTdiN3ft1uMAq' },
        js: { href: 'https://cdn.jsdelivr.net/npm/katex@0.16.38/dist/katex.min.js', integrity: 'sha384-H6s1ZrH2CKpFpqR680poRdStIRJGXty7fSkxAcIfxwl9iu6A4BOPtTk7vQ58Ovio' },
        autoRenderJs: { href: 'https://cdn.jsdelivr.net/npm/katex@0.16.38/dist/contrib/auto-render.min.js', integrity: 'sha384-bjyGPfbij8/NDKJhSGZNP/khQVgtHUE5exjm4Ydllo42FwIgYsdLO2lXGmRBf5Mz' }
    },
    mermaid: {
        js: 'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.esm.min.mjs'
    },
    qrcode: {
        js: '//cdn.jsdelivr.net/npm/qrcodejs/qrcode.min.js'
    }
}

// CDN 击穿 ?v=xxx
// INFO VERSION 由构建时间决定
// NOW 为当前时间 分钟级击穿 Z 时区
//const NOW = `${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')}`; // 2026-06-16-13-38
const NOW = `${new Date().toISOString().replace(/[-:T]/g, '').replace(/(.{4})(.{4})/, '$1-$2-').slice(0, 14)}Z`; // 2026-0616-1338
let INFO = { v: NOW };
try {
    INFO = localStorage.getItem('info') ? JSON.parse(localStorage.getItem('info')) : { v: NOW }; // 获取构建信息
} catch (e) { }
const VERSION = `v${INFO.v}`;

// Hugo 注入
const BASE_URL = params.BASE_URL || window.location.origin + "/";

export { SOMNIA_LIBS, NOW, VERSION, BASE_URL };
