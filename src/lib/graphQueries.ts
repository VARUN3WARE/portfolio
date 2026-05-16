import type { Persona } from '../data/personas';
import {
  edges as allEdges,
  nodes as allNodes,
  type GraphEdge,
  type GraphNode,
  type NodeKind,
} from '../data/portfolioGraph';

export interface AdjacencyIndex {
  byId: Map<string, GraphNode>;
  outgoing: Map<string, GraphEdge[]>;
  incoming: Map<string, GraphEdge[]>;
}

export function buildAdjacency(
  nodes: GraphNode[] = allNodes,
  edges: GraphEdge[] = allEdges,
): AdjacencyIndex {
  const byId = new Map<string, GraphNode>();
  const outgoing = new Map<string, GraphEdge[]>();
  const incoming = new Map<string, GraphEdge[]>();

  for (const n of nodes) byId.set(n.id, n);

  for (const e of edges) {
    if (!outgoing.has(e.source)) outgoing.set(e.source, []);
    if (!incoming.has(e.target)) incoming.set(e.target, []);
    outgoing.get(e.source)!.push(e);
    incoming.get(e.target)!.push(e);
  }

  return { byId, outgoing, incoming };
}

export function neighbors(id: string, idx: AdjacencyIndex): GraphNode[] {
  const out = idx.outgoing.get(id) ?? [];
  const inc = idx.incoming.get(id) ?? [];
  const ids = new Set<string>();
  for (const e of out) ids.add(e.target);
  for (const e of inc) ids.add(e.source);
  return [...ids].map((nid) => idx.byId.get(nid)!).filter(Boolean);
}

export function subgraph(
  rootId: string,
  depth: number,
  idx: AdjacencyIndex,
): { nodes: Set<string>; edges: Set<string> } {
  const nodes = new Set<string>([rootId]);
  const edges = new Set<string>();
  let frontier = [rootId];

  for (let d = 0; d < depth; d += 1) {
    const next: string[] = [];
    for (const id of frontier) {
      for (const e of idx.outgoing.get(id) ?? []) {
        edges.add(e.id);
        if (!nodes.has(e.target)) {
          nodes.add(e.target);
          next.push(e.target);
        }
      }
      for (const e of idx.incoming.get(id) ?? []) {
        edges.add(e.id);
        if (!nodes.has(e.source)) {
          nodes.add(e.source);
          next.push(e.source);
        }
      }
    }
    frontier = next;
    if (!frontier.length) break;
  }

  return { nodes, edges };
}

export function nodesByTag(tag: string, nodes: GraphNode[] = allNodes): GraphNode[] {
  const t = tag.toLowerCase();
  return nodes.filter((n) => (n.tags ?? []).some((x) => x.toLowerCase() === t));
}

export function nodesByKind(
  kind: NodeKind,
  nodes: GraphNode[] = allNodes,
): GraphNode[] {
  return nodes.filter((n) => n.kind === kind);
}

/**
 * Build the highlight set for a persona: all pinned nodes plus any node
 * whose tags match the persona's tag list (case-insensitive). The edges
 * that lie entirely inside that set are also returned so the canvas can
 * keep just the internal relationships lit.
 */
export function personaSubgraph(
  persona: Persona,
  idx: AdjacencyIndex,
): { nodes: Set<string>; edges: Set<string> } {
  const tagSet = new Set(persona.tags.map((t) => t.toLowerCase()));
  const nodeIds = new Set<string>(persona.pinned);
  for (const node of idx.byId.values()) {
    if (nodeIds.has(node.id)) continue;
    const tags = (node.tags ?? []).map((t) => t.toLowerCase());
    if (tags.some((t) => tagSet.has(t))) nodeIds.add(node.id);
  }
  // Always anchor on hub so the lens looks like a connected sub-story.
  nodeIds.add('hub');
  const edgeIds = new Set<string>();
  for (const [src, list] of idx.outgoing) {
    if (!nodeIds.has(src)) continue;
    for (const e of list) if (nodeIds.has(e.target)) edgeIds.add(e.id);
  }
  return { nodes: nodeIds, edges: edgeIds };
}

export interface SearchHit {
  node: GraphNode;
  score: number;
  reason: string;
}

/** Lightweight fuzzy-ish search across label, subtitle, and tags. */
export function search(query: string, nodes: GraphNode[] = allNodes): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits: SearchHit[] = [];

  for (const node of nodes) {
    const haystack = [
      node.label,
      node.subtitle ?? '',
      ...(node.tags ?? []),
      summarise(node),
    ]
      .join(' \u0001 ')
      .toLowerCase();

    if (!haystack.includes(q)) continue;

    let score = 0;
    let reason = 'match';
    if (node.label.toLowerCase().includes(q)) {
      score += 5;
      reason = 'name';
    }
    if ((node.subtitle ?? '').toLowerCase().includes(q)) {
      score += 2;
      reason = reason === 'name' ? reason : 'subtitle';
    }
    if ((node.tags ?? []).some((t) => t.toLowerCase().includes(q))) {
      score += 3;
      reason = reason === 'name' ? reason : 'tag';
    }
    if (!score) score = 1;
    hits.push({ node, score, reason });
  }

  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, 12);
}

export function allTags(nodes: GraphNode[] = allNodes): string[] {
  const set = new Set<string>();
  for (const n of nodes) for (const t of n.tags ?? []) set.add(t);
  return [...set].sort((a, b) => a.localeCompare(b));
}

function summarise(node: GraphNode): string {
  const d = node.detail;
  switch (d.kind) {
    case 'about':
      return d.body.join(' ');
    case 'experience':
      return `${d.role} ${d.org} ${d.summary}`;
    case 'education':
      return `${d.degree} ${d.org} ${d.summary}`;
    case 'project':
      return `${d.name} ${d.summary} ${d.tags.join(' ')}`;
    case 'achievement':
      return `${d.title} ${d.summary}`;
    case 'skills':
      return d.groups.flatMap((g) => [g.name, ...g.items]).join(' ');
    case 'hub':
      return `${d.name} ${d.role}`;
    default:
      return '';
  }
}
