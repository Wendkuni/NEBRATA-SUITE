import { Injectable } from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';

import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {environment} from 'environments/environment';
import {Quartier} from '@sycadApp/models/data-references/territoire/quartier.model';
import { Observable, tap } from 'rxjs';
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';

@Injectable()
export class QuartierService extends GenericDatasource<Quartier, Quartier, Quartier>{

  constructor(public http: HttpClient) {super(http); }
  getUrl(): string {
    return environment.CONFIGURATION.QUARTIER_API;
  }

  public autocompletionByCommune(search: string, communeId: number, otherParams: Map<string,any>=null): Observable<HttpResponse<Quartier[]>> {
    let params = new HttpParams()
      .set(this.mapping.limitName, "12")
      .set("commune", communeId)
      .set(this.mapping.searchName, search);
    if(otherParams) {
      otherParams.forEach((value: string, key: any) => {
        params=params.set(key,value);
      });
    }
      return this.http.get<Quartier[]>(this.getUrl() + "/autocomplete-by-commune", {
      observe: "response",
      params,
    }).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }

  public autocompletionByCommunePublic(search: string, communeId: number, otherParams: Map<string,any>=null): Observable<HttpResponse<Quartier[]>> {
    let params = new HttpParams()
      .set(this.mapping.limitName, "12")
      .set("commune", communeId)
      .set(this.mapping.searchName, search);
    if(otherParams) {
      otherParams.forEach((value: string, key: any) => {
        params=params.set(key,value);
      });
    }
      return this.http.get<Quartier[]>(environment.PUBLIC.QUARTIER_PUBLIC_API + "/autocomplete-by-commune", {
      observe: "response",
      params,
    }).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }
}
