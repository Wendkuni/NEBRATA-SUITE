import {Document, Dossier, Transmission} from '@sycadApp/models/workflow/common/general';
import { BureauNestedElement } from "../organigramme/bureau.model";
import { ServiceNestedElement } from "../organigramme/service.model";
import {StructureElement, StructureNestableElement} from '../organigramme/structure.model';
import { Adresse, Civilite, Genre, StatusJuridique } from "../system/model";
import { CategorieActeur, GeneralContribuable, Ilot, Nationalite, PieceOfficielle, ProfessionElement, RegimeFiscal, SecteurActivitePrincipale, Section, SituationMatrimonialeElement } from "./global.model";
import { ParcelleElement, ParcelleItem } from '@sycadApp/models/data-references/territoire/localite.model';
import { CommuneItem } from "../territoire/commune.model";

export class CompteElement  extends Dossier{
  typeCompte: string;
  informationsContribuable: ContribuableEnLigneInformation;
  contribuableMatche: GeneralContribuable;
  transmission: Transmission;

  }
  export class ContribuableEnLigneInformation {
    email: string;
    prenoms: string;
    nom: string;
    nomDeJeuneFille:string;
    dateNaissance: Date;
    lieuNaissance:string;
    nomPere:string;
    prenomsPere:string;
    nomMere:string;
    prenomsMere:string;
    matricule: string;
    dateDeCreation: Date;
    fonction:string;
    denomination: string;
    sigle: string;
    numCNSS: string;
    telephone: string;
    numeroIfu: string;

    situationMatrimoniale:SituationMatrimonialeElement;
    profession:ProfessionElement;
    genre: Genre;
    civilite: Civilite;
    affectation: {
      bureau: BureauNestedElement;
      service: ServiceNestedElement
      structure: StructureNestableElement;
    };
    nationalite: Nationalite;
    pieceOfficielle: PieceOfficielle;
    categorie: CategorieActeur;
    statusJuridique: StatusJuridique ;
    regimeFiscal: RegimeFiscal;
    activitePrincipale: SecteurActivitePrincipale;
    infoParcelle: InfoParcelle;
    adresses: Adresse[]
  }


  export class InfoParcelle {
    commune:CommuneItem;
    section:Section;
    ilot:Ilot;
    numero: String;
    numeroAncien: String;
    documentParcelle: Document;
  }
