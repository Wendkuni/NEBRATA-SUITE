import { Dossier, Transmission } from '@sycadApp/models/workflow/common/general';

import {Section} from '@sycadApp/models/data-references/contribuables/global.model';

export class PlanCadastralTourneeDeConservationElement  extends Dossier{
  transmission: Transmission;
  sections: Section;
  zone:String;
  domaine:String;
  dateMajPlan:Date;
}


export class PlanCadastralTourneeDeConservationItem  extends Dossier{
  transmission: Transmission;
  sections: Section;
  zone:String;
  domaine:String;
  dateMajPlan:Date;
}
