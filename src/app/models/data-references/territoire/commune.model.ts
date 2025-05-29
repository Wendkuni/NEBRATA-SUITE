import { ProvinceElement, ProvinceNestedItem } from '@sycadApp/models/data-references/territoire/province.model';

export enum TypeCommune {
    URBAINE="URBAINE", RURALE="RURALE", PARTICULIER="PARTICULIER"
}

export class CommuneElement {
    id : number;
    nom : string;
    code: string;
    typeCommune: TypeCommune;
    province:ProvinceElement;
}

export class CommuneAutocomplete {
    id : number;
    nom : string;
    code: string;
    typeCommune: TypeCommune;
}

export class CommuneItem {
    id : number;
    nom : string;
    code: string;
    typeCommune: TypeCommune;
    province:ProvinceNestedItem;
}
  
export class CommuneNestedElement {
    id : number;
    nom : string;
    code: string;
    typeCommune: TypeCommune;
}

export class CommuneNestedItem {
    id : number;
    nom : string;
    code: string;
    typeCommune: TypeCommune;
}