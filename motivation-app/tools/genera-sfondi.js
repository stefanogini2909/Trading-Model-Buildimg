// Genera un pacchetto di sfondi (JPG 1170x2532) usando lo stesso motore dell'app.
// Uso: node motivation-app/tools/genera-sfondi.js [quanti]
const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright");
const { openApp } = require("./server");

const APP = path.resolve(__dirname, "..");
const OUT = path.join(APP, "wallpapers");
const COUNT = parseInt(process.argv[2] || "24", 10);

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const f of fs.readdirSync(OUT)) if (/^edge-\d+\.jpg$/.test(f)) fs.unlinkSync(path.join(OUT, f));
  const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const { page, server } = await openApp(browser, APP);

  for (let i = 0; i < COUNT; i++) {
    const data = await page.evaluate(async (i) => {
      const A = window.EdgeApp;
      // scene create da zero, con varianti di inquadratura e tavolozza
      const combos = [["tramonto", "auto", 0], ["autostrada", "auto", 0], ["lago", "auto", 0], ["tramonto", "auto", 40], ["autostrada", "auto", 11], ["lago", "auto", 23],
        ["tramonto", "auto", 13], ["autostrada", "auto", 29], ["lago", "auto", 47], ["casa", "auto", 4242], ["tramonto", "auto", 71], ["vetro", "auto", 7]];
      const [style, fx, seed0] = combos[i % combos.length];
      const calm = i % 2 === 0;
      const o = {
        seed: seed0 + (i >= combos.length ? 101 : 0), style, fx, pal: ["nero", "notte", "bottiglia", "bordeaux"][i % 4],
        quote: calm ? A.CALM[(i * 5) % A.CALM.length] : A.QUOTES[(i * 7) % A.QUOTES.length],
        label: calm ? "Mente calma" : "Regola del mestiere", date: null, why: false, streak: false,
      };
      await A.ready(o);
      return A.render(o);
    }, i);
    const file = path.join(OUT, `edge-${String(i + 1).padStart(2, "0")}.jpg`);
    fs.writeFileSync(file, Buffer.from(data.split(",")[1], "base64"));
    console.log(file);
  }

  // icone PNG per la schermata Home
  const svg = fs.readFileSync(path.join(APP, "icon.svg"), "utf8");
  for (const size of [180, 192, 512]) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<style>html,body{margin:0;background:#0e0d0c}</style>${svg.replace("<svg ", `<svg width="${size}" height="${size}" `)}`);
    await page.screenshot({ path: path.join(APP, `icon-${size}.png`) });
  }
  await browser.close();
  server.close();
})();
