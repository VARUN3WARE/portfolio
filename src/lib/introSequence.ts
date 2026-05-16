import { edges, nodes } from '../data/portfolioGraph';

/** BFS reveal order from the hub — nodes then connecting edges per wave. */
export function buildIntroRevealOrder(hubId = 'hub'): {
  waves: Array<{ nodeIds: string[]; edgeIds: string[] }>;
  allNodeIds: string[];
  allEdgeIds: string[];
} {
  const adj = new Map<string, string[]>();
  const edgeByPair = new Map<string, string>();

  for (const e of edges) {
    if (!adj.has(e.source)) adj.set(e.source, []);
    if (!adj.has(e.target)) adj.set(e.target, []);
    adj.get(e.source)!.push(e.target);
    adj.get(e.target)!.push(e.source);
    edgeByPair.set(`${e.source}|${e.target}`, e.id);
    edgeByPair.set(`${e.target}|${e.source}`, e.id);
  }

  const visited = new Set<string>([hubId]);
  const waves: Array<{ nodeIds: string[]; edgeIds: string[] }> = [
    { nodeIds: [hubId], edgeIds: [] },
  ];

  let frontier = [hubId];
  while (frontier.length) {
    const nextFrontier: string[] = [];
    const nodeIds: string[] = [];
    const edgeIds: string[] = [];

    for (const id of frontier) {
      for (const nb of adj.get(id) ?? []) {
        const eid = edgeByPair.get(`${id}|${nb}`);
        if (eid && !waves.some((w) => w.edgeIds.includes(eid))) {
          edgeIds.push(eid);
        }
        if (!visited.has(nb)) {
          visited.add(nb);
          nodeIds.push(nb);
          nextFrontier.push(nb);
        }
      }
    }

    if (nodeIds.length) {
      waves.push({ nodeIds, edgeIds });
    }
    frontier = nextFrontier;
  }

  // Any disconnected nodes (shouldn't happen) append last
  const missing = nodes.map((n) => n.id).filter((id) => !visited.has(id));
  if (missing.length) {
    waves.push({ nodeIds: missing, edgeIds: [] });
  }

  const allNodeIds = waves.flatMap((w) => w.nodeIds);
  const allEdgeIds = [...new Set(waves.flatMap((w) => w.edgeIds))];
  return { waves, allNodeIds, allEdgeIds };
}

export function shouldSkipIntro(): boolean {
  if (typeof window === 'undefined') return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  try {
    return sessionStorage.getItem('portfolio-intro-done') === '1';
  } catch {
    return false;
  }
}

export function markIntroDone(): void {
  try {
    sessionStorage.setItem('portfolio-intro-done', '1');
  } catch {
    /* ignore */
  }
}
