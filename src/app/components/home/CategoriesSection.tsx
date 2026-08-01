import { CategoryCard } from '../CategoryCard';
import { onyItems } from '../../../constants/ony_items';
import { categoryOrder, categoryLabels, categoryPlaceholderImages } from '../../../constants/ony_products';

export function CategoriesSection() {
  const categories = categoryOrder.map((cat) => ({
    title: categoryLabels[cat],
    image: categoryPlaceholderImages[cat],
  }));

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-20">
        <div className="text-center mb-16">
          <h2 className="font-[var(--font-serif)] text-5xl mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
            Nos catégories
          </h2>
          <p className="text-muted-foreground text-lg">
            {onyItems.length} références réparties en {categoryOrder.length} catégories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={index} image={category.image} title={category.title} />
          ))}
        </div>
      </div>
    </section>
  );
}