import {NatureImpot} from '@sycadApp/models/impot/nature-impot.model';
import {ElementImpot} from '@sycadApp/models/impot/element-impot.model';
import {Processus} from '@sycadApp/models/workflow/common/general';
import {
  CessionSource
} from "@sycadApp/models/workflow/common/attribution-source.model";
import {
  TypeTitreRecette
} from "@sycadApp/models/impot/type-titre-recette.model";


export class PackageImpot{
  id: number;
  code: string;
  libelle: string;
  typeContribuable: ContribuableType;
  dateDebut: Date;
  dateFin: Date;
  delaiReglementMois: number;
  unite: string;
  tauxPenaliteHorsDelai: number;
  tauxInteretSurPenalite: number;
  periodeInteretSurPenalite: number;
  refLoi: string;
  observation: string;
  ordreTri: number;
  natureImpot: NatureImpot;
  elementsImpots: ElementImpot[];
  processus: Processus;
  actif: boolean;
  parDefaut: boolean;
  cessionSource: CessionSource;
  typeTitreRecette: TypeTitreRecette;
  estObligatoire: boolean;
}
export enum ContribuableType {
  CONTRIBUABLEPHYSIQUE="Contribuable physique",
  CONTRIBUABLEMORAL= "Contribuable moral",
}
