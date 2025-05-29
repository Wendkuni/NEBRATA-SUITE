import { DelivranceDocument } from './common/deliVrancedocument.model';
import { Quittance } from './common/general';

export class DelivranceAap extends DelivranceDocument{


    quittances: Quittance[];
}
