import {  ContribuableMoraleElement, ContribuableMoraleItem } from '@sycadApp/models/data-references/contribuables/contribuable-moral.model';
import {  ContribuablePhysiqueElement, ContribuablePhysiqueItem } from '@sycadApp/models/data-references/contribuables/contribuable-physique.model';
import {PieceOfficielle} from '@sycadApp/models/data-references/contribuables/global.model';



export class IndivisionQualite{
    id: number;
    libelle: string;
  }
  export class IndivisionRelation{
    id: number;
    libelle: string;
    qualites: IndivisionQualite[];
  }


  export class IndivisionMembreElement{
    id: number;
    membre: ContribuablePhysiqueElement;
    qualite: IndivisionQualite;
  }

  export class IndivisionMembreItem{
    membre: ContribuablePhysiqueItem;
    qualite: string;
  }

export class IndivisionElement extends ContribuableMoraleElement{
    dateDeCreation: Date;
    membres: IndivisionMembreElement[];
    relation: IndivisionRelation;
  }

  export class IndivisionItem extends ContribuableMoraleItem{
    dateDeCreation: Date;
    membres: IndivisionMembreItem[];
    relation: string;
  }
  export class IndivisionAutocomplete {
    guid: string;
    username: string;
    relation: string;
  }
