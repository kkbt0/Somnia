# 网站规范

https://specification.website

## DISCOVERY
https://specification.website/spec/foundations/feed-discovery/ 
- [ ] application/atom+xml
- [x] application/feed+json

https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/rss.xml
https://github.com/HEIGE-PCloud/DoIt/tree/main/layouts
https://gohugo.io/templates/rss/

https://liudon.com/posts/fix-hugo-json-feed/

markdown discovery https://specification.website/spec/agent-readiness/markdown-source-endpoints/

## Popover API

https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Global_attributes/popover

自 April 2024 起，此特性已在最新浏览器中得到支持。但在较旧的设备或浏览器中可能无法运行。

目前由 Alpinejs @click @click.outside 支持

## CSS text-autospace

https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Properties/text-autospace

自 November 2025 起，此特性已在最新浏览器中得到支持。但在较旧的设备或浏览器中可能无法运行。

## Meta robots and X-Robots-Tag

https://specification.website/spec/seo/meta-robots/

这对于博客意义有限

## Structured data (JSON-LD)

https://specification.website/spec/seo/structured-data/

- [x] TODO

## Breadcrumbs

https://specification.website/spec/seo/breadcrumbs/

## Keyboard navigation

- [ ] 控制中心键盘导航优化

## Skip links

https://specification.website/spec/accessibility/skip-links/

## /.well-known/security.txt

https://specification.website/spec/security/security-txt/

这对于静态博客意义有限。不过添加并不困难。

## X-Content-Type-Options: nosniff

https://specification.website/spec/security/x-content-type-options/


## /llms.txt

https://specification.website/spec/agent-readiness/llms-txt/

它并非正式认可的标准。没有主要模型厂商承诺使用它。把它当作低成本的赌注，当经纪人寻找廉价、权威的网站摘要时，可能会有所回报。

仅在 docs 中手动提供。这对于个人内容意义有限。使用外部工具添加并不困难。

## robots.txt for AI crawlers

https://specification.website/spec/agent-readiness/robots-for-ai-crawlers/

The big ones, as of 2026:

GPTBot — OpenAI training crawler.
OAI-SearchBot — OpenAI retrieval crawler used by ChatGPT browsing.
ChatGPT-User — on-demand fetches when a ChatGPT user asks for a URL.
ClaudeBot — Anthropic training and retrieval crawler.
anthropic-ai — legacy Anthropic user-agent, still seen.
Google-Extended — opts out of Gemini and Vertex training without affecting Search.
Applebot-Extended — opts out of Apple Intelligence training without affecting Siri/Spotlight.
PerplexityBot — Perplexity retrieval crawler.
Bytespider — ByteDance crawler, widely used for training.
CCBot — Common Crawl, the dataset behind many open models.

## Structured data for agents

https://specification.website/spec/agent-readiness/structured-data-for-agents/

same as structured data JSON-LD

## Machine-readable formats

https://specification.website/spec/agent-readiness/machine-readable-formats/

- [x] FEED JSON

https://www.jsonfeed.org/version/1.1/

## Cookie consent .etc

https://specification.website/spec/privacy/cookie-consent/
https://specification.website/spec/privacy/global-privacy-control/
https://specification.website/spec/privacy/global-privacy-control/

- [ ] TODO or NOT TODO