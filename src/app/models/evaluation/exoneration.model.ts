import {ExonerationCategorie} from '@sycadApp/models/evaluation/exoneration-categorie.model';
import {ContribuableElement, GeneralContribuable} from '@sycadApp/models/data-references/contribuables/global.model';
import {NatureImpot} from '@sycadApp/models/impot/nature-impot.model';
import { ParcelleElement } from '@sycadApp/models/data-references/territoire/localite.model';

export class Exoneration{
  id: number;
  motif: string;
  refExterne: string;
  modifDoc: string;
  categorie: ExonerationCategorie;
  dateDebut: Date;
  dateFin: Date;
  taux: number;
  montant: number;
  observation: string;
  contribuable: GeneralContribuable;
  parcelle: ParcelleElement;
  natureImpot: NatureImpot;
}
