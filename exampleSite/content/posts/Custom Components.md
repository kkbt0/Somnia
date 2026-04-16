---
title: Custom Components
date: 2025-01-01T11:00:00+08:00

tag: ["Somnia"]
categories: ["技术"]

featuredImage: "/images/default.webp"
---

### Custom Components

Somnia 使用了 UnoCSS + Alpine.js 。因此可以使用一些 `Alpine + Tailwind` 的 UI 组件库。例如 

- https://devdojo.com/pines/
- https://github.com/thedevdojo/pines
- https://pinemix.com/

**注意**: 由于 Swup.js 的原因，使用 `<script>` 标签在 Swup 切换页面后不会自动执行。解决方法

1. 使用 Swup.js 插件解决。
2. 将 `<script>` 标签内容放到 `assets/js/custom.js` 中，新增例如 `xxxxComponent()`，然后通过 `<div x-data="xxxxComponent()"></div>` 使用。
3. 直接写 `<div x-data="{ foo: 'bar' , func1() { ... }}"></div>`。

例如：

```html
{{</*html*/>}}
<div x-data="{ foo: 'bar' , func1(){ somnia.showToast(this.foo); }}"
class="flex justify-center p-2">
<button @click="func1" class="border p-2 rounded">按钮</button>
</div>
{{</*/html*/>}}
```

{{<html>}}
<div x-data="{ foo: 'bar' , func1(){ somnia.showToast(this.foo); }}"
class="flex justify-center p-2">
<button @click="func1" class="border p-2 rounded">按钮</button>
</div>
{{</html>}}

一个复杂些的例子：https://devdojo.com/pines/docs/text-animation

{{<html>}}
<h1 x-data="{
    startingAnimation: { opacity: 0, scale: 4 },
    endingAnimation: { opacity: 1, scale: 1, stagger: 0.07, duration: 1, ease: 'expo.out' },
    addCNDScript: true,
    animateText() {
        $el.classList.remove('invisible');
        gsap.fromTo($el.children, this.startingAnimation, this.endingAnimation);
    },
    splitCharactersIntoSpans(element) {
        text = element.innerHTML;
        modifiedHTML = [];
        for (var i = 0; i < text.length; i++) {
            attributes = '';
            if(text[i].trim()){ attributes = 'class=\'inline-block\''; }
            modifiedHTML.push('<span ' + attributes + '>' + text[i] + '</span>');
        }
        element.innerHTML = modifiedHTML.join('');
    },
    addScriptToHead(url) {
        script = document.createElement('script');
        script.src = url;
        document.head.appendChild(script);
    }
}"
x-init="
    splitCharactersIntoSpans($el);
    if(addCNDScript){
        addScriptToHead('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js');
    }
    gsapInterval = setInterval(function(){
        if(typeof gsap !== 'undefined'){
            animateText();
            clearInterval(gsapInterval);
        }
    }, 5);
"
class="invisible block text-3xl font-bold custom-font"
>
Pines UI Library
</h1>
{{</html>}}

{{< callout title="注意" type="caution">}}
markdown 中使用原子化类不会被 UnoCSS cli 扫描到。可以将 html 放在 shortcode 避免这个问题。
{{< /callout >}}
