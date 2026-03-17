dev:
    hugo server -s exampleSite/ --disableFastRender
build:
    hugo --minify -s exampleSite/
pf:
    pagefind_extended --site exampleSite/public
css:
    pnpm run dev
css-build:
    pnpm run build