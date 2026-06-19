#!/usr/bin/env bun
// 自用小工具 建议使用专业工具
const xml = await Bun.file("static/icons/main.svg.src").text();

// 删除标签间空白、换行、缩进
function compressSVG(xml) {
  return (
    xml
      // 保留标签内的内容，只压缩标签间的空白
      .replace(/>\s+</g, "><")
      // 压缩属性间的空白（但不影响引号内的内容）
      .replace(/\s+/g, " ")
      // 去除属性值引号周围的多余空格
      .replace(/\s*=\s*/g, "=")
      .trim()
  );
}

// await Bun.writeFile('static/icons/main.svg.min', compressed);
await Bun.write("static/icons/main.svg", compressSVG(xml));
