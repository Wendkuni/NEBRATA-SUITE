import { Dossier, Transmission } from '@sycadApp/models/workflow/common/general';

import {GeneralContribuable, Section} from '@sycadApp/models/data-references/contribuables/global.model';
import {StructureElement} from '@sycadApp/models/data-references/organigramme/structure.model';
import {IlotElement, ParcelleElement} from '@sycadApp/models/data-references/territoire/localite.model';
import {ActeurElement} from '@sycadApp/models/data-references/contribuables/acteur.model';
import { CommuneElement } from '../data-references/territoire/commune.model';
import {
  ArrondissementElement
} from "@sycadApp/models/data-references/territoire/arrondissement.model";

export class PlanCadastralRegularisationElement  extends Dossier{
  transmission: Transmission;
  sections: Section;
  arrondissement: ArrondissementElement;
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
  ilotsAAjouter: IlotElement[];
  ilotsAModifier: IlotElement[];
  sectionsAModifier:Section[];
  sectionsAAjouter:Section[];
  parcellesADesactiver: ParcelleElement[];
  numerosDossierRetrait: String[];
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
