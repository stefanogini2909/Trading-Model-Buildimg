// Genera un pacchetto di sfondi (JPG 1170x2532) usando lo stesso motore dell'app.
// Uso: node motivation-app/tools/genera-sfondi.js [quanti]
const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright");
const { openApp } = require("./server");

const APP = path.resolve(__dirname, "..");
const OUT = path.join(APP, "wallpapers");
const COUNT = parseInt(process.argv[2] || "24", 10);
// atmosfere a rotazione; ogni tre sfondi uno è un grafico del mestiere
const STYLES = ["casa", "spazio", "strada", "vetro", "casa", "spazio", "strada", "linea"];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const f of fs.readdirSync(OUT)) if (/^edge-\d+\.jpg$/.test(f)) fs.unlinkSync(path.join(OUT, f));
  const browser = await chromium.launch();
  const { page, server } = await openApp(browser, APP);

  for (let i = 0; i < COUNT; i++) {
    const data = await page.evaluate(async (i) => {
      const A = window.EdgeApp;
      const styles = ["casa", "spazio", "strada", "vetro", "casa", "spazio", "strada", "linea"];
      const style = styles[i % styles.length];
      const calm = i % 2 === 0;
      const o = {
        seed: 1000 + i * 7919, style, pal: style === "linea" ? "nero" : ["nero", "bottiglia", "notte"][i % 3],
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
