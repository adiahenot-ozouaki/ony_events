import { supabase } from './supabaseClient';
import type { OnyItem } from '../constants/ony_interfaces';

let productsCache: OnyItem[] | null = null;
let productsPromise: Promise<OnyItem[]> | null = null;

export function fetchProducts(): Promise<OnyItem[]> {
  if (productsCache) {
    return Promise.resolve(productsCache);
  }

  if (productsPromise) {
    return productsPromise;
  }

  productsPromise = supabase
    .from('products')
    .select('id, categorie, sub_categorie, nom, prix, description, image, quantite, unite')
    .order('id')
    .then(({ data, error }) => {
      if (error) {
        throw new Error(`Impossible de récupérer les produits : ${error.message}`);
      }

      const products = (data ?? []).map((product) => ({
        id: product.id,
        categorie: product.categorie,
        subCategorie: product.sub_categorie,
        nom: product.nom,
        prix: product.prix,
        description: product.description,
        image: product.image,
        quantite: product.quantite,
        unite: product.unite,
      }));

      productsCache = products;
      return products;
    })
    .catch((error) => {
      productsPromise = null;
      throw error;
    });

  return productsPromise;
}
