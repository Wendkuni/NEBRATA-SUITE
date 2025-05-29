import {Document, Dossier} from '@sycadApp/models/workflow/common/general';
import {
  ContribuableElement,
  GeneralContribuable,
  Ilot,
  Section
} from '@sycadApp/models/data-references/contribuables/global.model';
import {StructureElement} from '@sycadApp/models/data-references/organigramme/structure.model';
import {
  IlotElement,
  IlotItem,
  ParcelleElement
} from '@sycadApp/models/data-references/territoire/localite.model';
import { EntetePV, EntetePVAutocomplete } from './sd-entete-pv.model';

export class SaisieDiffereeAttributionContexte {
  numeropv: string;
  numeroPage: number;
  sectionChoisieId: number;
  ilotChoisieId: number;


}
export class SaisieDiffereeAttributionContexteElement {
  numeropv: string;
  numeroPage: number;
  section: Section;
  ilot: IlotElement;
  entetePVAttributionDossier:EntetePVAutocomplete;


}
