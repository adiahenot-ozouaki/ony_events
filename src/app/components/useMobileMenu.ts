import { useEffect, useRef, useState } from 'react';

export function useMobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (isMenuOpen) {
      firstMobileLinkRef.current?.focus();
    }
  }, [isMenuOpen]);

  function closeMenuAndRefocusButton() {
    setIsMenuOpen(false);
    menuButtonRef.current?.focus();
  }

  useEffect(() => {
    if (!isMenuOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeMenuAndRefocusButton();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMenuOpen]);

  return {
    isMenuOpen,
    setIsMenuOpen,
    menuButtonRef,
    firstMobileLinkRef,
  };
}
