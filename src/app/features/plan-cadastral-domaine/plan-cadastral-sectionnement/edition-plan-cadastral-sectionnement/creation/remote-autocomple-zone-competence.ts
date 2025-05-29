import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { Observable, Subject, of } from "rxjs";
import { takeUntil, debounceTime, switchMap, catchError, map, distinctUntilChanged } from "rxjs/operators";
import {ArrondissementZoneService} from '@sycadApp/services/data-references/territoire/arrondissement-zone.service';


export class RemoteAutocompleteCommuneZoneCompetence<T extends { id: number }> {
    public loading: boolean;
    public listRessource$: Observable<T[]>;
    public term: Subject<string>;
    public initialList: any[];
    public filtersId: any[] = [];
    public keyId = "id";
    public params:Map<string,any>;
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
      datasource: CommunesService
    ): void {
      this.term
        .pipe(
          takeUntil(onDestroy),
          debounceTime(750),
          switchMap((search) => {
            this.loading = true;
            return datasource.autocompletionByZoneCompetences(search, this.params).pipe(
              map(response => {
                this.loading = false;
                return response.body;
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
          this.listRessource$ = of(finalList);
        });
      this.term.next("");
    }
  }



export class RemoteAutocompleteArrondissementZoneCompetence<T extends { id: number }> {
  public loading: boolean;
  public listRessource$: Observable<T[]>;
  public term: Subject<string>;
  public initialList: any[];
  public filtersId: any[] = [];
  public keyId = "id";
  public params:Map<string,any>;
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
    datasource: ArrondissementsService
  ): void {
    this.term
      .pipe(
        takeUntil(onDestroy),
        debounceTime(750),
        switchMap((search) => {

          this.loading = true;
          return datasource.autocompletionByZoneCompetences(search, this.params).pipe(
            map(response => {
              this.loading = false;
              return response.body;
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
        this.listRessource$ = of(finalList);
      });
    this.term.next("");
  }
}


export class RemoteAutocompleteZoneArrondissementCompetence<T extends { id: number }> {
  public loading: boolean;
  public listRessource$: Observable<T[]>;
  public term: Subject<string>;
  public initialList: any[];
  public filtersId: any[] = [];
  public keyId = "id";
  public params:Map<string,any>;
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
    datasource: ArrondissementZoneService
  ): void {
    this.term
      .pipe(
        takeUntil(onDestroy),
        debounceTime(750),
        switchMap((search) => {

          this.loading = true;
          return datasource.autocompletionByZoneCompetences(search, this.params).pipe(
            map(response => {
              this.loading = false;
              return response.body;
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
        this.listRessource$ = of(finalList);
      });
    this.term.next("");
  }
}
