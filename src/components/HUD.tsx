import { Home, Newspaper, Target } from 'lucide-react';
import { CredibilityBar } from './CredibilityBar';
import './hud.css';

interface HUDProps {
  onHome: () => void;
  onRecruiter: () => void;
}

export function HUD({ onHome, onRecruiter }: HUDProps) {
  return (
    <>
      <header className="hud-top">
        <button className="hud-brand" onClick={onHome} aria-label="Recenter on Varun">
          <span className="hud-brand-dot" />
          <span>
            <div className="hud-brand-name">Varun Rao</div>
            <div className="hud-brand-role">
              AI/ML Engineer · IIT Bhilai · Building Human Slop
            </div>
          </span>
        </button>
        <div className="hud-actions">
          <a
            className="hud-btn"
            href="https://varunrao.is-a.dev"
            target="_blank"
            rel="noreferrer noopener"
          >
            varunrao.is-a.dev
          </a>
          <button className="hud-btn" onClick={onHome} aria-label="Recenter">
            <Home size={14} /> Recenter
          </button>
          <button
            className="hud-btn primary"
            onClick={onRecruiter}
            aria-label="Open recruiter mode"
          >
            <Target size={14} /> Why hire me?
          </button>
          <a className="hud-btn" href="/classic.html" aria-label="Open classic view">
            <Newspaper size={14} /> Classic
          </a>
        </div>
      </header>
      <CredibilityBar />
    </>
  );
}
