import { Compass, Keyboard, MousePointerClick, Play, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import './onboarding.css';

const STORAGE_KEY = 'portfolio-onboarding-dismissed';

interface OnboardingHintProps {
  visible: boolean;
  onPlayStory: () => void;
  onDismiss: () => void;
}

export function OnboardingHint({ visible, onPlayStory, onDismiss }: OnboardingHintProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!visible) {
      setShow(false);
      return;
    }
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') return;
    } catch {
      /* ignore */
    }
    const t = window.setTimeout(() => setShow(true), 400);
    return () => window.clearTimeout(t);
  }, [visible]);

  if (!show) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setShow(false);
    onDismiss();
  };

  return (
    <div className="onboarding-backdrop" role="dialog" aria-label="How to explore">
      <div className="onboarding-card">
        <button className="onboarding-close" onClick={dismiss} aria-label="Dismiss">
          <X size={16} />
        </button>
        <p className="onboarding-eyebrow">Knowledge graph portfolio</p>
        <h2 className="onboarding-title">Explore Varun&apos;s work</h2>
        <ul className="onboarding-list">
          <li>
            <MousePointerClick size={16} />
            <span>Click any node for full details and connections</span>
          </li>
          <li>
            <Keyboard size={16} />
            <span>
              Press <kbd>⌘K</kbd> to search — try &quot;CUDA&quot; or &quot;why hire me&quot;
            </span>
          </li>
          <li>
            <Compass size={16} />
            <span>Use fit-mode chips below to lens by AI Infra, LLM, Research…</span>
          </li>
        </ul>
        <div className="onboarding-actions">
          <button
            type="button"
            className="onboarding-primary"
            onClick={() => {
              onPlayStory();
              dismiss();
            }}
          >
            <Play size={14} /> Play origin story
          </button>
          <button type="button" className="onboarding-secondary" onClick={dismiss}>
            Explore freely
          </button>
        </div>
      </div>
    </div>
  );
}
