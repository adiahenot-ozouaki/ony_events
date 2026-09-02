import { useMemo, useState } from 'react';
import { galleryImages } from '../../../constants/gallery_images';
import type { GalleryFilter } from './GalleryFilters';

export function useGalleryFilter() {
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>('Tous');

  const filteredImages = useMemo(() => {
    if (activeFilter === 'Tous') return galleryImages;
    return galleryImages.filter((image) => image.categorie === activeFilter);
  }, [activeFilter]);

  return {
    activeFilter,
    setActiveFilter,
    filteredImages,
  };
}
