import { beforeEach, describe, expect, it, vi } from 'vitest';

const hookRuntime = vi.hoisted(() => ({
  effect: undefined as (() => void) | undefined,
}));

vi.mock('react', () => ({
  useEffect: (effect: () => void) => {
    hookRuntime.effect = effect;
    effect();
  },
}));

describe('usePageTitle', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    hookRuntime.effect = undefined;

    document.title = 'Titre initial';

    document.head.innerHTML = `
      <meta name="description" content="Description initiale">
      <meta property="og:title" content="OG initial">
      <meta property="og:description" content="OG description initiale">
      <meta name="twitter:title" content="Twitter initial">
      <meta name="twitter:description" content="Twitter description initiale">
    `;
  });

  async function getUsePageTitle() {
    const module = await import('../src/lib/usePageTitle');
    return module.usePageTitle;
  }

  it('met à jour le titre et toutes les meta descriptions avec les valeurs fournies', async () => {
    const usePageTitle = await getUsePageTitle();

    usePageTitle({
      title: 'Catalogue',
      description: 'Découvrez notre catalogue.',
    });

    expect(document.title).toBe('Catalogue | ONY');
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content'))
      .toBe('Découvrez notre catalogue.');
    expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content'))
      .toBe('Catalogue | ONY');
    expect(document.querySelector('meta[property="og:description"]')?.getAttribute('content'))
      .toBe('Découvrez notre catalogue.');
    expect(document.querySelector('meta[name="twitter:title"]')?.getAttribute('content'))
      .toBe('Catalogue | ONY');
    expect(document.querySelector('meta[name="twitter:description"]')?.getAttribute('content'))
      .toBe('Découvrez notre catalogue.');
  });

  it('utilise la description par défaut lorsqu’elle n’est pas fournie', async () => {
    const usePageTitle = await getUsePageTitle();

    usePageTitle({ title: 'À propos' });

    expect(document.title).toBe('À propos | ONY');
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content'))
      .toContain('Location de mobilier et équipements événementiels au Gabon');
    expect(document.querySelector('meta[property="og:description"]')?.getAttribute('content'))
      .toBe(document.querySelector('meta[name="description"]')?.getAttribute('content'));
    expect(document.querySelector('meta[name="twitter:description"]')?.getAttribute('content'))
      .toBe(document.querySelector('meta[name="description"]')?.getAttribute('content'));
  });

  it('ne plante pas si une meta ciblée est absente', async () => {
    document.head.innerHTML = '<meta name="description" content="Description initiale">';

    const usePageTitle = await getUsePageTitle();

    expect(() => {
      usePageTitle({
        title: 'Contact',
        description: 'Contactez-nous.',
      });
    }).not.toThrow();

    expect(document.title).toBe('Contact | ONY');
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content'))
      .toBe('Contactez-nous.');
  });
});
