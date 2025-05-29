
 export class  IndivisionRelationElement{
    id: number;
    libelle: string;
    qualites: QualiteRelation [];
  }

  export class  IndivisionRelationItem{
    id: number;
    libelle: string;
    qualites: string [];
  }

  export class  IndivisionRelationAutocomplete{
    id: number;
    libelle: string;
  }
  
  export class  QualiteRelation{
    id: number;
    libelle: string;
    multiple:boolean;
  }