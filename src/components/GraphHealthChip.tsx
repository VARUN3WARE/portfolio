import { useMemo } from 'react';
import { graphHealth } from '../lib/analytics';

export function GraphHealthChip() {
  const stats = useMemo(() => graphHealth(), []);
  const projects = stats.byKind.find((k) => k.kind === 'project')?.count ?? 0;

  return (
    <div className="health-chip" aria-label="Graph statistics" role="status">
      <Stat value={stats.nodes} label="nodes" />
      <span className="health-divider" />
      <Stat value={stats.edges} label="edges" />
      <span className="health-divider" />
      <Stat value={projects} label="projects" />
      <span className="health-divider" />
      <Stat value={stats.tags} label="tags" />
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <span className="health-stat">
      <span className="health-value">{value}</span>
      <span className="health-label">{label}</span>
    </span>
  );
}
