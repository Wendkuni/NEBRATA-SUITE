
import { ContribuableMoraleAutocomplete, ContribuableMoraleElement, ContribuableMoraleItem } from '@sycadApp/models/data-references/contribuables/contribuable-moral.model';
import {
  AdresseContribuable,
  CategorieActeur, ContactEntreprise, ContribuableReseauSociaux,
  Nationalite,
  PieceOfficielle,
  RegimeFiscal, SecteurActivitePrincipale
} from '@sycadApp/models/data-references/contribuables/global.model';
import {
  Civilite,
  Contact,
  StatusJuridique
} from "@sycadApp/models/data-references/system/model";

export class ActeurElement extends ContribuableMoraleElement{
  guid: string;
  username: string;
  password: string;
  passwordc: string;
  codeUnique: string;
  matricule: string;
  prenoms: string;
  nom: string;
  civilite: Civilite;
  nationalite: Nationalite;
  categorie: CategorieActeur;
  pieceOfficielle: PieceOfficielle;
  csrf: string;
  dateDeCreation: Date;
  denomination: string;
  sigle: string;
  statusJuridique: StatusJuridique ;
  regimeFiscal: RegimeFiscal;
  capitalFiscal: number;
  chiffreAffaire: number;
  numCNSS: string;
  adresses: AdresseContribuable[];
  activitePrincipale: SecteurActivitePrincipale;
  activiteSecondaires: SecteurActivitePrincipale[];
  reseauSociaux: ContribuableReseauSociaux[];
  pieceComplementaires: PieceOfficielle[];
  contactEntreprises: ContactEntreprise[];
  emails: Contact [];
  telephones: Contact [];
}

export class ActeurItem extends ContribuableMoraleItem{
  guid: string;
  username: string;
  password: string;
  passwordc: string;
  codeUnique: string;
  nationalite: Nationalite;
  categorie: CategorieActeur;
  pieceOfficielle: PieceOfficielle;
  dateDeCreation: Date;
  denomination: string;
  sigle: string;
  statusJuridique: StatusJuridique;
  regimeFiscal: RegimeFiscal;
  capitalFiscal: number;
  chiffreAffaire: number;
  numCNSS: string;
  activitePrincipale: SecteurActivitePrincipale;
  activiteSecondaires: SecteurActivitePrincipale[];
  reseauSociaux: ContribuableReseauSociaux[];
  adresses: AdresseContribuable[];
  contactEntreprises: ContactEntreprise[];
  pieceComplementaires: PieceOfficielle[];
  emails: Contact [];
  telephones: Contact [];
}

export class ActeurAutocomplete extends ContribuableMoraleAutocomplete {
  guid: string;
  username: string;
  libelle: string;
  libelleTelephone: string;
  libelleEmail: string;
  categorie: string;
  telephones: Contact [];
  emails: Contact [];
}

