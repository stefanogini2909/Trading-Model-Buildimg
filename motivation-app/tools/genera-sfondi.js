// Genera un pacchetto di sfondi (JPG 1170x2532) usando lo stesso motore dell'app.
// Uso: node motivation-app/tools/genera-sfondi.js [quanti]
const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright");

const APP = path.resolve(__dirname, "..");
const OUT = path.join(APP, "wallpapers");
const COUNT = parseInt(process.argv[2] || "21", 10);

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("file://" + path.join(APP, "index.html"));
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all([
    document.fonts.load("800 100px 'Big Shoulders Display'"),
    document.fonts.load("500 30px 'IBM Plex Mono'"),
  ]).catch(() => {}));

  for (let i = 0; i < COUNT; i++) {
    const data = await page.evaluate((i) => {
      const A = window.EdgeApp;
      const darkPals = A.PALETTES.filter((p) => p.id !== "alba");
      return A.render({
        seed: 1000 + i * 7919,
        style: A.STYLES[i % A.STYLES.length].id,
        pal: darkPals[i % darkPals.length].id,
        quote: A.QUOTES[(i * 5) % A.QUOTES.length],
        label: "REGOLA DEL MESTIERE",
        date: null,
        why: false,
        streak: false,
      });
    }, i);
    const file = path.join(OUT, `edge-${String(i + 1).padStart(2, "0")}.jpg`);
    fs.writeFileSync(file, Buffer.from(data.split(",")[1], "base64"));
    console.log(file);
  }

  // icone PNG per la schermata Home
  const svg = fs.readFileSync(path.join(APP, "icon.svg"), "utf8");
  for (const size of [180, 192, 512]) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<style>html,body{margin:0;background:#0d1519}</style>${svg.replace("<svg ", `<svg width="${size}" height="${size}" `)}`);
    await page.screenshot({ path: path.join(APP, `icon-${size}.png`), omitBackground: false });
  }
  await browser.close();
})();
