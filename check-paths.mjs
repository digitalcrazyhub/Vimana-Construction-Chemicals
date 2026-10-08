import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const TEXT_EXTENSIONS = new Set(['.html', '.css', '.js', '.mjs', '.xml', '.txt']);
const HTML_ATTR_RE = /\b(?:href|src|poster|action|data-src|data-bg|data-image)\s*=\s*["']([^"']+)["']/gi;
const SRCSET_RE = /\bsrcset\s*=\s*["']([^"']+)["']/gi;
const CSS_URL_RE = /url\(\s*["']?([^\)"']+)["']?\s*\)/gi;
const IMPORT_RE = /@import\s+(?:url\(\s*)?["']([^"')]+)["']/gi;
const JS_LITERAL_RE = /\b(?:fetch|import|location\.(?:assign|replace)|window\.open)\s*\(\s*["']([^"']+)["']/gi;
const JS_LOCAL_RE = /["']((?:\.?\.?\/|\/)??(?:assets|css|js)\/[^"']+)["']/gi;

const relative = (file) => path.relative(ROOT, file).replaceAll(path.sep, '/');

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(target));
    else files.push(target);
  }
  return files;
}

function isExternal(value) {
  return !value || value.startsWith('#') || value.startsWith('data:') || value.startsWith('mailto:') ||
    value.startsWith('tel:') || value.startsWith('javascript:') || value.startsWith('//') || /^[a-z][a-z\d+.-]*:/i.test(value);
}

function cleanReference(value) {
  return decodeURIComponent(value.split('#')[0].split('?')[0].trim());
}

async function resolveReference(source, raw) {
  const clean = cleanReference(raw);
  if (!clean || isExternal(clean)) return null;
  const target = path.normalize(clean.startsWith('/') ? path.join(ROOT, clean.slice(1)) : path.resolve(path.dirname(source), clean));
  const insideRoot = target === ROOT || target.startsWith(`${ROOT}${path.sep}`);
  if (!insideRoot) return { raw, source: relative(source), error: 'outside-root' };
  let exactCase = true;
  let cursor = ROOT;
  const segments = path.relative(ROOT, target).split(path.sep).filter(Boolean);
  for (const segment of segments) {
    let entries;
    try { entries = await readdir(cursor); } catch { exactCase = null; break; }
    if (entries.includes(segment)) cursor = path.join(cursor, segment);
    else if (entries.some((entry) => entry.toLowerCase() === segment.toLowerCase())) exactCase = false;
    else { exactCase = null; break; }
  }
  if (exactCase === false) return { raw, source: relative(source), target: relative(target), error: 'case-mismatch' };
  if (exactCase === null) return { raw, source: relative(source), target: relative(target), error: 'missing' };
  try {
    const targetStat = await stat(target);
    if (targetStat.isDirectory()) return { raw, source: relative(source), target: relative(path.join(target, 'index.html')), ok: true };
    return { raw, source: relative(source), target: relative(target), ok: true };
  } catch {
    return { raw, source: relative(source), target: relative(target), error: 'missing' };
  }
}

async function inspectFile(file) {
  const extension = path.extname(file).toLowerCase();
  if (!TEXT_EXTENSIONS.has(extension) && path.basename(file) !== '.htaccess') return { refs: [], ids: [] };
  const text = await readFile(file, 'utf8');
  const refs = [];
  const add = (raw, kind) => refs.push({ raw: raw.trim(), kind });
  if (extension === '.html') {
    for (const match of text.matchAll(HTML_ATTR_RE)) add(match[1], 'html-attribute');
    for (const match of text.matchAll(SRCSET_RE)) {
      for (const candidate of match[1].split(',').map((item) => item.trim().split(/\s+/)[0])) add(candidate, 'srcset');
    }
    for (const match of text.matchAll(CSS_URL_RE)) add(match[1], 'html-style-url');
  }
  if (extension === '.css') {
    for (const match of text.matchAll(CSS_URL_RE)) add(match[1], 'css-url');
    for (const match of text.matchAll(IMPORT_RE)) add(match[1], 'css-import');
  }
  if (extension === '.js' || extension === '.mjs') {
    for (const match of text.matchAll(JS_LITERAL_RE)) add(match[1], 'js-dynamic');
    for (const match of text.matchAll(JS_LOCAL_RE)) add(match[1], 'js-local-string');
  }
  const ids = [...text.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]);
  return { text, refs, ids };
}

const files = await walk(ROOT);
const sourceFiles = files.filter((file) => TEXT_EXTENSIONS.has(path.extname(file).toLowerCase()) || path.basename(file) === '.htaccess');
const references = [];
const pageIds = new Map();
const metadata = [];

for (const file of sourceFiles) {
  const inspected = await inspectFile(file);
  for (const ref of inspected.refs) references.push({ source: file, ...ref });
  if (path.extname(file).toLowerCase() === '.html') {
    pageIds.set(relative(file), new Set(inspected.ids));
    const canonical = [...inspected.text.matchAll(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/gi)].map((m) => m[1]);
    metadata.push({
      file: relative(file),
      title: (inspected.text.match(/<title\b/gi) || []).length,
      description: (inspected.text.match(/<meta[^>]+name=["']description["']/gi) || []).length,
      viewport: (inspected.text.match(/<meta[^>]+name=["']viewport["']/gi) || []).length,
      canonical,
      vercel: /vercel\.app/i.test(inspected.text),
    });
  }
}

const resolved = [];
for (const reference of references) {
  const result = await resolveReference(reference.source, reference.raw);
  if (result) resolved.push({ ...result, kind: reference.kind });
}

const anchorProblems = [];
for (const reference of references.filter((item) => item.kind === 'html-attribute' && item.raw.includes('#'))) {
  if (isExternal(reference.raw)) continue;
  const [pagePart, fragment] = reference.raw.split('#');
  if (!fragment) continue;
  const targetPage = pagePart ? path.resolve(path.dirname(reference.source), cleanReference(pagePart)) : reference.source;
  const key = relative(targetPage);
  if (!pageIds.has(key) || !pageIds.get(key).has(fragment)) anchorProblems.push({ source: relative(reference.source), raw: reference.raw, error: 'missing-fragment' });
}

const missing = resolved.filter((item) => item.error === 'missing');
const caseMismatches = resolved.filter((item) => item.error === 'case-mismatch');
const outsideRoot = resolved.filter((item) => item.error === 'outside-root');
const publicRefs = references.filter((item) => /(?:^|\/)public\//i.test(item.raw));
const duplicateBasenames = [];
const basenameMap = new Map();
for (const file of files.filter((item) => /\.(?:png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf)$/i.test(item))) {
  const key = path.basename(file).toLowerCase();
  const group = basenameMap.get(key) || [];
  group.push(relative(file));
  basenameMap.set(key, group);
}
for (const [basename, group] of basenameMap) if (group.length > 1) duplicateBasenames.push({ basename, files: group });

const hashes = new Map();
for (const file of files.filter((item) => /\.(?:png|jpe?g|gif|webp|avif|svg|ico)$/i.test(item))) {
  const hash = createHash('sha256').update(await readFile(file)).digest('hex');
  const group = hashes.get(hash) || [];
  group.push(relative(file));
  hashes.set(hash, group);
}
const duplicateContents = [...hashes.values()].filter((group) => group.length > 1);
const usedTargets = new Set(resolved.filter((item) => item.ok).map((item) => item.target));
const assetFiles = files.filter((item) => /\.(?:png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf)$/i.test(item));
const unusedAssets = assetFiles.map(relative).filter((item) => !usedTargets.has(item));

const extensionCounts = {};
for (const file of files) {
  const extension = path.extname(file).toLowerCase() || '[no extension]';
  extensionCounts[extension] = (extensionCounts[extension] || 0) + 1;
}

const report = {
  root: ROOT,
  inventory: { files: files.length, byExtension: extensionCounts },
  html: metadata,
  references: { scanned: references.length, missing, caseMismatches, outsideRoot, publicRefs },
  anchors: { problems: anchorProblems },
  assets: { duplicateBasenames, duplicateContents, unused: unusedAssets },
  status: missing.length || caseMismatches.length || outsideRoot.length || publicRefs.length || anchorProblems.length || metadata.some((item) => item.title !== 1 || item.description !== 1 || item.viewport !== 1 || item.canonical.length !== 1 || item.vercel) ? 'FAIL' : 'PASS',
};

console.log(JSON.stringify(report, null, 2));
