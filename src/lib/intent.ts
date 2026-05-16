/**
 * Tiny intent parser for the command palette. Maps natural-language input
 * to either a structured action (run a story, activate a persona, open
 * recruiter mode) or falls back to semantic search.
 *
 * Deterministic regex-first. The semantic layer handles everything we
 * cannot pattern-match.
 */

import { personas, type Persona } from '../data/personas';
import { stories, type Story } from '../data/stories';

export type Intent =
  | { kind: 'recruiter' }
  | { kind: 'story'; story: Story }
  | { kind: 'persona'; persona: Persona }
  | { kind: 'home' }
  | { kind: 'open'; nodeId: string; label: string }
  | { kind: 'semantic'; query: string };

const STORY_TRIGGERS = [
  /\b(play|run|start|launch)\s+(the\s+)?(journey|tour|story|origin|narrative)\b/i,
  /\b(journey|tour|origin\s+story)\b/i,
  /\bstoryt?ime\b/i,
];

const RECRUITER_TRIGGERS = [
  /\b(why\s+hire|recruiter|hire\s+me|fit\s+score|good\s+fit|role\s+fit|are\s+you\s+a\s+fit)\b/i,
];

const HOME_TRIGGERS = [
  /^(home|reset|clear|recenter)$/i,
];

export function detectIntent(query: string): Intent {
  const q = query.trim();
  if (!q) return { kind: 'semantic', query: '' };

  if (HOME_TRIGGERS.some((r) => r.test(q))) return { kind: 'home' };

  if (RECRUITER_TRIGGERS.some((r) => r.test(q))) return { kind: 'recruiter' };

  for (const story of stories) {
    if (
      q.toLowerCase() === story.label.toLowerCase() ||
      q.toLowerCase().includes(story.id.toLowerCase())
    ) {
      return { kind: 'story', story };
    }
  }
  if (STORY_TRIGGERS.some((r) => r.test(q))) {
    return { kind: 'story', story: stories[0] };
  }

  for (const persona of personas) {
    if (
      q.toLowerCase() === persona.label.toLowerCase() ||
      q.toLowerCase() === persona.id.toLowerCase()
    ) {
      return { kind: 'persona', persona };
    }
  }
  // "show me X projects" / "what about X"
  const showMatch = q.match(
    /^(?:show|find|filter|highlight|what|see)\s+(?:me\s+)?(?:the\s+)?(?:his\s+)?(.+?)(?:\s+projects)?$/i,
  );
  if (showMatch) {
    const phrase = showMatch[1].toLowerCase();
    for (const persona of personas) {
      if (
        phrase.includes(persona.label.toLowerCase()) ||
        persona.tags.some((t) => phrase.includes(t.toLowerCase()))
      ) {
        return { kind: 'persona', persona };
      }
    }
  }

  return { kind: 'semantic', query: q };
}

/**
 * Suggestions surfaced in the empty / no-match state of the palette.
 */
export interface Suggestion {
  id: string;
  label: string;
  description: string;
  intent: Intent;
}

export function suggestions(): Suggestion[] {
  return [
    {
      id: 'sugg-recruiter',
      label: 'Why hire me?',
      description: 'Role-fit summary from the graph.',
      intent: { kind: 'recruiter' },
    },
    {
      id: 'sugg-origin',
      label: 'Play origin story',
      description: 'Camera flythrough of the journey.',
      intent: { kind: 'story', story: stories[0] },
    },
    {
      id: 'sugg-infra',
      label: 'AI Infra lens',
      description: 'CUDA, vector DB, inference runtime.',
      intent: { kind: 'persona', persona: personas[0] },
    },
  ];
}
