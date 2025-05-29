export class CessionSource{
  id: number;
  code: string;
  libelle: string;
  type: CessionSourceType;
}


export enum CessionSourceType {
  ATTRIBUTION="ATTRIBUTION",
  MUTATION="MUTATION",
   BAIL="BAIL", 
   AFFECTATION="AFFECTATION", 
   RETRAIT="RETRAIT"
}
