export interface OnyItem {
  id: string;
  categorie: string;
  subCategorie: string;
  nom: string;
  prix: number;
  description: string;
  image: string[];
  quantite: number;
  unite: 'piece' | 'prestation';
}
