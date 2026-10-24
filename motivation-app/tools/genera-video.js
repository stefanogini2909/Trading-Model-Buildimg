// Genera video animati da 8 secondi (MP4 1080x2338) per il blocco schermo, con ffmpeg.
// Uso: node motivation-app/tools/genera-video.js
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const { chromium } = require("playwright");
const { openApp } = require("./server");

const APP = path.resolve(__dirname, "..");
const OUT = path.join(APP, "videos");
const FPS = 30;
const VIDEOS = [
  { name: "casa-pioggia", style: "casa", seed: 4242, calm: 0 },
  { name: "pioggia-vetro", style: "vetro", seed: 7, calm: 1 },
  { name: "astronauta", style: "spazio", seed: 0, calm: 2 },
  { name: "stazione-spaziale", style: "spazio", seed: 7, calm: 3 },
  { name: "auto-gtr", style: "strada", seed: 0, quote: 0 },
  { name: "auto-ferrari", style: "strada", seed: 7, quote: 1 },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const { page, server } = await openApp(browser, APP);
  const loop = await page.evaluate(() => window.EdgeApp.LOOP);

  for (const v of VIDEOS) {
    const file = path.join(OUT, `${v.name}.mp4`);
    const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
      "-vf", "scale=1080:2338", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "25", "-preset", "slow",
      "-movflags", "+faststart", file], { stdio: ["pipe", "inherit", "inherit"] });
    const done = new Promise((resolve, reject) => ff.on("close", (c) => (c === 0 ? resolve() : reject(new Error("ffmpeg " + c)))));
    await page.evaluate(async (v) => {
      const A = window.EdgeApp;
      window.__o = {
        seed: v.seed, style: v.style, pal: "nero",
        quote: v.calm !== undefined ? [A.CALM[2], A.CALM[11], A.CALM[22], A.CALM[4]][v.calm] : [A.QUOTES[1], A.QUOTES[41]][v.quote],
        label: v.calm !== undefined ? "Mente calma" : "Regola del mestiere",
        date: null, why: false, streak: false, intro: true, outro: true,
      };
      await A.ready(window.__o);
    }, v);
    for (let f = 0; f < loop * FPS; f++) {
      const data = await page.evaluate((t) => window.EdgeApp.render(window.__o, t), f / FPS);
      if (!ff.stdin.write(Buffer.from(data.split(",")[1], "base64"))) await new Promise((r) => ff.stdin.once("drain", r));
    }
    ff.stdin.end();
    await done;
    console.log(file, Math.round(fs.statSync(file).size / 1024) + " KB");
  }
  await browser.close();
  server.close();
})();
