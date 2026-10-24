// Genera video animati in loop a 60 fps (MP4 1080x2338) per il blocco schermo, con ffmpeg.
// Uso: node motivation-app/tools/genera-video.js [nome1,nome2,...]   (senza nomi li genera tutti)
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const { chromium } = require("playwright");
const { openApp } = require("./server");

const APP = path.resolve(__dirname, "..");
const OUT = path.join(APP, "videos");
const FPS = 60;
const VIDEOS = [
  { name: "tramonto-tropicale", style: "tramonto", pal: "nero", seed: 0, calm: 4 },
  { name: "tramonto-tropicale-isola", style: "tramonto", pal: "bordeaux", seed: 40, calm: 0 },
  { name: "autostrada-di-notte", style: "autostrada", pal: "nero", seed: 0, quote: 2 },
  { name: "autostrada-di-notte-blu", style: "autostrada", pal: "notte", seed: 11, calm: 6 },
  { name: "aurora-sul-lago", style: "lago", pal: "notte", seed: 0, calm: 1 },
  { name: "aurora-sul-lago-verde", style: "lago", pal: "bottiglia", seed: 23, calm: 3 },
  { name: "casa-pioggia", style: "casa", seed: 4242, calm: 0 },
  { name: "pioggia-vetro", style: "vetro", seed: 7, calm: 1 },
];

const ONLY = process.argv[2] ? process.argv[2].split(",") : null;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  // WebGL software nel container: SwiftShader
  const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const { page, server } = await openApp(browser, APP);
  
  for (const v of VIDEOS.filter((x) => !ONLY || ONLY.includes(x.name))) {
    const file = path.join(OUT, `${v.name}.mp4`);
    const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
      "-vf", "scale=1080:2338", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "25", "-preset", "slow",
      "-movflags", "+faststart", file], { stdio: ["pipe", "inherit", "inherit"] });
    const done = new Promise((resolve, reject) => ff.on("close", (c) => (c === 0 ? resolve() : reject(new Error("ffmpeg " + c)))));
    await page.evaluate(async (v) => {
      const A = window.EdgeApp;
      window.__o = {
        seed: v.seed, style: v.style, fx: v.fx || "auto", pal: v.pal || "nero",
        quote: v.calm !== undefined ? [A.CALM[2], A.CALM[11], A.CALM[22], A.CALM[4], A.CALM[15], A.CALM[0], A.CALM[13]][v.calm] : [A.QUOTES[1], A.QUOTES[41], A.QUOTES[36]][v.quote],
        label: v.calm !== undefined ? "Mente calma" : "Regola del mestiere",
        // ciclo continuo: nessuna dissolvenza dal nero, così il blocco schermo non lampeggia mai
        date: null, why: false, streak: false, intro: false, outro: false,
      };
      await A.ready(window.__o);
    }, v);
    const loop = await page.evaluate(() => window.EdgeApp.loopOf(window.__o));
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
