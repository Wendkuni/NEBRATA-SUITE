import { LocalisationServiceElement, LocalisationServiceItem } from '@sycadApp/models/data-references/organigramme/localisation.model';
import { TypeStructureNestable } from '@sycadApp/models/data-references/organigramme/type-structure.model';
import {ArrondissementAutocomplete, ArrondissementElement, ArrondissementItem, ArrondissementNestableItem} from "@sycadApp/models/data-references/territoire/arrondissement.model";
import { CommuneAutocomplete, CommuneElement, CommuneItem, CommuneNestedItem } from '@sycadApp/models/data-references/territoire/commune.model';
import {
  TransitionFonctionnelle
} from "@sycadApp/models/data-references/organigramme/transition-fonctionnelle.model";



export class StructureParentItem {
  id: number;
  sigle: string;
  numeroBornage:number;
  nom: string;
  code: string;
}

export class StructureParentElement {
  id: number;
  sigle: string;
  code: string;
  numeroBornage:number;
  nom: string;
  siege: string;
  logo: string;
}


export class StructureElement {
  id: number;
  parent: StructureParentElement;
  sigle: string;
  code: string;
  numeroBornage:number;
  nom: string;
  logo: string;
  typeStructure: TypeStructureNestable;
  localisation: LocalisationServiceElement;
  competenceArrondissement: ArrondissementElement[];
  competenceCommune: CommuneElement[];
  transitionFonctionnelles: TransitionFonctionnelle[];
  structureDArchivage: boolean;
  structureDeDepot: boolean;
}



export class StructureItem {
  id: number;
  parent: StructureParentItem;
  sigle: string;
  code: string;
  nom: string;
  numeroBornage:number;
  logo: string;
  typeStructure: TypeStructureNestable;
  localisation: LocalisationServiceItem;
  competenceArrondissement: ArrondissementItem[];
  competenceCommune: CommuneItem[];
  structureDArchivage: boolean;
  structureDeDepot: boolean;
}


export class StructureAutocomplete {
  id: number;
  sigle: string;
  numeroBornage:number;
  nom: string;
  code: string;
}

export class DestinationAutocomplete {
  id: number;
  libelle: string;
  nom: string;
  tutelle: StructureElement;
}

export class StructureNestableElement {
  id: number;
  numeroBornage:number;
  sigle: string;
  nom: string;
  code: string;
  competenceArrondissement: ArrondissementElement[];
  competenceCommune: CommuneElement[];
}

export class StructureNestableItem {
  sigle: string;
  nom: string;
  numeroBornage:number;
  code: string;
  competenceArrondissement: ArrondissementNestableItem[];
  competenceCommune: CommuneNestedItem[];
}
