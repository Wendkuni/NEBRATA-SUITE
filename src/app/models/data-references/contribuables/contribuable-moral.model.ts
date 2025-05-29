import {
  ContribuableElement,
  ContactEntreprise,
  ContribuableItem,
  RegimeFiscal,
  SecteurActivitePrincipale,
  PieceOfficielle,
  Nationalite,
  AdresseContribuable,
  ContribuableReseauSociaux,
} from '@sycadApp/models/data-references/contribuables/global.model';
import {
  Contact,
  StatusJuridique
} from '@sycadApp/models/data-references/system/model';
import {LocaliteElement} from '@sycadApp/models/data-references/territoire/localite.model';


export class ContribuableMoraleElement extends ContribuableElement{
    guid: string;
    active: boolean;
    username: string;
    password: string;
    passwordc: string;
    codeUnique: string;
    nationalite: Nationalite;
    pieceOfficielle: PieceOfficielle;
    csrf: string;
    dateDeCreation: Date;
    denomination: string;
    sigle: string;
    statusJuridique: StatusJuridique;
    regimeFiscal: RegimeFiscal;
    capitalFiscal: number;
    chiffreAffaire: number;
    numCNSS: string;
    activitePrincipale: SecteurActivitePrincipale;
    adresses: AdresseContribuable[];
    reseauSociaux: ContribuableReseauSociaux[];
    activiteSecondaires: SecteurActivitePrincipale[];
    pieceComplementaires: PieceOfficielle[];
    contactEntreprises: ContactEntreprise[];
    emails: Contact [];
    telephones: Contact [];
  }
  export class ContribuableMoraleItem extends ContribuableItem{
    guid: string;
    active: boolean;
    username: string;
    password: string;
    passwordc: string;
    dateDeCreation: Date;
    codeUnique: string;
    denomination: string;
    sigle: string;
    nationalite: Nationalite;
    pieceOfficielle: PieceOfficielle;
    secteurActivitePrincipale: SecteurActivitePrincipale;
    regimeFiscal: RegimeFiscal;
    capitalFiscal: number;
    chiffreAffaire: number;
    numCNSS: string;
    adresses: AdresseContribuable[];
    reseauSociaux: ContribuableReseauSociaux[];
    activiteSecondaire: SecteurActivitePrincipale[];
    pieceComplementaires: PieceOfficielle[];
    statusJuridique: StatusJuridique;
    contactEntreprises: ContactEntreprise[];
    emails: Contact [];
    telephones: Contact [];
  }


  export class ContribuableMoraleAutocomplete {
    guid: string;
    username: string;
    libelle: string;
    denomination: string;
    statusJuridique: string;
    sigle: string;
  }
