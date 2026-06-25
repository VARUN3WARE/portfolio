import { Award, BookOpen, Github, Package, type LucideIcon } from 'lucide-react';
import './credibility.css';

interface Pill {
  icon: LucideIcon;
  label: string;
  accent?: boolean;
  href?: string;
}

const PILLS: Pill[] = [
  { icon: Award, label: 'Kaggle Expert', accent: true },
  { icon: Github, label: '54 repos', href: 'https://github.com/VARUN3WARE' },
  { icon: Package, label: 'PyPI author', href: 'https://pypi.org/project/pytorch-dml/' },
  { icon: BookOpen, label: '70+ articles', href: 'https://medium.com/@varunrao.aiml' },
];

export function CredibilityBar() {
  return (
    <div className="credibility-bar" aria-label="Highlights">
      {PILLS.map((pill) => {
        const Icon = pill.icon;
        const className = `cred-pill${pill.accent ? ' cred-pill--accent' : ''}`;
        const content = (
          <>
            <Icon size={12} />
            <span>{pill.label}</span>
          </>
        );
        if (pill.href) {
          return (
            <a
              key={pill.label}
              className={className}
              href={pill.href}
              target="_blank"
              rel="noreferrer noopener"
            >
              {content}
            </a>
          );
        }
        return (
          <span key={pill.label} className={className}>
            {content}
          </span>
        );
      })}
    </div>
  );
}
