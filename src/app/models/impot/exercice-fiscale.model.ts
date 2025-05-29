export class ExerciceFiscale{
id: number;
annee: number;
libelle: string;
datedebut: Date;
datefin: Date;
etat: EtatExerciceFiscale;
}

export enum EtatExerciceFiscale{
  CLOS="CLOS",
  OUVERT="OUVERT",
  PROVISOIRE="PROVISOIRE"
}


export class CalendrierFiscale{
  id: number;
  annee: number;
  libelle: string;
  titre: string;
  dateButoir: Date;
  datedebut: Date;
  datefin: Date;
  exerciceFiscale: ExerciceFiscale;
  }