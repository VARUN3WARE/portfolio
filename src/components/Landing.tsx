import { ArrowRight, ArrowUpRight, FileText, Github, Linkedin, Mail, Twitter } from 'lucide-react';
import type { CSSProperties } from 'react';
import { chapters, SOCIALS, type Chapter } from '../data/chapters';
import { DragonBall } from './DragonBall';

interface LandingProps {
  found: Set<string>;
  highlight: { label: string; ids: string[] } | null;
  onOpen: (id: string) => void;
  onColdRead: () => void;
  onClearHighlight: () => void;
  onSummon: () => void;
}

function radarPosition(c: Chapter): CSSProperties {
  const rad = (c.radar.angle * Math.PI) / 180;
  return {
    left: `${50 + Math.sin(rad) * c.radar.radius * 50}%`,
    top: `${50 - Math.cos(rad) * c.radar.radius * 50}%`,
  };
}

export function Landing({ found, highlight, onOpen, onColdRead, onClearHighlight, onSummon }: LandingProps) {
  const allFound = found.size === chapters.length;

  return (
    <main className="landing">
      <header className="topbar">
        <span className="wordmark">
          <span className="wordmark-dot" />
          varun rao
        </span>
        <nav className="topbar-links" aria-label="Elsewhere">
          <a href={SOCIALS.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <Github size={16} />
          </a>
          <a href={SOCIALS.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <Linkedin size={16} />
          </a>
          <a href={SOCIALS.x} target="_blank" rel="noreferrer" aria-label="X">
            <Twitter size={16} />
          </a>
          <a href="/classic.html" className="topbar-text">
            Classic view
          </a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-dot" /> AI/ML engineer · IIT Bhilai
          </p>
          <h1 className="hero-name">Varun Rao</h1>
          <p className="hero-tagline">I build AI systems that fail loudly, not silently.</p>
          <p className="hero-body">
            Agent reliability tooling, robotics data infrastructure, and ML systems that survive
            outside notebooks. Co-founder of Human Slop, with 19 merged PRs upstream across HFlow,
            ARGUS, NVIDIA and kornia.
          </p>
          <div className="hero-ctas">
            <a className="btn btn-primary" href={SOCIALS.email}>
              <Mail size={15} /> Let’s talk
            </a>
            <a className="btn btn-ghost" href={SOCIALS.cv} target="_blank" rel="noreferrer">
              <FileText size={15} /> CV <ArrowUpRight size={13} />
            </a>
            <span className="suit-up">suit up.</span>
          </div>
          <button className="cold-read-link" onClick={onColdRead}>
            Hiring? Let me cold-read your role <ArrowRight size={14} />
          </button>
        </div>

        <div className="radar-wrap">
          <div className={`radar${highlight ? ' radar--focus' : ''}`}>
            <svg className="radar-grid" viewBox="0 0 100 100" aria-hidden>
              <defs>
                <clipPath id="radar-clip">
                  <circle cx="50" cy="50" r="49.5" />
                </clipPath>
                <pattern id="radar-cells" width="8.333" height="8.333" patternUnits="userSpaceOnUse">
                  <path d="M 8.333 0 L 0 0 0 8.333" fill="none" />
                </pattern>
              </defs>
              <g clipPath="url(#radar-clip)">
                <rect width="100" height="100" fill="url(#radar-cells)" className="radar-cells" />
              </g>
              <circle cx="50" cy="50" r="49.5" className="radar-ring outer" />
              <circle cx="50" cy="50" r="33" className="radar-ring" />
              <circle cx="50" cy="50" r="16.5" className="radar-ring" />
              <path d="M50 46.6 L52.6 52.4 L50 51.2 L47.4 52.4 Z" className="radar-you" />
            </svg>
            <div className="radar-sweep" aria-hidden />

            {chapters.map((c, i) => {
              const lit = highlight?.ids.includes(c.id);
              return (
                <button
                  key={c.id}
                  className={`blip${found.has(c.id) ? ' found' : ''}${lit ? ' lit' : ''}`}
                  style={{ ...radarPosition(c), '--i': i } as CSSProperties}
                  onClick={() => onOpen(c.id)}
                  aria-label={`${c.stars}-star ball: ${c.title}`}
                >
                  <DragonBall
                    stars={c.stars}
                    size={c.stars === 4 ? 70 : 60}
                    style={{ viewTransitionName: `ball-${c.id}` } as CSSProperties}
                  />
                  <span className="blip-label">
                    <span className="blip-title">{c.title}</span>
                    <span className="blip-kicker">{c.kicker}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="radar-footer">
            {highlight ? (
              <span>
                Lit up for <strong>{highlight.label}</strong> roles ·{' '}
                <button className="text-btn" onClick={onClearHighlight}>
                  clear
                </button>
              </span>
            ) : (
              <span>Tap a ball to open a chapter</span>
            )}
            <span className="radar-count">
              {allFound ? (
                <button className="text-btn gold" onClick={onSummon}>
                  7 of 7 found · summon again
                </button>
              ) : (
                <>
                  {found.size} of 7 found
                  <span className="radar-pips" aria-hidden>
                    {chapters.map((c) => (
                      <i key={c.id} className={found.has(c.id) ? 'on' : ''} />
                    ))}
                  </span>
                </>
              )}
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
