// svg_compressor.ts
/**
 * 安全的 SVG 压缩工具
 * 支持标签间空白压缩，保留文本内容和属性值中的空格
 */

function compressSVG(xml: string): string {
  // 临时替换需要保留空格的文本内容
  const preservedTexts: string[] = [];

  // 1. 保护 <text>、<tspan> 等文本元素的内容
  let processed = xml.replace(
    /(<(?:text|tspan|textarea|title|desc)(?:\s[^>]*)?>)(.*?)(<\/\1>)/gs,
    (_, open, content, close) => {
      const index = preservedTexts.length;
      preservedTexts.push(content);
      return `${open}__PRESERVED_TEXT_${index}__${close}`;
    }
  );

  // 2. 保护 CDATA 段
  processed = processed.replace(
    /<!\[CDATA\[(.*?)\]\]>/gs,
    (_, content) => {
      const index = preservedTexts.length;
      preservedTexts.push(content);
      return `__PRESERVED_CDATA_${index}__`;
    }
  );

  // 3. 保护注释（可选：如要移除注释，可跳过此步）
  processed = processed.replace(
    /<!--(.*?)-->/gs,
    (_, content) => {
      const index = preservedTexts.length;
      preservedTexts.push(content);
      return `__PRESERVED_COMMENT_${index}__`;
    }
  );

  // 4. 压缩标签间的空白
  processed = processed
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .trim();

  // 5. 恢复保留的内容
  preservedTexts.forEach((text, index) => {
    processed = processed.replace(
      new RegExp(`__PRESERVED_TEXT_${index}__`, 'g'),
      text
    );
    processed = processed.replace(
      new RegExp(`__PRESERVED_CDATA_${index}__`, 'g'),
      text
    );
    processed = processed.replace(
      new RegExp(`__PRESERVED_COMMENT_${index}__`, 'g'),
      text
    );
  });

  return processed;
}

// 简单版本（适合不需要保留文本空格的场景）
function compressSVGSimple(xml: string): string {
  return xml
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .trim();
}

// CLI 入口
async function main() {
  const args = Deno.args;

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
SVG Compressor - 压缩 SVG 文件

用法:
  deno run --allow-read --allow-write svg_compressor.ts <input.svg> [options]
  deno run --allow-read svg_compressor.ts <input.svg> --stdout

选项:
  --simple       使用简单压缩（不保留文本空格）
  --stdout       输出到标准输出而不是文件
  -o, --output   指定输出文件名
  -h, --help     显示帮助信息

示例:
  deno run --allow-read --allow-write svg_compressor.ts input.svg
  deno run --allow-read --allow-write svg_compressor.ts input.svg -o output.svg
  deno run --allow-read svg_compressor.ts input.svg --stdout
    `);
    Deno.exit(0);
  }

  const inputFile = args[0];
  const useSimple = args.includes('--simple');
  const toStdout = args.includes('--stdout');

  let outputFile = inputFile.replace(/\.svg$/i, '.min.svg');
  const outputIndex = args.indexOf('-o') !== -1
    ? args.indexOf('-o')
    : args.indexOf('--output');

  if (outputIndex !== -1 && args[outputIndex + 1]) {
    outputFile = args[outputIndex + 1];
  }

  try {
    // 读取输入文件
    const xml = await Deno.readTextFile(inputFile);

    // 压缩
    const compressor = useSimple ? compressSVGSimple : compressSVG;
    const compressed = compressor(xml);

    // 计算压缩率
    const originalSize = new TextEncoder().encode(xml).length;
    const compressedSize = new TextEncoder().encode(compressed).length;
    const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1);

    // 输出结果
    if (toStdout) {
      console.log(compressed);
    } else {
      await Deno.writeTextFile(outputFile, compressed);
    }

    console.error(`✅ 压缩完成:`);
    console.error(`   原始大小: ${originalSize.toLocaleString()} 字节`);
    console.error(`   压缩后: ${compressedSize.toLocaleString()} 字节`);
    console.error(`   压缩率: ${ratio}%`);

    if (!toStdout) {
      console.error(`   输出文件: ${outputFile}`);
    }

  } catch (error) {
    console.error(`❌ 错误: ${error.message}`);
    Deno.exit(1);
  }
}

// 仅在直接运行时执行 CLI
if (import.meta.main) {
  main();
}

// 导出函数供其他模块使用
export { compressSVG, compressSVGSimple };
