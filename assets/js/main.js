class Somnia {
    // Toast
    showToast(message, time) {
        const toast = document.createElement('div')
        toast.className =
            'animate fixed bottom-8 z-20 px-4 py-2 bg-muted text-foreground rounded-lg border shadow-lg flex items-center gap-2'
        toast.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m-.01 6c.558 0 1.01.452 1.01 1.01v5.124A1 1 0 0 1 12.5 18h-.49A1.01 1.01 0 0 1 11 16.99V12a1 1 0 1 1 0-2zM12 7a1 1 0 1 1 0 2a1 1 0 0 1 0-2"></path></g></svg><span>${message}</span>`
        if (!document.body) {
            console.error("Body Not Ready")
            return;
        }
        document.body.appendChild(toast)
        setTimeout(() => {
            toast.remove()
        }, time || 3000)
    }
    // 十二时辰
    timestampToShichen(ts13) {
        // 十二时辰对应
        const tzArr = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
        const sdArr = ['夜半', '鸡鸣', '平旦', '日出', '食时', '隅中', '日中', '日昳', '晡时', '日入', '黄昏', '人定'];
        const sdArr2 = ['半夜', '凌晨', '黎明', '清晨', '早上', '上午', '中午', '午后', '下午', '傍晚', '晚上', '深夜'];

        function formatTime(timestamp) {

            const now = new Date();
            const inputTime = new Date(timestamp);

            const timeDiff = now - inputTime;

            const seconds = Math.floor(timeDiff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (seconds < 60) {
                return "刚刚";
            } else if (minutes < 60) {
                return `${minutes} 分钟前`;
            } else if (hours < 24) {
                return `${hours} 小时前`;
            } else if (days < 7) {
                return `${days} 天前 ${formatHour(inputTime)}`;
            }

            const yearNow = now.getFullYear();
            const yearInput = inputTime.getFullYear();

            if (yearNow === yearInput) {
                return `${inputTime.getMonth() + 1} 月 ${inputTime.getDate()} 日 ${formatHour(inputTime)}`;
            } else {
                return `${yearInput} 年 ${inputTime.getMonth() + 1} 月 ${inputTime.getDate()} 日 ${formatHour(inputTime)}`;
            }
        }

        function formatHour(date) {
            const hour = date.getHours();
            const minute = date.getMinutes();

            // 添加判断时辰的逻辑
            const tzIndex = Math.floor((hour + 1) / 2) % 12;
            const timeString = `${formatNumber(hour)}:${formatNumber(minute)}`;

            return `${timeString} • ${tzArr[tzIndex]}时 ${sdArr[tzIndex]}  (${sdArr2[tzIndex]})`;
        }

        function formatNumber(number) {
            return number < 10 ? `0${number}` : number;
        }
        return formatTime(ts13);
    }
    // 使用示例：
    // example loadResource(el,rel,href,type,integrity,crossOrigin,defer)
    loadResource({
        element = document.head,        // 要追加到的DOM元素，默认为document.head
        rel = 'stylesheet',            // 主要用于CSS的rel属性，默认'stylesheet'
        href,                          // 资源URL（必需）
        type,                           //  type module，可选
        integrity,                     // 完整性哈希，可选
        crossOrigin,                    // 跨域设置，可选
        defer = false                     // 是否延迟加载，默认false
    } = {}) {
        return new Promise((resolve, reject) => {
            if (!href) {
                reject(new Error('href is required'));
                return;
            }

            // 判断是否为CSS资源
            let resource;
            if (href.endsWith('.css')) {
                // 创建CSS link元素
                resource = document.createElement('link');
                resource.rel = rel || 'stylesheet';
                resource.href = href;
            } else {
                // 创建JS script元素
                resource = document.createElement('script');
                resource.src = href;
            }

            // 设置可选属性
            if (integrity) resource.integrity = integrity;
            if (crossOrigin) resource.crossOrigin = crossOrigin;
            if (defer) resource.defer = true;
            if (type) resource.type = type;

            // 事件处理
            resource.onload = () => resolve(resource);
            resource.onerror = () => reject(new Error(`Failed to load resource: ${href}`));

            // 追加到DOM
            element.appendChild(resource);
        });
    }
    swupPageInitMediumZoom() {
        const images = Array.from(document.querySelectorAll('#content img')).filter(img => !img.classList.contains('medium-zoom-image'));
        images.forEach(img => {
            mediumZoom(img, { background: 'rgba(0, 0, 0, 0.8)' });
        });
    }

    async loadKaTeXResource(element) {
        // 插入 KaTeX CSS
        this.loadResource({ element: element, rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/katex@0.16.38/dist/katex.min.css', integrity: 'sha384-/L6i+LN3dyoaK2jYG5ZLh5u13cjdsPDcFOSNJeFBFa/KgVXR5kOfTdiN3ft1uMAq', crossOrigin: 'anonymous' });

        // 插入 KaTeX 主库 JS
        await this.loadResource({ element: element, href: 'https://cdn.jsdelivr.net/npm/katex@0.16.38/dist/katex.min.js', integrity: 'sha384-H6s1ZrH2CKpFpqR680poRdStIRJGXty7fSkxAcIfxwl9iu6A4BOPtTk7vQ58Ovio', crossOrigin: 'anonymous', defer: true });

        // 插入 KaTeX 自动渲染扩展
        await this.loadResource({ element: element, href: 'https://cdn.jsdelivr.net/npm/katex@0.16.38/dist/contrib/auto-render.min.js', integrity: 'sha384-bjyGPfbij8/NDKJhSGZNP/khQVgtHUE5exjm4Ydllo42FwIgYsdLO2lXGmRBf5Mz', crossOrigin: 'anonymous', defer: true });

        renderMathInElement(element, {
            // customised options
            // • auto-render specific keys, e.g.:
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false },
                { left: '\\(', right: '\\)', display: false },
                { left: '\\[', right: '\\]', display: true }
            ],
            // • rendering keys, e.g.:
            throwOnError: false
        });
    }
}

const somnia = new Somnia();


