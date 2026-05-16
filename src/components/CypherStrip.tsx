interface CypherStripProps {
  query: string;
}

export function CypherStrip({ query }: CypherStripProps) {
  return (
    <div className="cypher-strip" aria-hidden>
      <span className="cypher-prompt">cypher{'>'}</span>
      {query}
    </div>
  );
}
