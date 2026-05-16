/**
 * Deep-dive content for marquee projects. Rendered by the Detail Drawer when
 * a project node is selected and an entry exists for its id.
 */

export interface DeepDiveMetric {
  label: string;
  value: string;
}

export interface DeepDive {
  problem: string;
  approach: string;
  stack: string[];
  metrics: DeepDiveMetric[];
  whyItMatters: string;
}

export const deepDives: Record<string, DeepDive> = {
  'proj-humanslop': {
    problem:
      'Generative-AI content is colonising every social platform. There is no consumer space left that can prove humans wrote what they post.',
    approach:
      'Hardware-bound biometric attestation + real-time typing forensics. Every post is signed by behavioural signal that an LLM cannot fake at scale.',
    stack: ['React Native', 'Python', 'Supabase', 'Biometrics', 'TypeForensics'],
    metrics: [
      { label: 'AI content blocked', value: '100%' },
      { label: 'YC SUS India', value: 'Bengaluru 2026' },
      { label: 'Role', value: 'Co-founder' },
    ],
    whyItMatters:
      'Bet on a real future: the web needs verifiable humanness. Working on the demand side of the AI wave instead of the supply side.',
  },
  'proj-dml': {
    problem:
      'Most PyTorch users who want Deep Mutual Learning rewrite the training loop from scratch and tune it from research papers. Slow and error-prone.',
    approach:
      'Generic DML trainer that wraps any nn.Module set. Pluggable distillation loss, automatic peer averaging, gradient sync hooks.',
    stack: ['PyTorch', 'PyPI', 'CI/CD', 'Hypothesis'],
    metrics: [
      { label: 'Networks', value: 'N≥2 peer ensemble' },
      { label: 'Distribution', value: 'PyPI release' },
      { label: 'Loss types', value: 'KL · JS · custom' },
    ],
    whyItMatters:
      'Turns a paper into a library. Lowers the floor for collaborative training research.',
  },
  'proj-hedgera': {
    problem:
      'Quant teams stitch together feeds, models, and dashboards by hand. Nothing closes the loop between live market state and the model that trades on it.',
    approach:
      '7-layer architecture: streaming temporal data fabric → hybrid ML/RL forecasting → agentic LLM debate → causal knowledge graph → real-time risk engine. Multi-agent reasoning trades against a live tape.',
    stack: ['Pathway', 'PyTorch', 'LangChain', 'Causal Graphs', 'RL'],
    metrics: [
      { label: 'Backtested return', value: '~20%' },
      { label: 'Max drawdown', value: '5–8%' },
      { label: 'Team led', value: '8 engineers' },
    ],
    whyItMatters:
      'End-to-end demonstration that LLM agents + RL + streaming data can produce explainable, risk-bounded decisions.',
  },
  'proj-rapidadb': {
    problem:
      'Vector DBs are the bottleneck of every production RAG system. CPU implementations stall at sub-10K QPS, and most "GPU" options are wrappers, not native.',
    approach:
      'C++17 + CUDA from the ground up. Coalesced memory access on HNSW shards, pinned host buffers, async stream-aware batching, PyTorch bindings.',
    stack: ['CUDA', 'C++17', 'PyTorch', 'HNSW'],
    metrics: [
      { label: 'Search latency', value: 'Sub-millisecond target' },
      { label: 'Throughput', value: '100K+ QPS target' },
      { label: 'Surface', value: 'Python + native API' },
    ],
    whyItMatters:
      'If RAG eats the world, this is the brick the bottom layer is made of.',
  },
  'proj-evalforge': {
    problem:
      'ML models pass static accuracy gates and fail in production. Calibration drift, adversarial fragility, and class blind spots are invisible to most CI.',
    approach:
      'Open-source evaluation engine. Plug in a model + slice config, get a health report: calibration, robustness, blind spots, sub-population drift.',
    stack: ['Python', 'Pandas', 'Adversarial', 'Calibration'],
    metrics: [
      { label: 'Health checks', value: '3 families' },
      { label: 'Surface', value: 'CLI + library' },
      { label: 'License', value: 'Open source' },
    ],
    whyItMatters:
      'Production ML needs more than accuracy — it needs an automated MOT test. EvalForge is mine.',
  },
  'proj-paged-attn': {
    problem:
      'LLM inference is memory-bound. Naive KV-cache implementations OOM long before the model itself does.',
    approach:
      'Paged KV-cache with page tables, copy-on-write blocks, and stream-friendly eviction. Inspired by vLLM, written hands-on in CUDA.',
    stack: ['CUDA', 'Transformer', 'Inference', 'Python'],
    metrics: [
      { label: 'KV memory cut', value: '60–80%' },
      { label: 'Target', value: 'Production LLM serving' },
      { label: 'Layer', value: 'Inference runtime' },
    ],
    whyItMatters:
      'The KV cache is where most inference cost lives. Saving it is the cheapest path to serving more users per GPU.',
  },
  'proj-ayurveda-rag': {
    problem:
      'Generic RAG hallucinates on specialised medical knowledge. Practitioners need traceable, citation-bound responses, not vibes.',
    approach:
      'Multi-agent CRAG pipeline: retrieve → critique → retry → answer with citations. Hybrid BM25 + vector retrieval, GPT-4 + LangGraph orchestration.',
    stack: ['LangGraph', 'CRAG', 'FastAPI', 'GPT-4', 'BM25'],
    metrics: [
      { label: 'Agents', value: 'Multi-agent debate' },
      { label: 'Retrieval', value: 'BM25 + vector hybrid' },
      { label: 'Surface', value: 'FastAPI service' },
    ],
    whyItMatters:
      'A useful template for any high-stakes RAG: legal, medical, scientific. CRAG-style self-critique reduces hallucinations measurably.',
  },
};

export function deepDiveFor(id: string): DeepDive | undefined {
  return deepDives[id];
}
