/**
 * Portfolio graph "database".
 *
 * Nodes describe sections, experiences, projects, achievements, and skills.
 * Edges encode relationships (works_at, studied_at, built, used, …) so the
 * canvas can do meaningful traversals — neighbors, subgraphs, tag retrieval.
 *
 * `embedding?` is reserved for future semantic search but unused in v1.
 */

export type NodeKind =
  | 'hub'
  | 'section'
  | 'experience'
  | 'education'
  | 'project'
  | 'achievement'
  | 'skillGroup';

export type EdgeKind =
  | 'BELONGS_TO'
  | 'WORKED_AT'
  | 'STUDIED_AT'
  | 'BUILT'
  | 'FOUNDED'
  | 'USED'
  | 'AWARDED'
  | 'RELATED_TO';

export interface Position {
  x: number;
  y: number;
}

export interface SocialLink {
  label: string;
  href: string;
  icon:
    | 'mail'
    | 'github'
    | 'linkedin'
    | 'twitter'
    | 'file-text'
    | 'globe'
    | 'bar-chart'
    | 'code'
    | 'brain'
    | 'book-open';
}

export interface ExperienceDetail {
  kind: 'experience';
  role: string;
  org: string;
  location?: string;
  start: string;
  end: string;
  logo?: string;
  summary: string;
}

export interface EducationDetail {
  kind: 'education';
  degree: string;
  org: string;
  start: string;
  end: string;
  logo?: string;
  summary: string;
}

export interface ProjectDetail {
  kind: 'project';
  name: string;
  url?: string;
  summary: string;
  tags: string[];
  family: 'featured' | 'academic' | 'blade';
}

export interface AchievementDetail {
  kind: 'achievement';
  title: string;
  summary: string;
  icon:
    | 'award'
    | 'target'
    | 'rocket'
    | 'zap'
    | 'trophy'
    | 'book-open'
    | 'star';
}

export interface SkillsDetail {
  kind: 'skills';
  groups: { name: string; icon: 'brain-circuit' | 'code'; items: string[] }[];
  totalCount: number;
}

export interface AboutDetail {
  kind: 'about';
  body: string[];
}

export interface HubDetail {
  kind: 'hub';
  name: string;
  role: string;
  tagline?: string;
  badges?: string[];
  socials: SocialLink[];
  avatar: string;
}

export interface SectionDetail {
  kind: 'section';
  intro?: string;
}

export type NodeDetail =
  | HubDetail
  | SectionDetail
  | AboutDetail
  | ExperienceDetail
  | EducationDetail
  | ProjectDetail
  | AchievementDetail
  | SkillsDetail;

export interface GraphNode {
  id: string;
  kind: NodeKind;
  label: string;
  subtitle?: string;
  tags?: string[];
  position: Position;
  detail: NodeDetail;
  /** Reserved for future semantic search. */
  embedding?: number[];
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  kind: EdgeKind;
  label?: string;
}

/* ------------------------------------------------------------------ */
/* Layout — hand-tuned positions for an intentional, balanced canvas. */
/* ------------------------------------------------------------------ */

const HUB: Position = { x: 0, y: 0 };

const SECTION = {
  about: { x: -520, y: -340 },
  work: { x: 520, y: -340 },
  education: { x: 820, y: 40 },
  skills: { x: 560, y: 320 },
  achievements: { x: 880, y: 380 },
  featured: { x: -520, y: 280 },
  academic: { x: -880, y: 40 },
  blades: { x: 80, y: 560 },
} as const;

/* ------------------------------------------------------------------ */
/* Nodes                                                              */
/* ------------------------------------------------------------------ */

export const nodes: GraphNode[] = [
  {
    id: 'hub',
    kind: 'hub',
    label: 'Varun Rao',
    subtitle: 'AI/ML Engineer',
    position: HUB,
    detail: {
      kind: 'hub',
      name: 'Varun Rao',
      role: 'AI/ML Engineer · Kaggle Expert',
      tagline: 'Production systems that scale — LLMs, multi-agent AI, CUDA infra',
      badges: ['IIT Bhilai DSAI', 'Co-founder @ Human Slop', 'PyPI · 54 repos'],
      avatar: '/images/varun.jpeg',
      socials: [
        { label: 'Website', href: 'https://varunrao.is-a.dev', icon: 'globe' },
        { label: 'Email', href: 'mailto:varunr@iitbhilai.ac.in', icon: 'mail' },
        { label: 'GitHub', href: 'https://github.com/VARUN3WARE', icon: 'github' },
        { label: 'LinkedIn', href: 'https://linkedin.com/in/varun3ware/', icon: 'linkedin' },
        { label: 'X', href: 'https://x.com/varun_slops', icon: 'twitter' },
        {
          label: 'CV',
          href: 'https://drive.google.com/drive/folders/1yrDlBg_SEmawLK0RP3oR8HcV_j27OmFu',
          icon: 'file-text',
        },
        { label: 'Kaggle', href: 'https://www.kaggle.com/varunraosfanlkan', icon: 'bar-chart' },
        { label: 'Medium', href: 'https://medium.com/@varunrao.aiml', icon: 'book-open' },
        { label: 'LeetCode', href: 'https://leetcode.com/u/varunrao00924/', icon: 'code' },
      ],
    },
  },

  /* ---------- Section parents ---------- */
  {
    id: 'about',
    kind: 'section',
    label: 'About',
    subtitle: 'Origin story',
    position: SECTION.about,
    tags: ['intro'],
    detail: {
      kind: 'about',
      body: [
        'I build AI systems that work in production — not just in notebooks. Focus: LLMs, multi-agent architectures, GPU inference, and making ML actually deployable at scale.',
        'B.Tech in Data Science & AI at IIT Bhilai. Kaggle Expert. Published pytorch-dml on PyPI. 70+ technical articles on Medium (800+ monthly readers).',
        'Currently co-founding Human Slop — an anti-AI social platform with hardware-bound authentication and real-time typing forensics. Previously led an 8-person team shipping Hedgera, a multi-agent financial intelligence system.',
      ],
    },
  },
  {
    id: 'work',
    kind: 'section',
    label: 'Work',
    subtitle: 'Experience',
    position: SECTION.work,
    detail: { kind: 'section', intro: 'Roles where I shipped production AI systems.' },
  },
  {
    id: 'education',
    kind: 'section',
    label: 'Education',
    subtitle: 'IIT Bhilai',
    position: SECTION.education,
    detail: { kind: 'section' },
  },
  {
    id: 'featured',
    kind: 'section',
    label: 'Featured',
    subtitle: 'Pinned on GitHub',
    position: SECTION.featured,
    detail: { kind: 'section', intro: 'Production systems — shipped, published, and backtested.' },
  },
  {
    id: 'academic',
    kind: 'section',
    label: 'Academic',
    subtitle: 'Coursework & research',
    position: SECTION.academic,
    detail: { kind: 'section' },
  },
  {
    id: 'blades',
    kind: 'section',
    label: 'Personal Blades',
    subtitle: 'Side projects',
    position: SECTION.blades,
    detail: { kind: 'section' },
  },
  {
    id: 'skills',
    kind: 'section',
    label: 'Skills',
    subtitle: '36+ skills',
    position: SECTION.skills,
    detail: { kind: 'section' },
  },
  {
    id: 'achievements',
    kind: 'section',
    label: 'Achievements',
    subtitle: 'Recognition',
    position: SECTION.achievements,
    detail: { kind: 'section' },
  },

  /* ---------- Work ---------- */
  {
    id: 'exp-hedgera',
    kind: 'experience',
    label: 'Team Lead — AFI',
    subtitle: 'Independent Research · IIT Bhilai',
    position: { x: SECTION.work.x + 260, y: SECTION.work.y - 120 },
    tags: ['Multi-Agent', 'RL', 'FinTech', 'LLM'],
    detail: {
      kind: 'experience',
      role: 'Team Lead — Autonomous Financial Intelligence',
      org: 'Independent Research',
      location: 'IIT Bhilai',
      start: 'Oct 2025',
      end: 'Dec 2025',
      logo: '/images/team_lead.jpeg',
      summary:
        'Led an 8-member engineering team to architect a production-grade multi-agent financial AI system combining real-time streaming, reinforcement learning, and explainable LLM reasoning. Designed a 7-layer architecture with temporal data fabric, hybrid ML/RL forecasting pipeline, agentic debate framework, and real-time risk engine. Delivered an end-to-end platform integrating live market, news, and social data with a causal knowledge graph — backtested ~20% returns at 5–8% max drawdown.',
    },
  },
  {
    id: 'exp-kartavya',
    kind: 'experience',
    label: 'AI Developer Intern',
    subtitle: 'Kartavya Technology · Remote',
    position: { x: SECTION.work.x + 320, y: SECTION.work.y + 80 },
    tags: ['Multi-Agent', 'AWS', 'GCP', 'APIs'],
    detail: {
      kind: 'experience',
      role: 'AI Developer Intern',
      org: 'Kartavya Technology',
      location: 'Remote',
      start: 'Jun 2024',
      end: 'Aug 2024',
      logo: '/images/kartavya.jpeg',
      summary:
        'Built multi-agent automation systems and secure REST APIs integrated with AWS and GCP, reducing manual effort by 40% and increasing throughput by 30%. Maintained 99.9% uptime with CI/CD pipelines and cut infrastructure costs 25% through proactive monitoring and risk assessment.',
    },
  },

  /* ---------- Education ---------- */
  {
    id: 'edu-iitbh',
    kind: 'education',
    label: 'IIT Bhilai',
    subtitle: 'B.Tech, Data Science & AI',
    position: { x: SECTION.education.x + 240, y: SECTION.education.y - 60 },
    tags: ['Data Science', 'AI', 'Coursework'],
    detail: {
      kind: 'education',
      degree: 'B.Tech in Data Science and AI',
      org: 'Indian Institute of Technology Bhilai',
      start: 'Aug 2023',
      end: 'May 2027 (Expected)',
      logo: '/images/iit_bhilai_logo.jpeg',
      summary:
        'Coordinator, DSAI Club — organized hackathons and workshops promoting AI-driven innovation across 200+ students. Led hands-on ML sessions for applied and research-oriented projects. Coursework: DSA, ML, NLP, DL, DBMS, Statistics, Operating Systems.',
    },
  },

  /* ---------- Featured projects ---------- */
  {
    id: 'proj-humanslop',
    kind: 'project',
    label: 'humanslop',
    subtitle: 'Anti-AI social',
    position: { x: SECTION.featured.x - 240, y: SECTION.featured.y - 110 },
    tags: ['Python', 'React Native', 'Supabase', 'Biometrics'],
    detail: {
      kind: 'project',
      name: 'humanslop',
      url: 'https://github.com/VARUN3WARE/humanslop',
      family: 'featured',
      summary:
        'Privacy-first social platform blocking 100% of AI-generated content. Hardware-bound auth, real-time keystroke forensics (WPM, burst patterns), dual-database architecture. Fully deployed on Web + Mobile. Co-founded · YC SUS India 2026.',
      tags: ['Python', 'React Native', 'Supabase', 'Biometrics'],
    },
  },
  {
    id: 'proj-dml',
    kind: 'project',
    label: 'pytorch-dml',
    subtitle: 'Deep Mutual Learning',
    position: { x: SECTION.featured.x - 320, y: SECTION.featured.y + 110 },
    tags: ['PyTorch', 'DML', 'Deep Learning', 'PyPI'],
    detail: {
      kind: 'project',
      name: 'pytorch-dml',
      url: 'https://github.com/VARUN3WARE/dml-py',
      family: 'featured',
      summary:
        'Production-ready PyTorch library for Deep Mutual Learning — 7,000+ LOC, 34 modular components. AMP, DDP, ONNX export, full test coverage. 2–5% accuracy gains over independent training. Published on PyPI.',
      tags: ['PyTorch', 'DML', 'Deep Learning', 'PyPI'],
    },
  },
  {
    id: 'proj-hedgera',
    kind: 'project',
    label: 'Hedgera',
    subtitle: 'Multi-agent finance',
    position: { x: SECTION.featured.x - 60, y: SECTION.featured.y + 220 },
    tags: ['Pathway', 'PyTorch', 'LangChain', 'FinTech'],
    detail: {
      kind: 'project',
      name: 'Hedgera',
      url: 'https://github.com/VARUN3WARE/Hedgera',
      family: 'featured',
      summary:
        'Autonomous Financial Intelligence Platform. 7-layer multi-agent system: temporal data fabric, hybrid ML/RL forecasting, agentic LLM debate, causal knowledge graph. ~20% backtested returns at 5–8% max drawdown. Led 8-person team.',
      tags: ['Pathway', 'PyTorch', 'LangChain', 'FinTech'],
    },
  },

  {
    id: 'proj-ayurveda-rag',
    kind: 'project',
    label: 'Ayurveda-RAG',
    subtitle: 'Pinned · medical CRAG',
    position: { x: SECTION.featured.x + 80, y: SECTION.featured.y - 40 },
    tags: ['LangGraph', 'CRAG', 'GPT-4', 'FastAPI'],
    detail: {
      kind: 'project',
      name: 'Kerala-Ayurveda-RAG',
      url: 'https://github.com/VARUN3WARE/Kerala-Ayurveda-RAG',
      family: 'featured',
      summary:
        'Production-grade multi-agent medical RAG with CRAG framework. Hybrid BM25 + vector retrieval, contraindication checks. <10% hallucination rate (RAGAS), 35% retrieval improvement. GPT-4 + LangGraph + Streamlit.',
      tags: ['LangGraph', 'CRAG', 'GPT-4', 'FastAPI'],
    },
  },

  /* ---------- Academic projects ---------- */
  {
    id: 'proj-respect-gnn',
    kind: 'project',
    label: 'RErespect-GNN',
    subtitle: 'ST-GNN for RT-TDDFT',
    position: { x: SECTION.academic.x - 200, y: SECTION.academic.y - 220 },
    tags: ['GNN', 'Quantum Chemistry', 'PyTorch Geometric'],
    detail: {
      kind: 'project',
      name: 'RErespect-GNN',
      url: 'https://github.com/VARUN3WARE/Electron',
      family: 'academic',
      summary:
        'Spatial-temporal Graph Neural Network for predicting electron oscillation dynamics with high spectral fidelity in RT-TDDFT simulations.',
      tags: ['GNN', 'Quantum Chemistry', 'PyTorch Geometric'],
    },
  },
  {
    id: 'proj-pplm-poetry',
    kind: 'project',
    label: 'Contextual Poetry',
    subtitle: 'PPLM + RLHF',
    position: { x: SECTION.academic.x - 260, y: SECTION.academic.y - 60 },
    tags: ['RLHF', 'PPLM', 'NLP'],
    detail: {
      kind: 'project',
      name: 'Reciprocal Contextual Poetry Generation',
      url: 'https://github.com/VARUN3WARE/Reciprocal-Contextual-Poetry-Generation/',
      family: 'academic',
      summary:
        'Modular experiment framework combining PPLM steering, a lightweight RLHF proxy, and hybrid inference-time control.',
      tags: ['RLHF', 'PPLM', 'NLP'],
    },
  },
  {
    id: 'proj-bomberman',
    kind: 'project',
    label: 'Bomberman-AI',
    subtitle: 'A* + state machines',
    position: { x: SECTION.academic.x - 200, y: SECTION.academic.y + 100 },
    tags: ['Agent AI', 'Pathfinding', 'Tkinter'],
    detail: {
      kind: 'project',
      name: 'Bomberman-AI',
      url: 'https://github.com/VARUN3WARE/Bomberman-AI-Project-Group-17-CSL304-Artificial-Intelligence-',
      family: 'academic',
      summary:
        'Intelligent agent-based game with state-based behavior (search, chase, evade) and A* pathfinding.',
      tags: ['Agent AI', 'Pathfinding', 'Tkinter'],
    },
  },
  {
    id: 'proj-wifi',
    kind: 'project',
    label: 'Wi-Fi Signal Analysis',
    subtitle: 'Spatio-temporal viz',
    position: { x: SECTION.academic.x - 80, y: SECTION.academic.y + 220 },
    tags: ['Data Analysis', 'Visualization', 'Networks'],
    detail: {
      kind: 'project',
      name: 'Wi-Fi Signal Strength Analysis',
      url: 'https://github.com/VARUN3WARE/DAV-Project',
      family: 'academic',
      summary:
        'Spatio-temporal analysis and visualization of network signal distributions across building wings to optimize coverage placement.',
      tags: ['Data Analysis', 'Visualization', 'Networks'],
    },
  },
  {
    id: 'proj-gnn-eadd',
    kind: 'project',
    label: 'GNN-EADD',
    subtitle: 'Anomaly detection',
    position: { x: SECTION.academic.x + 60, y: SECTION.academic.y - 220 },
    tags: ['GNN', 'Anomaly Detection', 'CUDA'],
    detail: {
      kind: 'project',
      name: 'GNN-EADD',
      url: 'https://github.com/Sarthak-GS/GNN-EADD-Commerce_Anomaly_Detection',
      family: 'academic',
      summary:
        'Graph Neural Network pipeline for anomaly detection in e-commerce graphs using GIME for learning and GAT for classification.',
      tags: ['GNN', 'Anomaly Detection', 'CUDA'],
    },
  },
  {
    id: 'proj-bplussql',
    kind: 'project',
    label: 'BPlusSQL',
    subtitle: 'C++ storage engine',
    position: { x: SECTION.academic.x + 40, y: SECTION.academic.y + 220 },
    tags: ['C++17', 'DBMS', 'Storage Engine'],
    detail: {
      kind: 'project',
      name: 'BPlusSQL',
      url: 'https://github.com/VARUN3WARE/BPlusSQL',
      family: 'academic',
      summary:
        'High-performance B+ tree storage engine in C++17: LRU buffer pool, WAL crash recovery, SQL layer, and TCP server. Pinned on GitHub.',
      tags: ['C++17', 'DBMS', 'Storage Engine'],
    },
  },

  /* ---------- Personal blades ---------- */
  {
    id: 'proj-rapidadb',
    kind: 'project',
    label: 'RapidaDB',
    subtitle: 'GPU vector DB',
    position: { x: SECTION.blades.x - 360, y: SECTION.blades.y + 60 },
    tags: ['CUDA', 'C++', 'Vector DB', 'PyTorch'],
    detail: {
      kind: 'project',
      name: 'RapidaDB',
      url: 'https://github.com/VARUN3WARE/RAPIDADB',
      family: 'blade',
      summary:
        'GPU-native vector database in C++/CUDA targeting sub-millisecond search and 100K+ QPS for production RAG systems.',
      tags: ['CUDA', 'C++', 'Vector DB', 'PyTorch'],
    },
  },
  {
    id: 'proj-evalforge',
    kind: 'project',
    label: 'EvalForge',
    subtitle: 'ML eval engine',
    position: { x: SECTION.blades.x - 160, y: SECTION.blades.y + 220 },
    tags: ['ML Evaluation', 'Reliability', 'Diagnostics'],
    detail: {
      kind: 'project',
      name: 'EvalForge',
      url: 'https://github.com/VARUN3WARE/evalforge',
      family: 'blade',
      summary:
        'Open-source evaluation engine for ML model health. Detects calibration mismatch, adversarial fragility, and blind spots.',
      tags: ['ML Evaluation', 'Reliability', 'Diagnostics'],
    },
  },
  {
    id: 'proj-paged-attn',
    kind: 'project',
    label: 'PagedAttention',
    subtitle: 'KV cache',
    position: { x: SECTION.blades.x + 280, y: SECTION.blades.y + 60 },
    tags: ['CUDA', 'Transformer', 'Inference'],
    detail: {
      kind: 'project',
      name: 'PagedAttention-Transformer',
      url: 'https://github.com/VARUN3WARE/paged-Attention',
      family: 'blade',
      summary:
        'Memory-efficient KV-cache implementation reducing usage by 60–80% for production LLM deployment.',
      tags: ['CUDA', 'Transformer', 'Inference'],
    },
  },
  {
    id: 'proj-pplm-watermark',
    kind: 'project',
    label: 'PPLM Watermarking',
    subtitle: 'Inference control',
    position: { x: SECTION.blades.x + 280, y: SECTION.blades.y - 110 },
    tags: ['Watermarking', 'PPLM', 'Inference Control'],
    detail: {
      kind: 'project',
      name: 'PPLM Watermarking',
      url: 'https://github.com/VARUN3WARE/pplm-watermark',
      family: 'blade',
      summary:
        'Statistical text watermarking using Plug-and-Play Language Models for imperceptible watermark embedding during inference.',
      tags: ['Watermarking', 'PPLM', 'Inference Control'],
    },
  },
  {
    id: 'proj-kaggle-students',
    kind: 'project',
    label: 'Student Performance',
    subtitle: 'Kaggle ensemble',
    position: { x: SECTION.blades.x - 360, y: SECTION.blades.y - 110 },
    tags: ['SHAP', 'Ensemble', 'MLflow'],
    detail: {
      kind: 'project',
      name: 'Student Performance Enhancer',
      url: 'https://github.com/VARUN3WARE/kaggle-Student-Performance',
      family: 'blade',
      summary:
        'Engineered v2 of the Kaggle Student Performance Enhancer with ensemble models (R² 0.989) and SHAP explainability.',
      tags: ['SHAP', 'Ensemble', 'MLflow'],
    },
  },

  /* ---------- Skills (single rich node + tag map) ---------- */
  {
    id: 'skills-detail',
    kind: 'skillGroup',
    label: 'Skills overview',
    subtitle: 'AI · Languages',
    position: { x: SECTION.skills.x + 240, y: SECTION.skills.y + 140 },
    tags: ['PyTorch', 'Python', 'C++', 'LangChain'],
    detail: {
      kind: 'skills',
      totalCount: 36,
      groups: [
        {
          name: 'AI / ML / DL',
          icon: 'brain-circuit',
          items: [
            'PyTorch',
            'TensorFlow',
            'Transformers',
            'Hugging Face',
            'XGBoost',
            'OpenCV',
            'RL',
          ],
        },
        {
          name: 'LLMs & Agentic AI',
          icon: 'brain-circuit',
          items: [
            'GPT-4',
            'LangChain',
            'LangGraph',
            'RAG',
            'Fine-tuning',
            'Multi-Agent Systems',
          ],
        },
        {
          name: 'Languages',
          icon: 'code',
          items: ['Python', 'C++', 'JavaScript', 'SQL', 'Bash'],
        },
        {
          name: 'MLOps & Infra',
          icon: 'code',
          items: ['Docker', 'Kubernetes', 'MLflow', 'DVC', 'GCP', 'AWS', 'CI/CD'],
        },
        {
          name: 'Data & Storage',
          icon: 'code',
          items: ['PostgreSQL', 'MongoDB', 'Neo4j', 'FAISS', 'ChromaDB', 'Pinecone'],
        },
      ],
    },
  },

  /* ---------- Achievements ---------- */
  {
    id: 'ach-kaggle-expert',
    kind: 'achievement',
    label: 'Kaggle Expert',
    subtitle: 'Silver + Top 10%',
    position: { x: SECTION.achievements.x + 80, y: SECTION.achievements.y - 360 },
    tags: ['Kaggle', 'Expert'],
    detail: {
      kind: 'achievement',
      icon: 'star',
      title: 'Kaggle Expert',
      summary:
        'Expert-tier competitor. Silver medal (MITSUI, rank 36/1,711) and Top 10% (GQ Volatility, rank 34/386).',
    },
  },
  {
    id: 'ach-kaggle-silver',
    kind: 'achievement',
    label: 'Kaggle Silver — MITSUI',
    subtitle: 'Top 2% · 36/1711',
    position: { x: SECTION.achievements.x + 280, y: SECTION.achievements.y - 220 },
    tags: ['Kaggle', 'Forecasting'],
    detail: {
      kind: 'achievement',
      icon: 'award',
      title: 'Kaggle Silver Medal — MITSUI & CO. Commodity Prediction',
      summary: 'Ranked 36/1,711 teams (top 2%) building stable commodity return forecasting models.',
    },
  },
  {
    id: 'ach-gq',
    kind: 'achievement',
    label: 'Kaggle Top 10% — GQ',
    subtitle: 'ETH volatility · 34/386',
    position: { x: SECTION.achievements.x + 320, y: SECTION.achievements.y - 60 },
    tags: ['Kaggle', 'Volatility'],
    detail: {
      kind: 'achievement',
      icon: 'target',
      title: 'Kaggle Top 10% — GQ Volatility Forecasting',
      summary:
        'Ranked 34/386 forecasting Ethereum volatility with high-frequency data in a 2-week intense competition.',
    },
  },
  {
    id: 'ach-yc',
    kind: 'achievement',
    label: 'YC SUS India 2026',
    subtitle: 'Bengaluru · Human Slop',
    position: { x: SECTION.achievements.x + 320, y: SECTION.achievements.y + 100 },
    tags: ['YC', 'Startup'],
    detail: {
      kind: 'achievement',
      icon: 'rocket',
      title: 'YC SUS India Bengaluru 2026',
      summary: 'Co-founding Human Slop — anti-AI social platform with typing forensics.',
    },
  },
  {
    id: 'ach-amazon',
    kind: 'achievement',
    label: 'Amazon ML 2025',
    subtitle: 'AIR 278',
    position: { x: SECTION.achievements.x + 280, y: SECTION.achievements.y + 260 },
    tags: ['VLM', 'Competition'],
    detail: {
      kind: 'achievement',
      icon: 'zap',
      title: 'Amazon ML Challenge 2025 — All-India Rank 278',
      summary: 'Competed among thousands of participants nationwide building a robust VLM-based solution.',
    },
  },
  {
    id: 'ach-pixel-perfect',
    kind: 'achievement',
    label: 'Pixel Perfect Winner',
    subtitle: 'IIT Bhilai · +23% baseline',
    position: { x: SECTION.achievements.x + 120, y: SECTION.achievements.y + 320 },
    tags: ['Hackathon', 'ML'],
    detail: {
      kind: 'achievement',
      icon: 'trophy',
      title: 'Pixel Perfect Hackathon Winner (IIT Bhilai)',
      summary: 'Led the team to improve baseline ML results by 23% under tight computational constraints.',
    },
  },
  {
    id: 'ach-medium',
    kind: 'achievement',
    label: 'Medium Writer',
    subtitle: '70+ articles · 800+ readers',
    position: { x: SECTION.achievements.x + 80, y: SECTION.achievements.y + 180 },
    tags: ['Writing', 'ML'],
    detail: {
      kind: 'achievement',
      icon: 'book-open',
      title: 'Technical Writer — Medium',
      summary:
        '70+ ML/AI articles on production systems, LLMs, and competitions. 800+ monthly readers.',
    },
  },
  {
    id: 'ach-iitg',
    kind: 'achievement',
    label: 'IIT Guwahati Bootcamp',
    subtitle: 'Top 10% · 500+ participants',
    position: { x: SECTION.achievements.x + 80, y: SECTION.achievements.y + 400 },
    tags: ['Bootcamp', 'Data Science'],
    detail: {
      kind: 'achievement',
      icon: 'target',
      title: 'Top 10% — IIT Guwahati Data Science Bootcamp',
      summary: 'Ranked among top performers nationwide in an intensive data science program.',
    },
  },
];

/* ------------------------------------------------------------------ */
/* Edges                                                              */
/* ------------------------------------------------------------------ */

const edge = (
  source: string,
  target: string,
  kind: EdgeKind,
  label?: string,
): GraphEdge => ({
  id: `${source}__${kind}__${target}`,
  source,
  target,
  kind,
  label,
});

const sections = [
  'about',
  'work',
  'education',
  'featured',
  'academic',
  'blades',
  'skills',
  'achievements',
] as const;

export const edges: GraphEdge[] = [
  // Hub → sections
  ...sections.map((s) => edge('hub', s, 'BELONGS_TO')),

  // Work hierarchy
  edge('work', 'exp-hedgera', 'BELONGS_TO'),
  edge('work', 'exp-kartavya', 'BELONGS_TO'),
  edge('hub', 'exp-hedgera', 'WORKED_AT', 'Team Lead'),
  edge('hub', 'exp-kartavya', 'WORKED_AT', 'Intern'),

  // Education hierarchy
  edge('education', 'edu-iitbh', 'BELONGS_TO'),
  edge('hub', 'edu-iitbh', 'STUDIED_AT'),

  // Featured projects
  edge('featured', 'proj-humanslop', 'BELONGS_TO'),
  edge('featured', 'proj-dml', 'BELONGS_TO'),
  edge('featured', 'proj-hedgera', 'BELONGS_TO'),
  edge('featured', 'proj-ayurveda-rag', 'BELONGS_TO'),
  edge('hub', 'proj-humanslop', 'FOUNDED', 'Co-founder'),
  edge('hub', 'proj-dml', 'BUILT'),
  edge('hub', 'proj-hedgera', 'BUILT'),
  edge('hub', 'proj-ayurveda-rag', 'BUILT'),
  
  // Experience-to-Project mappings
  edge('exp-hedgera', 'proj-hedgera', 'RELATED_TO', 'shipped'),
  edge('exp-kartavya', 'proj-ayurveda-rag', 'RELATED_TO', 'RAG dev'),

  // Academic hierarchy
  edge('academic', 'proj-respect-gnn', 'BELONGS_TO'),
  edge('academic', 'proj-pplm-poetry', 'BELONGS_TO'),
  edge('academic', 'proj-bomberman', 'BELONGS_TO'),
  edge('academic', 'proj-wifi', 'BELONGS_TO'),
  edge('academic', 'proj-gnn-eadd', 'BELONGS_TO'),
  edge('academic', 'proj-bplussql', 'BELONGS_TO'),
  
  // Coursework / Research mappings
  edge('edu-iitbh', 'proj-respect-gnn', 'RELATED_TO', 'research'),
  edge('edu-iitbh', 'proj-bplussql', 'RELATED_TO', 'DBMS course'),
  edge('edu-iitbh', 'proj-bomberman', 'RELATED_TO', 'AI course'),
  edge('edu-iitbh', 'proj-wifi', 'RELATED_TO', 'Data Viz'),
  edge('edu-iitbh', 'proj-gnn-eadd', 'RELATED_TO', 'research'),

  // Blades hierarchy
  edge('blades', 'proj-rapidadb', 'BELONGS_TO'),
  edge('blades', 'proj-evalforge', 'BELONGS_TO'),
  edge('blades', 'proj-paged-attn', 'BELONGS_TO'),
  edge('blades', 'proj-pplm-watermark', 'BELONGS_TO'),
  edge('blades', 'proj-kaggle-students', 'BELONGS_TO'),

  // --- Peer-to-Peer Technical "Blades" Relationships ---
  // CUDA / High-Performance Systems Cluster
  edge('proj-rapidadb', 'proj-paged-attn', 'RELATED_TO', 'CUDA optimization'),
  edge('proj-rapidadb', 'proj-bplussql', 'RELATED_TO', 'systems engineering'),
  edge('proj-paged-attn', 'proj-dml', 'RELATED_TO', 'DL inference'),
  
  // GNN / Graph Cluster
  edge('proj-respect-gnn', 'proj-gnn-eadd', 'RELATED_TO', 'GNN architecture'),
  
  // LLM Steering / Watermarking Cluster
  edge('proj-pplm-watermark', 'proj-pplm-poetry', 'RELATED_TO', 'PPLM steering'),
  
  // Agentic / RAG Cluster
  edge('proj-hedgera', 'proj-ayurveda-rag', 'RELATED_TO', 'multi-agent RAG'),

  // Skills cluster
  edge('skills', 'skills-detail', 'BELONGS_TO'),
  edge('exp-hedgera', 'skills-detail', 'USED', 'PyTorch · LangChain · RL'),
  edge('proj-dml', 'skills-detail', 'USED', 'PyTorch'),
  edge('proj-ayurveda-rag', 'skills-detail', 'USED', 'LangGraph · RAG'),
  edge('proj-rapidadb', 'skills-detail', 'USED', 'C++ · CUDA'),
  edge('proj-respect-gnn', 'skills-detail', 'USED', 'GNN · PyG'),

  // Achievements hierarchy
  edge('achievements', 'ach-kaggle-expert', 'BELONGS_TO'),
  edge('achievements', 'ach-kaggle-silver', 'BELONGS_TO'),
  edge('achievements', 'ach-gq', 'BELONGS_TO'),
  edge('achievements', 'ach-yc', 'BELONGS_TO'),
  edge('achievements', 'ach-amazon', 'BELONGS_TO'),
  edge('achievements', 'ach-pixel-perfect', 'BELONGS_TO'),
  edge('achievements', 'ach-medium', 'BELONGS_TO'),
  edge('achievements', 'ach-iitg', 'BELONGS_TO'),
  
  // Achievement Contextual links
  edge('ach-kaggle-expert', 'ach-kaggle-silver', 'RELATED_TO', 'MITSUI medal'),
  edge('ach-kaggle-expert', 'ach-gq', 'RELATED_TO', 'GQ top 10%'),
  edge('ach-medium', 'hub', 'RELATED_TO', 'writing'),
  edge('ach-yc', 'proj-humanslop', 'RELATED_TO', 'startup'),
  edge('ach-amazon', 'proj-respect-gnn', 'RELATED_TO', 'deep research'),
  edge('ach-kaggle-silver', 'proj-kaggle-students', 'RELATED_TO', 'ensemble tech'),
  edge('ach-pixel-perfect', 'proj-gnn-eadd', 'RELATED_TO', 'competition'),
];
