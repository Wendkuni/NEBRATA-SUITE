import {
  NatureImpot
} from "@sycadApp/models/impot/nature-impot.model";

export class ElementLiquidation {
  id: number;
  code: string;
  libelle: string;
  signe: Signe;
  unite: string;
  fonctions: string;
  natureImpot: NatureImpot;
}
export enum Signe{
  POSITIF= 1,
  NEGATIF= -1,
  NULL= 0,
}
