// Renders showreel.html with Playwright.
//   node render.mjs stills <t> [t…]        → out/stills/t_<t>.png
//   node render.mjs beats [offset]          → out/beats/beat_NN.png (one per beat, at beat + offset) + contact sheets
//   node render.mjs audio                   → out/soundtrack.wav (OfflineAudioContext inside the page)
//   node render.mjs frames [workers]        → out/frames/sub_NNNNN.png: 180 fps, subframe j at t = (j-1)/180,
//                                             so frames 3k..3k+2 are centred on video frame k (t = k/60)
//   node render.mjs encode                  → out/lol-showreel.mp4 (tmix 3 subframes → 60 fps, + soundtrack)
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync, writeFileSync, existsSync, readdirSync, rmSync, renameSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, '..');
const HTML = join(ROOT, 'showreel.html');
const OUT = join(ROOT, 'out');
const DUR = 15, SUB = 180, FPS = 60;

async function openPage(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => { console.error('pageerror:', e.message); process.exitCode = 1; });
  page.on('console', (m) => { if (m.type() === 'error') console.error('console:', m.text()); });
  await page.goto('file://' + HTML);
  await page.waitForFunction(() => typeof window.seek === 'function');
  return page;
}
async function shot(page, t, file) {
  await page.evaluate((tt) => window.seek(tt), t);
  const buf = await page.screenshot({ type: 'png' });
  if (file) writeFileSync(file, buf);
  return buf;
}

async function contactSheets(browser, files, labels, outPrefix, perSheet = 6, cols = 3, cw = 640) {
  const ch = Math.round(cw * 9 / 16);
  const page = await openPageBlank(browser, cols * (cw + 6) + 6, Math.ceil(perSheet / cols) * (ch + 6) + 6);
  for (let s = 0; s * perSheet < files.length; s++) {
    const cells = files.slice(s * perSheet, (s + 1) * perSheet).map((f, i) =>
      `<figure><img src="file://${f}"><figcaption>${labels[s * perSheet + i]}</figcaption></figure>`).join('');
    const html = `${outPrefix}_${s + 1}.html`;
    writeFileSync(html, `<html><body style="margin:0;background:#222;font:600 22px monospace;color:#eee">
      <div style="display:grid;grid-template-columns:repeat(${cols},${cw}px);gap:6px;padding:6px">${cells}</div>
      <style>figure{margin:0;position:relative}img{width:${cw}px;height:${ch}px;display:block}
      figcaption{position:absolute;left:8px;top:6px;background:#000c;padding:2px 8px}</style></body></html>`);
    await page.goto('file://' + html);
    await page.screenshot({ path: `${outPrefix}_${s + 1}.png`, fullPage: true });
    rmSync(html);
  }
}
async function openPageBlank(browser, w = 1938, h = 738) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  return ctx.newPage();
}

const [mode = 'beats', ...args] = process.argv.slice(2);
const browser = await chromium.launch();
try {
  if (mode === 'stills') {
    const dir = join(OUT, 'stills'); mkdirSync(dir, { recursive: true });
    const page = await openPage(browser);
    const files = [];
    for (const a of args) {
      const t = parseFloat(a), f = join(dir, `t_${t.toFixed(3)}.png`);
      await shot(page, t, f); files.push(f);
    }
    if (files.length > 1) await contactSheets(browser, files, args.map((a) => 't=' + a), join(dir, 'sheet'));
    console.log('stills:', files.length);
  } else if (mode === 'strip') {
    // dense look at a transition: node render.mjs strip <t0> <t1> <step> [name]
    const [a, b, st] = args.slice(0, 3).map(parseFloat), name = args[3] || 'strip';
    const dir = join(OUT, name); if (existsSync(dir)) rmSync(dir, { recursive: true }); mkdirSync(dir, { recursive: true });
    const page = await openPage(browser);
    const files = [], labels = [];
    for (let t = a, i = 0; t <= b + 1e-9; t += st, i++) {
      const f = join(dir, `f_${String(i).padStart(3, '0')}.png`);
      await shot(page, t, f); files.push(f); labels.push('t=' + t.toFixed(3));
    }
    await contactSheets(browser, files, labels, join(dir, 'sheet'), 12, 4, 480);
    console.log(name + ':', files.length, 'frames');
  } else if (mode === 'beats') {
    const off = args[0] !== undefined ? parseFloat(args[0]) : 0.2;
    const dir = join(OUT, 'beats'); mkdirSync(dir, { recursive: true });
    const page = await openPage(browser);
    const files = [], labels = [];
    for (let b = 0; b < 30; b++) {
      const t = b * 0.5 + off, f = join(dir, `beat_${String(b + 1).padStart(2, '0')}.png`);
      await shot(page, t, f); files.push(f); labels.push(`beat ${b + 1}  t=${t.toFixed(2)}`);
    }
    await contactSheets(browser, files, labels, join(dir, 'sheet'));
    mkdirSync(join(ROOT, 'docs'), { recursive: true });
    await contactSheets(browser, files, labels.map((l) => l.replace(/\s+t=.*/, '')), join(ROOT, 'docs', 'storyboard'), 30, 6, 320);
    renameSync(join(ROOT, 'docs', 'storyboard_1.png'), join(ROOT, 'docs', 'storyboard.png'));
    console.log('beats rendered at +' + off);
  } else if (mode === 'audio') {
    mkdirSync(OUT, { recursive: true });
    const page = await openPage(browser);
    const r = await page.evaluate(() => window.renderAudio());
    writeFileSync(join(OUT, 'soundtrack.wav'), Buffer.from(r.wav, 'base64'));
    console.log('soundtrack.wav  raw peak', r.peak.toFixed(3), 'gain', r.gain.toFixed(3));
  } else if (mode === 'frames') {
    const workers = parseInt(args[0] || '4', 10);
    const dir = join(OUT, 'frames');
    if (existsSync(dir)) rmSync(dir, { recursive: true });
    mkdirSync(dir, { recursive: true });
    const total = DUR * SUB, per = Math.ceil(total / workers);
    const t0 = Date.now();
    let done = 0;
    await Promise.all(Array.from({ length: workers }, async (_, w) => {
      const page = await openPage(browser);
      for (let j = w * per; j < Math.min(total, (w + 1) * per); j++) {
        await shot(page, (j - 1) / SUB, join(dir, `sub_${String(j).padStart(5, '0')}.png`));
        if (++done % 150 === 0) console.log(`${done}/${total}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
      }
    }));
    console.log('frames done in', ((Date.now() - t0) / 1000).toFixed(0), 's');
  } else if (mode === 'encode') {
    const n = readdirSync(join(OUT, 'frames')).filter((f) => f.endsWith('.png')).length;
    if (n !== DUR * SUB) throw new Error(`expected ${DUR * SUB} subframes, found ${n}`);
    const outFile = join(OUT, 'lol-showreel.mp4');
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-stats',
      '-framerate', String(SUB), '-i', join(OUT, 'frames', 'sub_%05d.png'),
      '-i', join(OUT, 'soundtrack.wav'),
      '-filter_complex', "[0:v]tmix=frames=3:weights='1 1 1',select='eq(mod(n\\,3)\\,2)',setpts=N/(60*TB),format=yuv420p[v]",
      '-map', '[v]', '-map', '1:a', '-r', String(FPS), '-fps_mode', 'cfr',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
      '-c:a', 'aac', '-b:a', '320k', '-movflags', '+faststart', '-t', String(DUR), outFile], { stdio: 'inherit' });
    console.log('wrote', outFile);
  } else {
    throw new Error('unknown mode ' + mode);
  }
} finally {
  await browser.close();
}
