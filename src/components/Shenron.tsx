import { FileText, Linkedin, Mail, X } from 'lucide-react';
import { useEffect } from 'react';
import { chapters, SOCIALS } from '../data/chapters';
import { DragonBall } from './DragonBall';

interface ShenronProps {
  open: boolean;
  onClose: () => void;
}

const BODY =
  'M 40 360 C 120 400, 170 300, 240 300 S 340 380, 420 330 S 500 170, 580 190 S 690 300, 740 220 S 760 120, 700 92';

export function Shenron({ open, onClose }: ShenronProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="shenron" role="dialog" aria-modal="true" aria-label="Make a wish">
      <button className="modal-close" onClick={onClose} aria-label="Close">
        <X size={16} />
      </button>

      <div className="shenron-balls" aria-hidden>
        {chapters.map((c, i) => (
          <DragonBall key={c.id} stars={c.stars} size={26} style={{ animationDelay: `${i * 0.08}s` }} />
        ))}
      </div>

      <svg className="shenron-dragon" viewBox="0 0 800 420" aria-hidden>
        <defs>
          <linearGradient id="shenron-gold" x1="0" x2="1">
            <stop offset="0" stopColor="#3f8f5a" />
            <stop offset="0.55" stopColor="#7fd49a" />
            <stop offset="1" stopColor="#ffd84a" />
          </linearGradient>
        </defs>
        <path d={BODY} pathLength={1} className="dragon-body" stroke="url(#shenron-gold)" />
        <path d={BODY} pathLength={1} className="dragon-scales" />
        <g className="dragon-head">
          <path d="M 700 92 L 742 80 L 760 94 L 744 104 L 712 104 Z" />
          <path d="M 716 86 L 704 60 M 728 84 L 724 56" />
          <path d="M 754 98 C 780 104, 790 124, 772 140 M 750 102 C 766 120, 760 140, 744 150" />
          <circle cx="738" cy="90" r="2.4" className="dragon-eye" />
        </g>
      </svg>

      <div className="shenron-copy">
        <p className="eyebrow">All seven found</p>
        <h2 className="shenron-title">Make a wish.</h2>
        <p className="modal-sub">Within reason. Most wishes are granted within 24 hours.</p>
        <div className="hero-ctas center">
          <a className="btn btn-primary" href={`${SOCIALS.email}?subject=Wish%20granted%3A%20let%E2%80%99s%20work%20together`}>
            <Mail size={15} /> Hire Varun
          </a>
          <a className="btn btn-ghost" href={SOCIALS.cv} target="_blank" rel="noreferrer">
            <FileText size={15} /> Get the CV
          </a>
          <a className="btn btn-ghost" href={SOCIALS.linkedin} target="_blank" rel="noreferrer">
            <Linkedin size={15} /> Just say hi
          </a>
        </div>
      </div>
    </div>
  );
}
