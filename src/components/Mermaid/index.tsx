import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
    });
    
    if (elementRef.current) {
      mermaid.render('mermaid-diagram', chart).then((result) => {
        if (elementRef.current) {
          elementRef.current.innerHTML = result.svg;
        }
      });
    }
  }, [chart]);

  return <div ref={elementRef} />;
};

export default Mermaid;