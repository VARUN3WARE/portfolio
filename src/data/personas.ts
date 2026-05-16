/**
 * AI engineer "fit modes". Each persona is a lens onto the graph — it knows
 * which tags + node ids prove that fit, and a Cypher-ish query string used
 * by the terminal strip for flavour.
 */

export type PersonaIcon =
  | 'cpu'
  | 'message-square-code'
  | 'microscope'
  | 'rocket'
  | 'line-chart';

export interface Persona {
  id: string;
  label: string;
  icon: PersonaIcon;
  blurb: string;
  /** Case-insensitive tag matches (any-of). */
  tags: string[];
  /** Nodes that are always part of this lens, even if tags don't match. */
  pinned: string[];
  /** Display-only Cypher-ish query for the terminal strip. */
  cypher: string;
}

export const personas: Persona[] = [
  {
    id: 'ai-infra',
    label: 'AI Infra',
    icon: 'cpu',
    blurb:
      'Systems-level engineer. GPU kernels, vector stores, KV caches, storage engines — the substrate AI runs on.',
    tags: [
      'CUDA',
      'C++',
      'C++17',
      'Vector DB',
      'Inference',
      'Transformer',
      'Storage Engine',
      'DBMS',
    ],
    pinned: ['proj-rapidadb', 'proj-paged-attn', 'proj-bplussql'],
    cypher:
      "MATCH (p:Project) WHERE ANY(t IN p.tags WHERE t IN ['CUDA','C++','Vector DB','Inference']) RETURN p",
  },
  {
    id: 'llm-systems',
    label: 'LLM Systems',
    icon: 'message-square-code',
    blurb:
      'Multi-agent + RAG + RLHF builder. LangChain, LangGraph, CRAG, PPLM — production LLM glue.',
    tags: [
      'LangChain',
      'LangGraph',
      'CRAG',
      'RAG',
      'Multi-Agent',
      'PPLM',
      'RLHF',
      'FastAPI',
      'LLM',
      'VLM',
      'Inference Control',
      'Watermarking',
    ],
    pinned: [
      'proj-ayurveda-rag',
      'proj-hedgera',
      'proj-paged-attn',
      'proj-pplm-watermark',
      'exp-hedgera',
    ],
    cypher:
      "MATCH (n) WHERE ANY(t IN n.tags WHERE t IN ['LangChain','LangGraph','Multi-Agent','RAG']) RETURN n",
  },
  {
    id: 'research',
    label: 'Research',
    icon: 'microscope',
    blurb:
      'Deep learning fundamentals. GNNs, RLHF, quantum-chem ML, anomaly detection, mutual learning.',
    tags: [
      'GNN',
      'PyTorch Geometric',
      'Quantum Chemistry',
      'NLP',
      'PPLM',
      'RLHF',
      'DML',
      'Deep Learning',
      'Anomaly Detection',
    ],
    pinned: [
      'proj-respect-gnn',
      'proj-gnn-eadd',
      'proj-pplm-poetry',
      'proj-dml',
    ],
    cypher:
      "MATCH (p:Project) WHERE ANY(t IN p.tags WHERE t IN ['GNN','RLHF','PPLM','Deep Learning']) RETURN p",
  },
  {
    id: 'startup',
    label: 'Startup',
    icon: 'rocket',
    blurb:
      'Founder energy. Shipped Human Slop, pitched to YC SUS India, led production teams.',
    tags: [
      'React Native',
      'Supabase',
      'Biometrics',
      'YC',
      'Startup',
      'FinTech',
    ],
    pinned: ['proj-humanslop', 'ach-yc', 'exp-hedgera', 'proj-hedgera'],
    cypher:
      "MATCH (v:Person)-[:FOUNDED|:BUILT]->(p) RETURN p, v",
  },
  {
    id: 'data-science',
    label: 'Data Science',
    icon: 'line-chart',
    blurb:
      'Applied DS roots. Kaggle silver, ensembles, SHAP, forecasting, spatio-temporal analysis.',
    tags: [
      'Kaggle',
      'Forecasting',
      'SHAP',
      'Ensemble',
      'MLflow',
      'Visualization',
      'Data Analysis',
      'Volatility',
    ],
    pinned: [
      'ach-kaggle-silver',
      'ach-gq',
      'proj-kaggle-students',
      'proj-wifi',
    ],
    cypher:
      "MATCH (n) WHERE ANY(t IN n.tags WHERE t IN ['Kaggle','SHAP','Forecasting']) RETURN n",
  },
];

export function personaById(id: string): Persona | undefined {
  return personas.find((p) => p.id === id);
}
