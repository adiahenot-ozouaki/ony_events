import { supabase } from './supabaseClient';
import type { OnyItem } from '../constants/ony_interfaces';

export async function fetchProducts(): Promise<OnyItem[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id, categorie, sub_categorie, nom, prix, description, image, quantite, unite')
    .order('id');

  if (error) {
    throw new Error(`Impossible de récupérer les produits : ${error.message}`);
  }

  return (data ?? []).map((product) => ({
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
}
