import { useEffect, useState } from 'react';

interface UseQuantityInputOptions {
  value: number;
  min: number;
  onChange: (value: number) => void;
}

export function useQuantityInput({ value, min, onChange }: UseQuantityInputOptions) {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  function commit() {
    const parsed = parseInt(draft, 10);
    if (Number.isNaN(parsed) || parsed < min) {
      setDraft(String(value));
      return;
    }
    onChange(parsed);
  }

  return {
    draft,
    setDraft,
    commit,
  };
}
