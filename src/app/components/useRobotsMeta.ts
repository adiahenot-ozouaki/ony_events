import { useEffect } from 'react';

export function useRobotsMeta(content: string) {
  useEffect(() => {
    const meta = document.querySelector('meta[name="robots"]');
    const previous = meta?.getAttribute('content') ?? 'index, follow';

    meta?.setAttribute('content', content);

    return () => {
      meta?.setAttribute('content', previous);
    };
  }, [content]);
}
