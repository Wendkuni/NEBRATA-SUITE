import { RegionElement, RegionNestedItem } from '@sycadApp/models/data-references/territoire/region.model';


export class ProvinceElement {
    id: number;
    nom: string;
    code: string;
    region: RegionElement;
}


export class ProvinceItem {
    id: number;
    nom: string;
    code: string;
    region: RegionNestedItem;
}

export class ProvinceAutocomplete {
    id: number;
    nom: string;
    code: string;
}

export class ProvinceNestedElement {
    id: number;
    nom: string;
    code: string;
}

export class ProvinceNestedItem {
    nom: string;
    code: string;
}