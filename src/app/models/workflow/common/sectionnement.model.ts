import { Dossier, Transmission } from '@sycadApp/models/workflow/common/general';
import { CommuneItem } from '@sycadApp/models/data-references/territoire/commune.model';

import {Section} from '@sycadApp/models/data-references/contribuables/global.model';

export class PlanCadastralSectionnementElement  extends Dossier{
transmission: Transmission;
sections: Section[];
zone:String;
commune:CommuneItem;
domaine:String;
dateMajPlan:Date;
}


export class PlanCadastralSectionnementItem  extends Dossier{
  transmission: Transmission;
  sections: Section[];
  commune:CommuneItem;
  zone:String;
  domaine:String;
  dateMajPlan:Date;
}
