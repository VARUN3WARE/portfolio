import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  useReactFlow,
  type Edge,
  type Node,
  type NodeMouseHandler,
  type NodeTypes,
} from '@xyflow/react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { personas, type Persona } from '../data/personas';
import {
  edges as graphEdges,
  nodes as graphNodes,
  type GraphEdge,
  type GraphNode,
} from '../data/portfolioGraph';
import { stories, storyById, type Story } from '../data/stories';
import { warmEmbeddings } from '../lib/embeddings';
import {
  buildAdjacency,
  personaSubgraph,
  subgraph,
  type AdjacencyIndex,
} from '../lib/graphQueries';
import { CypherStrip } from './CypherStrip';
import { DetailDrawer } from './DetailDrawer';
import { GraphHealthChip } from './GraphHealthChip';
import { HUD } from './HUD';
import { PersonaBar } from './PersonaBar';
import { RecruiterPanel } from './RecruiterPanel';
import { SearchPanel, type CommandActions } from './SearchPanel';
import { StoryLauncher, StoryPlayer } from './StoryPlayer';
import { AIAssistant } from './AIAssistant';
import { OnboardingHint } from './OnboardingHint';
import { useIntroReveal } from '../hooks/useIntroReveal';
import { HubNode } from './nodes/HubNode';
import './onboarding.css';
import {
  AchievementNode,
  EducationNode,
  ExperienceNode,
  ProjectNode,
  SectionNode,
  SkillGroupNode,
} from './nodes/SectionNode';
import './extras.css';
import './nodes/nodes.css';

const nodeTypes: NodeTypes = {
  hub: HubNode,
  section: SectionNode,
  experience: ExperienceNode,
  education: EducationNode,
  project: ProjectNode,
  achievement: AchievementNode,
  skillGroup: SkillGroupNode,
};

interface CanvasState {
  focusedId: string | null;
  drawerId: string | null;
  personaId: string | null;
  story: { id: string; index: number; playing: boolean } | null;
  recruiterOpen: boolean;
}

const initialState: CanvasState = {
  focusedId: null,
  drawerId: null,
  personaId: null,
  story: null,
  recruiterOpen: false,
};

export function PortfolioCanvas() {
  return <CanvasShell />;
}

function CanvasShell() {
  const adjacency = useMemo(() => buildAdjacency(), []);
  const [state, setState] = useState<CanvasState>(initialState);
  const flow = useReactFlow();
  const initialFitRef = useRef(false);
  const introFitRef = useRef(false);
  const {
    isAnimating,
    isDone: introDone,
    revealedNodes,
    revealedEdges,
    skipIntro,
    phase: introPhase,
  } = useIntroReveal();

  /* Pre-warm the embedding index after first paint. */
  useEffect(() => {
    const t = window.setTimeout(() => warmEmbeddings(), 600);
    return () => window.clearTimeout(t);
  }, []);

  /* Focus hub at intro start. */
  useEffect(() => {
    if (introPhase !== 'focusHub') return;
    flow.setCenter(0, 0, { zoom: 1.35, duration: 400 });
  }, [introPhase, flow]);

  /* Fit full graph when intro completes. */
  useEffect(() => {
    if (!introDone || introFitRef.current) return;
    introFitRef.current = true;
    const t = window.setTimeout(() => {
      flow.fitView({ padding: 0.28, duration: 900 });
    }, 200);
    return () => window.clearTimeout(t);
  }, [introDone, flow]);

  /* Highlight set is derived from whichever mode is active. */
  const highlight = useMemo(
    () => computeHighlight(state, adjacency),
    [state, adjacency],
  );

  const { rfNodes, rfEdges } = useMemo(
    () =>
      toReactFlow(graphNodes, graphEdges, highlight, state, {
        revealedNodes,
        revealedEdges,
        isAnimating,
      }),
    [highlight, state, revealedNodes, revealedEdges, isAnimating],
  );

  const flyToNode = useCallback(
    (id: string, opts: { zoom?: number; duration?: number } = {}) => {
      const node = adjacency.byId.get(id);
      if (!node) return;
      flow.setCenter(node.position.x + 110, node.position.y + 50, {
        zoom: opts.zoom ?? 1.0,
        duration: opts.duration ?? 700,
      });
    },
    [adjacency, flow],
  );

  const frameNodes = useCallback(
    (ids: string[], duration = 700) => {
      if (!ids.length) {
        flow.fitView({ padding: 0.25, duration });
        return;
      }
      flow.fitView({
        nodes: ids.map((id) => ({ id })),
        padding: 0.3,
        duration,
      });
    },
    [flow],
  );

  const focusNode = useCallback(
    (id: string | null) => {
      setState((prev) => ({
        ...prev,
        focusedId: id,
        drawerId: id,
        recruiterOpen: id ? false : prev.recruiterOpen,
        story: null,
      }));
      if (id) flyToNode(id);
    },
    [flyToNode],
  );

  const goHome = useCallback(() => {
    setState(initialState);
    flow.fitView({ padding: 0.25, duration: 800 });
  }, [flow]);

  const activatePersona = useCallback(
    (persona: Persona) => {
      const { nodes: ids } = personaSubgraph(persona, adjacency);
      setState({
        focusedId: null,
        drawerId: null,
        personaId: persona.id,
        story: null,
        recruiterOpen: false,
      });
      frameNodes([...ids]);
    },
    [adjacency, frameNodes],
  );

  const togglePersona = useCallback(
    (persona: Persona | null) => {
      if (!persona) {
        setState((p) => ({ ...p, personaId: null }));
        flow.fitView({ padding: 0.25, duration: 700 });
        return;
      }
      activatePersona(persona);
    },
    [activatePersona, flow],
  );

  const startStory = useCallback(
    (storyId: string) => {
      const story = storyById(storyId);
      if (!story) return;
      setState({
        focusedId: null,
        drawerId: null,
        personaId: null,
        recruiterOpen: false,
        story: { id: storyId, index: 0, playing: true },
      });
      flyToNode(story.steps[0].nodeId, { zoom: 1.05, duration: 800 });
    },
    [flyToNode],
  );

  const stepStory = useCallback(
    (index: number) => {
      setState((prev) => {
        if (!prev.story) return prev;
        const story = storyById(prev.story.id);
        if (!story) return prev;
        const clamped = Math.max(0, Math.min(story.steps.length - 1, index));
        flyToNode(story.steps[clamped].nodeId, { zoom: 1.05, duration: 800 });
        return { ...prev, story: { ...prev.story, index: clamped } };
      });
    },
    [flyToNode],
  );

  const setStoryPlaying = useCallback((playing: boolean) => {
    setState((prev) =>
      prev.story ? { ...prev, story: { ...prev.story, playing } } : prev,
    );
  }, []);

  const stopStory = useCallback(() => {
    setState((prev) => ({ ...prev, story: null }));
    flow.fitView({ padding: 0.25, duration: 700 });
  }, [flow]);

  const openRecruiter = useCallback(() => {
    setState((prev) => ({
      ...prev,
      recruiterOpen: true,
      drawerId: null,
      focusedId: null,
      story: null,
    }));
  }, []);

  const closeRecruiter = useCallback(() => {
    setState((prev) => ({ ...prev, recruiterOpen: false }));
  }, []);

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_evt, node) => {
      focusNode(node.id);
    },
    [focusNode],
  );

  const handlePaneClick = useCallback(() => {
    setState((prev) =>
      prev.story ? prev : { ...prev, focusedId: null, drawerId: null },
    );
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setState((prev) => {
        if (prev.drawerId) return { ...prev, drawerId: null, focusedId: null };
        if (prev.recruiterOpen) return { ...prev, recruiterOpen: false };
        if (prev.story) return { ...prev, story: null };
        if (prev.personaId) return { ...prev, personaId: null };
        return prev;
      });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const commandActions: CommandActions = {
    openNode: focusNode as (id: string) => void,
    activatePersona,
    startStory,
    openRecruiter,
    goHome,
  };

  const selectedNode: GraphNode | null =
    state.drawerId ? adjacency.byId.get(state.drawerId) ?? null : null;

  const activePersona = useMemo(
    () =>
      state.personaId
        ? personas.find((p) => p.id === state.personaId) ?? null
        : null,
    [state.personaId],
  );

  const cypher = useMemo(
    () => composeCypher(state, activePersona),
    [state, activePersona],
  );

  const activeStory: Story | null = state.story
    ? storyById(state.story.id) ?? null
    : null;

  return (
    <div className={`canvas-root${isAnimating ? ' canvas-root--intro' : ''}`}>
      <HUD onHome={goHome} onRecruiter={openRecruiter} />
      {introDone && <SearchPanel actions={commandActions} />}
      {introDone && (
        <PersonaBar activeId={state.personaId} onSelect={togglePersona} />
      )}
      {introDone && <CypherStrip query={cypher} />}

      {isAnimating && (
        <>
          <div className="intro-overlay" aria-hidden>
            <div className="intro-overlay-label">Mapping knowledge graph…</div>
          </div>
          <button type="button" className="intro-skip" onClick={skipIntro}>
            Skip intro
          </button>
        </>
      )}

      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        onInit={() => {
          if (initialFitRef.current) return;
          initialFitRef.current = true;
          if (!isAnimating) flow.fitView({ padding: 0.25 });
        }}
        fitView={!isAnimating && introDone}
        fitViewOptions={{ padding: 0.25, minZoom: 0.35, maxZoom: 1.4 }}
        minZoom={0.2}
        maxZoom={1.8}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        proOptions={{ hideAttribution: false }}
        defaultEdgeOptions={{ type: 'default' }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={28}
          size={1.2}
          color="rgba(255, 255, 255, 0.06)"
        />
        <MiniMap
          pannable
          zoomable
          position="top-right"
          nodeColor={(n) => miniMapColor(n.type)}
          maskColor="rgba(0, 0, 0, 0.6)"
        />
        <Controls position="bottom-right" showInteractive={false} />
      </ReactFlow>

      {introDone && <GraphHealthChip />}

      {introDone && activeStory && state.story && (
        <StoryPlayer
          story={activeStory}
          stepIndex={state.story.index}
          playing={state.story.playing}
          onStep={stepStory}
          onPlayPause={setStoryPlaying}
          onStop={stopStory}
        />
      )}
      {introDone && !state.story && (
        <StoryLauncher onStart={startStory} stories={stories} />
      )}

      <DetailDrawer
        node={selectedNode}
        adjacency={adjacency}
        onClose={() =>
          setState((p) => ({ ...p, drawerId: null, focusedId: null }))
        }
        onNeighborSelect={focusNode as (id: string) => void}
      />
      <RecruiterPanel
        open={state.recruiterOpen}
        onClose={closeRecruiter}
        onNodeSelect={focusNode as (id: string) => void}
      />
      {introDone && (
        <AIAssistant onNodeSelect={focusNode as (id: string) => void} />
      )}

      <OnboardingHint
        visible={introDone && !state.recruiterOpen && !state.drawerId && !state.story}
        onPlayStory={() => startStory('origin')}
        onDismiss={() => undefined}
      />
    </div>
  );
}

function computeHighlight(
  state: CanvasState,
  adjacency: AdjacencyIndex,
): { nodes: Set<string>; edges: Set<string>; active: boolean } {
  if (state.story) {
    const story = storyById(state.story.id);
    if (!story) return emptyHighlight();
    const current = story.steps[state.story.index].nodeId;
    const { nodes, edges } = subgraph(current, 1, adjacency);
    return { nodes, edges, active: true };
  }
  if (state.focusedId) {
    const { nodes, edges } = subgraph(state.focusedId, 1, adjacency);
    return { nodes, edges, active: true };
  }
  if (state.personaId) {
    const persona = personas.find((p) => p.id === state.personaId);
    if (!persona) return emptyHighlight();
    const { nodes, edges } = personaSubgraph(persona, adjacency);
    return { nodes, edges, active: true };
  }
  return emptyHighlight();
}

function emptyHighlight() {
  return { nodes: new Set<string>(), edges: new Set<string>(), active: false };
}

function composeCypher(
  state: CanvasState,
  persona: { cypher: string; label: string } | null,
): string {
  if (state.story) {
    const story = storyById(state.story.id);
    if (!story) return 'MATCH (n) RETURN n';
    const step = story.steps[state.story.index];
    return `// story: ${story.label} | step ${state.story.index + 1}/${story.steps.length} → ${step.nodeId}`;
  }
  if (state.focusedId) {
    return `MATCH (a)-[r]-(b) WHERE a.id = '${state.focusedId}' RETURN a, r, b`;
  }
  if (persona) {
    return persona.cypher;
  }
  return 'MATCH (n) RETURN n  // explore freely';
}

function miniMapColor(type: string | undefined): string {
  switch (type) {
    case 'hub':
      return '#34d399';
    case 'section':
      return '#60a5fa';
    case 'project':
      return '#a78bfa';
    case 'experience':
    case 'education':
      return '#f472b6';
    case 'achievement':
      return '#f59e0b';
    default:
      return '#9ca3af';
  }
}

function toReactFlow(
  nodes: GraphNode[],
  edges: GraphEdge[],
  highlight: { nodes: Set<string>; edges: Set<string>; active: boolean },
  _state: CanvasState,
  intro: {
    revealedNodes: Set<string>;
    revealedEdges: Set<string>;
    isAnimating: boolean;
  },
): { rfNodes: Node[]; rfEdges: Edge[] } {
  const active = highlight.active;

  const rfNodes: Node[] = nodes.map((n) => {
    const revealed = intro.revealedNodes.has(n.id);
    return {
      id: n.id,
      type: n.kind,
      position: n.position,
      className: intro.isAnimating
        ? revealed
          ? 'intro-reveal'
          : 'intro-pending'
        : undefined,
      data: {
        node: n,
        dimmed: active && !highlight.nodes.has(n.id),
        active: highlight.nodes.has(n.id),
      },
      selectable: !intro.isAnimating || revealed,
      draggable: false,
    };
  });

  const rfEdges: Edge[] = edges.map((e) => {
    const dim = active && !highlight.edges.has(e.id);
    const lit = active && highlight.edges.has(e.id);
    const edgeRevealed =
      intro.revealedEdges.has(e.id) &&
      intro.revealedNodes.has(e.source) &&
      intro.revealedNodes.has(e.target);
    return {
      id: e.id,
      source: e.source,
      target: e.target,
      label: intro.isAnimating || !edgeRevealed ? undefined : e.label,
      className: intro.isAnimating
        ? edgeRevealed
          ? 'intro-reveal'
          : 'intro-pending'
        : lit
          ? 'active'
          : dim
            ? 'dimmed'
            : '',
      labelStyle: {
        fontSize: 10,
        fill: 'var(--text-tertiary)',
        fontFamily: 'var(--font-mono)',
      },
      labelBgStyle: {
        fill: 'rgba(11, 13, 16, 0.85)',
      },
      labelBgPadding: [4, 4],
      labelBgBorderRadius: 4,
      type: 'default',
      animated: lit || (intro.isAnimating && edgeRevealed),
      style: {
        stroke: lit ? 'var(--accent)' : 'var(--edge)',
        strokeWidth: lit ? 2 : 1.2,
      },
    };
  });

  return { rfNodes, rfEdges };
}
