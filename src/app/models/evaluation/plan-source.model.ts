export class PlanSource{
  id: number;
  code: string;
  libelle: string;
  zone: TerritoireZone;
}

export enum TerritoireZone{
  URBAIN="Urbain",
  RURAL="Rural",
  SUBURBAIN="Suburbain"
}
