import {Document, Dossier} from '@sycadApp/models/workflow/common/general';
import {
  ContribuableElement,
  GeneralContribuable
} from '@sycadApp/models/data-references/contribuables/global.model';
import {StructureElement} from '@sycadApp/models/data-references/organigramme/structure.model';
import {ParcelleElement} from '@sycadApp/models/data-references/territoire/localite.model';

import {ActeurElement} from '@sycadApp/models/data-references/contribuables/acteur.model';

export class DemandeDocument extends Dossier{
    numeroDBT: string;
    dateDBT: Date;
    numeroPVEvaluation: string;
    dateEvaluation: string;
    documentDeSortie: Document;
    valeurInvestissement: number;
    contribuableBeneficiaire: GeneralContribuable;
    structureBeneficiaire: StructureElement;
    parcelle: ParcelleElement;
    acteurExterne: ActeurElement;

}
