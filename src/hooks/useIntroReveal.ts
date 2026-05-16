import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  buildIntroRevealOrder,
  markIntroDone,
  shouldSkipIntro,
} from '../lib/introSequence';

const WAVE_MS = 95;
const HUB_FOCUS_MS = 500;

export type IntroPhase = 'focusHub' | 'revealing' | 'done';

export function useIntroReveal() {
  const skip = useMemo(() => shouldSkipIntro(), []);
  const order = useMemo(() => buildIntroRevealOrder(), []);

  const [phase, setPhase] = useState<IntroPhase>(skip ? 'done' : 'focusHub');
  const [revealedNodes, setRevealedNodes] = useState<Set<string>>(
    () => new Set(skip ? order.allNodeIds : ['hub']),
  );
  const [revealedEdges, setRevealedEdges] = useState<Set<string>>(
    () => new Set(skip ? order.allEdgeIds : []),
  );
  const [waveIndex, setWaveIndex] = useState(skip ? order.waves.length : 1);

  useEffect(() => {
    if (skip || phase !== 'focusHub') return;
    const t = window.setTimeout(() => setPhase('revealing'), HUB_FOCUS_MS);
    return () => window.clearTimeout(t);
  }, [skip, phase]);

  useEffect(() => {
    if (phase !== 'revealing') return;
    if (waveIndex >= order.waves.length) {
      setPhase('done');
      markIntroDone();
      return;
    }

    const wave = order.waves[waveIndex];
    const t = window.setTimeout(() => {
      setRevealedNodes((prev) => {
        const next = new Set(prev);
        for (const id of wave.nodeIds) next.add(id);
        return next;
      });
      setRevealedEdges((prev) => {
        const next = new Set(prev);
        for (const id of wave.edgeIds) next.add(id);
        return next;
      });
      setWaveIndex((i) => i + 1);
    }, WAVE_MS);

    return () => window.clearTimeout(t);
  }, [phase, waveIndex, order.waves]);

  const skipIntro = useCallback(() => {
    setRevealedNodes(new Set(order.allNodeIds));
    setRevealedEdges(new Set(order.allEdgeIds));
    setPhase('done');
    markIntroDone();
  }, [order.allEdgeIds, order.allNodeIds]);

  const isAnimating = phase === 'focusHub' || phase === 'revealing';

  return {
    phase,
    isAnimating,
    isDone: phase === 'done',
    revealedNodes,
    revealedEdges,
    skipIntro,
  };
}
