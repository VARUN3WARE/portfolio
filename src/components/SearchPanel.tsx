import {
  ArrowRight,
  Briefcase,
  Cpu,
  LineChart,
  MessageSquareCode,
  Microscope,
  Play,
  Rocket,
  Search,
  Sparkles,
  Target,
  type LucideIcon,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Persona, PersonaIcon } from '../data/personas';
import { semanticSearch } from '../lib/embeddings';
import { search, type SearchHit } from '../lib/graphQueries';
import { detectIntent, suggestions, type Intent } from '../lib/intent';
import {
  nodes as allNodes,
  type GraphNode,
} from '../data/portfolioGraph';

const personaIconMap: Record<PersonaIcon, LucideIcon> = {
  cpu: Cpu,
  'message-square-code': MessageSquareCode,
  microscope: Microscope,
  rocket: Rocket,
  'line-chart': LineChart,
};

export interface CommandActions {
  openNode: (id: string) => void;
  activatePersona: (persona: Persona) => void;
  startStory: (storyId: string) => void;
  openRecruiter: () => void;
  goHome: () => void;
}

interface SearchPanelProps {
  actions: CommandActions;
}

type Row =
  | { kind: 'intent'; intent: Intent; label: string; description: string; icon: LucideIcon }
  | { kind: 'node'; node: GraphNode; score: number; reason: string };

export function SearchPanel({ actions }: SearchPanelProps) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const rows: Row[] = useMemo(() => buildRows(query), [query]);
  const compact = !query.trim();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        setOpen(true);
      }
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const reset = useCallback(() => {
    setQuery('');
    setActive(0);
    setOpen(false);
    inputRef.current?.blur();
  }, []);

  const closePalette = useCallback(() => {
    setOpen(false);
    setActive(0);
  }, []);

  const run = useCallback(
    (row: Row) => {
      if (row.kind === 'node') {
        actions.openNode(row.node.id);
        reset();
        return;
      }
      executeIntent(row.intent, actions);
      reset();
    },
    [actions, reset],
  );

  const showDropdown = open && rows.length > 0;

  return (
    <div className="search-wrap" ref={wrapRef}>
      <div className="search-box">
        <Search size={14} color="var(--text-tertiary)" />
        <input
          ref={inputRef}
          type="search"
          placeholder="Search graph… ⌘K"
          value={query}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            window.setTimeout(() => {
              if (!wrapRef.current?.contains(document.activeElement)) {
                closePalette();
              }
            }, 120);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              reset();
              return;
            }
            if (!rows.length) return;
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActive((a) => Math.min(rows.length - 1, a + 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((a) => Math.max(0, a - 1));
            } else if (e.key === 'Enter') {
              e.preventDefault();
              run(rows[active]);
            }
          }}
          spellCheck={false}
          aria-label="Command palette"
        />
        <span className="search-kbd">⌘K</span>
      </div>
      {showDropdown && (
        <div
          className={`search-results scroll${compact ? ' search-results--compact' : ''}`}
          role="listbox"
        >
          <RowGroups
            rows={rows}
            active={active}
            setActive={setActive}
            run={run}
            compact={compact}
          />
        </div>
      )}
    </div>
  );
}

function RowGroups({
  rows,
  active,
  setActive,
  run,
  compact,
}: {
  rows: Row[];
  active: number;
  setActive: (i: number) => void;
  run: (row: Row) => void;
  compact: boolean;
}) {
  const actions = rows.filter((r) => r.kind === 'intent') as Extract<Row, { kind: 'intent' }>[];
  const nodes = rows.filter((r) => r.kind === 'node') as Extract<Row, { kind: 'node' }>[];

  let i = 0;
  return (
    <>
      {actions.length > 0 && (
        <>
          {!compact && <div className="cp-section">Actions</div>}
          {actions.map((row) => {
            const idx = i++;
            return (
              <button
                key={`a-${idx}`}
                role="option"
                aria-selected={idx === active}
                className={`cp-action${idx === active ? ' active' : ''}${compact ? ' cp-action--compact' : ''}`}
                title={compact ? row.description : undefined}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActive(idx)}
                onClick={() => run(row)}
              >
                <span className="cp-icon">
                  <row.icon size={compact ? 12 : 14} />
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <div className="cp-action-title">{row.label}</div>
                  {!compact && (
                    <div className="cp-action-desc">{row.description}</div>
                  )}
                </span>
                <ArrowRight size={14} color="var(--text-tertiary)" />
              </button>
            );
          })}
        </>
      )}
      {nodes.length > 0 && (
        <>
          {!compact && <div className="cp-section">Nodes</div>}
          {nodes.map((row) => {
            const idx = i++;
            return (
              <button
                key={`n-${idx}`}
                role="option"
                aria-selected={idx === active}
                className={`search-hit${idx === active ? ' active' : ''}${compact ? ' search-hit--compact' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActive(idx)}
                onClick={() => run(row)}
              >
                <span style={{ minWidth: 0 }}>
                  <div className="search-hit-title">{row.node.label}</div>
                  {!compact && row.node.subtitle && (
                    <div className="search-hit-sub">{row.node.subtitle}</div>
                  )}
                </span>
                <span className="cp-score">{row.reason}</span>
              </button>
            );
          })}
        </>
      )}
    </>
  );
}

function buildRows(query: string): Row[] {
  if (!query.trim()) {
    return suggestions().map<Row>((s) => ({
      kind: 'intent',
      intent: s.intent,
      label: s.label,
      description: s.description,
      icon: iconForIntent(s.intent),
    }));
  }

  const rows: Row[] = [];
  const intent = detectIntent(query);
  if (intent.kind !== 'semantic') {
    rows.push({
      kind: 'intent',
      intent,
      label: intentLabel(intent),
      description: intentDescription(intent),
      icon: iconForIntent(intent),
    });
  }

  const semantic = semanticSearch(query, 6, 0.07);
  const lexical = search(query);

  const seen = new Set<string>();
  for (const hit of lexical) {
    if (seen.has(hit.node.id)) continue;
    seen.add(hit.node.id);
    rows.push({ kind: 'node', node: hit.node, score: hit.score, reason: hit.reason });
  }
  for (const v of semantic) {
    if (seen.has(v.id)) continue;
    const node = allNodes.find((n) => n.id === v.id);
    if (!node) continue;
    seen.add(node.id);
    rows.push({
      kind: 'node',
      node,
      score: v.score,
      reason: `~${Math.round(v.score * 100)}%`,
    });
  }
  return rows.slice(0, 16);
}

function iconForIntent(intent: Intent): LucideIcon {
  switch (intent.kind) {
    case 'recruiter':
      return Target;
    case 'story':
      return Play;
    case 'persona':
      return personaIconMap[intent.persona.icon];
    case 'open':
      return Briefcase;
    case 'home':
      return Sparkles;
    case 'semantic':
      return Search;
  }
}

function intentLabel(intent: Intent): string {
  switch (intent.kind) {
    case 'recruiter':
      return 'Why hire me?';
    case 'story':
      return `Play "${intent.story.label}"`;
    case 'persona':
      return intent.persona.label;
    case 'home':
      return 'Recenter graph';
    case 'open':
      return `Open ${intent.label}`;
    case 'semantic':
      return 'Semantic search';
  }
}

function intentDescription(intent: Intent): string {
  switch (intent.kind) {
    case 'recruiter':
      return 'Role-fit summary from the graph.';
    case 'story':
      return intent.story.blurb;
    case 'persona':
      return intent.persona.blurb;
    case 'home':
      return 'Clear focus, fit the whole graph back.';
    case 'open':
      return 'Jump to and inspect this node.';
    case 'semantic':
      return 'Vector similarity over node summaries.';
  }
}

function executeIntent(intent: Intent, actions: CommandActions): void {
  switch (intent.kind) {
    case 'home':
      actions.goHome();
      return;
    case 'recruiter':
      actions.openRecruiter();
      return;
    case 'persona':
      actions.activatePersona(intent.persona);
      return;
    case 'story':
      actions.startStory(intent.story.id);
      return;
    case 'open':
      actions.openNode(intent.nodeId);
      return;
    case 'semantic': {
      const hits = semanticSearch(intent.query, 1, 0.05);
      if (hits[0]) actions.openNode(hits[0].id);
      return;
    }
  }
}

export type { SearchHit };
