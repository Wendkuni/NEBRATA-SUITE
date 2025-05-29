
import { Dossier, Transmission } from '@sycadApp/models/workflow/common/general';
import { ActeurElement } from '../data-references/contribuables/acteur.model';
import { GeneralContribuable } from '../data-references/contribuables/global.model';
import { StructureElement } from '../data-references/organigramme/structure.model';
import { ParcelleElement } from '../data-references/territoire/localite.model';
import { Temoin } from './temoin.model';
import {Immeuble} from "@sycadApp/models/bornage/immeuble.model";
import { ParcelleDelimitation } from './parcelle-delimitation.model';
import { TitreRecette } from '../impot/mode-reglement.model';



export class DossierBornage  extends Dossier{
    contribuableBeneficiaire: GeneralContribuable;
    structureBeneficiaire: StructureElement;
    parcelle: ParcelleElement;
    acteurExterne: ActeurElement;
    immeubles: Immeuble[];
    delimitations: ParcelleDelimitation[];
    temoins: Temoin[];
    titresRecette:TitreRecette[];
  }
