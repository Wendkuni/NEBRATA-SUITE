import { Dossier, Transmission } from '@sycadApp/models/workflow/common/general';
import { ArrondissementElement ,ArrondissementItem} from '@sycadApp/models/data-references/territoire/arrondissement.model';
import { IlotElement, IlotItem } from '@sycadApp/models/data-references/territoire/localite.model';
import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';

import {Section} from '@sycadApp/models/data-references/contribuables/global.model';

export class PlanCadastralLotissementElement  extends Dossier{
  transmission: Transmission;
  ilots: IlotElement[];
  arrondissement:ArrondissementElement;
  zone:String;
  domaine:String;
  dateMajPlan:Date;
}


export class PlanCadastralLotissementItem  extends Dossier{
  transmission: Transmission;
  ilots: IlotItem[];
  arrondissement:ArrondissementItem;
  zone:String;
  domaine:String;
  dateMajPlan:Date;
}
