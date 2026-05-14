import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
  type NodeMouseHandler,
  type NodeTypes,
} from '@xyflow/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  edges as graphEdges,
  nodes as graphNodes,
  type GraphEdge,
  type GraphNode,
} from '../data/portfolioGraph';
import { buildAdjacency, subgraph } from '../lib/graphQueries';
import { DetailDrawer } from './DetailDrawer';
import { HUD } from './HUD';
import { SearchPanel } from './SearchPanel';
import { HubNode } from './nodes/HubNode';
import {
  AchievementNode,
  EducationNode,
  ExperienceNode,
  ProjectNode,
  SectionNode,
  SkillGroupNode,
} from './nodes/SectionNode';
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
  selectedId: string | null;
  focusedId: string | null;
  highlight: Set<string>;
  highlightEdges: Set<string>;
}

const initialState: CanvasState = {
  selectedId: null,
  focusedId: null,
  highlight: new Set(),
  highlightEdges: new Set(),
};

export function PortfolioCanvas() {
  const adjacency = useMemo(() => buildAdjacency(), []);
  const [state, setState] = useState<CanvasState>(initialState);
  const [drawerId, setDrawerId] = useState<string | null>(null);

  const focusNode = useCallback(
    (id: string | null) => {
      if (!id) {
        setState(initialState);
        return;
      }
      const { nodes: hl, edges: hlE } = subgraph(id, 1, adjacency);
      setState({
        selectedId: id,
        focusedId: id,
        highlight: hl,
        highlightEdges: hlE,
      });
    },
    [adjacency],
  );

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_evt, node) => {
      focusNode(node.id);
      setDrawerId(node.id);
    },
    [focusNode],
  );

  const handlePaneClick = useCallback(() => {
    setState(initialState);
    setDrawerId(null);
  }, []);

  /* Escape closes drawer + clears focus. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handlePaneClick();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handlePaneClick]);

  const { rfNodes, rfEdges } = useMemo(
    () => toReactFlow(graphNodes, graphEdges, state),
    [state],
  );

  const selectedNode: GraphNode | null =
    drawerId ? adjacency.byId.get(drawerId) ?? null : null;

  return (
    <div className="canvas-root">
      <HUD onHome={() => focusNode('hub')} />
      <SearchPanel
        onPick={(id) => {
          focusNode(id);
          setDrawerId(id);
        }}
      />
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        fitView
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
          nodeColor={(n) => miniMapColor(n.type)}
          maskColor="rgba(0, 0, 0, 0.6)"
        />
        <Controls position="bottom-right" showInteractive={false} />
      </ReactFlow>
      <DetailDrawer
        node={selectedNode}
        adjacency={adjacency}
        onClose={() => setDrawerId(null)}
        onNeighborSelect={(id) => {
          focusNode(id);
          setDrawerId(id);
        }}
      />
    </div>
  );
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
  state: CanvasState,
): { rfNodes: Node[]; rfEdges: Edge[] } {
  const { focusedId, highlight, highlightEdges } = state;
  const focused = focusedId !== null;

  const rfNodes: Node[] = nodes.map((n) => ({
    id: n.id,
    type: n.kind,
    position: n.position,
    data: {
      node: n,
      dimmed: focused && !highlight.has(n.id),
      active: highlight.has(n.id),
    },
    selectable: true,
    draggable: false,
  }));

  const rfEdges: Edge[] = edges.map((e) => {
    const dim = focused && !highlightEdges.has(e.id);
    const active = focused && highlightEdges.has(e.id);
    return {
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
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
      animated: active,
      className: active ? 'active' : dim ? 'dimmed' : '',
      style: {
        stroke: active ? 'var(--accent)' : 'var(--edge)',
        strokeWidth: active ? 2 : 1.2,
      },
    };
  });

  return { rfNodes, rfEdges };
}
