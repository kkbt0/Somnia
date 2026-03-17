let currentDate = new Date();
console.log("%c超光速", " text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:5em"),
console.log("https://www.ftls.xyz 恐咖兵糖的主页")
console.log(currentDate.toLocaleString('zh-u-ca-chinese', { dateStyle: 'full' }) + ' ' + currentDate.toLocaleTimeString(0, { hour12: false })) // 2022壬寅年九月廿九星期一 21:45:11
// console.log(currentDate.toLocaleString('zh-chinese', { dateStyle: 'full' }) + ' ' + currentDate.toLocaleTimeString(0, { hour12: false })) // 2022年3月17日星期二 11:50:33
console.log("你好，世界")

/**
 * showToast - Show a toast message on the bottom of the screen
 * @param {string} message - The message to be displayed
 * @param {number} time - The duration of the toast in milliseconds
 */
function showToast(message, time) {
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



