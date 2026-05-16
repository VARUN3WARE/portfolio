import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Square,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Story } from '../data/stories';

interface StoryPlayerProps {
  story: Story;
  stepIndex: number;
  playing: boolean;
  onStep: (index: number) => void;
  onPlayPause: (playing: boolean) => void;
  onStop: () => void;
  autoAdvanceMs?: number;
}

export function StoryPlayer({
  story,
  stepIndex,
  playing,
  onStep,
  onPlayPause,
  onStop,
  autoAdvanceMs = 4200,
}: StoryPlayerProps) {
  const step = story.steps[stepIndex];

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (stepIndex < story.steps.length - 1) {
        onStep(stepIndex + 1);
      } else {
        onPlayPause(false);
      }
    }, autoAdvanceMs);
    return () => window.clearTimeout(timer);
  }, [playing, stepIndex, story.steps.length, onStep, onPlayPause, autoAdvanceMs]);

  return (
    <div className="story-player" role="region" aria-label="Story player">
      <div className="story-caption">
        <span className="story-step">
          {story.label} · {stepIndex + 1}/{story.steps.length}
        </span>
        <span className="story-text">{step.caption}</span>
      </div>
      <div className="story-controls">
        <button
          className="story-btn"
          onClick={() => onStep(Math.max(0, stepIndex - 1))}
          disabled={stepIndex === 0}
          aria-label="Previous step"
        >
          <ChevronLeft size={14} />
        </button>
        <button
          className="story-btn primary"
          onClick={() => onPlayPause(!playing)}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button
          className="story-btn"
          onClick={() =>
            onStep(Math.min(story.steps.length - 1, stepIndex + 1))
          }
          disabled={stepIndex === story.steps.length - 1}
          aria-label="Next step"
        >
          <ChevronRight size={14} />
        </button>
        <button className="story-btn" onClick={onStop} aria-label="Stop">
          <Square size={12} />
        </button>
      </div>
    </div>
  );
}

interface StoryLauncherProps {
  onStart: (storyId: string) => void;
  stories: Story[];
}

export function StoryLauncher({ onStart, stories }: StoryLauncherProps) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <div className="story-launcher">
        <button onClick={() => setOpen(true)} aria-label="Open story launcher">
          <Play size={12} />
          Play journey
        </button>
      </div>
    );
  }
  return (
    <div className="story-launcher">
      {stories.map((s) => (
        <button
          key={s.id}
          onClick={() => {
            setOpen(false);
            onStart(s.id);
          }}
          title={s.blurb}
        >
          <Play size={12} />
          {s.label}
        </button>
      ))}
      <button onClick={() => setOpen(false)} aria-label="Close launcher">
        <Square size={10} />
      </button>
    </div>
  );
}
