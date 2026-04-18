// Alpinejs components script
// 全局状态
document.addEventListener('alpine:init', () => {
    Alpine.store('somnia', {
        theme: localStorage.getItem('theme') || 'system',
        isDark: document.documentElement.classList.contains('dark'),
        init() {
            // console.log("[Somnia] [Init]",this.theme, this.isDark);
        },
        // 统一调用接口，方便未来改为全局事件总线 由 Somnia 负责
    });

})

// for Somnia/layouts/_default/single.html
function mainComponent() {
    return {
        sidebarShow: false,
        init() {

        },
        toggleSidebar() {
            this.sidebarShow = !this.sidebarShow;
        }
    }
}

// for Somnia/layouts/_default/baseof.html
function contentComponent() {
    return {
        init() {
            const data = this.$el.getAttribute("somnia-data");
            if (data.trim() !== "") {
                console.log("[Somnia] [Data]", data.trim());
            }
            if (data.includes("math")) {
                somnia.libs.katex.run(this.$el);
            }
            // 由 render-codeblock-mermaid.html 运行
            // if (data.includes("mermaid")) {
            //     somnia.libs.mermaid.run();
            // }
        }
    }
}

// for Somnia/layouts/partials/header.html
// 由于 header 组件不会被 Suwpjs 重新渲染，所以内联也可以
function headerComponent() {
    return {
        preScrollY: window.scrollY,
        // 初始位置监测
        notTop: window.scrollY > 20,
        headerShow: true,
        mobileMenuOpen: false,
        // theme: localStorage.getItem('theme') || 'system', // 使用 store
        init() {
            // theme 初始化
            // this.theme = localStorage.getItem('theme') || 'system';
        },
        onScroll() {
            // [TODO] 性能优化
            // 是否顶部判断
            this.notTop = window.scrollY > 20;
            // 在页面顶部350px范围内 或 向上滚动时 隐藏 toString 不可省略
            this.headerShow = (window.scrollY < 350 || window.scrollY < this.preScrollY).toString();
            this.preScrollY = window.scrollY;
        },
        toggleTheme() {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            // 循环切换
            const themes = ['system', 'dark', 'light'];
            const currentIndex = themes.indexOf(Alpine.store('somnia').theme);
            const newTheme = themes[(currentIndex + 1) % themes.length];
            // 保存
            localStorage.setItem('theme', newTheme);
            // 设置 HTML
            if (newTheme === 'dark' || (newTheme === 'system' && systemTheme === 'dark')) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            document.documentElement.setAttribute('data-theme', newTheme);

            // this.theme = newTheme;
            // 改为 Alinejs 写法 :data-theme="theme" 让 theme 变量有点参与感
            // toggleDarkModeElement.dataset.theme = newTheme;
            Alpine.store('somnia').theme = newTheme;
            Alpine.store('somnia').isDark = document.documentElement.classList.contains('dark');
            somnia.showToast(`Set theme to ${newTheme}`);
        }
    };
}


// for Somnia/layouts/partials/back-to-top.html
const CONTENT_ID = 'content';
const HEADER_ID = 'content-header';
function backToTopComponent() {
    return {
        needPercent: true, // 是否需要百分比功能
        actionBtnsShow: false, // actionBtns 是否可见
        scrollPercent: 0, // 当前滚动百分比 onScroll 绑定自动触发初始化

        scrollHeight: 0, // 文章总高度
        articleTop: 0, // 文章顶部偏移量
        clientHeight: 0, // 视口高度

        ticking: false, // 节流标志
        observer: undefined, // for destroy
        articleEl: undefined, // for destroy
        contentHeaderEl: undefined, // for destroy
        _onResize: undefined, // for destroy
        _articleResizeObserver: undefined, // 文章内容变化监测

        init() {
            // 容错处理，缺少元素则不启用百分比功能，直接显示按钮
            this.articleEl = document.getElementById(CONTENT_ID);
            if (!this.articleEl) {
                console.error(`Element #${CONTENT_ID} not found.`);
                this.needPercent = false;
            }
            // content-header 监测，控制按钮显示隐藏
            this.contentHeaderEl = document.getElementById(HEADER_ID);
            if (this.contentHeaderEl) {
                this.observer = new IntersectionObserver(([entry]) => {
                    this.actionBtnsShow = !entry.isIntersecting;
                });
                this.observer.observe(this.contentHeaderEl);
            } else {
                console.error(`Element #${HEADER_ID} not found.`);
                this.actionBtnsShow = true;
            }
            // 只有在需要百分比功能时才计算高度和监听 resize，避免不必要的性能开销
            if (this.needPercent) {
                this.scrollHeight = this.articleEl.scrollHeight;
                this.articleTop = this.articleEl.offsetTop;
                this.clientHeight = document.documentElement.clientHeight;

                this._onResize = () => {                                    // 响应窗口大小变化
                    this.scrollHeight = this.articleEl.scrollHeight;
                    this.clientHeight = document.documentElement.clientHeight;
                    this.updateScrollPercent(); // 立即更新百分比，避免尺寸变化后显示错误的百分比
                };
                window.addEventListener('resize', this._onResize);
                // 监测文章内容变化，动态调整 scrollHeight
                this._articleResizeObserver = new ResizeObserver(() => {
                    this.scrollHeight = this.articleEl.scrollHeight;
                    this.updateScrollPercent(); // 立即更新百分比，避免内容变化后显示错误的百分比
                });
                this._articleResizeObserver.observe(this.articleEl);
            } else {
                this.actionBtnsShow = true;
            }
        },

        calculateScrollPercent() {
            const scrollTop = Math.max(0, window.scrollY ?? document.documentElement.scrollTop);
            if (scrollTop < this.articleTop) return 0;
            const maxScrollable = this.scrollHeight - this.clientHeight;
            if (maxScrollable <= 0) return 100;
            const progress = Math.min(scrollTop - this.articleTop, maxScrollable);
            return Math.round((progress / maxScrollable) * 100);
        },

        updateScrollPercent() {
            this.scrollPercent = this.calculateScrollPercent();
            this.ticking = false;
        },

        onScroll() {
            if (!this.needPercent || this.ticking) return;  // 移除冗余标志
            requestAnimationFrame(() => this.updateScrollPercent());
            this.ticking = true;
        },

        scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.contentHeaderEl?.setAttribute('tabindex', '-1'); // 键盘无障碍优化，允许 focus
            this.contentHeaderEl?.focus({ preventScroll: true }); // 键盘无障碍优化 
        },

        destroy() {
            this.observer?.unobserve(this.contentHeaderEl);  // 清理 content-header 监测
            this.observer?.disconnect();
            window.removeEventListener('resize', this._onResize); // 清理 resize 监听
            this._articleResizeObserver?.disconnect(); // 清理文章内容监测
        },
    };
}

// for Somnia/layouts/partials/quote.html
function quoteComponent() {
    return {
        quote: '我们的征途是星辰大海！',
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

// for Somnia/layouts/partials/page/hero.html
function heroComponent() {
    return {
        viewportHeight: window.innerHeight,
        threshold1: 0,
        threshold2: 0,
        threshold3: 0,
        imageOpacity: 0.45,
        init() {
            this.threshold1 = this.viewportHeight / 9;
            this.threshold2 = (this.viewportHeight * 2) / 9;
            this.threshold3 = (this.viewportHeight * 3) / 9;
        },
        onScroll() {
            const scrollDistance = window.scrollY;
            if (scrollDistance >= this.threshold3) {
                this.imageOpacity = '0.15';
            } else if (scrollDistance >= this.threshold2) {
                this.imageOpacity = '0.3';
            } else if (scrollDistance >= this.threshold1) {
                this.imageOpacity = '0.45';
            }
        }
    }
}

// 此脚本用于实现滚动时高亮当前阅读的文章章节，并显示阅读进度
// 如果不需要此功能，可以删除此脚本标签
// 注意 Swupjs 需要 SwupScrollPlugin 支持滚动动画
// for Somnia/layouts/partials/toc/toc.html
function tocComponent() {
    return {
        headings: [],
        tocLinks: [],
        headingProgress: {},
        _scrollHandler: null,
        _rafId: null,
        _dirty: false,

        init() {
            this.headings = Array.from(
                document.querySelectorAll(
                    'article h1, article h2, article h3, article h4, article h5, article h6'
                )
            )

            this.tocLinks = Array.from(this.$el.querySelectorAll('a[href^="#"]')).map((link) => ({
                element: link,
                progressBar: link.previousElementSibling,
                slug: decodeURIComponent((link.getAttribute('href') ?? '').substring(1))
            }))

            this.tocLinks.forEach((link) => {
                link.element.addEventListener('click', (e) => {
                    e.preventDefault()
                    const heading = this.headings.find(
                        (h) => decodeURIComponent(h.id) === link.slug
                    )
                    if (heading) {
                        history.pushState(null, '', link.element.getAttribute('href'))
                        heading.scrollIntoView({ behavior: 'smooth' })
                    }
                })
            })

            // 用 rAF 节流，避免 setInterval + scroll 双重触发
            this._scrollHandler = () => {
                if (this._dirty) return
                this._dirty = true
                this._rafId = requestAnimationFrame(() => {
                    this._updateProgress()
                    this._updateStyles()
                    this._dirty = false
                })
            }

            window.addEventListener('scroll', this._scrollHandler, { passive: true })
            this._scrollHandler() // 初始化执行一次
        },

        destroy() {
            if (this._scrollHandler)
                window.removeEventListener('scroll', this._scrollHandler)
            if (this._rafId)
                cancelAnimationFrame(this._rafId)
        },

        // 只负责计算每个 heading 的阅读进度
        _updateProgress() {
            const vh = window.innerHeight

            this.headings.forEach((el, index) => {
                const rect = el.getBoundingClientRect()
                const nextRect = this.headings[index + 1]?.getBoundingClientRect()

                // 当前标题顶部到下一标题顶部（或视口底部兜底）为该节的阅读区间
                const sectionTop = rect.top
                const sectionBottom = nextRect ? nextRect.top : rect.bottom + 127

                // progress：视口底部扫过该区间的比例
                const progress = (vh - sectionTop) / (sectionBottom - sectionTop)

                this.headingProgress[decodeURIComponent(el.id)] = {
                    inView: sectionTop < vh && sectionBottom > 0,
                    progress: Math.max(0, Math.min(1, progress))
                }
            })
        },

        // 只负责把进度映射到 DOM 样式
        _updateStyles() {
            this.tocLinks.forEach(({ element: el, progressBar: bar, slug }, i) => {
                const state = this.headingProgress[slug]
                if (!state) return

                const { inView, progress } = state
                const prevInView = !!this.headingProgress[this.tocLinks[i - 1]?.slug]?.inView
                const nextInView = !!this.headingProgress[this.tocLinks[i + 1]?.slug]?.inView

                el.classList.toggle('highlight', inView)
                el.classList.toggle('highlight-bg-translucent', inView)
                el.classList.toggle('rounded-t-2xl', inView && !prevInView)
                el.classList.toggle('rounded-b-2xl', inView && !nextInView)

                bar.classList.toggle('is-read', !inView && progress === 1)
                bar.classList.toggle('highlight-bg', inView)
                bar.style.setProperty('height', `${progress * 90}%`)
            })
        }
    }
}

// for Somnia/layouts/partials/page/blog-preview.html
function blogPreviewComponent() {
    return {
        heroColor: '#9698C1',
        init() {
            // 随机生成点颜色 或者使用主题色系 或者颜色列表随机
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            const toHex = (num) => num.toString(16).padStart(2, '0');
            this.heroColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        },
    }
}

// for Somnia/layouts/partials/page/copyright.html
function copyrightComponent() {
    return {
        qrcodeShow: false,
        qrcodeImgSrc: "",
        qrcodeInit: false,
        qrcodeScriptLoaded: window.QRCode !== undefined, // 检测全局 QRCode 对象，避免重复加载
        qrcodeScriptLoading: false,
        init() {
            // console.log("QRCode library 加载状态:", this.qrcodeScriptLoaded);
        },
        copyLinkClick() {
            navigator.clipboard.writeText(window.location.href);
            somnia.showToast('Link copied!');
        },
        newQRCode() {
            // 加载后生成
            // console.log("New QRCode " + window.location.origin + window.location.pathname);
            new QRCode(this.$refs.qrcode, {
                text: window.location.origin + window.location.pathname,
                width: 256,
                height: 256,
            });
            this.qrcodeInit = true;
            this.qrcodeShow = true;
        },
        newQRCodeScript() {
            somnia.scanLine({ act: "show" });
            this.qrcodeScriptLoading = true;
            // 创建 script 标签
            const script = document.createElement('script');
            script.src = '//cdn.jsdelivr.net/npm/qrcodejs/qrcode.min.js';
            script.onload = () => {
                somnia.scanLine({ act: "hide", time: 0 });
                this.newQRCode();
                this.qrcodeScriptLoaded = true;
                this.qrcodeScriptLoading = false;
            };
            script.onerror = () => {
                somnia.scanLine({ act: "hide", time: 0 });
                somnia.showToast("qrcode.min.js Script load failed");
                this.qrcodeScriptLoading = false;
            };
            document.head.appendChild(script);
        },
        getQRCodeClick() {
            // 调用 API
            // this.qrcodeImgSrc = "https://api.qrtool.cn/?text=" + window.location.origin + window.location.pathname;
            // 或者加载 js 生成
            // console.log("脚本加载:", this.qrcodeScriptLoaded, "生成状态:", this.qrcodeInit, "加载中:", this.qrcodeScriptLoading, "显示:", this.qrcodeShow);
            if (this.qrcodeScriptLoading) { }
            else if (!this.qrcodeScriptLoaded && !this.qrcodeInit) {
                this.newQRCodeScript();
            }
            else if (this.qrcodeScriptLoaded && !this.qrcodeInit) {
                this.newQRCode();
            }
            else this.qrcodeShow = !this.qrcodeShow;
        }
    }
}

// for Somnia/layouts/partials/docs/docs-contents.html
function docsTocComponent() {
    return {
        currentPath: window.location.pathname,
        init() { },
    }
}

// for Somnia/layouts/partials/page/pf-search.html
function pfSearchComponent() {
    return {
        init() {
            this.pfSearchInit();
        },
        async pfSearchInit() {
            // const el = document.getElementById('content-wrapper'); // 加载到哪里 Swup.js 切换页面都不会彻底拆卸
            // somnia.loadResource({ rel: 'stylesheet', href: '/pagefind/pagefind-ui.css',  dataSomnia: 'pagefind.css' });
            // await somnia.loadResource({ type: 'module', href: '/pagefind/pagefind-ui.js',  dataSomnia: 'pagefind.js' });
            // new PagefindUI({
            //     element: "#site-search",
            //     showSubResults: true,
            //     showImages: false
            // });
            somnia.libs.pagefind.run();
        }
    }
}


// for Somnia/layouts/shortcodes/page/site-info.html
function infoComponent() {
    return {
        infoClick(text) {
            navigator.clipboard.writeText(text);
            somnia.showToast(`Copied "${text}" to clipboard!`);
        },
        init() { },
    }
}

// for Somnia/layouts/shortcodes/page/collapse.html
function collapseComponent() {
    return {
        contentExpanded: false,
        init() { },
        headerClick() {
            this.contentExpanded = !this.contentExpanded;
        }
    }
}

// for Somnia/layouts/shortcodes/formatted-date.html
function timeComponent() {
    return {
        init() { },
        shichen(ts13) {
            return somnia.timestampToShichen(ts13);
        }
    }
}

//   interface GithubProps {
//   stargazers_count: number  // 星标数
//   forks_count: number            // Fork 数
//   language: string         // 主要编程语言
//   owner: { avatar_url: string }  // 所有者头像 URL
//   license?: { spdx_id: string }  // 许可证标识（可选）
//   description: string      // 仓库描述
// }
// for Somnia/layouts/shortcodes/github-card.html
function githubCardComponent() {
    return {
        loading: true,
        repo: '',
        // fetch 变量
        stargazers_count: null,
        forks_count: null,
        language: null,
        owner: { avatar_url: null },
        license: { spdx_id: null },
        description: null,
        initGithubCardComponent(repo) {
            this.repo = repo;
            this.fetchGithub(repo);
        },
        fetchGithub() {
            try {
                fetch(`https://api.github.com/repos/${this.repo}`)
                    .then(res => res.json())
                    .then(json => {
                        this.stargazers_count = json.stargazers_count;
                        this.forks_count = json.forks_count;
                        this.language = json.language;
                        this.owner = json.owner;
                        this.license = json.license;
                        this.description = json.description;

                        this.loading = false;
                        // console.log(json);
                    });
            } catch (error) {
                console.error(error);
            }
        }
    }
}

// for Somnia/layouts/partials/comment/mastodon.html 不用可删
function mastodonCommentComponent() {
    return {
        info: "",
        url: "",
        status: {
            content: "",
            account: {
                display_name: "",
                url: "",
            },
            replies_count: 0,
            reblogs_count: 0,
            favourites_count: 0,
        },
        replies: [],
        async initMastodonCommentComponent(url, id) {
            this.url = url;
            const api = `https://${url.split("/")[2]}/api/v1/statuses/${url.split("/")[4]}`;
            this.fetchStatus(api);
        },
        async fetchStatus(url) {
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    this.status = data;
                    if (this.status.replies_count > 0) {
                        this.fetchReplies(url + "/context");
                    }
                })
                .catch((error) => this.info = error);
        },
        async fetchReplies(url) {
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    this.replies = data.descendants;
                })
                .catch((error) => this.info = error);
        },
        sanitizeHTML(html) {
            // 移除不安全的标签
            html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            html = html.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

            // 移除不安全的属性
            html = html.replace(/javascript:/gi, '');

            return html;
        }
    }
}