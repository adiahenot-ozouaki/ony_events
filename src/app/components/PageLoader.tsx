/**
 * Affiché brièvement par <Suspense> le temps que le code d'une route en
 * lazy-loading (voir App.tsx) soit téléchargé — sur une connexion lente,
 * ça évite un écran blanc silencieux qui peut faire penser à un site figé.
 *
 * `min-h-screen` évite tout saut de mise en page (CLS) : l'espace réservé
 * est le même, que la page mette 50ms ou 2s à charger.
 */
export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div
        className="w-10 h-10 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin"
        role="status"
        aria-label="Chargement de la page"
      />
    </div>
  );
}
