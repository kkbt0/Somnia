// Alpinejs components script

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
            if (data.includes("math")) {
                console.log("somnia-data: ", data);
                somnia.loadKaTeXResource(this.$el);
            }
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
        theme: localStorage.getItem('theme') || 'system',
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
            const currentIndex = themes.indexOf(this.theme);
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

            this.theme = newTheme;
            // 改为 Alinejs 写法 :data-theme="theme" 让 theme 变量有点参与感
            // toggleDarkModeElement.dataset.theme = newTheme;
            somnia.showToast(`Set theme to ${newTheme}`);
        }
    };
}


// for Somnia/layouts/partials/back-to-top.html
function backToTopComponent() {
    return {
        needPercent: true,      // 是否需要百分比功能
        actionBtnsShow: false,  // actionBtns 是否可见
        scrollPercent: 0,        // 当前滚动百分比 onScroll 绑定自动触发初始化

        scrollHeight: 0,         // 文章总高度
        articleTop: 0,           // 文章顶部偏移量
        clientHeight: 0,         // 视口高度

        ticking: false,           // 节流标志
        observer: undefined, // for destroy
        articleEl: undefined,// for destroy
        contentHeaderEl: undefined,// for destroy
        handleScrollReady: false,// for onScroll

        init() {
            // 错误处理：如果文章元素不存在，禁用百分比功能
            const contentName = "content";
            this.articleEl = document.getElementById(contentName);
            if (!this.articleEl) {
                console.error(`Element with ID ${contentName} not found.`)
                this.needPercent = false;
            }
            // 根据页眉元素的可见性，控制按钮组显示/隐藏
            // id content-header
            const contentHeaderName = "content-header";
            this.contentHeaderEl = document.getElementById(contentHeaderName);
            if (this.contentHeaderEl) {
                this.observer = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        this.actionBtnsShow = !entry.isIntersecting;
                    })
                })
                this.observer.observe(this.contentHeaderEl)
            } else {
                console.error(`Element with ID ${contentHeaderName} not found.`)
            }
            // 滚动百分比更新
            if (this.needPercent) {
                // 初始化必要的尺寸信息
                this.scrollHeight = this.articleEl.scrollHeight; // 文章总高度（包含滚动部分）
                this.articleTop = this.articleEl.offsetTop; // 文章顶部距离文档顶部的距离
                this.clientHeight = document.documentElement.clientHeight; // 视口高度
                // document.addEventListener("scroll", this.handleScroll)
                this.handleScrollReady = true;
            } else {
                this.actionBtnsShow = true;
            }
        },
        // 计算滚动百分比
        calculateScrollPercent() {
            const scrollTop = Math.max(0, window.scrollY || document.documentElement.scrollTop);
            // 滚动位置在文章开始之前
            if (scrollTop < this.articleTop) return 0;
            // 计算最大可滚动距离
            const maxScrollable = this.scrollHeight - this.clientHeight;
            // 文章高度小于视口高度
            if (maxScrollable <= 0) return 100;
            // 计算实际滚动距离
            const progress = Math.min(scrollTop - this.articleTop, maxScrollable);
            // 计算百分比
            return Math.round((progress / maxScrollable) * 100);
        },

        //更新滚动百分比显示
        updateScrollPercent() {
            this.scrollPercent = this.calculateScrollPercent();
            this.ticking = false;
        },

        // 滚动事件处理
        onScroll() {
            if (this.handleScrollReady) {
                if (!this.ticking) {
                    requestAnimationFrame(() => { this.updateScrollPercent() })
                    this.ticking = true;
                }
            }
        },
        // 滚动到顶部
        scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        },

        // 清理资源
        destroy() {
            if (this.observer && this.contentHeaderEl) {
                this.observer.unobserve(this.contentHeaderEl);
                this.observer.disconnect();
            }
            // 使用 Alpinejs @scroll.window="onScroll()" 写法
            // if (this.needPercent) {
            //   document.removeEventListener('scroll', this.handleScroll);
            // }
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
        intervalId: null,

        init() {
            this.headings = Array.from(
                document.querySelectorAll(
                    'article h1, article h2, article h3, article h4, article h5, article h6'
                )
            )
            this.tocLinks = Array.from(this.$el.querySelectorAll('a[href^="#"]')).map((link) => ({
                element: link,
                progressBar: link.previousElementSibling,
                slug: decodeURIComponent((link.getAttribute('href') || '').substring(1))
            }))

            this.tocLinks.forEach((link) => {
                link.element.addEventListener('click', (e) => {
                    e.preventDefault()
                    const heading = this.headings.find(
                        (h) => decodeURIComponent(h.id) === link.slug
                    )
                    if (heading) {
                        history.pushState(null, heading.textContent || '', link.element.getAttribute('href'))
                        heading.scrollIntoView({ behavior: 'smooth' })

                    }
                })
            })

            this.updatePositionAndStyle()
            this.intervalId = setInterval(() => this.updatePositionAndStyle(), 100)
            window.addEventListener('scroll', () => this.updatePositionAndStyle())
        },

        destroy() {
            if (this.intervalId) clearInterval(this.intervalId)
        },

        updatePositionAndStyle() {
            const windowHeight = window.innerHeight
            const content = document.querySelector('#content')
            const pageOffset = window.scrollY - (content?.offsetTop || 0)
            const postOffset = (content?.offsetHeight || 0) + 127

            this.headings.forEach((el, index) => {
                const nextHeadingTop = this.headings[index + 1]?.offsetTop || postOffset
                const range = [el.offsetTop - pageOffset, nextHeadingTop - pageOffset - el.offsetHeight]
                const progress = (windowHeight - range[0]) / (range[1] - range[0])
                this.headingProgress[decodeURIComponent(el.id)] = {
                    inView: range[0] < windowHeight && range[1] > 0,
                    progress: Math.max(0, Math.min(1, progress))
                }
            })

            this.tocLinks.forEach(({ element: el, progressBar: bar, slug }, i) => {
                const state = this.headingProgress[slug]
                if (!state) return
                const { inView, progress } = state

                el.classList.toggle('highlight', inView)
                el.classList.toggle('highlight-bg-translucent', inView)
                el.classList.toggle(
                    'rounded-t-2xl',
                    inView && (i === 0 || !this.headingProgress[this.tocLinks[i - 1]?.slug]?.inView)
                )
                el.classList.toggle(
                    'rounded-b-2xl',
                    inView &&
                    (i === this.tocLinks.length - 1 ||
                        !this.headingProgress[this.tocLinks[i + 1]?.slug]?.inView)
                )
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
        init() { },
        copyLinkClick() {
            navigator.clipboard.writeText(window.location.href);
            somnia.showToast('Link copied!');
        },
        newQRCode() {
            // 创建 script 标签
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/qrcodejs/qrcode.min.js';
            script.onload = () => {
                // 加载后生成
                // console.log("New QRCode " + window.location.origin + window.location.pathname);
                new QRCode(document.getElementById("qrcode-container"), {
                    text: window.location.origin + window.location.pathname,
                    width: 256,
                    height: 256,
                });
            };
            script.onerror = () => somnia.showToast("qrcode.min.js Script load failed");
            document.head.appendChild(script);
        },
        getQRCodeClick() {
            this.qrcodeShow = !this.qrcodeShow;
            // 调用 API
            // this.qrcodeImgSrc = "https://api.qrtool.cn/?text=" + window.location.origin + window.location.pathname;
            // 或者加载 js 生成
            if (!this.qrcodeInit) {
                this.newQRCode();
                this.qrcodeInit = true;
            }
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
            this.loadPFResource();
        },
        async loadPFResource() {
            const el = document.getElementById('content-wrapper');
            somnia.loadResource({ element: el, rel: 'stylesheet', href: '/pagefind/pagefind-ui.css', });
            await somnia.loadResource({ element: el, type: 'module', href: '/pagefind/pagefind-ui.js', });
            new PagefindUI({
                element: "#site-search",
                showSubResults: true,
                showImages: false
            });
        }
    }
}

// for Somnia/layouts/shortcodes/qrcode.html
// copyrightComponent 复制过来的
function qrCodeComponent() {
    return {
        qrcodeInit: false,
        qrcodeImgSrc: "",
        init() {
            // 调用 API
            // this.qrcodeImgSrc = "https://api.qrtool.cn/?text=" + window.location.origin + window.location.pathname;
            // 或者加载 js 生成
            if (!this.qrcodeInit) {
                this.newQRCode();
                this.qrcodeInit = true;
            }
        },
        newQRCode() {
            // 创建 script 标签
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/qrcodejs/qrcode.min.js';
            script.onload = () => {
                // 加载后生成
                // console.log("New QRCode " + window.location.origin + window.location.pathname);
                new QRCode(document.getElementById("qrcode-container-component"), {
                    text: window.location.origin + window.location.pathname,
                    width: 256,
                    height: 256,
                });
            };
            script.onerror = () => somnia.showToast("qrcode.min.js Script load failed");
            document.head.appendChild(script);
        },
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