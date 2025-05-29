import {SystemImposition} from '@sycadApp/models/impot/system-imposition.model';

export class NatureImpot{
  id: number;
  code: string;
  libelle: string;
  typeNatureImpot: TypeNatureImpot;
  codeSI: SystemImposition;
  libelleCourt: string;
  ordre: number;
}
export enum TypeNatureImpot {
  PERSONNELLE="Personnelle",
  PROFESSIONNELLE = "Professionnelle"
}
