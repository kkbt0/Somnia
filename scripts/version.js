// https://github.com/alpinejs/alpine/releases

async function getFinalUrl(url) {
    try {
        const response = await fetch(url, {
            method: 'HEAD',
            redirect: 'manual',
        });

        // 注意：由于 CORS 限制，你可能无法直接读取响应头
        console.log('URL:', response.url);
        return response.url;
    } catch (error) {
        console.error('获取URL时出错:', error);
    }
}

// 使用示例
// getFinalUrl('https://unpkg.com/swup@4');
// getFinalUrl('https://unpkg.com/@swup/preload-plugin@3');
// getFinalUrl('https://unpkg.com/@swup/scroll-plugin@4');
// getFinalUrl('https://unpkg.com/unpkg.com/alpinejs');


import { readFileSync, writeFileSync } from 'fs';

function SomniaPath(path) {
    if (path.startsWith('Somnia')) {
        return path.replace('Somnia', '.');
    }
    return path;
}


function unpkgURL(url) {
    if (url.startsWith('http')) {
        return url;
    }
    return `https://unpkg.com${url}`;
}

async function download(url, path) {
    console.log("下载", unpkgURL(url), "到", SomniaPath(path));
    const response = await fetch(unpkgURL(url));
    const text = await response.text();
    const info = `// ${unpkgURL(url)}\n\n`;
    writeFileSync(SomniaPath(path), info + text);
    return url;
}



async function updateVersion() {
    try {
        const ver = JSON.parse(readFileSync('./scripts/version.json', 'utf8'));
        ver.dependencies['swup']['remote'] = await getFinalUrl(ver.dependencies['swup']['url']);
        ver.dependencies['swup/preload-plugin']['remote'] = await getFinalUrl(ver.dependencies['swup/preload-plugin']['url']);
        ver.dependencies['swup/scroll-plugin']['remote'] = await getFinalUrl(ver.dependencies['swup/scroll-plugin']['url']);
        ver.dependencies['alpinejs']['remote'] = await getFinalUrl(ver.dependencies['alpinejs']['url']);

        if (ver.dependencies['swup']['local'] != ver.dependencies['swup']['remote']) {
            const local = await download(ver.dependencies['swup']['remote'], ver.dependencies['swup']['path']);
            ver.dependencies['swup']['local'] = local;
            ver.updateDate = new Date();
        }
        if (ver.dependencies['swup/preload-plugin']['local'] != ver.dependencies['swup/preload-plugin']['remote']) {
            await download(ver.dependencies['swup/preload-plugin']['remote'], ver.dependencies['swup/preload-plugin']['path']);
            ver.dependencies['swup/preload-plugin']['local'] = ver.dependencies['swup/preload-plugin']['remote'];
            ver.updateDate = new Date();
        }
        if (ver.dependencies['swup/scroll-plugin']['local'] != ver.dependencies['swup/scroll-plugin']['remote']) {
            await download(ver.dependencies['swup/scroll-plugin']['remote'], ver.dependencies['swup/scroll-plugin']['path']);
            ver.dependencies['swup/scroll-plugin']['local'] = ver.dependencies['swup/scroll-plugin']['remote'];
            ver.updateDate = new Date();
        }
        if (ver.dependencies['alpinejs']['local'] != ver.dependencies['alpinejs']['remote']) {
            await download(ver.dependencies['alpinejs']['remote'], ver.dependencies['alpinejs']['path']);
            ver.dependencies['alpinejs']['local'] = ver.dependencies['alpinejs']['remote'];
            ver.updateDate = new Date();
        }
        writeFileSync('./scripts/version.json', JSON.stringify(ver, null, 2));

    } catch (error) {
        console.error('出错:', error);
    }
}

updateVersion();