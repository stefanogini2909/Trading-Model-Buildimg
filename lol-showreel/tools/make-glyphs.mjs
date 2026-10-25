// Extracts Cinzel outlines (variable font instanced per weight) for every string the
// showreel draws, so the HTML can treat type as geometry: slice it, fold it, lay it
// on a 3D floor. Output: glyphs.json (font units, y-up, 1000 UPM).
import * as fontkit from 'fontkit';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const font = fontkit.openSync(join(here, '../fonts/Cinzel-VF.ttf'));

// [key, text, weight]
const RUNS = [
  ['FIRST', 'FIRST', 800],
  ['BLOOD', 'BLOOD', 900],
  ['GOLD', 'GOLD ADVANTAGE', 700],
  ['DOUBLE', 'DOUBLE KILL', 600],
  ['TRIPLE', 'TRIPLE KILL', 700],
  ['QUADRA', 'QUADRA KILL', 800],
  ['PENTA', 'PENTAKILL', 900],
  ['VICTORY', 'VICTORY', 900],
  ['Q', 'Q', 700], ['W', 'W', 700], ['E', 'E', 700], ['R', 'R', 700],
  ['T10', '10:00', 600], ['T20', '20:00', 600], ['T30', '30:00', 600],
];
// single glyphs for the running counter (tabular layout is done in the page)
const COUNTER_CHARS = '0123456789+-.K';
const COUNTER_WEIGHT = 800;

const r = (v) => Math.round(v * 10) / 10;

function cmdsOf(glyph) {
  const out = [];
  for (const c of glyph.path.commands) {
    const a = c.args.map(r);
    switch (c.command) {
      case 'moveTo': out.push('M', ...a); break;
      case 'lineTo': out.push('L', ...a); break;
      case 'quadraticCurveTo': out.push('Q', ...a); break;
      case 'bezierCurveTo': out.push('C', ...a); break;
      case 'closePath': out.push('Z'); break;
      default: throw new Error('unknown command ' + c.command);
    }
  }
  return out;
}

const data = { upm: font.unitsPerEm, cap: font.capHeight, runs: {}, counter: {} };

for (const [key, text, wght] of RUNS) {
  const inst = font.getVariation({ wght });
  const run = inst.layout(text);
  let x = 0;
  const glyphs = [];
  run.glyphs.forEach((g, i) => {
    const pos = run.positions[i];
    const bb = g.path.bbox;
    glyphs.push({
      ch: text[i],
      x: r(x + pos.xOffset),
      adv: r(pos.xAdvance),
      bb: [r(bb.minX), r(bb.minY), r(bb.maxX), r(bb.maxY)],
      d: cmdsOf(g),
    });
    x += pos.xAdvance;
  });
  data.runs[key] = { text, wght, width: r(x), glyphs };
}

{
  const inst = font.getVariation({ wght: COUNTER_WEIGHT });
  for (const ch of COUNTER_CHARS) {
    const run = inst.layout(ch);
    const g = run.glyphs[0];
    const bb = g.path.bbox;
    data.counter[ch] = {
      adv: r(run.positions[0].xAdvance),
      bb: [r(bb.minX), r(bb.minY), r(bb.maxX), r(bb.maxY)],
      d: cmdsOf(g),
    };
  }
}

writeFileSync(join(here, 'glyphs.json'), JSON.stringify(data));
for (const [k, v] of Object.entries(data.runs)) console.log(k.padEnd(8), String(v.width).padStart(7), v.text);
console.log('counter advances', Object.entries(data.counter).map(([k, v]) => k + v.adv).join(' '));
