/**
 * Narrative tours. The Story Player flies the camera through these node
 * sequences and shows the caption in a top overlay.
 */

export interface StoryStep {
  nodeId: string;
  caption: string;
}

export interface Story {
  id: string;
  label: string;
  blurb: string;
  steps: StoryStep[];
}

export const stories: Story[] = [
  {
    id: 'origin',
    label: 'Origin Story',
    blurb: 'From data wrangler to AI systems builder.',
    steps: [
      {
        nodeId: 'hub',
        caption: 'Varun Rao — AI/ML engineer building production AI systems.',
      },
      {
        nodeId: 'about',
        caption:
          'Started as a data scientist. Fell hard for AI systems and deep learning.',
      },
      {
        nodeId: 'edu-iitbh',
        caption:
          'B.Tech in Data Science & AI at IIT Bhilai. DSAI Club coordinator — 200+ students.',
      },
      {
        nodeId: 'exp-kartavya',
        caption:
          'First role: multi-agent automations and secure APIs on AWS/GCP — 40% manual work cut.',
      },
      {
        nodeId: 'exp-hedgera',
        caption:
          'Led 8 engineers building Hedgera — autonomous financial AI with real-time risk and LLM debate.',
      },
      {
        nodeId: 'proj-humanslop',
        caption:
          'Got tired of AI slop. Co-founded Human Slop — anti-AI social platform with typing forensics.',
      },
      {
        nodeId: 'ach-yc',
        caption: 'Accepted to YC Startup School Bengaluru 2026.',
      },
      {
        nodeId: 'hub',
        caption:
          'Now: building infra, inference, and weird ideas at the edge of AI.',
      },
    ],
  },
  {
    id: 'infra',
    label: 'AI Infra Track',
    blurb: 'The systems track — kernels, caches, storage.',
    steps: [
      {
        nodeId: 'proj-rapidadb',
        caption:
          'RapidaDB — GPU-native vector DB. Sub-millisecond search, 100K+ QPS for production RAG.',
      },
      {
        nodeId: 'proj-paged-attn',
        caption:
          'PagedAttention KV cache — 60–80% memory reduction for LLM inference.',
      },
      {
        nodeId: 'proj-bplussql',
        caption:
          'BPlusSQL — disk-based B+ tree engine in C++17 with memory-mapped I/O.',
      },
      {
        nodeId: 'skills-detail',
        caption:
          'PyTorch · C++ · CUDA · vector retrieval — the stack behind all of these.',
      },
    ],
  },
  {
    id: 'llm',
    label: 'LLM Systems Track',
    blurb: 'Multi-agent + RAG + RLHF.',
    steps: [
      {
        nodeId: 'proj-hedgera',
        caption:
          'Hedgera — multi-agent AI debating market positions in real time.',
      },
      {
        nodeId: 'proj-ayurveda-rag',
        caption:
          'Kerala-Ayurveda RAG — GPT-4 + LangGraph + CRAG with hybrid BM25 + vector retrieval.',
      },
      {
        nodeId: 'proj-pplm-watermark',
        caption:
          'PPLM watermarking — statistical watermarks injected during inference.',
      },
      {
        nodeId: 'proj-pplm-poetry',
        caption:
          'PPLM + RLHF for steered, contextual poetry generation.',
      },
    ],
  },
  {
    id: 'research',
    label: 'Research Track',
    blurb: 'Where deep learning meets curiosity.',
    steps: [
      {
        nodeId: 'proj-respect-gnn',
        caption:
          'RErespect-GNN — Spatial-Temporal GNN for electron dynamics in RT-TDDFT.',
      },
      {
        nodeId: 'proj-gnn-eadd',
        caption:
          'GNN-EADD — anomaly detection in e-commerce graphs with GIME + GAT.',
      },
      {
        nodeId: 'proj-dml',
        caption:
          'pytorch-dml — production Deep Mutual Learning library, on PyPI.',
      },
      {
        nodeId: 'proj-pplm-poetry',
        caption:
          'Reciprocal Contextual Poetry — PPLM + RLHF proxy for steered generation.',
      },
    ],
  },
];

export function storyById(id: string): Story | undefined {
  return stories.find((s) => s.id === id);
}
