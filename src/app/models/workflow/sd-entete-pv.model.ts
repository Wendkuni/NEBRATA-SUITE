import {Document, Dossier} from '@sycadApp/models/workflow/common/general';
import {
  ContribuableElement,
  GeneralContribuable,
  Ilot,
  Section
} from '@sycadApp/models/data-references/contribuables/global.model';
import {StructureElement} from '@sycadApp/models/data-references/organigramme/structure.model';
import {ParcelleElement} from '@sycadApp/models/data-references/territoire/localite.model';

import {ActeurElement} from '@sycadApp/models/data-references/contribuables/acteur.model';
import { CessionSource } from './common/attribution-source.model';
import {
  CommuneItem,
  CommuneNestedItem
} from '../data-references/territoire/commune.model';
import {
  ArrondissementItem
} from "@sycadApp/models/data-references/territoire/arrondissement.model";

export class EntetePV extends Dossier{

  commune:CommuneItem;
  documentDeSortie:Document;
  cessionSource: CessionSource;
  arrondissement:ArrondissementItem;

}
export class EntetePVAutocomplete extends Dossier{

  commune:CommuneNestedItem;
  arrondissement:ArrondissementItem;
  cessionSource: CessionSource;
  documentDeSortie: Document;
  libelle:string

}
