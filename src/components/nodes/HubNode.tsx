import { Handle, Position, type NodeProps } from '@xyflow/react';
import { FileText, Github, Linkedin, Mail, Twitter } from 'lucide-react';
import type { GraphNode, HubDetail, SocialLink } from '../../data/portfolioGraph';
import { classNames } from './classNames';

export interface CanvasNodeData {
  node: GraphNode;
  dimmed?: boolean;
  active?: boolean;
}

const iconFor: Record<SocialLink['icon'], typeof Mail> = {
  mail: Mail,
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  'file-text': FileText,
  globe: Mail,
};

export function HubNode({ data, selected }: NodeProps) {
  const { node, dimmed } = data as unknown as CanvasNodeData;
  const detail = node.detail as HubDetail;

  return (
    <div className={classNames('node node-hub', selected && 'selected', dimmed && 'dimmed')}>
      <Handle type="target" position={Position.Top} />
      <div className="node-hub-row">
        <img src={detail.avatar} alt={detail.name} className="node-hub-avatar" />
        <div>
          <div className="node-hub-name">{detail.name}</div>
          <div className="node-hub-role">{detail.role}</div>
        </div>
      </div>
      <div className="node-hub-socials" onClick={(e) => e.stopPropagation()}>
        {detail.socials.map((s) => {
          const Icon = iconFor[s.icon];
          return (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={s.label}
              title={s.label}
            >
              <Icon size={14} />
            </a>
          );
        })}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
