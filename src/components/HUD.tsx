import { Home, Newspaper } from 'lucide-react';
import './hud.css';

interface HUDProps {
  onHome: () => void;
}

export function HUD({ onHome }: HUDProps) {
  return (
    <header className="hud-top">
      <button className="hud-brand" onClick={onHome} aria-label="Recenter on Varun">
        <span className="hud-brand-dot" />
        <span>
          <div className="hud-brand-name">Varun Rao</div>
          <div className="hud-brand-role">AI/ML Engineer · Co-founder, Human Slop</div>
        </span>
      </button>
      <div className="hud-actions">
        <button className="hud-btn" onClick={onHome} aria-label="Recenter">
          <Home size={14} /> Recenter
        </button>
        <a className="hud-btn primary" href="/classic.html">
          <Newspaper size={14} /> Classic view
        </a>
      </div>
    </header>
  );
}
