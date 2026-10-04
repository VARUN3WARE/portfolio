/**
 * The seven Dragon Balls. Each ball is one chapter of the portfolio; the
 * star count is the ball's identity (and its order on the radar).
 * Content is pulled from `portfolioGraph` nodes by id so there is a single
 * source of truth for project copy.
 */

import { nodes, type GraphNode } from './portfolioGraph';

export type Stars = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface ChapterStat {
  value: string;
  label: string;
}

export interface ChapterLink {
  label: string;
  href: string;
}

export interface ChapterPost {
  title: string;
  blurb: string;
  date: string;
  tags: string[];
  href: string;
}

export interface Chapter {
  id: string;
  stars: Stars;
  title: string;
  /** Short line under the ball on the radar. */
  kicker: string;
  thesis: string;
  /** A quiet aside, shown in serif italics under the thesis. */
  aside?: string;
  stats: ChapterStat[];
  items: string[];
  posts?: ChapterPost[];
  links?: ChapterLink[];
  layout?: 'cards' | 'journey';
  /** Radar position: angle in degrees (0 = up, clockwise) and radius 0..1. */
  radar: { angle: number; radius: number };
}

export const chapters: Chapter[] = [
  {
    id: 'open-source',
    stars: 1,
    title: 'Open Source',
    kicker: '19 merged PRs',
    thesis:
      'Shipping inside other people’s codebases. Most of my upstream work is about making tools fail loudly and correctly instead of silently.',
    stats: [
      { value: '19', label: 'merged upstream PRs' },
      { value: '4', label: 'orgs: HFlow, ARGUS, NVIDIA, kornia' },
      { value: '2', label: 'open in shap, in review' },
    ],
    items: ['oss-hflow', 'oss-argus', 'oss-nvcf', 'oss-kornia', 'oss-shap'],
    links: [{ label: 'All my PRs on GitHub', href: 'https://github.com/pulls?q=is%3Apr+author%3AVARUN3WARE+is%3Amerged' }],
    radar: { angle: 328, radius: 0.68 },
  },
  {
    id: 'ai-infra',
    stars: 2,
    title: 'AI Infrastructure',
    kicker: 'CUDA · storage · KV cache',
    thesis:
      'The substrate AI runs on: GPU-native vector search, paged KV caches, storage engines, and simulators that only make sense on accelerators.',
    stats: [
      { value: '60–80%', label: 'KV-cache memory saved' },
      { value: '100K+', label: 'QPS target, GPU vector DB' },
      { value: 'C++ · CUDA · JAX', label: 'where it lives' },
    ],
    items: ['proj-rapidadb', 'proj-paged-attn', 'proj-bplussql', 'proj-arthjax'],
    radar: { angle: 32, radius: 0.72 },
  },
  {
    id: 'llm-systems',
    stars: 3,
    title: 'LLM Systems & Agents',
    kicker: 'agents · RAG · evals',
    thesis:
      'Multi-agent pipelines that are measured, critiqued, and caught when they fail, from trading desks to medical RAG.',
    stats: [
      { value: '~20%', label: 'backtested return, Hedgera' },
      { value: '8', label: 'engineers led' },
      { value: '<10%', label: 'hallucination rate, medical RAG' },
    ],
    items: ['proj-hedgera', 'proj-ayurveda-rag', 'proj-evalforge', 'proj-pplm-watermark'],
    radar: { angle: 92, radius: 0.64 },
  },
  {
    id: 'journey',
    stars: 4,
    title: 'Journey',
    kicker: 'the story so far',
    thesis:
      'Started as a data scientist wrangling messy datasets, fell hard for AI systems, then co-founded an anti-AI social network because the irony was too good.',
    aside: 'Kids, let me tell you how I got into AI.',
    stats: [
      { value: 'IIT Bhilai', label: 'B.Tech, Data Science & AI' },
      { value: 'Shipd', label: 'contributor at Datacurve AI' },
      { value: '1', label: 'company co-founded' },
    ],
    items: ['edu-iitbh', 'exp-kartavya', 'exp-hedgera', 'proj-humanslop', 'exp-shipd'],
    layout: 'journey',
    radar: { angle: 214, radius: 0.26 },
  },
  {
    id: 'research',
    stars: 5,
    title: 'Research',
    kicker: 'GNNs · DML · RLHF',
    thesis:
      'Deep learning fundamentals: graph networks for electron dynamics, mutual learning shipped as a PyPI library, steering language models at inference time.',
    stats: [
      { value: 'PyPI', label: 'pytorch-dml, published' },
      { value: '2', label: 'GNN research projects' },
      { value: 'RLHF', label: 'and PPLM steering' },
    ],
    items: ['proj-dml', 'proj-respect-gnn', 'proj-gnn-eadd', 'proj-pplm-poetry', 'proj-bomberman', 'proj-wifi'],
    radar: { angle: 150, radius: 0.72 },
  },
  {
    id: 'competitions',
    stars: 6,
    title: 'Competitions',
    kicker: 'Kaggle Expert',
    thesis: 'Leaderboards keep me honest. Fixed deadlines, hidden test sets, no room for vibes.',
    aside: 'Legen — wait for it — dary.',
    stats: [
      { value: 'Top 2%', label: 'Kaggle silver, 36 of 1,711' },
      { value: 'AIR 278', label: 'Amazon ML Challenge 2025' },
      { value: '+23%', label: 'over baseline, hackathon win' },
    ],
    items: ['ach-kaggle-silver', 'ach-gq', 'ach-amazon', 'ach-pixel-perfect'],
    radar: { angle: 212, radius: 0.7 },
  },
  {
    id: 'writing',
    stars: 7,
    title: 'Writing',
    kicker: '70+ articles',
    thesis:
      'I write the explainer I wish I had: deep enough to be correct, plain enough that you can explain it in front of anyone.',
    stats: [
      { value: '70+', label: 'articles on Medium' },
      { value: '800+', label: 'monthly readers' },
      { value: 'LLM infra', label: 'serving, RAG, vector DBs' },
    ],
    items: [],
    posts: [
      {
        title: 'PagedAttention vs Continuous Batching vs vLLM vs SGLang: A Practical Breakdown',
        blurb: 'How KV-cache paging and smarter batching keep LLM serving from melting your GPU memory.',
        date: 'Dec 18, 2025',
        tags: ['LLM Serving', 'vLLM', 'KV Cache'],
        href: 'https://python.plainenglish.io/pagedattention-vs-continuous-batching-vs-vllm-vs-sglang-a-practical-breakdown-4c19cc9e21c0',
      },
      {
        title: 'Stop Using Chunk Size 512: A Data-Driven Guide to Chunking That Actually Works',
        blurb: 'Why fixed-size chunking quietly wrecks RAG retrieval, and what to measure instead.',
        date: 'Dec 17, 2025',
        tags: ['RAG', 'Chunking', 'Retrieval'],
        href: 'https://python.plainenglish.io/stop-using-chunk-size-512-a-data-driven-guide-to-chunking-that-actually-works-cf7044731fcb',
      },
      {
        title: 'We Need to Stop Using FAISS by Default: Benchmarking 8 Vector Databases',
        blurb: 'FAISS was built for research. Benchmarks of eight vector databases on real production use cases.',
        date: 'Dec 2, 2025',
        tags: ['Vector DBs', 'FAISS', 'Benchmarks'],
        href: 'https://python.plainenglish.io/we-need-to-stop-using-faiss-by-default-benchmarking-8-vector-databases-for-real-use-cases-21cf52caf725',
      },
      {
        title: 'Ubuntu 22.04 vs 24.04: The Brutal Truth Every AI/ML Engineer Needs to Know',
        blurb: 'GPU drivers, CUDA and the 3 AM debugging sessions: which LTS actually saves you weeks.',
        date: 'Aug 16, 2025',
        tags: ['Ubuntu', 'CUDA', 'MLOps'],
        href: 'https://python.plainenglish.io/ubuntu-22-04-vs-24-04-the-brutal-truth-every-ai-ml-engineer-needs-to-know-f0f55dad4931',
      },
    ],
    links: [
      { label: 'Read on Medium', href: 'https://medium.com/@varunrao.aiml' },
      { label: 'Follow on X', href: 'https://x.com/varun_slops' },
    ],
    radar: { angle: 272, radius: 0.62 },
  },
];

export const SOCIALS = {
  email: 'mailto:varunr@iitbhilai.ac.in',
  github: 'https://github.com/VARUN3WARE',
  linkedin: 'https://linkedin.com/in/varun3ware/',
  x: 'https://x.com/varun_slops',
  medium: 'https://medium.com/@varunrao.aiml',
  cv: 'https://drive.google.com/drive/folders/1yrDlBg_SEmawLK0RP3oR8HcV_j27OmFu',
};

/** Which balls a cold read points a recruiter to, by persona id. */
export const PERSONA_CHAPTERS: Record<string, string[]> = {
  'ai-infra': ['ai-infra', 'open-source'],
  'llm-systems': ['llm-systems', 'open-source'],
  research: ['research', 'ai-infra'],
  startup: ['journey', 'llm-systems'],
  'data-science': ['competitions', 'research'],
  'open-source': ['open-source', 'ai-infra'],
};

const byId = new Map(nodes.map((n) => [n.id, n]));

export function nodeFor(id: string): GraphNode | undefined {
  return byId.get(id);
}

export function chapterById(id: string): Chapter | undefined {
  return chapters.find((c) => c.id === id);
}

export function skillGroups() {
  const node = byId.get('skills-detail');
  return node?.detail.kind === 'skills' ? node.detail.groups : [];
}
