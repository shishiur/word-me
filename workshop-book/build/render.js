// Usage: node render.js pdf <in.html> <out.pdf>
//        node render.js png <in.svg> <out.png> <widthPx>
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [mode, inp, out, width] = process.argv.slice(2);
  const browser = await chromium.launch();
  if (mode === 'pdf') {
    const page = await browser.newPage();
    await page.goto('file://' + inp, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true, outline: true, tagged: true });
  } else if (mode === 'png') {
    const svg = fs.readFileSync(inp, 'utf8');
    const m = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
    const vw = parseFloat(m[1]), vh = parseFloat(m[2]);
    const w = parseInt(width || '2400', 10), h = Math.round(w * vh / vw);
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const html = `<html><body style="margin:0;background:#fff">${svg.replace(/width="[^"]+mm" height="[^"]+mm"/, `width="${w}" height="${h}"`)}</body></html>`;
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: out, clip: { x: 0, y: 0, width: w, height: h } });
  }
  await browser.close();
})();
