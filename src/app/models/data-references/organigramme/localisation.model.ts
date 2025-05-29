import { LocaliteElement, LocaliteItem } from '@sycadApp/models/data-references/territoire/localite.model';
import {Quartier} from "@sycadApp/models/data-references/territoire/quartier.model";


export class LocalisationServiceElement{
  longitude: number;
  lattitude: number;
  designation: string;
  localite: LocaliteElement;
  quartier: Quartier;
  rue: string;
  immeuble: string;
  etage: string;
  porte: string;
  emailDeService: string;
  telephoneDeService: string;
}
export class LocalisationServiceItem{
  longitude: number;
  lattitude: number;
  designation: string;
  localite: LocaliteItem;
  quartier: Quartier;
  rue: string;
  immeuble: string;
  etage: string;
  porte: string;
  emailDeService: string;
  telephoneDeService: string;
}
