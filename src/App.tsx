import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { ChapterView } from './components/Chapter';
import { ColdRead } from './components/ColdRead';
import { Landing } from './components/Landing';
import { Shenron } from './components/Shenron';
import { chapterById, chapters } from './data/chapters';
import './styles/app.css';

const FOUND_KEY = 'dragonballs-found';
const SHENRON_KEY = 'dragonballs-shenron-seen';

function chapterFromHash(): string | null {
  const id = window.location.hash.replace(/^#\/?/, '');
  return chapterById(id) ? id : null;
}

function loadFound(): Set<string> {
  try {
    const raw = JSON.parse(localStorage.getItem(FOUND_KEY) ?? '[]') as unknown;
    return new Set(Array.isArray(raw) ? raw.filter((x): x is string => typeof x === 'string') : []);
  } catch {
    return new Set();
  }
}

/** Morph the clicked ball into the chapter header where the browser supports it. */
function withTransition(update: () => void) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!doc.startViewTransition || reduce) {
    update();
    return;
  }
  doc.startViewTransition(() => flushSync(update));
}

export default function App() {
  const [openId, setOpenId] = useState<string | null>(chapterFromHash);
  const [found, setFound] = useState<Set<string>>(loadFound);
  const [coldRead, setColdRead] = useState(false);
  const [highlight, setHighlight] = useState<{ label: string; ids: string[] } | null>(null);
  const [shenron, setShenron] = useState(false);

  const openChapter = useCallback((id: string) => {
    withTransition(() => {
      setColdRead(false);
      setOpenId(id);
      setFound((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev).add(id);
        try {
          localStorage.setItem(FOUND_KEY, JSON.stringify([...next]));
        } catch {
          /* ignore */
        }
        return next;
      });
    });
    if (window.location.hash !== `#/${id}`) window.history.pushState(null, '', `#/${id}`);
    window.scrollTo({ top: 0 });
  }, []);

  const backToRadar = useCallback(() => {
    withTransition(() => setOpenId(null));
    if (window.location.hash) window.history.pushState(null, '', window.location.pathname);
  }, []);

  useEffect(() => {
    const onPop = () => withTransition(() => setOpenId(chapterFromHash()));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (coldRead || shenron || !openId) return;
      const i = chapters.findIndex((c) => c.id === openId);
      if (e.key === 'Escape') backToRadar();
      if (e.key === 'ArrowRight') openChapter(chapters[(i + 1) % chapters.length].id);
      if (e.key === 'ArrowLeft') openChapter(chapters[(i + chapters.length - 1) % chapters.length].id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openId, coldRead, shenron, backToRadar, openChapter]);

  // Summon Shenron the first time someone comes back to the radar with all seven.
  useEffect(() => {
    if (openId || found.size < chapters.length) return;
    try {
      if (localStorage.getItem(SHENRON_KEY) === '1') return;
    } catch {
      /* ignore */
    }
    const t = window.setTimeout(() => {
      setShenron(true);
      try {
        localStorage.setItem(SHENRON_KEY, '1');
      } catch {
        /* ignore */
      }
    }, 700);
    return () => window.clearTimeout(t);
  }, [openId, found]);

  const chapter = openId ? chapterById(openId) : undefined;

  return (
    <>
      {chapter ? (
        <ChapterView chapter={chapter} onBack={backToRadar} onOpen={openChapter} />
      ) : (
        <Landing
          found={found}
          highlight={highlight}
          onOpen={openChapter}
          onColdRead={() => setColdRead(true)}
          onClearHighlight={() => setHighlight(null)}
          onSummon={() => setShenron(true)}
        />
      )}
      <ColdRead
        open={coldRead}
        onClose={() => setColdRead(false)}
        onOpenChapter={openChapter}
        onHighlight={(label, ids) => setHighlight({ label, ids })}
      />
      <Shenron open={shenron} onClose={() => setShenron(false)} />
    </>
  );
}
