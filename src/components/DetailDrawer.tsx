import {
  Award,
  BookOpen,
  ExternalLink,
  FileText,
  Github,
  Linkedin,
  Mail,
  Rocket,
  Star,
  Target,
  Trophy,
  Twitter,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { useEffect } from 'react';
import type { GraphNode, SocialLink } from '../data/portfolioGraph';
import type { AdjacencyIndex } from '../lib/graphQueries';
import './drawer.css';

interface DetailDrawerProps {
  node: GraphNode | null;
  adjacency: AdjacencyIndex;
  onClose: () => void;
  onNeighborSelect: (id: string) => void;
}

export function DetailDrawer({
  node,
  adjacency,
  onClose,
  onNeighborSelect,
}: DetailDrawerProps) {
  const open = node !== null;

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <div
        className={`drawer-backdrop${open ? ' open' : ''}`}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={`drawer${open ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={node?.label ?? 'Detail'}
      >
        {node && (
          <>
            <header className="drawer-head">
              <div>
                <div className="drawer-eyebrow">{node.kind}</div>
                <div className="drawer-title">{node.label}</div>
                {node.subtitle && <div className="drawer-subtitle">{node.subtitle}</div>}
              </div>
              <button className="drawer-close" onClick={onClose} aria-label="Close">
                <X size={16} />
              </button>
            </header>
            <div className="drawer-body scroll">
              <DrawerContent node={node} />
              <Neighbors
                node={node}
                adjacency={adjacency}
                onPick={onNeighborSelect}
              />
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function DrawerContent({ node }: { node: GraphNode }) {
  const d = node.detail;
  switch (d.kind) {
    case 'hub':
      return <HubBody detail={d} />;
    case 'about':
      return (
        <>
          {d.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </>
      );
    case 'experience':
      return (
        <>
          <div className="drawer-meta-row">
            {d.logo && <img src={d.logo} alt={d.org} />}
            <div>
              <div className="meta-title">{d.org}</div>
              <div className="meta-sub">
                {d.start} → {d.end}
                {d.location ? ` · ${d.location}` : ''}
              </div>
            </div>
          </div>
          <p>{d.summary}</p>
          <TagsBlock tags={node.tags ?? []} />
        </>
      );
    case 'education':
      return (
        <>
          <div className="drawer-meta-row">
            {d.logo && <img src={d.logo} alt={d.org} />}
            <div>
              <div className="meta-title">{d.org}</div>
              <div className="meta-sub">
                {d.start} → {d.end}
              </div>
            </div>
          </div>
          <p>{d.summary}</p>
        </>
      );
    case 'project':
      return (
        <>
          <p>{d.summary}</p>
          <TagsBlock tags={d.tags} />
          {d.url && (
            <div className="drawer-section">
              <a
                className="drawer-link"
                href={d.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Github size={14} /> Repository <ExternalLink size={12} />
              </a>
            </div>
          )}
        </>
      );
    case 'achievement': {
      const Icon = achievementIcon(d.icon);
      return (
        <div className="drawer-ach">
          <div className="ach-icon">
            <Icon size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{d.title}</div>
            <p style={{ marginTop: 6 }}>{d.summary}</p>
          </div>
        </div>
      );
    }
    case 'skills':
      return (
        <>
          {d.groups.map((g) => (
            <div key={g.name} className="drawer-skills-group">
              <h4>{g.name}</h4>
              <div className="drawer-tags">
                {g.items.map((it) => (
                  <span key={it} className="pill">
                    {it}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <p style={{ marginTop: 12, color: 'var(--text-tertiary)', fontSize: 12 }}>
            {d.totalCount} tracked skills
          </p>
        </>
      );
    case 'section':
      return <p>{d.intro ?? 'Explore the connected nodes around this section.'}</p>;
  }
}

function HubBody({ detail }: { detail: Extract<GraphNode['detail'], { kind: 'hub' }> }) {
  return (
    <>
      <p style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{detail.role}</p>
      <p>
        Browse the graph or use search (⌘K) to jump between work, education, projects,
        skills, and achievements. Each edge is a real relationship — what I worked on,
        what I used, what I shipped.
      </p>
      <div className="drawer-section">
        <div className="drawer-section-title">Reach me</div>
        <div className="drawer-socials">
          {detail.socials.map((s) => (
            <SocialButton key={s.label} social={s} />
          ))}
        </div>
      </div>
    </>
  );
}

function SocialButton({ social }: { social: SocialLink }) {
  const Icon = socialIcon(social.icon);
  return (
    <a
      className="drawer-link"
      href={social.href}
      target="_blank"
      rel="noreferrer noopener"
    >
      <Icon size={14} /> {social.label}
    </a>
  );
}

function TagsBlock({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <div className="drawer-section">
      <div className="drawer-section-title">Tags</div>
      <div className="drawer-tags">
        {tags.map((t) => (
          <span key={t} className="pill">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function Neighbors({
  node,
  adjacency,
  onPick,
}: {
  node: GraphNode;
  adjacency: AdjacencyIndex;
  onPick: (id: string) => void;
}) {
  const out = adjacency.outgoing.get(node.id) ?? [];
  const inc = adjacency.incoming.get(node.id) ?? [];
  const items = [
    ...out.map((e) => ({ id: e.target, rel: e.kind, label: e.label, dir: 'out' as const })),
    ...inc.map((e) => ({ id: e.source, rel: e.kind, label: e.label, dir: 'in' as const })),
  ];
  if (!items.length) return null;

  const seen = new Set<string>();
  const deduped = items.filter((it) => {
    const key = `${it.id}:${it.rel}:${it.dir}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <div className="drawer-section">
      <div className="drawer-section-title">Connected</div>
      <div className="drawer-neighbors">
        {deduped.map((it) => {
          const other = adjacency.byId.get(it.id);
          if (!other) return null;
          return (
            <button
              key={`${it.id}-${it.rel}-${it.dir}`}
              className="drawer-neighbor"
              onClick={() => onPick(it.id)}
            >
              <span>
                <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: 13 }}>
                  {other.label}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                  {other.subtitle}
                </div>
              </span>
              <span className="n-rel">
                {it.dir === 'out' ? '→' : '←'} {it.label ?? it.rel.toLowerCase().replace('_', ' ')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const socialIconMap: Record<SocialLink['icon'], LucideIcon> = {
  mail: Mail,
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  'file-text': FileText,
  globe: ExternalLink,
};

function socialIcon(name: SocialLink['icon']): LucideIcon {
  return socialIconMap[name];
}

const achievementIconMap: Record<string, LucideIcon> = {
  award: Award,
  target: Target,
  rocket: Rocket,
  zap: Zap,
  trophy: Trophy,
  'book-open': BookOpen,
  star: Star,
};

function achievementIcon(name: string): LucideIcon {
  return achievementIconMap[name] ?? Award;
}
