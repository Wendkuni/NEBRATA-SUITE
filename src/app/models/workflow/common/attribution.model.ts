
import {CategoriePieceProcessus, DossierPiece} from '@sycadApp/models/workflow/common/general';
import {CommuneElement} from '@sycadApp/models/data-references/territoire/commune.model';
import {ArrondissementElement} from '@sycadApp/models/data-references/territoire/arrondissement.model';
import {ContribuableElement, Ilot, Section} from '@sycadApp/models/data-references/contribuables/global.model';
import {StructureElement} from '@sycadApp/models/data-references/organigramme/structure.model';
import {ActeurElement} from '@sycadApp/models/data-references/contribuables/acteur.model';
import { CessionSource } from '@sycadApp/models/workflow/common/attribution-source.model';
import { ParcelleElement } from '@sycadApp/models/data-references/territoire/localite.model';

export class AttributionModel {
  id: number;
  structure: ActeurElement;
  modeCession: CessionSource;
  objet: string;
  numeroDocumentCession: string;
  dateDocumentCession: Date;
  observation: string;
  commune: CommuneElement;
  arrondissement: ArrondissementElement;
  section: Section;
  ilot: Ilot;
  parcelle: ParcelleElement;
  attributaire: ContribuableElement;
  pieces: DossierPiece [];
  categoriePieces: CategoriePieceProcessus [] = [];
}
