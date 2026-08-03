/**
 * Vercel build: inject Supabase env into id_app.html.
 * Does NOT fail the whole site deploy if the membership file is missing.
 */
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'id_app.html');

if (!fs.existsSync(file)) {
  console.warn('[GWGM] id_app.html not found — skipping Supabase inject.');
  process.exit(0);
}

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('[GWGM] Missing SUPABASE_URL or SUPABASE_ANON_KEY in Vercel env.');
  process.exit(1);
}

let html = fs.readFileSync(file, 'utf8');
const before = html;

html = html
  .replaceAll('__SUPABASE_URL__', url)
  .replaceAll('__SUPABASE_ANON_KEY__', key);

if (html === before) {
  console.warn('[GWGM] Placeholders not found in', file, '— file may already be injected.');
}

fs.writeFileSync(file, html);
console.log('[GWGM] Injected Supabase config into', file);
process.exit(0);
