import { CessionParcelle} from '@sycadApp/models/workflow/common/general';

import {
  GeneralContribuable
} from '@sycadApp/models/data-references/contribuables/global.model';
import { ParcelleInexistante } from '../data-references/territoire/localite.model';


export class AttributionParcelle  extends CessionParcelle{
  attributaire: GeneralContribuable;
  numeroDePage: number;
  parcelleInexistante: ParcelleInexistante;
  numeroDePV:string;
}


