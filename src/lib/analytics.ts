/**
 * Lightweight graph analytics for the HUD widget. Pure functions over the
 * static node/edge data; results are cached at module load.
 */

import {
  edges as allEdges,
  nodes as allNodes,
  type GraphNode,
  type NodeKind,
} from '../data/portfolioGraph';

export interface GraphHealth {
  nodes: number;
  edges: number;
  tags: number;
  byKind: Array<{ kind: NodeKind; count: number }>;
  topTags: Array<{ tag: string; count: number }>;
  clusters: number;
}

function countByKind(nodes: GraphNode[]): Array<{ kind: NodeKind; count: number }> {
  const tally = new Map<NodeKind, number>();
  for (const n of nodes) tally.set(n.kind, (tally.get(n.kind) ?? 0) + 1);
  return [...tally.entries()]
    .map(([kind, count]) => ({ kind, count }))
    .sort((a, b) => b.count - a.count);
}

function countTags(nodes: GraphNode[]): Map<string, number> {
  const tally = new Map<string, number>();
  for (const n of nodes) for (const t of n.tags ?? []) tally.set(t, (tally.get(t) ?? 0) + 1);
  return tally;
}

function connectedComponents(): number {
  const adj = new Map<string, Set<string>>();
  for (const n of allNodes) adj.set(n.id, new Set());
  for (const e of allEdges) {
    adj.get(e.source)?.add(e.target);
    adj.get(e.target)?.add(e.source);
  }
  const visited = new Set<string>();
  let count = 0;
  for (const start of adj.keys()) {
    if (visited.has(start)) continue;
    count += 1;
    const stack = [start];
    while (stack.length) {
      const id = stack.pop()!;
      if (visited.has(id)) continue;
      visited.add(id);
      for (const n of adj.get(id) ?? []) if (!visited.has(n)) stack.push(n);
    }
  }
  return count;
}

let _cache: GraphHealth | null = null;

export function graphHealth(): GraphHealth {
  if (_cache) return _cache;
  const tagTally = countTags(allNodes);
  _cache = {
    nodes: allNodes.length,
    edges: allEdges.length,
    tags: tagTally.size,
    byKind: countByKind(allNodes),
    topTags: [...tagTally.entries()]
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6),
    clusters: connectedComponents(),
  };
  return _cache;
}
