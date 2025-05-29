import { StructureElement } from '@sycadApp/models/data-references/organigramme/structure.model';
import { CessionParcelle } from '@sycadApp/models/workflow/common/general';
import { GeneralContribuable } from '@sycadApp/models/data-references/contribuables/global.model';



export class AffectationParcelle  extends CessionParcelle{
    structure: StructureElement
}


