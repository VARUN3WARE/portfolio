import { ArrowRight, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { chapterById, PERSONA_CHAPTERS } from '../data/chapters';
import { personas, type Persona } from '../data/personas';
import { computeRoleFits } from '../lib/recruiter';
import { DragonBall } from './DragonBall';

interface ColdReadProps {
  open: boolean;
  onClose: () => void;
  onOpenChapter: (id: string) => void;
  onHighlight: (label: string, ids: string[]) => void;
}

const READS: Record<string, string> = {
  'ai-infra':
    'You’re losing sleep over GPU bills and p99 latency. You want someone who reads the CUDA, not just the docs.',
  'llm-systems':
    'Your agents work in the demo and drift in production. You need someone who builds the evals before the features.',
  research:
    'You have a paper’s worth of ideas and a notebook’s worth of code. You need someone who turns the first into a library.',
  startup:
    'You need someone who can ship the whole thing, talk to users, and still care about the edge cases at 2am.',
  'data-science':
    'Your models look great offline. You want someone who has been humbled by a hidden test set, more than once.',
  'open-source':
    'You care how people behave in codebases they don’t own. You want proof that strangers merge their work.',
};

export function ColdRead({ open, onClose, onOpenChapter, onHighlight }: ColdReadProps) {
  const [pick, setPick] = useState<Persona | null>(null);
  const fits = useMemo(() => computeRoleFits(), []);

  useEffect(() => {
    if (!open) setPick(null);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const fit = pick ? fits.find((f) => f.persona.id === pick.id) : null;
  const targets = pick ? (PERSONA_CHAPTERS[pick.id] ?? []).map(chapterById).filter(Boolean) : [];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Cold read"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>

        {!pick ? (
          <>
            <p className="eyebrow">Cold read</p>
            <h3 className="modal-title">Let me guess what you’re hiring for.</h3>
            <p className="modal-sub">Pick the closest one. I’ll tell you exactly where to look.</p>
            <div className="persona-grid">
              {personas.map((p) => (
                <button key={p.id} className="persona-option" onClick={() => setPick(p)}>
                  <span className="persona-name">{p.label}</span>
                  <ArrowRight size={14} />
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="eyebrow">Cold read · {pick.label}</p>
            <p className="modal-read">{READS[pick.id] ?? pick.blurb}</p>
            {fit && fit.evidence.length > 0 && (
              <div className="evidence">
                <span className="stat-label">The evidence</span>
                <div className="tags">
                  {fit.evidence.map((n) => (
                    <span key={n.id} className="tag">
                      {n.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="modal-actions">
              {targets.map(
                (c) =>
                  c && (
                    <button key={c.id} className="btn btn-ghost" onClick={() => onOpenChapter(c.id)}>
                      <DragonBall stars={c.stars} size={20} /> {c.title}
                    </button>
                  ),
              )}
            </div>
            <div className="modal-foot">
              <button className="text-btn" onClick={() => setPick(null)}>
                Wrong guess? Try again
              </button>
              <button
                className="text-btn gold"
                onClick={() => {
                  onHighlight(pick.label, PERSONA_CHAPTERS[pick.id] ?? []);
                  onClose();
                }}
              >
                Light them up on the radar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
