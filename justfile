dev:
    hugo server -s exampleSite/ --disableFastRender
build:
    hugo --minify -s exampleSite/
pf:
    pagefind_extended --site exampleSite/public
css:
    bun run dev
css-build:
    bun run build

### dev

dev-dev:
    ../../../bin/hugo  server -s exampleSite/ --disableFastRender -e production
update:
    ../../../bin/llrt scripts/version.js
