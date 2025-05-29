import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from 'environments/environment';
import {GenericDatasource} from "@sycadApp/models/generic-datasource";
import {
  SituationMatrimonialeAutocomplete,
  SituationMatrimonialenItem, SituationMatrimonialeElement
} from "@sycadApp/models/data-references/contribuables/global.model";
import { Observable, tap } from 'rxjs';
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';

@Injectable()
export class SituationMatrimonialeService extends GenericDatasource<SituationMatrimonialeElement,SituationMatrimonialenItem,SituationMatrimonialeAutocomplete> {

    constructor(public http: HttpClient) {
      super(http)
    }
    getUrl(): string {
        return environment.USERS.SITUATIONMATRIMONIALE_API;
    }

    public autocompletionPublic(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<SituationMatrimonialeAutocomplete[]>> {
    let params = new HttpParams()
      .set(this.mapping.limitName, "12")
      .set(this.mapping.searchName, search);
    if(otherParams) {
      otherParams.forEach((value: string, key: any) => {
        params=params.set(key,value);
      });
    }
      return this.http.get<SituationMatrimonialeAutocomplete[]>(environment.PUBLIC.SITUATIONMATRIMONIALE_PUBLIC_API + "/autocomplete", {
      observe: "response",
      params,
    }).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }
}


