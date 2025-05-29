import { HttpParams } from '@angular/common/http';
import { TemplateRef } from '@angular/core';
import { Transition } from '@sycadApp/models/workflow/common/general';

export class FiltreRecherche {
  id:number;
  titre: string;
}
export enum TypeColonne{
  STRING="STRING",BOOLEAN="BOOLEAN",MIXTEVALUE="MIXTEVALUE",DATE="DATE",DATETIME="DATETIME",LIEN="LIEN",ACTION="ACTION"
}
export class SycadTableColonne {
  name: string;
  nameFilter: string;
  label: string;
  show: boolean;
  isfiltered: boolean;
  isSortable: boolean;
  filterValue: string | boolean;
  type : TypeColonne;


  constructor(name: string, label: string, show: boolean, type: TypeColonne,isfiltered: boolean,filterValue: string| boolean,isSortable:boolean=true,nameFilter: string=null) {
      this.name=name;
      this.label=label;
      this.show=show;
      this.type=type;
      this.isfiltered=isfiltered;
      this.filterValue=filterValue;
      this.isSortable=isSortable;
      this.nameFilter=nameFilter;

  }
}

export class SycadTableMetaData {
    colonnes: SycadTableColonne[]=Array<SycadTableColonne>();
    title: string;
    isExport: boolean;
    nestedTable: boolean;
    typeRessource: string;
    globalFilter: string;
    isExpand: boolean;
    isCreationActive: boolean;
    isRefresh: boolean;
    isAdvancedSearch: boolean;
    isDeletable: boolean;
    isCompte: boolean;
    isProfil: boolean;
    isAffectation: boolean;
    isOnlyListing: boolean;
    private isProcessus: boolean;
    isEditable: boolean;
    actionElement: ActionElementEvent;
    templateExpand: TemplateRef<any>;
    preShowColumnValue: (any,string)=> any = (colonne, key)=>colonne[key];

    constructor(title: string,isExport: boolean=true,isExpand=true,isAdvancedSearch: boolean=false,globalFilter="",isCreationActive:boolean = true) {
        this.title=title;
        this.isExport=isExport;
        this.isAdvancedSearch=isAdvancedSearch;
        this.isExpand=isExpand;
        this.globalFilter=globalFilter;
        this.isCreationActive=isCreationActive;
        this.isRefresh = true;
        this.isDeletable=true;
        this.isCompte=false;
        this.isAffectation=false;
        this.isProfil=false;
        this.isEditable=true;
        this.isProcessus=false;
        this.isOnlyListing=false;
        this.actionElement=new ActionElementEvent();
        this.nestedTable=false;
    }

    public pushColumn(colonne : SycadTableColonne) :  SycadTableMetaData{
     this.colonnes.push(colonne);
     return this;
    }
    public transformeToProcessus(){
      this.isProcessus=true;
      this.isDeletable=false;
      this.isEditable=false;
    }
    public getProcessus(){
       return  this.isProcessus;
    }
  }
  export class ActionElementEvent{
    libelle:string;
    enable:boolean;
    icon:string;
    constructor( libelle:string="",enable:boolean=false,icon:string="preview") {
      this.libelle=libelle;
      this.enable=enable;
      this.icon=icon;
    }
}

  export class GenericAction{
    name:string;
    libelle:string;
    constructor( name:string,libelle:string) {
      this.name=name;
      this.libelle=libelle;
    }
}
  export class GenericActionEvent{
      name:string;
      data:any[];
  }
  export class ActionProcessusEvent{
    transition:Transition;
    numero:string;
    constructor(transition:Transition,numero:string){
      this.transition=transition;
      this.numero=numero;
    }
}


  export class MappingAPIParams {
    pageName:string;
    limitName:string;
    searchColonneSuffix:string;
    sortColonneSuffix:string;
    sortName:string;
    orderName:string;
    orderASCName:string;
    orderDESCName:string;
    searchName:string;
    constructor(pageName:string,limitName:string, sortName:string, orderName:string,orderASCName:string,orderDESCName:string,searchName:string,searchColonneSuffix:string,sortColonneSuffix:string ) {
     this.pageName=pageName;
     this.limitName=limitName;
     this.sortName=sortName;
     this.orderName=orderName;
     this.orderASCName=orderASCName;
     this.orderDESCName=orderDESCName;
     this.searchName=searchName;
     this.searchColonneSuffix=searchColonneSuffix;
     this.sortColonneSuffix=sortColonneSuffix;
    }

  }
  export class SycadTableContext<T> {
    items: T[];
    totalCount: number;
    page:number;
    limit:number;
    sort:string;
    filters: Map<string, string|boolean>;
    order:string;
    search:string;

    constructor(){
      this.limit=10;
      this.page=0;
      this.search="";
      this.filters=new Map<string, string|boolean>();
    }

     public getParams(mappings : MappingAPIParams) : HttpParams{
      let httpParams = new HttpParams()
      .set(mappings.pageName, (this.page)?this.page.toString():"0")
      .set(mappings.limitName, (this.limit)?this.limit.toString():"10");

      if(this.sort && this.order) {
        httpParams= httpParams.set(mappings.sortName, this.sort+mappings.sortColonneSuffix);
        httpParams=httpParams.set(mappings.orderName, (this.order)?this.order:mappings.orderASCName);
      }

      if(this.search) {
        httpParams= httpParams.set(mappings.searchName, this.search);
      }




      this.filters.forEach((value,key) => {
        httpParams= httpParams.set(key+mappings.searchColonneSuffix, value.toString());
    });

      return httpParams;
    }
  }
