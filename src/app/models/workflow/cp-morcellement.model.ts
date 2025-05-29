import { Dossier, Transmission } from '@sycadApp/models/workflow/common/general';

import {
  GeneralContribuable,
} from '@sycadApp/models/data-references/contribuables/global.model';
import {StructureElement} from '@sycadApp/models/data-references/organigramme/structure.model';
import {ParcelleElement} from '@sycadApp/models/data-references/territoire/localite.model';
import {ActeurElement} from '@sycadApp/models/data-references/contribuables/acteur.model';

import {ParcelleDelimitation} from '@sycadApp/models/bornage/parcelle-delimitation.model';
import { TitreRecette } from '../impot/mode-reglement.model';


export class PlanCadastralMorcellementElement  extends Dossier{
  contribuableBeneficiaire: GeneralContribuable;
  structureBeneficiaire: StructureElement;
  parcelle: ParcelleElement;
  acteurExterne: ActeurElement;
  delimitations: ParcelleDelimitation[];
  parcelles: ParcelleElement[];
  titresRecette: TitreRecette[];
  

}


