import {
  StructureElement,
  StructureNestableElement,
  StructureNestableItem
} from '@sycadApp/models/data-references/organigramme/structure.model';
import { LocalisationServiceElement, LocalisationServiceItem } from '@sycadApp/models/data-references/organigramme/localisation.model';
import { ServiceNestedElement, ServiceNestedItem } from '@sycadApp/models/data-references/organigramme/service.model';

export class BureauElement {
    id : number;
    nom : string;
    code: string;
    sigle: string;
    structure: StructureElement;
    service: ServiceNestedElement;
    localisation: LocalisationServiceElement;
}

export class BureauItem {
    id: number;
    nom: string;
    code: string;
    sigle: string;
    structure: StructureNestableItem;
    service: ServiceNestedItem;
    localisation: LocalisationServiceItem;
}

export class BureauAutocomplete {
    id : number;
    code: string;
    nom : string;
}

export class BureauNestedElement {
    id : number;
    code: string;
    nom : string;
}

export class BureauNestedItem {
    nom : string;
    code: string;
}
