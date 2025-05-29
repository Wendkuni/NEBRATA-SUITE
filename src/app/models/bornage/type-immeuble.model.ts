
export class TypeImmeuble {
  id: number;
  code: string;
  libelle: string;
 categorie: ImmeubleCategorieType;
}


export enum ImmeubleCategorieType {
  BATIMENT= "Bâtiment",
  AMENAGEMENT_PARTICULIER= "Amenagement particulier",
  CLOTURE= "Clôture"
}