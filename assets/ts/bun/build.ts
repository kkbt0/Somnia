await Bun.build({
    entrypoints: ["./index.ts"],
    outdir: "./dist/",
    minify: true,                    // 可选：压缩代码
});