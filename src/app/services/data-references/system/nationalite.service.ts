import { Injectable } from '@angular/core';
import {GenericDatasource} from "@sycadApp/models/generic-datasource";
import {Nationalite} from "@sycadApp/models/data-references/contribuables/global.model";
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import { environment } from 'environments/environment';
import { Observable, tap } from 'rxjs';
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';

@Injectable()
export class NationaliteService extends GenericDatasource <Nationalite, Nationalite, Nationalite> {

  constructor(public http: HttpClient) {
    super(http)
  }
  getUrl(): string {
    return environment.USERS.NATIONALITE_API;
  }

  public autocompletionPublic(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<Nationalite[]>> {
  let params = new HttpParams()
    .set(this.mapping.limitName, "12")
    .set(this.mapping.searchName, search);
  if(otherParams) {
    otherParams.forEach((value: string, key: any) => {
      params=params.set(key,value);
    });
  }
    return this.http.get<Nationalite[]>(environment.PUBLIC.NATIONALITE_PUBLIC_API + "/autocomplete", {
    observe: "response",
    params,
  }).pipe(
    tap((element) => {
      GlobalDateConverter.convertToDate(element,this.getDateFields());
    })
  );
}
}

