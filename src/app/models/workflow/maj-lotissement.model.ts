import { Dossier, Transmission } from '@sycadApp/models/workflow/common/general';

import {GeneralContribuable, Section} from '@sycadApp/models/data-references/contribuables/global.model';
import {StructureElement} from '@sycadApp/models/data-references/organigramme/structure.model';
import {IlotElement, ParcelleElement} from '@sycadApp/models/data-references/territoire/localite.model';
import {ActeurElement} from '@sycadApp/models/data-references/contribuables/acteur.model';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { CommuneElement } from '../data-references/territoire/commune.model';

export class PlanCadastralMAJLotissementElement  extends Dossier{
  transmission: Transmission;
  sections: Section;
  zone: String;
  domaine: String;
  dateMajPlan: Date;
  contribuableBeneficiaire: GeneralContribuable;
  structureBeneficiaire: StructureElement;
  acteurExterne: ActeurElement;
  promoteurImmobilier: ActeurElement;
  parcellesADesactive: ParcelleElement[];
  ilotsADesactive: IlotElement[];
  sectionsADesactive: Section[];
  parcellesAAjouter: ParcelleElement[];
  parcellesAModifier: ParcelleElement[];
  numerosDossierRetrait: String[];
  ilotsAAjouter: IlotElement[];
  ilotsAModifier: IlotElement[];
  sectionsAModifier:Section[];
  sectionsAAjouter:Section[];
  typeOperation: TypeOperation;
  commune: CommuneElement;
}

export enum TypeOperation {
  RESTRUCTURATION="RESTRUCTURATION",
  RENOVATION_URBAINE= "RENOVATION_URBAINE",
  REMEMBREMENT="REMEMBREMENT",
  TOURNEE_CONSERVATION="TOURNEE_CONSERVATION",
  REGULARISATION_PLAN="REGULARISATION_PLAN"
}