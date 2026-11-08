// Shared helpers for scripts/new-app.mjs and scripts/sync-app.mjs (no dependencies).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

export const ROOT = fileURLToPath(new URL('..', import.meta.url));
export const APPS_DIR = join(ROOT, 'src/content/apps');
export const IMAGES_DIR = join(ROOT, 'public/images/apps');

export const appPath = (slug) => join(APPS_DIR, `${slug}.md`);

export function siteUrl() {
  const cfg = readFileSync(join(ROOT, 'src/config.ts'), 'utf8');
  return (cfg.match(/url:\s*'([^']+)'/) ?? [])[1]?.replace(/\/$/, '') ?? 'https://example.com';
}

export const isSlug = (s) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s ?? '');

export function printUrls(slug) {
  const base = siteUrl();
  console.log(`
  App Store Connect URLs for "${slug}":
    Marketing URL       ${base}/apps/${slug}/
    Support URL         ${base}/contact/?app=${slug}
    Privacy Policy URL  ${base}/apps/${slug}/privacy/
`);
}

// ---------- Markdown file with YAML frontmatter (line-based, keeps your formatting) ----------

export function readApp(slug) {
  const p = appPath(slug);
  if (!existsSync(p)) throw new Error(`No app file at src/content/apps/${slug}.md`);
  const text = readFileSync(p, 'utf8');
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`${slug}.md has no frontmatter`);
  return { path: p, fm: m[1], body: m[2] };
}

export function writeApp({ path, fm, body }) {
  writeFileSync(path, `---\n${fm}\n---\n${body.trim() ? body.trim() + '\n' : ''}`);
}

/** Read a simple scalar value from frontmatter (strings, numbers, booleans). */
export function getField(fm, key) {
  const m = fm.match(new RegExp(`^${key}:[ \\t]*(.*)$`, 'm'));
  if (!m) return undefined;
  const raw = m[1].replace(/\s+#.*$/, '').trim();
  if (raw.startsWith('"')) { try { return JSON.parse(raw); } catch { return raw.slice(1, -1); } }
  return raw.replace(/^'(.*)'$/, '$1');
}

/** Set a key to a YAML value string; replaces the key and any indented block under it, or appends. */
export function setField(fm, key, yamlValue) {
  const lines = fm.split('\n');
  const i = lines.findIndex((l) => l.startsWith(`${key}:`));
  const newLines = `${key}:${yamlValue.startsWith('\n') ? '' : ' '}${yamlValue}`.split('\n');
  if (i === -1) return [...lines, ...newLines].join('\n');
  let j = i + 1;
  while (j < lines.length && /^(\s+|\s*-\s)/.test(lines[j]) && lines[j].trim() !== '') j++;
  lines.splice(i, j - i, ...newLines);
  return lines.join('\n');
}

export const q = (s) => JSON.stringify(s ?? '');
export const yamlList = (arr) => (arr.length ? '\n' + arr.map((s) => `  - ${s}`).join('\n') : '[]');

// ---------- App Store description → Markdown ----------

const isHeading = (s) =>
  s.length < 70 && !/[.!?:,]$/.test(s) && !/^[-•*]/.test(s) && s.split(/\s+/).length <= 9;
const title = (s) => (s === s.toUpperCase() ? s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) : s.replace(/:$/, ''));

export function descriptionToMarkdown(desc) {
  const out = [];
  let first = true;
  for (const raw of desc.replace(/\r/g, '').split('\n')) {
    const s = raw.trim();
    if (!s) { out.push(''); continue; }
    if (/^https?:\/\/\S+$/.test(s)) continue;
    if (/^(terms of use|terms|privacy policy|eula|privacy)\s*:?$/i.test(s)) continue;
    if (first) { out.push(s); first = false; continue; }
    if (s.includes('•')) {
      const [head, ...items] = s.split('•');
      if (head.trim()) out.push('', `### ${title(head.trim())}`, '');
      items.map((x) => x.trim()).filter(Boolean).forEach((x) => out.push(`- ${x}`));
    } else if (/^[-*]\s/.test(s)) {
      const item = s.slice(2).trim();
      const m = item.match(/^([^:]{2,40}):\s+(.*)$/);
      out.push(m ? `- **${m[1]}:** ${m[2]}` : `- ${item}`);
    } else if (/^([^:.]{2,40}):\s+(.+)$/.test(s)) {
      const m = s.match(/^([^:.]{2,40}):\s+(.+)$/);
      out.push(`- **${m[1]}:** ${m[2]}`);
    } else if ((s === s.toUpperCase() && /[A-Z]/.test(s) && s.length < 70) || isHeading(s)) {
      out.push('', `### ${title(s)}`, '');
    } else {
      out.push(s);
    }
  }
  return out.join('\n').replace(/^(- .*)\n\n(?=- )/gm, '$1\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

export function summaryFrom(desc) {
  const para = desc.trim().split('\n')[0].trim();
  let out = '';
  for (const s of para.split(/(?<=[.!?])\s+/)) {
    if (out && out.length + s.length > 200) break;
    out = `${out} ${s}`.trim();
  }
  return out;
}

// ---------- Apple lookup + downloads ----------

export async function lookup(ids, country = 'us') {
  const url = `https://itunes.apple.com/lookup?id=${ids.join(',')}&country=${country}&entity=software`;
  const res = await fetch(url, { headers: { 'User-Agent': 'hchowstudio-site-sync/1.0' } });
  if (!res.ok) throw new Error(`App Store lookup failed: HTTP ${res.status}`);
  const data = await res.json();
  return new Map(data.results.map((r) => [String(r.trackId), r]));
}

export async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': 'hchowstudio-site-sync/1.0' } });
  if (!res.ok) throw new Error(`Download failed (${res.status}): ${url}`);
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

export const resized = (url, size) => url.replace(/\/[^/]+$/, `/${size}`);
