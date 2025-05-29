import {
  LocaliteAutocomplete,
  ParcelleAutocomplete
} from "@sycadApp/models/data-references/territoire/localite.model";
import {TypePiece} from '@sycadApp/models/data-references/contribuables/global.model';

export class Contact {
  id: number;
  value: string;
  level: string;
  principal: boolean;
  type: TypeContact;
}
export class ReseauSociaux {
  id: number;
  profil: string;
  type: string;
}

export class Civilite {
  id: number;
  libelle: string;
}
export class Adresse {
  id: number;
  libelle: string;
  principal: boolean;
  localite: LocaliteAutocomplete;
  rue: string;
  quartier: string;
  porte: string;
  parcelle:ParcelleAutocomplete
}

export enum TypeContact {
  EMAIL = "EMAIL",
  TELEPONE = "TELEPONE",
}

export enum Genre {
  HOMME = "HOMME",
  FEMME = "FEMME",
}

export enum TypeExportFile {
  PDF = "pdf",
  XLS = "xls",
  XLSX = "xlsx",
  CSV = "csv",
  WORD = "docx",
  ODT = "odt",
  IMAGE = "png",
  PRINTER = "printer",
}

export class StatusJuridique {
  id: number;
  libelle: string;
  code: string;
}
export class StatusJuridiqueElement {
  id: number;
  libelle: string;
}
export class StatusJuridiqueItem {
  id: number;
  libelle: string;
}
export class StatusJuridiqueAutocomplete {
  id: number;
  libelle: string;
}

export enum TypeMenu {
  VERTICAL,
  HORIZONTAL,
}
export enum StyleMenu {
  OUVERT,
  COMPACT,
  MINIMAL,
}
export class Preference {
  id: number;
  langue: string;
  theme: string;
  showFooter: boolean;
  rightToLeft: boolean;
  fixedHeader: boolean;
  ouvrirMenu: boolean;
  epingleMenu: boolean;
  typeMenu: TypeMenu;
  styleMenu: StyleMenu;
}

export class TypePieceIdentite {
  id: number;
  code:string;
  libelle: string;
  identite: boolean;
  typePieceOficielles: TypePiece[];
}

export class Parametre {
  id: number;
  description: string;
  valeur: string;
  typeValeurParametre: string;
  categorieParametre: string;
}

export enum ActionType {
  VIEW = "consultation",
  VIEWSINGLE = "consultation_element",
  HEAD = "existance",
  EXPORT = "export",
  DECONNEXION = "deconnexion",
  AUTOCOMPLETE = "autocompletion",
  CREATION = "création",
  UPDATE = "modification",
  DELETE = "suppression",
  ENABLE = "Activation",
  DISABLE = "Désactivation",
  WORKFLOW_TRANSITION = "transaction",
  REFRESHCONNEXION = "refreshconnexion",
  MENUUSER = "menuuser",
  PREFERENCEVIEW = "preferenceview",
  PREFERENCEUPDATE = "preferenceupdate",
  MYPROFILUSER = "myprofil",
  MYPROFILUSERCREDENTIAL = "changemycredential",
  MYPROFILUSERAVATAR = "changemyavatar",
  MYPROFILUSERMAIL = "changemyemails",
  MYPROFILUSERTELEPHONE = "changemyphones",
  MYPROFILUSERDELTELEPHONE = "delmyphone",
  MYPROFILUSERADRESSE = "cgangemyadresse",
  MYPROFILUSERDELADRESSE = "delmyadresse",
  MYPROFILUSEROTP = "userotp",
  UPLOAD = "upload",
  DOWNLOAD = "téléchargement",
  ASYNCVALIDATION = "asyncvalidation",
}


export class Indexation {
  id: number;
  libelle: string;
  lastIndexationDate: Date;
}

export class Notification {
  id: number;
  numero: string;
  libelleProcessus: string;
  dateCreationDossier: string;
  dateModificationDossier: string;
  descriptionProcessus: string;
  objet: string;
  codeProcessus: string;
}
