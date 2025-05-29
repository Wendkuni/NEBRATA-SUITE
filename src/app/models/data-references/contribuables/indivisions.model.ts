import {Genre, Civilite, StatusJuridique, Contact} from '@sycadApp/models/data-references/system/model';
import {ContribuableMoraleElement} from '@sycadApp/models/data-references/contribuables/contribuable-moral.model';
import {
  AdresseContribuable,
  ContactEntreprise, ContribuableReseauSociaux, Nationalite,
  PieceOfficielle
} from '@sycadApp/models/data-references/contribuables/global.model';
import { IndivisionRelationElement, QualiteRelation } from '@sycadApp/models/data-references/system/indivision-relation.model';

export class IndivisionWebForm {
  id: number;
  csrf: string;
  dateDeCreation: Date;
  relation: number;
}

export class IndivisionItem   extends ContribuableMoraleElement{
  id: number;
  guid: string;
  active: boolean;
  username: string;
  password: string;
  passwordc: string;
  codeUnique: string;
  denomination: string;
  dateDeCreation: Date;
  statusJuridique: StatusJuridique;
  relation: IndivisionNestedRelationElement;
  nationalite: Nationalite;
  membres: IndivisionMembreElement[];
  pieceOfficielle: PieceOfficielle;
  pieceComplementaires: PieceOfficielle[];
  adresses: AdresseContribuable[];
  emails: Contact [];
  telephones: Contact [];
  contactEntreprises: ContactEntreprise[];
  reseauSociaux: ContribuableReseauSociaux[];

}

export class IndivisionElement  extends ContribuableMoraleElement {
  id: number;
  guid: string;
  active: boolean;
  username: string;
  password: string;
  passwordc: string;
  codeUnique: string;
  denomination: string;
  dateDeCreation: Date;
  statusJuridique: StatusJuridique;
  relation: IndivisionRelationElement;
  nationalite: Nationalite;
  membres: IndivisionMembreElement[];
  pieceOfficielle: PieceOfficielle;
  pieceComplementaires: PieceOfficielle[];
  adresses: AdresseContribuable[];
  emails: Contact [];
  telephones: Contact [];
  contactEntreprises: ContactEntreprise[];
  reseauSociaux: ContribuableReseauSociaux[];
}

export class IndivisionAutocomplete {
  dateDeCreation: Date;
  relation: IndivisionRelationAutocomplete;
}

export class IndivisionMembreElement {
  id: number;
  guid: string;
  membre: ContribuablePhysiqueNestedElement;
  qualite: QualiteRelation;
}

export class IndivisionRelationItem {
  id: number;
  libelle: string;
  qualites: QualiteRelation[];
}
export class IndivisionNestedRelationElement {
  id: number;
  libelle: string;
}
export class IndivisionRelationAutocomplete {
  id: number;
  libelle: string;
}

export class UtilisateurNestedElement {
  guid: string;
  active: boolean;
  username: string;
  createdAt: Date;
  editedAt: Date;
}

export class ContribuablePhysiqueNestedElement extends UtilisateurNestedElement {
  prenoms: string;
  nom: string;
  genre: Genre;
  civilite: Civilite;
  dateNaissance: Date;
  lieuNaissance: string;
  codeUnique: string;
  sigle: string;
  nip: string;
  avatar: string;
}

