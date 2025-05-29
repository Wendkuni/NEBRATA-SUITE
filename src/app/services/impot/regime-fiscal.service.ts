import { Injectable } from '@angular/core';
import {GenericDatasource} from "@sycadApp/models/generic-datasource";
import {RegimeFiscal} from "@sycadApp/models/data-references/contribuables/global.model";
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import { Observable, tap } from 'rxjs';
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';

@Injectable()
export class RegimeFiscalService extends GenericDatasource<RegimeFiscal, RegimeFiscal, RegimeFiscal> {

  constructor(public http: HttpClient) {
    super(http)
  }
  getUrl(): string {
    return environment.USERS.REGIME_FISCAL_API;
  }

  public autocompletionPublic(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<RegimeFiscal[]>> {
  let params = new HttpParams()
    .set(this.mapping.limitName, "12")
    .set(this.mapping.searchName, search);
  if(otherParams) {
    otherParams.forEach((value: string, key: any) => {
      params=params.set(key,value);
    });
  }
    return this.http.get<RegimeFiscal[]>(environment.PUBLIC.REGIME_FISCAL_PUBLIC_API + "/autocomplete", {
    observe: "response",
    params,
  }).pipe(
    tap((element) => {
      GlobalDateConverter.convertToDate(element,this.getDateFields());
    })
  );
}
}

