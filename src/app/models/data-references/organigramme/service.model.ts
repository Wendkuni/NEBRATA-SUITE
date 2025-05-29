import { StructureNestableItem, StructureNestableElement } from '@sycadApp/models/data-references/organigramme/structure.model';
import { LocalisationServiceElement, LocalisationServiceItem } from '@sycadApp/models/data-references/organigramme/localisation.model';


export class ServiceElement {
    id: number;
    nom: string;
    code: string;
    logo: string;
    sigle: string;
    structure: StructureNestableElement;
    localisation: LocalisationServiceElement;
}

export class ServiceItem {
    id: number;
    nom: string;
    code: string;
    sigle: string;
    structure: StructureNestableItem;
    localisation: LocalisationServiceItem;
}


export class ServiceAutocomplete {
    id: number;
    nom: string;
    code: string;
}

export class ServiceNestedItem {
    nom: string;
    code: string;
    sigle: string;
}

export class ServiceNestedElement {
    id: number;
    nom: string;
    code: string;
    sigle: string;
}
