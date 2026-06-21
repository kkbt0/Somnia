// user custom js
// Hugo 会拼接合并 main.js 和 custom.js 为一个文件。所以无需重复导入模块
console.log("%cSomnia", " text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:5em")
console.log("Author: 恐咖兵糖 https://www.ftls.xyz")
let currentDate = new Date();
console.log(currentDate.toLocaleString('zh-u-ca-chinese', { dateStyle: 'full' }) + ' ' + currentDate.toLocaleTimeString(0, { hour12: false })) // 2022壬寅年九月廿九星期一 21:45:11
// console.log(currentDate.toLocaleString('zh-chinese', { dateStyle: 'full' }) + ' ' + currentDate.toLocaleTimeString(0, { hour12: false })) // 2022年3月17日星期二 11:50:33
console.log("你好，世界")

// 可以放一些 js 注意全局挂载
// window.noticeComponent = function () {}

// 修改 CDN or 其他路径 或通过覆盖 js 实现
// BASE_URL = '/Somnia'; // 由于 Hugo 生成提供
SOMNIA_LIBS.pagefind.css = `${BASE_URL}/pagefind/pagefind-ui.css`;
SOMNIA_LIBS.pagefind.js = `${BASE_URL}/pagefind/pagefind-ui.js`;

// PageInitCustom DOMContentLoaded 时执行
Somnia.PageInitCustom = function () {
    console.log("[Somnia] 你好，世界");
}
// Swupjs 初次加载和每次切换页面都会执行
Somnia.swupPageInitCustom = function () {
    console.log("[Swup] Page View", location.pathname);
}
