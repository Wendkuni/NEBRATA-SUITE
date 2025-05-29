import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {ArrondissementZone} from '@sycadApp/models/data-references/territoire/arrondissement-zone.model';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import { environment } from 'environments/environment';
import {ArrondissementAutocomplete} from '@sycadApp/models/data-references/territoire/arrondissement.model';
import {tap} from 'rxjs/operators';
import {GlobalDateConverter} from '@sycadShared/global-date-converter';
import { Observable, of } from 'rxjs';


@Injectable()
export class ArrondissementZoneService extends GenericDatasource<ArrondissementZone, ArrondissementZone, ArrondissementZone> {

  constructor(public http: HttpClient) {super(http); }
  getUrl(): string {
    return environment.CONFIGURATION.ARRONDISSEMENT_ZONE_API;
  }

  public autocompletionByZoneCompetences(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<ArrondissementZone[]>> {
    let params = new HttpParams()
      .set(this.mapping.limitName, "12")
      .set(this.mapping.searchName, search);
    otherParams.forEach((value: string, key: any) => {
      params=params.set(key,value);
    });

    let arrondissement = otherParams.get("arrondissement");
    if(!arrondissement){
      params=params.set("arrondissement",0);
    }

    return this.http.get<ArrondissementZone[]>(this.getUrl() + "/autocomplete-by-arrondissement", {
      observe: "response",
      params,
    }).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }
}
