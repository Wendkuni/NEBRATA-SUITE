import { GenericDatasource } from '@sycadApp/models/generic-datasource';
import { GenericDatasourceMock } from '@sycadApp/models/generic-datasource.mock';
import { Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs/operators';
import { NgSelectConfig } from '@ng-select/ng-select';
import {FormGroup} from "@angular/forms";
import {TypeColonne} from "@sycadApp/libs/model-table";
import {HttpParams, HttpResponse} from "@angular/common/http";
import { TemplateRef } from '@angular/core';
import { RemoteAutocompleteTableMetaData, RemoteAutocompleteTableColonne } from './model-advanced-remote-autocomplete';



export class CustomNgSelectConfig {
    public loading?: boolean=false;
    public listRessource$?: Observable<any[]>;
    public term?: Subject<string>= new Subject<string>();
    public multiple: boolean=false;
    public libelle: string;
    public controlName: string;
    public formulaire: FormGroup;
    public callbackAutocomplete:(search:string,params:Map<string,any>)=>Observable<any[]>;
    public placeholder: string="";
    public items?: any[] = [];
}


export class AdvancedRemoteAutocomplete<T> {
    public nativeNgSelectConfig = new NgSelectConfig();
    public customNgSelectConfig = new CustomNgSelectConfig();
    public tableDescription: RemoteAutocompleteTableMetaData;
    public initialList: any[];
    public listItemSelected: any[];
    public itemSelected: any;
    public filtersId: any[] = [];
    public keyId = "id";
    public fixedItem: any[];
    public callbackAutocomplete:(search:string,params:Map<string,any>)=>Observable<any[]>;
    public mapFunction: ( T)=>T=(value : T):T=>{
           return value;
     };
    public params:Map<string,any>;
    constructor() {

      this.customNgSelectConfig.term = new Subject<string>();
      this.customNgSelectConfig.loading = false;
      this.initialList = [];
      this.params=new Map<string,any>();
    }
     public resetParams(){
      this.params=new Map<string,any>();
     }
     public pushColumn(monTableau: any =  [], titre: string) {
      let monTab = new RemoteAutocompleteTableMetaData( titre);
      for( let col of monTableau) {
        monTab.pushColumn(new RemoteAutocompleteTableColonne(col.name, col.label, (col.type)?col.type: TypeColonne.STRING,  true, ''))
      }
      return monTab;

     }

    public initializeRemoteAutocompletion(
      onDestroy: Subject<void>
    ): void {
      this.customNgSelectConfig.term
        .pipe(
          takeUntil(onDestroy),
          debounceTime(750),
          switchMap((search) => {
            if(this.fixedItem?.length>0) {
              return of(this.fixedItem);
            }else {
              this.customNgSelectConfig.loading = true;

              if(!this.callbackAutocomplete){
                return of([]);
              }

              return this.callbackAutocomplete(search, this.params);
            }

          })
        )
        .subscribe((body) => {
          this.customNgSelectConfig.loading = false;
          let listexisting = this.initialList.map((value) => value[this.keyId]);
          let listResponse = body.filter((value) => listexisting.indexOf(value[this.keyId]));
         //// console.log("listResponse",listResponse)
          let finalList = this.initialList
            .concat(listResponse)
            .filter((value) => this.filtersId.indexOf(value[this.keyId]) < 0);
          // console.log("finalList",finalList)
         //// console.log("filter",this.filtersId)
         let listMapper = finalList.map((value) => this.mapFunction(value));
         //console.log("listMapper",listMapper)
          this.customNgSelectConfig.listRessource$ = of(listMapper);
        });
      this.customNgSelectConfig.term.next("");
    }
  }

