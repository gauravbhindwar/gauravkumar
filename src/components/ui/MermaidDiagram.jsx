'use client';

import { useEffect, useRef, useState } from 'react';

let mermaidPromise;
function getMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((mod) => {
      const mermaid = mod.default;
      mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'strict' });
      return mermaid;
    });
  }
  return mermaidPromise;
}

let diagramCounter = 0;

export default function MermaidDiagram({ code }) {
  const containerRef = useRef(null);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setError('');
    setSvg('');

    getMermaid()
      .then((mermaid) => mermaid.render(`mermaid-${diagramCounter++}`, code))
      .then(({ svg }) => {
        if (!cancelled) setSvg(svg);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Failed to render diagram');
      });

    return () => {
      cancelled = true;
    };
  }, [code]);

  if (error) {
    return (
      <pre className="text-xs text-error bg-error/10 border border-error/30 p-3 overflow-x-auto whitespace-pre-wrap">
        Mermaid diagram error: {error}
      </pre>
    );
  }

  if (!svg) {
    return <div className="text-xs text-base-content/40 font-mono py-4">Rendering diagram...</div>;
  }

  return (
    <div
      ref={containerRef}
      className="mermaid-diagram flex justify-center overflow-x-auto py-2 [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
