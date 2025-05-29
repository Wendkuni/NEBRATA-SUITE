import { Observable, Subject, of } from "rxjs";
import { takeUntil, debounceTime, switchMap, distinctUntilChanged } from "rxjs/operators";
import { GenericDatasourceMock } from "@sycadApp/models/generic-datasource.mock";
import { GenericDatasource } from "@sycadApp/models/generic-datasource";
import {IndivisionsService} from '@sycadApp/services/data-references/contribuables/indivisions.service';


export class RemoteAutocompleteIndivisionMemebrable{
  public loading: boolean;
  public listRessource$: Observable<any[]>;
  public term: Subject<string>;
  public initialList: any[];
  public filtersId: any[] = [];
  public keyId = "guid";
  constructor() {
    this.term = new Subject<string>();
    this.loading = false;
    this.initialList = [];
  }

  public initializeRemoteAutocompletion(
    onDestroy: Subject<void>,
    datasource: IndivisionsService
  ): void {
    this.term
      .pipe(
        takeUntil(onDestroy),
        debounceTime(750),
        switchMap((search) => {
          return datasource.searchMmebreIndivision(search);
        })
      )
      .subscribe((response) => {
        let listexisting = this.initialList.map((value) => value[this.keyId]);
        //console.log("initialList", listexisting);
        let listResponse = response.body.filter((value) => listexisting.indexOf(value[this.keyId]));
        //console.log("listResponse", listResponse);
        //// console.log("this.filtersId",this.filtersId)
        let finalList = this.initialList
          .concat(listResponse)
          .filter((value) => this.filtersId.indexOf(value[this.keyId]) < 0);
       // // console.log("finalList",finalList)
        this.listRessource$ = of(finalList);
        this.loading = false;
      });
    this.term.next("");
  }

  //filterResource() {
}
