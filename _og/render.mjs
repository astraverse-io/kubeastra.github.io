import { chromium } from 'playwright';
const [, , html, out] = process.argv;
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto('file://' + html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const fonts = await page.evaluate(() => ({
  sans700: document.fonts.check('700 74px "IBM Plex Sans"'),
  sans400: document.fonts.check('400 27px "IBM Plex Sans"'),
  mono500: document.fonts.check('500 17px "IBM Plex Mono"'),
  loaded: [...document.fonts].filter(f => f.status === 'loaded').map(f => `${f.family} ${f.weight}`),
}));
// Overflow guard: nothing may spill past the 1200x630 frame.
const overflow = await page.evaluate(() => {
  const bad = [];
  for (const el of document.querySelectorAll('.wrap *')) {
    const r = el.getBoundingClientRect();
    if (r.right > 1200.5 || r.bottom > 630.5) bad.push(`${el.tagName}.${el.className}: ${Math.round(r.right)}x${Math.round(r.bottom)}`);
  }
  return bad;
});
await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
console.log(JSON.stringify({ fonts, overflow }, null, 0));
if (!fonts.sans700 || !fonts.sans400 || !fonts.mono500) { console.error('FONT NOT LOADED'); process.exit(2); }
if (overflow.length) { console.error('OVERFLOW'); process.exit(3); }
