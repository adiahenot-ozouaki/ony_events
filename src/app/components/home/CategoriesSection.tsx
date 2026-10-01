import { useNavigate } from 'react-router-dom';
import { CategoryCard } from '../CategoryCard';
import { useProductCount } from '../useProductCount';
import { categoryOrder, categoryLabels, categoryPlaceholderImages } from '../../../constants/ony_products';

export function CategoriesSection() {
  const navigate = useNavigate();
  const productCount = useProductCount();

  const categories = categoryOrder.map((cat) => ({
    key: cat,
    title: categoryLabels[cat],
    image: categoryPlaceholderImages[cat],
  }));

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20">
        <div className="text-center mb-16">
          <h2 className="font-[var(--font-serif)] text-5xl mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
            Nos catégories
          </h2>
          <p className="text-muted-foreground text-lg">
            {productCount} références réparties en {categoryOrder.length} catégories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.key}
              image={category.image}
              title={category.title}
              onClick={() => navigate(`/catalogue?categorie=${encodeURIComponent(category.key)}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
