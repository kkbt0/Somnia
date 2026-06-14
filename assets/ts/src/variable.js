
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

export default SOMNIA_LIBS;
