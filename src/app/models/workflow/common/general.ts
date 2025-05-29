import { CategoriePiece, GeneralContribuable } from '@sycadApp/models/data-references/contribuables/global.model';
import { BureauElement } from '@sycadApp/models/data-references/organigramme/bureau.model';
import {ServiceElement} from '@sycadApp/models/data-references/organigramme/service.model';
import {StructureElement} from '@sycadApp/models/data-references/organigramme/structure.model';
import {DocumentType} from '@sycadApp/models/data-references/system/document-type.model';
import { DestinationParcelle } from '@sycadApp/models/bornage/destinationParcelle.model';
import { ActeurElement } from '@sycadApp/models/data-references/contribuables/acteur.model';
import { ParcelleElement } from '@sycadApp/models/data-references/territoire/localite.model';
import { CessionSource } from '@sycadApp/models/workflow/common/attribution-source.model';
import { TitreRecette } from '@sycadApp/models/impot/mode-reglement.model';
import {
  MotifRejet
} from "@sycadApp/models/data-references/system/motif-rejet.model";
import {
  TransitionFonctionnelle
} from "@sycadApp/models/data-references/organigramme/transition-fonctionnelle.model";



export class Transition {
    id: number;
    code: string;
    libelle: string;
    nbJours: number;
    categoriePieces: CategoriePieceProcessus[]=[];
    description: string;
    transitionFonctionnelle: TransitionFonctionnelle;
  }

  export class Transmission{
    id: number;
    bureau: BureauElement;
    service: ServiceElement;

    structure: StructureElement;
  }

export class Dossier {
    numero: string;
    objet: string;
    terminer: boolean;
    dateExterne: Date;
    dateCreationDossier: Date;
    dateModificationDossier: Date;
    etat: EtatProcess;
    etatDossier: boolean;
    statusDossier: StatusDossier;
    refExterne: string;
    observation: string;
    transitions: Transition[];
    transmission: Transmission;
    documents: Document[];
    documentType: DocumentType;
    categoriePiece: CategoriePiece;
    motifRejet: MotifRejet;
    mandats: Mandat[];
    listPieces: DossierPiece[];
    titresRecette: TitreRecette[];
}




export class Mandat {
  id: number;
  actif: boolean;
  objet: string;
  libelle: string;
  description: string;
  reference: string;
  mandataire: GeneralContribuable;
  mandant: GeneralContribuable;
  debut: Date;
  fin: Date;
  pieceJointe: string;
}
export class MandatElement extends Dossier {
  description: string;
  mandataire: GeneralContribuable;
  mandant: GeneralContribuable;
  debut: Date;
  fin: Date;
}

export class MandatElem extends Dossier {
  mandat: Mandat;
}
export class EtatProcess {
  code: string;
  id: number;
  description: string;
  libelle: string;
}

export class HistoriqueWorkflow {
  etatInitial: string;
  etatFinal: string;
  transition: string;
  executeur: string;
  structureInitial: string;
  structureFinal: string;
  dateAction: Date;
  dossier: Dossier;
}

export class DossierPiece {
  id: number;
  observation: string;
  reference: string;
  autoriteDeDelivrance: string;
  dateDelivrance: Date;
  dateExpiration: Date;
  pieceJointe: string;
  categorie: CategoriePiece;

}

export class ParametreReport {
  id: number;
  file: string;
  code: string;
  type: number;
  description: string;
}

export class Document{
  id: number;
  numero: string;
  numeroVolume: string;
  numeroFolio: string;
  numeroRegistre: string;
  libelle: string;
  pieceJointe: string;
  archivDoc: string;
  dateDoc: Date;
  ordre: number;
  actif: boolean;
  dateValidite: Date;
  dateRetrait: Date;
  retirerPar: GeneralContribuable;
  dateRegistre: Date;
  documentType: DocumentType;
}

export class Processus {
  id: number;
  nbJours: number;
  actif: boolean;
  code: string;
  categoriePieces: CategoriePieceProcessus[] = [];
  libelle: string;
  description: string;
  transitions: Transition[];
  etats: EtatProcess[];
  destinations: DestinationParcelle[] = [];
  typeDocuments: DocumentType[] = [];

}

export class CategoriePieceProcessus {
  id: number;
  nbExemplaire: number;
  ordre: number;
  obligatoire: boolean;
  estAffiche: boolean;
  libelle: string;
  categoriePiece: CategoriePiece;

}



export class CessionParcelle  extends Dossier{
  parcelle: ParcelleElement;
  acteur: ActeurElement;
  cessionSource: CessionSource;
  documentDeSortie:Document;
  acteCession:Document;
  acteEvaluation:Document;
  documentAnnule:Document;
  attributionEtat:AttributionEtat;

}


export class Quittance {
  id: number;
  reference: string;
  date: Date;
  montant: number;
}

export enum StatusDossier {
  ENCOURS="ENCOURS",
  VALIDE="VALIDE",
  ANNULE="ANNULE"
}

export enum AttributionEtat {
  NORMAL="NORMAL",
  PARCELLE_INNEXISTANTE="PARCELLE_INNEXISTANTE",
  DOUBLE_CESSION="DOUBLE_CESSION"
}


/*
export class ParcelleAffectation extends Dossier{
  parcelle: ParcelleElement;
  acteur: ActeurElement;
  cessionSource: CessionSource;
  structure: StructureElement;
}
*/


/*
export class ParcelleRetrait extends Dossier{
  parcelle: ParcelleElement;
  acteur: ActeurElement;
  cessionSource: CessionSource;
  structure: StructureElement;
}

export class Mandat {
   id: number;
   actif: boolean;
   objet: string;
   description: string;
   reference: string;
   mandataire: string;
   mandant: string;
   dateDebut: Date;
   dateFin: Date;
   pieceJointe: string;
}
*/
