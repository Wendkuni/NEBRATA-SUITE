import { DestinationParcelle } from "@sycadApp/models/bornage/destinationParcelle.model";
import { ParametreReport } from "@sycadApp/models/workflow/common/general";
import { DroitImmobilier } from "./droit-immobilier.model";

export class DocumentType {
  id: number;
  code: string;
  libelle: string;
  estTitreParcelle: boolean;
  estTitreFoncier: boolean;
  actif: boolean;
  parametreReport: ParametreReport [];
  destination: DestinationParcelle [];
  droitsImmobiliers: DroitImmobilier [];
  typeActe:TypeActe;

}

export enum TypeActe{
  CESSION="CESSION",
  BORNAGE="BORNAGE",
  IMMATRICULATION="IMMATRICULATION",
  EVALUATION="EVALUATION",
  CONTRAT="CONTRAT",
  AUTRE="AUTRE",

}
