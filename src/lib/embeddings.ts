/**
 * Tiny TF-IDF vector store over portfolio nodes. The corpus is small (~30
 * docs) so we keep the index entirely in memory and build it once on first
 * query. Cosine similarity gives a usable "semantic" feel without shipping
 * a real embedding model.
 *
 * The `embedding?: number[]` field on GraphNode is reserved for a future
 * upgrade to real sentence-transformer vectors; the API surface stays the
 * same so swapping is a one-file change.
 */

import { deepDives } from '../data/deepDives';
import { nodes as allNodes, type GraphNode } from '../data/portfolioGraph';

const STOPWORDS = new Set([
  'a','an','and','are','as','at','be','by','for','from','has','have','he','i','in','is','it','its','of','on','or','that','the','to','was','were','will','with','this','these','those','his','her','their','my','our','your','you','they','them','we','us','via','into','over','under','about','across','using','used','use','built','build','make','made','model','models','data','team','system','systems','also','more','than','then','if','out','up','down','off','no','not','so','do','does','did','can','could','would','should','i\'m','i\'ve','ive','it\'s','its','vs','etc','really','very','some','any','all','only','just','first','new','time'
]);

type Vec = Map<string, number>;

interface Index {
  vectors: Map<string, Vec>;
  idf: Map<string, number>;
  norms: Map<string, number>;
}

let _index: Index | null = null;

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[`'"’]/g, '')
    .replace(/[^a-z0-9+#\-\s]/g, ' ')
    .split(/\s+/)
    .map((t) => t.replace(/^-+|-+$/g, ''))
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
}

function nodeText(node: GraphNode): string {
  const d = node.detail;
  const base = [node.label, node.subtitle ?? '', ...(node.tags ?? [])].join(' ');
  let body = '';
  switch (d.kind) {
    case 'about':
      body = d.body.join(' ');
      break;
    case 'experience':
      body = `${d.role} ${d.org} ${d.summary} ${d.location ?? ''}`;
      break;
    case 'education':
      body = `${d.degree} ${d.org} ${d.summary}`;
      break;
    case 'project':
      body = `${d.name} ${d.summary} ${d.tags.join(' ')}`;
      break;
    case 'achievement':
      body = `${d.title} ${d.summary}`;
      break;
    case 'skills':
      body = d.groups.flatMap((g) => [g.name, ...g.items]).join(' ');
      break;
    case 'hub':
      body = `${d.name} ${d.role}`;
      break;
    case 'section':
      body = d.intro ?? '';
      break;
  }
  const dive = deepDives[node.id];
  const diveText = dive
    ? `${dive.problem} ${dive.approach} ${dive.stack.join(' ')} ${dive.whyItMatters}`
    : '';
  return `${base} ${body} ${diveText}`;
}

function buildIndex(): Index {
  const docs = new Map<string, string[]>();
  const df = new Map<string, number>();

  for (const node of allNodes) {
    const terms = tokenize(nodeText(node));
    docs.set(node.id, terms);
    const seen = new Set<string>();
    for (const t of terms) {
      if (!seen.has(t)) {
        seen.add(t);
        df.set(t, (df.get(t) ?? 0) + 1);
      }
    }
  }

  const N = docs.size;
  const idf = new Map<string, number>();
  for (const [t, n] of df) {
    idf.set(t, Math.log((N + 1) / (n + 1)) + 1);
  }

  const vectors = new Map<string, Vec>();
  const norms = new Map<string, number>();

  for (const [id, terms] of docs) {
    const tf = new Map<string, number>();
    for (const t of terms) tf.set(t, (tf.get(t) ?? 0) + 1);
    const vec: Vec = new Map();
    let norm = 0;
    for (const [t, count] of tf) {
      const w = (count / terms.length) * (idf.get(t) ?? 0);
      vec.set(t, w);
      norm += w * w;
    }
    vectors.set(id, vec);
    norms.set(id, Math.sqrt(norm));
  }

  return { vectors, idf, norms };
}

function getIndex(): Index {
  if (!_index) _index = buildIndex();
  return _index;
}

export interface VectorHit {
  id: string;
  score: number;
}

export function semanticSearch(query: string, k = 8, minScore = 0.05): VectorHit[] {
  const idx = getIndex();
  const terms = tokenize(query);
  if (!terms.length) return [];

  const tf = new Map<string, number>();
  for (const t of terms) tf.set(t, (tf.get(t) ?? 0) + 1);

  const qVec: Vec = new Map();
  let qNorm = 0;
  for (const [t, count] of tf) {
    const w = (count / terms.length) * (idx.idf.get(t) ?? 0);
    qVec.set(t, w);
    qNorm += w * w;
  }
  qNorm = Math.sqrt(qNorm);
  if (qNorm === 0) return [];

  const out: VectorHit[] = [];
  for (const [id, vec] of idx.vectors) {
    let dot = 0;
    for (const [t, qw] of qVec) {
      const nw = vec.get(t);
      if (nw) dot += qw * nw;
    }
    const norm = idx.norms.get(id) ?? 0;
    if (norm === 0) continue;
    const sim = dot / (qNorm * norm);
    if (sim >= minScore) out.push({ id, score: sim });
  }
  out.sort((a, b) => b.score - a.score);
  return out.slice(0, k);
}

/** Eagerly warm the index — call at app start to avoid first-search jank. */
export function warmEmbeddings(): void {
  getIndex();
}

/**
 * Returns the top K nodes most similar to the target node based on content.
 * Filters out the source node itself.
 */
export function findSimilarNodes(nodeId: string, k = 3): VectorHit[] {
  const idx = getIndex();
  const sourceVec = idx.vectors.get(nodeId);
  const sourceNorm = idx.norms.get(nodeId);
  if (!sourceVec || !sourceNorm || sourceNorm === 0) return [];

  const out: VectorHit[] = [];
  for (const [id, vec] of idx.vectors) {
    if (id === nodeId) continue;

    let dot = 0;
    for (const [t, sw] of sourceVec) {
      const nw = vec.get(t);
      if (nw) dot += sw * nw;
    }
    const norm = idx.norms.get(id) ?? 0;
    if (norm === 0) continue;

    const sim = dot / (sourceNorm * norm);
    // Project/Experience/Achievement kinds tend to have higher similarity.
    if (sim > 0.05) out.push({ id, score: sim });
  }

  out.sort((a, b) => b.score - a.score);
  return out.slice(0, k);
}
