# svg_compressor.ts

命令行使用
```bash
# 基本压缩（保留文本空格）
deno run --allow-read --allow-write svg_compressor.ts input.svg

# 指定输出文件
deno run --allow-read --allow-write svg_compressor.ts input.svg -o output.min.svg

# 输出到终端
deno run --allow-read svg_compressor.ts input.svg --stdout

# 简单压缩（不保留文本空格）
deno run --allow-read --allow-write svg_compressor.ts input.svg --simple

# 管道使用
cat input.svg | deno run svg_compressor.ts
```
作为模块使用
```ts
// other_module.ts
import { compressSVG, compressSVGSimple } from './svg_compressor.ts';

const svg = `<svg>
  <text>Hello   World</text>
</svg>`;

// 安全压缩（保留文本空格）
const compressed = compressSVG(svg);
console.log(compressed); // <svg><text>Hello   World</text></svg>

// 简单压缩
const simpleCompressed = compressSVGSimple(svg);
console.log(simpleCompressed); // <svg><text>Hello World</text></svg>
```
一行命令快速使用
```bash
# 创建临时脚本直接运行
deno eval "console.log(await Deno.readTextFile('input.svg').then(s => s.replace(/>\s+</g,'><').replace(/\s+/g,' ').trim()))"
```

测试用例
```ts
// test.ts
import { compressSVG, compressSVGSimple } from './svg_compressor.ts';
import { assertEquals } from 'https://deno.land/std@0.224.0/testing/asserts.ts';

Deno.test('保留文本元素中的空格', () => {
  const input = '<svg><text>Hello   World</text></svg>';
  const output = compressSVG(input);
  assertEquals(output, '<svg><text>Hello   World</text></svg>');
});

Deno.test('压缩标签间空白', () => {
  const input = '<svg>   <g>   </g>   </svg>';
  const output = compressSVG(input);
  assertEquals(output, '<svg><g></g></svg>');
});

Deno.test('压缩属性间空格', () => {
  const input = '<rect   x="10"   y="20"   />';
  const output = compressSVGSimple(input);
  assertEquals(output, '<rect x="10" y="20" />');
});
```
