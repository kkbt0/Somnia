// 项目需要 alpinejs async-alpine medium-zoom swup scroll-plugin medium-zoom.min

await Bun.write("./assets/js/libs/alpinejs.esm.js", Bun.file("node_modules/alpinejs/dist/module.esm.js"));
await Bun.write("./assets/js/libs/async-alpine.esm.js", Bun.file("node_modules/async-alpine/dist/async-alpine.esm.js"));
await Bun.write("./assets/js/libs/swup.umd.js", Bun.file("node_modules/swup/dist/swup.umd.js"));
await Bun.write("./assets/js/libs/scroll-plugin.umd.js", Bun.file("node_modules/@swup/scroll-plugin/dist/index.umd.js"));

// 去除第一行
const fileContent = await Bun.file("node_modules/medium-zoom/dist/medium-zoom.esm.js").text();
const lines = fileContent.split('\n');
const modifiedContent = lines.slice(1).join('\n');
await Bun.write("./assets/js/libs/medium-zoom.esm.js", modifiedContent);