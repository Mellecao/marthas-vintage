import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const cream = '#f6efe2';
const mark = await sharp('public/assets/logo/logo-partes/raster/m-lettering.png').trim().toBuffer();
async function icon(size) {
  const inset = Math.round(size * 0.12);
  const glyph = await sharp(mark).resize(size - inset * 2, size - inset * 2, { fit: 'contain', background: cream }).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: cream } }).composite([{ input: glyph, gravity: 'centre' }]).png().toBuffer();
}
await writeFile('src/app/icon.png', await icon(192));
await writeFile('src/app/apple-icon.png', await icon(180));
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(icon));
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
images.forEach((image, i) => {
  const p = 6 + i * 16;
  header[p] = sizes[i]; header[p + 1] = sizes[i];
  header.writeUInt16LE(1, p + 4); header.writeUInt16LE(32, p + 6);
  header.writeUInt32LE(image.length, p + 8); header.writeUInt32LE(offset, p + 12);
  offset += image.length;
});
await writeFile('src/app/favicon.ico', Buffer.concat([header, ...images]));
const lettering = await sharp(await readFile('public/assets/logo/logo-somente-lettering-reto.svg')).resize(1000).png().toBuffer();
const detail = Buffer.from(`<svg width="1200" height="630"><path d="M100 170H1100 M100 460H1100" stroke="#3b230b" stroke-opacity=".25"/><text x="600" y="440" text-anchor="middle" fill="#3b230b" font-family="Georgia,serif" font-size="22" letter-spacing="5">BASTROP, TEXAS</text></svg>`);
await sharp({ create: { width: 1200, height: 630, channels: 3, background: cream } }).composite([{input: lettering, left:100, top:218},{input:detail}]).png().toFile('src/app/opengraph-image.png');
await writeFile('src/app/twitter-image.png', await readFile('src/app/opengraph-image.png'));
console.log('Generated favicon (16/32/48), icon (192), apple icon (180), and social images (1200x630).');
