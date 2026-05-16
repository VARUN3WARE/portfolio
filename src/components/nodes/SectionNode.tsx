import { Handle, Position, type NodeProps } from '@xyflow/react';
import {
  Award,
  BookOpen,
  Briefcase,
  Compass,
  GraduationCap,
  Layers,
  Rocket,
  Sparkles,
  Star,
  Target,
  Trophy,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { classNames } from './classNames';
import type { CanvasNodeData } from './HubNode';

const sectionIcon: Record<string, LucideIcon> = {
  about: Compass,
  work: Briefcase,
  education: GraduationCap,
  featured: Star,
  academic: Layers,
  blades: Wrench,
  skills: Sparkles,
  achievements: Award,
};

const achievementIcons: Record<string, LucideIcon> = {
  award: Award,
  target: Target,
  rocket: Rocket,
  zap: Zap,
  trophy: Trophy,
  'book-open': BookOpen,
  star: Star,
};

function achievementIcon(name: string): LucideIcon {
  return achievementIcons[name] ?? Award;
}

export function SectionNode({ data, selected }: NodeProps) {
  const { node, dimmed } = data as unknown as CanvasNodeData;
  const Icon = sectionIcon[node.id] ?? Compass;

  return (
    <div className={classNames('node node-section', selected && 'selected', dimmed && 'dimmed')}>
      <Handle type="target" position={Position.Top} />
      <div className="node-tag">section</div>
      <div className="node-title">
        <Icon size={16} className="node-icon" />
        {node.label}
      </div>
      {node.subtitle && <div className="node-subtitle">{node.subtitle}</div>}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export function ExperienceNode({ data, selected }: NodeProps) {
  const { node, dimmed } = data as unknown as CanvasNodeData;
  if (node.detail.kind !== 'experience') return null;
  const d = node.detail;

  return (
    <div
      className={classNames('node node-experience', selected && 'selected', dimmed && 'dimmed')}
    >
      <Handle type="target" position={Position.Top} />
      <div className="node-tag">role</div>
      <div className="exp-row">
        {d.logo && <img src={d.logo} alt={d.org} className="exp-logo" />}
        <div>
          <div className="node-title" style={{ fontSize: 14 }}>
            {d.role}
          </div>
          <div className="node-subtitle">{d.org}</div>
        </div>
      </div>
      <div className="node-meta">
        <span>
          {d.start} → {d.end}
        </span>
        {d.location && <span>{d.location}</span>}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export function EducationNode({ data, selected }: NodeProps) {
  const { node, dimmed } = data as unknown as CanvasNodeData;
  if (node.detail.kind !== 'education') return null;
  const d = node.detail;

  return (
    <div
      className={classNames('node node-experience', selected && 'selected', dimmed && 'dimmed')}
    >
      <Handle type="target" position={Position.Top} />
      <div className="node-tag">education</div>
      <div className="exp-row">
        {d.logo && <img src={d.logo} alt={d.org} className="exp-logo" />}
        <div>
          <div className="node-title" style={{ fontSize: 14 }}>
            {d.degree}
          </div>
          <div className="node-subtitle">{d.org}</div>
        </div>
      </div>
      <div className="node-meta">
        <span>
          {d.start} → {d.end}
        </span>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export function ProjectNode({ data, selected }: NodeProps) {
  const { node, dimmed } = data as unknown as CanvasNodeData;
  if (node.detail.kind !== 'project') return null;
  const d = node.detail;

  return (
    <div
      className={classNames('node node-project', selected && 'selected', dimmed && 'dimmed')}
      data-family={d.family}
    >
      <Handle type="target" position={Position.Top} />
      <div className="proj-head">
        <div>
          <div className="node-tag">{d.family}</div>
          <div className="node-title">{d.name}</div>
        </div>
        {d.url && (
          <a
            className="proj-link"
            href={d.url}
            target="_blank"
            rel="noreferrer noopener"
            onClick={(e) => e.stopPropagation()}
            aria-label="Open on GitHub"
            title="Open on GitHub"
          >
            <GithubIcon />
          </a>
        )}
      </div>
      <div className="node-subtitle">{node.subtitle}</div>
      {d.tags.length > 0 && (
        <div className="node-tags">
          {d.tags.slice(0, 3).map((t) => (
            <span key={t} className="pill">
              {t}
            </span>
          ))}
          {d.tags.length > 3 && <span className="pill">+{d.tags.length - 3}</span>}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export function AchievementNode({ data, selected }: NodeProps) {
  const { node, dimmed } = data as unknown as CanvasNodeData;
  if (node.detail.kind !== 'achievement') return null;
  const d = node.detail;
  const Icon = achievementIcon(d.icon);

  return (
    <div
      className={classNames('node node-achievement', selected && 'selected', dimmed && 'dimmed')}
    >
      <Handle type="target" position={Position.Top} />
      <div className="ach-head">
        <div className="ach-icon">
          <Icon size={16} />
        </div>
        <div>
          <div className="node-tag">achievement</div>
          <div className="node-title" style={{ fontSize: 14 }}>
            {node.label}
          </div>
        </div>
      </div>
      <div className="node-subtitle">{node.subtitle}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export function SkillGroupNode({ data, selected }: NodeProps) {
  const { node, dimmed } = data as unknown as CanvasNodeData;
  if (node.detail.kind !== 'skills') return null;
  const d = node.detail;

  return (
    <div className={classNames('node node-skill', selected && 'selected', dimmed && 'dimmed')}>
      <Handle type="target" position={Position.Top} />
      <div className="node-tag">skills</div>
      <div className="node-title">{node.label}</div>
      <div className="node-subtitle">{d.totalCount} total</div>
      <div className="node-tags">
        {d.groups.flatMap((g) => g.items).slice(0, 4).map((t) => (
          <span key={t} className="pill">
            {t}
          </span>
        ))}
        <span className="pill">+more</span>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

/* Inline GitHub mark to avoid extra import in this file */
function GithubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.69-3.88-1.36-3.88-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.07.78 2.16v3.2c0 .31.21.68.79.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}
