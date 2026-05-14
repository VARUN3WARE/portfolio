import { Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { search, type SearchHit } from '../lib/graphQueries';

interface SearchPanelProps {
  onPick: (id: string) => void;
}

export function SearchPanel({ onPick }: SearchPanelProps) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const hits: SearchHit[] = useMemo(() => search(query), [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const choose = useCallback(
    (id: string) => {
      onPick(id);
      setQuery('');
      inputRef.current?.blur();
    },
    [onPick],
  );

  return (
    <div className="search-wrap">
      <div className="search-box">
        <Search size={14} color="var(--text-tertiary)" />
        <input
          ref={inputRef}
          type="search"
          placeholder="Search nodes, tags, projects…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (!hits.length) return;
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActive((a) => Math.min(hits.length - 1, a + 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((a) => Math.max(0, a - 1));
            } else if (e.key === 'Enter') {
              e.preventDefault();
              choose(hits[active].node.id);
            }
          }}
          spellCheck={false}
          aria-label="Search portfolio graph"
        />
        <span className="search-kbd">⌘K</span>
      </div>
      {query && hits.length > 0 && (
        <div className="search-results scroll" role="listbox">
          {hits.map((hit, i) => (
            <button
              key={hit.node.id}
              role="option"
              aria-selected={i === active}
              className={`search-hit${i === active ? ' active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(hit.node.id)}
            >
              <span>
                <div className="search-hit-title">{hit.node.label}</div>
                <div className="search-hit-sub">{hit.node.subtitle}</div>
              </span>
              <span className="search-hit-reason">{hit.reason}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
