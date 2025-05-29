

import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {GenericDatasourceMock} from '@sycadApp/models/generic-datasource.mock';
import {
  catchError,
  debounceTime, distinctUntilChanged, finalize, map,
  switchMap,
  takeUntil
} from 'rxjs/operators';
import {
  BehaviorSubject,
  Observable,
  of,
  Subject, tap
} from 'rxjs';
import { NgSelectComponent } from '@ng-select/ng-select';


export class RemoteAutocomplete<T> {
  public loading: boolean;
  public listRessource$: Observable<T[]>;
  public term: Subject<string>;
  public initialList: any[];
  public filtersId: any[] = [];
  public init:boolean=false;
  public keyId = "id";
  public fixedItem: any[];
  public params:Map<string,any>;
  public mapFunction: ( T)=>T=(value : T):T=>{
    return value;
};
  constructor() {
    this.term = new Subject<string>();
    this.loading = false;
    this.initialList = [];
    this.params=new Map<string,any>();
  }
   public resetParams(){
    this.params=new Map<string,any>();
   }
  public initializeRemoteAutocompletion(
    onDestroy: Subject<void>,
    datasource: GenericDatasourceMock<any> | GenericDatasource<any, any, any>
  ): void {
    this.init=true;
    this.term
      .pipe(
        takeUntil(onDestroy),
        debounceTime(750),
        switchMap((search) => {

          if(search==null){
            return this.listRessource$;
          }

          if(this.fixedItem?.length>0) {
            return of(this.fixedItem);
          }else {
            this.loading=true;

            return datasource.autocompletion(search, this.params).pipe(
              map(response => {
                this.loading = false;
                return response.body;
              }),
              catchError((err) => {
                this.loading = false;
                 return of([]);
               })
            );
          }

        })
      )
      .subscribe((body) => {
       //// console.log('filtre filtersId',this.filtersId)
        let listexisting = this.initialList.map((value) => value[this.keyId]);
        let listResponse = body.filter((value) => listexisting.indexOf(value[this.keyId])<0);
        let finalList = this.initialList
          .concat(listResponse)
          .filter((value) => this.filtersId.indexOf(value[this.keyId]) < 0);
         this.listRessource$ =    of(finalList.map((value) => this.mapFunction(value)));

      });
    this.term.next("");
  }
}




export class FilterContextategoriePiece {
  term:string;
  type:string;
  constructor(term:string,type:string) {
 this.term=term;
 this.type=type;
  }
}

export class RemoteAutocompleteCategoriePiece{
  public loading: boolean;
  public listRessource$: Observable<any[]>;
  public term: Subject<FilterContextategoriePiece>;
  public initialList: any[];
  public filtersId: any[] = [];
  public keyId = "id";
  public mapFunction: ( FilterContextategoriePiece)=>FilterContextategoriePiece=(value :FilterContextategoriePiece):FilterContextategoriePiece=>{
    return value;
};
  constructor() {
    this.term = new Subject<FilterContextategoriePiece>();
    this.loading = false;
    this.initialList = [];
  }

  public initializeRemoteAutocompletion(
    onDestroy: Subject<void>,
    datasource: CategoriePieceService,
    isIdentite: boolean = false,
    apiPublic: boolean = false
  ): void {
    this.term
      .pipe(
        takeUntil(onDestroy),
        debounceTime(750),
        switchMap((search) => {

          if(search==null){
            return this.listRessource$;
          }

          return datasource.autocompletionWithFilter(search.term, search.type, isIdentite).pipe(
            map(response => {
              let autoCompleteList = response.body;
              if(apiPublic){
                let initialList = new Array;
                const accepted = ["01", "03", "04"];
                autoCompleteList.forEach(element => {
                  if(accepted.includes(element.code)){
                    initialList.push(element);
                  }
                });
                autoCompleteList = initialList;
              }
              this.loading = false;
              return autoCompleteList;
            }),
            catchError((err) => {
              this.loading = false;
               return of([]);
             })
          );
        })
      )
      .subscribe((body) => {
        let listexisting = this.initialList.map((value) => value[this.keyId]);
        let listResponse = body.filter((value) => listexisting.indexOf(value[this.keyId]));
        let finalList = this.initialList
          .concat(listResponse)
          .filter((value) => this.filtersId.indexOf(value[this.keyId]) < 0);
        this.listRessource$ =  of(finalList.map((value) => this.mapFunction(value)));
        this.loading = false;
      });
  }

}











export class RemoteAutocompleteExtend<T> {
  public loading: boolean;
  public listRessource$: Observable<T[]>;
  public term: Subject<string>;
  public initialList: any[];
  public filtersId: any[] = [];
  public init:boolean=false;
  public runSearchOnInit:Boolean;
  public keyId = "id";
  public fixedItem: any[];
  public params:Map<string,any>;
  public callbackAutocomplete:(search:string,params:Map<string,any>)=>Observable<any[]>;
  public mapFunction: ( T)=>T=(value : T):T=>{
    return value;
};
  constructor() {
    this.term = new Subject<string>();
    this.loading = false;
    this.initialList = [];
    this.params=new Map<string,any>();
  }
   public resetParams(){
    this.params=new Map<string,any>();
   }
  public initializeRemoteAutocompletion(
    onDestroy: Subject<void>, runSearchOnInit:Boolean=true
  ): void {
    this.init=true;
    this.runSearchOnInit=runSearchOnInit
    this.term
    .pipe(
      takeUntil(onDestroy),
      debounceTime(750),
      switchMap((search) => {

        if(search==null){
          return this.listRessource$;
        }
        if(this.fixedItem?.length>0) {
          return of(this.fixedItem);
        }else {
          this.loading = true;

          if(!this.callbackAutocomplete){
            return of([]);
          }

          return this.callbackAutocomplete(search, this.params);
        }

      })
    )
      .subscribe((body) => {
        this.loading = false;
       //// console.log('filtre filtersId',this.filtersId)
        let listexisting = this.initialList.map((value) => value[this.keyId]);
        let listResponse = body.filter((value) => listexisting.indexOf(value[this.keyId])<0);
        let finalList = this.initialList
          .concat(listResponse)
          .filter((value) => this.filtersId.indexOf(value[this.keyId]) < 0);
         this.listRessource$ =    of(finalList.map((value) => this.mapFunction(value)));
      });
      if(this.runSearchOnInit){
        this.term.next("");
      }

  }
}
export class RemoteAutocompleteExtendBehavior<T> {
  public loading: boolean;
  public listRessource$: BehaviorSubject<T[]>; // Utilisation de BehaviorSubject
  public term: Subject<string>;
  public initialList: any[];
  public filtersId: any[] = [];
  public init: boolean = false;
  public runSearchOnInit: boolean;
  public keyId = "id";
  public fixedItem: any[];
  public params: Map<string, any>;
  public callbackAutocomplete: (search: string, params: Map<string, any>) => Observable<any[]>;
  public mapFunction: (value: T) => T = (value: T): T => value;

  constructor() {
    this.term = new Subject<string>();
    this.listRessource$ = new BehaviorSubject<T[]>([]); // Initialisation avec un tableau vide
    this.loading = false;
    this.initialList = [];
    this.params = new Map<string, any>();
  }

  public resetParams() {
    this.params = new Map<string, any>();
  }

  public initializeRemoteAutocompletion(
    onDestroy: Subject<void>,
    runSearchOnInit: boolean = true
  ): void {
    this.init = true;
    this.runSearchOnInit = runSearchOnInit;

    this.term
      .pipe(
        takeUntil(onDestroy),
        debounceTime(750),
        switchMap((search) => {
          if (search == null) {
            this.loading = false;
            return of(this.listRessource$.getValue()); // Retourne la liste existante
          }

          if (this.fixedItem?.length > 0) {
            this.loading = false;
            return of(this.fixedItem); // Retourne les éléments fixes
          }

          this.loading = true;

          if (!this.callbackAutocomplete) {
            this.loading = false;
            return of([]); // Si aucun callback, retourne une liste vide
          }

          return this.callbackAutocomplete(search, this.params).pipe(
            catchError((error) => {
              console.error("Erreur lors de l'autocomplétion :", error);
              return of([]); // Retourne une liste vide en cas d'erreur
            })
          );
        }),
        tap(() => (this.loading = false)) // Garantir que `loading` est désactivé après chaque émission
      )
      .subscribe((body) => {
        // Traitement des résultats
        const existingIds = this.initialList.map((value) => value[this.keyId]);
        const newItems = body.filter((value) => existingIds.indexOf(value[this.keyId]) < 0);
        const finalList = this.initialList
          .concat(newItems)
          .filter((value) => this.filtersId.indexOf(value[this.keyId]) < 0);

        // Mise à jour du BehaviorSubject
        this.listRessource$.next(finalList.map((value) => this.mapFunction(value)));
      });

    // Déclenche une recherche initiale si configuré
    if (this.runSearchOnInit) {
      this.term.next("");
    }
  }
}

