import {
  Cpu,
  LineChart,
  MessageSquareCode,
  Microscope,
  Rocket,
  type LucideIcon,
} from 'lucide-react';
import { personas, type Persona, type PersonaIcon } from '../data/personas';

const iconMap: Record<PersonaIcon, LucideIcon> = {
  cpu: Cpu,
  'message-square-code': MessageSquareCode,
  microscope: Microscope,
  rocket: Rocket,
  'line-chart': LineChart,
};

interface PersonaBarProps {
  activeId: string | null;
  onSelect: (persona: Persona | null) => void;
}

export function PersonaBar({ activeId, onSelect }: PersonaBarProps) {
  return (
    <nav className="persona-bar" aria-label="Engineering fit modes">
      {personas.map((p) => {
        const Icon = iconMap[p.icon];
        const active = p.id === activeId;
        return (
          <button
            key={p.id}
            className={`persona-chip${active ? ' active' : ''}`}
            onClick={() => onSelect(active ? null : p)}
            aria-pressed={active}
            title={p.blurb}
          >
            <Icon size={13} />
            {p.label}
          </button>
        );
      })}
    </nav>
  );
}
