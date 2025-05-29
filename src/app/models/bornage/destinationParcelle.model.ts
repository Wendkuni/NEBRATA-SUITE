import {StructureElement} from '@sycadApp/models/data-references/organigramme/structure.model';
export class DestinationParcelle{
  id: number;
  code: string;
  libelle: string;
  tutelle: StructureElement;
}
