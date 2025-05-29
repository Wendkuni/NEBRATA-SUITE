import {
  Adresse,
  Civilite,
  Contact,
  Genre,
  ReseauSociaux
} from '@sycadApp/models/data-references/system/model';
import { Permission } from '@sycadApp/models/data-references/security/permission.model';
import { ProfilElement } from '@sycadApp/models/data-references/security/profil.model';
import { RoleElement } from '@sycadApp/models/data-references/security/role.model';
import {LocaliteElement, LocaliteAutocomplete, ParcelleElement} from "@sycadApp/models/data-references/territoire/localite.model";
import {ArrondissementElement} from '@sycadApp/models/data-references/territoire/arrondissement.model';
import {CommuneElement} from '@sycadApp/models/data-references/territoire/commune.model';
import {DestinationParcelle} from '@sycadApp/models/bornage/destinationParcelle.model';
import { MatTableDataSource } from '@angular/material/table';
import { BureauNestedElement } from '../organigramme/bureau.model';
import { ServiceNestedElement } from '../organigramme/service.model';
import { StructureElement, StructureNestableElement } from '../organigramme/structure.model';




export class UtilisateurElement {
  guid: string;
  username: string;
  password: string;
  active: boolean;
  avatar: string;
  createdAt: Date;
  lastPasswordResetDate: Date;
  editedAt: Date;
  permissions: Permission [];
  roles: RoleElement [];
  profils: ProfilElement [];
  emails: Contact [];
  telephones: Contact [];
  reseauSociaux: ReseauSociaux[];
}

export class UtilisateurItem {
  guid: string;
  username: string;
  password: string;
  active: boolean;
  avatar: string;
  createdAt: Date;
  lastPasswordResetDate: Date;
  editedAt: Date;
  permissions: string [];
  roles: string [];
  profils: string [];
  emails: Contact [];
  telephones: Contact [];
}

export class ContribuableElement extends UtilisateurElement{

}
export class ContribuableItem extends UtilisateurItem{


}

export class GeneralContribuable {
  guid: string;
  codeUnique: string;
  username: string;
  nom: string;
  prenoms: string;
  avatar: string;
  sigle: string;
  nomDeJeuneFille: string;
  dateDeCreation: Date;
  dateNaissance: Date;
  lieuNaissance: string;
  genre: Genre;
  nomPere: string;
  prenomsPere: string;
  nomMere: string;
  civilite: string;
  prenomsMere: string;
  categorie: CategorieActeur;
  libelle: string;
  pieceOfficielle: PieceOfficielle;
  profession: ProfessionElement;
  nationalite: Nationalite;
  denomination: string;
  statusJuridique: StatusJuridique;
  regimeFiscal: RegimeFiscal;
  capitalFiscal: number;
  chiffreAffaire: number;
  numCNSS: string;
  activitePrincipale: SecteurActivitePrincipale;
  emails: Contact [];
  telephones: Contact [];
  libelleTelephone: string;
  libelleEmail: string;
  reseauSociaux: ReseauSociaux[];
  active:boolean;
  password: string;
  passwordc: string;
   situationMatrimoniale:SituationMatrimonialeElement;
   personnesContacts: PersonneAContacter [];
   pieceComplementaires: PieceOfficielle [];
   adresses: AdresseContribuable[];
   csrf: string;
   matricule: string;
   fonction:string;
   ville:string;
   rue: string;
   porte:string;
   quartier: string;
   pieceComplementaire: PieceOfficielle [];
   titreHonorifique:TitreHonorifiqueAutocomplete;
   affectation: {
     bureau: BureauNestedElement;
     service: ServiceNestedElement;
     structure: StructureNestableElement;
   }
}
export class ContribuableAutocomplete {
  guid: string;
  codeUnique: string;
  denomination: string;
  sigle: string;
  categorie: CategorieActeur;
}
export class TitreHonorifiqueAutocomplete {
  id: number;
  libelle:string;
}
export class TitreHonorifiqueElement {
  id: number;
  libelle:string;
}
export class TitreHonorifiqueItem {
  id: number;
  libelle:string;
}
export class NationaliteAutocomplete {
  id: number;
  libelle: string;
}
export class NationaliteElement {
  id: number;
  libelle:string;
}
export class NationaliteItem {
  id: number;
  libelle:string;
}


export class ProfessionAutocomplete {
  id: number;
  nom:string;
  code:string;
}
export class ProfessionElement {
  id: number;
  nom:string;
  code:string;
}
export class ProfessionItem {
  id: number;
  nom:string;
  code:string;
}

export class SituationMatrimonialeAutocomplete {
  id: number;
  libelle: string
}
export class SituationMatrimonialeElement {
  id: number;
  libelle: string
}
export class SituationMatrimonialenItem {
  id: number;
  libelle: string
}

export class PieceOfficielle {
  id: number;
  nip: string;
  categorie: CategoriePiece;
  dateObtention: Date;
  dateExpiration: Date;
  numero: string;
  autoriteDeDelivrance: string;
  lieuDeDelivrance: string;
  documentPiece: string;
}

export class PersonneAContacter {
  id: number;
  prenom: string;
  nom: string;
  genre: Genre;
  civilite: Civilite;
  telephone: string;
  email: string;
  adresse: AdresseContribuable;
  profession: string;
}


export class StatusJuridique {
  id: number;
  libelle: string;
}

export class ContactEntreprise {
  id: number;
  prenom:string;
  nom:string;
  fonction:string;
  telephone:string;
  email: string;
  adresse : AdresseContribuable;
  civilite: Civilite;
  genre: Genre;
}


export class CategorieActeur{
  id: number;
  libelle: string;
  code: string;
  profils: ProfilElement[];
}
export class SecteurActivitePrincipale {
 id: number;
  code: string;
  nom: string;
}
export class RegimeFiscal {
  id: number;
  code: string;
  libelle: string;
}
export class LivreFoncier{
  id: number;
  code: string;
  libelle: string;
  circonscription: string;
  dernierNumero: number;
  structure: StructureElement;
}
export class CategoriePiece{
  id: number;
  libelle: string;
  code: string;
  typePieceOficielles: TypePiece[];

}
export enum TypePiece{
  CONTRIBUABLEMORAL= "Contribuable morale",
  CONTRIBUABLEPHYSIQUE= "Contribauble physique",
  ACTEUR= "Acteur",
  INDIVISION= "Indivision",
  AGENT= "Agent"

}
export class Nationalite {
id:number;
libelle: string;
}

export class AdresseContribuable{
id: number;
libelle: string;
principal: boolean;
localite: LocaliteAutocomplete;
rue: string;
quartier: string;
porte: string;
parcelle: ParcelleElement;
ville: string;
pays: string;
}

export class ContribuableReseauSociaux{
  id: number;
  profil: string;
  type: TypeReseauSocial;
}
export class Section{
  id: number;
  numero: string;
  libelle: string;
  numeroAncien: string;
  commune: CommuneElement;
}
export class Ilot{
  id: number;
  numero: string;
  numeroAncien: string;
  arrondissement?: ArrondissementElement;
  parcelles: ParcelleElement[] |MatTableDataSource<ParcelleElement>;
  section: Section;
}

export enum TypeReseauSocial{
  FACEBOOK= "Facebook",
  TWITTER= "Twitter",
  LINKEDIN= "Linkedin",
  INSTAGRAM= "Instagram",
  VIADEO= "Viadeo",
  YOUTUBE= "Youtube",
}

export enum EtatAttribution {
  LIBRE="LIBRE",
  OCCUPE="OCCUPE",
  CREATION="CREATION",
  INACTIF="INACTIF",
  DESACTIVER="DESACTIVER",
  OPPOSITION="OPPOSITION",
}

export class SectionnementUpdate {
  nbJours: number;
  actif: boolean;
  code: string;
  libelle: string;
  description: string;
  destinations: DestinationParcelle[];
  typeDocuments: DocumentType[];
  categoriePieces: CategoriePiece[];
}

