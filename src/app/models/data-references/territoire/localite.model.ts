import { PlanCadastralAmenagementElement } from '@sycadApp/models/workflow/cp-amenagement.model';
import { PlanCadastralFusionementElement } from '@sycadApp/models/workflow/cp-fusionnement.model';
import { PlanCadastralLotissementElement } from '@sycadApp/models/workflow/cp-lotissement.model';
import { PlanCadastralMorcellementElement } from '@sycadApp/models/workflow/cp-morcellement.model';
import { ArrondissementElement, ArrondissementNestableElement, ArrondissementNestableItem } from '@sycadApp/models/data-references/territoire/arrondissement.model';
import { EtatAttribution, Section } from '@sycadApp/models/data-references/contribuables/global.model';
import { ArrondissementZone } from '@sycadApp/models/data-references/territoire/arrondissement-zone.model';
import { DestinationParcelle } from '@sycadApp/models/bornage/destinationParcelle.model';
import { ParcelleDelimitation } from '@sycadApp/models/bornage/parcelle-delimitation.model';
import { Quartier } from '@sycadApp/models/data-references/territoire/quartier.model';
import {
  CommuneElement
} from "@sycadApp/models/data-references/territoire/commune.model";
import { EtatMiseEnValeur } from '@sycadApp/models/impot/bareme-impot.model';

export enum TypeLocalite {
  SECTEUR="SECTEUR", VILLAGE="VILLAGE"
}

export class LocaliteElement {
  id : number;
  nom : string;
  code: string;
  typeLocalite: TypeLocalite;
  arrondissement:ArrondissementNestableElement;
}

export class LocaliteItem {
  id : number;
  nom : string;
  code: string;
  typeLocalite: TypeLocalite;
  arrondissement:ArrondissementNestableItem;
}

export class LocaliteAutocomplete {
  id : number;
  nom : string;
  code: string;
}
export class ParcelleAutocomplete {
  id: number;
  numero: string;
  numeroAncien: string;
  icad: string;
   libelle: string;
   etatMev: string;
  superficie: number;
  dateEtatMev: Date;
  vci: number;
  dateEval: Date;
  ilot: IlotItem
}
export class ParcelleElement{
  id: number;
  numero: string;
  numeroAncien: string;
  icad: string;
  libelle: string;
  label: string;
  etatMev: string;
  superficie: number;
  dateEtatMev: Date;
  vci: number;
  dateEval: Date;
  ilot: IlotElement;
  lotissement: PlanCadastralLotissementElement;
  morcellement: PlanCadastralMorcellementElement;
  fusionnement: PlanCadastralFusionementElement;
  amenagement: PlanCadastralAmenagementElement;
  destination: DestinationParcelle;
  etatAttribution: EtatAttribution;
  arrondissement: ArrondissementElement;
  quartier: Quartier;
  localite: LocaliteElement;
  zone: ArrondissementZone;
  cycleDeVie: string;
  ordre: number;
  territoireZone: string;
  domaine: string;
}
export class ParcelleItem {
  id: number;
  numero: string;
  numeroAncien: string;
  icad: string;
  libelle: string;
  etatMev: string;
  superficie: number;
  dateEtatMev: Date;
  vci: number;
  dateEval: Date;
  ilot: IlotElement;
  territoireZone: string;
  domaine: string;
}
export class ParcelleInexistante{
  id: number;
  commune: CommuneElement; 
  arrondissement:ArrondissementElement;
  localite:LocaliteElement;
  quartier:Quartier;
  destination:DestinationParcelle;
  section: string;
  ilot: string;
  numero: string;
  superficie: number;
  etatMiseEnValeur: EtatMiseEnValeur;
}
export class IlotElement {
  id: number;
  numero: string;
  libelle: string;
  numeroAncien: string;
  section:Section;
  arrondissement?: ArrondissementElement;
  parcelles:ParcelleElement[];
}
export class IlotItem {
  id: number;
  numero: string;
  numeroAncien: string;
  libelle: string;
  section:Section;
  parcelles:ParcelleItem[];
}

export class LocaliteNestableItem {
  nom : string;
  code: string;
  typeLocalite: TypeLocalite;
}

export class LocaliteNestableElement {
  id : number;
  nom : string;
  code: string;
  typeLocalite: TypeLocalite;
}


export interface PaginatedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}
export class ParcelleMap{
   nilotn: string;
   nilota: string;
   nplen: string;
   nplea: string;
   destinat: string;
    perim: number;
    supm2: number;
   arrdt: string;
   nsect: string;
   nqart: string;
   nston: string;
  arrondissement?: ArrondissementElement;
}

