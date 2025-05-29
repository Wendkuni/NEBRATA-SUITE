import {
  ContribuableElement,
  PersonneAContacter,
  ContribuableItem,
  PieceOfficielle,
  NationaliteElement,
  ProfessionElement,
  SituationMatrimonialeElement, AdresseContribuable
} from '@sycadApp/models/data-references/contribuables/global.model';
import {Genre, Civilite, Adresse, Contact, ReseauSociaux} from '@sycadApp/models/data-references/system/model';
export class ContribuablePhysiqueElement extends ContribuableElement {
 guid: string;
 active:boolean;
 password: string;
 passwordc: string;
  prenoms: string;
  nom: string;
  codeUnique:string;
  nomDeJeuneFille:string;
  libelle: string;
  genre: Genre;
  civilite: Civilite;
  situationMatrimoniale:SituationMatrimonialeElement;
  pieceOfficielle:PieceOfficielle;
  profession:ProfessionElement;
  nationalite:NationaliteElement;
  dateNaissance: Date;
  lieuNaissance:string;
  nomPere:string;
  prenomsPere:string;
  nomMere:string;
  prenomsMere:string;
  personnesContacts: PersonneAContacter [];
  pieceComplementaires: PieceOfficielle [];
  adresses: AdresseContribuable[];
  emails: Contact[];
  telephones: Contact[];
  reseauSociaux: ReseauSociaux[];
}
export class ContribuablePhysiqueItem extends ContribuableItem  {
  prenoms: string;
  nom: string;
  genre: Genre;
  civilite: string;
  libelle: string;
  dateNaissance: Date;
  lieuNaissance:string;
  nomPere:string;
  prenomsPere:string;
  nomMere:string;
  prenomsMere:string;
  personnesContacts: PersonneAContacter [];
  pieceOfficielle:PieceOfficielle;
  pieceComplementaires: PieceOfficielle [];
  adresses: string [];
}

export class ContribuablePhysiqueAutocomplete  {
  guid: string;
  username: string;
  libelle: string;
  prenoms: string;
  nom: string;
  genre: Genre;
}
