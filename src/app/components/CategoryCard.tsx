interface CategoryCardProps {
  image: string;
  title: string;
  onClick?: () => void;
}

export function CategoryCard({ image, title, onClick }: CategoryCardProps) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (!onClick) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className="group relative overflow-hidden rounded-lg cursor-pointer aspect-square focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2"
      aria-label={`Voir la catégorie ${title}`}
    >
      <img
        src={image}
        alt=""
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
        <h3
          className="font-[var(--font-serif)] text-white text-2xl"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {title}
        </h3>
      </div>
      <div className="absolute inset-0 border-2 border-[var(--gold)] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300" />
    </div>
  );
}
