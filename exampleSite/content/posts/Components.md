---
title: Components
date: 2025-01-01T11:30:00+08:00

tag: ["Somnia"]
categories: ["技术"]

featuredImage: "/images/default.webp"
---

# Components

## Containers

### Card

{{< card href="#card" heading="Lorem ipsum" subheading="Lorem ipsum dolor sit amet, vidit suscipit at mei." date="August 2021 - July 2025">}}
Some Text
{{< /card >}}

### Collapse

{{< page/collapse title="Link History Book">}}
    {{< page/timeline >}}
        2025-03-16 Is there a leakage?
        2025-03-16 A leakage of what?
        2025-03-16 I have a full seat of water, like, full of water!
        2025-03-16 Must be the water.
        2025-03-16 Let's add that to the words of wisdom.
    {{< /page/timeline >}}
{{< /page/collapse >}}

### Callout

{{< callout title="Lorem ipsum" type="note">}}
Lorem ipsum dolor sit amet, vidit suscipit at mei. Quem denique mea id. Usu ei regione indoctum dissentiunt, cu meliore fuisset mei, vel quod voluptua ne.
{{< /callout >}}

{{< callout title="Lorem ipsum" type="tip">}}
Lorem ipsum dolor sit amet, vidit suscipit at mei. Quem denique mea id. Usu ei regione indoctum dissentiunt, cu meliore fuisset mei, vel quod voluptua ne.
{{< /callout >}}

{{< callout title="Lorem ipsum" type="caution">}}
Lorem ipsum dolor sit amet, vidit suscipit at mei. Quem denique mea id. Usu ei regione indoctum dissentiunt, cu meliore fuisset mei, vel quod voluptua ne.
{{< /callout >}}

{{< callout title="Lorem ipsum" type="danger">}}
Lorem ipsum dolor sit amet, vidit suscipit at mei. Quem denique mea id. Usu ei regione indoctum dissentiunt, cu meliore fuisset mei, vel quod voluptua ne.
{{< /callout >}}

### Tabs

{{< tabs/tabs >}}

{{< tabs/tab "选项卡 0 已知 bug" >}}
这是第一个 tab 的内容。  
`layouts/shortcodes/tabs/tab.html` 中 `.Inner | markdownify` 支持了 **Markdown**。
但会这导致 tabs 中 shortcode 一些字符被转义，渲染错误。如选项卡 2所示。  
去掉则`|markdownify`可以正常使用 shortcode 。但每一段 Markdown 都需要被 `{{.Inner | markdownify}}` 这样的 shortcode 包裹，才能渲染为 HTML。或者像是 Button 示例那样，直接在 markdown 中写 HTML。
{{< /tabs/tab >}}

{{< tabs/tab "选项卡 1" >}}
这是第二个 tab 的内容，支持 **Markdown**。
![随机图片](https://api.yppp.net/api.php)
{{< /tabs/tab >}}

{{< tabs/tab "选项卡 2" >}}
一些文本
{{< card href="#card" heading="Lorem ipsum" subheading="Lorem ipsum dolor sit amet, vidit suscipit at mei." date="August 2021 - July 2025">}}
Some Text
{{< /card >}}
一些文本
{{< /tabs/tab >}}

{{< /tabs/tabs >}}

## List

### CardList

{{< card-list title="Lorem ipsum">}}
- List1
- List2
- List3
    - List3.1
    - List3.2
- List4 [Link](#link)
- {{< page/spoiler >}}我不知道这玩意是啥，算是加了边框的没有点的无序列表？{{< /page/spoiler >}}
{{< /card-list >}}

- List1
- List2
- List3
    - List3.1
    - List3.2
- List4 [Link](#link)


### Timeline

{{< page/timeline >}}
    2025-03-16 Is there a leakage?
    2025-03-16 A leakage of what?
    2025-03-16 I have a full seat of water, like, full of water!
    2025-03-16 Must be the water.
    2025-03-16 Let's add that to the words of wisdom.
{{< /page/timeline >}}

### Steps

{{< steps >}}
1. Dian Zan
2. Tou Bi
3. Shou Cang  
    <p style="margin: 1rem;">Or GuanZhu sometimes.</p>
{{< /steps >}}


## Simple Text Render

### Button

<div>
{{< page/button title="Lorem ipsum" href="#lorem-ipsum" variant="button" >}}&nbsp;And&nbsp;{{< page/button title="Lorem ipsum" href="#lorem-ipsum" variant="button" >}} 
</div>

### Spoiler

{{< page/spoiler >}}PHP是世界上最好的语言{{< /page/spoiler >}}


### Formatted Date

{{< formatted-date "1773628464873" >}}
<br>
{{< formatted-date "1735660800000" >}}

### Label

{{< label title="Lorem ipsum" >}}
{{< label title="Lorem ipsum" href="#lorem-ipsum" >}}


## Resources

### Icons

<div style="display: inline-flex; align-items: center; gap: 8px;">
{{< icon/icon name="star" size="md" >}}
{{< icon/icon name="check" size="md" >}}
{{< icon/icon name="github" size="md" >}}
{{< icon/icon name="starexternal-link" size="md" >}}
{{< icon/icon name="sun" size="md" >}}
{{< icon/icon name="moon" size="md" >}}
{{< icon/icon name="link" size="md" >}}
{{< icon/icon name="hash" size="md" >}}
{{< icon/icon size="md" size="md">}}
</div>

方法很多，如 SVG Sprite / Hugo Shortcode / Unocss Icons preset 等等。
svg or 可参考:
- https://unocss.dev/presets/icons
- https://icon-sets.iconify.design/
- https://www.mingcute.com/

# Advanced Components

## Web Content Render

### Quote

{{< quote >}}

### GitHub Card

{{< github-card repo="kkbt0/Somnia" >}}
<br>
{{< github-card repo="cworld1/astro-theme-pure" >}}

### Link Preview

{{< link-preview href="https://github.com/unocss/unocss" >}}

## Data Transformer

### QRCode

{{< qrcode text="https://example.com" class="inline-flex max-w-44 p-3 bg-muted rounded-lg border" >}}

### Toast

{{< page/button title="Lorem ipsum" href="posts/components/#toast" variant="button" >}}

{{< html >}}
<script>
    // 找到包含"Lorem ipsum"文本的最后的p标签
    let targetP = Array.from(document.querySelectorAll('p')).findLast(p =>
        p.textContent.includes('Lorem ipsum')
    );

    // 获取它的父元素
    if (targetP) {
        let parentElement = targetP.parentElement;
        parentElement.addEventListener('click', () => {
            somnia.showToast("Clicked!", 3000);
        })
    }
</script>
{{< /html >}}

### Medium Zoom

https://blog.yeqing.net/acg-api/

![随机图片](https://api.yppp.net/api.php "一张随机的图片")

### Bilibili

{{< bilibili BV15t4y1C75u >}}
