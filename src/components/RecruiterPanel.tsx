import {
  Cpu,
  ExternalLink,
  FileText,
  Github,
  LineChart,
  Mail,
  MessageSquareCode,
  Microscope,
  Rocket,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useMemo } from 'react';
import type { PersonaIcon } from '../data/personas';
import { computeRoleFits, headlineStats } from '../lib/recruiter';

const iconMap: Record<PersonaIcon, LucideIcon> = {
  cpu: Cpu,
  'message-square-code': MessageSquareCode,
  microscope: Microscope,
  rocket: Rocket,
  'line-chart': LineChart,
};

interface RecruiterPanelProps {
  open: boolean;
  onClose: () => void;
  onNodeSelect: (id: string) => void;
}

export function RecruiterPanel({ open, onClose, onNodeSelect }: RecruiterPanelProps) {
  const fits = useMemo(() => computeRoleFits(), []);
  const stats = useMemo(() => headlineStats(), []);
  const max = fits[0]?.score ?? 1;

  return (
    <aside
      className={`recruiter${open ? ' open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Recruiter mode — why hire me"
    >
      <div className="recruiter-head">
        <div>
          <div className="recruiter-eyebrow">Why hire me?</div>
          <div className="recruiter-title">Role fit, graph-derived</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 12.5, marginTop: 8 }}>
            Scores below are computed from real tag matches across the portfolio
            graph — not buzzwords. Tap evidence chips to inspect each node.
          </p>
        </div>
        <button className="drawer-close" onClick={onClose} aria-label="Close recruiter mode">
          <X size={16} />
        </button>
      </div>

      <div className="recruiter-stats">
        {stats.map((s) => (
          <div key={s.label} className="recruiter-stat">
            <div className="v">{s.value}</div>
            <div className="l">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="recruiter-body scroll">
        {fits.map(({ persona, score, evidence }) => {
          const Icon = iconMap[persona.icon];
          const pct = Math.round((score / max) * 100);
          return (
            <section key={persona.id} className="role-fit">
              <div className="role-fit-head">
                <div className="role-fit-title">
                  <Icon size={14} color="var(--accent)" />
                  {persona.label}
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-tertiary)' }}>
                  {pct}% fit
                </span>
              </div>
              <div className="role-fit-bar">
                <div className="role-fit-bar-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="role-fit-blurb">{persona.blurb}</div>
              <div className="role-fit-evidence">
                {evidence.map((n) => (
                  <button key={n.id} onClick={() => onNodeSelect(n.id)} title={n.subtitle}>
                    {n.label}
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <footer className="recruiter-cta">
        <a className="primary" href="mailto:varunr@iitbhilai.ac.in">
          <Mail size={14} /> Email
        </a>
        <a
          href="https://drive.google.com/drive/folders/1yrDlBg_SEmawLK0RP3oR8HcV_j27OmFu"
          target="_blank"
          rel="noreferrer noopener"
        >
          <FileText size={14} /> CV
        </a>
        <a href="https://github.com/VARUN3WARE" target="_blank" rel="noreferrer noopener">
          <Github size={14} /> GitHub <ExternalLink size={11} />
        </a>
      </footer>
    </aside>
  );
}
