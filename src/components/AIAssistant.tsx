import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Bot, Sparkles, Terminal } from 'lucide-react';
import { semanticSearch } from '../lib/embeddings';
import { nodes } from '../data/portfolioGraph';
import './ai-assistant.css';

interface Message {
  role: 'bot' | 'user';
  content: string;
  nodeId?: string;
}

const INITIAL_MESSAGE = "Hi! I'm Varun's AI shadow. I can help you navigate his work, skills, and background. What would you like to know?";

const SUGGESTIONS = [
  "Tell me about your AI skills",
  "What is your best project?",
  "Tell me about Human Slop",
  "How can I hire you?"
];

export function AIAssistant({ 
  onNodeSelect 
}: { 
  onNodeSelect: (id: string) => void 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: INITIAL_MESSAGE }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setIsTyping(true);

    // Simulate "thinking" time for that "AI" feel
    await new Promise(resolve => setTimeout(resolve, 800));

    const hits = semanticSearch(text, 3);
    const topHit = hits[0];

    let response = "";
    let nodeId: string | undefined;

    if (topHit && topHit.score > 0.15) {
      const node = nodes.find(n => n.id === topHit.id);
      if (node) {
        nodeId = node.id;
        const summary = node.detail.kind === 'project' ? node.detail.summary : node.label;
        response = `Based on your query, you might be interested in **${node.label}**. ${summary}`;
        
        if (topHit.score > 0.4) {
          response = `I found a strong match: **${node.label}**. ${summary}`;
        }
      }
    } else {
      response = "I'm not entirely sure about that, but feel free to explore the graph! Varun is particularly skilled in PyTorch, CUDA, and GenAI.";
    }

    setMessages(prev => [...prev, { role: 'bot', content: response, nodeId }]);
    setIsTyping(false);
  }, []);

  return (
    <>
      <button 
        className="ai-assistant-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>

      {isOpen && (
        <div className="ai-window">
          <header className="ai-header">
            <div className="ai-header-title">
              <Sparkles size={14} />
              <span>V-Shadow Engine v1.0</span>
            </div>
            <div style={{ fontSize: '10px', opacity: 0.5 }}>TF-IDF Inference</div>
          </header>

          <div className="ai-messages scroll" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`ai-msg ${m.role}`}>
                <div dangerouslySetInnerHTML={{ __html: formatContent(m.content) }} />
                {m.nodeId && (
                  <button 
                    className="ai-node-link"
                    onClick={() => {
                      onNodeSelect(m.nodeId!);
                      if (window.innerWidth < 768) setIsOpen(false);
                    }}
                  >
                    <Terminal size={12} /> Inspect {m.nodeId}
                  </button>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="ai-typing">
                <Sparkles size={10} className="spin" /> Shadow is processing...
              </div>
            )}
            {!isTyping && messages.length < 3 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                {SUGGESTIONS.map(s => (
                  <button 
                    key={s} 
                    className="ai-suggestion-chip"
                    onClick={() => handleSend(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form 
            className="ai-input-area" 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          >
            <input 
              className="ai-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              autoFocus
            />
            <button className="ai-send" type="submit">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function formatContent(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--accent)">$1</strong>');
}
