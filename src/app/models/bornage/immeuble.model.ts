import {CategorieImmeuble} from '@sycadApp/models/data-references/system/categorie-immeuble.model';
import {TypeImmeuble} from '@sycadApp/models/bornage/type-immeuble.model';
import {ParcelleElement} from '@sycadApp/models/data-references/territoire/localite.model';

export class Immeuble{
  id: number;
  numero: string;
  libelle: string;
  dimension: string;
  dateRealisation: Date;
  photos: string;
  categorie: CategorieImmeuble;
  type: TypeImmeuble;
  parcelle: ParcelleElement;
}