import { Dossier, Quittance, Document} from '@sycadApp/models/workflow/common/general';
import { GeneralContribuable} from '@sycadApp/models/data-references/contribuables/global.model';
import { ParcelleElement, ParcelleInexistante} from '@sycadApp/models/data-references/territoire/localite.model';

import { ActeurElement } from '@sycadApp/models/data-references/contribuables/acteur.model';

export class DelivranceDocument extends Dossier{
    
  // typeDocumentCession: DocumentType;
  // numeroDocumentCession: string;
  // dateDocumentCession: Date;

  contribuableBeneficiaire: GeneralContribuable;

  parcelle: ParcelleElement;

  acteurExterne: ActeurElement;

  documentDeSortie: Document;

  documentCession: Document;

  documentEvaluation: Document;

  documentAnnule: Document;

  parcelleInexistante: ParcelleInexistante;

}
