/**
 * Recruiter Mode scoring. For each persona we count tag matches across
 * graph nodes, then surface the top evidence nodes per role. Deterministic,
 * graph-only — no LLM, no buzzwords.
 */

import { personas, type Persona } from '../data/personas';
import { nodes as allNodes, type GraphNode } from '../data/portfolioGraph';

export interface RoleFit {
  persona: Persona;
  score: number;
  evidence: GraphNode[];
}

function scoreNodeForPersona(node: GraphNode, persona: Persona): number {
  if (persona.pinned.includes(node.id)) return 4;
  const tags = new Set((node.tags ?? []).map((t) => t.toLowerCase()));
  let hits = 0;
  for (const t of persona.tags) if (tags.has(t.toLowerCase())) hits += 1;
  if (hits === 0) return 0;
  // Project nodes carry more weight than section nodes.
  const kindBoost =
    node.kind === 'project' || node.kind === 'experience' || node.kind === 'achievement'
      ? 1.2
      : 0.6;
  return hits * kindBoost;
}

export function computeRoleFits(): RoleFit[] {
  const results: RoleFit[] = personas.map((persona) => {
    const scored = allNodes
      .map((n) => ({ node: n, s: scoreNodeForPersona(n, persona) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s);
    const score = scored.reduce((acc, x) => acc + x.s, 0);
    const evidence = scored.slice(0, 4).map((x) => x.node);
    return { persona, score, evidence };
  });
  results.sort((a, b) => b.score - a.score);
  return results;
}

export interface HeadlineStat {
  label: string;
  value: string;
}

/** Coarse stats for the recruiter panel header. */
export function headlineStats(): HeadlineStat[] {
  const projects = allNodes.filter((n) => n.kind === 'project').length;
  const experiences = allNodes.filter((n) => n.kind === 'experience').length;
  const achievements = allNodes.filter((n) => n.kind === 'achievement').length;
  const tags = new Set<string>();
  for (const n of allNodes) for (const t of n.tags ?? []) tags.add(t);
  return [
    { label: 'Projects', value: String(projects) },
    { label: 'Roles', value: String(experiences) },
    { label: 'Awards', value: String(achievements) },
    { label: 'Tags', value: String(tags.size) },
  ];
}
