import { Injectable } from '@angular/core';
import {GenericDatasource} from "@sycadApp/models/generic-datasource";
import {SecteurActivitePrincipale} from "@sycadApp/models/data-references/contribuables/global.model";
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import { environment } from 'environments/environment';
import { Observable, tap } from 'rxjs';
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';

@Injectable()
export class SecteurActiviteService extends GenericDatasource<SecteurActivitePrincipale, SecteurActivitePrincipale, SecteurActivitePrincipale>{

  constructor(public http: HttpClient) {
    super(http)
  }
  getUrl(): string {
    return environment.USERS.SECTEUR_ACTIVITE_API;
  }

  public autocompletionPublic(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<SecteurActivitePrincipale[]>> {
  let params = new HttpParams()
    .set(this.mapping.limitName, "12")
    .set(this.mapping.searchName, search);
  if(otherParams) {
    otherParams.forEach((value: string, key: any) => {
      params=params.set(key,value);
    });
  }
    return this.http.get<SecteurActivitePrincipale[]>(environment.PUBLIC.SECTEUR_ACTIVITE_PUBLIC_API + "/autocomplete", {
    observe: "response",
    params,
  }).pipe(
    tap((element) => {
      GlobalDateConverter.convertToDate(element,this.getDateFields());
    })
  );
}
}

