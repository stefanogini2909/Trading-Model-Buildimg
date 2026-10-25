// Inlines the baked Cinzel outlines into the page: src/showreel.html → showreel.html (one self-contained file).
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, '../src/showreel.html'), 'utf8');
const glyphs = readFileSync(join(here, 'glyphs.json'), 'utf8');
if (!src.includes('/*__GLYPHS__*/null')) throw new Error('placeholder missing');
const out = src.replace('/*__GLYPHS__*/null', glyphs);
writeFileSync(join(here, '../showreel.html'), out);
console.log('showreel.html', (out.length / 1024).toFixed(1), 'KB');
