import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  GitPullRequest,
  Github,
} from 'lucide-react';
import { useState, type CSSProperties } from 'react';
import { chapters, nodeFor, skillGroups, type Chapter } from '../data/chapters';
import { deepDiveFor } from '../data/deepDives';
import type { GraphNode } from '../data/portfolioGraph';
import { DragonBall, starsLabel } from './DragonBall';

interface ChapterViewProps {
  chapter: Chapter;
  onBack: () => void;
  onOpen: (id: string) => void;
}

export function ChapterView({ chapter, onBack, onOpen }: ChapterViewProps) {
  const index = chapters.findIndex((c) => c.id === chapter.id);
  const prev = chapters[(index + chapters.length - 1) % chapters.length];
  const next = chapters[(index + 1) % chapters.length];

  return (
    <main className="chapter">
      <div className="chapter-glow" aria-hidden />
      <header className="chapter-bar">
        <button className="btn btn-ghost btn-sm" onClick={onBack}>
          <ArrowLeft size={14} /> Radar
        </button>
        <nav className="chapter-dots" aria-label="Chapters">
          {chapters.map((c) => (
            <button
              key={c.id}
              className={`chapter-dot${c.id === chapter.id ? ' current' : ''}`}
              onClick={() => onOpen(c.id)}
              aria-label={c.title}
              title={c.title}
            >
              <DragonBall stars={c.stars} size={18} />
            </button>
          ))}
        </nav>
        <button className="btn btn-ghost btn-sm" onClick={() => onOpen(next.id)}>
          {next.title} <ArrowRight size={14} />
        </button>
      </header>

      <section className="chapter-head">
        <DragonBall
          stars={chapter.stars}
          size={112}
          className="chapter-ball"
          style={{ viewTransitionName: `ball-${chapter.id}` } as CSSProperties}
        />
        <div>
          <p className="eyebrow">
            <span className="stars-mark">{starsLabel(chapter.stars)}</span> · {chapter.stars} of 7
          </p>
          <h2 className="chapter-title">{chapter.title}</h2>
          <p className="chapter-thesis">{chapter.thesis}</p>
          {chapter.aside && <p className="chapter-aside">{chapter.aside}</p>}
        </div>
      </section>

      <section className="stats">
        {chapter.stats.map((s) => (
          <div key={s.label} className="stat">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {chapter.layout === 'journey' ? (
        <Journey ids={chapter.items} onOpen={onOpen} />
      ) : chapter.items.length > 0 ? (
        <section className="cards">
          {chapter.items.map((id) => {
            const node = nodeFor(id);
            return node ? <ItemCard key={id} node={node} /> : null;
          })}
        </section>
      ) : null}

      {chapter.posts && (
        <section className="posts">
          {chapter.posts.map((p) => (
            <a key={p.href} className="post" href={p.href} target="_blank" rel="noreferrer">
              <div className="card-top">
                <span className="card-kicker">{p.date} · Python in Plain English</span>
                <ArrowUpRight size={15} className="post-arrow" />
              </div>
              <h3 className="card-title">{p.title}</h3>
              <p className="card-body">{p.blurb}</p>
              <div className="tags">
                {p.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </section>
      )}

      {chapter.links && (
        <section className="chapter-links">
          {chapter.links.map((l) => (
            <a key={l.href} className="btn btn-ghost" href={l.href} target="_blank" rel="noreferrer">
              {l.label} <ArrowUpRight size={13} />
            </a>
          ))}
        </section>
      )}

      <footer className="chapter-next">
        <button className="next-card" onClick={() => onOpen(prev.id)}>
          <span className="next-dir">
            <ArrowLeft size={14} /> Previous
          </span>
          <span className="next-row">
            <DragonBall stars={prev.stars} size={28} />
            {prev.title}
          </span>
        </button>
        <button className="next-card right" onClick={() => onOpen(next.id)}>
          <span className="next-dir">
            Next <ArrowRight size={14} />
          </span>
          <span className="next-row">
            {next.title}
            <DragonBall stars={next.stars} size={28} />
          </span>
        </button>
      </footer>
    </main>
  );
}

function ItemCard({ node }: { node: GraphNode }) {
  const [open, setOpen] = useState(false);
  const d = node.detail;

  if (d.kind === 'achievement') {
    return (
      <article className="card">
        <div className="card-kicker">{node.subtitle}</div>
        <h3 className="card-title">{d.title}</h3>
        <p className="card-body">{d.summary}</p>
      </article>
    );
  }
  if (d.kind !== 'project') return null;

  const dive = deepDiveFor(node.id);
  const prs = d.contributions ?? [];
  const expandable = Boolean(dive) || prs.length > 0;
  const merged = prs.filter((p) => p.status === 'merged').length;

  return (
    <article className={`card${open ? ' open' : ''}`}>
      <div className="card-top">
        <div className="card-kicker">{node.subtitle}</div>
        {d.url && (
          <a
            className="card-link"
            href={d.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`${d.name} on GitHub`}
          >
            <Github size={15} />
          </a>
        )}
      </div>
      <h3 className="card-title">{d.name}</h3>
      <p className="card-body">{d.summary}</p>
      <div className="tags">
        {d.tags.map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>

      {expandable && (
        <button className="card-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {prs.length > 0
            ? `${prs.length} pull request${prs.length > 1 ? 's' : ''}${merged ? ` · ${merged} merged` : ''}`
            : 'Deep dive'}
          <ChevronDown size={14} className="chev" />
        </button>
      )}

      {open && prs.length > 0 && (
        <ul className="prs">
          {prs.map((p) => (
            <li key={p.ref}>
              <a href={p.url} target="_blank" rel="noreferrer" className="pr-ref">
                <GitPullRequest size={12} /> {p.ref}
              </a>
              <span className={`pr-status ${p.status}`}>{p.status}</span>
              <span className="pr-summary">{p.summary}</span>
            </li>
          ))}
        </ul>
      )}

      {open && dive && (
        <div className="dive">
          <h4>Problem</h4>
          <p>{dive.problem}</p>
          <h4>Approach</h4>
          <p>{dive.approach}</p>
          <div className="dive-metrics">
            {dive.metrics.map((m) => (
              <div key={m.label}>
                <div className="stat-value small">{m.value}</div>
                <div className="stat-label">{m.label}</div>
              </div>
            ))}
          </div>
          <h4>Why it matters</h4>
          <p>{dive.whyItMatters}</p>
        </div>
      )}
    </article>
  );
}

function Journey({ ids, onOpen }: { ids: string[]; onOpen: (id: string) => void }) {
  const about = nodeFor('about');
  const body = about?.detail.kind === 'about' ? about.detail.body.slice(1, 3) : [];

  const steps = ids
    .map((id) => nodeFor(id))
    .filter((n): n is GraphNode => Boolean(n))
    .map((n) => {
      const d = n.detail;
      if (d.kind === 'education' || d.kind === 'experience') {
        return {
          id: n.id,
          when: d.start === d.end ? d.start : `${d.start} – ${d.end}`,
          title: d.kind === 'education' ? d.degree : d.role,
          org: d.org,
          logo: d.logo,
          summary: d.summary,
        };
      }
      if (d.kind === 'project') {
        return {
          id: n.id,
          when: 'Now',
          title: 'Co-founder',
          org: 'Human Slop',
          logo: '/images/HumanSlop_logo.jpg',
          summary: d.summary,
        };
      }
      return null;
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);

  return (
    <>
      <section className="journey">
        {body.map((p, i) => (
          <p key={i} className="journey-para">
            {p}
          </p>
        ))}
      </section>

      <ol className="timeline">
        {steps.map((s) => (
          <li key={s.id} className="timeline-item">
            <span className="timeline-when">{s.when}</span>
            <div className="timeline-card">
              <div className="timeline-head">
                {s.logo && <img src={s.logo} alt="" className="timeline-logo" />}
                <div>
                  <div className="card-title small">{s.title}</div>
                  <div className="card-kicker">{s.org}</div>
                </div>
              </div>
              <p className="card-body">{s.summary}</p>
            </div>
          </li>
        ))}
        <li className="timeline-item">
          <span className="timeline-when">Now</span>
          <button className="timeline-card as-link" onClick={() => onOpen('open-source')}>
            <div className="timeline-head">
              <DragonBall stars={1} size={36} />
              <div>
                <div className="card-title small">Shipping upstream</div>
                <div className="card-kicker">19 merged PRs · HFlow, ARGUS, NVIDIA, kornia</div>
              </div>
            </div>
          </button>
        </li>
      </ol>

      <section className="toolbox">
        <h3 className="section-title">Toolbox</h3>
        {skillGroups().map((g) => (
          <div key={g.name} className="toolbox-row">
            <span className="toolbox-name">{g.name}</span>
            <div className="tags">
              {g.items.map((it) => (
                <span key={it} className="tag">
                  {it}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
