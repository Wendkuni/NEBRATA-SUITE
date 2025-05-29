import { CommuneNestedElement, CommuneNestedItem } from '@sycadApp/models/data-references/territoire/commune.model';

export class ArrondissementElement {
    id: number;
    nom: string;
    code: string;
    commune: CommuneNestedElement ;
    zones: ArrondissementZone[];
}

export class ArrondissementItem {
    id : number;
    nom : string;
    code: string;
    commune: CommuneNestedItem ;
    zones: ArrondissementZone[];
}

export class ArrondissementAutocomplete {
    id : number;
    nom : string;
    code: string;
    commune: CommuneNestedItem ;
}


export class ArrondissementNestableElement {
    id : number;
    nom : string;
    code: string;
    commune: CommuneNestedItem ;
}

export class ArrondissementNestableItem {
    id : number;
    nom : string;
    code: string;
    commune: CommuneNestedItem ;
}
export class ArrondissementZone {
  id: number;
  libelle: string;
  code: string;
}
