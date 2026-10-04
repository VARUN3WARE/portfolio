import type { CSSProperties } from 'react';
import type { Stars } from '../data/chapters';

const LAYOUTS: Record<Stars, [number, number][]> = {
  1: [[0, 0]],
  2: [
    [-0.2, -0.17],
    [0.2, 0.17],
  ],
  3: [
    [0, -0.22],
    [-0.21, 0.15],
    [0.21, 0.15],
  ],
  4: [
    [-0.19, -0.19],
    [0.19, -0.19],
    [-0.19, 0.19],
    [0.19, 0.19],
  ],
  5: [
    [0, -0.27],
    [-0.26, -0.06],
    [0.26, -0.06],
    [-0.16, 0.24],
    [0.16, 0.24],
  ],
  6: [
    [-0.14, -0.26],
    [0.14, -0.26],
    [-0.29, 0],
    [0.29, 0],
    [-0.14, 0.26],
    [0.14, 0.26],
  ],
  7: [
    [0, 0],
    [0, -0.3],
    [0.26, -0.15],
    [0.26, 0.15],
    [0, 0.3],
    [-0.26, 0.15],
    [-0.26, -0.15],
  ],
};

const STAR_SIZE: Record<Stars, number> = { 1: 0.3, 2: 0.2, 3: 0.17, 4: 0.16, 5: 0.13, 6: 0.12, 7: 0.11 };

function starPath(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push(`${(cx + Math.cos(a) * rad).toFixed(3)},${(cy + Math.sin(a) * rad).toFixed(3)}`);
  }
  return `M${pts.join('L')}Z`;
}

interface DragonBallProps {
  stars: Stars;
  size: number;
  className?: string;
  style?: CSSProperties;
}

export function DragonBall({ stars, size, className, style }: DragonBallProps) {
  const r = STAR_SIZE[stars];
  return (
    <span
      className={`dball${className ? ` ${className}` : ''}`}
      style={{ width: size, height: size, fontSize: size / 10, ...style }}
      aria-hidden
    >
      <svg viewBox="-1 -1 2 2" className="dball-stars">
        {LAYOUTS[stars].map(([x, y], i) => (
          <path key={i} d={starPath(x, y, r)} />
        ))}
      </svg>
    </span>
  );
}

export function starsLabel(stars: Stars): string {
  return '★'.repeat(stars);
}
