interface CategoryCardProps {
  image: string;
  title: string;
  onClick?: () => void;
}

export function CategoryCard({ image, title, onClick }: CategoryCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-lg cursor-pointer aspect-square"
    >
      <img
        src={image}
        alt={title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
        <h3 className="font-[var(--font-serif)] text-white text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>
          {title}
        </h3>
      </div>
      <div className="absolute inset-0 border-2 border-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}
