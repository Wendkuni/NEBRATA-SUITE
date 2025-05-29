import {Dossier, Transmission} from '@sycadApp/models/workflow/common/general';
import {IlotElement, IlotItem} from '@sycadApp/models/data-references/territoire/localite.model';
import {
  ArrondissementElement,
  ArrondissementItem
} from '@sycadApp/models/data-references/territoire/arrondissement.model';

export class PlanCadastralAmenagementElement extends Dossier {
  transmission: Transmission;
  ilots: IlotElement[];
  arrondissement: ArrondissementElement;
  zone:String;
  domaine:String;
  dateMajPlan:Date;
}

export class PlanCadastralAmenagementItem extends Dossier{
  transmission: Transmission;
  ilots: IlotItem[];
  arrondissement:ArrondissementItem;
  zone:String;
  domaine:String;
  dateMajPlan:Date;
}
