import {CessionParcelle} from '@sycadApp/models/workflow/common/general';

import {
  GeneralContribuable
} from '@sycadApp/models/data-references/contribuables/global.model';



export class MutationParcelle  extends CessionParcelle{
  cessionnaire: GeneralContribuable;
  cedant: GeneralContribuable;
  valeurDeclare: number;
  enregistrement: Date;
  bordereau: string;
  folio: string;
  caseDoc: string;
  droit: number;
  numeroQuittance: string;
  dateQuittance: Date;
}
